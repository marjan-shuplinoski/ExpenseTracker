import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';

interface CategoryFormInputs {
  _id?: string;
  name: string;
  type: 'income' | 'expense';
}

const typeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

const CategoryFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const isEdit = Boolean(id);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<CategoryFormInputs>({
    defaultValues: {
      name: '',
      type: undefined,
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      // TODO: Replace with API call when CategoryContext/API is ready
      // Example: api.get(`/categories/${id}`)
      setTimeout(() => {
        setValue('name', 'Sample Category');
        setValue('type', 'expense');
        setLoading(false);
      }, 500);
    }
  }, [isEdit, id, setValue]);

  const onSubmit: SubmitHandler<CategoryFormInputs> = async () => {
    setError('');
    setLoading(true);
    try {
      // TODO: Replace with API call when CategoryContext/API is ready
      await new Promise(res => setTimeout(res, 500));
      navigate('/categories');
    } catch {
      setError('Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <h2>{isEdit ? 'Edit Category' : 'Create Category'}</h2>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} aria-label="Category form">
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            {...register('name', { required: 'Name is required', maxLength: 50 })}
            aria-invalid={!!errors.name}
            aria-describedby="nameError"
            autoFocus
          />
          {errors.name && <Form.Text id="nameError" className="text-danger">{errors.name.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Select {...register('type', { required: 'Type is required' })} aria-invalid={!!errors.type} aria-describedby="typeError">
            <option value="">Select type</option>
            {typeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
          {errors.type && <Form.Text id="typeError" className="text-danger">{errors.type.message}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="primary" disabled={isSubmitting || loading} aria-busy={isSubmitting || loading}>
          {(isSubmitting || loading) ? <Spinner animation="border" size="sm" /> : (isEdit ? 'Update' : 'Create')}
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/categories')} type="button">
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default CategoryFormPage;
