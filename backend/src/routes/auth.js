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
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { requireAuth } from '../middleware/security.js';

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
}

router.post('/register', async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password });
    const token = generateToken(user);
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

router.put('/me', requireAuth, async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

export default router;
// Note: ES Modules only. No CommonJS allowed.
