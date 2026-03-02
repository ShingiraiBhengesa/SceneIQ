import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

/* ─── small reusable pieces ────────────────────────────── */

const FeatureCard = ({ icon, title, description, accent }) => (
  <article className="gradient-border p-8 hover:shadow-card-hover transition-all duration-300 group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${accent.bg}`}>
      <span className={`${accent.text}`} aria-hidden="true">{icon}</span>
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:gradient-text transition-all">
      {title}
    </h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </article>
);

const Step = ({ number, title, description, icon }) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative mb-6">
      <div className="w-16 h-16 rounded-2xl bg-dark-700 border border-dark-600 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-brand text-dark-900 text-xs font-bold flex items-center justify-center">
        {number}
      </span>
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{description}</p>
  </div>
);

const StatBadge = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-bold gradient-text">{value}</span>
    <span className="text-xs text-gray-500 mt-1">{label}</span>
  </div>
);

/* ─── main page ─────────────────────────────────────────── */

const LandingPage = () => (
  <div className="min-h-screen flex flex-col bg-dark-900">
    <a href="#main-content" className="skip-link">Skip to main content</a>

    <main id="main-content" role="main" className="flex-grow">

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 overflow-hidden" aria-labelledby="hero-heading">
        {/* Background glow orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 border border-cyan-400/20 rounded-full text-sm text-cyan-400 font-medium mb-10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
            AI-POWERED VISUAL ACCESSIBILITY
          </div>

          {/* Heading */}
          <h1 id="hero-heading" className="mb-6 animate-fade-in-up">
            <span className="block text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              See the world through
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl font-bold gradient-text leading-tight mt-1">
              intelligent vision
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Upload a photo or use your webcam. Get instant scene descriptions,
            object detection, and spoken answers — fully hands-free.
          </p>

          {/* CTA */}
          <div className="flex justify-center gap-4 flex-wrap animate-fade-in">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 transition-colors shadow-glow-cyan focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-dark-900"
              aria-label="Get started for free"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 border border-dark-600 text-gray-300 font-bold rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-dark-900"
              aria-label="Log in to existing account"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────── */}
      <section className="border-y border-dark-700 bg-dark-800/50" aria-label="Platform highlights">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBadge value="3" label="AI Models" />
            <StatBadge value="< 2s" label="Analysis time" />
            <StatBadge value="WCAG 2.1" label="Accessibility" />
            <StatBadge value="100%" label="Private & secure" />
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="py-24" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to understand any scene
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Powered by state-of-the-art vision models, designed for accessibility first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              title="Object Detection"
              description="YOLOv8 identifies and locates every object in the scene with bounding boxes and confidence scores."
              accent={{ bg: 'bg-cyan-400/10', text: 'text-cyan-400' }}
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              title="Scene Descriptions"
              description="Natural language captions powered by BLIP-2 vision-language models describe exactly what's happening."
              accent={{ bg: 'bg-purple-500/10', text: 'text-purple-400' }}
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              }
              title="Audio Output"
              description="Every description is instantly readable aloud with adjustable speed and voice — completely hands-free."
              accent={{ bg: 'bg-green-400/10', text: 'text-green-400' }}
            />
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className="py-24 bg-dark-800/30" aria-labelledby="how-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="how-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-gray-400">Three steps from image to understanding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-brand opacity-20" aria-hidden="true" />

            <Step
              number="1"
              icon="📷"
              title="Upload or Capture"
              description="Drag & drop an image, choose from your files, or take a live webcam snapshot."
            />
            <Step
              number="2"
              icon="🧠"
              title="AI Analyses"
              description="Our vision models detect objects, read text, and generate a natural language scene description."
            />
            <Step
              number="3"
              icon="🔊"
              title="Listen & Ask"
              description="Hear the description aloud and ask follow-up questions to learn exactly what you need."
            />
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-24" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="gradient-border p-12">
            <div className="flex justify-center mb-6">
              <Logo size={56} id="landing-cta-logo" />
            </div>
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to see smarter?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Join users who use SceneIQ to understand images instantly — no experience required.
            </p>
            <Link
              to="/register"
              className="inline-block px-10 py-4 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 transition-colors shadow-glow-cyan focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-dark-900 text-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </main>
  </div>
);

export default LandingPage;
