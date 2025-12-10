# Brain Training API - Backend

REST API для приложения когнитивных тренировок.

## Технологии

- Python 3.11+
- FastAPI 0.109
- SQLAlchemy 2.0 (async) + aiosqlite
- **SQLite** (файл `brain_training.db`)
- Pydantic v2

## Структура

```
backend/
├── app/
│   ├── main.py              # FastAPI приложение
│   ├── config.py            # Settings
│   ├── database.py          # AsyncSession
│   ├── models/              # SQLAlchemy модели
│   ├── schemas/             # Pydantic схемы
│   ├── routers/             # API эндпоинты
│   └── services/            # Бизнес-логика
├── tests/                   # pytest тесты (39 тестов, 92% coverage)
├── seed_data.py             # Заполнение БД
└── requirements.txt
```

## Быстрый старт

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows

pip install -r requirements.txt
python seed_data.py          # Заполнить БД данными

uvicorn app.main:app --reload --port 8000
```

API: `http://localhost:8000`
Swagger: `http://localhost:8000/docs`

## API Endpoints

### Упражнения
- `GET /api/exercises/arithmetic` - 100 математических примеров
- `GET /api/exercises/reading` - Текст для чтения
- `GET /api/exercises/stroop` - 50 заданий теста Струпа
- `GET /api/exercises/memory-words` - 12 слов для запоминания

### Результаты
- `POST /api/sessions` - Создать сессию
- `GET /api/sessions/{id}` - Получить сессию с результатами
- `POST /api/results` - Сохранить результат

## Примеры запросов

```bash
# Арифметика
curl http://localhost:8000/api/exercises/arithmetic

# Создать сессию
curl -X POST http://localhost:8000/api/sessions

# Сохранить результат
curl -X POST http://localhost:8000/api/results \
  -H "Content-Type: application/json" \
  -d '{"exercise_type": "arithmetic", "score": 85, "time_seconds": 98.5, "correct_answers": 85, "total_questions": 100}'
```

## Тестирование

```bash
# Все тесты
pytest -v

# С покрытием
pytest --cov=app
```

**Результаты:** 39 тестов, 92% coverage

## Особенности

- **Рандомизация**: все упражнения возвращают случайные данные
- **Stroop Test**: цвет отображения ВСЕГДА отличается от слова
- **Async**: все операции с БД асинхронные
- **CORS**: настроен для разработки (`allow_origins=["*"]`)
