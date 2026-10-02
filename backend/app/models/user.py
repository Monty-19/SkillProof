import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="STUDENT", index=True, nullable=False)  # STUDENT, RECRUITER, ADMIN
    
    avatar = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    college = Column(String(200), nullable=True)
    location = Column(String(100), nullable=True)
    headline = Column(String(200), nullable=True)
    github_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    submissions = relationship("Submission", back_populates="student", cascade="all, delete-orphan")
    skill_evidences = relationship("SkillEvidence", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("StudentBadge", back_populates="student", cascade="all, delete-orphan")
