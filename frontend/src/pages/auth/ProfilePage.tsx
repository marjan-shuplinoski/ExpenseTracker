import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/auth/me')
      .then(res => {
        setName(res.data.name);
        setEmail(res.data.email);
        setAvatar(res.data.avatar || '');
      })
      .catch((e) => {
        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load profile.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.put('/auth/me', { name, email, avatar });
      setName(res.data.name);
      setEmail(res.data.email);
      setAvatar(res.data.avatar || '');
      setSuccess('Profile updated successfully.');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update profile.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Alert variant="warning">You must be logged in to view your profile.</Alert>;
  }

  return (
    <main className="container py-5" aria-label="Profile Page">
      <h1 className="mb-4">Profile</h1>
      <Form onSubmit={handleSubmit} aria-describedby="profile-form-desc" noValidate>
        <div id="profile-form-desc" className="visually-hidden">
          Update your profile information. Name, email, and avatar are required.
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
        <Form.Group className="mb-3" controlId="profileAvatar">
          <Form.Label>Avatar URL</Form.Label>
          <Form.Control
            type="url"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            autoComplete="photo"
            aria-invalid={!!error}
          />
        </Form.Group>
        {avatar && <img src={avatar} alt="Avatar" className="mb-3 rounded-circle avatar-80" />}
        <Button variant="primary" type="submit" disabled={loading} aria-busy={loading} className="w-100">
          {loading ? 'Saving…' : 'Save Changes'}
        </Button>
      </Form>
    </main>
  );
};

export default ProfilePage;
