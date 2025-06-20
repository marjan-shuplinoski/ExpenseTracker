// Account routes for ExpenseTracker (ES Modules)
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import Account from '../models/Account.js';
import { createAccountSchema, updateAccountSchema } from '../validations/accountValidation.js';
import { requireAuth } from '../middleware/security.js';

const router = express.Router();
router.use(mongoSanitize());

// Create account
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { error } = createAccountSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const account = await Account.create({ ...req.body, user: req.user.id });
    res.status(201).json(account);
  } catch (err) { next(err); }
});

// Get all accounts for user
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const accounts = await Account.find({ user: req.user.id });
    res.json(accounts);
  } catch (err) { next(err); }
});

// Get account by ID
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, user: req.user.id });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (err) { next(err); }
});

// Update account
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { error } = updateAccountSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (err) { next(err); }
});

// Delete account
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const account = await Account.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
// Note: ES Modules only. No CommonJS allowed.
