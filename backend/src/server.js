// Main server entry for ExpenseTracker (ES Modules)
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { securityMiddleware, errorHandler } from './middleware/security.js';
import authRoutes from './routes/auth.js';
import accountRoutes from './routes/account.js';
import transactionRoutes from './routes/transaction.js';
import categoryRoutes from './routes/category.js';
import budgetRoutes from './routes/budget.js';
import reportsRoutes from './routes/reports.js';
import recurringRoutes from './routes/recurring.js';
import cron from 'node-cron';
import { processRecurringTransactions } from './services/recurringService.js';

// Load .env or .env.test depending on NODE_ENV
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const app = express();
securityMiddleware(app);

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/recurring', recurringRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/expensetracker_test'
  : process.env.MONGODB_URI || 'mongodb://localhost:27017/expensetracker';

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI);
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
}

// Schedule recurring transaction processing every hour
cron.schedule('0 * * * *', async () => {
  try {
    const count = await processRecurringTransactions();
    if (count > 0) {
      // eslint-disable-next-line no-console
      console.log(`[CRON] Processed ${count} recurring transactions.`);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[CRON] Error processing recurring transactions:', err);
  }
});

export default app;
// Note: ES Modules only. No CommonJS allowed.
