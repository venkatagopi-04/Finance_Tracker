// Sidebar.jsx - Responsive sidebar navigation for the app
// Includes links to all main pages, theme toggle, and logout

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaHistory, FaChartPie, FaFileUpload, FaCog, FaUser } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';


const Sidebar = () => {
  // State for dark mode and sidebar open/close
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [open, setOpen] = useState(false);

  // Apply theme to body and persist in localStorage
  useEffect(() => {
    document.body.setAttribute('data-theme', dark ? 'dark' : '');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Close sidebar on window resize for better UX
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  // Close sidebar when clicking overlay
  const handleOverlayClick = () => setOpen(false);

  return (
    <>
      {/* Hamburger button for mobile sidebar */}
      <button className="sidebar-hamburger" onClick={() => setOpen(o => !o)} aria-label="Open sidebar">
        <span></span>
        <span></span>
        <span></span>
      </button>
      {/* Overlay for closing sidebar on mobile */}
      {open && <div className="sidebar-overlay" onClick={handleOverlayClick}></div>}
      <div className={`sidebar${open ? ' open' : ''}`} style={{ ...styles.sidebar, background: 'var(--sidebar-bg)', color: 'var(--sidebar-text)' }}>
        <h2 style={styles.title}> Personal Finance Assistant</h2>
        <nav style={styles.nav}>
          {/* Navigation links */}
          <Link to="/dashboard" style={styles.link} onClick={() => setOpen(false)}><FaPlus />Dashboard</Link>
          <Link to="/history" style={styles.link} onClick={() => setOpen(false)}><FaHistory /> View History</Link>
          <Link to="/summary" style={styles.link} onClick={() => setOpen(false)}><FaChartPie /> Summary / Graphs</Link>
          <Link to="/receipt" style={styles.link} onClick={() => setOpen(false)}><FaFileUpload /> Receipt Upload</Link>
          <Link to="/settings" style={styles.link} onClick={() => setOpen(false)}><FaCog /> Settings</Link>
          <Link to="/profile" style={styles.link} onClick={() => setOpen(false)}><FaUser /> Profile</Link>
          {/* Logout link triggers backend logout and closes sidebar */}
          <Link to="/auth" onClick={async () => {
            await fetch('http://localhost:5000/auth/logout', {
              method: 'POST',
              credentials: 'include',
            });
            setOpen(false);
          }} style={styles.link}>
            <FaSignOutAlt /> Logout
          </Link>
        </nav>
        {/* Theme toggle button */}
        <div style={{ marginTop: 20, marginBottom: 40, textAlign: 'center' }}>
          <button
            onClick={() => setDark(d => !d)}
            style={{
              background: 'none',
              color: 'inherit',
              border: '1.5px solid #bbb',
              borderRadius: 8,
              padding: '10px 22px',
              fontWeight: 700,
              fontSize: '1.08rem',
              letterSpacing: '0.01em',
              cursor: 'pointer',
              marginTop: 10,
              width: '100%',
              transition: 'background 0.2s, color 0.2s, border 0.2s',
            }}
          >
            {dark ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </div>
      {/* No change needed here for main-content, handled in Dashboard.jsx and CSS. */}
    </>
  );
};

const styles = {
  sidebar: {
    width: '220px',
    height: '100vh',
    background: 'var(--sidebar-bg)',
    color: 'var(--sidebar-text)',
    padding: '20px',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 180,
  },
  title: {
    color: '#4fc3f7',
    marginBottom: '40px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  link: {
    color: 'var(--sidebar-text)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 500,
    fontSize: 16,
    padding: '8px 0',
    borderRadius: 6,
    transition: 'background 0.2s',
  },
};

export default Sidebar;
