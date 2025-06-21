import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
// import { TransactionContext } from '../../contexts/TransactionContext';
// import type { TransactionContextProps } from '../../contexts/TransactionContext';

interface TransactionFormInputs {
  _id?: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  account: string;
  type: 'income' | 'expense';
}

const categories = [
  { value: 'food', label: 'Food' },
  { value: 'rent', label: 'Rent' },
  { value: 'salary', label: 'Salary' },
  { value: 'utilities', label: 'Utilities' },
  // add more as needed
];

const accounts = [
  { value: 'main', label: 'Main Account' },
  { value: 'savings', label: 'Savings' },
  // add more as needed
];

const TransactionFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  // const transactionContext = useContext(TransactionContext as React.Context<TransactionContextProps>);
  // const { transactions, loading, error, createTransaction, updateTransaction } = transactionContext;
  const transactions: TransactionFormInputs[] = React.useMemo(() => [], []);
  const loading = false;
  const error = '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createTransaction = async (_: TransactionFormInputs) => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateTransaction = async (_id: string, _data: TransactionFormInputs) => {};

  const isEdit = Boolean(id);
  const defaultValues: TransactionFormInputs = isEdit
    ? (transactions.find(txn => txn._id === id) || { date: '', description: '', amount: 0, category: '', account: '', type: 'expense' })
    : { date: '', description: '', amount: 0, category: '', account: '', type: 'expense' };

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<TransactionFormInputs>({
    defaultValues,
  });

  useEffect(() => {
    if (isEdit && transactions.length) {
      const txn = transactions.find(t => t._id === id);
      if (txn) {
        setValue('date', txn.date);
        setValue('description', txn.description);
        setValue('amount', txn.amount);
        setValue('category', txn.category);
        setValue('account', txn.account);
        setValue('type', txn.type);
      }
    }
  }, [isEdit, id, transactions, setValue]);

  const onSubmit: SubmitHandler<TransactionFormInputs> = async (data) => {
    if (isEdit && id) {
      await updateTransaction(id, data);
    } else {
      await createTransaction(data);
    }
    navigate('/transactions');
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <h2>{isEdit ? 'Edit Transaction' : 'Create Transaction'}</h2>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} aria-label="Transaction form">
        <Form.Group className="mb-3" controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            {...register('date', { required: 'Date is required' })}
            aria-invalid={!!errors.date}
            aria-describedby="dateError"
            autoFocus
          />
          {errors.date && <Form.Text id="dateError" className="text-danger">{errors.date.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            {...register('description', { required: 'Description is required', maxLength: 100 })}
            aria-invalid={!!errors.description}
            aria-describedby="descriptionError"
          />
          {errors.description && <Form.Text id="descriptionError" className="text-danger">{errors.description.message}</Form.Text>}
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
        <Form.Group className="mb-3" controlId="account">
          <Form.Label>Account</Form.Label>
          <Form.Select {...register('account', { required: 'Account is required' })} aria-invalid={!!errors.account} aria-describedby="accountError">
            <option value="">Select account</option>
            {accounts.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
          {errors.account && <Form.Text id="accountError" className="text-danger">{errors.account.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Select {...register('type', { required: 'Type is required' })} aria-invalid={!!errors.type} aria-describedby="typeError">
            <option value="">Select type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Form.Select>
          {errors.type && <Form.Text id="typeError" className="text-danger">{errors.type.message}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="primary" disabled={isSubmitting || loading} aria-busy={isSubmitting || loading}>
          {(isSubmitting || loading) ? <Spinner animation="border" size="sm" /> : (isEdit ? 'Update' : 'Create')}
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/transactions')} type="button">
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default TransactionFormPage;
