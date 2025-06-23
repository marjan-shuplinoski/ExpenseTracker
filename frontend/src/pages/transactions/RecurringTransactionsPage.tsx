import React, { useEffect, useState, useContext } from 'react';
import { Button, Table, Spinner, Alert, InputGroup, Form, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatShortDate } from '../../utils/dateFormat';
import { useCategory } from '../../contexts/CategoryContext';
import { AccountContext } from '../../contexts/AccountContext';

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
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const { state: categoryState } = useCategory();
  const accountCtx = useContext(AccountContext);

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

  const handleDelete = async (id: string) => {
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

  const filteredRecurring = React.useMemo(() => {
    if (!filter) return recurring;
    const f = filter.toLowerCase();
    return recurring.filter(r =>
      r.name.toLowerCase().includes(f) ||
      r.category.toLowerCase().includes(f) ||
      r.account.toLowerCase().includes(f) ||
      r.type.toLowerCase().includes(f) ||
      r.frequency.toLowerCase().includes(f)
    );
  }, [recurring, filter]);

  const totalPages = Math.ceil(filteredRecurring.length / pageSize);
  const paginatedRecurring = filteredRecurring.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Recurring</h2>
        <Button variant="primary" onClick={() => navigate('/recurring/new')}>Add Recurring</Button>
      </div>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
        <InputGroup.Text id="filter-label">Filter</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by name, category, account, type, frequency"
          aria-label="Filter recurring transactions"
          aria-describedby="filter-label"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </InputGroup>
      <div className="table-responsive">
        {loading ? (
          <div className="text-center my-4"><Spinner animation="border" size="sm" /></div>
        ) : (
          <Table striped bordered hover size="sm" aria-label="Recurring Transactions List">
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
              {paginatedRecurring.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center">No recurring transactions</td>
                </tr>
              ) : (
                paginatedRecurring.map(r => {
                  const cat = categoryState.categories.find(c => c._id === r.category);
                  const acc = accountCtx?.accounts?.find(a => a._id === r.account);
                  return (
                    <tr key={r._id}>
                      <td>{r.name}</td>
                      <td>{r.amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                      <td>{r.frequency}</td>
                      <td>{formatShortDate(r.startDate)}</td>
                      <td>{formatShortDate(r.endDate)}</td>
                      <td>{cat ? cat.name : r.category}</td>
                      <td>{acc ? acc.name : <span className="text-danger" title="Account not found">Unknown</span>}</td>
                      <td>{r.type}</td>
                      <td>
                        <Button size="sm" variant="outline-secondary" onClick={() => navigate(`/recurring/${r._id}/edit`)} aria-label={`Edit ${r.name}`}>Edit</Button>{' '}
                        <Button size="sm" variant="outline-danger" onClick={() => r._id && handleDelete(r._id)} aria-label={`Delete ${r.name}`}>Delete</Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}
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

export default RecurringTransactionsPage;
