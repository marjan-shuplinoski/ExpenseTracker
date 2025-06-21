import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from 'react-bootstrap';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  type: string;
  category: string;
  account: string;
  // Extend with optional fields as needed
}

const TransactionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/transactions/${id}`)
      .then(res => setTransaction(res.data))
      .catch(() => setError('Failed to load transaction'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner animation="border" role="status" aria-label="Loading" />;
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;
  if (!transaction) return <div>No transaction found.</div>;

  return (
    <main className="container py-4" aria-label="Transaction Details Page">
      <h1 className="mb-4">Transaction Details</h1>
      <dl className="row">
        <dt className="col-sm-3">Description</dt>
        <dd className="col-sm-9">{transaction.description}</dd>
        <dt className="col-sm-3">Amount</dt>
        <dd className="col-sm-9">${transaction.amount.toFixed(2)}</dd>
        <dt className="col-sm-3">Date</dt>
        <dd className="col-sm-9">{new Date(transaction.date).toLocaleDateString()}</dd>
        <dt className="col-sm-3">Type</dt>
        <dd className="col-sm-9">{transaction.type}</dd>
        <dt className="col-sm-3">Category</dt>
        <dd className="col-sm-9">{transaction.category}</dd>
        <dt className="col-sm-3">Account</dt>
        <dd className="col-sm-9">{transaction.account}</dd>
      </dl>
    </main>
  );
};

export default TransactionDetailsPage;
