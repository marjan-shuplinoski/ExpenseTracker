import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import App from '../../App';
import * as apiModule from '../../services/api';

// Mock API
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

const user = userEvent.setup();

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, '', route);
  return render(
    <AuthProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={[route]}>
          {ui}
        </MemoryRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.localStorage.clear();
  });

  test('redirects unauthenticated users to login', async () => {
    renderWithProviders(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
  });

  test('shows dashboard after authentication', async () => {
    // Mock login API call
    const mockUser = { _id: 'user1', name: 'Test User', email: 'test@example.com' };
    const api = apiModule.default as unknown as { post: ReturnType<typeof vi.fn>, get: ReturnType<typeof vi.fn> };
    api.post.mockResolvedValueOnce({ data: { user: mockUser, token: 'fake-token' } });
    api.get.mockResolvedValue({ data: {} });

    renderWithProviders(<App />);

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password');
    await user.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });

  test('navigation menu works for authenticated users', async () => {
    window.localStorage.setItem('user', JSON.stringify({ 
      _id: 'user1', 
      name: 'Test User', 
      email: 'test@example.com' 
    }));
    const api = apiModule.default as unknown as { get: ReturnType<typeof vi.fn> };
    api.get.mockResolvedValue({ data: [] });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('link', { name: /Transactions/i }));
    await waitFor(() => {
      expect(screen.getByText(/Transaction List|Transactions/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('link', { name: /Categories/i }));
    await waitFor(() => {
      expect(screen.getByText(/Categories/i)).toBeInTheDocument();
    });
  });

  test('logout clears auth state and redirects to login', async () => {
    window.localStorage.setItem('user', JSON.stringify({ 
      _id: 'user1', 
      name: 'Test User', 
      email: 'test@example.com' 
    }));
    const api = apiModule.default as unknown as { get: ReturnType<typeof vi.fn> };
    api.get.mockResolvedValue({ data: [] });

    renderWithProviders(<App />);

    await user.click(screen.getByRole('link', { name: /Logout/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
      expect(window.localStorage.getItem('user')).toBeNull();
    });
  });

  test('register form validation works', async () => {
    renderWithProviders(<App />);

    await user.click(screen.getByText(/Register/i));
    await user.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/name.*required/i)).toBeInTheDocument();
      expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
      expect(screen.getByText(/password.*required/i)).toBeInTheDocument();
    });
  });

  test('login form shows error on failed login', async () => {
    const api = apiModule.default as unknown as { post: ReturnType<typeof vi.fn> };
    api.post.mockRejectedValueOnce({ 
      response: { data: { message: 'Invalid credentials' } }
    });

    renderWithProviders(<App />);

    await user.type(screen.getByLabelText(/Email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('protected routes redirect unauthenticated users', async () => {
    const api = apiModule.default as unknown as { get: ReturnType<typeof vi.fn> };
    api.get.mockResolvedValue({ data: [] });

    renderWithProviders(<App />, { route: '/dashboard' });

    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
  });
});
