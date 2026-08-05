import React, { useState, useCallback, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo.webp';
import ventureLogo from '../../assets/images/pranay-matiyani-ventures.webp';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'stay', label: 'Stay' },
  { id: 'own-villa', label: 'Own a Villa' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'cafe', label: 'Cafe' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

// Map nav item IDs to actual App.js page names
const PAGE_MAP = {
  'home': 'home',
  'stay': 'rooms',
  'own-villa': 'home',
  'experiences': 'home',
  'cafe': 'cafe',
  'gallery': 'home', // Updated: Gallery ab 'home' page par open hoga
  'about': 'about-us',
  'contact': 'home',
};

// Reverse map to check active state
const REVERSE_PAGE_MAP = {
  'home': 'home',
  'rooms': 'stay',
  'cafe': 'cafe',
  'about-us': 'about',
  // Gallery yahan se hata diya gaya hai kyunki ab wo home ka part hai
};

function Navbar({ setCurrentPage, currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleNavClick = useCallback((navId) => {
    setIsMenuOpen(false);
    if (setCurrentPage) {
      const targetPage = PAGE_MAP[navId] || navId;
      setCurrentPage(targetPage);
      
      // Optional: Agar aap chahte hain ki page change hone ke baad section par smooth scroll ho
      setTimeout(() => {
        const element = document.getElementById(navId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [setCurrentPage]);

  const handleLogoClick = useCallback(() => {
    handleNavClick('home');
  }, [handleNavClick]);

  const handleOverlayClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const isActive = (navId) => {
    // Agar item ka id aur current page home hai toh usko highlight karne ka logic
    if (PAGE_MAP[navId] === 'home' && currentPage === 'home') {
      // '#' URL mein check kar sakte hain specific section highlight ke liye
      // Default behavior mein hum home map use kar rahe hain
      const hash = window.location.hash.replace('#', '');
      if (hash) return hash === navId;
      return navId === 'home';
    }
    
    const mappedPage = PAGE_MAP[navId];
    return currentPage === mappedPage || REVERSE_PAGE_MAP[currentPage] === navId;
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="navbar-wrapper" role="banner">
      <nav className="navbar-container" aria-label="Main Navigation">
        <div
          className="navbar-logo"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          aria-label="Go to Home"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(); }}
        >
          <img src={logo} alt="Meraki Living" className="logo-img" width="150" height="50" loading="eager" />
        </div>

        <ul className="navbar-links" role="menubar">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} role="none">
              <a
                href={`#${item.id}`}
                role="menuitem"
                onClick={(e) => { 
                  // Default link behavior hatane ke liye
                  if(PAGE_MAP[item.id] !== currentPage) e.preventDefault(); 
                  handleNavClick(item.id); 
                }}
                className={isActive(item.id) ? 'active-link' : ''}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          <img src={ventureLogo} alt="Pranay Matiyani Ventures" className="venture-logo" width="150" height="50" loading="eager" />
          <button
            className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            <span className="hamburger-line" aria-hidden="true" />
            <span className="hamburger-line" aria-hidden="true" />
            <span className="hamburger-line" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div
        className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={handleOverlayClick}
        role="presentation"
        aria-hidden="true"
      />

      <div
        id="mobile-menu"
        className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-menu-header">
          <img src={logo} alt="Meraki Living" className="mobile-logo-img" width="120" height="40" loading="eager" />
        </div>

        <ul className="mobile-navbar-links" role="menu">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} role="none">
              <a
                href={`#${item.id}`}
                role="menuitem"
                onClick={(e) => { 
                  if(PAGE_MAP[item.id] !== currentPage) e.preventDefault(); 
                  handleNavClick(item.id); 
                }}
                className={isActive(item.id) ? 'active-link' : ''}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

      </div>
    </header>
  );
}

export default Navbar;