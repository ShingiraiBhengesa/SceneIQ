import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav
      className="bg-dark-900/95 backdrop-blur-sm border-b border-dark-700 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo + wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg"
            aria-label="SceneIQ home"
          >
            <Logo size={36} id="nav-logo" />
            <span className="text-white text-xl font-bold tracking-tight">
              Scene<span className="gradient-text">IQ</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated() ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/upload">Analyze</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <div className="w-px h-5 bg-dark-600 mx-2" />
                <span className="text-sm text-gray-500 mr-2" aria-live="polite">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-300 border border-dark-600 rounded-lg hover:border-red-500 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Log out"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-cyan-400 border border-cyan-400/50 rounded-lg hover:border-cyan-400 hover:bg-cyan-400/5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-5 py-2 text-sm font-bold text-dark-900 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-dark-700 pt-4 space-y-1 animate-fade-in">
            {isAuthenticated() ? (
              <>
                <MobileNavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileNavLink>
                <MobileNavLink to="/upload" onClick={() => setMenuOpen(false)}>Analyze Image</MobileNavLink>
                <MobileNavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</MobileNavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={() => setMenuOpen(false)}>Log In</MobileNavLink>
                <MobileNavLink to="/register" onClick={() => setMenuOpen(false)}>Get Started</MobileNavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="px-4 py-2 text-sm font-medium text-gray-300 rounded-lg hover:text-white hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;
