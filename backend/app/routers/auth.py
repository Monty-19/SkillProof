from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
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
    user = User(
        name=data.name,
        email=data.email.lower(),
        username=username,
        password_hash=hashed_pw,
        role=role,
        college=data.college,
        headline=data.headline or ("Demonstrated Builder" if role == "STUDENT" else "Technical Recruiter")
    )
    db.add(user)
    db.commit()
    db.refresh(user)

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
