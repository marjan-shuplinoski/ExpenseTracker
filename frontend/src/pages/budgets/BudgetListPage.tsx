import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Budget {
  _id: string;
  name: string;
  amount: number;
  period: string;
  category: string;
  startDate: string;
  endDate: string;
}

const BudgetListPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<keyof Budget>('startDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get('/budgets')
      .then(res => setBudgets(res.data))
      .catch(err => setError(err?.response?.data?.message || 'Failed to fetch budgets.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredBudgets = useMemo(() => {
    let filtered = budgets;
    if (filter) {
      const f = filter.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(f) ||
        b.category.toLowerCase().includes(f) ||
        b.period.toLowerCase().includes(f)
      );
    }
    filtered = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (a[sortKey] < b[sortKey]) cmp = -1;
      if (a[sortKey] > b[sortKey]) cmp = 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return filtered;
  }, [budgets, filter, sortKey, sortDir]);

  const handleSort = (key: keyof Budget) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Budgets</h2>
        <Button variant="primary" onClick={() => navigate('/budgets/new')}>Add Budget</Button>
      </div>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
        <InputGroup.Text id="filter-label">Filter</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by name, category, or period"
          aria-label="Filter budgets"
          aria-describedby="filter-label"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </InputGroup>
      <div className="table-responsive">
        <Table striped bordered hover size="sm" aria-label="Budgets table">
          <thead>
            <tr>
              <th role="button" tabIndex={0} onClick={() => handleSort('name')}>Name</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('amount')}>Amount</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('period')}>Period</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('category')}>Category</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('startDate')}>Start Date</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('endDate')}>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
            ) : filteredBudgets.length === 0 ? (
              <tr><td colSpan={7} className="text-center">No budgets found.</td></tr>
            ) : (
              filteredBudgets.map(budget => (
                <tr key={budget._id}>
                  <td>{budget.name}</td>
                  <td>{budget.amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                  <td>{budget.period}</td>
                  <td>{budget.category}</td>
                  <td>{new Date(budget.startDate).toLocaleDateString()}</td>
                  <td>{new Date(budget.endDate).toLocaleDateString()}</td>
                  <td>
                    <Button size="sm" variant="outline-secondary" onClick={() => navigate(`/budgets/${budget._id}/edit`)} aria-label={`Edit ${budget.name}`}>Edit</Button>{' '}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default BudgetListPage;
