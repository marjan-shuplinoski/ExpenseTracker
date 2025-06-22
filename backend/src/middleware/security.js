// Security middleware for ExpenseTracker (ES Modules)
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { json, urlencoded } from 'express';
import jwt from 'jsonwebtoken';

// Centralized error handler
export function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

// Centralized error handler (named export for ESM compatibility)
export function handleError(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

// Security middleware setup
export function securityMiddleware(app) {
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  }));
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100000, // Increased from 100 to 100000 as requested
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.'
  }));
  app.use(mongoSanitize());
  app.use(json());
  app.use(urlencoded({ extended: true }));
}

// Auth middleware for requireAuth
export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

// Note: ES Modules only. No CommonJS allowed.
