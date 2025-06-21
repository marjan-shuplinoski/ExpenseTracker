import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import api from '../services/api';

export interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  // add more fields as needed
}

interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
};

type AccountAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Account[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'CREATE_SUCCESS'; payload: Account }
  | { type: 'UPDATE_SUCCESS'; payload: Account }
  | { type: 'DELETE_SUCCESS'; payload: string };

function accountReducer(state: AccountState, action: AccountAction): AccountState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { accounts: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_SUCCESS':
      return { ...state, accounts: [...state.accounts, action.payload], loading: false };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        accounts: state.accounts.map(acc => acc._id === action.payload._id ? action.payload : acc),
        loading: false,
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        accounts: state.accounts.filter(acc => acc._id !== action.payload),
        loading: false,
      };
    default:
      return state;
  }
}

interface AccountContextProps extends AccountState {
  fetchAccounts: () => Promise<void>;
  createAccount: (data: Partial<Account>) => Promise<void>;
  updateAccount: (id: string, data: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  function isApiError(err: unknown): err is { response: { data: { message: string } } } {
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as Record<string, unknown>).response === 'object' &&
      (err as { response?: unknown }).response !== null &&
      'data' in ((err as { response?: Record<string, unknown> }).response ?? {}) &&
      typeof ((err as { response: { data?: unknown } }).response.data) === 'object' &&
      ((err as { response: { data?: unknown } }).response.data) !== null &&
      'message' in ((err as { response: { data: Record<string, unknown> } }).response.data)
    ) {
      return true;
    }
    return false;
  }

  const fetchAccounts = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.get('/accounts');
      dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
    } catch (err) {
      let errorMsg = 'Failed to fetch accounts.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, []);

  const createAccount = useCallback(async (data: Partial<Account>) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.post('/accounts', data);
      dispatch({ type: 'CREATE_SUCCESS', payload: res.data });
    } catch (err) {
      let errorMsg = 'Failed to create account.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, []);

  const updateAccount = useCallback(async (id: string, data: Partial<Account>) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.put(`/accounts/${id}`, data);
      dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
    } catch (err) {
      let errorMsg = 'Failed to update account.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, []);

  const deleteAccount = useCallback(async (id: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      await api.delete(`/accounts/${id}`);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
    } catch (err) {
      let errorMsg = 'Failed to delete account.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <AccountContext.Provider value={{ ...state, fetchAccounts, createAccount, updateAccount, deleteAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

// Only export AccountContextProps (not Account) to avoid export conflict
export type { AccountContextProps };
export { AccountContext };
