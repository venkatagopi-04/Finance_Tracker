// Toast.jsx - Global toast notification component
// Displays a dismissible message at the top right of the screen

import React from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
  // If no message, render nothing
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}
      style={{position:'fixed',top:24,right:24,zIndex:2000}}>
      <span>{message}</span>
      {/* Close button to dismiss the toast */}
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;
