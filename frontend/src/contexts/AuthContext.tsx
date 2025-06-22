import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '../services/api';
import Cookies from 'js-cookie';
import { setLogoutHandler } from './authLogoutHandler';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  // add more fields as needed
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_ERROR'; payload: string }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { user: action.payload, loading: false, error: null };
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
}

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  // Load user from localStorage or cookie on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(storedUser) });
      setHydrated(true);
    } else if (Cookies.get('auth')) {
      api.get('/auth/me')
        .then(res => {
          dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => {
          Cookies.remove('auth');
          localStorage.removeItem('jwt_token');
        })
        .finally(() => setHydrated(true));
    } else {
      setHydrated(true);
    }
  }, []);

  // Save user to localStorage on change
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  // Save JWT to localStorage
  const setToken = (token: string) => {
    localStorage.setItem('jwt_token', token);
    Cookies.set('auth', '1', { sameSite: 'lax' });
  };
  const clearToken = () => {
    localStorage.removeItem('jwt_token');
    Cookies.remove('auth');
  };

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.user });
    } catch (err) {
      let message = 'Login failed.';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      }
      dispatch({ type: 'LOGIN_ERROR', payload: message });
      clearToken();
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setToken(res.data.token);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data.user });
    } catch (err) {
      let message = 'Registration failed.';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      }
      dispatch({ type: 'REGISTER_ERROR', payload: message });
      clearToken();
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    dispatch({ type: 'LOGOUT' });
  }, []);

  useEffect(() => {
    setLogoutHandler(() => logout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, loading: state.loading || !hydrated }}>
      {children}
    </AuthContext.Provider>
  );
};

export type { AuthContextProps };
export { AuthContext };
