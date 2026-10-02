from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.skill_evidence import SkillEvidence
from app.models.submission import Submission
from app.models.project import Project
from app.models.badge import StudentBadge
from app.schemas.user import UserUpdate
from app.schemas.project import ProjectCreate

router = APIRouter()

@router.get("/dashboard")
def get_student_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Demonstrated skills
    evidences = db.query(SkillEvidence).filter(
        SkillEvidence.student_id == current_user.id
    ).all()

    scores = [ev.score for ev in evidences if ev.demonstrated]
    overall_score = round(sum(scores) / len(scores)) if scores else 0

    # Submissions
    submissions = db.query(Submission).filter(
        Submission.student_id == current_user.id
    ).order_by(Submission.submitted_at.desc()).all()

    projects = db.query(Project).filter(
        Project.student_id == current_user.id
    ).order_by(Project.created_at.desc()).all()

    badges = db.query(StudentBadge).filter(
        StudentBadge.student_id == current_user.id
    ).all()

    skill_cards = [
        {
            "skill_id": ev.skill_id,
            "skill_name": ev.skill.name,
            "category": ev.skill.category,
            "score": ev.score,
            "demonstrated": ev.demonstrated,
            "challenge_count": ev.challenge_count,
            "project_count": ev.project_count,
            "icon": ev.skill.icon,
            "verified_at": ev.verified_at.isoformat()
        }
        for ev in evidences
    ]

    recent_submissions = [
        {
            "id": s.id,
            "challenge_id": s.challenge_id,
            "challenge_title": s.challenge.title if s.challenge else "Challenge",
            "skill_name": s.challenge.skill.name if (s.challenge and s.challenge.skill) else "Skill",
            "score": s.score,
            "status": s.status,
            "submitted_at": s.submitted_at.isoformat(),
            "github_url": s.github_url,
            "live_demo_url": s.live_demo_url
        }
        for s in submissions[:5]
    ]

    badge_list = [
        {
            "id": b.badge.id,
            "name": b.badge.name,
            "description": b.badge.description,
            "icon": b.badge.icon,
            "awarded_at": b.awarded_at.isoformat()
        }
        for b in badges if b.badge
    ]

    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "username": current_user.username,
            "email": current_user.email,
            "headline": current_user.headline,
            "college": current_user.college,
            "location": current_user.location,
            "bio": current_user.bio,
            "avatar": current_user.avatar,
            "github_url": current_user.github_url,
            "linkedin_url": current_user.linkedin_url
        },
        "stats": {
            "overall_score": overall_score,
            "skills_demonstrated": len([e for e in evidences if e.demonstrated]),
            "challenges_completed": len([s for s in submissions if s.status == "EVALUATED"]),
            "projects_count": len(projects),
            "badges_count": len(badges)
        },
        "skills": skill_cards,
        "recent_submissions": recent_submissions,
        "badges": badge_list,
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "github_url": p.github_url,
                "live_demo_url": p.live_demo_url,
                "technologies": p.technologies
            }
            for p in projects
        ]
    }

@router.get("/{identifier}/passport")
def get_public_passport(identifier: str, db: Session = Depends(get_db)):
    # Can match by username or id
    student = db.query(User).filter(
        (User.username == identifier) | (User.id == identifier)
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student passport not found")

    evidences = db.query(SkillEvidence).filter(
        SkillEvidence.student_id == student.id,
        SkillEvidence.demonstrated == True
    ).all()

    scores = [ev.score for ev in evidences]
    overall_score = round(sum(scores) / len(scores)) if scores else 0

    submissions = db.query(Submission).filter(
        Submission.student_id == student.id,
        Submission.status == "EVALUATED"
    ).order_by(Submission.submitted_at.desc()).all()

    projects = db.query(Project).filter(
        Project.student_id == student.id
    ).all()

    badges = db.query(StudentBadge).filter(
        StudentBadge.student_id == student.id
    ).all()

    # Never expose password_hash or internal secrets
    return {
        "id": student.id,
        "name": student.name,
        "username": student.username,
        "headline": student.headline or "Demonstrated Software Builder",
        "college": student.college or "University",
        "location": student.location or "Remote",
        "bio": student.bio,
        "avatar": student.avatar,
        "github_url": student.github_url,
        "linkedin_url": student.linkedin_url,
        "overall_score": overall_score,
        "demonstrated_skills_count": len(evidences),
        "challenges_completed_count": len(submissions),
        "verified_projects_count": len(projects),
        "skills": [
            {
                "skill_name": ev.skill.name,
                "category": ev.skill.category,
                "score": ev.score,
                "demonstrated": ev.demonstrated,
                "challenge_count": ev.challenge_count,
                "verified_at": ev.verified_at.isoformat()
            }
            for ev in evidences
        ],
        "evidence_history": [
            {
                "challenge_title": s.challenge.title if s.challenge else "Challenge",
                "skill_name": s.challenge.skill.name if (s.challenge and s.challenge.skill) else "General",
                "score": s.score,
                "github_url": s.github_url,
                "live_demo_url": s.live_demo_url,
                "date": s.submitted_at.strftime("%b %d, %Y")
            }
            for s in submissions
        ],
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "github_url": p.github_url,
                "live_demo_url": p.live_demo_url,
                "technologies": p.technologies
            }
            for p in projects
        ],
        "badges": [
            {
                "name": b.badge.name,
                "description": b.badge.description,
                "icon": b.badge.icon
            }
            for b in badges if b.badge
        ]
    }

@router.post("/projects")
def add_project(
    data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = Project(
        student_id=current_user.id,
        title=data.title,
        description=data.description,
        github_url=data.github_url,
        live_demo_url=data.live_demo_url,
        technologies=data.technologies
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/profile")
def update_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if data.name is not None:
        current_user.name = data.name
    if data.username is not None:
        current_user.username = data.username
    if data.avatar is not None:
        current_user.avatar = data.avatar
    if data.bio is not None:
        current_user.bio = data.bio
    if data.college is not None:
        current_user.college = data.college
    if data.location is not None:
        current_user.location = data.location
    if data.headline is not None:
        current_user.headline = data.headline
    if data.github_url is not None:
        current_user.github_url = data.github_url
    if data.linkedin_url is not None:
        current_user.linkedin_url = data.linkedin_url

    db.commit()
    db.refresh(current_user)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "bio": current_user.bio,
        "college": current_user.college,
        "location": current_user.location,
        "headline": current_user.headline,
        "github_url": current_user.github_url,
        "linkedin_url": current_user.linkedin_url
    }
