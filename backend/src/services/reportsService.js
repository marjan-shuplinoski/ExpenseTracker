// Reports service for ExpenseTracker (ES Modules)
// NOTE: Implementations are stubs. Replace with real aggregation logic.
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { exportToCSV } from '../utils/exportUtils.js';

export async function getSummaryData(user, query) {
  // Aggregate summary data for user: total income, total expenses, by category breakdown
  const match = { user: user.id };
  const [totals, byCategory] = await Promise.all([
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]),
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          type: { $first: '$type' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          category: '$category.name',
          type: 1,
          total: 1,
        },
      },
    ]),
  ]);
  return {
    totals: totals.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.total }), {}),
    byCategory,
  };
}

export async function getMonthlyData(user, query) {
  // Aggregate monthly data for user: group by month, income/expense totals
  const match = { user: user.id };
  const monthly = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: { month: { $month: '$date' }, year: { $year: '$date' }, type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);
  return monthly;
}

export async function getYearlyData(user, query) {
  // Aggregate yearly data for user: group by year, income/expense totals
  const match = { user: user.id };
  const yearly = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: { year: { $year: '$date' }, type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    {
      $sort: { '_id.year': 1 },
    },
  ]);
  return yearly;
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
