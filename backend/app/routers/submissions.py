import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.submission import Submission
from app.models.user import User
from app.models.challenge import Challenge
from app.schemas.submission import SubmissionCreate
from app.services.submission_service import SubmissionService

router = APIRouter()

@router.post("")
async def create_submission(
    data: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "STUDENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can submit challenges."
        )

    try:
        submission = await SubmissionService.create_and_evaluate_submission(
            db=db,
            student_id=current_user.id,
            data=data
        )

        # Build response with evaluation
        eval_data = None
        if submission.evaluation:
            e = submission.evaluation
            strengths = []
            weaknesses = []
            recommendations = []
            try:
                strengths = json.loads(e.strengths)
            except Exception:
                pass
            try:
                weaknesses = json.loads(e.weaknesses)
            except Exception:
                pass
            try:
                recommendations = json.loads(e.recommendations)
            except Exception:
                pass

            eval_data = {
                "id": e.id,
                "functionality_score": e.functionality_score,
                "uiux_score": e.uiux_score,
                "responsiveness_score": e.responsiveness_score,
                "code_quality_score": e.code_quality_score,
                "accessibility_score": e.accessibility_score,
                "total_score": e.total_score,
                "ai_feedback": e.ai_feedback,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "recommendations": recommendations,
                "evaluation_provider": e.evaluation_provider,
                "created_at": e.created_at.isoformat()
            }

        return {
            "id": submission.id,
            "student_id": submission.student_id,
            "challenge_id": submission.challenge_id,
            "challenge_title": submission.challenge.title if submission.challenge else "Challenge",
            "skill_name": submission.challenge.skill.name if (submission.challenge and submission.challenge.skill) else "General",
            "github_url": submission.github_url,
            "live_demo_url": submission.live_demo_url,
            "explanation": submission.explanation,
            "status": submission.status,
            "score": submission.score,
            "submitted_at": submission.submitted_at.isoformat(),
            "evaluation": eval_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("")
def list_submissions(
    student_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Submission)
    # If student, default to their own submissions
    if current_user.role == "STUDENT":
        query = query.filter(Submission.student_id == current_user.id)
    elif student_id:
        query = query.filter(Submission.student_id == student_id)

    submissions = query.order_by(Submission.submitted_at.desc()).all()
    results = []

    for s in submissions:
        results.append({
            "id": s.id,
            "student_id": s.student_id,
            "challenge_id": s.challenge_id,
            "challenge_title": s.challenge.title if s.challenge else "Challenge",
            "skill_name": s.challenge.skill.name if (s.challenge and s.challenge.skill) else "General",
            "difficulty": s.challenge.difficulty if s.challenge else "INTERMEDIATE",
            "github_url": s.github_url,
            "live_demo_url": s.live_demo_url,
            "status": s.status,
            "score": s.score,
            "submitted_at": s.submitted_at.isoformat(),
            "has_evaluation": s.evaluation is not None
        })

    return results

@router.get("/{id}")
def get_submission(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    s = db.query(Submission).filter(Submission.id == id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")

    # If student, only view own
    if current_user.role == "STUDENT" and s.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    eval_data = None
    if s.evaluation:
        e = s.evaluation
        strengths, weaknesses, recommendations = [], [], []
        try:
            strengths = json.loads(e.strengths)
        except Exception:
            pass
        try:
            weaknesses = json.loads(e.weaknesses)
        except Exception:
            pass
        try:
            recommendations = json.loads(e.recommendations)
        except Exception:
            pass

        eval_data = {
            "id": e.id,
            "functionality_score": e.functionality_score,
            "uiux_score": e.uiux_score,
            "responsiveness_score": e.responsiveness_score,
            "code_quality_score": e.code_quality_score,
            "accessibility_score": e.accessibility_score,
            "total_score": e.total_score,
            "ai_feedback": e.ai_feedback,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": recommendations,
            "evaluation_provider": e.evaluation_provider,
            "created_at": e.created_at.isoformat()
        }

    return {
        "id": s.id,
        "student_id": s.student_id,
        "student_name": s.student.name if s.student else "Student",
        "challenge_id": s.challenge_id,
        "challenge_title": s.challenge.title if s.challenge else "Challenge",
        "skill_name": s.challenge.skill.name if (s.challenge and s.challenge.skill) else "General",
        "difficulty": s.challenge.difficulty if s.challenge else "INTERMEDIATE",
        "github_url": s.github_url,
        "live_demo_url": s.live_demo_url,
        "explanation": s.explanation,
        "status": s.status,
        "score": s.score,
        "submitted_at": s.submitted_at.isoformat(),
        "evaluation": eval_data
    }
