import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from 'react-bootstrap';

interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  // Extend with optional fields as needed
  // e.g. description?: string;
}

const AccountDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/accounts/${id}`)
      .then(res => setAccount(res.data))
      .catch(() => setError('Failed to load account'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner animation="border" role="status" aria-label="Loading" />;
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;
  if (!account) return <div>No account found.</div>;

  return (
    <main className="container py-4" aria-label="Account Details Page">
      <h1 className="mb-4">Account Details</h1>
      <dl className="row">
        <dt className="col-sm-3">Name</dt>
        <dd className="col-sm-9">{account.name}</dd>
        <dt className="col-sm-3">Type</dt>
        <dd className="col-sm-9">{account.type}</dd>
        <dt className="col-sm-3">Balance</dt>
        <dd className="col-sm-9">${account.balance.toFixed(2)}</dd>
      </dl>
    </main>
  );
};

export default AccountDetailsPage;
