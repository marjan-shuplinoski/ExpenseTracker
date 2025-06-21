import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../../contexts/AuthContext';
import TransactionListPage from '../../pages/transactions/TransactionListPage';
import TransactionFormPage from '../../pages/transactions/TransactionFormPage';
import RecurringTransactionsPage from '../../pages/transactions/RecurringTransactionsPage';
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

// Mock localStorage auth state
const mockLoggedInUser = () => {
  localStorage.setItem('user', JSON.stringify({
    _id: 'user1',
    name: 'Test User',
    email: 'test@example.com'
  }));
  localStorage.setItem('jwt', 'fake-token');
};

const renderWithAuth = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, '', route);
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('Transaction Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    mockLoggedInUser();
  });

  describe('Transaction List Page', () => {
    const mockTransactions = [
      {
        _id: 'tx1',
        description: 'Groceries',
        amount: 50.25,
        date: '2023-01-15',
        type: 'expense',
        category: 'Food',
        account: 'Chase'
      },
      {
        _id: 'tx2',
        description: 'Salary',
        amount: 2000,
        date: '2023-01-10',
        type: 'income',
        category: 'Income',
        account: 'Bank of America'
      }
    ];

    test('displays transactions list', async () => {
      const api = apiModule.default as unknown as { get: ReturnType<typeof vi.fn> };
      api.get.mockResolvedValueOnce({ data: mockTransactions });

      renderWithAuth(<TransactionListPage />);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/transactions'));
        expect(screen.getByText('Groceries')).toBeInTheDocument();
        expect(screen.getByText('Salary')).toBeInTheDocument();
      });
    });

    test('handles transaction deletion', async () => {
      const api = apiModule.default as unknown as { get: ReturnType<typeof vi.fn>, delete: ReturnType<typeof vi.fn> };
      api.get.mockResolvedValueOnce({ data: mockTransactions });
      api.delete.mockResolvedValueOnce({ data: { success: true } });
      const confirmSpy = vi.spyOn(window, 'confirm');
      confirmSpy.mockImplementation(() => true);
      renderWithAuth(<TransactionListPage />);
      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });
      const deleteButton = screen.getAllByRole('button', { name: /Delete/i })[0];
      await user.click(deleteButton);
      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith(expect.stringContaining('/transactions/tx1'));
      });
      confirmSpy.mockRestore();
    });
  });

  describe('Transaction Form Page', () => {
    test('creates a new transaction', async () => {
      const api = apiModule.default as unknown as { post: ReturnType<typeof vi.fn> };
      api.post.mockResolvedValueOnce({ 
        data: { 
          _id: 'new-tx',
          description: 'New Transaction',
          amount: 100,
          date: '2023-02-01',
          type: 'expense',
          category: 'Misc',
          account: 'Chase'
        } 
      });
      renderWithAuth(
        <MemoryRouter initialEntries={['/transactions/new']}>
          <Routes>
            <Route path="/transactions/new" element={<TransactionFormPage />} />
            <Route path="/transactions" element={<div data-testid="transactions-list">Transaction List</div>} />
          </Routes>
        </MemoryRouter>
      );
      await user.type(screen.getByLabelText(/description/i), 'New Transaction');
      await user.type(screen.getByLabelText(/amount/i), '100');
      await user.type(screen.getByLabelText(/date/i), '2023-02-01');
      await user.selectOptions(screen.getByLabelText(/type/i), 'expense');
      await user.type(screen.getByLabelText(/category/i), 'Misc');
      await user.type(screen.getByLabelText(/account/i), 'Chase');
      await user.click(screen.getByRole('button', { name: /Save|Create/i }));
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith(
          expect.stringContaining('/transactions'), 
          expect.objectContaining({
            description: 'New Transaction',
            amount: 100,
            date: '2023-02-01',
            type: 'expense',
            category: 'Misc',
            account: 'Chase'
          })
        );
      });
    });
  });

  describe('Recurring Transactions Page', () => {
    const mockRecurring = [
      {
        _id: 'rec1',
        name: 'Monthly Rent',
        amount: 1200,
        frequency: 'monthly',
        startDate: '2023-01-01',
        category: 'Housing',
        account: 'Chase',
        type: 'expense'
      },
      {
        _id: 'rec2',
        name: 'Salary',
        amount: 3000,
        frequency: 'monthly',
        startDate: '2023-01-15',
        category: 'Income',
        account: 'Bank of America',
        type: 'income'
      }
    ];

    test('displays recurring transactions list', async () => {
      const api = apiModule.default as unknown as { get: ReturnType<typeof vi.fn> };
      api.get.mockResolvedValueOnce({ data: mockRecurring });
      renderWithAuth(<RecurringTransactionsPage />);
      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/recurring'));
        expect(screen.getByText('Monthly Rent')).toBeInTheDocument();
        expect(screen.getByText('Salary')).toBeInTheDocument();
      });
    });

    test('adds a new recurring transaction', async () => {
      const api = apiModule.default as unknown as { get: ReturnType<typeof vi.fn>, post: ReturnType<typeof vi.fn> };
      api.get.mockResolvedValueOnce({ data: mockRecurring });
      api.post.mockResolvedValueOnce({ 
        data: {
          _id: 'rec3',
          name: 'Netflix Subscription',
          amount: 15.99,
          frequency: 'monthly',
          startDate: '2023-02-01',
          category: 'Entertainment',
          account: 'Chase',
          type: 'expense'
        }
      });
      renderWithAuth(<RecurringTransactionsPage />);
      await waitFor(() => {
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      });
      await user.type(screen.getByLabelText(/Name/i), 'Netflix Subscription');
      await user.type(screen.getByLabelText(/Amount/i), '15.99');
      await user.selectOptions(screen.getByLabelText(/Frequency/i), 'monthly');
      await user.type(screen.getByLabelText(/Start Date/i), '2023-02-01');
      await user.type(screen.getByLabelText(/Category/i), 'Entertainment');
      await user.type(screen.getByLabelText(/Account/i), 'Chase');
      await user.selectOptions(screen.getByLabelText(/Type/i), 'expense');
      await user.click(screen.getByRole('button', { name: /Add Recurring/i }));
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith(
          expect.stringContaining('/recurring'), 
          expect.objectContaining({
            name: 'Netflix Subscription',
            amount: '15.99',
            frequency: 'monthly',
            startDate: '2023-02-01',
            category: 'Entertainment',
            account: 'Chase',
            type: 'expense'
          })
        );
      });
    });

    test('deletes a recurring transaction', async () => {
      const api = apiModule.default as unknown as { get: ReturnType<typeof vi.fn>, delete: ReturnType<typeof vi.fn> };
      api.get.mockResolvedValueOnce({ data: mockRecurring });
      api.delete.mockResolvedValueOnce({ data: { success: true } });
      const confirmSpy = vi.spyOn(window, 'confirm');
      confirmSpy.mockImplementation(() => true);
      renderWithAuth(<RecurringTransactionsPage />);
      await waitFor(() => {
        expect(screen.getByText('Monthly Rent')).toBeInTheDocument();
      });
      const deleteButton = screen.getAllByRole('button', { name: /Delete/i })[0];
      await user.click(deleteButton);
      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith(expect.stringContaining('/recurring/rec1'));
      });
      confirmSpy.mockRestore();
    });
  });
});
