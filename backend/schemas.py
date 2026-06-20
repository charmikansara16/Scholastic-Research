from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any

class MatchRequest(BaseModel):
    category: str
    income_bracket: str
    state: str
    edu_level: str
    score: float
    score_type: str

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        valid_categories = ["General", "SC", "ST", "OBC", "EWS", "Minority", "PWD"]
        if v not in valid_categories:
            raise ValueError(f"Category must be one of {valid_categories}")
        return v

    @field_validator("income_bracket")
    @classmethod
    def validate_income(cls, v: str) -> str:
        valid_brackets = ["<1L", "1-2.5L", "2.5-4.5L", "4.5-6L", "6-8L", ">8L"]
        if v not in valid_brackets:
            raise ValueError(f"Income bracket must be one of {valid_brackets}")
        return v

    @field_validator("edu_level")
    @classmethod
    def validate_edu_level(cls, v: str) -> str:
        valid_levels = ["Pre-Matric", "Post-Matric", "Diploma", "UG", "PG", "PhD"]
        if v not in valid_levels:
            raise ValueError(f"Education level must be one of {valid_levels}")
        return v

    @field_validator("score_type")
    @classmethod
    def validate_score_type(cls, v: str) -> str:
        valid_types = ["percentage", "cgpa"]
        if v not in valid_types:
            raise ValueError("Score type must be 'percentage' or 'cgpa'")
        return v

    @field_validator("score")
    @classmethod
    def validate_score_range(cls, v: float, info: Any) -> float:
        score_type = info.data.get("score_type") if hasattr(info, "data") else None
        if score_type == "cgpa":
            if not (0.0 <= v <= 10.0):
                raise ValueError("CGPA must be between 0.0 and 10.0")
        elif score_type == "percentage":
            if not (0.0 <= v <= 100.0):
                raise ValueError("Percentage must be between 0.0 and 100.0")
        return v


class ScholarshipResponseSchema(BaseModel):
    id: str
    name: str
    authority: str
    source_type: str
    amount_min: Optional[int] = None
    amount_max: int
    amount_display: str
    deadline: Optional[str] = None
    deadline_display: Optional[str] = None
    deadline_urgent: bool
    documents_required: List[str]
    apply_url: str
    eligibility_reason: str
    rank: int

    class Config:
        from_attributes = True


class StudentProfile(BaseModel):
    category: str
    income_bracket: str
    state: str
    edu_level: str
    score_percentage: float


class MatchResponse(BaseModel):
    status: str
    count: int
    student_profile: StudentProfile
    scholarships: List[ScholarshipResponseSchema]
    data_freshness: str
    message: Optional[str] = None
    fallback_url: Optional[str] = None
