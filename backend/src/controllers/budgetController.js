// Budget controller for ExpenseTracker (ES Modules)
import Budget from '../models/Budget.js';

export async function getBudgets(req, res, next) {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (err) { next(err); }
}

export async function createBudget(req, res, next) {
  try {
    const budget = await Budget.create({ ...req.body, user: req.user.id });
    res.status(201).json({ message: 'Budget created', budget });
  } catch (err) { next(err); }
}

export async function updateBudget(req, res, next) {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget updated', budget });
  } catch (err) { next(err); }
}

export async function deleteBudget(req, res, next) {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) { next(err); }
}

export async function getBudgetProgress(req, res, next) {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    // TODO: Calculate progress based on transactions (requires Transaction model)
    res.json({ budget, progress: 0 });
  } catch (err) { next(err); }
}

export async function getBudgetById(req, res, next) {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) { next(err); }
}
