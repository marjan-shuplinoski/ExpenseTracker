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

const ReportsPage: React.FC = () => {
  const { budgets, loading: budgetsLoading, error: budgetsError, fetchBudgets } = useContext(BudgetContext)!;
  const { transactions, loading: txLoading, error: txError, fetchTransactions } = useContext(TransactionContext)!;
  const [pieData, setPieData] = useState<PieChartData | null>(null);
  const [barData, setBarData] = useState<BarChartData | null>(null);

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, [fetchBudgets, fetchTransactions]);

  useEffect(() => {
    // Pie chart: Income vs Expense
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    setPieData({
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#28a745', '#dc3545'],
      }],
    });
    // Bar chart: Expenses per Budget
    setBarData({
      labels: budgets.map(b => b.name),
      datasets: [{
        label: 'Spent',
        data: budgets.map(b => transactions.filter(t => t.category === b.category && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)),
        backgroundColor: '#dc3545',
      }],
    });
  }, [budgets, transactions]);

  return (
    <div className="container mt-4">
      <h2>Reports</h2>
      {(budgetsError || txError) && <Alert variant="danger">{budgetsError || txError}</Alert>}
      {(budgetsLoading || txLoading) && <Spinner animation="border" />}
      <Row className="mb-4">
        <Col md={6}>
          <Card aria-label="Income vs Expense">
            <Card.Body>
              <Card.Title>Income vs Expense</Card.Title>
              {pieData ? <Doughnut data={pieData} aria-label="Income vs Expense Pie Chart" /> : <Spinner animation="border" />}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card aria-label="Expenses per Budget">
            <Card.Body>
              <Card.Title>Expenses per Budget</Card.Title>
              {barData ? <Bar data={barData} aria-label="Expenses Bar Chart" /> : <Spinner animation="border" />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsPage;
