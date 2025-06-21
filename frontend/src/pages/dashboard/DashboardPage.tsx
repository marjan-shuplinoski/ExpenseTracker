import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { BudgetContext } from '../../contexts/BudgetContext';
import { TransactionContext } from '../../contexts/TransactionContext';

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
  const [chartData, setChartData] = useState<PieChartData | null>(null);
  const [barData, setBarData] = useState<BarChartData | null>(null);

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, [fetchBudgets, fetchTransactions]);

  useEffect(() => {
    // Example: Pie chart for expenses by category
    const expenseByCategory: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });
    setChartData({
      labels: Object.keys(expenseByCategory),
      datasets: [{
        data: Object.values(expenseByCategory),
        backgroundColor: [
          '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#17a2b8', '#343a40', '#6c757d'
        ],
      }],
    });
    // Example: Bar chart for budget usage
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
  }, [budgets, transactions]);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      {(budgetsError || txError) && <Alert variant="danger">{budgetsError || txError}</Alert>}
      {(budgetsLoading || txLoading) && <Spinner animation="border" />}
      <Row className="mb-4">
        <Col md={6}>
          <Card aria-label="Expenses by Category">
            <Card.Body>
              <Card.Title>Expenses by Category</Card.Title>
              {chartData ? <Doughnut data={chartData} aria-label="Expenses Pie Chart" /> : <Spinner animation="border" />}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card aria-label="Budget Usage">
            <Card.Body>
              <Card.Title>Budget Usage</Card.Title>
              {barData ? <Bar data={barData} aria-label="Budget Bar Chart" /> : <Spinner animation="border" />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
