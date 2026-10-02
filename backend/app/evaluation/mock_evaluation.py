import random
from typing import Dict, Any, List
from app.schemas.evaluation import AIEvaluationOutput

class MockEvaluationProvider:
    """
    Mock Evaluation Provider for testing and local fallback.
    Evaluates submissions based on challenge parameters and heuristics.
    """

    @staticmethod
    def evaluate(
        challenge_title: str,
        skill_name: str,
        difficulty: str,
        github_url: str,
        live_demo_url: str | None,
        explanation: str
    ) -> AIEvaluationOutput:
        # Heuristic scoring based on length/thoroughness of explanation and presence of demo
        base = 82
        if live_demo_url and "http" in live_demo_url:
            base += 4
        if len(explanation.split()) > 30:
            base += 3
        
        # Add slight realistic variance
        var = random.randint(-2, 3)
        total_target = min(96, max(75, base + var))
        
        # Sub-score proportional distribution
        func = round(total_target * 0.25)
        ui = round(total_target * 0.24)
        resp = round(total_target * 0.20)
        code = round(total_target * 0.21)
        access = total_target - (func + ui + resp + code)
        access = max(6, min(10, access))

        recalc_total = func + ui + resp + code + access

        strengths = [
            f"Demonstrated solid grasp of {skill_name} core patterns and state architecture",
            "Structured modular components with clean separation of concerns",
            "Comprehensive error handling and intuitive user feedback loops"
        ]
        if live_demo_url:
            strengths.append("Provided a deployed working live demo confirming deployment readiness")

        weaknesses = [
            "Edge-case input sanitization could be hardened further",
            "Minor missing keyboard navigation focus rings on interactive elements"
        ]

        recommendations = [
            f"Incorporate unit tests verifying core {skill_name} utility functions",
            "Enhance ARIA landmarks and aria-live announcements for screen reader accessibility",
            "Consider lazy-loading non-critical asset chunks to optimize initial paint"
        ]

        summary = (
            f"Assisted evaluation for '{challenge_title}'. The solution thoroughly fulfills functional requirements "
            f"with clean code ergonomics in {skill_name}. Visual hierarchy is crisp and responsive. Minor polish in "
            f"accessibility and automated test coverage will elevate this to production grade."
        )

        return AIEvaluationOutput(
            skill=skill_name,
            functionality=func,
            uiux=ui,
            responsiveness=resp,
            code_quality=code,
            accessibility=access,
            total=recalc_total,
            summary=summary,
            strengths=strengths,
            weaknesses=weaknesses,
            recommendations=recommendations
        )
