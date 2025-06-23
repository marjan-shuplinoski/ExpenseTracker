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

// Notification handler (set by NotificationProvider integration)
let notify: ((message: string, type?: 'success' | 'warning' | 'danger' | 'info') => void) | undefined;

export function setApiNotificationHandler(
  handler: (message: string, type?: 'success' | 'warning' | 'danger' | 'info') => void
) {
  notify = handler;
}

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (notify && ['post', 'put', 'patch', 'delete'].includes(response.config.method || '')) {
      let msg = '';
      if (typeof response.data?.message === 'string' && response.data.message.trim() !== '') {
        msg = response.data.message;
      } else if (typeof response.data === 'string' && response.data.trim() !== '') {
        msg = response.data;
      } else {
        // Fallback: try to infer from method
        if (response.config.method === 'post') msg = 'Created successfully';
        else if (['put', 'patch'].includes(response.config.method || '')) msg = 'Updated successfully';
        else if (response.config.method === 'delete') msg = 'Deleted successfully';
        else msg = 'Operation successful';
      }
      // Custom login/register messages
      if (response.config.url && /login/i.test(response.config.url)) {
        msg = 'Welcome back!';
      } else if (response.config.url && /register|signup/i.test(response.config.url)) {
        msg = 'Registration successful. Welcome aboard!';
      }
      let type: 'success' | 'warning' | 'danger' = 'success';
      if (/deleted|removed/i.test(msg)) type = 'danger';
      else if (/updated|changed|modified|edited/i.test(msg)) type = 'warning';
      else if (/created|added|success|welcome|registration/i.test(msg)) type = 'success';
      notify(msg, type);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle 401/403 globally (e.g., logout, redirect)
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem(TOKEN_KEY);
        callLogoutHandler();
      }
      if (notify) {
        const data = error.response.data as Record<string, unknown> | undefined;
        const msg = typeof data?.message === 'string' ? data.message : error.message || 'Request failed';
        notify(msg, 'danger');
      }
    } else if (notify) {
      notify(error.message || 'Network error', 'danger');
    }
    return Promise.reject(error);
  },
);

export default api;
