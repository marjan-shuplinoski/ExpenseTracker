import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const { register: registerUser, user, error, loading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const [formError, setFormError] = React.useState<string | null>(null);

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: RegisterFormInputs) => {
    setFormError(null);
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/login', { replace: true });
    } catch {
      setFormError(error || 'Registration failed');
    }
  };

  return (
    <main className="container py-5" aria-label="Register Page">
      <h1 className="mb-4">Create Account</h1>
      <Form onSubmit={handleSubmit(onSubmit)} aria-describedby="register-form-desc" noValidate>
        <div id="register-form-desc" className="visually-hidden">
          Enter your name, email, and password to create an account. All fields are required.
        </div>
        {(formError || error) && <Alert variant="danger">{formError || error}</Alert>}
        <Form.Group className="mb-3" controlId="registerName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            {...register('name', { required: 'Name is required' })}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'register-name-error' : undefined}
            autoComplete="name"
            placeholder="Full name"
            required
          />
          {errors.name && (
            <Form.Text id="register-name-error" className="text-danger">
              {errors.name.message}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="registerEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            {...register('email', { required: 'Email is required' })}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            autoComplete="username"
            placeholder="Enter email"
            required
          />
          {errors.email && (
            <Form.Text id="register-email-error" className="text-danger">
              {errors.email.message}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="registerPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'register-password-error' : undefined}
            autoComplete="new-password"
            placeholder="Password"
            required
          />
          {errors.password && (
            <Form.Text id="register-password-error" className="text-danger">
              {errors.password.message}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="registerConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === watch('password') || 'Passwords do not match',
            })}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'register-confirm-password-error' : undefined}
            autoComplete="new-password"
            placeholder="Confirm password"
            required
          />
          {errors.confirmPassword && (
            <Form.Text id="register-confirm-password-error" className="text-danger">
              {errors.confirmPassword.message}
            </Form.Text>
          )}
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading} aria-busy={loading} className="w-100">
          {loading ? 'Registering…' : 'Register'}
        </Button>
      </Form>
    </main>
  );
};

export default RegisterPage;
