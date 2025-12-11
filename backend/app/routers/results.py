from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.result import TrainingSession, ExerciseResult
from app.schemas.exercise import ExerciseResultCreate, ExerciseResultOut, SessionOut, SessionCreate

router = APIRouter(prefix="/api", tags=["results"])

@router.post("/sessions", response_model=SessionOut)
async def create_session(db: AsyncSession = Depends(get_db)):
    session = TrainingSession()
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return SessionOut(id=session.id, total_score=0, results=[])

@router.post("/results", response_model=ExerciseResultOut)
async def save_result(data: ExerciseResultCreate, db: AsyncSession = Depends(get_db)):
    session_id = data.session_id

    # If session_id not provided, create a new training session so results are not orphaned.
    if session_id is None:
        new_session = TrainingSession()
        db.add(new_session)
        await db.commit()
        await db.refresh(new_session)
        session_id = new_session.id

    result = ExerciseResult(
        session_id=session_id,
        exercise_type=data.exercise_type,
        score=data.score,
        time_seconds=data.time_seconds,
        correct_answers=data.correct_answers,
        total_questions=data.total_questions,
        details=data.details
    )
    db.add(result)
    await db.commit()
    await db.refresh(result)

    return result

@router.get("/sessions/{session_id}", response_model=SessionOut)
async def get_session(session_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(TrainingSession).where(TrainingSession.id == session_id).options(selectinload(TrainingSession.results))
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Calculate total score from results
    total_score = sum(r.score for r in session.results) if session.results else 0
    
    # Convert results to ExerciseResultOut
    result_list = [
        ExerciseResultOut(
            id=r.id,
            exercise_type=r.exercise_type,
            score=r.score,
            time_seconds=r.time_seconds,
            correct_answers=r.correct_answers,
            total_questions=r.total_questions
        ) for r in session.results
    ]

    return SessionOut(id=session.id, total_score=total_score, results=result_list)
