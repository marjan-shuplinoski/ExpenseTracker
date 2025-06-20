// Transaction model for ExpenseTracker (ES Modules)
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  category: { type: String, required: true },
  type: { type: String, required: true, enum: ['income', 'expense', 'transfer'] },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, required: true },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
// Note: ES Modules only. No CommonJS allowed.
