from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.user import UserResponse, UserUpdate, PublicPassportResponse
from app.schemas.skill import SkillResponse, SkillCreate, SkillEvidenceResponse
from app.schemas.challenge import ChallengeResponse, ChallengeCreate
from app.schemas.submission import SubmissionCreate, SubmissionResponse
from app.schemas.evaluation import EvaluationResponse, AIEvaluationOutput
from app.schemas.recruiter import CandidateSearchQuery, CandidateSummary, CandidateDetail
from app.schemas.notification import NotificationResponse
from app.schemas.project import ProjectCreate, ProjectResponse
