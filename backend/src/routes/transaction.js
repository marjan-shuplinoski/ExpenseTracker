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
import Transaction from '../models/Transaction.js';
import { createTransactionSchema, updateTransactionSchema } from '../validations/transactionValidation.js';
import { requireAuth } from '../middleware/security.js';

const router = express.Router();
router.use(mongoSanitize());

// Create transaction
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { error } = createTransactionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const transaction = await Transaction.create({ ...req.body, user: req.user.id });
    res.status(201).json(transaction);
  } catch (err) { next(err); }
});

// Get all transactions for user
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (err) { next(err); }
});

// Get single transaction
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) { next(err); }
});

// Update transaction
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { error } = updateTransactionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) { next(err); }
});

// Delete transaction
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// Stats endpoint (basic: total income/expense)
router.get('/stats/summary', requireAuth, async (req, res, next) => {
  try {
    const [income, expense] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: req.user._id || req.user.id, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { user: req.user._id || req.user.id, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);
    res.json({
      totalIncome: income[0]?.total || 0,
      totalExpense: expense[0]?.total || 0
    });
  } catch (err) { next(err); }
});

export default router;
// Note: ES Modules only. No CommonJS allowed.
