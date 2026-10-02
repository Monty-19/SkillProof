import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    challenge_id = Column(String(50), ForeignKey("challenges.id"), index=True, nullable=False)
    
    github_url = Column(String(500), nullable=False)
    live_demo_url = Column(String(500), nullable=True)
    explanation = Column(Text, nullable=False)
    
    status = Column(String(30), default="SUBMITTED", index=True, nullable=False)  # SUBMITTED, EVALUATING, EVALUATED, FAILED
    score = Column(Integer, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    student = relationship("User", back_populates="submissions")
    challenge = relationship("Challenge", back_populates="submissions")
    evaluation = relationship("Evaluation", back_populates="submission", uselist=False, cascade="all, delete-orphan")
