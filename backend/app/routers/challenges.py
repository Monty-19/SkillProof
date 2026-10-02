import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.dependencies import get_db, get_current_user, require_role
from app.models.challenge import Challenge
from app.models.skill import Skill
from app.models.submission import Submission
from app.models.user import User

router = APIRouter()

@router.get("")
def list_challenges(
    skill: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Challenge)

    if category and category.lower() != "all":
        query = query.filter(Challenge.category.ilike(f"%{category}%"))

    if difficulty and difficulty.lower() != "all":
        query = query.filter(Challenge.difficulty == difficulty.upper())

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Challenge.title.ilike(search_fmt),
                Challenge.description.ilike(search_fmt),
                Challenge.category.ilike(search_fmt)
            )
        )

    challenges = query.all()
    results = []

    for c in challenges:
        # Filter by skill name if supplied
        if skill and skill.lower() != "all":
            if not c.skill or c.skill.name.lower() != skill.lower():
                continue

        # Parse requirements if JSON string
        reqs = c.requirements
        try:
            reqs = json.loads(c.requirements)
        except Exception:
            pass

        sub_count = db.query(Submission).filter(Submission.challenge_id == c.id).count()

        results.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "scenario": c.scenario,
            "difficulty": c.difficulty,
            "category": c.category,
            "estimated_minutes": c.estimated_minutes,
            "requirements": reqs,
            "skill_id": c.skill_id,
            "skill_name": c.skill.name if c.skill else c.category,
            "submissions_count": sub_count,
            "created_at": c.created_at.isoformat()
        })

    return results

@router.get("/{id}")
def get_challenge(id: str, db: Session = Depends(get_db)):
    c = db.query(Challenge).filter(Challenge.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Challenge not found")

    reqs = c.requirements
    try:
        reqs = json.loads(c.requirements)
    except Exception:
        pass

    criteria = c.evaluation_criteria
    try:
        criteria = json.loads(c.evaluation_criteria)
    except Exception:
        pass

    sub_count = db.query(Submission).filter(Submission.challenge_id == c.id).count()

    return {
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "scenario": c.scenario,
        "difficulty": c.difficulty,
        "category": c.category,
        "estimated_minutes": c.estimated_minutes,
        "instructions": c.instructions,
        "requirements": reqs,
        "evaluation_criteria": criteria,
        "skill_id": c.skill_id,
        "skill_name": c.skill.name if c.skill else c.category,
        "submissions_count": sub_count,
        "created_at": c.created_at.isoformat()
    }
