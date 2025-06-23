/**
 * Transaction management API routes.
 * @module routes/transaction
 * @requires express
 * @requires controllers/transactionController
 */

/**
 * @swagger
 * /api/transaction:
 *   get:
 *     summary: Get all transactions for the authenticated user
 *   post:
 *     summary: Create a new transaction
 */

/**
 * @swagger
 * /api/transaction/:id:
 *   get:
 *     summary: Get transaction by ID
 *   put:
 *     summary: Update transaction by ID
 *   delete:
 *     summary: Delete transaction by ID
 */

// Transaction routes for ExpenseTracker (ES Modules)
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import { requireAuth } from '../middleware/security.js';
import * as transactionController from '../controllers/transactionController.js';
import { createTransactionSchema, updateTransactionSchema } from '../validations/transactionValidation.js';

const router = express.Router();
router.use(mongoSanitize());

// Create transaction
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { error } = createTransactionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    await transactionController.createTransaction(req, res, next);
  } catch (err) { next(err); }
});

// Get all transactions for user
router.get('/', requireAuth, transactionController.getAllTransactions);

// Get single transaction
router.get('/:id', requireAuth, transactionController.getTransaction);

// Update transaction
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { error } = updateTransactionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    await transactionController.updateTransaction(req, res, next);
  } catch (err) { next(err); }
});

// Delete transaction
router.delete('/:id', requireAuth, transactionController.deleteTransaction);

// Stats endpoint (basic: total income/expense)
router.get('/stats/summary', requireAuth, transactionController.getTransactionStats);

export default router;
// Note: ES Modules only. No CommonJS allowed.
