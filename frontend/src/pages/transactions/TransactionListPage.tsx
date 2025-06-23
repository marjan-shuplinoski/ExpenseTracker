import React, { useMemo, useState, useContext, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Form, InputGroup, Pagination } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { TransactionContext } from '../../contexts/TransactionContext';
import { AccountContext } from '../../contexts/AccountContext';
import { useCategory } from '../../contexts/CategoryContext';

const TransactionListPage: React.FC = () => {
  const { transactions, loading, error, deleteTransaction, fetchTransactions } = useContext(TransactionContext)!;
  const accountCtx = useContext(AccountContext);
  const { state: categoryState } = useCategory();
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<'date' | 'description' | 'amount' | 'category' | 'account' | 'type'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const location = useLocation();

  const ariaSortMap: Record<'asc' | 'desc', 'ascending' | 'descending'> = {
    asc: 'ascending',
    desc: 'descending',
  };

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (filter) {
      const f = filter.toLowerCase();
      filtered = filtered.filter(txn =>
        txn.description.toLowerCase().includes(f) ||
        txn.category.toLowerCase().includes(f) ||
        txn.account.toLowerCase().includes(f) ||
        txn.type.toLowerCase().includes(f)
      );
    }
    filtered = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (a[sortKey] < b[sortKey]) cmp = -1;
      if (a[sortKey] > b[sortKey]) cmp = 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return filtered;
  }, [transactions, filter, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  useEffect(() => {
    if (location.pathname === '/transactions') {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Transactions</h2>
        <Button variant="primary" onClick={() => navigate('/transactions/new')}>Add Transaction</Button>
      </div>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <InputGroup className="mb-3 max-width-400">
        <InputGroup.Text id="filter-label">Filter</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by description, category, account, or type"
          aria-label="Filter transactions"
          aria-describedby="filter-label"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </InputGroup>
      <div className="table-responsive">
        <Table striped bordered hover size="sm" aria-label="Transactions table">
          <thead>
            <tr>
              <th role="button" tabIndex={0} onClick={() => handleSort('date')} aria-sort={sortKey === 'date' ? ariaSortMap[sortDir] : undefined as 'ascending' | 'descending' | 'none' | 'other' | undefined}>Date</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('description')} aria-sort={sortKey === 'description' ? ariaSortMap[sortDir] : undefined as 'ascending' | 'descending' | 'none' | 'other' | undefined}>Description</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('amount')} aria-sort={sortKey === 'amount' ? ariaSortMap[sortDir] : undefined as 'ascending' | 'descending' | 'none' | 'other' | undefined}>Amount</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('category')} aria-sort={sortKey === 'category' ? ariaSortMap[sortDir] : undefined as 'ascending' | 'descending' | 'none' | 'other' | undefined}>Category</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('account')} aria-sort={sortKey === 'account' ? ariaSortMap[sortDir] : undefined as 'ascending' | 'descending' | 'none' | 'other' | undefined}>Account</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('type')} aria-sort={sortKey === 'type' ? ariaSortMap[sortDir] : undefined as 'ascending' | 'descending' | 'none' | 'other' | undefined}>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
            ) : paginatedTransactions.length === 0 ? (
              <tr><td colSpan={7} className="text-center">No transactions found.</td></tr>
            ) : (
              paginatedTransactions.map(txn => {
                const acc = accountCtx?.accounts?.find(a => a._id === txn.account);
                const cat = categoryState.categories.find(c => c._id === txn.category);
                return (
                  <tr key={txn._id}>
                    <td>{new Date(txn.date).toLocaleDateString()}</td>
                    <td>{txn.description}</td>
                    <td>{txn.amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                    <td>{cat ? cat.name : txn.category}</td>
                    <td>{acc ? acc.name : <span className="text-danger" title="Account not found">Unknown</span>}</td>
                    <td>{txn.type}</td>
                    <td>
                      <Button size="sm" variant="outline-secondary" onClick={e => { e.stopPropagation(); navigate(`/transactions/${txn._id}/edit`); }} aria-label={`Edit ${txn.description}`}>Edit</Button>{' '}
                      <Button size="sm" variant="outline-danger" onClick={e => { e.stopPropagation(); deleteTransaction(txn._id); }} aria-label={`Delete ${txn.description}`}>Delete</Button>
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

export default TransactionListPage;
