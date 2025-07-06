import React from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}
      style={{position:'fixed',top:24,right:24,zIndex:2000}}>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;
