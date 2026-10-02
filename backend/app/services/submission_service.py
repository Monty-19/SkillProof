import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.submission import Submission
from app.models.challenge import Challenge
from app.models.evaluation import Evaluation
from app.models.notification import Notification
from app.schemas.submission import SubmissionCreate
from app.services.ai_evaluation_service import AIEvaluationService
from app.services.skill_evidence_service import SkillEvidenceService

class SubmissionService:
    @staticmethod
    async def create_and_evaluate_submission(
        db: Session,
        student_id: str,
        data: SubmissionCreate
    ) -> Submission:
        challenge = db.query(Challenge).filter(Challenge.id == data.challenge_id).first()
        if not challenge:
            raise ValueError("Challenge not found")

        # Create submission in SUBMITTED state
        submission = Submission(
            student_id=student_id,
            challenge_id=challenge.id,
            github_url=data.github_url,
            live_demo_url=data.live_demo_url,
            explanation=data.explanation,
            status="EVALUATING"
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)

        # Run AI-Assisted Evaluation
        skill_name = challenge.skill.name if challenge.skill else challenge.category
        
        eval_result, provider_used = await AIEvaluationService.evaluate_submission(
            challenge_title=challenge.title,
            challenge_description=challenge.description,
            challenge_requirements=str(challenge.requirements),
            challenge_criteria=str(challenge.evaluation_criteria),
            skill_name=skill_name,
            difficulty=challenge.difficulty,
            github_url=data.github_url,
            live_demo_url=data.live_demo_url,
            explanation=data.explanation
        )

        # Store evaluation
        evaluation = Evaluation(
            submission_id=submission.id,
            functionality_score=eval_result.functionality,
            uiux_score=eval_result.uiux,
            responsiveness_score=eval_result.responsiveness,
            code_quality_score=eval_result.code_quality,
            accessibility_score=eval_result.accessibility,
            total_score=eval_result.total,
            ai_feedback=eval_result.summary,
            strengths=json.dumps(eval_result.strengths),
            weaknesses=json.dumps(eval_result.weaknesses),
            recommendations=json.dumps(eval_result.recommendations),
            evaluation_provider=provider_used,
            created_at=datetime.utcnow()
        )
        db.add(evaluation)

        # Update submission status & score
        submission.status = "EVALUATED"
        submission.score = eval_result.total
        db.commit()
        db.refresh(submission)

        # Update SkillEvidence for student
        SkillEvidenceService.update_or_create_evidence(
            db=db,
            student_id=student_id,
            skill_id=challenge.skill_id,
            new_score=eval_result.total
        )

        # Send notification to student
        notif = Notification(
            user_id=student_id,
            title="Challenge Evaluated!",
            message=f"Your submission for '{challenge.title}' was evaluated. You scored {eval_result.total}/100 and demonstrated {skill_name}!",
            type="EVALUATION"
        )
        db.add(notif)
        db.commit()

        return submission
