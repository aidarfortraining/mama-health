import random
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.exercise import WordList

async def get_memory_words(db: AsyncSession, word_count: int = 12) -> List[str]:
    stmt = select(WordList).order_by(func.random()).limit(3)
    result = await db.execute(stmt)
    word_lists = result.scalars().all()

    all_words = []
    for wl in word_lists:
        all_words.extend(wl.words)

    random.shuffle(all_words)
    words = all_words[:word_count]

    return words
