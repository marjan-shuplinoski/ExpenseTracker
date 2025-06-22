import api from './api';
import { Category } from '../contexts/CategoryContext';

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await api.get('/categories');
  return res.data;
};

export const fetchCategory = async (id: string): Promise<Category> => {
  const res = await api.get(`/categories/${id}`);
  return res.data;
};

export const addCategory = async (data: Omit<Category, '_id'>): Promise<Category> => {
  const res = await api.post('/categories', data);
  return res.data;
};

export const updateCategory = async (id: string, data: Omit<Category, '_id'>): Promise<Category> => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
