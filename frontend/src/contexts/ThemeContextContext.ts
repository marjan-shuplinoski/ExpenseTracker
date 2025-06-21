import { createContext } from 'react';
import type { ThemeContextProps } from './ThemeContext';

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
