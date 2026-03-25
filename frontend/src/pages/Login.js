
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <p>Connect with everyone, everywhere</p>
        </div>

        {/* Error alert */}
        {error && (
          <Alert variant="danger" className="py-2 rounded-3 mb-3" style={{ fontSize: 14 }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: 14, color: '#65676B' }}>
              Email Address
            </Form.Label>
            <div className="input-group">
              <span className="input-group-text border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
                <FiMail color="#65676B" />
              </span>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                style={{ borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
              />
            </div>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold" style={{ fontSize: 14, color: '#65676B' }}>
              Password
            </Form.Label>
            <div className="input-group">
              <span className="input-group-text border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
                <FiLock color="#65676B" />
              </span>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={{ borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
              />
            </div>
          </Form.Group>

          {/* Submit */}
          <Button type="submit" className="btn-purple" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </Form>

        <p className="text-center mt-4 mb-0" style={{ color: '#65676B', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#5E35B1', fontWeight: 600, textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
