import random
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.exercise import MathProblem
from app.schemas.exercise import MathProblemOut

async def get_random_problems(db: AsyncSession, count: int = 100) -> List[MathProblemOut]:
    stmt = select(MathProblem).order_by(func.random()).limit(count)
    result = await db.execute(stmt)
    problems = result.scalars().all()
    return [MathProblemOut(id=p.id, expression=p.expression, answer=p.answer) for p in problems]
