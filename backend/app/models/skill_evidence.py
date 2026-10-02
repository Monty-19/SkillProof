import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.database import Base

class SkillEvidence(Base):
    __tablename__ = "skill_evidences"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    skill_id = Column(String(50), ForeignKey("skills.id"), index=True, nullable=False)
    
    score = Column(Integer, index=True, nullable=False)  # Current highest/demonstrated score
    demonstrated = Column(Boolean, default=True, index=True, nullable=False)
    challenge_count = Column(Integer, default=1, nullable=False)
    project_count = Column(Integer, default=0, nullable=False)
    
    verified_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("student_id", "skill_id", name="uq_student_skill"),
    )

    # Relationships
    student = relationship("User", back_populates="skill_evidences")
    skill = relationship("Skill", back_populates="evidences")
