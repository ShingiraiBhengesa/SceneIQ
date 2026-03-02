import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => (
  <footer className="bg-dark-900 border-t border-dark-700" role="contentinfo">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-2">
          <Link
            to="/"
            className="inline-flex items-center gap-3 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg"
            aria-label="SceneIQ home"
          >
            <Logo size={32} id="footer-logo" />
            <span className="text-white font-bold text-lg">
              Scene<span className="gradient-text">IQ</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Empowering everyone to understand any scene — through AI-powered descriptions, object detection, and spoken audio.
          </p>
        </div>

        {/* Product links */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</h3>
          <ul className="space-y-3 text-sm">
            <li><FooterLink to="/register">Get Started</FooterLink></li>
            <li><FooterLink to="/login">Log In</FooterLink></li>
            <li><FooterLink to="/upload">Analyze Image</FooterLink></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Legal</h3>
          <ul className="space-y-3 text-sm">
            <li><FooterAnchor href="#privacy">Privacy Policy</FooterAnchor></li>
            <li><FooterAnchor href="#terms">Terms of Service</FooterAnchor></li>
            <li><FooterAnchor href="#accessibility">Accessibility Statement</FooterAnchor></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-6 border-t border-dark-700 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} SceneIQ. All rights reserved.
        </p>
        <p className="text-gray-600 text-xs">support@sceneiq.com</p>
      </div>
    </div>
  </footer>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-500 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
  >
    {children}
  </Link>
);

const FooterAnchor = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-500 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
  >
    {children}
  </a>
);

export default Footer;
