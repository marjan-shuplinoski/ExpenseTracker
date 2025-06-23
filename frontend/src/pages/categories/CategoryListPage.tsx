import React, { useEffect } from 'react';
import { Table, Button, Spinner, Form, InputGroup, Alert, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCategory } from '../../contexts/CategoryContext';
import { fetchCategories, deleteCategory } from '../../services/categoryService';

const CategoryListPage: React.FC = () => {
  const { state, dispatch } = useCategory();
  const [filter, setFilter] = React.useState('');
  const [sortKey, setSortKey] = React.useState<'name' | 'type'>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [error, setError] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    fetchCategories()
      .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(e => dispatch({ type: 'FETCH_ERROR', payload: e?.message || 'Failed to load categories' }));
    // eslint-disable-next-line
  }, [dispatch]);

  const filteredCategories = React.useMemo(() => {
    let filtered = state.categories;
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
  }, [state.categories, filter, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: 'name' | 'type') => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch {
      setError('Failed to delete category.');
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
      {error && <Alert variant="danger">{error}</Alert>}
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
            {state.loading ? (
              <tr><td colSpan={3} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
            ) : paginatedCategories.length === 0 ? (
              <tr><td colSpan={3} className="text-center">No categories found.</td></tr>
            ) : (
              paginatedCategories.map(category => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.type.charAt(0).toUpperCase() + category.type.slice(1)}</td>
                  <td>
                    <Button size="sm" variant="outline-secondary" onClick={() => navigate(`/categories/${category._id}/edit`)} aria-label={`Edit ${category.name}`}>Edit</Button>{' '}
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(category._id!)} aria-label={`Delete ${category.name}`}>Delete</Button>
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

export default CategoryListPage;
