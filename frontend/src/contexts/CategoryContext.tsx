import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { fetchCategories } from '../services/categoryService';

export type Category = {
  _id?: string;
  name: string;
  type: 'income' | 'expense';
};

export type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

export type CategoryAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Category[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string };

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

function categoryReducer(state: CategoryState, action: CategoryAction): CategoryState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, categories: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [action.payload, ...state.categories] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat._id === action.payload._id ? action.payload : cat
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat._id !== action.payload),
      };
    default:
      return state;
  }
}

const CategoryContext = createContext<{
  state: CategoryState;
  dispatch: Dispatch<CategoryAction>;
} | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  React.useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    fetchCategories()
      .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(e => dispatch({ type: 'FETCH_ERROR', payload: e?.message || 'Failed to load categories' }));
  }, []);

  return (
    <CategoryContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoryContext.Provider>
  );
};

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategory must be used within a CategoryProvider');
  return context;
}
