from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, Token, UserResponse
from app.services.auth_service import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. Validate Input Fields
    if not user_in.email or not user_in.password or not user_in.name:
        raise HTTPException(
            status_code=400,
            detail="Name, email, and password are required."
        )

    # Check if email is already taken
    # Using func.lower for case-insensitive lookup to match CITEXT behavior
    stmt = select(User).where(User.email == user_in.email.lower())
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="Email address already registered."
        )
        
    hashed = get_password_hash(user_in.password)
    # Generate initials for acronym
    names = user_in.name.split()
    acronym = "".join([n[0].upper() for n in names[:2]]) if names else "JD"
    
    new_user = User(
        name=user_in.name,
        email=user_in.email.lower(),
        hashed_password=hashed,
        avatar_acronym=acronym,
        bio=""
    )
    db.add(new_user)
    await db.commit()  # Save user first
    await db.refresh(new_user)  # Refresh to get any default values from DB (like created_at)
    
    token = create_access_token(new_user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    # 1. Find User by Email (Username field in OAuth2 form)
    stmt = select(User).where(User.email == form_data.username.lower())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    # 2. Strict Credential Validation
    # verify_password handles the salt-aware hash comparison
    if user is None:
        raise HTTPException(status_code=401, detail="Account not found.")
        
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid security cipher (password)."
        )
        
    # Update last_login_at for the user
    user.last_login_at = datetime.now(timezone.utc)
    db.add(user) # Mark the user object as modified
    await db.commit() # Commit the update to the database
    await db.refresh(user) # Refresh the user object to get the updated timestamp

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }
