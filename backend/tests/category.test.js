import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expensetracker-test');
  await User.deleteMany({});
  await Category.deleteMany({});
  // Register and login test user
  await request(app).post('/api/auth/register').send({ name: 'Test', email: 'cat@test.com', password: 'Password123!' });
  const res = await request(app).post('/api/auth/login').send({ email: 'cat@test.com', password: 'Password123!' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Category API', () => {
  let categoryId;
  it('should create a category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Food', type: 'expense' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Food');
    categoryId = res.body._id;
  });

  it('should get all categories', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get category by id', async () => {
    const res = await request(app)
      .get(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(categoryId);
  });

  it('should update a category', async () => {
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Groceries' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Groceries');
  });

  it('should delete a category', async () => {
    const res = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
