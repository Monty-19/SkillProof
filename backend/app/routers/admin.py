import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, require_role
from app.models.user import User
from app.models.challenge import Challenge
from app.models.submission import Submission
from app.models.evaluation import Evaluation
from app.models.skill import Skill
from app.models.skill_evidence import SkillEvidence
from app.models.badge import Badge
from app.schemas.challenge import ChallengeCreate

router = APIRouter(dependencies=[Depends(require_role(["ADMIN"]))])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    students_count = db.query(User).filter(User.role == "STUDENT").count()
    recruiters_count = db.query(User).filter(User.role == "RECRUITER").count()
    challenges_count = db.query(Challenge).count()
    submissions_count = db.query(Submission).count()
    evaluations_count = db.query(Evaluation).count()
    skills_count = db.query(Skill).count()
    demonstrated_evidences_count = db.query(SkillEvidence).filter(SkillEvidence.demonstrated == True).count()

    return {
        "total_users": total_users,
        "students": students_count,
        "recruiters": recruiters_count,
        "challenges": challenges_count,
        "submissions": submissions_count,
        "evaluations": evaluations_count,
        "skills": skills_count,
        "demonstrated_skills": demonstrated_evidences_count
    }

@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "college": u.college,
            "created_at": u.created_at.isoformat()
        }
        for u in users
    ]

@router.get("/submissions")
def list_all_submissions(db: Session = Depends(get_db)):
    submissions = db.query(Submission).order_by(Submission.submitted_at.desc()).all()
    return [
        {
            "id": s.id,
            "student_name": s.student.name if s.student else "Unknown",
            "student_email": s.student.email if s.student else "",
            "challenge_title": s.challenge.title if s.challenge else "Unknown",
            "github_url": s.github_url,
            "live_demo_url": s.live_demo_url,
            "status": s.status,
            "score": s.score,
            "submitted_at": s.submitted_at.isoformat()
        }
        for s in submissions
    ]

@router.post("/challenges")
def create_challenge(data: ChallengeCreate, db: Session = Depends(get_db)):
    reqs_str = data.requirements if isinstance(data.requirements, str) else json.dumps(data.requirements)
    crit_str = data.evaluation_criteria if isinstance(data.evaluation_criteria, str) else json.dumps(data.evaluation_criteria)

    challenge = Challenge(
        title=data.title,
        description=data.description,
        scenario=data.scenario,
        difficulty=data.difficulty.upper(),
        category=data.category,
        estimated_minutes=data.estimated_minutes,
        instructions=data.instructions,
        requirements=reqs_str,
        evaluation_criteria=crit_str,
        skill_id=data.skill_id
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge

@router.delete("/challenges/{id}")
def delete_challenge(id: str, db: Session = Depends(get_db)):
    c = db.query(Challenge).filter(Challenge.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Challenge not found")
    db.delete(c)
    db.commit()
    return {"status": "ok"}
