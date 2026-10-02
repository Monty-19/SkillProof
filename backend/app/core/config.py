import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillProof"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./skillproof.db")
    
    # Security & JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "skillproof-super-secure-jwt-secret-key-2026-prod")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # AI Evaluation Service
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY") or os.getenv("AI_API_KEY")
    AI_MODEL: str = os.getenv("AI_MODEL", "gemini-3.8-flash")
    EVALUATION_PROVIDER: str = os.getenv("EVALUATION_PROVIDER", "ai")
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
