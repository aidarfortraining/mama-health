import pytest
from httpx import AsyncClient


class TestSaveResult:
    """Тесты для POST /api/results"""

    @pytest.mark.asyncio
    async def test_save_arithmetic_result(self, client: AsyncClient):
        result_data = {
            "exercise_type": "arithmetic",
            "score": 85,
            "time_seconds": 98.5,
            "correct_answers": 85,
            "total_questions": 100
        }

        response = await client.post("/api/results", json=result_data)
        assert response.status_code == 200
        data = response.json()
        assert data["score"] == 85
        assert data["exercise_type"] == "arithmetic"

    @pytest.mark.asyncio
    async def test_save_stroop_result(self, client: AsyncClient):
        result_data = {
            "exercise_type": "stroop",
            "score": 42,
            "time_seconds": 115.0,
            "correct_answers": 42,
            "total_questions": 50
        }

        response = await client.post("/api/results", json=result_data)
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_save_result_with_details(self, client: AsyncClient):
        result_data = {
            "exercise_type": "memory",
            "score": 9,
            "time_seconds": 45.0,
            "correct_answers": 9,
            "total_questions": 12,
            "details": {"words_entered": ["яблоко", "стол", "книга"]}
        }

        response = await client.post("/api/results", json=result_data)
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_invalid_result_missing_fields(self, client: AsyncClient):
        result_data = {
            "exercise_type": "arithmetic"
            # missing required fields
        }

        response = await client.post("/api/results", json=result_data)
        assert response.status_code == 422  # Validation error


class TestSession:
    """Тесты для сессий тренировок"""

    @pytest.mark.asyncio
    async def test_create_session(self, client: AsyncClient):
        response = await client.post("/api/sessions")
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["total_score"] == 0

    @pytest.mark.asyncio
    async def test_get_session(self, client: AsyncClient):
        # Создаём сессию
        create_response = await client.post("/api/sessions")
        session_id = create_response.json()["id"]

        # Получаем сессию
        response = await client.get(f"/api/sessions/{session_id}")
        assert response.status_code == 200
        assert response.json()["id"] == session_id

    @pytest.mark.asyncio
    async def test_get_nonexistent_session(self, client: AsyncClient):
        response = await client.get("/api/sessions/99999")
        assert response.status_code == 404
