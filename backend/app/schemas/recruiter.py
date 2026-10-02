from typing import Optional, List
from pydantic import BaseModel

class CandidateSearchQuery(BaseModel):
    skill: Optional[str] = None
    minimum_score: Optional[int] = None
    challenge: Optional[str] = None
    experience: Optional[str] = None
    location: Optional[str] = None

class CandidateSummary(BaseModel):
    id: str
    name: str
    username: Optional[str] = None
    headline: Optional[str] = None
    college: Optional[str] = None
    location: Optional[str] = None
    avatar: Optional[str] = None
    demonstrated_skills: List[dict]
    verified_projects_count: int
    challenges_completed_count: int
    overall_score: int
    matched_skill_score: Optional[int] = None

class CandidateDetail(CandidateSummary):
    bio: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    all_skills: List[dict]
    projects: List[dict]
    challenge_history: List[dict]
    badges: List[dict]
