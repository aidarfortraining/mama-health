import pytest
from httpx import AsyncClient


class TestArithmeticEndpoint:
    """Тесты для GET /api/exercises/arithmetic"""

    @pytest.mark.asyncio
    async def test_returns_200(self, client: AsyncClient):
        response = await client.get("/api/exercises/arithmetic")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_returns_problems_array(self, client: AsyncClient):
        response = await client.get("/api/exercises/arithmetic")
        data = response.json()
        assert "problems" in data
        assert isinstance(data["problems"], list)

    @pytest.mark.asyncio
    async def test_returns_100_problems(self, client: AsyncClient):
        response = await client.get("/api/exercises/arithmetic")
        data = response.json()
        assert len(data["problems"]) == 100

    @pytest.mark.asyncio
    async def test_problem_structure(self, client: AsyncClient):
        response = await client.get("/api/exercises/arithmetic")
        problem = response.json()["problems"][0]
        assert "id" in problem
        assert "expression" in problem
        assert "answer" in problem

    @pytest.mark.asyncio
    async def test_answers_are_correct(self, client: AsyncClient):
        """Проверяем математическую корректность"""
        response = await client.get("/api/exercises/arithmetic")
        problems = response.json()["problems"]

        for p in problems[:20]:
            expr = p["expression"]
            expected = p["answer"]
            # Безопасное вычисление (только + и -)
            if "+" in expr:
                a, b = map(int, expr.split("+"))
                actual = a + b
            elif "-" in expr:
                a, b = map(int, expr.split("-"))
                actual = a - b
            else:
                continue

            assert actual == expected, f"Ошибка: {expr} = {expected}, ожидалось {actual}"

    @pytest.mark.asyncio
    async def test_returns_time_limit(self, client: AsyncClient):
        response = await client.get("/api/exercises/arithmetic")
        data = response.json()
        assert "time_limit_seconds" in data
        assert data["time_limit_seconds"] == 120

    @pytest.mark.asyncio
    async def test_randomization(self, client: AsyncClient):
        """Проверяем, что порядок примеров случайный"""
        response1 = await client.get("/api/exercises/arithmetic")
        response2 = await client.get("/api/exercises/arithmetic")

        ids1 = [p["id"] for p in response1.json()["problems"]]
        ids2 = [p["id"] for p in response2.json()["problems"]]

        # Порядок должен отличаться (с высокой вероятностью)
        assert ids1 != ids2, "Примеры не рандомизированы"


class TestStroopEndpoint:
    """Тесты для GET /api/exercises/stroop"""

    @pytest.mark.asyncio
    async def test_returns_200(self, client: AsyncClient):
        response = await client.get("/api/exercises/stroop")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_returns_50_items(self, client: AsyncClient):
        response = await client.get("/api/exercises/stroop")
        data = response.json()
        assert len(data["items"]) == 50

    @pytest.mark.asyncio
    async def test_item_structure(self, client: AsyncClient):
        response = await client.get("/api/exercises/stroop")
        item = response.json()["items"][0]
        assert "id" in item
        assert "word" in item
        assert "display_color" in item
        assert "correct_answer" in item

    @pytest.mark.asyncio
    async def test_color_differs_from_word(self, client: AsyncClient):
        """Ключевая проверка: цвет отображения != слово"""
        response = await client.get("/api/exercises/stroop")
        items = response.json()["items"]

        for item in items:
            word_lower = item["word"].lower()
            correct_answer = item["correct_answer"].lower()
            assert word_lower != correct_answer, \
                f"Струп-тест некорректен: слово '{item['word']}' = цвет '{item['correct_answer']}'"

    @pytest.mark.asyncio
    async def test_display_color_is_valid_hex(self, client: AsyncClient):
        """Проверяем формат цвета"""
        import re
        response = await client.get("/api/exercises/stroop")
        items = response.json()["items"]

        hex_pattern = re.compile(r'^#[0-9A-Fa-f]{6}$')
        for item in items:
            assert hex_pattern.match(item["display_color"]), \
                f"Некорректный HEX цвет: {item['display_color']}"


class TestMemoryWordsEndpoint:
    """Тесты для GET /api/exercises/memory-words"""

    @pytest.mark.asyncio
    async def test_returns_200(self, client: AsyncClient):
        response = await client.get("/api/exercises/memory-words")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_returns_correct_count(self, client: AsyncClient):
        response = await client.get("/api/exercises/memory-words")
        data = response.json()
        assert "words" in data
        assert 10 <= len(data["words"]) <= 15

    @pytest.mark.asyncio
    async def test_words_are_unique(self, client: AsyncClient):
        """Слова не должны повторяться"""
        response = await client.get("/api/exercises/memory-words")
        words = response.json()["words"]
        assert len(words) == len(set(words)), "Есть повторяющиеся слова"

    @pytest.mark.asyncio
    async def test_returns_time_limits(self, client: AsyncClient):
        response = await client.get("/api/exercises/memory-words")
        data = response.json()
        assert "memorize_time_seconds" in data
        assert "recall_time_seconds" in data


class TestReadingEndpoint:
    """Тесты для GET /api/exercises/reading"""

    @pytest.mark.asyncio
    async def test_returns_200(self, client: AsyncClient):
        response = await client.get("/api/exercises/reading")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_text_structure(self, client: AsyncClient):
        response = await client.get("/api/exercises/reading")
        data = response.json()
        assert "id" in data
        assert "content" in data
        assert "word_count" in data

    @pytest.mark.asyncio
    async def test_content_not_empty(self, client: AsyncClient):
        response = await client.get("/api/exercises/reading")
        data = response.json()
        assert len(data["content"]) > 50, "Текст слишком короткий"
