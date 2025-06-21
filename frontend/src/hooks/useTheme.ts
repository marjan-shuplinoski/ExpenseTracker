import { useContext } from 'react';
import type { ThemeContextProps } from '../contexts/ThemeContext';
import { ThemeContext } from '../contexts/ThemeContextContext';

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context as ThemeContextProps;
};
