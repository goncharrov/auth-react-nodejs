# Быстрый старт с Docker

## Запуск приложения

**!!! Команды запускаются из корневой дирректории приложения !!!**

```bash
# Запуск всех сервисов
docker compose up -d --build

# Просмотр логов
docker compose logs -f

# Остановка
docker compose down
```

## Доступ к приложению

- **Frontend**: http://localhost:8008/
- **API**: http://localhost:8008/api (через nginx proxy)
- **API напрямую**: http://localhost:5005 (для отладки)
- **PostgreSQL**: localhost:5432

## Проверка работы

```bash
# Проверка статуса всех контейнеров
docker compose ps

# Проверка health checks
curl http://localhost:8008/health   # Client
curl http://localhost:5005/health   # Server
```

## Структура

- `client/Dockerfile` - Multi-stage build (Vite + Nginx)
- `server/Dockerfile` - Node.js production build
- `docker-compose.yml` - Оркестрация всех сервисов
- `.dockerignore` - Исключения для ускорения сборки

## Переменные окружения

Все переменные настроены в `docker-compose.yml`. Для изменения создайте `.env` файл на основе `.env.example`.

## Troubleshooting

Если что-то не работает:

```bash
# Пересборка с очисткой кэша
docker compose build --no-cache

# Просмотр логов конкретного сервиса
docker compose logs -f server
docker compose logs -f client
docker compose logs -f db

# Перезапуск сервиса
docker compose restart server
```
