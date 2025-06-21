import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from 'react-bootstrap';

interface Budget {
  _id: string;
  name: string;
  amount: number;
  period: string;
  // Extend with optional fields as needed
}

const BudgetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/budgets/${id}`)
      .then(res => setBudget(res.data))
      .catch(() => setError('Failed to load budget'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner animation="border" role="status" aria-label="Loading" />;
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;
  if (!budget) return <div>No budget found.</div>;

  return (
    <main className="container py-4" aria-label="Budget Details Page">
      <h1 className="mb-4">Budget Details</h1>
      <dl className="row">
        <dt className="col-sm-3">Name</dt>
        <dd className="col-sm-9">{budget.name}</dd>
        <dt className="col-sm-3">Amount</dt>
        <dd className="col-sm-9">${budget.amount.toFixed(2)}</dd>
        <dt className="col-sm-3">Period</dt>
        <dd className="col-sm-9">{budget.period}</dd>
      </dl>
    </main>
  );
};

export default BudgetDetailsPage;
