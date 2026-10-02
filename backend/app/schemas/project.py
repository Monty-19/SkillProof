from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class ProjectBase(BaseModel):
    title: str
    description: str
    github_url: str
    live_demo_url: Optional[str] = None
    technologies: str

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: str
    student_id: str
    created_at: datetime

    class Config:
        from_attributes = True
