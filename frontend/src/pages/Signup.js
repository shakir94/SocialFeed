// ─────────────────────────────────────────────────────────────
//  pages/Signup.js — Account creation page
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

// ── InputGroup defined OUTSIDE component so its reference never
//    changes between renders — prevents input losing focus on every keystroke
const InputGroup = ({ icon: Icon, name, type = 'text', placeholder, autoComplete, value, onChange }) => (
  <div className="input-group">
    <span className="input-group-text border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
      <Icon color="#65676B" />
    </span>
    <Form.Control
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      autoComplete={autoComplete}
      style={{ borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
    />
  </div>
);

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const validate = () => {
    if (formData.username.trim().length < 3)
      return 'Username must be at least 3 characters';
    if (formData.password.length < 6)
      return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/signup', {
        username: formData.username.trim(),
        email:    formData.email,
        password: formData.password,
      });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <h2>🌐 SocialFeed</h2>
          <p>Create your account today</p>
        </div>

        {/* Error alert */}
        {error && (
          <Alert variant="danger" className="py-2 rounded-3 mb-3" style={{ fontSize: 14 }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: 14, color: '#65676B' }}>Username</Form.Label>
            <InputGroup icon={FiUser} name="username" placeholder="Choose a username" autoComplete="username" value={formData.username} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: 14, color: '#65676B' }}>Email Address</Form.Label>
            <InputGroup icon={FiMail} name="email" type="email" placeholder="Enter your email" autoComplete="email" value={formData.email} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: 14, color: '#65676B' }}>Password</Form.Label>
            <InputGroup icon={FiLock} name="password" type="password" placeholder="Create a password (min 6 chars)" autoComplete="new-password" value={formData.password} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold" style={{ fontSize: 14, color: '#65676B' }}>Confirm Password</Form.Label>
            <InputGroup icon={FiLock} name="confirmPassword" type="password" placeholder="Re-enter your password" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} />
          </Form.Group>

          <Button type="submit" className="btn-purple" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Creating account…
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </Form>

        <p className="text-center mt-4 mb-0" style={{ color: '#65676B', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#5E35B1', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
