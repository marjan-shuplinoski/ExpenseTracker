import React, { useContext, useMemo, useState } from 'react';
import { Table, Button, Spinner, Alert, Form, InputGroup, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../../contexts/AccountContext';

const AccountListPage: React.FC = () => {
  const { accounts, loading, error, deleteAccount } = useContext(AccountContext)!;
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'type' | 'balance' | 'currency'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const ariaSortMap: Record<'asc' | 'desc', 'ascending' | 'descending'> = {
    asc: 'ascending',
    desc: 'descending',
  };

  const filteredAccounts = useMemo(() => {
    let filtered = accounts;
    if (filter) {
      const f = filter.toLowerCase();
      filtered = filtered.filter(acc =>
        acc.name.toLowerCase().includes(f) ||
        acc.type.toLowerCase().includes(f) ||
        acc.currency.toLowerCase().includes(f)
      );
    }
    filtered = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (a[sortKey] < b[sortKey]) cmp = -1;
      if (a[sortKey] > b[sortKey]) cmp = 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return filtered;
  }, [accounts, filter, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredAccounts.length / pageSize);
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
        <h2>Accounts</h2>
        <Button variant="primary" onClick={() => navigate('/accounts/new')}>Add Account</Button>
      </div>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
        <InputGroup.Text id="filter-label">Filter</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by name, type, or currency"
          aria-label="Filter accounts"
          aria-describedby="filter-label"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </InputGroup>
      <div className="table-responsive">
        <Table striped bordered hover size="sm" aria-label="Accounts table">
          <thead>
            <tr>
              <th role="button" tabIndex={0} onClick={() => handleSort('name')} aria-sort={sortKey === 'name' ? ariaSortMap[sortDir] : undefined as 'ascending' | 'descending' | 'none' | 'other' | undefined}>Name</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('type')} aria-sort={sortKey === 'type' ? ariaSortMap[sortDir] : undefined as 'ascending' | 'descending' | 'none' | 'other' | undefined}>Type</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('balance')} aria-sort={sortKey === 'balance' ? ariaSortMap[sortDir] : undefined as 'ascending' | 'descending' | 'none' | 'other' | undefined}>Balance</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('currency')} aria-sort={sortKey === 'currency' ? ariaSortMap[sortDir] : undefined as 'ascending' | 'descending' | 'none' | 'other' | undefined}>Currency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
            ) : paginatedAccounts.length === 0 ? (
              <tr><td colSpan={5} className="text-center">No accounts found.</td></tr>
            ) : (
              paginatedAccounts.map(acc => (
                <tr key={acc._id}>
                  <td>{acc.name}</td>
                  <td>{acc.type}</td>
                  <td>{acc.balance.toLocaleString(undefined, { style: 'currency', currency: acc.currency })}</td>
                  <td>{acc.currency}</td>
                  <td>
                    <Button size="sm" variant="outline-secondary" onClick={() => navigate(`/accounts/${acc._id}/edit`)} aria-label={`Edit ${acc.name}`}>Edit</Button>{' '}
                    <Button size="sm" variant="outline-danger" onClick={() => deleteAccount(acc._id)} aria-label={`Delete ${acc.name}`}>Delete</Button>
                  </td>
                </tr>
              ))
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

export default AccountListPage;
