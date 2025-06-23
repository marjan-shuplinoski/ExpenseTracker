/**
 * Category management API routes.
 * @module routes/category
 * @requires express
 * @requires controllers/categoryController
 */

// Category routes for ExpenseTracker (ES Modules)
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import Category from '../models/Category.js';
import { createCategorySchema, updateCategorySchema } from '../validations/categoryValidation.js';
import { requireAuth } from '../middleware/security.js';
import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();
router.use(mongoSanitize());

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get all categories for the authenticated user
 *   post:
 *     summary: Create a new category
 */

// Create category
router.post('/', requireAuth, categoryController.createCategory);

/**
 * @swagger
 * /api/category/:id:
 *   get:
 *     summary: Get category by ID
 *   put:
 *     summary: Update category by ID
 *   delete:
 *     summary: Delete category by ID
 */

// Get all categories for user
router.get('/', requireAuth, categoryController.getCategories);

// Get category by ID for user
router.get('/:id', requireAuth, categoryController.getCategory);

// Update category for user
router.put('/:id', requireAuth, categoryController.updateCategory);

// Delete category for user
router.delete('/:id', requireAuth, categoryController.deleteCategory);

export default router;
// Note: ES Modules only. No CommonJS allowed.
