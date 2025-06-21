import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../../routes/ProtectedRoute';

describe('Protected Route Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  test('redirects to login when user is not authenticated', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Should redirect to login
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument();
  });

  test('allows access to protected route when user is authenticated', () => {
    // Mock authenticated user
    localStorage.setItem('user', JSON.stringify({ 
      _id: 'user1',
      name: 'Test User',
      email: 'test@example.com'
    }));
    localStorage.setItem('jwt', 'fake-token');

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Should allow access to protected route
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  test('protects nested routes properly', () => {
    // Mock authenticated user
    localStorage.setItem('user', JSON.stringify({ 
      _id: 'user1',
      name: 'Test User',
      email: 'test@example.com'
    }));
    localStorage.setItem('jwt', 'fake-token');

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/transactions/details/123']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/transactions">
                <Route index element={<div>Transactions List</div>} />
                <Route path="details/:id" element={<div>Transaction Details Page</div>} />
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Should allow access to nested protected route
    expect(screen.getByText('Transaction Details Page')).toBeInTheDocument();
  });

  test('redirects to login after logout even with cached URL', () => {
    // Start with authenticated user
    localStorage.setItem('user', JSON.stringify({ 
      _id: 'user1',
      name: 'Test User',
      email: 'test@example.com'
    }));
    localStorage.setItem('jwt', 'fake-token');

    const { rerender } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Should initially show dashboard
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();

    // Clear auth state to simulate logout
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');

    // Re-render with same URL
    rerender(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Should now redirect to login
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument();
  });
});
