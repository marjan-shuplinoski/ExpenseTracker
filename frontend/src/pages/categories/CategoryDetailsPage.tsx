import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import { fetchCategory } from '../../services/categoryService';
import type { Category as CategoryType } from '../../contexts/CategoryContext';

const CategoryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCategory(id)
      .then((res) => res && res._id ? setCategory(res) : setCategory(null))
      .catch(() => setError('Failed to load category'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner animation="border" role="status" aria-label="Loading" />;
  if (error) return <Alert variant="danger" role="alert">{error}</Alert>;
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
