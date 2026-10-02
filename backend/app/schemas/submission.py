from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, HttpUrl

class SubmissionCreate(BaseModel):
    challenge_id: str
    github_url: str
    live_demo_url: Optional[str] = None
    explanation: str

class SubmissionResponse(BaseModel):
    id: str
    student_id: str
    challenge_id: str
    github_url: str
    live_demo_url: Optional[str] = None
    explanation: str
    status: str
    score: Optional[int] = None
    submitted_at: datetime
    challenge_title: Optional[str] = None
    skill_name: Optional[str] = None
    evaluation: Optional[Any] = None

    class Config:
        from_attributes = True
