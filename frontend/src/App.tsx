import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
// Page imports
import DashboardPage from './pages/dashboard/DashboardPage';
import AccountListPage from './pages/accounts/AccountListPage';
import AccountFormPage from './pages/accounts/AccountFormPage';
import TransactionListPage from './pages/transactions/TransactionListPage';
import TransactionFormPage from './pages/transactions/TransactionFormPage';
import RecurringTransactionsPage from './pages/transactions/RecurringTransactionsPage';
import BudgetListPage from './pages/budgets/BudgetListPage';
import BudgetFormPage from './pages/budgets/BudgetFormPage';
import CategoryListPage from './pages/categories/CategoryListPage';
import CategoryFormPage from './pages/categories/CategoryFormPage';
import ReportsPage from './pages/reports/ReportsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';
import AccountDetailsPage from './pages/accounts/AccountDetailsPage';
import BudgetDetailsPage from './pages/budgets/BudgetDetailsPage';
import CategoryDetailsPage from './pages/categories/CategoryDetailsPage';
import TransactionDetailsPage from './pages/transactions/TransactionDetailsPage';

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {!user ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <>
          <Menu />
          <nav className="navbar navbar-light bg-light justify-content-end p-3" aria-label="Theme toggle navigation">
            <ThemeToggle />
          </nav>
          <div className="container py-4">
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/accounts" element={<AccountListPage />} />
                <Route path="/accounts/new" element={<AccountFormPage />} />
                <Route path="/transactions" element={<TransactionListPage />} />
                <Route path="/transactions/new" element={<TransactionFormPage />} />
                <Route path="/recurring" element={<RecurringTransactionsPage />} />
                <Route path="/budgets" element={<BudgetListPage />} />
                <Route path="/budgets/new" element={<BudgetFormPage />} />
                <Route path="/categories" element={<CategoryListPage />} />
                <Route path="/categories/new" element={<CategoryFormPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/logout" element={<Navigate to="/login" replace />} />
                <Route path="/accounts/:id" element={<AccountDetailsPage />} />
                <Route path="/budgets/:id" element={<BudgetDetailsPage />} />
                <Route path="/categories/:id" element={<CategoryDetailsPage />} />
                <Route path="/transactions/:id" element={<TransactionDetailsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <main className="min-vh-100 bg-body" aria-label="Main Content">
            <AppRoutes />
          </main>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
