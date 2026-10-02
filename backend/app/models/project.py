import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    github_url = Column(String(500), nullable=False)
    live_demo_url = Column(String(500), nullable=True)
    technologies = Column(String(500), nullable=False)  # comma separated or JSON string
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    student = relationship("User", back_populates="projects")
