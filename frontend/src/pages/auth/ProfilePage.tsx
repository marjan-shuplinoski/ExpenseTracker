import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Form, Button, Alert } from 'react-bootstrap';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // TODO: Implement update profile API integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess('Profile updated (demo)');
    }, 1000);
  };

  if (!user) {
    return <Alert variant="warning">You must be logged in to view your profile.</Alert>;
  }

  return (
    <main className="container py-5" aria-label="Profile Page">
      <h1 className="mb-4">Profile</h1>
      <Form onSubmit={handleSubmit} aria-describedby="profile-form-desc" noValidate>
        <div id="profile-form-desc" className="visually-hidden">
          Update your profile information. Name and email are required.
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form.Group className="mb-3" controlId="profileName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
            required
            aria-invalid={!!error}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="profileEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            required
            aria-invalid={!!error}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading} aria-busy={loading} className="w-100">
          {loading ? 'Saving…' : 'Save Changes'}
        </Button>
      </Form>
    </main>
  );
};

export default ProfilePage;
