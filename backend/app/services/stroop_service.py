import random
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.exercise import StroopColor
from app.schemas.exercise import StroopItem

async def generate_stroop_test(db: AsyncSession, count: int = 50) -> List[StroopItem]:
    stmt = select(StroopColor)
    result = await db.execute(stmt)
    colors = result.scalars().all()

    items = []
    for i in range(count):
        word_color = random.choice(colors)
        display_colors = [c for c in colors if c.id != word_color.id]
        display_color = random.choice(display_colors)

        items.append(StroopItem(
            id=i + 1,
            word=word_color.color_name.upper(),
            display_color=display_color.color_code,
            correct_answer=display_color.color_name
        ))

    return items
