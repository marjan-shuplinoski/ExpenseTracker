import React, { useEffect, useContext } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../../services/api';
import { AccountContext } from '../../contexts/AccountContext';
import { useCategory } from '../../contexts/CategoryContext';

interface RecurringTransactionFormInputs {
  name: string;
  amount: number;
  frequency: string;
  startDate: string;
  endDate?: string;
  category: string;
  account: string;
  type: 'income' | 'expense';
}

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const RecurringTransactionFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Account and Category context
  const accountCtx = useContext(AccountContext);
  const { state: categoryState, dispatch: categoryDispatch } = useCategory();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RecurringTransactionFormInputs>({
    defaultValues: { name: '', amount: 0, frequency: '', startDate: '', endDate: '', category: '', account: '', type: 'expense' },
  });

  useEffect(() => {
    if (accountCtx && accountCtx.accounts.length === 0) accountCtx.fetchAccounts();
    // Fetch all categories for the user
    categoryDispatch({ type: 'FETCH_START' });
    api.get('/categories?limit=1000')
      .then(res => categoryDispatch({ type: 'FETCH_SUCCESS', payload: res.data }))
      .catch(e => categoryDispatch({ type: 'FETCH_ERROR', payload: e?.response?.data?.message || 'Failed to load categories' }));
  }, [accountCtx, categoryDispatch]);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      api.get(`/recurring/${id}`)
        .then(res => {
          const data = res.data;
          reset({
            name: data.name,
            amount: data.amount,
            frequency: data.frequency,
            startDate: data.startDate ? data.startDate.slice(0, 10) : '',
            endDate: data.endDate ? data.endDate.slice(0, 10) : '',
            category: data.category?._id || data.category || '',
            account: data.account,
            type: data.type,
          });
        })
        .catch(e => setError(e?.response?.data?.message || 'Failed to load'))
        .finally(() => setLoading(false));
    }
  }, [isEdit, id, reset]);

  const onSubmit: SubmitHandler<RecurringTransactionFormInputs> = async (data) => {
    setError(null);
    try {
      const payload = {
        name: data.name.trim(),
        amount: Number(data.amount),
        frequency: data.frequency,
        startDate: data.startDate,
        endDate: data.endDate,
        category: data.category,
        account: data.account,
        type: data.type,
      };
      if (isEdit && id) {
        await api.put(`/recurring/${id}`, payload);
      } else {
        await api.post('/recurring', payload);
      }
      navigate('/recurring');
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      setError(err?.response?.data?.message || err?.message || 'Failed to save recurring transaction');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <h2>{isEdit ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}</h2>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      {loading ? <Spinner animation="border" /> : (
      <Form onSubmit={handleSubmit(onSubmit)} aria-label="Recurring Transaction form">
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" {...register('name', { required: 'Name is required', maxLength: 100 })} aria-invalid={!!errors.name} aria-describedby="nameError" autoFocus />
          {errors.name && <Form.Text id="nameError" className="text-danger">{errors.name.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control type="number" step="0.01" {...register('amount', { required: 'Amount is required', min: 0.01 })} aria-invalid={!!errors.amount} aria-describedby="amountError" />
          {errors.amount && <Form.Text id="amountError" className="text-danger">{errors.amount.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="frequency">
          <Form.Label>Frequency</Form.Label>
          <Form.Select {...register('frequency', { required: 'Frequency is required' })} aria-invalid={!!errors.frequency} aria-describedby="frequencyError">
            <option value="">Select frequency</option>
            {frequencies.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
          {errors.frequency && <Form.Text id="frequencyError" className="text-danger">{errors.frequency.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="startDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" {...register('startDate', { required: 'Start date is required' })} aria-invalid={!!errors.startDate} aria-describedby="startDateError" />
          {errors.startDate && <Form.Text id="startDateError" className="text-danger">{errors.startDate.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="endDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control type="date" {...register('endDate')} aria-invalid={!!errors.endDate} aria-describedby="endDateError" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Select {...register('category', { required: 'Category is required' })} aria-invalid={!!errors.category} aria-describedby="categoryError">
            <option value="">Select category</option>
            {categoryState.categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </Form.Select>
          {errors.category && <Form.Text id="categoryError" className="text-danger">{errors.category.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="account">
          <Form.Label>Account</Form.Label>
          <Form.Select {...register('account', { required: 'Account is required' })} aria-invalid={!!errors.account} aria-describedby="accountError">
            <option value="">Select account</option>
            {accountCtx && accountCtx.accounts.map(acc => (
              <option key={acc._id} value={acc._id}>{acc.name}</option>
            ))}
          </Form.Select>
          {errors.account && <Form.Text id="accountError" className="text-danger">{errors.account.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Select {...register('type', { required: 'Type is required' })} aria-invalid={!!errors.type} aria-describedby="typeError">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Form.Select>
          {errors.type && <Form.Text id="typeError" className="text-danger">{errors.type.message}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="primary" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? <Spinner animation="border" size="sm" /> : (isEdit ? 'Update' : 'Add')}
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/recurring')} type="button">
          Cancel
        </Button>
      </Form>
      )}
    </div>
  );
};

export default RecurringTransactionFormPage;
