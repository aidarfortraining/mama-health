from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.exercise import ReadingText
from app.schemas.exercise import ReadingTextOut

async def get_random_text(db: AsyncSession) -> ReadingTextOut:
    stmt = select(ReadingText).order_by(func.random()).limit(1)
    result = await db.execute(stmt)
    text = result.scalar_one()
    return ReadingTextOut(
        id=text.id,
        title=text.title,
        content=text.content,
        word_count=text.word_count
    )
