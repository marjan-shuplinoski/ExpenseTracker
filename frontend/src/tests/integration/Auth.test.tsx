import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../../contexts/AuthContext';
import LoginPage from '../../pages/auth/LoginPage';
import RegisterPage from '../../pages/auth/RegisterPage';
import ProfilePage from '../../pages/auth/ProfilePage';
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

const renderWithAuth = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  describe('Login Page', () => {
    test('renders login form', () => {
      renderWithAuth(<LoginPage />);
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
      expect(screen.getByText(/Don't have an account\? Register/i)).toBeInTheDocument();
    });
    test('handles successful login', async () => {
      const mockUser = { _id: 'user1', name: 'Test User', email: 'test@example.com' };
      const api = apiModule.default as unknown as { post: ReturnType<typeof vi.fn> };
      api.post.mockResolvedValueOnce({ data: { user: mockUser, token: 'fake-token' } });
      renderWithAuth(<LoginPage />);
      await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'password');
      await user.click(screen.getByRole('button', { name: /Login/i }));
      await waitFor(() => {
        expect(localStorage.getItem('jwt')).toBe('fake-token');
        expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(mockUser);
      });
    });
    test('displays error on failed login', async () => {
      const api = apiModule.default as unknown as { post: ReturnType<typeof vi.fn> };
      api.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });
      renderWithAuth(<LoginPage />);
      await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /Login/i }));
      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Register Page', () => {
    test('renders registration form', () => {
      renderWithAuth(<RegisterPage />);
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    });
    test('handles successful registration', async () => {
      const mockUser = { _id: 'user1', name: 'New User', email: 'new@example.com' };
      const api = apiModule.default as unknown as { post: ReturnType<typeof vi.fn> };
      api.post.mockResolvedValueOnce({ data: { user: mockUser, token: 'new-token' } });
      renderWithAuth(<RegisterPage />);
      await user.type(screen.getByLabelText(/Name/i), 'New User');
      await user.type(screen.getByLabelText(/Email/i), 'new@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'password');
      await user.click(screen.getByRole('button', { name: /Register/i }));
      await waitFor(() => {
        expect(localStorage.getItem('jwt')).toBe('new-token');
        expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(mockUser);
      });
    });
    test('displays error on failed registration', async () => {
      const api = apiModule.default as unknown as { post: ReturnType<typeof vi.fn> };
      api.post.mockRejectedValueOnce({ response: { data: { message: 'Email already exists' } } });
      renderWithAuth(<RegisterPage />);
      await user.type(screen.getByLabelText(/Name/i), 'Test User');
      await user.type(screen.getByLabelText(/Email/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'password');
      await user.click(screen.getByRole('button', { name: /Register/i }));
      await waitFor(() => {
        expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
      });
    });
  });

  describe('Profile Page', () => {
    test('displays user profile when authenticated', async () => {
      const mockUser = { _id: 'user1', name: 'Test User', email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('jwt', 'fake-token');
      renderWithAuth(<ProfilePage />);
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      });
    });
    test('handles profile update', async () => {
      const mockUser = { _id: 'user1', name: 'Test User', email: 'test@example.com' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('jwt', 'fake-token');
      const api = apiModule.default as unknown as { put: ReturnType<typeof vi.fn> };
      api.put.mockResolvedValueOnce({ data: { user: updatedUser } });
      renderWithAuth(<ProfilePage />);
      const nameInput = screen.getByDisplayValue('Test User');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');
      await user.click(screen.getByRole('button', { name: /Update/i }));
      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith(expect.stringContaining('/auth/profile'), expect.objectContaining({ name: 'Updated Name' }));
        expect(screen.getByText(/Profile updated successfully/i)).toBeInTheDocument();
      });
    });
  });
});
