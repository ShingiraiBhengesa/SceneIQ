import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiLogin } from '../services/api';
import Logo from '../components/Logo';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await apiLogin(formData.email, formData.password);
      login(response.user, response.access_token);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-16">
      {/* Background glow orbs */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-card">

          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <Logo size={48} id="login-logo" />
            <h1 className="text-2xl font-bold text-white mt-4">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Log in to your SceneIQ account</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div
              className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm"
              role="alert"
              aria-live="assertive"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <DarkField
              id="email" name="email" type="email"
              label="Email address" placeholder="you@example.com"
              autoComplete="email"
              value={formData.email} onChange={handleChange} error={errors.email}
            />
            <DarkField
              id="password" name="password" type="password"
              label="Password" placeholder="Your password"
              autoComplete="current-password"
              value={formData.password} onChange={handleChange} error={errors.password}
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-dark-800"
              aria-label={loading ? 'Logging in…' : 'Log in'}
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const DarkField = ({ id, name, type, label, placeholder, autoComplete, value, onChange, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5">
      {label}
    </label>
    <input
      id={id} name={name} type={type}
      autoComplete={autoComplete}
      value={value} onChange={onChange}
      placeholder={placeholder}
      aria-required="true"
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`w-full px-4 py-2.5 bg-dark-700 border rounded-xl text-white placeholder-gray-600 text-sm
        focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors
        ${error ? 'border-red-500/60' : 'border-dark-600 hover:border-dark-500'}`}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400" role="alert">{error}</p>
    )}
  </div>
);

export default LoginPage;
