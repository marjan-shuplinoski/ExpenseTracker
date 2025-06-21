import React, { useMemo, useState } from 'react';
import { Table, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// Placeholder: Replace with actual TransactionContext import when available
// import { TransactionContext } from '../../contexts/TransactionContext';

// Temporary type for demonstration; replace with actual Transaction type
interface Transaction {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  account: string;
  type: 'income' | 'expense';
}

const TransactionListPage: React.FC = () => {
  // Replace with: const { transactions, loading, error, deleteTransaction } = useContext(TransactionContext)!;
  // For now, use a static array for demonstration
  const [transactions] = useState<Transaction[]>([]);
  const loading = false;
  const error = '';
  const deleteTransaction = () => {};

  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<'date' | 'description' | 'amount' | 'category' | 'account' | 'type'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

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

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Transactions</h2>
        <Button variant="primary" onClick={() => navigate('/transactions/new')}>Add Transaction</Button>
      </div>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
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
            ) : filteredTransactions.length === 0 ? (
              <tr><td colSpan={7} className="text-center">No transactions found.</td></tr>
            ) : (
              filteredTransactions.map(txn => (
                <tr key={txn._id}>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td>{txn.description}</td>
                  <td>{txn.amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                  <td>{txn.category}</td>
                  <td>{txn.account}</td>
                  <td>{txn.type}</td>
                  <td>
                    <Button size="sm" variant="outline-secondary" onClick={() => navigate(`/transactions/${txn._id}/edit`)} aria-label={`Edit ${txn.description}`}>Edit</Button>{' '}
                    <Button size="sm" variant="outline-danger" onClick={() => deleteTransaction()} aria-label={`Delete ${txn.description}`}>Delete</Button>
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

export default TransactionListPage;
