// Transaction endpoint tests (ES Modules, Jest)
import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import transactionRoutes from '../src/routes/transaction.js';
import authRoutes from '../src/routes/auth.js';
import accountRoutes from '../src/routes/account.js';
import User from '../src/models/User.js';
import Account from '../src/models/Account.js';
import Transaction from '../src/models/Transaction.js';
import { securityMiddleware, errorHandler } from '../src/middleware/security.js';

const app = express();
securityMiddleware(app);
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use(errorHandler);

const MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/expensetracker_test';

beforeAll(async () => {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  await Account.deleteMany({});
  await Transaction.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Transaction Endpoints', () => {
  let token;
  let accountId;
  let transactionId;
  const user = { name: 'Trans User', email: 'trans@example.com', password: 'password123' };
  const account = { name: 'Trans Bank', type: 'bank', balance: 1000, currency: 'USD' };
  const transaction = { type: 'expense', category: 'Food', amount: 25, description: 'Lunch', date: new Date().toISOString() };

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(user);
    const login = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    token = login.body.token;
    const accRes = await request(app).post('/api/accounts').set('Authorization', `Bearer ${token}`).send(account);
    accountId = accRes.body._id;
  });

  it('should create a transaction', async () => {
    const res = await request(app).post('/api/transactions').set('Authorization', `Bearer ${token}`).send({ ...transaction, account: accountId });
    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(transaction.amount);
    transactionId = res.body._id;
  });

  it('should get all transactions for user', async () => {
    const res = await request(app).get('/api/transactions').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a single transaction', async () => {
    const res = await request(app).get(`/api/transactions/${transactionId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(transactionId);
  });

  it('should update a transaction', async () => {
    const res = await request(app).put(`/api/transactions/${transactionId}`).set('Authorization', `Bearer ${token}`).send({ amount: 30 });
    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(30);
  });

  it('should delete a transaction', async () => {
    const res = await request(app).delete(`/api/transactions/${transactionId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return transaction stats summary', async () => {
    const res = await request(app).get('/api/transactions/stats/summary').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalIncome');
    expect(res.body).toHaveProperty('totalExpense');
  });
});
