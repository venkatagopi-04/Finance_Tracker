// Settings.jsx - User settings page
// Allows changing theme, notification preferences, and account deletion

import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './Settings.css';

const Settings = () => {
  // State for theme, notifications, user info, loading, and error
  const [theme, setTheme] = useState(document.body.getAttribute('data-theme') || 'light');
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user info on mount
  useEffect(() => {
    axios.get('/user/me')
      .then(res => setUser(res.data))
      .catch(() => setError('Failed to load user info'))
      .finally(() => setLoading(false));
  }, []);

  // Handle theme change and persist to localStorage
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    document.body.setAttribute('data-theme', e.target.value);
    localStorage.setItem('theme', e.target.value);
  };

  // Persist notification preference to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', notifications);
  }, [notifications]);

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await axios.delete('/user/me');
      await axios.post('/auth/logout');
      window.location.href = '/auth';
    } catch {
      alert('Failed to delete account');
    }
  };

  if (loading) return <div className="settings-page"><p>Loading...</p></div>;
  if (error) return <div className="settings-page"><p style={{color:'red'}}>{error}</p></div>;

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      {/* Appearance section for theme selection */}
      <div className="settings-section">
        <h4>Appearance</h4>
        <label>
          <input type="radio" value="light" checked={theme === 'light'} onChange={handleThemeChange} /> Light
        </label>
        <label>
          <input type="radio" value="dark" checked={theme === 'dark'} onChange={handleThemeChange} /> Dark
        </label>
      </div>
      {/* Notifications section */}
      <div className="settings-section">
        <h4>Notifications</h4>
        <label>
          <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} /> Enable notifications
        </label>
      </div>
      {/* Account section for delete */}
      <div className="settings-section">
        <h4>Account</h4>
        <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
};

export default Settings;
