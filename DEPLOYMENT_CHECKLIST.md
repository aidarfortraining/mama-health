# Deployment Checklist

Используйте этот чеклист для проверки готовности к деплою на Render.com.

---

## Предварительная подготовка

### Файлы конфигурации

- [x] `render.yaml` - Blueprint конфигурация
- [x] `docker-compose.yml` - Локальное тестирование
- [x] `backend/Dockerfile` - Backend образ
- [x] `backend/.dockerignore` - Исключения Docker
- [x] `frontend/Dockerfile` - Frontend образ
- [x] `frontend/.dockerignore` - Исключения Docker
- [x] `frontend/nginx.conf` - Nginx конфигурация
- [x] `frontend/public/env-config.js` - Runtime config

### Документация

- [x] `DEPLOYMENT_QUICKSTART.md` - Быстрый старт
- [x] `DEPLOYMENT.md` - Полное руководство
- [x] `DEPLOYMENT_SUMMARY.md` - Архитектура и сводка
- [x] `RENDER_ENV_VARS.md` - Справочник переменных
- [x] `DOCKER_COMMANDS.md` - Docker команды
- [x] `DEPLOYMENT_README.md` - Краткий README
- [x] `DEPLOYMENT_CHECKLIST.md` - Этот файл

### Изменения в коде

- [x] `frontend/index.html` - Поддержка runtime config
- [x] `frontend/src/services/api.ts` - window.ENV support
- [x] `.gitignore` - Обновлен для Docker

---

## Перед деплоем

### 1. Git репозиторий

- [ ] Код в Git репозитории (GitHub/GitLab/Bitbucket)
- [ ] Все изменения закоммичены
- [ ] Код запушен в main/master ветку

```bash
git status
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Локальное тестирование

- [ ] Docker Desktop установлен и запущен
- [ ] Протестирован docker-compose

```bash
docker-compose up --build

# Проверка:
# Frontend: http://localhost
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

- [ ] Backend health check работает
- [ ] Frontend загружается
- [ ] API запросы от frontend к backend работают
- [ ] Упражнения загружаются корректно

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/exercises/arithmetic
curl http://localhost/health
```

### 3. Аккаунт Render.com

- [ ] Зарегистрирован аккаунт на [render.com](https://render.com)
- [ ] Email подтвержден
- [ ] Git репозиторий может быть подключен

---

## Deployment процесс

### 1. Создание Blueprint

- [ ] Вход в Render Dashboard: https://dashboard.render.com/
- [ ] Нажать **"New +"** → **"Blueprint"**
- [ ] Подключить Git репозиторий
- [ ] Render обнаружил `render.yaml`
- [ ] Проверена конфигурация
- [ ] Нажать **"Apply"**

### 2. Мониторинг деплоя

#### Backend Service (brain-training-api)

- [ ] Сборка Docker образа началась
- [ ] Сборка завершилась успешно
- [ ] Сервис запущен
- [ ] Health check проходит
- [ ] URL сервиса получен (скопировать!)

**URL Backend:** `_________________________`

#### Frontend Service (brain-training-frontend)

- [ ] Сборка Docker образа началась
- [ ] Сборка завершилась успешно
- [ ] Сервис запущен
- [ ] Health check проходит
- [ ] URL сервиса получен

**URL Frontend:** `_________________________`

### 3. Настройка Environment Variables

#### Frontend API_URL

- [ ] Открыть `brain-training-frontend` в Dashboard
- [ ] Перейти в **Environment** → **Environment Variables**
- [ ] Найти переменную `API_URL`
- [ ] Обновить значение на URL backend сервиса
- [ ] **Save Changes**
- [ ] Дождаться автоматического redeploy

**Значение API_URL:** `https://brain-training-api.onrender.com`

---

## Проверка работоспособности

### Backend API

- [ ] Health check endpoint работает

```bash
curl https://brain-training-api.onrender.com/health
# Expected: {"status":"ok"}
```

- [ ] API endpoints доступны

```bash
curl https://brain-training-api.onrender.com/api/exercises/arithmetic
curl https://brain-training-api.onrender.com/api/exercises/reading
curl https://brain-training-api.onrender.com/api/exercises/stroop
curl https://brain-training-api.onrender.com/api/exercises/memory-words
```

- [ ] API документация доступна

```
https://brain-training-api.onrender.com/docs
```

### Frontend

- [ ] Health check endpoint работает

```bash
curl https://brain-training-frontend.onrender.com/health
# Expected: healthy
```

- [ ] Приложение загружается в браузере
- [ ] Главная страница отображается корректно
- [ ] Список упражнений виден

### Интеграция Frontend + Backend

- [ ] Открыть DevTools → Network
- [ ] Перейти на страницу упражнения
- [ ] API запросы к backend успешны (HTTP 200)
- [ ] Данные упражнений загружаются
- [ ] Нет CORS ошибок в консоли

### Функциональное тестирование

- [ ] **Счёт (Counting)** - упражнение работает
- [ ] **Арифметика (Arithmetic)** - задачи загружаются
- [ ] **Чтение (Reading)** - текст отображается
- [ ] **Тест Струпа (Stroop)** - цвета загружаются
- [ ] **Память (Memory)** - слова загружаются
- [ ] Результаты сохраняются (POST /api/results)

---

## Post-Deployment

### Документирование

- [ ] Записать URLs сервисов
- [ ] Обновить README с production URLs
- [ ] Поделиться URLs с командой
- [ ] Добавить URLs в документацию проекта

### Мониторинг

- [ ] Настроить uptime monitoring (опционально)
  - Рекомендуется: [UptimeRobot](https://uptimerobot.com/) (free tier)
- [ ] Добавить error tracking (опционально)
  - Рекомендуется: [Sentry](https://sentry.io/) (free tier)
- [ ] Настроить уведомления в Render Dashboard

### Security

- [ ] Проверить CORS настройки в production
- [ ] Убедиться что секретные данные не в коде
- [ ] HTTPS работает (автоматически на Render)
- [ ] Security headers настроены (уже в nginx.conf)

### Performance

- [ ] Проверить время загрузки страниц
- [ ] Проверить время ответа API
- [ ] Мониторинг CPU/Memory в Render Dashboard
- [ ] Gzip compression работает (проверить в DevTools)

---

## Known Issues (Free Tier)

### Cold Start

- [x] **Осведомлен:** Сервисы засыпают после 15 минут неактивности
- [x] **Осведомлен:** Первый запрос после сна занимает 15-30 секунд
- [ ] **Решение (если нужно):** Upgrade до платного плана или настроить keep-alive пинги

### Ephemeral Storage

- [x] **Осведомлен:** SQLite база на ephemeral диске
- [x] **Осведомлен:** Данные пересоздаются при каждом деплое
- [ ] **Решение (если нужно):** Мигрировать на PostgreSQL для персистентности

---

## Troubleshooting

Если что-то пошло не так, проверьте:

### Backend Issues

- [ ] Проверить логи: `Dashboard → brain-training-api → Logs`
- [ ] Искать: "✅ Seed data inserted successfully!"
- [ ] Искать: "INFO: Uvicorn running on http://0.0.0.0:8000"
- [ ] Проверить Environment Variables (PORT, DATABASE_URL)
- [ ] Попробовать Manual Deploy

### Frontend Issues

- [ ] Проверить логи: `Dashboard → brain-training-frontend → Logs`
- [ ] Проверить API_URL правильность
- [ ] API_URL должен быть HTTPS, не HTTP
- [ ] Backend должен быть доступен
- [ ] Проверить DevTools → Console на ошибки

### Integration Issues

- [ ] CORS настройки в backend/app/main.py
- [ ] Backend health check проходит
- [ ] Frontend может достучаться до backend
- [ ] Проверить Network tab в DevTools

**Подробное руководство:** См. [DEPLOYMENT.md](./DEPLOYMENT.md) → Troubleshooting

---

## Upgrade to Production

Когда готовы к production:

- [ ] Upgrade Backend to paid plan ($7/месяц)
- [ ] Upgrade Frontend to paid plan ($7/месяц)
- [ ] Мигрировать на PostgreSQL
- [ ] Настроить custom domain
- [ ] Добавить monitoring (Sentry + UptimeRobot)
- [ ] Настроить automated backups
- [ ] Обновить CORS для specific origins
- [ ] Добавить rate limiting
- [ ] Настроить CI/CD pipeline

**Подробнее:** См. [DEPLOYMENT.md](./DEPLOYMENT.md) → Production Recommendations

---

## Finalization

- [ ] Все тесты пройдены
- [ ] Приложение работает стабильно
- [ ] URLs задокументированы
- [ ] Команда проинформирована
- [ ] Мониторинг настроен

---

## URLs Reference

Заполните после деплоя:

```
Backend API:       https://_______________________.onrender.com
Backend API Docs:  https://_______________________.onrender.com/docs
Frontend App:      https://_______________________.onrender.com
Render Dashboard:  https://dashboard.render.com/

Custom Domain:     https://_______________________ (если настроено)
```

---

## Support Resources

- **Quick Start:** [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md)
- **Full Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Environment Vars:** [RENDER_ENV_VARS.md](./RENDER_ENV_VARS.md)
- **Docker Commands:** [DOCKER_COMMANDS.md](./DOCKER_COMMANDS.md)
- **Summary:** [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

---

**Deployment Status:** [ ] Not Started | [ ] In Progress | [ ] Completed ✅

**Deployed By:** ___________________

**Deployment Date:** ___________________

**Notes:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```
