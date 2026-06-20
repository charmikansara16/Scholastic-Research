import os
import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from .database import get_db, Base, engine
from .models import Scholarship
from .schemas import MatchRequest, MatchResponse, StudentProfile
from .seed import seed_if_empty
from .matching import pre_filter_scholarships, run_ai_matching

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simple IP-based Rate Limiter for hackathon (limits to 15 req/min per IP)
IP_REQUESTS = {}
RATE_LIMIT_LIMIT = int(os.getenv("RATE_LIMIT_PER_MINUTE", 15))
RATE_LIMIT_WINDOW = 60 # seconds

def check_rate_limit(ip: str):
    now = time.time()
    if ip not in IP_REQUESTS:
        IP_REQUESTS[ip] = []
    
    # Filter out requests older than the window
    IP_REQUESTS[ip] = [t for t in IP_REQUESTS[ip] if now - t < RATE_LIMIT_WINDOW]
    
    if len(IP_REQUESTS[ip]) >= RATE_LIMIT_LIMIT:
        return False
    
    IP_REQUESTS[ip].append(now)
    return True

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    logger.info("Initializing database and seeding data...")
    seed_if_empty()
    logger.info("Startup sequence complete.")
    yield
    # Shutdown sequence (nothing to clean up for SQLite)

app = FastAPI(
    title="ScholarAI API",
    description="Backend API for ScholarAI - India Scholarship Discovery Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configurations
origins = [
    "http://localhost:5173", # Vite local dev
    "http://127.0.0.1:5173",
    "https://scholarai.vercel.app", # production frontends
]
# Add whatever origins are in environment variables
cors_origins_env = os.getenv("CORS_ORIGINS")
if cors_origins_env:
    origins.extend([o.strip() for o in cors_origins_env.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiter Middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    
    # Bypass health checks
    if request.url.path == "/health":
        return await call_next(request)
        
    if not check_rate_limit(client_ip):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "error": "rate_limit_exceeded",
                "message": "Too many requests. Please try again after a minute.",
                "retry": True
            }
        )
    return await call_next(request)

# Custom Exception Handlers for clean responses
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # Format error message nicely
    msg = "Validation failed: " + "; ".join([f"'{'.'.join(str(l) for l in err['loc'][1:])}': {err['msg']}" for err in errors])
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "validation_error",
            "message": msg,
            "detail": errors
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled server exception occurred")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "internal_error",
            "message": "Something went wrong on our end. Please try again later."
        }
    )

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Check database connection
        db.execute(Base.metadata.tables["scholarships"].select().limit(1))
        db_status = "connected"
    except Exception as e:
        logger.error(f"Health check DB error: {e}")
        db_status = "disconnected"

    # Check AI availability
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    gemini_key = os.getenv("GOOGLE_API_KEY")
    ai_status = "unavailable"
    if (anthropic_key and not anthropic_key.startswith("your_")) or (gemini_key and not gemini_key.startswith("your_")):
        ai_status = "available"

    return {
        "status": "healthy",
        "version": "1.0.0",
        "db": db_status,
        "ai": ai_status
    }

@app.post("/api/v1/match", response_model=MatchResponse)
def match_scholarships(req: MatchRequest, db: Session = Depends(get_db)):
    # 1. Pre-filter scholarships based on request params
    candidates, percentage = pre_filter_scholarships(db, req)
    
    # 2. Setup response profile
    profile = StudentProfile(
        category=req.category,
        income_bracket=req.income_bracket,
        state=req.state,
        edu_level=req.edu_level,
        score_percentage=round(percentage, 1)
    )

    if not candidates:
        return MatchResponse(
            status="no_results",
            count=0,
            student_profile=profile,
            scholarships=[],
            message="No matching scholarships found for your current profile. We recommend checking the National Scholarship Portal directly at scholarships.gov.in, which may have additional state-specific schemes.",
            fallback_url="https://scholarships.gov.in",
            data_freshness="2026-06-20"
        )

    # 3. Run matching engine (Claude with Gemini fallback, then deterministic fallback)
    matched_results, matched_by = run_ai_matching(req, candidates, percentage)
    logger.info(f"Matched {len(matched_results)} scholarships using matching engine: {matched_by}")

    if not matched_results:
        return MatchResponse(
            status="no_results",
            count=0,
            student_profile=profile,
            scholarships=[],
            message="No matching scholarships found for your current profile. We recommend checking the National Scholarship Portal directly at scholarships.gov.in, which may have additional state-specific schemes.",
            fallback_url="https://scholarships.gov.in",
            data_freshness="2026-06-20"
        )

    return MatchResponse(
        status="success",
        count=len(matched_results),
        student_profile=profile,
        scholarships=matched_results,
        data_freshness="2026-06-20"
    )

@app.get("/api/v1/scholarships")
def get_all_scholarships(db: Session = Depends(get_db)):
    scholarships = db.query(Scholarship).all()
    # Format dates and JSON fields for simple display
    formatted = []
    for s in scholarships:
        import json
        cats = s.category_eligibility
        if isinstance(cats, str):
            cats = json.loads(cats)
        states = s.states_eligible
        if isinstance(states, str):
            states = json.loads(states)
        levels = s.edu_levels_eligible
        if isinstance(levels, str):
            levels = json.loads(levels)
        docs = s.documents_required
        if isinstance(docs, str):
            docs = json.loads(docs)
            
        formatted.append({
            "id": s.id,
            "name": s.name,
            "authority": s.authority,
            "source_type": s.source_type,
            "category_eligibility": cats,
            "income_max_lakh": s.income_max_lakh,
            "states_eligible": states,
            "edu_levels_eligible": levels,
            "min_percentage": s.min_percentage,
            "amount_min": s.amount_min,
            "amount_max": s.amount_max,
            "deadline": s.deadline,
            "documents_required": docs,
            "apply_url": s.apply_url,
            "description": s.description,
            "is_active": s.is_active,
            "last_verified": s.last_verified
        })
    return {
        "count": len(formatted),
        "scholarships": formatted
    }
