// RecurringTransaction model for ExpenseTracker (ES Modules)
import mongoose from 'mongoose';

const recurringTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  type: { type: String, required: true, enum: ['income', 'expense', 'transfer'] },
  amount: { type: Number, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  frequency: { type: String, required: true, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
  interval: { type: Number, default: 1 }, // e.g., every 2 weeks
  endDate: { type: Date },
  nextRun: { type: Date, required: true },
  lastRun: { type: Date },
  active: { type: Boolean, default: true },
  name: { type: String, required: true },
}, { timestamps: true });

const RecurringTransaction = mongoose.model('RecurringTransaction', recurringTransactionSchema);
export default RecurringTransaction;
// Note: ES Modules only. No CommonJS allowed.
