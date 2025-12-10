# Brain Training

Приложение для когнитивных тренировок мозга с пятью упражнениями на скорость и точность.

## 🧠 Упражнения

1. **Счёт** — обратный отсчёт на время
2. **Арифметика** — 100 математических примеров за 2 минуты
3. **Чтение** — чтение текста на скорость
4. **Тест Струпа** — определение цвета слова (50 заданий за 2 минуты)
5. **Память** — запоминание и воспроизведение 12 слов

## 🚀 Технологический стек

### Frontend
- **React 19** + TypeScript (strict mode)
- **Vite 7** для сборки
- **TailwindCSS 4** для стилизации
- **React Router v7** для навигации

### Backend
- **FastAPI 0.109** (Python 3.11+)
- **SQLAlchemy 2.0** (async) + SQLite
- **Pydantic v2** для валидации
- **Uvicorn** ASGI сервер

### Testing & DevOps
- **Vitest** + React Testing Library (47 тестов)
- **pytest** + httpx (39 тестов)
- **Docker** + docker-compose
- **Render.com** для деплоя

## 📦 Быстрый старт

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate              # Windows
# source venv/bin/activate         # Linux/Mac

pip install -r requirements.txt
pip install aiosqlite             # SQLite async driver
python seed_data.py               # Создать БД с тестовыми данными
uvicorn app.main:app --reload     # http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                       # http://localhost:5173
```

### API Documentation
После запуска backend откройте: http://localhost:8000/docs

## 🐳 Docker (локальное тестирование)

```bash
# Запустить полный стек
docker-compose up --build

# Доступно:
# Frontend: http://localhost
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs

# Остановить
docker-compose down
```

## 🌐 Деплой на Render.com

Проект готов к деплою на Render.com с помощью Blueprint (`render.yaml`).

### Быстрый деплой (5 минут)

1. **Push в GitHub:**
   ```bash
   git push origin main
   ```

2. **Создать Blueprint в Render:**
   - Зайти: https://dashboard.render.com/
   - **New +** → **Blueprint**
   - Подключить репозиторий
   - Render найдет `render.yaml` → **Apply**

3. **Дождаться деплоя** (~7-10 минут)
   - Backend: `brain-training-api`
   - Frontend: `brain-training-frontend`

4. **Проверить:**
   ```bash
   curl https://brain-training-api.onrender.com/health
   # Ожидается: {"status":"ok"}
   ```

### Production URLs
- **Frontend:** https://brain-training-frontend.onrender.com
- **Backend API:** https://brain-training-api.onrender.com
- **API Docs:** https://brain-training-api.onrender.com/docs

### Переменные окружения

Уже настроены в `render.yaml`, но можно изменить в Render Dashboard:

**Backend:**
```
PORT=8000
DATABASE_URL=sqlite+aiosqlite:///./data/brain_training.db
```

**Frontend:**
```
API_URL=https://brain-training-api.onrender.com
```

## 🧪 Тестирование

### Backend (39 тестов)
```bash
cd backend
pytest                            # Все тесты
pytest --cov=app                  # С покрытием кода
pytest tests/test_api/            # Только API тесты
pytest -v                         # Verbose вывод
```

### Frontend (47 тестов)
```bash
cd frontend
npm test                          # Watch mode
npm test -- --run                 # Один прогон
npm run test:coverage             # С покрытием
```

### Linting
```bash
cd frontend
npm run lint                      # ESLint
npm run build                     # TypeScript check + build
```

## 📚 API Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/` | Health check |
| GET | `/health` | Health check |
| GET | `/api/exercises/arithmetic` | 100 математических примеров |
| GET | `/api/exercises/reading` | Текст для чтения |
| GET | `/api/exercises/stroop` | 50 заданий теста Струпа |
| GET | `/api/exercises/memory-words` | 12 слов для запоминания |
| POST | `/api/sessions` | Создать сессию тренировки |
| GET | `/api/sessions/{id}` | Получить сессию с результатами |
| POST | `/api/results` | Сохранить результат упражнения |

## 📁 Структура проекта

```
mama_health/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS + роутеры
│   │   ├── config.py            # Pydantic Settings
│   │   ├── database.py          # Async SQLAlchemy
│   │   ├── models/              # ORM модели
│   │   ├── schemas/             # Pydantic схемы
│   │   ├── routers/             # API endpoints
│   │   └── services/            # Бизнес-логика
│   ├── tests/                   # Pytest тесты
│   ├── Dockerfile               # Multi-stage production build
│   ├── requirements.txt         # Python зависимости
│   └── seed_data.py             # Наполнение БД данными
├── frontend/
│   ├── src/
│   │   ├── components/          # React компоненты
│   │   ├── pages/               # React Router страницы
│   │   ├── services/            # API клиент
│   │   ├── hooks/               # Custom hooks
│   │   └── types/               # TypeScript типы
│   ├── public/
│   │   └── env-config.js        # Runtime env для Docker
│   ├── Dockerfile               # Multi-stage Nginx build
│   ├── nginx.conf               # Production Nginx config
│   └── package.json
├── docker-compose.yml           # Локальное тестирование
├── render.yaml                  # Render.com Blueprint (IaC)
├── CLAUDE.md                    # Руководство для Claude Code
└── README.md                    # Этот файл
```

## 🔧 Команды разработки

### Backend
```bash
# Разработка
uvicorn app.main:app --reload

# Пересоздать БД
python seed_data.py

# Тесты
pytest
pytest --cov=app --cov-report=html   # HTML отчёт
```

### Frontend
```bash
# Разработка
npm run dev

# Production build
npm run build

# Тесты
npm test
npm run test:ui                      # Vitest UI

# Linting
npm run lint
```

### Docker
```bash
# Локальный стек
docker-compose up --build

# Остановить и удалить
docker-compose down

# Посмотреть логи
docker-compose logs -f

# Пересобрать один сервис
docker-compose up --build frontend
```

## 🛠️ Ключевые технические детали

### Backend
- Все эндпоинты асинхронные (`async/await`)
- Dependency injection через FastAPI `Depends()`
- Сервисы возвращают Pydantic модели, не dict
- SQLite с async драйвером `aiosqlite`
- CORS настроен для development и production

### Frontend
- TypeScript strict mode (no `any` allowed)
- API клиент использует native fetch, не axios
- Runtime environment configuration для Docker
- Exercise компоненты получают `onComplete` callback
- Все состояния типизированы через `types/index.ts`

### DevOps
- Multi-stage Docker builds (оптимизация размера)
- Health checks для auto-monitoring
- Auto-deploy при push в main
- Production-ready Nginx конфигурация
- Gzip compression и security headers

## 📝 Разработка

Подробная документация для разработчиков и Claude Code:
- **CLAUDE.md** - архитектура, паттерны, правила разработки

## 🐛 Troubleshooting

### Frontend не подключается к API
```bash
# Проверьте .env в frontend/
echo "VITE_API_URL=http://localhost:8000" > frontend/.env

# Перезапустите Vite dev server
```

### Backend ошибка с БД
```bash
# Пересоздайте БД
cd backend
python seed_data.py
```

### Docker проблемы
```bash
# Очистить всё и начать заново
docker-compose down -v
docker-compose up --build
```

## 📄 Лицензия

MIT

## 🤝 Контрибьюция

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

**Статус:** ✅ Production Ready
**Deployment:** Render.com (Free Tier compatible)
**Tests:** 86 тестов (все проходят)
