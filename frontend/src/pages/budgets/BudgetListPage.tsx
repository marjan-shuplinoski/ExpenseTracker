import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Spinner, Alert, Form, InputGroup, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCategory } from '../../contexts/CategoryContext';

interface Budget {
  _id: string;
  name: string;
  amount: number;
  period: string;
  category: string;
  startDate: string;
  endDate: string;
  currentBalance: number; // not optional, always present from backend
}

const BudgetListPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<keyof Budget>('startDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const { state: categoryState } = useCategory();

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

  const totalPages = Math.ceil(filteredBudgets.length / pageSize);
  const paginatedBudgets = filteredBudgets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: keyof Budget) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/budgets/${id}`);
      setBudgets(budgets => budgets.filter(b => b._id !== id));
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Failed to delete budget.');
    } finally {
      setLoading(false);
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
              <th role="button" tabIndex={0} onClick={() => handleSort('amount')}>Planned</th>
              <th>Current Balance</th>
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
            ) : paginatedBudgets.length === 0 ? (
              <tr><td colSpan={7} className="text-center">No budgets found.</td></tr>
            ) : (
              paginatedBudgets.map(budget => {
                const cat = categoryState.categories.find(c => c._id === budget.category);
                return (
                  <tr key={budget._id}>
                    <td>{budget.name}</td>
                    <td>{budget.amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                    <td>{budget.currentBalance.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                    <td>{budget.period}</td>
                    <td>{cat ? cat.name : budget.category}</td>
                    <td>{new Date(budget.startDate).toLocaleDateString()}</td>
                    <td>{new Date(budget.endDate).toLocaleDateString()}</td>
                    <td>
                      <Button size="sm" variant="outline-secondary" onClick={() => navigate(`/budgets/${budget._id}/edit`)} aria-label={`Edit ${budget.name}`}>Edit</Button>{' '}
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(budget._id)} aria-label={`Delete ${budget.name}`}>Delete</Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
      <Pagination className="justify-content-center mt-3">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={currentPage === idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
};

export default BudgetListPage;
