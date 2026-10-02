from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel
from app.schemas.skill import SkillResponse

class ChallengeBase(BaseModel):
    title: str
    description: str
    scenario: Optional[str] = None
    difficulty: str  # BEGINNER, INTERMEDIATE, ADVANCED
    category: str
    estimated_minutes: int
    instructions: str
    requirements: Any
    evaluation_criteria: Any
    skill_id: str

class ChallengeCreate(ChallengeBase):
    pass

class ChallengeResponse(ChallengeBase):
    id: str
    created_at: datetime
    updated_at: datetime
    skill: Optional[SkillResponse] = None
    submissions_count: Optional[int] = 0

    class Config:
        from_attributes = True
