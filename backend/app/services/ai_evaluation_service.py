import json
import logging
import re
from typing import Optional
import httpx
from app.core.config import settings
from app.schemas.evaluation import AIEvaluationOutput
from app.evaluation.mock_evaluation import MockEvaluationProvider

logger = logging.getLogger(__name__)

class AIEvaluationService:
    @classmethod
    async def evaluate_submission(
        cls,
        challenge_title: str,
        challenge_description: str,
        challenge_requirements: str,
        challenge_criteria: str,
        skill_name: str,
        difficulty: str,
        github_url: str,
        live_demo_url: Optional[str],
        explanation: str
    ) -> tuple[AIEvaluationOutput, str]:
        """
        Evaluates a challenge submission using Gemini API if configured,
        or falls back to MockEvaluationProvider.
        Returns: (AIEvaluationOutput, provider_name: 'ai' | 'mock')
        """
        api_key = settings.GEMINI_API_KEY
        use_ai = settings.EVALUATION_PROVIDER.lower() == "ai" and bool(api_key and len(api_key.strip()) > 5)

        if not use_ai:
            logger.info("Using MockEvaluationProvider (AI disabled or API key not set)")
            res = MockEvaluationProvider.evaluate(
                challenge_title=challenge_title,
                skill_name=skill_name,
                difficulty=difficulty,
                github_url=github_url,
                live_demo_url=live_demo_url,
                explanation=explanation
            )
            return res, "mock"

        # Construct prompt for Gemini
        system_instruction = (
            "You are an expert technical evaluator on the SkillProof platform. "
            "Your job is to provide an objective, constructive, and structured AI-assisted evaluation "
            "of a student's project submission against the specific challenge requirements."
        )

        prompt = f"""
Challenge Title: {challenge_title}
Skill Target: {skill_name}
Difficulty: {difficulty}

Challenge Description:
{challenge_description}

Challenge Requirements:
{challenge_requirements}

Evaluation Criteria:
{challenge_criteria}

Student Submission:
- GitHub Repository: {github_url}
- Live Demo URL: {live_demo_url or 'None provided'}
- Student Solution Explanation & Architecture:
{explanation}

TASK:
Evaluate the submission thoroughly based on the provided requirements and student explanation.
Score the submission on these 5 dimensions:
1. functionality (0-25)
2. uiux (0-25)
3. responsiveness (0-20)
4. code_quality (0-20)
5. accessibility (0-10)
Total must equal the sum of the five scores (0-100).

Return ONLY valid JSON matching this exact schema:
{{
  "skill": "{skill_name}",
  "functionality": 24,
  "uiux": 21,
  "responsiveness": 18,
  "code_quality": 17,
  "accessibility": 8,
  "total": 88,
  "summary": "Concise 2-3 sentence assessment summary...",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}}
"""

        # Call Gemini models in order of preference
        models_to_try = [settings.AI_MODEL, "gemini-3.8-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        # deduplicate while keeping order
        seen = set()
        models = [m for m in models_to_try if m and not (m in seen or seen.add(m))]

        for model in models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                payload = {
                    "contents": [
                        {
                            "parts": [
                                {"text": f"{system_instruction}\n\n{prompt}"}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.2,
                        "responseMimeType": "application/json"
                    }
                }

                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(url, json=payload)
                    
                    if response.status_code == 200:
                        data = response.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                text_content = parts[0]["text"].strip()
                                # Clean markdown fences if any
                                clean_json = re.sub(r"^```(?:json)?\s*|\s*```$", "", text_content, flags=re.MULTILINE).strip()
                                parsed = json.loads(clean_json)
                                
                                # Validate with Pydantic
                                # Ensure total matches sum
                                f = int(parsed.get("functionality", 20))
                                u = int(parsed.get("uiux", 20))
                                r = int(parsed.get("responsiveness", 16))
                                c = int(parsed.get("code_quality", 16))
                                a = int(parsed.get("accessibility", 8))
                                total = f + u + r + c + a
                                
                                validated = AIEvaluationOutput(
                                    skill=str(parsed.get("skill", skill_name)),
                                    functionality=min(25, max(0, f)),
                                    uiux=min(25, max(0, u)),
                                    responsiveness=min(20, max(0, r)),
                                    code_quality=min(20, max(0, c)),
                                    accessibility=min(10, max(0, a)),
                                    total=min(100, max(0, total)),
                                    summary=str(parsed.get("summary", "Successfully evaluated.")),
                                    strengths=list(parsed.get("strengths", ["Solid requirement fulfillment"])),
                                    weaknesses=list(parsed.get("weaknesses", ["Minor polish opportunities"])),
                                    recommendations=list(parsed.get("recommendations", ["Continue building practical projects"]))
                                )
                                return validated, "ai"
                    else:
                        logger.warning(f"Gemini API returned status {response.status_code}: {response.text}")
            except Exception as e:
                logger.error(f"Error calling Gemini with model {model}: {e}")

        logger.info("Falling back to MockEvaluationProvider after AI attempt")
        fallback = MockEvaluationProvider.evaluate(
            challenge_title=challenge_title,
            skill_name=skill_name,
            difficulty=difficulty,
            github_url=github_url,
            live_demo_url=live_demo_url,
            explanation=explanation
        )
        return fallback, "mock"
