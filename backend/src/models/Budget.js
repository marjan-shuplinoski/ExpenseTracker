// Budget model for ExpenseTracker (ES Modules)
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  period: { type: String, enum: ['monthly', 'yearly'], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  currentBalance: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
// Note: ES Modules only. No CommonJS allowed.
