# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Обзор проекта

**Brain Training** — приложение для когнитивных тренировок мозга с пятью упражнениями:

1. **Счёт (Counting)** — обратный отсчёт на время
2. **Арифметика (Arithmetic)** — решение 100 математических примеров
3. **Чтение (Reading)** — чтение текста на скорость
4. **Тест Струпа (Stroop)** — определение цвета слова (50 заданий)
5. **Память (Memory)** — запоминание и воспроизведение 12 слов

## Технологический стек

### Frontend
- **React 19** + **TypeScript** (strict mode)
- **Vite 7** — сборщик
- **TailwindCSS 4** — стилизация
- **React Router v7** — маршрутизация
- **Native fetch API** — HTTP клиент (axios установлен но не используется)
- **Vitest** + React Testing Library — unit тесты
- **Playwright** — E2E тесты

### Backend
- **Python 3.11+**
- **FastAPI 0.109** — веб-фреймворк
- **SQLAlchemy 2.0 (async)** + **aiosqlite** — ORM
- **SQLite** — база данных (файл `brain_training.db`)
- **Pydantic v2** — валидация
- **pytest** с asyncio_mode=auto — тесты

## Быстрый старт

### Frontend
```bash
cd frontend
npm install
npm run dev          # Dev-сервер на http://localhost:5173
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows (на Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt
pip install -r requirements-test.txt    # Тестовые зависимости
pip install aiosqlite                    # SQLite async драйвер
python seed_data.py          # Заполнить БД тестовыми данными (удаляет старые)
uvicorn app.main:app --reload --port 8000
```

## Команды разработки

### Frontend
```bash
npm run dev                  # Dev-сервер
npm run build                # Production сборка (TypeScript check + Vite build)
npm run lint                 # ESLint проверка
npm test                     # Vitest тесты в watch-режиме
npm test -- --run            # Vitest один прогон без watch
npm run test:coverage        # Тесты с покрытием
npm run test:ui              # Vitest UI для отладки тестов
npx playwright test          # E2E тесты (требуется запущенный backend)
npx playwright test --ui     # Playwright UI mode
```

### Backend
```bash
# ВАЖНО: Всегда активировать venv перед запуском команд
cd backend
venv\Scripts\activate        # Windows

# Разработка
uvicorn app.main:app --reload           # Dev-сервер на http://localhost:8000
python seed_data.py                     # Пересоздать БД с тестовыми данными

# Тестирование
pytest                                  # Все тесты
pytest tests/test_api/                  # Только API тесты
pytest tests/test_api/test_exercises.py::test_get_arithmetic  # Один тест
pytest -v                               # Verbose вывод
pytest --cov=app                        # С покрытием кода
pytest --cov=app --cov-report=html      # HTML отчёт о покрытии
```

## Архитектура

### Backend: Слои приложения

```
app/
├── main.py              # FastAPI app + CORS + роутеры
├── config.py            # Pydantic Settings (DATABASE_URL из .env)
├── database.py          # Async SQLAlchemy engine + session factory
├── models/              # SQLAlchemy ORM модели (Base.metadata)
│   ├── exercise.py      # ExerciseType, MathProblem, ReadingText, WordList, StroopColor
│   └── result.py        # TrainingSession, ExerciseResult (relationships)
├── schemas/             # Pydantic модели для валидации
│   └── exercise.py      # Request/Response модели
├── routers/             # FastAPI endpoints (зависимость get_db)
│   ├── exercises.py     # GET /api/exercises/*
│   └── results.py       # POST /api/sessions, POST /api/results
└── services/            # Бизнес-логика (работа с БД)
    ├── math_service.py
    ├── stroop_service.py
    ├── reading_service.py
    └── memory_service.py
```

**Ключевые паттерны:**
- Все эндпоинты используют `async/await`
- Dependency injection: `db: AsyncSession = Depends(get_db)`
- Сервисы возвращают **Pydantic модели**, не dict
- Конфигурация через `pydantic-settings` с `.env`

### Frontend: Компоненты и страницы

```
src/
├── components/
│   ├── common/          # Переиспользуемые UI (Button, Card, Timer, ProgressBar)
│   └── exercises/       # 5 компонентов упражнений
├── pages/               # React Router страницы
│   ├── HomePage.tsx     # Выбор упражнения
│   ├── ExercisePage.tsx # Контейнер для упражнений (useParams)
│   └── ResultsPage.tsx  # Результаты сессии
├── services/
│   └── api.ts           # Fetch API обёртка (VITE_API_URL)
├── hooks/
│   └── useTimer.ts      # Таймер с start/stop/reset
├── types/
│   └── index.ts         # TypeScript интерфейсы
└── __tests__/           # Vitest тесты (setup.ts для jsdom)
```

**Ключевые паттерны:**
- Exercise компоненты получают `onComplete: (result: ExerciseResult) => void`
- API клиент использует **native fetch**, не axios
- Типизация через `types/index.ts` (no `any` allowed)
- URL из environment: `import.meta.env.VITE_API_URL`

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/` | Health check |
| GET | `/health` | Health check |
| GET | `/api/exercises/arithmetic` | 100 математических примеров (2 мин) |
| GET | `/api/exercises/reading` | Текст для чтения |
| GET | `/api/exercises/stroop` | 50 заданий теста Струпа (2 мин) |
| GET | `/api/exercises/memory-words` | 12 слов для запоминания |
| POST | `/api/sessions` | Создать сессию тренировки → `{id, total_score, results}` |
| GET | `/api/sessions/{id}` | Получить сессию с результатами |
| POST | `/api/results` | Сохранить результат упражнения |

## Правила разработки

### Обязательные требования
1. **Тесты обязательны** — покрытие ≥80% для нового кода
2. **TypeScript strict** — никаких `any`, все типы явно
3. **Async/await** — все эндпоинты и сервисы асинхронные
4. **Pydantic модели** — сервисы возвращают Pydantic объекты, не dict
5. **SQLite совместимость** — используем JSON вместо JSONB/ARRAY

### База данных
- SQLite с async драйвером `aiosqlite` (требует отдельной установки)
- Модели используют `JSON` вместо `ARRAY` (PostgreSQL)
- `seed_data.py` удаляет все таблицы (`drop_all`) и создаёт заново с тестовыми данными
- База пересоздаётся при каждом запуске `seed_data.py`
- Тесты используют in-memory SQLite (`:memory:`) с fixtures в `tests/conftest.py`
- **Важно (Windows):** При запуске `seed_data.py` могут появляться ошибки логирования с кириллицей (UnicodeEncodeError) - это нормально, данные всё равно сохраняются корректно

### Переменные окружения

**Frontend** (`.env` в `frontend/`):
```
VITE_API_URL=http://localhost:8000
```

**Backend** (опционально `.env` в `backend/`, по умолчанию SQLite):
```
DATABASE_URL=sqlite+aiosqlite:///./brain_training.db
```

## Статистика тестирования

- **Backend:** 39 тестов (все проходят ✅)
  - Зависимости в `requirements-test.txt`: pytest, pytest-asyncio, httpx, pytest-cov, factory-boy
  - Также требуется `aiosqlite` (устанавливается отдельно)
  - Конфигурация в `pytest.ini` (asyncio_mode=auto)
  - Запуск: `pytest --no-cov -v` (без покрытия) или `pytest` (с покрытием)
- **Frontend:** 47 тестов (все проходят ✅)
  - Vitest + React Testing Library
  - Конфигурация в `vitest.config.ts`
  - Setup в `src/__tests__/setup.ts`
  - Запуск: `npm test -- --run` (один прогон) или `npm test` (watch mode)
  - Предупреждения о `act()` можно игнорировать (тесты проходят)
- **E2E:** Playwright
  - Конфигурация в `frontend/playwright.config.ts`
  - Тесты в `frontend/e2e/`
  - Запуск: `npx playwright test`

## Контекст для отладки

### Если тесты не находят модули
```bash
# Backend - убедитесь что venv активирован
cd backend
venv\Scripts\activate
pip install -r requirements.txt
pytest
```

### Если frontend не подключается к API
1. Проверьте `.env` в `frontend/`: `VITE_API_URL=http://localhost:8000`
2. Убедитесь что backend запущен: `curl http://localhost:8000/health`
3. Перезапустите Vite dev-сервер после изменения `.env`

### Если БД пустая
```bash
cd backend
venv\Scripts\activate
python seed_data.py  # Пересоздаст таблицы и наполнит данными
```
