## Установка и настройка

### 1. Клонирование и установка зависимостей

```bash
# Установка зависимостей для всех частей проекта
npm run install-all
```

Или вручную:

```bash
# Бэкенд
cd server
npm install

# Фронтенд
cd ../client
npm install
```

### 2. Настройка PostgreSQL

Убедитесь, что PostgreSQL запущен и доступен:

```bash
# Проверка статуса PostgreSQL (Linux)
sudo systemctl status postgresql

# Запуск PostgreSQL (если не запущен)
sudo systemctl start postgresql
```

Создайте базу данных и пользователя:

```sql
-- Подключитесь к PostgreSQL как суперпользователь
psql -U postgres

-- Создайте базу данных
CREATE DATABASE auth_react;

-- Создайте пользователя (если еще не создан)
CREATE USER username WITH PASSWORD 'password123';

-- Предоставьте права пользователю
GRANT ALL PRIVILEGES ON DATABASE auth_react TO username;

-- Выход
\q
```

### 3. Настройка переменных окружения

Скопируйте файл `.env.example` в `.env` в папке `server/`:

```bash
cd server
cp .env.example .env
```

Отредактируйте `server/.env` и укажите правильные параметры подключения к БД:

```env
# Сервер
PORT=5005
NODE_ENV=development

# База данных PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_react
DB_USER=username
DB_PASSWORD=password123

# Сессии
SESSION_SECRET=my-secret-key
```

**Важно:** Измените `SESSION_SECRET` на случайную строку в продакшене!

### 4. Инициализация базы данных

Перед первым запуском сервера запустите миграцию таблиц в базу данных командой 
```bash
npx sequelize-cli db:migrate
```

Таблицу сессий Sequelize и `connect-pg-simple` создадут автоматически при первом запуске.

## Запуск приложения

### Режим разработки (оба сервера одновременно)

Из корневой директории:

```bash
npm run dev
```

Это запустит:
- Бэкенд сервер на `http://localhost:5005`
- Фронтенд dev-сервер на `http://localhost:5175`

### Запуск отдельно

**Бэкенд:**

```bash
cd server
npm start
# или для автоматической перезагрузки
npm run dev
```

**Фронтенд:**

```bash
cd client
npm run dev
```

## API Endpoints

### CSRF
- `GET /api/csrf-token` - Получение CSRF токена

### Аутентификация
- `POST /api/auth/check-email` - Проверка существования email
- `POST /api/auth/login-with-password` - Вход пользователя по паролю
- `POST /api/auth/login-with-code` - Вход пользователя по коду на email (5555)
- `POST /api/auth/registration` - Регистрация пользователя
- `GET /api/auth/user` - Получение текущего пользователя
- `POST /api/auth/logout` - Выход пользователя

Все POST запросы требуют CSRF токен в заголовке `X-CSRF-Token`.

## Использование

1. Откройте браузер и перейдите на `http://localhost:5175`
2. Нажмите "Вход" или перейдите на `/auth`
3. Введите email для проверки
4. Если пользователь существует, введите пароль
5. Для регистрации нового пользователя перейдите на `/auth/reg`

## Безопасность

- Пароли хешируются с помощью bcrypt (10 раундов)
- CSRF токены защищают от межсайтовых запросов
- Сессии хранятся в PostgreSQL
- Валидация всех входных данных на сервере
- HTTP-only cookies для сессий

## Структура базы данных

### Таблица `users`
- `id` - INTEGER (Primary Key, Auto Increment)
- `firstName` - STRING
- `lastName` - STRING
- `preferredName` - STRING
- `email` - STRING (Unique, Not Null)
- `phone` - STRING
- `birthday` - DATE
- `gender` - STRING
- `role` - STRING, defaultValue: "USER"
- `password` - STRING (Not Null, Hashed)
- `createdAt` - DATE

### Таблица `session`
Создается автоматически `connect-pg-simple` для хранения сессий.

## Troubleshooting

### Ошибка подключения к БД

1. Убедитесь, что PostgreSQL запущен
2. Проверьте параметры в `server/.env`
3. Убедитесь, что база данных `auth_react` создана
4. Проверьте права пользователя БД

### Ошибка CSRF токена

- Убедитесь, что запросы идут с правильным заголовком `X-CSRF-Token`
- Проверьте, что сессии работают корректно

### Сессии не сохраняются

- Проверьте, что таблица `session` создана в БД
- Убедитесь, что cookies разрешены в браузере
- Проверьте настройки CORS на сервере

## Лицензия

ISC