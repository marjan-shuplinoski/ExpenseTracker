// Recurring transaction service for ExpenseTracker (ES Modules)
// Handles logic for creating and processing recurring transactions
// Note: ES Modules only. No CommonJS allowed.

import Transaction from '../models/Transaction.js';
import RecurringTransaction from '../models/RecurringTransaction.js';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

/**
 * Create a new recurring transaction instance (not the actual transaction, just the schedule)
 * @param {Object} data - Recurring transaction data
 * @returns {Promise<Object>} The created recurring transaction
 */
export async function createRecurringTransaction(data) {
  return RecurringTransaction.create(data);
}

/**
 * Process all due recurring transactions (to be called by cron)
 * @returns {Promise<number>} Number of transactions created
 */
export async function processRecurringTransactions() {
  const now = new Date();
  const due = await RecurringTransaction.find({ active: true, nextRun: { $lte: now } });
  let count = 0;
  for (const recur of due) {
    // Create a new Transaction
    await Transaction.create({
      user: recur.user,
      account: recur.account,
      category: recur.category,
      type: recur.type,
      amount: recur.amount,
      description: recur.description,
      date: recur.nextRun,
    });
    // Calculate nextRun
    let next = dayjs(recur.nextRun);
    switch (recur.frequency) {
      case 'daily':
        next = next.add(recur.interval, 'day');
        break;
      case 'weekly':
        next = next.add(recur.interval, 'week');
        break;
      case 'monthly':
        next = next.add(recur.interval, 'month');
        break;
      case 'yearly':
        next = next.add(recur.interval, 'year');
        break;
      default:
        next = next.add(1, 'month');
    }
    // Deactivate if endDate is reached
    let active = true;
    if (recur.endDate && next.isAfter(dayjs(recur.endDate))) {
      active = false;
    }
    await RecurringTransaction.findByIdAndUpdate(recur._id, {
      lastRun: recur.nextRun,
      nextRun: next.toDate(),
      active,
    });
    count++;
  }
  return count;
}
