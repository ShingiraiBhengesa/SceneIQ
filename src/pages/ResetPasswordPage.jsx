import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { apiResetPassword } from '../services/api';
import Logo from '../components/Logo';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await apiResetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Reset failed. Your link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark-800 border border-dark-700 rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <Logo size={40} id="reset-logo" />
        </div>

        {success ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-3">Password reset!</h1>
            <p className="text-gray-400 text-sm mb-6">
              Your password has been updated. Redirecting you to login...
            </p>
            <Link to="/login" className="text-cyan-400 hover:underline text-sm">
              Go to Log In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white text-center mb-2">Set a new password</h1>
            <p className="text-gray-400 text-sm text-center mb-6">
              Choose a strong password for your account.
            </p>

            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-400 mb-1">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 text-gray-200 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">
                  Confirm new password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 text-gray-200 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              <Link to="/login" className="text-cyan-400 hover:underline">
                Back to Log In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
