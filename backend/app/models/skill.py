import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), default="code")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    challenges = relationship("Challenge", back_populates="skill")
    evidences = relationship("SkillEvidence", back_populates="skill")
