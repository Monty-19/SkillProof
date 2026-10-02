import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), index=True, nullable=False)
    description = Column(Text, nullable=False)
    scenario = Column(Text, nullable=True)
    difficulty = Column(String(20), default="INTERMEDIATE", index=True, nullable=False)  # BEGINNER, INTERMEDIATE, ADVANCED
    category = Column(String(100), index=True, nullable=False)
    estimated_minutes = Column(Integer, default=60, nullable=False)
    
    instructions = Column(Text, nullable=False)
    requirements = Column(Text, nullable=False)  # JSON string or formatted text
    evaluation_criteria = Column(Text, nullable=False)  # JSON string or formatted text
    
    skill_id = Column(String(50), ForeignKey("skills.id"), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    skill = relationship("Skill", back_populates="challenges")
    submissions = relationship("Submission", back_populates="challenge")
