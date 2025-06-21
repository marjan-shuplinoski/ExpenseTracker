import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// TODO: Replace with CategoryContext when available
// import { CategoryContext } from '../../contexts/CategoryContext';

interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
}

const CategoryListPage: React.FC = () => {
  // TODO: Replace with context
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<keyof Category>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // TODO: Replace with API call
    setTimeout(() => {
      setCategories([
        { _id: '1', name: 'Food', type: 'expense' },
        { _id: '2', name: 'Salary', type: 'income' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCategories = React.useMemo(() => {
    let filtered = categories;
    if (filter) {
      const f = filter.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(f) || c.type.toLowerCase().includes(f));
    }
    filtered = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (a[sortKey] < b[sortKey]) cmp = -1;
      if (a[sortKey] > b[sortKey]) cmp = 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return filtered;
  }, [categories, filter, sortKey, sortDir]);

  const handleSort = (key: keyof Category) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Categories</h2>
        <Button variant="primary" onClick={() => navigate('/categories/new')}>Add Category</Button>
      </div>
      <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
        <InputGroup.Text id="filter-label">Filter</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by name or type"
          aria-label="Filter categories"
          aria-describedby="filter-label"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </InputGroup>
      <div className="table-responsive">
        <Table striped bordered hover size="sm" aria-label="Categories table">
          <thead>
            <tr>
              <th role="button" tabIndex={0} onClick={() => handleSort('name')}>Name</th>
              <th role="button" tabIndex={0} onClick={() => handleSort('type')}>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan={3} className="text-center">No categories found.</td></tr>
            ) : (
              filteredCategories.map(category => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.type.charAt(0).toUpperCase() + category.type.slice(1)}</td>
                  <td>
                    <Button size="sm" variant="outline-secondary" onClick={() => navigate(`/categories/${category._id}/edit`)} aria-label={`Edit ${category.name}`}>Edit</Button>{' '}
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

export default CategoryListPage;
