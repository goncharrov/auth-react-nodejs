# Приложение аутентификации c профилем пользователя

Полнофункциональное веб-приложение с аутентификацией и профилем пользователя, построенное на Node.js, PostgreSQL, Sequelize и React.

## Технологии

### Бэкенд
- **Node.js** с **Express.js**
- **PostgreSQL** - база данных
- **Sequelize** - ORM для работы с БД
- **Sequelize CLI** - для создания миграций в БД
- **express-session** + **connect-pg-simple** - сессии в БД
- **bcryptjs** - хеширование паролей
- **csrf** - защита от CSRF атак

### Фронтенд
- **React 19** - UI библиотека
- **React Router** - маршрутизация
- **Vite** - сборщик и dev-сервер


## Структура проекта

```
project/
├── server/               # Бэкенд приложение
│   ├── app_auth/         # Приложение аутентификации
│   ├── app_user_account/ # Приложение профиля пользователя
│   ├── common/           # API маршруты
│   ├── logic/            # Общая логика
│   ├── middleware/       # Middleware (CSRF, сессии)
│   ├── db.js             # Конфигурация БД
│   └── index.js          # Точка входа сервера
├── client/               # Фронтенд приложение
│   └── src/
│       ├── pages/        # Страницы
│       ├── components/   # Компоненты
│       ├── hooks/        # React хуки
│       ├── http/         # Запросы к API
│       └── data/         # Константные массивы данных
└── package.json        # Корневой package.json
```

## Старт приложения

Для быстрого старта в **docker** смотрите инструкцию в файле **QUICKSTART.md**
Для установки и настройки **локально** смотрите инструкцию в файле **SETUPMANUAL.md**

## Краткое описание приложения с иллюстрациями

Авторизация пользователя

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-1.jpg)

Регистрация пользователя

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-2.jpg)

При авторизации пользователя выполняется поиск пользователя по e-mail в базе данных

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-3.jpg)

Если e-mail найден, возможна аутентификация по коду, отправленному на email (функционал реализован только в части записи кода в базу данных), либо паролю.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-4.jpg)

По умолчанию для удобства тестирования, так как не добавлен функционал отправки писем на e-mail, значение кода во всем приложении установлено **5555**. В рабочем варианте значение кода устанавливается методом **random()**.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-5.jpg)

Главная страница приложения

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-6.jpg)

Профиль пользователя

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-7.jpg)

Пример изменения e-mail пользователя.
На первом этапе требуется подтвердить доступ к текущему e-mail пользователя. 

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-8.jpg)

На втором этапе указывается новый e-mail пользователя. 

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-9.jpg)

На третьем этапе требуется подтвердить доступ к новому e-mail пользователя.
При указании некорректной информации выводится сообщение об ошибке.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-10.jpg)

Подтверждение доступа к новому e-mail пользователя.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-11.jpg)

Возврат на основную страницу профиля пользователя.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-12.jpg)

Страница ввода персональных данных пользователя.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-13.jpg)

Страница изменения пароля пользователя.

![Screen|800x425](https://ruproject.org/media/files/2026/02/12/auth-react-14.jpg)

