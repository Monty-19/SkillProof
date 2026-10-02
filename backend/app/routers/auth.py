from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.models.notification import Notification
from app.schemas.auth import RegisterRequest, LoginRequest
from app.utils.responses import success_response, error_response

router = APIRouter()

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email exists
    existing_user = db.query(User).filter(User.email == data.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    # Check username
    username = data.username or data.email.split("@")[0].lower()
    existing_username = db.query(User).filter(User.username == username).first()
    if existing_username:
        username = f"{username}_{data.email.split('@')[0][:4]}"

    role = data.role.upper() if data.role else "STUDENT"
    if role not in ["STUDENT", "RECRUITER", "ADMIN"]:
        role = "STUDENT"

    hashed_pw = get_password_hash(data.password)

    # Smart defaults based on role
    if role == "STUDENT":
        headline = data.headline or "Student & Practical Builder"
        college = data.college or "University"
        bio = data.bio or f"Hi, I'm {data.name}. Ready to demonstrate verified engineering capability on SkillProof."
        avatar = f"https://api.dicebear.com/7.x/initials/svg?seed={data.name}&backgroundColor=10b981,6366f1"
    else:
        headline = data.headline or f"Talent Partner @ {data.company or 'Tech Talent'}"
        college = data.company or data.college or "Hiring Partner"
        bio = data.bio or f"Hiring verified engineering talent at {data.company or 'our organization'} based on practical code proof."
        avatar = f"https://api.dicebear.com/7.x/initials/svg?seed={data.name}&backgroundColor=06b6d4,3b82f6"

    user = User(
        name=data.name,
        email=data.email.lower(),
        username=username,
        password_hash=hashed_pw,
        role=role,
        college=college,
        headline=headline,
        bio=bio,
        location=data.location or "Global",
        github_url=data.github_url,
        linkedin_url=data.linkedin_url,
        avatar=avatar
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create Welcome Notification in database
    welcome_msg = (
        "Welcome to SkillProof! Take your first practical challenge to start earning verified evidence."
        if role == "STUDENT"
        else "Welcome to SkillProof Recruiter Portal! Filter candidates by demonstrated scores and inspect code proofs directly."
    )
    notif = Notification(
        user_id=user.id,
        title="Welcome to SkillProof",
        message=welcome_msg,
        type="SYSTEM",
        read=False
    )
    db.add(notif)
    db.commit()

    token = create_access_token(user.id, extra_claims={"role": user.role, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "college": user.college,
            "headline": user.headline,
            "location": user.location,
            "avatar": user.avatar
        }
    }

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(user.id, extra_claims={"role": user.role, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "college": user.college,
            "headline": user.headline,
            "avatar": user.avatar
        }
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "avatar": current_user.avatar,
        "bio": current_user.bio,
        "college": current_user.college,
        "location": current_user.location,
        "headline": current_user.headline,
        "github_url": current_user.github_url,
        "linkedin_url": current_user.linkedin_url,
        "created_at": current_user.created_at.isoformat()
    }
