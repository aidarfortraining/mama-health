# Deployment Guide - Brain Training Application

Полное руководство по развертыванию приложения Brain Training на Render.com.

## Содержание

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Предварительные требования](#предварительные-требования)
3. [Локальное тестирование с Docker](#локальное-тестирование-с-docker)
4. [Деплой на Render.com](#деплой-на-rendercom)
5. [Переменные окружения](#переменные-окружения)
6. [Мониторинг и отладка](#мониторинг-и-отладка)
7. [Troubleshooting](#troubleshooting)

---

## Обзор архитектуры

### Компоненты приложения

```
┌─────────────────────────────────────────────────────────────┐
│                         Render.com                          │
├─────────────────────────┬───────────────────────────────────┤
│  Frontend (Web Service) │   Backend (Web Service)           │
│  - React 19 + Vite      │   - FastAPI 0.109                 │
│  - Nginx (static)       │   - SQLAlchemy 2.0 (async)        │
│  - Port: 80             │   - SQLite + aiosqlite            │
│                         │   - Port: 8000                    │
└─────────────────────────┴───────────────────────────────────┘
```

### Технологический стек

**Frontend:**
- React 19 + TypeScript (strict mode)
- Vite 7 для сборки
- TailwindCSS 4
- Nginx для статической раздачи файлов

**Backend:**
- Python 3.11+
- FastAPI 0.109
- SQLAlchemy 2.0 (async)
- SQLite с aiosqlite драйвером
- Uvicorn ASGI server

---

## Предварительные требования

### 1. Аккаунт Render.com

Зарегистрируйтесь на [render.com](https://render.com) (есть бесплатный план).

### 2. Локальные инструменты (опционально, для тестирования)

```bash
# Docker Desktop (для локального тестирования)
# Скачать: https://www.docker.com/products/docker-desktop

# Git (для деплоя из репозитория)
git --version

# Node.js 20+ (для локальной разработки)
node --version

# Python 3.11+ (для локальной разработки)
python --version
```

### 3. Репозиторий Git

Код должен быть в Git репозитории (GitHub, GitLab, или Bitbucket).

```bash
# Инициализация git (если еще не сделано)
git init
git add .
git commit -m "Initial commit: Brain Training app ready for deployment"

# Push в удаленный репозиторий
git remote add origin <your-repo-url>
git push -u origin main
```

---

## Локальное тестирование с Docker

Перед деплоем на Render рекомендуется протестировать Docker образы локально.

### 1. Тестирование Backend

```bash
# Перейти в директорию backend
cd backend

# Собрать Docker образ
docker build -t brain-training-backend .

# Запустить контейнер
docker run -p 8000:8000 \
  -e PORT=8000 \
  -e DATABASE_URL=sqlite+aiosqlite:///./data/brain_training.db \
  brain-training-backend

# Проверить работу
# В другом терминале:
curl http://localhost:8000/health
# Ожидаемый ответ: {"status":"ok"}

curl http://localhost:8000/api/exercises/arithmetic
# Должен вернуть JSON с математическими задачами
```

### 2. Тестирование Frontend

```bash
# Перейти в директорию frontend
cd frontend

# Собрать Docker образ
docker build -t brain-training-frontend .

# Запустить контейнер (предполагается, что backend уже запущен)
docker run -p 80:80 \
  -e API_URL=http://localhost:8000 \
  brain-training-frontend

# Открыть в браузере:
# http://localhost
```

### 3. Полное тестирование с docker-compose

```bash
# Из корневой директории проекта
docker-compose up --build

# Открыть в браузере:
# Frontend: http://localhost
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs

# Остановить:
# Ctrl+C, затем:
docker-compose down
```

---

## Деплой на Render.com

### Способ 1: Blueprint (Infrastructure as Code) - РЕКОМЕНДУЕТСЯ

Использует файл `render.yaml` для автоматического создания всех сервисов.

#### Шаг 1: Подготовка репозитория

```bash
# Убедитесь, что все файлы добавлены в git
git status

# Добавить новые файлы (если есть)
git add .
git commit -m "Add Render deployment configuration"
git push
```

#### Шаг 2: Создание Blueprint в Render

1. Войдите в [Render Dashboard](https://dashboard.render.com/)
2. Нажмите **"New +"** → **"Blueprint"**
3. Подключите свой Git репозиторий
4. Render автоматически обнаружит `render.yaml`
5. Проверьте конфигурацию и нажмите **"Apply"**

Render создаст два сервиса:
- `brain-training-api` (Backend)
- `brain-training-frontend` (Frontend)

#### Шаг 3: Настройка переменных окружения

После создания сервисов:

1. Откройте сервис **brain-training-frontend**
2. Перейдите в **Environment** → **Environment Variables**
3. Обновите переменную `API_URL`:
   - Скопируйте URL backend сервиса (например: `https://brain-training-api.onrender.com`)
   - Вставьте его в `API_URL`
4. Нажмите **"Save Changes"** (сервис автоматически перезапустится)

#### Шаг 4: Проверка деплоя

```bash
# Backend health check
curl https://brain-training-api.onrender.com/health

# Frontend
# Откройте в браузере:
https://brain-training-frontend.onrender.com
```

---

### Способ 2: Ручное создание сервисов

Если вы предпочитаете создавать сервисы вручную.

#### Backend Service

1. **New +** → **Web Service**
2. Подключите репозиторий
3. Настройки:
   - **Name:** `brain-training-api`
   - **Region:** Oregon (для free tier)
   - **Branch:** main
   - **Root Directory:** `backend`
   - **Runtime:** Docker
   - **Dockerfile Path:** `./backend/Dockerfile`
   - **Plan:** Free
4. **Environment Variables:**
   - `PORT`: `8000`
   - `DATABASE_URL`: `sqlite+aiosqlite:///./data/brain_training.db`
5. **Advanced:**
   - **Health Check Path:** `/health`
6. **Create Web Service**

#### Frontend Service

1. **New +** → **Web Service**
2. Подключите тот же репозиторий
3. Настройки:
   - **Name:** `brain-training-frontend`
   - **Region:** Oregon
   - **Branch:** main
   - **Root Directory:** `frontend`
   - **Runtime:** Docker
   - **Dockerfile Path:** `./frontend/Dockerfile`
   - **Plan:** Free
4. **Environment Variables:**
   - `API_URL`: `<URL вашего backend сервиса>`
     (например: `https://brain-training-api.onrender.com`)
5. **Advanced:**
   - **Health Check Path:** `/health`
6. **Create Web Service**

---

## Переменные окружения

### Backend (brain-training-api)

| Переменная | Значение | Описание | Обязательна |
|------------|----------|----------|-------------|
| `PORT` | `8000` | Порт для uvicorn (Render автоматически устанавливает) | ✅ Да |
| `DATABASE_URL` | `sqlite+aiosqlite:///./data/brain_training.db` | URL подключения к БД | ✅ Да |
| `PYTHON_VERSION` | `3.11` | Версия Python | Нет |

### Frontend (brain-training-frontend)

| Переменная | Значение | Описание | Обязательна |
|------------|----------|----------|-------------|
| `API_URL` | URL backend сервиса | URL для API запросов | ✅ Да |

**Пример:** `https://brain-training-api.onrender.com`

---

## Мониторинг и отладка

### Логи

В Render Dashboard для каждого сервиса:

1. Откройте сервис (brain-training-api или brain-training-frontend)
2. Перейдите на вкладку **"Logs"**
3. Логи обновляются в реальном времени

**Backend logs:**
```
Starting seed data...
✅ Seed data inserted successfully!
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Frontend logs:**
```
/docker-entrypoint.sh: Configuration complete; ready for start up
```

### Health Checks

Render автоматически проверяет здоровье сервисов:

```bash
# Backend
curl https://your-backend-url.onrender.com/health
# Ожидается: {"status":"ok"}

# Frontend
curl https://your-frontend-url.onrender.com/health
# Ожидается: healthy
```

### Метрики

В разделе **"Metrics"** для каждого сервиса вы увидите:
- CPU usage
- Memory usage
- Request count
- Response times

### API Documentation (Backend)

FastAPI автоматически генерирует интерактивную документацию:

```
https://your-backend-url.onrender.com/docs
```

---

## Troubleshooting

### Проблема: Backend не стартует

**Симптомы:**
- Логи показывают ошибки при запуске
- Health check fails

**Решения:**

1. **Проверьте логи:**
   ```
   Render Dashboard → brain-training-api → Logs
   ```

2. **Проверьте переменные окружения:**
   - `PORT` должен быть установлен
   - `DATABASE_URL` правильный

3. **Локальное тестирование:**
   ```bash
   cd backend
   docker build -t test-backend .
   docker run -p 8000:8000 test-backend
   ```

4. **Проверьте Dockerfile:**
   - Убедитесь, что `seed_data.py` выполняется
   - Проверьте права доступа к `/app/data`

---

### Проблема: Frontend не подключается к Backend

**Симптомы:**
- Страница загружается, но данные не приходят
- Ошибки CORS в консоли браузера
- Network errors в DevTools

**Решения:**

1. **Проверьте API_URL:**
   ```
   Render Dashboard → brain-training-frontend → Environment
   ```
   Должен быть: `https://brain-training-api.onrender.com` (ваш URL)

2. **Проверьте CORS настройки в backend:**
   В `backend/app/main.py` должно быть:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # В production укажите конкретные домены
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Проверьте в браузере:**
   ```
   DevTools → Network → Проверьте запросы к API
   ```

4. **Тест напрямую:**
   ```bash
   curl https://your-backend-url.onrender.com/api/exercises/arithmetic
   ```

---

### Проблема: Free tier "спит" (Cold Start)

**Симптомы:**
- Первый запрос очень долгий (15-30 секунд)
- "This service is currently unavailable"

**Объяснение:**
Бесплатный план Render засыпает после 15 минут неактивности.

**Решения:**

1. **Подождите:** Первый запрос "разбудит" сервис
2. **Используйте платный план:** $7/месяц для постоянной работы
3. **Настройте keep-alive:** Используйте внешний сервис для пингов (например, UptimeRobot)

---

### Проблема: База данных пустая

**Симптомы:**
- API возвращает пустые массивы
- Нет упражнений

**Решения:**

1. **Проверьте, выполнился ли seed_data.py:**
   ```
   Logs → Ищите: "✅ Seed data inserted successfully!"
   ```

2. **Проверьте права доступа:**
   В Dockerfile должно быть:
   ```dockerfile
   RUN mkdir -p /app/data && chmod 777 /app/data
   ```

3. **Ручной перезапуск:**
   ```
   Render Dashboard → brain-training-api → Manual Deploy → Deploy latest commit
   ```

---

### Проблема: Вопросы производительности

**Симптомы:**
- Медленные ответы API
- Высокое использование CPU/Memory

**Решения:**

1. **Мониторинг:**
   ```
   Render Dashboard → Metrics
   ```

2. **Оптимизация SQLite:**
   - SQLite работает в памяти диска
   - Для production рекомендуется PostgreSQL

3. **Обновление до платного плана:**
   - Больше CPU и RAM
   - Лучшая производительность

---

## Обновление приложения

### Автоматический деплой (рекомендуется)

1. Внесите изменения в код
2. Commit и push в репозиторий:
   ```bash
   git add .
   git commit -m "Update: добавлено новое упражнение"
   git push
   ```
3. Render автоматически задеплоит изменения

### Ручной деплой

```
Render Dashboard → Выберите сервис → Manual Deploy → Deploy latest commit
```

---

## Миграция на PostgreSQL (опционально)

Для production рекомендуется PostgreSQL вместо SQLite.

### Шаг 1: Создать PostgreSQL базу в Render

1. **New +** → **PostgreSQL**
2. Настройки:
   - **Name:** `brain-training-db`
   - **Region:** Oregon (тот же регион, что и сервисы)
   - **Plan:** Free
3. **Create Database**

### Шаг 2: Обновить Backend

1. Добавить в `backend/requirements.txt`:
   ```
   asyncpg==0.29.0
   ```

2. Обновить `DATABASE_URL` в Environment Variables:
   ```
   Render Dashboard → brain-training-api → Environment
   ```
   Скопировать **Internal Database URL** из PostgreSQL сервиса

3. Обновить `backend/app/config.py`:
   ```python
   DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://...")
   ```

4. Redeploy backend сервиса

---

## Полезные команды

### Docker

```bash
# Сборка образов
docker build -t backend ./backend
docker build -t frontend ./frontend

# Запуск контейнеров
docker run -p 8000:8000 backend
docker run -p 80:80 -e API_URL=http://localhost:8000 frontend

# Полный стек
docker-compose up --build

# Очистка
docker-compose down
docker system prune -a
```

### Render CLI (опционально)

```bash
# Установка
npm install -g @render-deploy/cli

# Деплой
render blueprint launch

# Логи
render logs brain-training-api
render logs brain-training-frontend
```

---

## Дополнительные ресурсы

- [Render Documentation](https://render.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Docker Documentation](https://docs.docker.com/)

---

## Поддержка

Если возникли проблемы:

1. Проверьте [Troubleshooting](#troubleshooting)
2. Изучите логи в Render Dashboard
3. Протестируйте локально с Docker
4. Проверьте переменные окружения

---

**Последнее обновление:** 2025-12-10
**Версия:** 1.0.0
