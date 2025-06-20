// Jest tests for recurring transaction logic (ES Modules)
import mongoose from 'mongoose';
import RecurringTransaction from '../src/models/RecurringTransaction.js';
import Transaction from '../src/models/Transaction.js';
import { processRecurringTransactions } from '../src/services/recurringService.js';
import dayjs from 'dayjs';

describe('Recurring Transactions Cron Logic', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expensetracker_test');
    await RecurringTransaction.deleteMany({});
    await Transaction.deleteMany({});
  });

  afterAll(async () => {
    await RecurringTransaction.deleteMany({});
    await Transaction.deleteMany({});
    await mongoose.disconnect();
  });

  it('should process due recurring transactions and create new Transaction', async () => {
    const recur = await RecurringTransaction.create({
      user: new mongoose.Types.ObjectId(),
      account: new mongoose.Types.ObjectId(),
      category: 'Test',
      type: 'expense',
      amount: 10,
      description: 'Test recurring',
      startDate: dayjs().subtract(1, 'day').toDate(),
      frequency: 'daily',
      interval: 1,
      nextRun: dayjs().subtract(1, 'day').toDate(),
      active: true,
    });
    const count = await processRecurringTransactions();
    expect(count).toBeGreaterThan(0);
    const tx = await Transaction.findOne({ user: recur.user, account: recur.account, amount: 10 });
    expect(tx).toBeTruthy();
    const updated = await RecurringTransaction.findById(recur._id);
    expect(updated.lastRun).toBeTruthy();
    expect(updated.active).toBe(true);
  });

  it('should deactivate recurring if endDate is reached', async () => {
    const recur = await RecurringTransaction.create({
      user: new mongoose.Types.ObjectId(),
      account: new mongoose.Types.ObjectId(),
      category: 'Test',
      type: 'expense',
      amount: 5,
      description: 'End date test',
      startDate: dayjs().subtract(2, 'day').toDate(),
      frequency: 'daily',
      interval: 1,
      nextRun: dayjs().subtract(1, 'day').toDate(),
      endDate: dayjs().subtract(1, 'day').toDate(),
      active: true,
    });
    const count = await processRecurringTransactions();
    expect(count).toBeGreaterThan(0);
    const updated = await RecurringTransaction.findById(recur._id);
    expect(updated.active).toBe(false);
  });
});
