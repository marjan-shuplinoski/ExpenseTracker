import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../../services/api';

interface BudgetFormInputs {
  _id?: string;
  name: string;
  amount: number;
  period: string;
  category: string;
  startDate: string;
  endDate: string;
}

const periods = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'yearly', label: 'Yearly' },
];

const categories = [
  { value: 'food', label: 'Food' },
  { value: 'rent', label: 'Rent' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'salary', label: 'Salary' },
  // add more as needed
];

const BudgetFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const isEdit = Boolean(id);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<BudgetFormInputs>({
    defaultValues: {
      name: '',
      amount: 0,
      period: '',
      category: '',
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      api.get(`/budgets/${id}`)
        .then(res => {
          const b = res.data;
          setValue('name', b.name);
          setValue('amount', b.amount);
          setValue('period', b.period);
          setValue('category', b.category);
          setValue('startDate', b.startDate?.slice(0, 10) || '');
          setValue('endDate', b.endDate?.slice(0, 10) || '');
        })
        .catch(err => setError(err?.response?.data?.message || 'Failed to load budget.'))
        .finally(() => setLoading(false));
    }
  }, [isEdit, id, setValue]);

  const onSubmit: SubmitHandler<BudgetFormInputs> = async (data) => {
    setError('');
    setLoading(true);
    try {
      if (isEdit && id) {
        await api.put(`/budgets/${id}`, data);
      } else {
        await api.post('/budgets', data);
      }
      navigate('/budgets');
    } catch (err) {
      let msg = 'Failed to save budget.';
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: unknown }).response === 'object' &&
        (err as { response?: unknown }).response !== null &&
        'data' in ((err as { response?: Record<string, unknown> }).response ?? {}) &&
        typeof ((err as { response: { data?: unknown } }).response.data) === 'object' &&
        ((err as { response: { data?: unknown } }).response.data) !== null &&
        'message' in ((err as { response: { data: Record<string, unknown> } }).response.data)
      ) {
        msg = ((err as { response: { data: { message: string } } }).response.data.message) || msg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <h2>{isEdit ? 'Edit Budget' : 'Create Budget'}</h2>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} aria-label="Budget form">
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            {...register('name', { required: 'Name is required', maxLength: 100 })}
            aria-invalid={!!errors.name}
            aria-describedby="nameError"
            autoFocus
          />
          {errors.name && <Form.Text id="nameError" className="text-danger">{errors.name.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            {...register('amount', { required: 'Amount is required', min: 0.01 })}
            aria-invalid={!!errors.amount}
            aria-describedby="amountError"
          />
          {errors.amount && <Form.Text id="amountError" className="text-danger">{errors.amount.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="period">
          <Form.Label>Period</Form.Label>
          <Form.Select {...register('period', { required: 'Period is required' })} aria-invalid={!!errors.period} aria-describedby="periodError">
            <option value="">Select period</option>
            {periods.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
          {errors.period && <Form.Text id="periodError" className="text-danger">{errors.period.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Select {...register('category', { required: 'Category is required' })} aria-invalid={!!errors.category} aria-describedby="categoryError">
            <option value="">Select category</option>
            {categories.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
          {errors.category && <Form.Text id="categoryError" className="text-danger">{errors.category.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="startDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
            aria-invalid={!!errors.startDate}
            aria-describedby="startDateError"
          />
          {errors.startDate && <Form.Text id="startDateError" className="text-danger">{errors.startDate.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="endDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            {...register('endDate', { required: 'End date is required' })}
            aria-invalid={!!errors.endDate}
            aria-describedby="endDateError"
          />
          {errors.endDate && <Form.Text id="endDateError" className="text-danger">{errors.endDate.message}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="primary" disabled={isSubmitting || loading} aria-busy={isSubmitting || loading}>
          {(isSubmitting || loading) ? <Spinner animation="border" size="sm" /> : (isEdit ? 'Update' : 'Create')}
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/budgets')} type="button">
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default BudgetFormPage;
