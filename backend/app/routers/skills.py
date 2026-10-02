from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, require_role
from app.models.skill import Skill
from app.schemas.skill import SkillCreate

router = APIRouter()

@router.get("")
def list_skills(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Skill)
    if category and category.lower() != "all":
        query = query.filter(Skill.category.ilike(f"%{category}%"))
    skills = query.order_by(Skill.name.asc()).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "description": s.description,
            "icon": s.icon,
            "created_at": s.created_at.isoformat()
        }
        for s in skills
    ]

@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    skills = db.query(Skill.category).distinct().all()
    categories = [cat[0] for cat in skills if cat[0]]
    return categories

@router.post("", dependencies=[Depends(require_role(["ADMIN"]))])
def create_skill(data: SkillCreate, db: Session = Depends(get_db)):
    existing = db.query(Skill).filter(Skill.name.ilike(data.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Skill already exists")
    
    skill = Skill(
        name=data.name,
        category=data.category,
        description=data.description,
        icon=data.icon or "code"
    )
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill
