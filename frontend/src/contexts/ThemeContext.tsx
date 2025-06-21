import React, { useEffect, useReducer } from 'react';
import { ThemeContext } from './ThemeContextContext';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
}

export type ThemeContextProps = {
  theme: Theme;
  toggleTheme: () => void;
};

const themeReducer = (state: ThemeState, action: { type: 'TOGGLE' }): ThemeState => {
  switch (action.type) {
    case 'TOGGLE':
      return { theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
};

const getPreferredTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, { theme: getPreferredTheme() });

  useEffect(() => {
    document.body.dataset.bsTheme = state.theme;
    document.body.classList.toggle('dark-mode', state.theme === 'dark');
  }, [state.theme]);

  const toggleTheme = () => dispatch({ type: 'TOGGLE' });

  return (
    <ThemeContext.Provider value={{ theme: state.theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
