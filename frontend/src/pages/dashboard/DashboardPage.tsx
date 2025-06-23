import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { BudgetContext } from '../../contexts/BudgetContext';
import { TransactionContext } from '../../contexts/TransactionContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useCategory } from '../../contexts/CategoryContext';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type PieChartData = {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
};

type BarChartData = {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
  }>;
};

const DashboardPage: React.FC = () => {
  const { budgets, loading: budgetsLoading, error: budgetsError, fetchBudgets } = useContext(BudgetContext)!;
  const { transactions, loading: txLoading, error: txError, fetchTransactions } = useContext(TransactionContext)!;
  const { user } = React.useContext(AuthContext)!;
  const { state: categoryState } = useCategory();
  const [chartData, setChartData] = useState<PieChartData | null>(null);
  const [barData, setBarData] = useState<BarChartData | null>(null);
  const [categoryBarData, setCategoryBarData] = useState<BarChartData | null>(null);

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, [fetchBudgets, fetchTransactions]);

  useEffect(() => {
    // Pie chart for expenses by category
    const expenseByCategory: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });
    // Map category IDs to names for labels
    const categoryIdToName = Object.fromEntries(categoryState.categories.map(c => [c._id, c.name]));
    setChartData({
      labels: Object.keys(expenseByCategory).map(id => categoryIdToName[id] || id),
      datasets: [{
        data: Object.values(expenseByCategory),
        backgroundColor: [
          '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#17a2b8', '#343a40', '#6c757d'
        ],
      }],
    });
    // Bar chart for budget usage
    setBarData({
      labels: budgets.map(b => b.name),
      datasets: [{
        label: 'Budgeted',
        data: budgets.map(b => b.amount),
        backgroundColor: '#007bff',
      }, {
        label: 'Spent',
        data: budgets.map(b => transactions.filter(t => t.category === b.category && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)),
        backgroundColor: '#dc3545',
      }],
    });
    // Grouped bar chart: income and expense per category
    const categories = Array.from(new Set(transactions.map(t => t.category)));
    const incomeData = categories.map(cat => transactions.filter(t => t.category === cat && t.type === 'income').reduce((sum, t) => sum + t.amount, 0));
    const expenseData = categories.map(cat => transactions.filter(t => t.category === cat && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    setCategoryBarData({
      labels: categories.map(id => categoryIdToName[id] || id),
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: '#28a745',
        },
        {
          label: 'Expense',
          data: expenseData,
          backgroundColor: '#dc3545',
        },
      ],
    });
  }, [budgets, transactions, categoryState.categories]);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3" style={{ gap: 12 }}>
        <h2 className="mb-0" style={{ fontSize: '2rem', fontWeight: 600, color: 'white' }}>
          Welcome, 
        </h2>
        <span style={{ fontSize: '2rem', fontWeight: 600, color: 'white' }}>{user?.name}</span>
        {user?.avatar && (
          <img src={user.avatar} alt="Profile" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginLeft: 8 }} />
        )}
      </div>
      {(budgetsError || txError) && <Alert variant="danger">{budgetsError || txError}</Alert>}
      {(budgetsLoading || txLoading) && <Spinner animation="border" />}
      <Row className="mb-4">
        <Col md={6} style={{ display: 'flex', flexDirection: 'column', height: 400 }}>
          <Card aria-label="Expenses by Category" style={{ flex: 1 }}>
            <Card.Body style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Card.Title>Expenses by Category</Card.Title>
              <div style={{ flex: 1, minHeight: 0 }}>
                {chartData ? <Doughnut data={chartData} aria-label="Expenses Pie Chart" options={{ maintainAspectRatio: false }} height={300} /> : <Spinner animation="border" />}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} style={{ display: 'flex', flexDirection: 'column', height: 400 }}>
          <Card aria-label="Budget Usage" style={{ flex: 1 }}>
            <Card.Body style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Card.Title>Budget Usage</Card.Title>
              <div style={{ flex: 1, minHeight: 0 }}>
                {barData ? <Bar data={barData} aria-label="Budget Bar Chart" options={{ maintainAspectRatio: false }} height={300} /> : <Spinner animation="border" />}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4" style={{ position: 'relative', top: 50 }}>
        <Col md={12}>
          <Card aria-label="Income and Expense per Category">
            <Card.Body>
              <Card.Title>Income and Expense per Category</Card.Title>
              {categoryBarData ? <Bar data={categoryBarData} aria-label="Income and Expense Bar Chart" options={{ responsive: true, plugins: { legend: { position: 'top' } } }} /> : <Spinner animation="border" />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
