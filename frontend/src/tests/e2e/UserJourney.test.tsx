import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../../App';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
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

const renderApp = () => {
  render(
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

describe('End-to-End User Journey', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    // Reset browser history
    window.history.pushState({}, '', '/');
  });

  test('Complete user journey: login, create transaction, view dashboard', async () => {
    // Mock API responses
    const api = apiModule.default as unknown as {
      get: ReturnType<typeof vi.fn>,
      post: ReturnType<typeof vi.fn>,
    };

    // User data
    const mockUser = { _id: 'user1', name: 'E2E Test User', email: 'e2e@example.com' };

    // Step 1: Login response
    api.post.mockImplementationOnce(() => 
      Promise.resolve({ data: { user: mockUser, token: 'e2e-token' } })
    );

    // Step 2: Get accounts for transaction form
    api.get.mockImplementationOnce(() => 
      Promise.resolve({ data: [
        { _id: 'acc1', name: 'Checking Account', balance: 1000 }
      ]})
    );

    // Step 3: Get categories for transaction form
    api.get.mockImplementationOnce(() => 
      Promise.resolve({ data: [
        { _id: 'cat1', name: 'Groceries', type: 'expense' }
      ]})
    );

    // Step 4: Create transaction response
    api.post.mockImplementationOnce(() => 
      Promise.resolve({ data: {
        _id: 'tx1',
        description: 'Supermarket shopping',
        amount: 75.5,
        date: '2023-04-15',
        type: 'expense',
        category: 'cat1',
        account: 'acc1'
      }})
    );

    // Step 5: Dashboard data loading
    api.get.mockImplementationOnce(() => 
      Promise.resolve({ data: {
        totalIncome: 2000,
        totalExpense: 800,
        balance: 1200,
        recentTransactions: [
          {
            _id: 'tx1',
            description: 'Supermarket shopping',
            amount: 75.5,
            date: '2023-04-15',
            type: 'expense',
            category: { _id: 'cat1', name: 'Groceries', type: 'expense' },
            account: { _id: 'acc1', name: 'Checking Account' }
          }
        ]
      }})
    );

    // Render the entire app
    renderApp();

    // User interaction flows
    const user = userEvent.setup();

    // STEP 1: Login process
    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Email/i), 'e2e@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password');
    await user.click(screen.getByRole('button', { name: /Login/i }));

    // Verify user sees dashboard after login
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
    
    // STEP 2: Navigate to create transaction
    await user.click(screen.getByRole('link', { name: /Transactions/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Transaction List/i)).toBeInTheDocument();
    });
    
    await user.click(screen.getByRole('link', { name: /Add Transaction/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/New Transaction/i)).toBeInTheDocument();
    });
    
    // STEP 3: Fill and submit transaction form
    await user.type(screen.getByLabelText(/Description/i), 'Supermarket shopping');
    await user.type(screen.getByLabelText(/Amount/i), '75.5');
    await user.type(screen.getByLabelText(/Date/i), '2023-04-15');
    await user.selectOptions(screen.getByLabelText(/Type/i), 'expense');
    await user.selectOptions(screen.getByLabelText(/Category/i), 'Groceries');
    await user.selectOptions(screen.getByLabelText(/Account/i), 'Checking Account');
    
    await user.click(screen.getByRole('button', { name: /Save/i }));
    
    // STEP 4: Verify user is redirected to transactions list
    await waitFor(() => {
      expect(screen.getByText(/Transaction List/i)).toBeInTheDocument();
      expect(api.post).toHaveBeenCalledTimes(2); // Login and create transaction
      expect(api.post).toHaveBeenLastCalledWith(
        expect.stringContaining('/transactions'),
        expect.objectContaining({
          description: 'Supermarket shopping',
          amount: 75.5,
        })
      );
    });
    
    // STEP 5: Navigate back to dashboard
    await user.click(screen.getByRole('link', { name: /Dashboard/i }));
    
    // Verify dashboard shows updated data
    await waitFor(() => {
      expect(screen.getByText(/Total Income/i)).toBeInTheDocument();
      expect(screen.getByText(/2000/)).toBeInTheDocument(); // Total income value
      expect(screen.getByText(/800/)).toBeInTheDocument();  // Total expense value
      expect(screen.getByText(/Supermarket shopping/i)).toBeInTheDocument(); // Recent transaction
    });
    
    // STEP 6: Logout
    await user.click(screen.getByRole('link', { name: /Logout/i }));
    
    // Verify user is logged out and redirected to login
    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('jwt')).toBeNull();
    });
  });
});
