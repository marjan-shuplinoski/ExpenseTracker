import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className="btn btn-outline-secondary ms-2"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <span aria-hidden="true">🌙</span>
      ) : (
        <span aria-hidden="true">☀️</span>
      )}
    </button>
  );
};

export default ThemeToggle;
