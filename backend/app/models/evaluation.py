import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_id = Column(String(36), ForeignKey("submissions.id"), unique=True, index=True, nullable=False)
    
    functionality_score = Column(Integer, nullable=False)  # max 25
    uiux_score = Column(Integer, nullable=False)           # max 25
    responsiveness_score = Column(Integer, nullable=False)  # max 20
    code_quality_score = Column(Integer, nullable=False)    # max 20
    accessibility_score = Column(Integer, nullable=False)   # max 10
    total_score = Column(Integer, index=True, nullable=False) # max 100
    
    ai_feedback = Column(Text, nullable=False)
    strengths = Column(Text, nullable=False)         # JSON list
    weaknesses = Column(Text, nullable=False)        # JSON list
    recommendations = Column(Text, nullable=False)   # JSON list
    
    evaluation_provider = Column(String(50), default="ai")  # ai or mock
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    submission = relationship("Submission", back_populates="evaluation")
