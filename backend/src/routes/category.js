// Category routes for ExpenseTracker (ES Modules)
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import Category from '../models/Category.js';
import { createCategorySchema, updateCategorySchema } from '../validations/categoryValidation.js';
import { requireAuth } from '../middleware/security.js';

const router = express.Router();
router.use(mongoSanitize());

// Create category
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { error } = createCategorySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    // Set user field for per-user categories
    const category = await Category.create({ ...req.body, user: req.user.id });
    res.status(201).json(category);
  } catch (err) { next(err); }
});

// Get all categories for user
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
  } catch (err) { next(err); }
});

// Get category by ID for user
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) { next(err); }
});

// Update category for user
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { error } = updateCategorySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) { next(err); }
});

// Delete category for user
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
// Note: ES Modules only. No CommonJS allowed.
