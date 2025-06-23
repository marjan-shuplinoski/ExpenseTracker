// Recurring transaction controller for ExpenseTracker (ES Modules)
import RecurringTransaction from '../models/RecurringTransaction.js';
import Transaction from '../models/Transaction.js';
import { createRecurringTransaction, processRecurringTransactions } from '../services/recurringService.js';
import { recurringValidation } from '../validations/recurringValidation.js';

export async function createRecurring(req, res, next) {
  try {
    const { error, value } = recurringValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const data = { ...value, user: req.user.id, nextRun: value.startDate };
    const recurring = await RecurringTransaction.create(data);
    res.status(201).json({ message: 'Recurring transaction created', recurring });
  } catch (err) {
    next(err);
  }
}

export async function listRecurring(req, res, next) {
  try {
    const recurs = await RecurringTransaction.find({ user: req.user.id });
    res.json(recurs);
  } catch (err) {
    next(err);
  }
}

export async function getRecurring(req, res, next) {
  try {
    const recur = await RecurringTransaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!recur) return res.status(404).json({ error: 'Not found' });
    res.json(recur);
  } catch (err) {
    next(err);
  }
}

export async function updateRecurring(req, res, next) {
  try {
    const { error, value } = recurringValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const recur = await RecurringTransaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      value,
      { new: true }
    );
    if (!recur) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Recurring transaction updated', recur });
  } catch (err) {
    next(err);
  }
}

export async function deleteRecurring(req, res, next) {
  try {
    const recur = await RecurringTransaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!recur) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Recurring transaction deleted' });
  } catch (err) {
    next(err);
  }
}
