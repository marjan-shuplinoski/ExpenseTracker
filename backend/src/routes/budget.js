/**
 * Budget management API routes.
 * @module routes/budget
 * @requires express
 * @requires controllers/budgetController
 */

/**
 * @swagger
 * /api/budget:
 *   get:
 *     summary: Get all budgets for the authenticated user
 *   post:
 *     summary: Create a new budget
 */

/**
 * @swagger
 * /api/budget/:id:
 *   get:
 *     summary: Get budget by ID
 *   put:
 *     summary: Update budget by ID
 *   delete:
 *     summary: Delete budget by ID
 */

// Budget routes for ExpenseTracker (ES Modules)
import express from 'express';
import { requireAuth } from '../middleware/security.js';
import { budgetSchema } from '../validations/budgetValidation.js';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
  getBudgetById,
} from '../controllers/budgetController.js';
import Joi from 'joi';

const router = express.Router();

router.use(requireAuth);

router.get('/', getBudgets);
router.post('/', validateBody(budgetSchema), createBudget);
router.put('/:id', validateBody(budgetSchema), updateBudget);
router.delete('/:id', deleteBudget);
router.get('/:id/progress', getBudgetProgress);
router.get('/:id', getBudgetById);

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
  };
}

export default router;
// Note: ES Modules only. No CommonJS allowed.
