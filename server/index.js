import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';

dotenv.config();

import { fileURLToPath } from 'url';

import { sessionMiddleware } from './middleware/session.js';
import { generateCsrfToken } from './middleware/csrf.js';

import routes from './common/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: 'http://localhost:5175',
  credentials: true
}));

app.use(express.static(path.resolve(__dirname, 'public')));

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Сессии
app.use(sessionMiddleware);

// CSRF токен для всех запросов
app.use(generateCsrfToken);

// Маршруты
app.use('/api', routes);

// Health-check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Внутренняя ошибка сервера' 
      : err.message
  });
});

const PORT = process.env.PORT || 5005

async function start() {
    try {
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()