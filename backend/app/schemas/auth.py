from typing import Optional
from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "STUDENT"  # STUDENT, RECRUITER, ADMIN
    username: Optional[str] = None
    college: Optional[str] = None  # Or University
    company: Optional[str] = None  # For recruiters
    headline: Optional[str] = None
    location: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    bio: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict
