import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import ProtectedRoute from './routes/ProtectedRoute';
import { BudgetProvider } from './contexts/BudgetContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { AccountProvider } from './contexts/AccountContext';
import { CategoryProvider } from './contexts/CategoryContext';
import LoadingScreen from './components/LoadingScreen';
import { useAuth } from './hooks/useAuth';
import { NotificationProvider } from './contexts/NotificationContext';
import Notification from './components/Notification';
import NotificationHandlerBridge from './contexts/NotificationHandlerBridge';
import Footer from './components/Footer';
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
import RecurringTransactionFormPage from './pages/transactions/RecurringTransactionFormPage';
import LogoutPage from './pages/auth/LogoutPage';

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;

  return (
    <>
      <Menu />
      <div className="container py-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountListPage />} />
            <Route path="/accounts/new" element={<AccountFormPage />} />
            <Route path="/transactions" element={<TransactionListPage />} />
            <Route path="/transactions/new" element={<TransactionFormPage />} />
            <Route path="/recurring" element={<RecurringTransactionsPage />} />
            <Route path="/recurring/new" element={<RecurringTransactionFormPage />} />
            <Route path="/recurring/:id/edit" element={<RecurringTransactionFormPage />} />
            <Route path="/budgets" element={<BudgetListPage />} />
            <Route path="/budgets/new" element={<BudgetFormPage />} />
            <Route path="/categories" element={<CategoryListPage />} />
            <Route path="/categories/new" element={<CategoryFormPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/accounts/:id" element={<AccountDetailsPage />} />
            <Route path="/accounts/:id/edit" element={<AccountFormPage />} />
            <Route path="/budgets/:id" element={<BudgetDetailsPage />} />
            <Route path="/budgets/:id/edit" element={<BudgetFormPage />} />
            <Route path="/categories/:id" element={<CategoryDetailsPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailsPage />} />
            <Route path="/transactions/:id/edit" element={<TransactionFormPage />} />
            <Route path="/categories/:id/edit" element={<CategoryFormPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <NotificationProvider>
      <NotificationHandlerBridge />
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AccountProvider>
              <BudgetProvider>
                <TransactionProvider>
                  <CategoryProvider>
                    <main className="min-vh-100 bg-body" aria-label="Main Content">
                      <Notification />
                      <AppRoutes />
                      <Footer />
                    </main>
                  </CategoryProvider>
                </TransactionProvider>
              </BudgetProvider>
            </AccountProvider>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
