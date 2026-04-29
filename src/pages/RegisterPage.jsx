import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRegister } from '../services/api';
import Logo from '../components/Logo';
import { DarkField } from './LoginPage';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
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
      const response = await apiRegister(formData.name, formData.email, formData.password);
      login(response.user, response.access_token);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-16">
      {/* Background glow orbs */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-card">

          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <Logo size={48} id="register-logo" />
            <h1 className="text-2xl font-bold text-white mt-4">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Start seeing smarter with SceneIQ</p>
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
              id="name" name="name" type="text"
              label="Full name" placeholder="Your full name"
              autoComplete="name"
              value={formData.name} onChange={handleChange} error={errors.name}
            />
            <DarkField
              id="email" name="email" type="email"
              label="Email address" placeholder="you@example.com"
              autoComplete="email"
              value={formData.email} onChange={handleChange} error={errors.email}
            />
            <DarkField
              id="password" name="password" type="password"
              label="Password" placeholder="Min. 8 characters"
              autoComplete="new-password"
              value={formData.password} onChange={handleChange} error={errors.password}
            />
            <DarkField
              id="confirmPassword" name="confirmPassword" type="password"
              label="Confirm password" placeholder="Repeat your password"
              autoComplete="new-password"
              value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-dark-800"
              aria-label={loading ? 'Creating account…' : 'Create account'}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
