import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockGetProfile, mockUpdatePreferences } from '../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    speechRate: 1.0,
    voice: 'default',
    highContrast: false,
    fontSize: 'medium'
  });
  const [voices, setVoices] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await mockGetProfile();
        setProfile(data);
        setPreferences(data.preferences);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const testSpeech = () => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(
      'This is a test of your speech settings. The quick brown fox jumps over the lazy dog.'
    );
    utterance.rate = preferences.speechRate;
    
    if (preferences.voice !== 'default' && voices.length > 0) {
      const selectedVoice = voices.find(v => v.name === preferences.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await mockUpdatePreferences(preferences);
      setShowSuccess(true);
      
      // Apply high contrast if enabled
      if (preferences.highContrast) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      
      // Apply font size
      document.body.style.fontSize = 
        preferences.fontSize === 'small' ? '14px' :
        preferences.fontSize === 'large' ? '18px' : '16px';
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600" role="status">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main role="main" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Profile Settings
        </h1>

        {showSuccess && (
          <div 
            className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" 
            role="alert"
            aria-live="polite"
          >
            <span className="block sm:inline">Preferences saved successfully!</span>
          </div>
        )}

        {/* User Information */}
        <section className="bg-white rounded-lg shadow p-6 mb-6" aria-labelledby="user-info-heading">
          <h2 id="user-info-heading" className="text-xl font-semibold text-gray-900 mb-4">
            Account Information
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-600">Full Name</dt>
              <dd className="mt-1 text-gray-900">{profile?.name || user?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Email Address</dt>
              <dd className="mt-1 text-gray-900">{profile?.email || user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Member Since</dt>
              <dd className="mt-1 text-gray-900">
                {new Date(profile?.memberSince || '2024-01-15').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Current Plan</dt>
              <dd className="mt-1 text-gray-900">{profile?.plan || 'Free'}</dd>
            </div>
          </dl>
        </section>

        {/* Accessibility Preferences */}
        <section className="bg-white rounded-lg shadow p-6 mb-6" aria-labelledby="preferences-heading">
          <h2 id="preferences-heading" className="text-xl font-semibold text-gray-900 mb-4">
            Accessibility Preferences
          </h2>

          <div className="space-y-6">
            {/* Speech Rate */}
            <div>
              <label htmlFor="speech-rate" className="block text-sm font-medium text-gray-700 mb-2">
                Speech Rate: {preferences.speechRate.toFixed(1)}x
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">0.5x</span>
                <input
                  id="speech-rate"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={preferences.speechRate}
                  onChange={(e) => handlePreferenceChange('speechRate', parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Adjust speech rate from 0.5 to 2.0"
                  aria-valuemin="0.5"
                  aria-valuemax="2.0"
                  aria-valuenow={preferences.speechRate}
                  aria-valuetext={`${preferences.speechRate.toFixed(1)} times speed`}
                />
                <span className="text-sm text-gray-600">2.0x</span>
              </div>
              <button
                onClick={testSpeech}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Test speech with current settings"
              >
                🔊 Test Speech
              </button>
            </div>

            {/* Voice Selection */}
            <div>
              <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-2">
                Voice Selection
              </label>
              <select
                id="voice-select"
                value={preferences.voice}
                onChange={(e) => handlePreferenceChange('voice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Select text-to-speech voice"
              >
                <option value="default">Default Voice</option>
                {voices.map((voice, idx) => (
                  <option key={idx} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700">
                  High Contrast Mode
                </label>
                <p className="text-sm text-gray-500">
                  Increases contrast for better visibility
                </p>
              </div>
              <button
                id="high-contrast"
                role="switch"
                aria-checked={preferences.highContrast}
                onClick={() => handlePreferenceChange('highContrast', !preferences.highContrast)}
                className={`${
                  preferences.highContrast ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span className="sr-only">
                  {preferences.highContrast ? 'Disable' : 'Enable'} high contrast mode
                </span>
                <span
                  className={`${
                    preferences.highContrast ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <div className="flex gap-4" role="radiogroup" aria-label="Font size selection">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    role="radio"
                    aria-checked={preferences.fontSize === size}
                    onClick={() => handlePreferenceChange('fontSize', size)}
                    className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      preferences.fontSize === size
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={saving ? 'Saving preferences...' : 'Save preferences'}
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-lg shadow p-6 border-2 border-red-200" aria-labelledby="danger-heading">
          <h2 id="danger-heading" className="text-xl font-semibold text-red-600 mb-4">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Delete account"
          >
            Delete Account
          </button>
        </section>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 id="delete-dialog-title" className="text-xl font-semibold text-gray-900 mb-4">
                Confirm Account Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  aria-label="Cancel account deletion"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Account deletion is not implemented in this prototype.');
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Confirm account deletion"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
