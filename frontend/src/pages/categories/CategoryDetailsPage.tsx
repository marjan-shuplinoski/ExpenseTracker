import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from 'react-bootstrap';

interface Category {
  _id: string;
  name: string;
  type: string;
  // Extend with optional fields as needed
}

const CategoryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/categories/${id}`)
      .then(res => setCategory(res.data))
      .catch(() => setError('Failed to load category'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner animation="border" role="status" aria-label="Loading" />;
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;
  if (!category) return <div>No category found.</div>;

  return (
    <main className="container py-4" aria-label="Category Details Page">
      <h1 className="mb-4">Category Details</h1>
      <dl className="row">
        <dt className="col-sm-3">Name</dt>
        <dd className="col-sm-9">{category.name}</dd>
        <dt className="col-sm-3">Type</dt>
        <dd className="col-sm-9">{category.type}</dd>
      </dl>
    </main>
  );
};

export default CategoryDetailsPage;
