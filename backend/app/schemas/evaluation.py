from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class AIEvaluationOutput(BaseModel):
    skill: str
    functionality: int = Field(ge=0, le=25)
    uiux: int = Field(ge=0, le=25)
    responsiveness: int = Field(ge=0, le=20)
    code_quality: int = Field(ge=0, le=20)
    accessibility: int = Field(ge=0, le=10)
    total: int = Field(ge=0, le=100)
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]

class EvaluationResponse(BaseModel):
    id: str
    submission_id: str
    functionality_score: int
    uiux_score: int
    responsiveness_score: int
    code_quality_score: int
    accessibility_score: int
    total_score: int
    ai_feedback: str
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    evaluation_provider: str
    created_at: datetime

    class Config:
        from_attributes = True
