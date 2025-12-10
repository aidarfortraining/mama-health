from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.exercise import (
    ArithmeticResponse, ReadingTextOut, StroopResponse, MemoryWordsResponse
)
from app.services import math_service, stroop_service, reading_service, memory_service

router = APIRouter(prefix="/api/exercises", tags=["exercises"])

@router.get("/arithmetic", response_model=ArithmeticResponse)
async def get_arithmetic_problems(db: AsyncSession = Depends(get_db)):
    problems = await math_service.get_random_problems(db, count=50)
    return ArithmeticResponse(problems=problems, time_limit_seconds=120)

@router.get("/reading", response_model=ReadingTextOut)
async def get_reading_text(db: AsyncSession = Depends(get_db)):
    return await reading_service.get_random_text(db)

@router.get("/stroop", response_model=StroopResponse)
async def get_stroop_test(db: AsyncSession = Depends(get_db)):
    items = await stroop_service.generate_stroop_test(db, count=50)
    return StroopResponse(items=items, time_limit_seconds=120)

@router.get("/memory-words", response_model=MemoryWordsResponse)
async def get_memory_words(db: AsyncSession = Depends(get_db)):
    words = await memory_service.get_memory_words(db, word_count=12)
    return MemoryWordsResponse(words=words)
