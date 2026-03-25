// ─────────────────────────────────────────────────────────────
//  context/AuthContext.js — Global auth state via React Context
// ─────────────────────────────────────────────────────────────
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true); // true while checking localStorage

  // ── Restore session from localStorage on first load ────────
  useEffect(() => {
    const savedToken = localStorage.getItem('sf_token');
    const savedUser  = localStorage.getItem('sf_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        // Clear corrupted data
        localStorage.removeItem('sf_token');
        localStorage.removeItem('sf_user');
      }
    }
    setLoading(false);
  }, []);

  // ── Login: save to state + localStorage ───────────────────
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('sf_token', tokenData);
    localStorage.setItem('sf_user', JSON.stringify(userData));
  };

  // ── Logout: clear state + localStorage ────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
