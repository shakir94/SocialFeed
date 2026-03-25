// ─────────────────────────────────────────────────────────────
//  App.js — Root component with routing + auth protection
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login  from './pages/Login';
import Signup from './pages/Signup';
import Feed   from './pages/Feed';

// ── PrivateRoute: redirect to /login if not authenticated ────
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show spinner while restoring session from localStorage
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F0F2F5',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Spinner
            animation="border"
            style={{ color: '#7C4DFF', width: 48, height: 48 }}
          />
          <p style={{ marginTop: 16, color: '#65676B', fontSize: 15 }}>
            Loading SocialFeed…
          </p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// ── PublicRoute: redirect to / if already logged in ─────────
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Avoid flash
  return user ? <Navigate to="/" replace /> : children;
};

// ── App Routes ───────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      }
    />

    {/* Protected routes */}
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Feed />
        </PrivateRoute>
      }
    />

    {/* Catch-all: redirect unknown paths to home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// ── Root export wraps everything in AuthProvider + Router ────
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
