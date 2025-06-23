/**
 * Recurring transaction API routes.
 * @module routes/recurring
 * @requires express
 * @requires controllers/recurringController
 */

/**
 * @swagger
 * /api/recurring:
 *   get:
 *     summary: Get all recurring transactions for the authenticated user
 *   post:
 *     summary: Create a new recurring transaction
 */

/**
 * @swagger
 * /api/recurring/:id:
 *   get:
 *     summary: Get recurring transaction by ID
 *   put:
 *     summary: Update recurring transaction by ID
 *   delete:
 *     summary: Delete recurring transaction by ID
 */

// Recurring transaction routes for ExpenseTracker (ES Modules)
import express from 'express';
import { createRecurring, getRecurring, updateRecurring, deleteRecurring, listRecurring } from '../controllers/recurringController.js';
import { requireAuth } from '../middleware/security.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Create a new recurring transaction
router.post('/', createRecurring);
// Get all recurring transactions for user
router.get('/', listRecurring);
// Get a single recurring transaction
router.get('/:id', getRecurring);
// Update a recurring transaction
router.put('/:id', updateRecurring);
// Delete a recurring transaction
router.delete('/:id', deleteRecurring);

export default router;
// Note: ES Modules only. No CommonJS allowed.
