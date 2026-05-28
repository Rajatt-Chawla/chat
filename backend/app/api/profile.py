from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.auth import UserResponse
from app.schemas.settings import ProfileUpdate, CompanionTuningUpdate, InterfaceUpdate

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me/profile", response_model=UserResponse)
async def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if profile_in.name is not None:
        current_user.name = profile_in.name
    if profile_in.email is not None:
        current_user.email = profile_in.email
    if profile_in.bio is not None:
        current_user.bio = profile_in.bio
        
    await db.commit()
    return current_user

@router.patch("/me/tuning", response_model=UserResponse)
async def update_tuning(
    tuning_in: CompanionTuningUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if tuning_in.temperature is not None:
        current_user.temperature = tuning_in.temperature
    if tuning_in.tone is not None:
        current_user.tone = tuning_in.tone
    if tuning_in.cognitive_engine is not None:
        current_user.cognitive_engine = tuning_in.cognitive_engine
        
    await db.commit()
    return current_user

@router.patch("/me/interface", response_model=UserResponse)
async def update_interface(
    interface_in: InterfaceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if interface_in.font_size is not None:
        current_user.font_size = interface_in.font_size
    if interface_in.reduce_motion is not None:
        current_user.reduce_motion = interface_in.reduce_motion
        
    await db.commit()
    return current_user

from app.models.settings import Setting
from sqlalchemy import select

@router.get("/settings")
async def get_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Setting).where(Setting.user_id == current_user.id)
    res = await db.execute(stmt)
    db_settings = res.scalars().all()
    return {s.setting_key: s.value for s in db_settings}

@router.post("/settings")
async def update_settings(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    for key, value in payload.items():
        stmt = select(Setting).where(
            Setting.user_id == current_user.id,
            Setting.setting_key == key
        )
        res = await db.execute(stmt)
        setting = res.scalar_one_or_none()
        if setting:
            setting.value = value
        else:
            setting = Setting(
                user_id=current_user.id,
                setting_key=key,
                value=value
            )
            db.add(setting)
    await db.commit()
    return {"status": "success"}
