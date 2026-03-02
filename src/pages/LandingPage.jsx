import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <main id="main-content" role="main" className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-32" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-block mb-8">
                <span className="px-4 py-2 bg-dark-800 text-cyan-400 rounded-full text-sm font-medium border border-cyan-400/30">
                  AI-POWERED ACCESSIBILITY
                </span>
              </div>

              {/* Main Heading */}
              <h1 id="hero-heading" className="mb-8">
                <span className="block text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
                  See the world through
                </span>
                <span className="block text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  intelligent vision
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                Upload a photo or use your webcam. Get instant scene descriptions, object detection, and answers to your questions — all with audio output.
              </p>

              {/* CTA Buttons */}
              <div className="flex justify-center gap-4 flex-wrap">
                <Link
                  to="/register"
                  className="bg-cyan-400 hover:bg-cyan-500 text-dark-900 px-8 py-3 rounded-lg text-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-dark-900"
                  aria-label="Get started for free"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3 rounded-lg text-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-dark-900"
                  aria-label="Log in to existing account"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="pb-20" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="features-heading" className="sr-only">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Object Detection */}
              <article className="bg-dark-800 p-8 rounded-2xl border border-dark-700 hover:border-cyan-400/30 transition-colors">
                <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Object Detection
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  YOLOv8 identifies objects with bounding boxes and confidence scores
                </p>
              </article>

              {/* Feature 2: Scene Descriptions */}
              <article className="bg-dark-800 p-8 rounded-2xl border border-dark-700 hover:border-cyan-400/30 transition-colors">
                <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Scene Descriptions
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Natural language captions powered by BLIP-2 vision-language models
                </p>
              </article>

              {/* Feature 3: Audio Output */}
              <article className="bg-dark-800 p-8 rounded-2xl border border-dark-700 hover:border-cyan-400/30 transition-colors">
                <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Audio Output
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Text-to-speech for all descriptions — fully hands-free experience
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
