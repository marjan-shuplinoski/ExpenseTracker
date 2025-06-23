import Category from '../models/Category.js';
import { createCategorySchema, updateCategorySchema } from '../validations/categoryValidation.js';

// Create category
export async function createCategory(req, res, next) {
  try {
    const { error } = createCategorySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const category = await Category.create({ ...req.body, user: req.user.id });
    res.status(201).json(category);
  } catch (err) { next(err); }
}

// Get all categories for user
export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
  } catch (err) { next(err); }
}

// Get category by ID for user
export async function getCategory(req, res, next) {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) { next(err); }
}

// Update category for user
export async function updateCategory(req, res, next) {
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
}

// Delete category for user
export async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
}