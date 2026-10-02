import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.database import Base

class Badge(Base):
    __tablename__ = "badges"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(100), default="award")
    requirement = Column(String(255), nullable=False)

    # Relationships
    student_badges = relationship("StudentBadge", back_populates="badge")

class StudentBadge(Base):
    __tablename__ = "student_badges"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    badge_id = Column(String(50), ForeignKey("badges.id"), index=True, nullable=False)
    awarded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("student_id", "badge_id", name="uq_student_badge"),
    )

    # Relationships
    student = relationship("User", back_populates="badges")
    badge = relationship("Badge", back_populates="student_badges")
