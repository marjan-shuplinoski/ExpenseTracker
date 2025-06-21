import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import api from '../services/api';

export interface Budget {
  _id: string;
  name: string;
  amount: number;
  period: string;
  category: string;
  startDate: string;
  endDate: string;
}

interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
};

type BudgetAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Budget[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'CREATE_SUCCESS'; payload: Budget }
  | { type: 'UPDATE_SUCCESS'; payload: Budget }
  | { type: 'DELETE_SUCCESS'; payload: string };

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { budgets: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_SUCCESS':
      return { ...state, budgets: [...state.budgets, action.payload], loading: false };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        budgets: state.budgets.map(b => b._id === action.payload._id ? action.payload : b),
        loading: false,
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        budgets: state.budgets.filter(b => b._id !== action.payload),
        loading: false,
      };
    default:
      return state;
  }
}

export interface BudgetContextProps extends BudgetState {
  fetchBudgets: () => Promise<void>;
  createBudget: (data: Partial<Budget>) => Promise<void>;
  updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextProps | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

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

  const fetchBudgets = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.get('/budgets');
      dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
    } catch (err) {
      let errorMsg = 'Failed to fetch budgets.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, []);

  const createBudget = useCallback(async (data: Partial<Budget>) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.post('/budgets', data);
      dispatch({ type: 'CREATE_SUCCESS', payload: res.data });
    } catch (err) {
      let errorMsg = 'Failed to create budget.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, []);

  const updateBudget = useCallback(async (id: string, data: Partial<Budget>) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.put(`/budgets/${id}`, data);
      dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
    } catch (err) {
      let errorMsg = 'Failed to update budget.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, []);

  const deleteBudget = useCallback(async (id: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      await api.delete(`/budgets/${id}`);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
    } catch (err) {
      let errorMsg = 'Failed to delete budget.';
      if (isApiError(err)) errorMsg = err.response.data.message;
      else if (err instanceof Error) errorMsg = err.message;
      dispatch({ type: 'FETCH_ERROR', payload: errorMsg });
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return (
    <BudgetContext.Provider value={{ ...state, fetchBudgets, createBudget, updateBudget, deleteBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

export { BudgetContext };
