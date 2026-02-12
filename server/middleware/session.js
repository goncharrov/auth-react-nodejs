import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pgSession = connectPgSimple(session);

const pgPool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const pgSessionStore = new pgSession({
  pool: pgPool,
  tableName: 'auth_users_sessions',
  createTableIfMissing: true,
  pruneSessionInterval: 5 * 60
});

const isCookieSecure = process.env.COOKIE_SECURE === 'true';

export const sessionMiddleware = session({
  store: pgSessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isCookieSecure,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  },
  name: 'auth.sid'
});
