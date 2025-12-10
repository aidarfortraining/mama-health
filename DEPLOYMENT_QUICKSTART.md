# Render.com Deployment - Quick Start

Быстрое руководство по деплою Brain Training на Render.com (5 минут).

## Предварительные требования

- [ ] Аккаунт на [render.com](https://render.com)
- [ ] Код в Git репозитории (GitHub/GitLab/Bitbucket)
- [ ] Файл `render.yaml` в корне проекта ✅ (уже создан)

---

## Деплой за 5 шагов

### 1. Push код в репозиторий

```bash
git add .
git commit -m "Ready for Render deployment"
git push
```

### 2. Создать Blueprint в Render

1. Войти: https://dashboard.render.com/
2. **New +** → **Blueprint**
3. Подключить репозиторий
4. Render найдет `render.yaml` → **Apply**

### 3. Дождаться деплоя

Render создаст два сервиса:
- `brain-training-api` (Backend) ⏳ ~5-7 минут
- `brain-training-frontend` (Frontend) ⏳ ~3-5 минут

### 4. Настроить API_URL для Frontend

1. Скопировать URL backend:
   ```
   Пример: https://brain-training-api.onrender.com
   ```

2. Обновить в Frontend:
   ```
   Dashboard → brain-training-frontend → Environment → API_URL
   ```

3. **Save Changes** (автоматический redeploy)

### 5. Проверить работу

```bash
# Backend
curl https://brain-training-api.onrender.com/health
# Ожидается: {"status":"ok"}

# Frontend - открыть в браузере:
https://brain-training-frontend.onrender.com
```

---

## Переменные окружения

### Backend (brain-training-api)

✅ Уже настроены в `render.yaml`:

```yaml
PORT: 8000
DATABASE_URL: sqlite+aiosqlite:///./data/brain_training.db
```

### Frontend (brain-training-frontend)

⚠️ **НУЖНО НАСТРОИТЬ ВРУЧНУЮ** после первого деплоя:

```yaml
API_URL: https://brain-training-api.onrender.com
```

(Замените на ваш реальный URL backend)

---

## Локальное тестирование (опционально)

Перед деплоем можно проверить Docker образы локально:

```bash
# Полный стек
docker-compose up --build

# Откройте:
# Frontend: http://localhost
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## Troubleshooting

### Проблема: Backend не стартует

**Проверьте логи:**
```
Dashboard → brain-training-api → Logs
```

**Ищите:**
```
✅ Seed data inserted successfully!
INFO: Uvicorn running on http://0.0.0.0:8000
```

---

### Проблема: Frontend не подключается к API

**Проверьте API_URL:**
```
Dashboard → brain-training-frontend → Environment
```

**Должен быть:**
```
https://brain-training-api.onrender.com (ваш URL)
```

**НЕ должен быть:**
```
http://localhost:8000 ❌
```

---

### Проблема: Сервис "спит" (15-30 сек загрузка)

Это нормально для **Free tier** - сервисы засыпают после 15 минут неактивности.

**Решения:**
- Подождите первую загрузку
- Используйте платный план ($7/месяц)
- Настройте keep-alive пинги

---

## Полезные ссылки

- **Render Dashboard:** https://dashboard.render.com/
- **Render Docs:** https://render.com/docs
- **Подробное руководство:** См. `DEPLOYMENT.md`

---

## Структура файлов деплоя

```
mama_health/
├── render.yaml                    # Blueprint конфигурация ✅
├── docker-compose.yml             # Для локального тестирования ✅
├── DEPLOYMENT.md                  # Полное руководство ✅
├── backend/
│   ├── Dockerfile                 # Backend образ ✅
│   ├── .dockerignore              # Исключения для Docker ✅
│   └── requirements.txt
└── frontend/
    ├── Dockerfile                 # Frontend образ ✅
    ├── .dockerignore              # Исключения для Docker ✅
    ├── nginx.conf                 # Nginx конфигурация ✅
    └── package.json
```

Все файлы готовы к использованию! 🚀

---

## Команды для быстрого старта

```bash
# 1. Клонировать репозиторий (если еще не сделано)
git clone <your-repo-url>
cd mama_health

# 2. Локальное тестирование (опционально)
docker-compose up --build

# 3. Push в Git
git add .
git commit -m "Ready for deployment"
git push

# 4. Деплой в Render
# Создать Blueprint в UI: https://dashboard.render.com/
```

---

**Время деплоя:** ~10-15 минут
**Стоимость:** Free tier (0$/месяц)
**Следующие шаги:** См. `DEPLOYMENT.md` для продвинутых настроек
