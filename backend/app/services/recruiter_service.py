from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User
from app.models.skill import Skill
from app.models.skill_evidence import SkillEvidence
from app.models.submission import Submission
from app.models.project import Project
from app.models.badge import StudentBadge, Badge
from app.schemas.recruiter import CandidateSummary, CandidateDetail

class RecruiterService:
    @staticmethod
    def search_candidates(
        db: Session,
        skill_name: Optional[str] = None,
        minimum_score: Optional[int] = None,
        challenge_id: Optional[str] = None,
        location: Optional[str] = None
    ) -> List[dict]:
        # Query students
        query = db.query(User).filter(User.role == "STUDENT")

        if location:
            query = query.filter(User.location.ilike(f"%{location}%"))

        candidates = query.all()
        results = []

        for student in candidates:
            # Check student skills
            evidences = db.query(SkillEvidence).filter(
                SkillEvidence.student_id == student.id,
                SkillEvidence.demonstrated == True
            ).all()

            matched = False
            matched_skill_score = None

            # Filter by skill & minimum score if provided
            if skill_name:
                for ev in evidences:
                    if ev.skill.name.lower() == skill_name.lower():
                        if minimum_score is None or ev.score >= minimum_score:
                            matched = True
                            matched_skill_score = ev.score
                            break
            elif minimum_score is not None:
                # Any skill with >= minimum_score
                for ev in evidences:
                    if ev.score >= minimum_score:
                        matched = True
                        matched_skill_score = ev.score
                        break
            else:
                matched = True

            if not matched:
                continue

            # Calculate overall score
            scores = [ev.score for ev in evidences]
            overall_score = round(sum(scores) / len(scores)) if scores else 0

            # Verified projects
            proj_count = db.query(Project).filter(Project.student_id == student.id).count()
            # Completed challenges
            chal_count = db.query(Submission).filter(
                Submission.student_id == student.id,
                Submission.status == "EVALUATED"
            ).count()

            skill_list = [
                {
                    "skill_id": ev.skill_id,
                    "skill_name": ev.skill.name,
                    "category": ev.skill.category,
                    "score": ev.score,
                    "demonstrated": ev.demonstrated,
                    "challenge_count": ev.challenge_count
                }
                for ev in evidences
            ]

            results.append({
                "id": student.id,
                "name": student.name,
                "username": student.username or student.id,
                "headline": student.headline or "Demonstrated Software Builder",
                "college": student.college or "University",
                "location": student.location or "Remote",
                "avatar": student.avatar,
                "demonstrated_skills": skill_list,
                "verified_projects_count": proj_count,
                "challenges_completed_count": chal_count,
                "overall_score": overall_score,
                "matched_skill_score": matched_skill_score
            })

        # Sort by matched skill score or overall score descending
        results.sort(key=lambda x: (x["matched_skill_score"] or 0, x["overall_score"]), reverse=True)
        return results

    @staticmethod
    def get_candidate_detail(db: Session, student_id: str) -> Optional[dict]:
        student = db.query(User).filter(User.id == student_id, User.role == "STUDENT").first()
        if not student:
            return None

        evidences = db.query(SkillEvidence).filter(
            SkillEvidence.student_id == student.id
        ).all()

        scores = [ev.score for ev in evidences if ev.demonstrated]
        overall_score = round(sum(scores) / len(scores)) if scores else 0

        projects = db.query(Project).filter(Project.student_id == student.id).all()
        submissions = db.query(Submission).filter(
            Submission.student_id == student.id,
            Submission.status == "EVALUATED"
        ).order_by(Submission.submitted_at.desc()).all()

        badges = db.query(StudentBadge).filter(StudentBadge.student_id == student.id).all()

        return {
            "id": student.id,
            "name": student.name,
            "username": student.username,
            "headline": student.headline,
            "college": student.college,
            "location": student.location,
            "avatar": student.avatar,
            "bio": student.bio,
            "github_url": student.github_url,
            "linkedin_url": student.linkedin_url,
            "overall_score": overall_score,
            "challenges_completed_count": len(submissions),
            "verified_projects_count": len(projects),
            "demonstrated_skills": [
                {
                    "skill_id": ev.skill_id,
                    "skill_name": ev.skill.name,
                    "category": ev.skill.category,
                    "score": ev.score,
                    "demonstrated": ev.demonstrated,
                    "challenge_count": ev.challenge_count
                }
                for ev in evidences
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
            "challenge_history": [
                {
                    "id": sub.id,
                    "challenge_id": sub.challenge_id,
                    "challenge_title": sub.challenge.title if sub.challenge else "Challenge",
                    "skill_name": sub.challenge.skill.name if (sub.challenge and sub.challenge.skill) else "General",
                    "score": sub.score,
                    "github_url": sub.github_url,
                    "live_demo_url": sub.live_demo_url,
                    "submitted_at": sub.submitted_at.isoformat(),
                    "evaluation": {
                        "functionality_score": sub.evaluation.functionality_score,
                        "uiux_score": sub.evaluation.uiux_score,
                        "responsiveness_score": sub.evaluation.responsiveness_score,
                        "code_quality_score": sub.evaluation.code_quality_score,
                        "accessibility_score": sub.evaluation.accessibility_score,
                        "total_score": sub.evaluation.total_score,
                        "ai_feedback": sub.evaluation.ai_feedback,
                        "evaluation_provider": sub.evaluation.evaluation_provider
                    } if sub.evaluation else None
                }
                for sub in submissions
            ],
            "badges": [
                {
                    "id": b.badge.id,
                    "name": b.badge.name,
                    "description": b.badge.description,
                    "icon": b.badge.icon,
                    "awarded_at": b.awarded_at.isoformat()
                }
                for b in badges if b.badge
            ]
        }
