from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    email: EmailStr
    username: Optional[str] = None
    role: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    college: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    college: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PublicPassportResponse(BaseModel):
    id: str
    name: str
    username: Optional[str]
    headline: Optional[str]
    college: Optional[str]
    location: Optional[str]
    avatar: Optional[str]
    bio: Optional[str]
    github_url: Optional[str]
    linkedin_url: Optional[str]
    overall_score: int
    demonstrated_skills_count: int
    challenges_completed_count: int
    verified_projects_count: int
    skills: List[dict]
    badges: List[dict]
    projects: List[dict]
    recent_evidence: List[dict]
