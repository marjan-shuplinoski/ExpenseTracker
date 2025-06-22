import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import apiConfig from './apiConfig';
import { callLogoutHandler } from '../contexts/authLogoutHandler';

// JWT token key for localStorage/sessionStorage
const TOKEN_KEY = 'jwt_token';

const api: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT if present
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Handle 401/403 globally (e.g., logout, redirect)
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem(TOKEN_KEY);
        callLogoutHandler();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
