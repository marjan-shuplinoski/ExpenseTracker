// Account model for ExpenseTracker (ES Modules)
import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['cash', 'bank', 'credit', 'investment', 'other'] },
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String, required: true, default: 'USD' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);
export default Account;
// Note: ES Modules only. No CommonJS allowed.
