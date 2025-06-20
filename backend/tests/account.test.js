// Account endpoint tests (ES Modules, Jest)
import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import accountRoutes from '../src/routes/account.js';
import authRoutes from '../src/routes/auth.js';
import User from '../src/models/User.js';
import Account from '../src/models/Account.js';
import { securityMiddleware, errorHandler } from '../src/middleware/security.js';

const app = express();
securityMiddleware(app);
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use(errorHandler);

const MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/expensetracker_test';

beforeAll(async () => {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  await Account.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Account Endpoints', () => {
  let token;
  let accountId;
  const user = { name: 'Account User', email: 'account@example.com', password: 'password123' };
  const account = { name: 'Main Bank', type: 'bank', balance: 1000, currency: 'USD' };

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(user);
    const login = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    token = login.body.token;
  });

  it('should create an account', async () => {
    const res = await request(app).post('/api/accounts').set('Authorization', `Bearer ${token}`).send(account);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(account.name);
    accountId = res.body._id;
  });

  it('should get all accounts for user', async () => {
    const res = await request(app).get('/api/accounts').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update an account', async () => {
    const res = await request(app).put(`/api/accounts/${accountId}`).set('Authorization', `Bearer ${token}`).send({ name: 'Updated Bank' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Bank');
  });

  it('should delete an account', async () => {
    const res = await request(app).delete(`/api/accounts/${accountId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
