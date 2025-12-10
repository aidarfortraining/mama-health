# Brain Training

Приложение для когнитивных тренировок мозга.

## Упражнения

1. **Счёт** — обратный отсчёт на время
2. **Арифметика** — 100 математических примеров
3. **Чтение** — чтение текста на скорость
4. **Тест Струпа** — определение цвета слова (50 заданий)
5. **Память** — запоминание 12 слов

## Структура

```
mama_health/
├── frontend/    # React 19 + TypeScript
├── backend/     # FastAPI + SQLite
└── CLAUDE.md    # Руководство для AI
```

## Быстрый старт

### Backend
```bash
cd backend
# python -m venv venv && 
venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Тестирование

```bash
# Backend (39 тестов, 92% coverage)
cd backend && pytest --cov=app

# Frontend (47 тестов)
cd frontend && npm test -- --run
```

## API

| Endpoint | Описание |
|----------|----------|
| `GET /api/exercises/arithmetic` | 100 примеров |
| `GET /api/exercises/stroop` | 50 заданий Струпа |
| `GET /api/exercises/memory-words` | 12 слов |
| `GET /api/exercises/reading` | Текст |
| `POST /api/sessions` | Создать сессию |
| `POST /api/results` | Сохранить результат |
