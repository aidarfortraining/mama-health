import pytest
from app.services.memory_service import get_memory_words


class TestMemoryService:

    @pytest.mark.asyncio
    async def test_returns_requested_count(self, seeded_db):
        words = await get_memory_words(seeded_db, word_count=12)
        assert len(words) == 12

    @pytest.mark.asyncio
    async def test_words_are_unique(self, seeded_db):
        """Слова не должны повторяться в одном наборе"""
        words = await get_memory_words(seeded_db, word_count=10)
        assert len(words) == len(set(words)), "Есть повторяющиеся слова"

    @pytest.mark.asyncio
    async def test_returns_list_of_strings(self, seeded_db):
        words = await get_memory_words(seeded_db, word_count=10)
        assert all(isinstance(word, str) for word in words)

    @pytest.mark.asyncio
    async def test_randomization(self, seeded_db):
        """Проверяем что порядок слов случайный"""
        words1 = await get_memory_words(seeded_db, word_count=6)
        words2 = await get_memory_words(seeded_db, word_count=6)

        # Порядок должен отличаться (с высокой вероятностью)
        # или сами слова должны быть разными
        assert words1 != words2, "Слова не рандомизированы"
