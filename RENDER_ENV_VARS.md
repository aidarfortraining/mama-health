# Render Environment Variables Reference

Справочник всех переменных окружения для деплоя на Render.com.

---

## Backend Service (brain-training-api)

### Обязательные переменные

| Переменная | Значение | Описание |
|------------|----------|----------|
| `PORT` | `8000` | Порт для Uvicorn сервера (автоматически устанавливается Render) |
| `DATABASE_URL` | `sqlite+aiosqlite:///./data/brain_training.db` | URL подключения к базе данных |

### Опциональные переменные

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| `PYTHON_VERSION` | `3.11` | Версия Python |
| `LOG_LEVEL` | `info` | Уровень логирования (debug, info, warning, error) |

### Настройка в Render Dashboard

```
Dashboard → brain-training-api → Environment → Environment Variables
```

**Добавьте следующие переменные:**

```
PORT = 8000
DATABASE_URL = sqlite+aiosqlite:///./data/brain_training.db
```

---

## Frontend Service (brain-training-frontend)

### Обязательные переменные

| Переменная | Значение | Описание |
|------------|----------|----------|
| `API_URL` | `https://brain-training-api.onrender.com` | URL backend API сервиса |

**ВАЖНО:** Замените `brain-training-api.onrender.com` на реальный URL вашего backend сервиса!

### Настройка в Render Dashboard

```
Dashboard → brain-training-frontend → Environment → Environment Variables
```

**Добавьте следующую переменную:**

```
API_URL = https://brain-training-api.onrender.com
```

**Как получить URL backend:**

1. Откройте сервис `brain-training-api`
2. Скопируйте URL из верхней части страницы (например: `https://brain-training-api.onrender.com`)
3. Вставьте его в переменную `API_URL` для frontend сервиса

---

## Миграция на PostgreSQL (опционально)

Если вы хотите использовать PostgreSQL вместо SQLite:

### 1. Создать PostgreSQL базу

```
Dashboard → New + → PostgreSQL
```

- **Name:** `brain-training-db`
- **Region:** Oregon (тот же, что и сервисы)
- **Plan:** Free

### 2. Обновить переменные Backend

Замените `DATABASE_URL`:

```
DATABASE_URL = <Internal Database URL from PostgreSQL service>
```

**Пример:**
```
DATABASE_URL = postgresql+asyncpg://user:password@host:5432/database
```

### 3. Обновить requirements.txt

Добавьте в `backend/requirements.txt`:

```txt
asyncpg==0.29.0
```

Уже есть в requirements.txt, но убедитесь, что установлен.

---

## Environment Variables в render.yaml

Если используете Blueprint (рекомендуется), переменные уже определены в `render.yaml`:

### Backend

```yaml
envVars:
  - key: PORT
    value: 8000
  - key: DATABASE_URL
    value: sqlite+aiosqlite:///./data/brain_training.db
  - key: PYTHON_VERSION
    value: "3.11"
```

### Frontend

```yaml
envVars:
  - key: API_URL
    fromService:
      type: web
      name: brain-training-api
      envVarKey: RENDER_EXTERNAL_URL
```

**Примечание:** `fromService` автоматически получает URL backend сервиса, но может потребоваться ручная настройка после первого деплоя.

---

## Render Автоматические переменные

Render автоматически устанавливает следующие переменные:

| Переменная | Описание |
|------------|----------|
| `RENDER` | `true` (индикатор, что приложение запущено на Render) |
| `RENDER_SERVICE_ID` | ID сервиса |
| `RENDER_SERVICE_NAME` | Имя сервиса |
| `RENDER_EXTERNAL_URL` | Внешний URL сервиса (HTTPS) |
| `RENDER_INTERNAL_HOSTNAME` | Внутренний hostname для связи между сервисами |
| `RENDER_INSTANCE_ID` | ID инстанса |
| `PORT` | Порт, на котором сервис должен слушать |

Эти переменные доступны в приложении и могут использоваться для логики.

---

## Примеры использования в коде

### Backend (FastAPI)

```python
# app/config.py
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./brain_training.db")
    PORT: int = int(os.getenv("PORT", "8000"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")

    # Render-specific
    IS_RENDER: bool = os.getenv("RENDER") == "true"
    SERVICE_URL: str = os.getenv("RENDER_EXTERNAL_URL", "http://localhost:8000")

    class Config:
        env_file = ".env"

settings = Settings()
```

### Frontend (React)

```typescript
// src/services/api.ts
declare global {
  interface Window {
    ENV?: {
      VITE_API_URL?: string;
    };
  }
}

// Runtime config (Docker) или build-time config (Vite)
const API_URL = window.ENV?.VITE_API_URL
  || import.meta.env.VITE_API_URL
  || 'http://localhost:8000';

console.log('API URL:', API_URL);
```

---

## Секретные переменные

Для хранения секретов (API ключи, пароли) используйте Render Secrets:

```
Dashboard → Service → Environment → Add Secret File
```

**Пример секретного файла (.env):**

```
SECRET_KEY=your-secret-key-here
API_KEY=your-api-key-here
JWT_SECRET=your-jwt-secret-here
```

Файл будет смонтирован в контейнер и доступен через `os.getenv()`.

---

## Проверка переменных окружения

### В логах Backend

При старте сервиса вы должны увидеть:

```
INFO:     Started server process [1]
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### В логах Frontend

```
/docker-entrypoint.sh: Configuration complete; ready for start up
```

### В коде (для отладки)

**Backend:**

```python
# app/main.py
import os

@app.get("/debug/env")
async def debug_env():
    return {
        "database_url": os.getenv("DATABASE_URL", "NOT SET"),
        "port": os.getenv("PORT", "NOT SET"),
        "is_render": os.getenv("RENDER") == "true",
    }
```

**Frontend (браузерная консоль):**

```javascript
console.log('Environment:', window.ENV);
```

---

## Checklist перед деплоем

### Backend

- [ ] `PORT` установлен (8000)
- [ ] `DATABASE_URL` правильный
- [ ] Python версия совпадает с локальной

### Frontend

- [ ] `API_URL` указывает на backend сервис
- [ ] `API_URL` использует HTTPS (не HTTP)
- [ ] Backend сервис уже запущен и доступен

### Общее

- [ ] Все переменные добавлены в Render Dashboard
- [ ] Сервисы перезапущены после изменения переменных
- [ ] Health checks проходят успешно

---

## Troubleshooting

### Проблема: Frontend не подключается к Backend

**Симптомы:**
- Network errors в консоли браузера
- CORS errors

**Проверьте:**

1. Правильность `API_URL`:
   ```
   Dashboard → brain-training-frontend → Environment
   ```

2. URL должен быть с HTTPS:
   ```
   ✅ https://brain-training-api.onrender.com
   ❌ http://brain-training-api.onrender.com
   ```

3. Backend доступен:
   ```bash
   curl https://brain-training-api.onrender.com/health
   ```

### Проблема: Backend не может записать в БД

**Симптомы:**
- Ошибки при записи в SQLite
- "Permission denied" в логах

**Решение:**

Проверьте Dockerfile:
```dockerfile
RUN mkdir -p /app/data && chmod 777 /app/data
```

### Проблема: Переменные не применяются

**Решение:**

После изменения переменных нужен redeploy:

```
Dashboard → Service → Manual Deploy → Deploy latest commit
```

Или просто измените переменную и нажмите "Save Changes" - Render перезапустит сервис автоматически.

---

## Дополнительные ресурсы

- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Render Secrets](https://render.com/docs/secret-files)
- [FastAPI Settings Management](https://fastapi.tiangolo.com/advanced/settings/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Последнее обновление:** 2025-12-10
