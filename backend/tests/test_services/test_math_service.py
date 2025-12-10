import pytest
from app.services.math_service import get_random_problems


class TestMathService:

    @pytest.mark.asyncio
    async def test_returns_requested_count(self, seeded_db):
        problems = await get_random_problems(seeded_db, count=50)
        assert len(problems) == 50

    @pytest.mark.asyncio
    async def test_problems_have_correct_structure(self, seeded_db):
        problems = await get_random_problems(seeded_db, count=10)

        for p in problems:
            # Use Pydantic model attribute access
            assert hasattr(p, 'id')
            assert hasattr(p, 'expression')
            assert hasattr(p, 'answer')
            assert isinstance(p.answer, int)

    @pytest.mark.asyncio
    async def test_different_calls_give_different_order(self, seeded_db):
        problems1 = await get_random_problems(seeded_db, count=20)
        problems2 = await get_random_problems(seeded_db, count=20)

        ids1 = [p.id for p in problems1]
        ids2 = [p.id for p in problems2]

        # Вероятность совпадения очень низкая
        assert ids1 != ids2
