// Reports service for ExpenseTracker (ES Modules)
// NOTE: Implementations are stubs. Replace with real aggregation logic.
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { exportToCSV } from '../utils/exportUtils.js';

export async function getSummaryData(user, query) {
  // TODO: Aggregate summary data for user (total income, expenses, by category, etc.)
  return { summary: 'stub', user: user.id };
}

export async function getMonthlyData(user, query) {
  // TODO: Aggregate monthly data for user (group by month, totals, etc.)
  return { monthly: 'stub', user: user.id };
}

export async function getYearlyData(user, query) {
  // TODO: Aggregate yearly data for user (group by year, totals, etc.)
  return { yearly: 'stub', user: user.id };
}

export async function getExportData(user, query) {
  // TODO: Export data as CSV or PDF (default: CSV)
  const fileBuffer = Buffer.from('id,amount,category\n1,100,Food', 'utf-8');
  return {
    fileBuffer,
    fileName: 'report.csv',
    mimeType: 'text/csv',
  };
}
