from sqlalchemy import Column, String, Float, Integer, Date, Boolean, JSON, DateTime, func
from .database import Base

class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(String(50), primary_key=True)
    name = Column(String(500), nullable=False)
    authority = Column(String(300), nullable=False)
    source_type = Column(String(50), nullable=False) # 'Central Government' | 'State Government' | 'NGO' | 'CSR'
    
    # Eligibility Filters (used in SQL pre-filter)
    category_eligibility = Column(JSON, nullable=False) # List of strings e.g. ["SC", "ST"] or ["ALL"]
    income_max_lakh = Column(Float, nullable=False) # Maximum household income (in Lakhs) e.g. 4.5
    states_eligible = Column(JSON, nullable=False) # List of states e.g. ["Gujarat"] or ["ALL"]
    edu_levels_eligible = Column(JSON, nullable=False) # List of levels e.g. ["UG", "PG"]
    min_percentage = Column(Float, nullable=False, default=0.0) # Minimum academic percentage
    
    # Display Fields
    amount_min = Column(Integer, nullable=True) # Optional minimum amount
    amount_max = Column(Integer, nullable=False) # Maximum or exact amount
    deadline = Column(String(50), nullable=True) # Stored as string YYYY-MM-DD or None for ongoing
    documents_required = Column(JSON, nullable=False) # List of required documents (strings)
    apply_url = Column(String(500), nullable=False)
    description = Column(String, nullable=True)
    
    # Metadata
    is_active = Column(Boolean, nullable=False, default=True)
    last_verified = Column(String(50), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
