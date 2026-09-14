import React from 'react';
import './NotFound.css';

export default function NotFound({ setCurrentPage }) {
  const handleHomeClick = () => {
    if (setCurrentPage) {
      setCurrentPage('home');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <span className="not-found-badge">404 Error</span>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-text">
          The serene mountain trail you were exploring seems to have led somewhere unexpected. The page you are looking for does not exist or may have been moved.
        </p>
        <div className="not-found-actions">
          <button 
            type="button"
            className="not-found-btn"
            onClick={handleHomeClick}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}