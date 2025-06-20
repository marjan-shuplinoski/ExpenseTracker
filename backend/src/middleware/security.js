// Security middleware for ExpenseTracker (ES Modules)
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { json, urlencoded } from 'express';

// Centralized error handler
export function errorHandler(err, req, res, next) {
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
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.'
  }));
  app.use(mongoSanitize());
  app.use(json());
  app.use(urlencoded({ extended: true }));
}

// Note: ES Modules only. No CommonJS allowed.
