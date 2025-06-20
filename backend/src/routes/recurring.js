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
