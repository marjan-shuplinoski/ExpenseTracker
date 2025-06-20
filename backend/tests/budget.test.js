// Budget endpoints tests (ES Modules, Jest)
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import User from '../src/models/User.js';
import Budget from '../src/models/Budget.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expensetracker_test';

describe('Budget Endpoints', () => {
  let token;
  let budgetId;
  beforeAll(async () => {
    // Only clear users and budgets, do not reconnect
    await User.deleteMany({});
    await Budget.deleteMany({});
    // Register and login test user
    await request(app).post('/api/auth/register').send({ name: 'BudgetUser', email: 'budget@test.com', password: 'Password123!' });
    const res = await request(app).post('/api/auth/login').send({ email: 'budget@test.com', password: 'Password123!' });
    token = res.body.token;
  });
  afterAll(async () => {
    // No need to close connection, handled by app
  });
  it('should create a budget', async () => {
    const res = await request(app).post('/api/budgets').set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Budget', amount: 1000, period: 'monthly', startDate: new Date(), endDate: new Date(Date.now() + 2592000000) });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Budget');
    budgetId = res.body._id;
  });
  it('should get all budgets', async () => {
    const res = await request(app).get('/api/budgets').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('should update a budget', async () => {
    const res = await request(app).put(`/api/budgets/${budgetId}`).set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Budget', amount: 2000, period: 'monthly', startDate: new Date(), endDate: new Date(Date.now() + 2592000000) });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Budget');
  });
  it('should get budget progress', async () => {
    const res = await request(app).get(`/api/budgets/${budgetId}/progress`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('progress');
  });
  it('should delete a budget', async () => {
    const res = await request(app).delete(`/api/budgets/${budgetId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
