from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.memory import Memory
from app.schemas.memory import MemoryCreate, MemoryResponse

router = APIRouter()

@router.get("", response_model=List[MemoryResponse])
async def get_memories(
    category: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Memory).where(Memory.user_id == current_user.id)
    if category and category != "All":
        stmt = stmt.where(Memory.category == category)
        
    stmt = stmt.order_by(Memory.timestamp.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("", response_model=MemoryResponse, status_code=status.HTTP_201_CREATED)
async def add_memory(
    memory_in: MemoryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_memory = Memory(
        fact=memory_in.fact,
        category=memory_in.category,
        user_id=current_user.id
    )
    db.add(new_memory)
    await db.commit()
    await db.refresh(new_memory)
    return new_memory

@router.delete("/{memory_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_memory(
    memory_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Memory).where(
        Memory.id == memory_id,
        Memory.user_id == current_user.id
    )
    result = await db.execute(stmt)
    memory = result.scalar_one_or_none()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory fact not found")
        
    await db.delete(memory)
    await db.commit()
