import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockGetHistory } from '../services/api';

const StatCard = ({ label, value, icon, accent }) => (
  <div className={`bg-dark-800 border border-dark-700 rounded-2xl p-6 hover:border-${accent}-400/30 transition-colors`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className={`text-3xl font-bold text-${accent}-400`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl bg-${accent}-400/10 flex items-center justify-center text-2xl`} aria-hidden="true">
        {icon}
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await mockGetHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSpeak = (text, id) => {
    window.speechSynthesis.cancel();
    if (speaking === id) { setSpeaking(null); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);
    setSpeaking(id);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  return (
    <div className="min-h-screen bg-dark-900">
      <main role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Welcome */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-gray-500">Here's an overview of your recent activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10" role="region" aria-label="Statistics overview">
          <StatCard label="Images Analyzed" value="24" icon="📸" accent="cyan" />
          <StatCard label="Objects Detected" value="156" icon="🔍" accent="purple" />
          <StatCard label="Questions Asked" value="38" icon="💬" accent="cyan" />
        </div>

        {/* New Analysis CTA */}
        <div className="mb-10">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 transition-colors shadow-glow-cyan focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-dark-900"
            aria-label="Start a new image analysis"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Analysis
          </Link>
        </div>

        {/* History */}
        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-xl font-bold text-white mb-5">
            Recent Analysis History
          </h2>

          {loading ? (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-10 text-center" role="status">
              <p className="text-gray-500">Loading history…</p>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-10 text-center">
              <p className="text-gray-500">No analysis history yet. Start by uploading an image!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <article
                  key={item.id}
                  className="bg-dark-800 border border-dark-700 rounded-2xl p-6 hover:border-cyan-400/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Thumbnail */}
                    <div
                      className="flex-shrink-0 w-full md:w-44 h-28 bg-dark-700 border border-dark-600 rounded-xl flex items-center justify-center text-4xl"
                      aria-label={`Thumbnail for ${item.imageName}`}
                    >
                      🖼️
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="mb-2">
                        <h3 className="text-base font-semibold text-white">{item.imageName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{item.description}</p>

                      {/* Object tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.objects.map((obj, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-xs rounded-full bg-dark-700 text-cyan-400 border border-dark-600"
                          >
                            {obj.label} {Math.round(obj.confidence * 100)}%
                          </span>
                        ))}
                      </div>

                      {/* Audio button */}
                      <button
                        onClick={() => handleSpeak(item.description, item.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-dark-600 text-gray-300 hover:border-green-400 hover:text-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                        aria-label={speaking === item.id ? 'Stop audio' : 'Play audio description'}
                        aria-pressed={speaking === item.id}
                      >
                        {speaking === item.id ? (
                          <><span aria-hidden="true">⏸</span> Stop Audio</>
                        ) : (
                          <><span aria-hidden="true">🔊</span> Play Audio</>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
