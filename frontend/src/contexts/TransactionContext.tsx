import React, { createContext, useReducer, useCallback, useEffect, useContext } from 'react';
import api from '../services/api';
import { BudgetContext } from './BudgetContext';

export interface Transaction {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  account: string;
  type: 'income' | 'expense';
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

type TransactionAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Transaction[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'CREATE_SUCCESS'; payload: Transaction }
  | { type: 'UPDATE_SUCCESS'; payload: Transaction }
  | { type: 'DELETE_SUCCESS'; payload: string };

function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { transactions: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_SUCCESS':
      return { ...state, transactions: [...state.transactions, action.payload], loading: false };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        transactions: state.transactions.map(txn => txn._id === action.payload._id ? action.payload : txn),
        loading: false,
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        transactions: state.transactions.filter(txn => txn._id !== action.payload),
        loading: false,
      };
    default:
      return state;
  }
}

export interface TransactionContextProps extends TransactionState {
  fetchTransactions: () => Promise<void>;
  createTransaction: (data: Partial<Transaction>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const budgetCtx = useContext(BudgetContext);

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

  const fetchTransactions = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.get('/transactions');
      dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
    } catch (err) {
      let errorMsg = 'Failed to fetch transactions.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, []);

  const createTransaction = useCallback(async (data: Partial<Transaction>) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.post('/transactions', data);
      dispatch({ type: 'CREATE_SUCCESS', payload: res.data });
      await fetchTransactions();
      if (budgetCtx?.fetchBudgets) await budgetCtx.fetchBudgets();
    } catch (err) {
      let errorMsg = 'Failed to create transaction.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, [fetchTransactions, budgetCtx]);

  const updateTransaction = useCallback(async (id: string, data: Partial<Transaction>) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.put(`/transactions/${id}`, data);
      dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
      await fetchTransactions();
      if (budgetCtx?.fetchBudgets) await budgetCtx.fetchBudgets();
    } catch (err) {
      let errorMsg = 'Failed to update transaction.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, [fetchTransactions, budgetCtx]);

  const deleteTransaction = useCallback(async (id: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      await api.delete(`/transactions/${id}`);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
    } catch (err) {
      let errorMsg = 'Failed to delete transaction.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TransactionContext.Provider value={{ ...state, fetchTransactions, createTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext };
