import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav 
      className="bg-dark-900 border-b border-dark-700" 
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link 
              to="/" 
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
              aria-label="SceneIQ home"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-white text-xl font-bold">SceneIQ</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Analyze new image"
                >
                  Analyze Image
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="View profile"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Log out"
                >
                  Logout
                </button>
                <span className="text-sm text-gray-400" aria-live="polite">
                  Welcome, {user?.name}
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-cyan-400 hover:text-cyan-300 px-5 py-2 rounded-lg text-sm font-medium border border-cyan-400 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Log in to your account"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-cyan-400 hover:bg-cyan-500 text-dark-900 px-5 py-2 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Sign up for an account"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
