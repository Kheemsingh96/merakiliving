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

const PAGE_MAP = {
  home: 'home',
  stay: 'rooms',
  'own-villa': 'home',
  experiences: 'home',
  cafe: 'cafe',
  gallery: 'home',
  about: 'about-us',
  contact: 'home',
};

const REVERSE_PAGE_MAP = {
  home: 'home',
  rooms: 'stay',
  cafe: 'cafe',
  'about-us': 'about',
};

function Navbar({ setCurrentPage, currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(
    window.location.hash.replace('#', '')
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
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
      const isSwitchingPage = currentPage !== targetPage;

      if (isSwitchingPage) {
        setCurrentPage(targetPage);
      }

      setTimeout(() => {
        const element = document.getElementById(navId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', `#${navId}`);
          setActiveHash(navId);
        } else if (navId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          window.history.pushState(null, '', window.location.pathname);
          setActiveHash('home');
        }
      }, isSwitchingPage ? 300 : 50);
    },
    [currentPage, setCurrentPage]
  );

  const handleLogoClick = useCallback(
    (e) => {
      handleNavClick('home', e);
    },
    [handleNavClick]
  );

  const isActive = useCallback(
    (navId) => {
      if (PAGE_MAP[navId] === 'home' && currentPage === 'home') {
        if (activeHash) return activeHash === navId;
        return navId === 'home';
      }
      const mappedPage = PAGE_MAP[navId];
      return (
        currentPage === mappedPage || REVERSE_PAGE_MAP[currentPage] === navId
      );
    },
    [activeHash, currentPage]
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

  useEffect(() => {
    const handleHashChange = () =>
      setActiveHash(window.location.hash.replace('#', ''));
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <header
      className={`navbar-wrapper ${scrolled ? 'navbar-scrolled' : ''}`}
      role="banner"
    >
      <nav className="navbar-container" aria-label="Main Navigation">
        <div
          className="navbar-logo"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          aria-label="Go to Home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleLogoClick(e);
          }}
        >
          <img
            src={logo}
            alt="Meraki Living"
            className="logo-img"
            width="150"
            height="50"
            loading="eager"
          />
        </div>

        <ul className="navbar-links" role="menubar">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} role="none">
              <a
                href={`#${item.id}`}
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
          <img
            src={ventureLogo}
            alt="Pranay Matiyani Ventures"
            className="venture-logo"
            width="150"
            height="50"
            loading="eager"
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
          <img
            src={logo}
            alt="Meraki Living"
            className="mobile-logo-img"
            width="120"
            height="40"
            loading="eager"
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
                href={`#${item.id}`}
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