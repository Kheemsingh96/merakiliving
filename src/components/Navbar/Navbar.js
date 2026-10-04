import React, { useState, useCallback, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo.avif';
import ventureLogo from '../../assets/images/pranay-matiyani-ventures.avif';
import OptimizedImage from '../Common/OptimizedImage';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'own-a-villa', label: 'Own A Villa' },
  { id: 'cafe', label: 'Cafe Meraki' },
  { id: 'stay', label: 'Book a Stay' },
  { id: 'manage-booking', label: 'Manage Booking' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact Us' },
];

const HREF_MAP = {
  home: '/',
  'own-a-villa': '/own-a-villa',
  stay: '/#stay',
  cafe: '/cafe',
  gallery: '/#gallery',
  'manage-booking': '/manage-booking',
  about: '/about-us',
  contact: '/contact-us'
};

const PAGE_MAP = {
  home: 'home',
  'own-a-villa': 'own-a-villa',
  stay: 'home',
  cafe: 'cafe',
  gallery: 'home',
  'manage-booking': 'manage-booking',
  about: 'about-us',
  contact: 'contact-us'
};

function Navbar({ setCurrentPage, currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 10;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleNavClick = useCallback(
    (navId, e) => {
      if (e) e.preventDefault();
      setIsMenuOpen(false);

      if (!setCurrentPage) return;

      const targetPage = PAGE_MAP[navId] || navId;
      const scrollToId = (navId === 'stay' || navId === 'gallery' || navId === 'home') ? navId : null;

      setCurrentPage(targetPage, null, scrollToId);
    },
    [setCurrentPage]
  );

  const handleLogoClick = useCallback(
    (e) => {
      handleNavClick('home', e);
    },
    [handleNavClick]
  );

  const isActive = useCallback(
    (navId) => {
      const currentPath = typeof window !== 'undefined' ? (window.location.pathname || '') : '';
      const currentHash = typeof window !== 'undefined' ? (window.location.hash || '').toLowerCase() : '';

      if (navId === 'about') {
        return currentPage === 'about-us' || currentPath === '/about-us';
      }
      if (navId === 'contact') {
        return currentPage === 'contact-us' || currentPath === '/contact-us';
      }
      if (navId === 'own-a-villa') {
        return currentPage === 'own-a-villa' || currentPath === '/own-a-villa';
      }
      if (navId === 'cafe') {
        return currentPage === 'cafe' || currentPath === '/cafe';
      }
      if (navId === 'manage-booking') {
        return currentPage === 'manage-booking' || currentPath === '/manage-booking';
      }
      if (navId === 'stay') {
        return currentHash === '#stay' || currentPage === 'booking' || currentPath === '/booking';
      }
      if (navId === 'gallery') {
        return currentHash === '#gallery';
      }
      if (navId === 'home') {
        return (currentPage === 'home' || currentPath === '/' || currentPath === '') && (!currentHash || currentHash === '#home');
      }
      return false;
    },
    [currentPage]
  );

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
    <header
      className={`navbar-wrapper ${scrolled ? 'navbar-scrolled' : ''}`}
      role="banner"
    >
      <nav className="navbar-container" aria-label="Main Navigation">
        <a
          href="/"
          className="navbar-logo"
          onClick={handleLogoClick}
          aria-label="Go to Home"
        >
          <OptimizedImage
            src={logo}
            alt="Meraki Living"
            className="logo-img"
            width="150"
            height="50"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{ filter: 'none', transition: 'none' }}
            noWrapper={true}
          />
        </a>

        <ul className="navbar-links" role="menubar">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} role="none">
              <a
                href={HREF_MAP[item.id] || `/${item.id}`}
                role="menuitem"
                onClick={(e) => handleNavClick(item.id, e)}
                className={isActive(item.id) ? 'active-link' : ''}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          <OptimizedImage
            src={ventureLogo}
            alt="Pranay Matiyani Ventures"
            className="venture-logo"
            width="150"
            height="50"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            noWrapper={true}
          />
          <button
            className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label={
              isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
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
        onClick={closeMenu}
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
          <OptimizedImage
            src={logo}
            alt="Meraki Living"
            className="mobile-logo-img"
            width="120"
            height="40"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            noWrapper={true}
          />
          <button
            className="mobile-close-btn"
            onClick={closeMenu}
            aria-label="Close menu"
            type="button"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <ul className="mobile-navbar-links" role="menu">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} role="none">
              <a
                href={HREF_MAP[item.id] || `/${item.id}`}
                role="menuitem"
                onClick={(e) => handleNavClick(item.id, e)}
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