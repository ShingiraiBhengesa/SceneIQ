import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockGetHistory } from '../services/api';

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
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    if (speaking === id) {
      setSpeaking(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);
    
    setSpeaking(id);
    window.speechSynthesis.speak(utterance);
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your recent activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" role="region" aria-label="Statistics overview">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Images Analyzed</p>
                <p className="text-3xl font-bold text-primary-600">24</p>
              </div>
              <div className="text-4xl" aria-hidden="true">📸</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Objects Detected</p>
                <p className="text-3xl font-bold text-primary-600">156</p>
              </div>
              <div className="text-4xl" aria-hidden="true">🔍</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Questions Asked</p>
                <p className="text-3xl font-bold text-primary-600">38</p>
              </div>
              <div className="text-4xl" aria-hidden="true">💬</div>
            </div>
          </div>
        </div>

        {/* New Analysis Button */}
        <div className="mb-8">
          <Link
            to="/upload"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Start a new image analysis"
          >
            <span className="mr-2" aria-hidden="true">➕</span>
            New Analysis
          </Link>
        </div>

        {/* Recent Analysis History */}
        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-2xl font-bold text-gray-900 mb-4">
            Recent Analysis History
          </h2>

          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center" role="status">
              <p className="text-gray-600">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No analysis history yet. Start by uploading an image!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Thumbnail Placeholder */}
                    <div 
                      className="flex-shrink-0 w-full md:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center"
                      aria-label={`Thumbnail for ${item.imageName}`}
                    >
                      <span className="text-4xl" aria-hidden="true">🖼️</span>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.imageName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">
                        {item.description}
                      </p>

                      {/* Objects Detected */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Objects Detected:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.objects.map((obj, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                            >
                              {obj.label} ({Math.round(obj.confidence * 100)}%)
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Play Audio Button */}
                      <button
                        onClick={() => handleSpeak(item.description, item.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        aria-label={speaking === item.id ? 'Stop audio' : 'Play audio description'}
                        aria-pressed={speaking === item.id}
                      >
                        <span className="mr-2" aria-hidden="true">
                          {speaking === item.id ? '⏸️' : '🔊'}
                        </span>
                        {speaking === item.id ? 'Stop Audio' : 'Play Audio'}
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
