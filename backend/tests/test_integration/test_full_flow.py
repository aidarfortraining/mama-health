import pytest
from httpx import AsyncClient


class TestFullTrainingFlow:
    """Интеграционные тесты полного флоу тренировки"""

    @pytest.mark.asyncio
    async def test_complete_training_session(self, client: AsyncClient):
        """Тест полного цикла: создание сессии -> упражнения -> результаты"""

        # 1. Создаём сессию
        session_response = await client.post("/api/sessions")
        assert session_response.status_code == 200
        session_id = session_response.json()["id"]

        # 2. Получаем упражнение по арифметике
        arithmetic_response = await client.get("/api/exercises/arithmetic")
        assert arithmetic_response.status_code == 200
        problems = arithmetic_response.json()["problems"]
        assert len(problems) == 50

        # 3. Сохраняем результат арифметики
        arithmetic_result = {
            "session_id": session_id,
            "exercise_type": "arithmetic",
            "score": 85,
            "time_seconds": 110.5,
            "correct_answers": 85,
            "total_questions": 100
        }
        result_response = await client.post("/api/results", json=arithmetic_result)
        assert result_response.status_code == 200

        # 4. Получаем тест Струпа
        stroop_response = await client.get("/api/exercises/stroop")
        assert stroop_response.status_code == 200
        stroop_items = stroop_response.json()["items"]

        # Критическая проверка Струпа
        for item in stroop_items:
            assert item["word"].lower() != item["correct_answer"].lower()

        # 5. Сохраняем результат Струпа
        stroop_result = {
            "session_id": session_id,
            "exercise_type": "stroop",
            "score": 42,
            "time_seconds": 95.0,
            "correct_answers": 42,
            "total_questions": 50
        }
        stroop_result_response = await client.post("/api/results", json=stroop_result)
        assert stroop_result_response.status_code == 200

        # 6. Проверяем сессию
        session_check = await client.get(f"/api/sessions/{session_id}")
        assert session_check.status_code == 200
        session_data = session_check.json()
        assert session_data["id"] == session_id
        assert session_data["total_score"] > 0  # Должен быть накопленный счёт

    @pytest.mark.asyncio
    async def test_all_exercises_accessible(self, client: AsyncClient):
        """Проверяем что все упражнения доступны"""

        endpoints = [
            "/api/exercises/arithmetic",
            "/api/exercises/stroop",
            "/api/exercises/memory-words",
            "/api/exercises/reading",
        ]

        for endpoint in endpoints:
            response = await client.get(endpoint)
            assert response.status_code == 200, f"Эндпоинт {endpoint} недоступен"

    @pytest.mark.asyncio
    async def test_multiple_sessions_independent(self, client: AsyncClient):
        """Проверяем что разные сессии независимы"""

        # Создаём две сессии
        session1 = await client.post("/api/sessions")
        session2 = await client.post("/api/sessions")

        id1 = session1.json()["id"]
        id2 = session2.json()["id"]

        assert id1 != id2, "Сессии должны иметь разные ID"

        # Сохраняем результаты в разные сессии
        result1 = {
            "session_id": id1,
            "exercise_type": "arithmetic",
            "score": 85,
            "time_seconds": 100.0,
            "correct_answers": 85,
            "total_questions": 100
        }

        result2 = {
            "session_id": id2,
            "exercise_type": "arithmetic",
            "score": 75,
            "time_seconds": 120.0,
            "correct_answers": 75,
            "total_questions": 100
        }

        await client.post("/api/results", json=result1)
        await client.post("/api/results", json=result2)

        # Проверяем что результаты сохранились отдельно
        session1_data = await client.get(f"/api/sessions/{id1}")
        session2_data = await client.get(f"/api/sessions/{id2}")

        assert session1_data.json()["total_score"] != session2_data.json()["total_score"]
