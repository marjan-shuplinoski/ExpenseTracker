import React, { useEffect, useContext } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { AccountContext } from '../../contexts/AccountContext';
import type { AccountContextProps } from '../../contexts/AccountContext';

interface AccountFormInputs {
  name: string;
  type: string;
  balance: number;
  currency: string;
}

const accountTypes = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'investment', label: 'Investment' },
  { value: 'other', label: 'Other' },
];

const currencies = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  // add more as needed
];

const AccountFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const accountContext = useContext(AccountContext as React.Context<AccountContextProps>);
  const { accounts, loading, error, createAccount, updateAccount } = accountContext;

  const isEdit = Boolean(id);
  const defaultValues: AccountFormInputs = isEdit
    ? (accounts.find(acc => acc._id === id) || { name: '', type: '', balance: 0, currency: '' })
    : { name: '', type: '', balance: 0, currency: '' };

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<AccountFormInputs>({
    defaultValues,
  });

  useEffect(() => {
    if (isEdit && accounts.length) {
      const acc = accounts.find(a => a._id === id);
      if (acc) {
        setValue('name', acc.name);
        setValue('type', acc.type);
        setValue('balance', acc.balance);
        setValue('currency', acc.currency);
      }
    }
  }, [isEdit, id, accounts, setValue]);

  const onSubmit: SubmitHandler<AccountFormInputs> = async (data) => {
    const payload = {
      name: data.name.trim(),
      type: data.type,
      balance: Number(data.balance),
      currency: data.currency,
    };
    if (isEdit && id) {
      await updateAccount(id, payload);
    } else {
      await createAccount(payload);
    }
    navigate('/accounts');
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <h2>{isEdit ? 'Edit Account' : 'Create Account'}</h2>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} aria-label="Account form">
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
            {accountTypes.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
          {errors.type && <Form.Text id="typeError" className="text-danger">{errors.type.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="balance">
          <Form.Label>Balance</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            {...register('balance', { required: 'Balance is required', min: 0 })}
            aria-invalid={!!errors.balance}
            aria-describedby="balanceError"
          />
          {errors.balance && <Form.Text id="balanceError" className="text-danger">{errors.balance.message}</Form.Text>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="currency">
          <Form.Label>Currency</Form.Label>
          <Form.Select {...register('currency', { required: 'Currency is required' })} aria-invalid={!!errors.currency} aria-describedby="currencyError">
            <option value="">Select currency</option>
            {currencies.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
          {errors.currency && <Form.Text id="currencyError" className="text-danger">{errors.currency.message}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="primary" disabled={isSubmitting || loading} aria-busy={isSubmitting || loading}>
          {(isSubmitting || loading) ? <Spinner animation="border" size="sm" /> : (isEdit ? 'Update' : 'Create')}
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/accounts')} type="button">
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default AccountFormPage;
