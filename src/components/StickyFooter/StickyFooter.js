import React, { useState, useEffect, useCallback } from 'react';
import { IoHome, IoBed, IoCafe } from 'react-icons/io5';
import './StickyFooter.css';

function StickyFooter({ setCurrentPage, currentPage }) {
  const [activeHash, setActiveHash] = useState(() =>
    (typeof window !== 'undefined' && window.location.hash ? window.location.hash.toLowerCase() : '#home')
  );

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        setActiveHash(window.location.hash.toLowerCase());
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleNavClick = useCallback(
    (target, e) => {
      if (e) e.preventDefault();
      if (!setCurrentPage) return;

      if (target === 'home') {
        setActiveHash('#home');
        setCurrentPage('home', null, 'home');
      } else if (target === 'stay') {
        setActiveHash('#stay');
        setCurrentPage('home', null, 'stay');
      } else if (target === 'cafe') {
        setActiveHash('');
        setCurrentPage('cafe');
      }
    },
    [setCurrentPage]
  );

  const isActive = useCallback(
    (target) => {
      const currentHash = (typeof window !== 'undefined' && window.location.hash ? window.location.hash.toLowerCase() : activeHash || '#home');
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

      if (target === 'home') {
        return (currentPage === 'home' || currentPath === '/') && (!currentHash || currentHash === '#home');
      }
      if (target === 'stay') {
        return currentHash === '#stay' || currentPage === 'booking' || currentPage === 'room-details' || currentPath === '/booking' || currentPath === '/room-details';
      }
      if (target === 'cafe') {
        return currentPage === 'cafe' || currentPath === '/cafe' || currentHash === '#cafe';
      }
      return false;
    },
    [activeHash, currentPage]
  );

  return (
    <nav className="mobile-sticky-footer" aria-label="Mobile Navigation">
      <svg width="0" height="0" className="msf-svg-defs" aria-hidden="true">
        <defs>
          <linearGradient id="msfIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#870097" />
            <stop offset="100%" stopColor="#580063" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mobile-sticky-footer-container">
        <a
          href="/"
          className={`msf-item ${isActive('home') ? 'active' : ''}`}
          onClick={(e) => handleNavClick('home', e)}
          aria-label="Home"
        >
          <span className="msf-icon-wrap">
            <IoHome size={22} />
          </span>
          <span className="msf-label">Home</span>
        </a>
        <a
          href="/#stay"
          className={`msf-item ${isActive('stay') ? 'active' : ''}`}
          onClick={(e) => handleNavClick('stay', e)}
          aria-label="Book a Stay"
        >
          <span className="msf-icon-wrap">
            <IoBed size={22} />
          </span>
          <span className="msf-label">Book a Stay</span>
        </a>
        <a
          href="/cafe"
          className={`msf-item ${isActive('cafe') ? 'active' : ''}`}
          onClick={(e) => handleNavClick('cafe', e)}
          aria-label="Cafe"
        >
          <span className="msf-icon-wrap">
            <IoCafe size={22} />
          </span>
          <span className="msf-label">Cafe</span>
        </a>
      </div>
    </nav>
  );
}

export default StickyFooter;
