# CLAUDE.md

Руководство для Claude Code / AI агентов при работе с проектом Brain Training.

## Обзор проекта

**Brain Training** — приложение для когнитивных тренировок мозга с пятью упражнениями:

1. **Счёт (Counting)** — обратный отсчёт на время
2. **Арифметика (Arithmetic)** — решение 100 математических примеров
3. **Чтение (Reading)** — чтение текста на скорость
4. **Тест Струпа (Stroop)** — определение цвета слова (50 заданий)
5. **Память (Memory)** — запоминание и воспроизведение 12 слов

## Структура проекта

```
mama_health/
├── frontend/                  # React 19 + TypeScript SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Button, Card, Timer, ProgressBar
│   │   │   └── exercises/     # 5 компонентов упражнений
│   │   ├── pages/             # HomePage, ExercisePage, ResultsPage
│   │   ├── services/          # API клиент (axios)
│   │   ├── hooks/             # useTimer и др.
│   │   └── __tests__/         # Vitest тесты
│   └── e2e/                   # Playwright E2E тесты
│
├── backend/                   # FastAPI + SQLite
│   ├── app/
│   │   ├── main.py            # FastAPI приложение
│   │   ├── database.py        # Async SQLite подключение
│   │   ├── models/            # SQLAlchemy модели
│   │   ├── schemas/           # Pydantic схемы
│   │   ├── routers/           # API эндпоинты
│   │   └── services/          # Бизнес-логика
│   └── tests/                 # pytest тесты (39 тестов, 92% coverage)
│
├── testing/                   # Документация по тестированию
└── devops/                    # Конфигурации деплоя
```

## Технологический стек

### Frontend
- **React 19** + **TypeScript**
- **Vite 7** — сборщик
- **TailwindCSS 4** — стилизация
- **React Router v7** — маршрутизация
- **Axios** — HTTP клиент
- **Vitest** + React Testing Library — unit тесты (47 тестов)
- **Playwright** — E2E тесты

### Backend
- **Python 3.11+**
- **FastAPI 0.109** — веб-фреймворк
- **SQLAlchemy 2.0 (async)** + **aiosqlite** — ORM
- **SQLite** — база данных (файл `brain_training.db`)
- **Pydantic v2** — валидация
- **pytest** — тесты (39 тестов, 92% coverage)

## Быстрый старт

### Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python seed_data.py          # Заполнить БД
uvicorn app.main:app --reload --port 8000
```

## Команды разработки

### Frontend
```bash
npm run dev           # Dev-сервер
npm run build         # Production сборка
npm run lint          # ESLint
npm test              # Unit тесты
npm run test:coverage # Тесты с покрытием
```

### Backend
```bash
uvicorn app.main:app --reload    # Dev-сервер
pytest                           # Все тесты
pytest --cov=app                 # Тесты с покрытием
```

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/` | Health check |
| GET | `/api/exercises/arithmetic` | 100 математических примеров |
| GET | `/api/exercises/reading` | Текст для чтения |
| GET | `/api/exercises/stroop` | 50 заданий теста Струпа |
| GET | `/api/exercises/memory-words` | 12 слов для запоминания |
| POST | `/api/sessions` | Создать сессию тренировки |
| GET | `/api/sessions/{id}` | Получить сессию с результатами |
| POST | `/api/results` | Сохранить результат упражнения |

## Ключевые паттерны

### Компоненты упражнений
```typescript
// frontend/src/components/exercises/ArithmeticExercise.tsx
interface Props {
  onComplete: (result: ExerciseResult) => void;
}
```

### API сервис
```typescript
// frontend/src/services/api.ts
const response = await api.get('/api/exercises/arithmetic');
```

### Async бэкенд
```python
# Все эндпоинты используют async/await
@router.get("/exercises/arithmetic")
async def get_arithmetic(db: AsyncSession = Depends(get_db)):
    ...
```

## Правила для агента

1. **Тесты обязательны** — покрытие ≥80%
2. **TypeScript strict** — никаких `any`
3. **Pydantic модели** — сервисы возвращают Pydantic объекты, не dict

## Переменные окружения

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend (.env)
```
DATABASE_URL=sqlite+aiosqlite:///./brain_training.db
```
