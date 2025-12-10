# Docker Commands Reference

Справочник команд для работы с Docker образами и контейнерами.

## Локальное тестирование

### Полный стек (docker-compose)

```bash
# Запуск всех сервисов
docker-compose up

# Запуск с пересборкой образов
docker-compose up --build

# Запуск в фоновом режиме
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down

# Остановка с удалением volumes (БД будет очищена)
docker-compose down -v
```

### Backend (отдельно)

```bash
# Перейти в директорию backend
cd backend

# Собрать образ
docker build -t brain-training-backend .

# Запустить контейнер
docker run -p 8000:8000 \
  -e PORT=8000 \
  -e DATABASE_URL=sqlite+aiosqlite:///./data/brain_training.db \
  --name backend \
  brain-training-backend

# Запустить с volume для сохранения БД
docker run -p 8000:8000 \
  -e PORT=8000 \
  -e DATABASE_URL=sqlite+aiosqlite:///./data/brain_training.db \
  -v backend-data:/app/data \
  --name backend \
  brain-training-backend

# Просмотр логов
docker logs backend

# Просмотр логов в реальном времени
docker logs -f backend

# Остановить
docker stop backend

# Удалить контейнер
docker rm backend

# Зайти внутрь контейнера (для отладки)
docker exec -it backend /bin/bash
```

### Frontend (отдельно)

```bash
# Перейти в директорию frontend
cd frontend

# Собрать образ
docker build -t brain-training-frontend .

# Запустить контейнер
docker run -p 80:80 \
  -e API_URL=http://localhost:8000 \
  --name frontend \
  brain-training-frontend

# Запустить на другом порту (например 3000)
docker run -p 3000:80 \
  -e API_URL=http://localhost:8000 \
  --name frontend \
  brain-training-frontend

# Просмотр логов
docker logs frontend

# Остановить
docker stop frontend

# Удалить контейнер
docker rm frontend

# Зайти внутрь контейнера
docker exec -it frontend /bin/sh
```

## Проверка работоспособности

### Backend

```bash
# Health check
curl http://localhost:8000/health

# Получить упражнения
curl http://localhost:8000/api/exercises/arithmetic
curl http://localhost:8000/api/exercises/reading
curl http://localhost:8000/api/exercises/stroop
curl http://localhost:8000/api/exercises/memory-words

# API документация (открыть в браузере)
open http://localhost:8000/docs

# Windows
start http://localhost:8000/docs
```

### Frontend

```bash
# Открыть в браузере
open http://localhost

# Windows
start http://localhost

# Health check
curl http://localhost/health
```

## Отладка

### Просмотр образов

```bash
# Список всех образов
docker images

# Удалить образ
docker rmi brain-training-backend
docker rmi brain-training-frontend

# Удалить все неиспользуемые образы
docker image prune -a
```

### Просмотр контейнеров

```bash
# Список запущенных контейнеров
docker ps

# Список всех контейнеров (включая остановленные)
docker ps -a

# Статистика использования ресурсов
docker stats

# Остановить все контейнеры
docker stop $(docker ps -q)

# Удалить все контейнеры
docker rm $(docker ps -aq)
```

### Логи и отладка

```bash
# Просмотр логов контейнера
docker logs <container_name>

# Логи в реальном времени
docker logs -f <container_name>

# Последние 100 строк логов
docker logs --tail 100 <container_name>

# Запустить команду внутри контейнера
docker exec <container_name> <command>

# Открыть shell внутри контейнера
docker exec -it <container_name> /bin/bash  # для backend
docker exec -it <container_name> /bin/sh    # для frontend (alpine)

# Скопировать файл из контейнера
docker cp <container_name>:/path/to/file ./local/path

# Скопировать файл в контейнер
docker cp ./local/file <container_name>:/path/to/destination
```

### Volumes (данные)

```bash
# Список volumes
docker volume ls

# Создать volume
docker volume create backend-data

# Удалить volume
docker volume rm backend-data

# Удалить все неиспользуемые volumes
docker volume prune

# Информация о volume
docker volume inspect backend-data
```

### Сети

```bash
# Список сетей
docker network ls

# Создать сеть
docker network create brain-training-network

# Подключить контейнер к сети
docker network connect brain-training-network <container_name>

# Отключить контейнер от сети
docker network disconnect brain-training-network <container_name>
```

## Очистка системы

```bash
# Удалить все остановленные контейнеры
docker container prune

# Удалить все неиспользуемые образы
docker image prune -a

# Удалить все неиспользуемые volumes
docker volume prune

# Удалить все неиспользуемые сети
docker network prune

# Полная очистка системы (контейнеры, образы, volumes, сети)
docker system prune -a --volumes

# Показать использование диска
docker system df
```

## Продвинутые сценарии

### Мультиплатформенная сборка (ARM + x86)

```bash
# Создать builder для мультиплатформенной сборки
docker buildx create --name multiplatform --use

# Собрать для ARM и x86
docker buildx build --platform linux/amd64,linux/arm64 -t brain-training-backend .

# Собрать и push в registry
docker buildx build --platform linux/amd64,linux/arm64 \
  -t myregistry/brain-training-backend:latest \
  --push .
```

### Оптимизация размера образов

```bash
# Проверить размер образа
docker images brain-training-backend

# Проверить слои образа
docker history brain-training-backend

# Использовать dive для анализа слоев
# Установка: https://github.com/wagoodman/dive
dive brain-training-backend
```

### Docker Compose с профилями

```yaml
# docker-compose.yml с профилями
services:
  backend:
    profiles: ["backend", "all"]
    # ...

  frontend:
    profiles: ["frontend", "all"]
    # ...
```

```bash
# Запустить только backend
docker-compose --profile backend up

# Запустить только frontend
docker-compose --profile frontend up

# Запустить всё
docker-compose --profile all up
```

## Переменные окружения

### Передача переменных

```bash
# Через -e флаг
docker run -e PORT=8000 -e DEBUG=true brain-training-backend

# Через env файл
docker run --env-file .env brain-training-backend

# Через docker-compose
docker-compose --env-file .env.production up
```

### Пример .env файла

```bash
# .env.production
PORT=8000
DATABASE_URL=sqlite+aiosqlite:///./data/brain_training.db
API_URL=https://api.example.com
```

## CI/CD Integration

### GitHub Actions пример

```yaml
# .github/workflows/docker.yml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build backend
        run: docker build -t brain-training-backend ./backend

      - name: Build frontend
        run: docker build -t brain-training-frontend ./frontend

      - name: Test backend
        run: |
          docker run -d -p 8000:8000 --name backend brain-training-backend
          sleep 10
          curl http://localhost:8000/health
```

## Полезные алиасы

Добавьте в `.bashrc` или `.zshrc`:

```bash
# Docker aliases
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias dl='docker logs'
alias dlf='docker logs -f'
alias dex='docker exec -it'
alias dstop='docker stop'
alias drm='docker rm'
alias drmi='docker rmi'

# Cleanup aliases
alias dprune='docker system prune -af --volumes'
alias dclean='docker stop $(docker ps -aq) && docker rm $(docker ps -aq)'

# Brain Training specific
alias bt-up='docker-compose up --build'
alias bt-down='docker-compose down'
alias bt-logs='docker-compose logs -f'
alias bt-backend='docker exec -it backend /bin/bash'
alias bt-frontend='docker exec -it frontend /bin/sh'
```

## Troubleshooting

### Проблема: Port already in use

```bash
# Найти процесс, использующий порт 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Остановить контейнер, использующий порт
docker stop $(docker ps -q --filter "publish=8000")
```

### Проблема: No space left on device

```bash
# Очистить неиспользуемые данные
docker system prune -a --volumes

# Проверить использование диска
docker system df
```

### Проблема: Cannot connect to Docker daemon

```bash
# Запустить Docker Desktop
# Или запустить Docker daemon на Linux:
sudo systemctl start docker
```

### Проблема: Image build fails

```bash
# Собрать без кеша
docker build --no-cache -t brain-training-backend ./backend

# Подробный вывод при сборке
docker build --progress=plain -t brain-training-backend ./backend
```

---

**Полезные ссылки:**

- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
