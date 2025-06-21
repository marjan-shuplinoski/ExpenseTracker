import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login, user, error, loading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [formError, setFormError] = React.useState<string | null>(null);

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: LoginFormInputs) => {
    setFormError(null);
    try {
      await login(data.email, data.password);
      navigate('/dashboard', { replace: true });
    } catch {
      setFormError(error || 'Login failed');
    }
  };

  return (
    <main className="container py-5" aria-label="Login Page">
      <h1 className="mb-4">Sign In</h1>
      <Form onSubmit={handleSubmit(onSubmit)} aria-describedby="login-form-desc" noValidate>
        <div id="login-form-desc" className="visually-hidden">
          Enter your email and password to sign in. All fields are required.
        </div>
        {(formError || error) && <Alert variant="danger">{formError || error}</Alert>}
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            {...register('email', { required: 'Email is required' })}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            autoComplete="username"
            placeholder="Enter email"
            required
          />
          {errors.email && (
            <Form.Text id="login-email-error" className="text-danger">
              {errors.email.message}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            {...register('password', { required: 'Password is required' })}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            autoComplete="current-password"
            placeholder="Password"
            required
          />
          {errors.password && (
            <Form.Text id="login-password-error" className="text-danger">
              {errors.password.message}
            </Form.Text>
          )}
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading} aria-busy={loading} className="w-100">
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </Form>
    </main>
  );
};

export default LoginPage;
