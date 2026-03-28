import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiLogout } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialise from localStorage so auth survives a page refresh
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Auto-logout when apiFetch detects an expired/revoked token
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    // Token is read synchronously inside apiFetch before we clear it below
    apiLogout().catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => !!token && !!user;

  const value = { user, token, login, logout, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
