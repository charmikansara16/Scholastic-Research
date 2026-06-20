import os
import json
from sqlalchemy.orm import Session
from .database import engine, SessionLocal, Base
from .models import Scholarship

def seed_scholarships(db: Session):
    # Load JSON seed data
    json_path = os.path.join(os.path.dirname(__file__), "scholarships_seed.json")
    if not os.path.exists(json_path):
        print(f"Seed file not found at {json_path}")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Insert items if they do not exist
    count = 0
    for item in data:
        # Check if already exists
        existing = db.query(Scholarship).filter(Scholarship.id == item["id"]).first()
        if not existing:
            scholarship = Scholarship(
                id=item["id"],
                name=item["name"],
                authority=item["authority"],
                source_type=item["source_type"],
                category_eligibility=item["category_eligibility"],
                income_max_lakh=float(item["income_max_lakh"]),
                states_eligible=item["states_eligible"],
                edu_levels_eligible=item["edu_levels_eligible"],
                min_percentage=float(item["min_percentage"]),
                amount_min=item.get("amount_min"),
                amount_max=item["amount_max"],
                deadline=item.get("deadline"),
                documents_required=item["documents_required"],
                apply_url=item["apply_url"],
                description=item.get("description"),
                is_active=item.get("is_active", True),
                last_verified=item["last_verified"]
            )
            db.add(scholarship)
            count += 1
    
    if count > 0:
        db.commit()
        print(f"Successfully seeded {count} scholarships into the database.")
    else:
        print("Database already seeded. No changes made.")

def seed_if_empty():
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if table is empty
        total = db.query(Scholarship).count()
        if total == 0:
            print("Database is empty. Seeding...")
            seed_scholarships(db)
        else:
            print(f"Database contains {total} scholarships. Skipping seed.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_if_empty()
