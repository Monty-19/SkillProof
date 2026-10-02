from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class SkillBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    icon: Optional[str] = "code"

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class SkillEvidenceResponse(BaseModel):
    id: str
    skill_id: str
    skill_name: str
    category: str
    score: int
    demonstrated: bool
    challenge_count: int
    project_count: int
    verified_at: datetime
    icon: Optional[str] = "code"

    class Config:
        from_attributes = True
