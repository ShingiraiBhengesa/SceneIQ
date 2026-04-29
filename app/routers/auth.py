from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.middleware.auth_middleware import get_current_user_id
from app.models.user import User
from app.schemas.user import TokenResponse, UserLogin, UserRegister
from app.services.auth_service import create_access_token, hash_password, verify_password
from app.services.token_blacklist import blacklist_token
from app.services.password_reset import generate_reset_token, validate_reset_token, consume_reset_token
from app.schemas.user import ForgotPasswordRequest, ResetPasswordRequest


router = APIRouter()
security = HTTPBearer(auto_error=False)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, db: Session = Depends(get_db)) -> TokenResponse:
    # Password length is now validated by Pydantic schema (UserRegister)

    existing_user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(user.id)
    return TokenResponse(access_token=access_token, user=user)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(user.id)
    return TokenResponse(access_token=access_token, user=user)


@router.post("/logout")
async def logout(
    _: UUID = Depends(get_current_user_id),
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict[str, str]:
    # Blacklist the current token so it can't be reused
    if credentials and credentials.credentials:
        try:
            blacklist_token(credentials.credentials)
        except Exception:
            # If Redis is unavailable, logout still succeeds (graceful degradation)
            pass

    return {"message": "Logged out successfully"}


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if user:
        token = generate_reset_token(payload.email)
        # In production, send this token via email. For dev, it's returned in the response.
        print(f"[DEV] Password reset token for {payload.email}: {token}")
    # Always return success to avoid leaking whether an email exists
    return {"message": "If that email is registered, a reset link has been sent."}


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    email = validate_reset_token(payload.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.password_hash = hash_password(payload.new_password)
    db.add(user)
    db.commit()
    consume_reset_token(payload.token)

    return {"message": "Password reset successfully. You can now log in."}
