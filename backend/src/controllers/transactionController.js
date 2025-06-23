import mongoose from 'mongoose';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

// Helper to ensure category is ObjectId
function toObjectId(id) {
  if (!id) return undefined;
  if (mongoose.Types.ObjectId.isValid(id)) return new mongoose.Types.ObjectId(id);
  return undefined;
}

// CREATE transaction
export const createTransaction = async (req, res) => {
  try {
    const categoryId = toObjectId(req.body.category);
    const transaction = await Transaction.create({ ...req.body, user: req.user.id, category: categoryId });
    // Update budget currentBalance
    if (transaction.category) {
      const budget = await Budget.findOne({ user: req.user.id, category: transaction.category });
      if (budget) {
        if (transaction.type === 'expense') {
          budget.currentBalance -= transaction.amount;
        } else if (transaction.type === 'income') {
          budget.currentBalance += transaction.amount;
        }
        await budget.save();
      }
    }
    res.status(201).json({ message: 'Transaction created', transaction });
  } catch (err) {
    // ...existing code...
  }
};

// Get all transactions for user
export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (err) { next(err); }
};

// Get single transaction
export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) { next(err); }
};

// Stats endpoint (basic: total income/expense)
export const getTransactionStats = async (req, res, next) => {
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
};

// UPDATE transaction
export const updateTransaction = async (req, res) => {
  try {
    const oldTransaction = await Transaction.findById(req.params.id);
    if (!oldTransaction) return res.status(404).json({ message: 'Transaction not found' });
    const newCategoryId = toObjectId(req.body.category);
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...(newCategoryId ? { category: newCategoryId } : {}) },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found after update' });

    // If category or type changed, update both old and new budgets
    const oldCat = oldTransaction.category?.toString();
    const newCat = transaction.category?.toString();
    const oldType = oldTransaction.type;
    const newType = transaction.type;
    const oldAmount = oldTransaction.amount;
    const newAmount = transaction.amount;

    // If category or type changed, revert old and apply new
    if (oldCat !== newCat || oldType !== newType) {
      // Revert old
      if (oldCat) {
        const oldBudget = await Budget.findOne({ user: req.user.id, category: oldCat });
        if (oldBudget) {
          if (oldType === 'expense') oldBudget.currentBalance += oldAmount;
          else if (oldType === 'income') oldBudget.currentBalance -= oldAmount;
          await oldBudget.save();
        }
      }
      // Apply new
      if (newCat) {
        const newBudget = await Budget.findOne({ user: req.user.id, category: newCat });
        if (newBudget) {
          if (newType === 'expense') newBudget.currentBalance -= newAmount;
          else if (newType === 'income') newBudget.currentBalance += newAmount;
          await newBudget.save();
        }
      }
    } else if (oldCat && newCat && oldType === newType) {
      // Only amount changed, same category/type: apply delta
      const budget = await Budget.findOne({ user: req.user.id, category: newCat });
      if (budget) {
        if (newType === 'expense') {
          budget.currentBalance -= (newAmount - oldAmount);
        } else if (newType === 'income') {
          budget.currentBalance += (newAmount - oldAmount);
        }
        await budget.save();
      }
    }
    res.json({ message: 'Transaction updated', transaction });
  } catch (err) {
    // ...existing code...
  }
};

// DELETE transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    // Revert budget
    if (transaction && transaction.category) {
      const budget = await Budget.findOne({ user: req.user.id, category: transaction.category });
      if (budget) {
        if (transaction.type === 'expense') {
          budget.currentBalance += transaction.amount;
        } else if (transaction.type === 'income') {
          budget.currentBalance -= transaction.amount;
        }
        await budget.save();
      }
    }
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    // ...existing code...
  }
};