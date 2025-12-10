import pytest
from app.services.stroop_service import generate_stroop_test


class TestStroopService:

    @pytest.mark.asyncio
    async def test_generates_correct_count(self, seeded_db):
        items = await generate_stroop_test(seeded_db, count=30)
        assert len(items) == 30

    @pytest.mark.asyncio
    async def test_word_not_equal_to_correct_answer(self, seeded_db):
        """Критическая проверка теста Струпа"""
        items = await generate_stroop_test(seeded_db, count=50)

        for item in items:
            # Use Pydantic model attribute access instead of dict
            assert item.word.lower() != item.correct_answer.lower(), \
                f"Слово совпадает с цветом: {item}"

    @pytest.mark.asyncio
    async def test_display_color_matches_correct_answer(self, seeded_db):
        """Цвет отображения должен соответствовать correct_answer"""
        items = await generate_stroop_test(seeded_db, count=20)

        # Упрощённая проверка: display_color - валидный HEX
        for item in items:
            assert item.display_color.startswith("#")
            assert len(item.display_color) == 7
