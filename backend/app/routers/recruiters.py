from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.skill import Skill
from app.models.skill_evidence import SkillEvidence
from app.services.recruiter_service import RecruiterService

router = APIRouter()

@router.get("/candidates")
def search_candidates(
    skill: Optional[str] = None,
    minimum_score: Optional[int] = None,
    challenge: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    candidates = RecruiterService.search_candidates(
        db=db,
        skill_name=skill,
        minimum_score=minimum_score,
        challenge_id=challenge,
        location=location
    )
    return candidates

@router.get("/candidates/{id}")
def get_candidate(id: str, db: Session = Depends(get_db)):
    detail = RecruiterService.get_candidate_detail(db=db, student_id=id)
    if not detail:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return detail

@router.get("/dashboard")
def get_recruiter_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_students = db.query(User).filter(User.role == "STUDENT").count()
    demonstrated_evidences = db.query(SkillEvidence).filter(SkillEvidence.demonstrated == True).all()
    
    unique_demonstrated_students = len(set(e.student_id for e in demonstrated_evidences))
    high_performers = len(set(e.student_id for e in demonstrated_evidences if e.score >= 85))

    skills = db.query(Skill).all()
    skill_breakdown = []
    for s in skills:
        count = db.query(SkillEvidence).filter(
            SkillEvidence.skill_id == s.id,
            SkillEvidence.demonstrated == True
        ).count()
        skill_breakdown.append({
            "skill_name": s.name,
            "category": s.category,
            "demonstrated_candidates_count": count
        })

    # Recent candidates with verified skills
    recent_candidates = RecruiterService.search_candidates(db=db)[:6]

    return {
        "stats": {
            "total_candidates": total_students,
            "candidates_with_verified_skills": unique_demonstrated_students,
            "high_performing_candidates": high_performers,
            "skills_tracked": len(skills)
        },
        "top_skills": sorted(skill_breakdown, key=lambda x: x["demonstrated_candidates_count"], reverse=True)[:8],
        "featured_candidates": recent_candidates
    }
