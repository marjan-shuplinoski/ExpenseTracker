import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { ThemeProvider } from '../../contexts/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

describe('Theme Toggle Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Reset local storage and theme
    localStorage.clear();
    
    // Remove any theme classes from document body
    document.body.classList.remove('light-theme', 'dark-theme');
    
    // Reset mock for matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    });
  });

  test('toggles theme between light and dark', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const user = userEvent.setup();
    
    // Default theme should be light
    expect(document.body.classList).toContain('light-theme');
    
    // Click to toggle to dark theme
    await user.click(screen.getByLabelText(/Toggle Theme/i));
    
    // Theme should change to dark
    await waitFor(() => {
      expect(document.body.classList).toContain('dark-theme');
      expect(document.body.classList).not.toContain('light-theme');
    });
    
    // Verify theme is stored in localStorage
    expect(localStorage.getItem('theme')).toBe('dark');
    
    // Click to toggle back to light theme
    await user.click(screen.getByLabelText(/Toggle Theme/i));
    
    // Theme should change back to light
    await waitFor(() => {
      expect(document.body.classList).toContain('light-theme');
      expect(document.body.classList).not.toContain('dark-theme');
    });
    
    // Verify theme is stored in localStorage
    expect(localStorage.getItem('theme')).toBe('light');
  });
  
  test('respects user system preference for dark theme', async () => {
    // Mock user preference for dark theme via matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    });
    
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    // Theme should be dark based on system preference
    expect(document.body.classList).toContain('dark-theme');
    expect(document.body.classList).not.toContain('light-theme');
  });
  
  test('persists theme preference across sessions', async () => {
    // Set dark theme in localStorage before component renders
    localStorage.setItem('theme', 'dark');
    
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    // Theme should be dark based on localStorage value
    expect(document.body.classList).toContain('dark-theme');
    expect(document.body.classList).not.toContain('light-theme');
  });
});
