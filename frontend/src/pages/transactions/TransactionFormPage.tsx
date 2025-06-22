import React, { useEffect, useContext } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { TransactionContext } from '../../contexts/TransactionContext';
import type { TransactionContextProps } from '../../contexts/TransactionContext';
import { AccountContext } from '../../contexts/AccountContext';
import type { AccountContextProps } from '../../contexts/AccountContext';

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

const TransactionFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const transactionContext = useContext(TransactionContext as React.Context<TransactionContextProps>);
  const { transactions, loading, error, createTransaction, updateTransaction } = transactionContext;
  const accountContext = useContext(AccountContext as React.Context<AccountContextProps>);
  const { accounts } = accountContext;

  const isEdit = Boolean(id);
  const txn = isEdit ? transactions.find(txn => txn._id === id) : undefined;
  const defaultValues: TransactionFormInputs = txn || { date: '', description: '', amount: 0, category: '', account: '', type: 'expense' };

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TransactionFormInputs>({
    defaultValues,
  });

  useEffect(() => {
    if (isEdit) {
      if (txn) {
        reset({
          date: txn.date ? txn.date.slice(0, 10) : '', // Ensure yyyy-mm-dd format
          description: txn.description,
          amount: txn.amount,
          category: txn.category,
          account: txn.account,
          type: txn.type,
        });
      } else if (transactions.length) {
        // If not found after loading, redirect
        navigate('/transactions');
      }
    }
  }, [isEdit, txn, transactions.length, reset, navigate]);

  const onSubmit: SubmitHandler<TransactionFormInputs> = async (data) => {
    const payload = {
      date: data.date,
      description: data.description.trim(),
      amount: Number(data.amount),
      category: data.category,
      account: data.account,
      type: data.type,
    };
    if (isEdit && id) {
      await updateTransaction(id, payload);
      navigate('/transactions');
    } else {
      await createTransaction(payload);
      navigate('/transactions');
    }
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
            {accounts.map(acc => (
              <option key={acc._id} value={acc._id}>{acc.name}</option>
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
