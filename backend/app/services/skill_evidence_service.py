import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.skill_evidence import SkillEvidence
from app.models.badge import Badge, StudentBadge
from app.models.notification import Notification
from app.models.submission import Submission

class SkillEvidenceService:
    @staticmethod
    def update_or_create_evidence(
        db: Session,
        student_id: str,
        skill_id: str,
        new_score: int
    ) -> SkillEvidence:
        evidence = db.query(SkillEvidence).filter(
            SkillEvidence.student_id == student_id,
            SkillEvidence.skill_id == skill_id
        ).first()

        if evidence:
            # Update score: take highest verified score or weighted average
            evidence.score = max(evidence.score, new_score)
            evidence.challenge_count += 1
            evidence.demonstrated = True
            evidence.verified_at = datetime.utcnow()
        else:
            evidence = SkillEvidence(
                student_id=student_id,
                skill_id=skill_id,
                score=new_score,
                demonstrated=True,
                challenge_count=1,
                project_count=0,
                verified_at=datetime.utcnow()
            )
            db.add(evidence)
        
        db.commit()
        db.refresh(evidence)

        # Check and award badges
        SkillEvidenceService.check_and_award_badges(db, student_id, skill_id)

        return evidence

    @staticmethod
    def check_and_award_badges(db: Session, student_id: str, skill_id: str):
        # Count total evaluated submissions for this student
        submission_count = db.query(Submission).filter(
            Submission.student_id == student_id,
            Submission.status == "EVALUATED"
        ).count()

        # 1. First Proof badge
        if submission_count >= 1:
            SkillEvidenceService._award_badge_if_needed(
                db, student_id, "badge-first-proof", "First Proof",
                "Completed your first practical challenge and generated verified skill evidence.",
                "award", "Complete 1 challenge"
            )

        # 2. Problem Solver badge (3+ challenges)
        if submission_count >= 3:
            SkillEvidenceService._award_badge_if_needed(
                db, student_id, "badge-problem-solver", "Problem Solver",
                "Demonstrated practical problem solving across multiple real-world challenges.",
                "zap", "Complete 3 challenges"
            )

        # 3. Check for demonstrated skills count
        evidences = db.query(SkillEvidence).filter(
            SkillEvidence.student_id == student_id,
            SkillEvidence.demonstrated == True
        ).all()

        if len(evidences) >= 3:
            SkillEvidenceService._award_badge_if_needed(
                db, student_id, "badge-multi-skilled", "Full Stack Explorer",
                "Demonstrated verified proficiency across at least 3 distinct technical skills.",
                "layers", "Demonstrate 3 skills"
            )

    @staticmethod
    def _award_badge_if_needed(
        db: Session,
        student_id: str,
        badge_id: str,
        badge_name: str,
        badge_desc: str,
        icon: str,
        requirement: str
    ):
        badge = db.query(Badge).filter(Badge.id == badge_id).first()
        if not badge:
            badge = Badge(
                id=badge_id,
                name=badge_name,
                description=badge_desc,
                icon=icon,
                requirement=requirement
            )
            db.add(badge)
            db.commit()
            db.refresh(badge)

        existing = db.query(StudentBadge).filter(
            StudentBadge.student_id == student_id,
            StudentBadge.badge_id == badge.id
        ).first()

        if not existing:
            sb = StudentBadge(student_id=student_id, badge_id=badge.id)
            db.add(sb)
            
            # Notification for badge
            notif = Notification(
                user_id=student_id,
                title=f"New Badge Earned: {badge_name}!",
                message=f"Congratulations! You unlocked the '{badge_name}' badge: {badge_desc}",
                type="BADGE"
            )
            db.add(notif)
            db.commit()
