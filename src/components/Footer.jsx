import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 text-white mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About SceneIQ</h3>
            <p className="text-gray-400 text-sm">
              Empowering visually impaired users with AI-powered image analysis and scene understanding.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#privacy" 
                  className="text-gray-400 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded transition-colors"
                  aria-label="Privacy Policy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  className="text-gray-400 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded transition-colors"
                  aria-label="Terms of Service"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#accessibility" 
                  className="text-gray-400 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded transition-colors"
                  aria-label="Accessibility Statement"
                >
                  Accessibility Statement
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <p className="text-gray-400 text-sm">
              Email: support@sceneiq.com
            </p>
            <p className="text-gray-400 text-sm mt-2">
              © 2024 SceneIQ. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
