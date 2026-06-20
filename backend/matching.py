import os
import json
import logging
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from .models import Scholarship
from .schemas import MatchRequest, ScholarshipResponseSchema

logger = logging.getLogger(__name__)

# Map income brackets to upper bound in Lakhs
INCOME_BRACKET_MAP = {
    "<1L": 1.0,
    "1-2.5L": 2.5,
    "2.5-4.5L": 4.5,
    "4.5-6L": 6.0,
    "6-8L": 8.0,
    ">8L": 999.0
}

SYSTEM_PROMPT = """You are ScholarAI's eligibility engine. Your job is to evaluate a student's profile against a list of candidate scholarships and return only those the student is genuinely eligible for, ranked by value.

RULES:
1. ONLY return scholarship IDs from the provided candidate list. Never invent new scholarships.
2. Apply ALL eligibility criteria strictly — category, income, state, education level, and minimum percentage.
3. Rank results by amount_max descending (highest value first).
4. For each eligible scholarship, write a one-sentence "eligibility_reason" in plain English explaining why this student qualifies.
5. Return ONLY valid JSON. No preamble, no explanation outside the JSON.

OUTPUT FORMAT:
{
  "matched_ids": ["central-001", "gujarat-002"],
  "reasons": {
    "central-001": "Your OBC category and ₹2.5–4.5L income meet all requirements for this Central sector scheme.",
    "gujarat-002": "As a Gujarat-domicile OBC student pursuing UG, you meet the state-specific eligibility criteria."
  }
}"""

def pre_filter_scholarships(db: Session, req: MatchRequest) -> Tuple[List[Scholarship], float]:
    # Calculate percentage
    if req.score_type == "cgpa":
        student_percentage = req.score * 9.5
    else:
        student_percentage = req.score

    student_income_lakh = INCOME_BRACKET_MAP.get(req.income_bracket, 999.0)

    # Core filters in SQL
    query = db.query(Scholarship).filter(
        Scholarship.is_active == True,
        Scholarship.income_max_lakh >= student_income_lakh,
        Scholarship.min_percentage <= student_percentage
    )

    all_active = query.all()
    candidates = []

    # Strict list checks in Python for SQLite compatibility
    for s in all_active:
        # Category check
        # PWD gets disability specific scholarships plus any general/all scholarships
        categories = s.category_eligibility
        if isinstance(categories, str):
            categories = json.loads(categories)
        
        cat_ok = "ALL" in categories or req.category in categories

        # State check
        states = s.states_eligible
        if isinstance(states, str):
            states = json.loads(states)
        state_ok = "ALL" in states or req.state in states

        # Education level check
        edu_levels = s.edu_levels_eligible
        if isinstance(edu_levels, str):
            edu_levels = json.loads(edu_levels)
        edu_ok = req.edu_level in edu_levels

        if cat_ok and state_ok and edu_ok:
            candidates.append(s)

    return candidates, student_percentage

def match_with_claude(api_key: str, student_profile: Dict[str, Any], candidates_json: List[Dict[str, Any]]) -> Dict[str, Any]:
    import anthropic
    client = anthropic.Anthropic(api_key=api_key)
    
    user_prompt = f"""STUDENT PROFILE:
- Category: {student_profile['category']}
- Annual Family Income Bracket: {student_profile['income_bracket']}
- State: {student_profile['state']}
- Education Level: {student_profile['edu_level']}
- Academic Score: {student_profile['score_percentage']}% (converted from {student_profile['score_type']})

CANDIDATE SCHOLARSHIPS (pre-filtered from database):
{json.dumps(candidates_json, indent=2)}

Evaluate and return matching scholarship IDs with eligibility reasons."""

    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1000,
        temperature=0.0,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": user_prompt}
        ]
    )
    
    text = response.content[0].text.strip()
    # Strip any extra text just in case
    if "{" in text and "}" in text:
        text = text[text.find("{"):text.rfind("}")+1]
    return json.loads(text)

def match_with_gemini(api_key: str, student_profile: Dict[str, Any], candidates_json: List[Dict[str, Any]]) -> Dict[str, Any]:
    import google.generativeai as genai
    genai.configure(api_key=api_key)
    
    user_prompt = f"""STUDENT PROFILE:
- Category: {student_profile['category']}
- Annual Family Income Bracket: {student_profile['income_bracket']}
- State: {student_profile['state']}
- Education Level: {student_profile['edu_level']}
- Academic Score: {student_profile['score_percentage']}% (converted from {student_profile['score_type']})

CANDIDATE SCHOLARSHIPS (pre-filtered from database):
{json.dumps(candidates_json, indent=2)}

Evaluate and return matching scholarship IDs with eligibility reasons."""

    model_name = os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash")
    model = genai.GenerativeModel(
        model_name=model_name,
        generation_config={
            "temperature": 0.0,
            "response_mime_type": "application/json"
        },
        system_instruction=SYSTEM_PROMPT
    )
    
    response = model.generate_content(user_prompt)
    text = response.text.strip()
    return json.loads(text)

def run_ai_matching(req: MatchRequest, candidates: List[Scholarship], score_percentage: float) -> Tuple[List[Dict[str, Any]], str]:
    if not candidates:
        return [], "no_candidates"

    # Prepare data for LLM
    candidates_json = []
    candidates_by_id = {}
    for c in candidates:
        docs = c.documents_required
        if isinstance(docs, str):
            docs = json.loads(docs)
        
        c_dict = {
            "id": c.id,
            "name": c.name,
            "authority": c.authority,
            "source_type": c.source_type,
            "income_max_lakh": c.income_max_lakh,
            "min_percentage": c.min_percentage,
            "amount_max": c.amount_max,
            "description": c.description
        }
        candidates_json.append(c_dict)
        candidates_by_id[c.id] = c

    student_profile = {
        "category": req.category,
        "income_bracket": req.income_bracket,
        "state": req.state,
        "edu_level": req.edu_level,
        "score_percentage": score_percentage,
        "score_type": req.score_type
    }

    # API Keys
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    gemini_key = os.getenv("GOOGLE_API_KEY")

    ai_matched = None
    provider = "none"

    # Try Claude
    if anthropic_key and not anthropic_key.startswith("your_"):
        try:
            logger.info("Attempting matching with Anthropic Claude...")
            ai_matched = match_with_claude(anthropic_key, student_profile, candidates_json)
            provider = "Claude"
        except Exception as e:
            logger.error(f"Claude API failed: {e}")

    # Fallback to Gemini if Claude fails or isn't configured
    if not ai_matched and gemini_key and not gemini_key.startswith("your_"):
        try:
            logger.info("Attempting matching with Google Gemini...")
            ai_matched = match_with_gemini(gemini_key, student_profile, candidates_json)
            provider = "Gemini"
        except Exception as e:
            logger.error(f"Gemini API failed: {e}")

    # Process results if we got a response from LLM
    if ai_matched and "matched_ids" in ai_matched:
        matched_ids = ai_matched["matched_ids"]
        reasons = ai_matched.get("reasons", {})
        
        results = []
        rank = 1
        for m_id in matched_ids:
            # Hallucination Filter: ensure the ID was in our candidates list
            if m_id in candidates_by_id:
                c = candidates_by_id[m_id]
                docs = c.documents_required
                if isinstance(docs, str):
                    docs = json.loads(docs)
                
                # Format response
                reason = reasons.get(m_id, f"You qualify under {c.source_type} guidelines for {c.name}.")
                
                results.append({
                    "id": c.id,
                    "name": c.name,
                    "authority": c.authority,
                    "source_type": c.source_type,
                    "amount_min": c.amount_min,
                    "amount_max": c.amount_max,
                    "amount_display": f"₹{c.amount_min:,} – ₹{c.amount_max:,} per year" if c.amount_min else f"₹{c.amount_max:,} per year",
                    "deadline": c.deadline,
                    "deadline_display": format_deadline(c.deadline),
                    "deadline_urgent": is_deadline_urgent(c.deadline),
                    "documents_required": docs,
                    "apply_url": c.apply_url,
                    "eligibility_reason": reason,
                    "rank": rank
                })
                rank += 1
        return results, provider

    # Deterministic Fallback if AI is missing / fails
    logger.info("Falling back to deterministic matching.")
    results = []
    # Sort candidates by amount_max descending
    sorted_candidates = sorted(candidates, key=lambda x: x.amount_max, reverse=True)
    rank = 1
    for c in sorted_candidates:
        docs = c.documents_required
        if isinstance(docs, str):
            docs = json.loads(docs)
        
        reason = f"You meet the requirements for {c.name} (Income limit: ₹{c.income_max_lakh}L, Min score: {c.min_percentage}%)."
        
        results.append({
            "id": c.id,
            "name": c.name,
            "authority": c.authority,
            "source_type": c.source_type,
            "amount_min": c.amount_min,
            "amount_max": c.amount_max,
            "amount_display": f"₹{c.amount_min:,} – ₹{c.amount_max:,} per year" if c.amount_min else f"₹{c.amount_max:,} per year",
            "deadline": c.deadline,
            "deadline_display": format_deadline(c.deadline),
            "deadline_urgent": is_deadline_urgent(c.deadline),
            "documents_required": docs,
            "apply_url": c.apply_url,
            "eligibility_reason": reason,
            "rank": rank
        })
        rank += 1
    return results, "Deterministic (Fallback)"

def format_deadline(deadline_str: Optional[str]) -> str:
    if not deadline_str:
        return "No fixed deadline / Rolling"
    try:
        from datetime import datetime
        dt = datetime.strptime(deadline_str, "%Y-%m-%d")
        return dt.strftime("%d-%b-%Y")
    except Exception:
        return deadline_str

def is_deadline_urgent(deadline_str: Optional[str]) -> bool:
    if not deadline_str:
        return False
    try:
        from datetime import datetime, date
        dt = datetime.strptime(deadline_str, "%Y-%m-%d").date()
        days_left = (dt - date.today()).days
        return 0 <= days_left <= 30
    except Exception:
        return False
