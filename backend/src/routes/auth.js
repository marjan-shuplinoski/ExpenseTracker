/**
 * Authentication and user session API routes.
 * @module routes/auth
 * @requires express
 * @requires controllers/authController
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and return JWT
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 */

// Auth routes for ExpenseTracker (ES Modules)
import express from 'express';
import { requireAuth } from '../middleware/security.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getMe);
router.put('/me', requireAuth, authController.updateMe);
router.post('/logout', requireAuth, authController.logout);

export default router;
// Note: ES Modules only. No CommonJS allowed.
