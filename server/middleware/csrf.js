import csrf from 'csrf';

const tokens = new csrf();

/**
 * Генерация CSRF токена
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export function generateCsrfToken(req, res, next) {
  if (!req.session.secret) {
    req.session.secret = tokens.secretSync();
  }
  
  const token = tokens.create(req.session.secret);
  req.session.csrfToken = token;
  res.locals.csrfToken = token;
  
  next();
}

/**
 * Валидация CSRF токена
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export function validateCsrfToken(req, res, next) {
  // Проверяем только для POST, PUT, DELETE, PATCH запросов
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const secret = req.session.secret;

  if (!secret || !token) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token missing'
    });
  }

  if (!tokens.verify(secret, token)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid CSRF token'
    });
  }

  next();
}
