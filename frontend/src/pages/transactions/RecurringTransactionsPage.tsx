import React, { useEffect, useState } from 'react';
import { Button, Form, Table, Spinner, Alert } from 'react-bootstrap';
import api from '../../services/api';

export type RecurringTransaction = {
  _id?: string;
  name: string;
  amount: number;
  frequency: string;
  startDate: string;
  endDate?: string;
  category: string;
  account: string;
  type: 'income' | 'expense';
};

const RecurringTransactionsPage: React.FC = () => {
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<RecurringTransaction>>({ type: 'expense' });
  const [submitting, setSubmitting] = useState(false);

  const fetchRecurring = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/recurring');
      setRecurring(res.data);
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Failed to load recurring transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/recurring', form);
      setForm({ type: 'expense' });
      fetchRecurring();
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Failed to add recurring transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this recurring transaction?')) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/recurring/${id}`);
      fetchRecurring();
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Failed to delete recurring transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Recurring Transactions</h2>
      <Form onSubmit={handleSubmit} className="mb-4" aria-label="Add Recurring Transaction">
        <Form.Group className="mb-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" value={form.name || ''} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2" controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control name="amount" type="number" value={form.amount || ''} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2" controlId="frequency">
          <Form.Label>Frequency</Form.Label>
          <Form.Select name="frequency" value={form.frequency || ''} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2" controlId="startDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control name="startDate" type="date" value={form.startDate || ''} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2" controlId="endDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control name="endDate" type="date" value={form.endDate || ''} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control name="category" value={form.category || ''} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2" controlId="account">
          <Form.Label>Account</Form.Label>
          <Form.Control name="account" value={form.account || ''} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2" controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Select name="type" value={form.type || 'expense'} onChange={handleChange} required>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" disabled={submitting} variant="primary">
          {submitting ? <Spinner size="sm" animation="border" /> : 'Add Recurring'}
        </Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive aria-label="Recurring Transactions List">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Frequency</th>
              <th>Start</th>
              <th>End</th>
              <th>Category</th>
              <th>Account</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recurring.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">No recurring transactions</td>
              </tr>
            ) : (
              recurring.map(r => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{r.amount}</td>
                  <td>{r.frequency}</td>
                  <td>{r.startDate}</td>
                  <td>{r.endDate || '-'}</td>
                  <td>{r.category}</td>
                  <td>{r.account}</td>
                  <td>{r.type}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => r._id && handleDelete(r._id)} aria-label={`Delete ${r.name}`}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default RecurringTransactionsPage;
