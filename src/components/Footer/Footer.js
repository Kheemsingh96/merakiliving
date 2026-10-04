import React from 'react';
import './Footer.css';
import logo from '../../assets/images/logo.avif';
import OptimizedImage from '../Common/OptimizedImage';

const Footer = ({ setCurrentPage }) => {
  const handleNav = (page, scrollToId = null) => {
    if (setCurrentPage) {
      setCurrentPage(page, null, scrollToId);
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">

        <div className="footer-brand">
          <OptimizedImage
            src={logo}
            alt="Meraki Living Logo"
            className="footer-logo"
            width="170"
            height="57"
            loading="lazy"
            decoding="async"
            noWrapper={true}
          />
          <p className="footer-story">
            A peaceful mountain retreat in Mukteshwar offering comfortable stays,
            authentic Kumaoni hospitality, and scenic Himalayan views.
          </p>
          <div className="footer-social">
            <a href="https://www.instagram.com/merakiliving.in/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/Meraki-Living-2270192013252603" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-list">
            <li><a href="/" onClick={(e) => { e.preventDefault(); handleNav('home', 'home'); }}>Home</a></li>
            <li><a href="/#stay" onClick={(e) => { e.preventDefault(); handleNav('home', 'stay'); }}>Our Rooms</a></li>
            <li><a href="/cafe" onClick={(e) => { e.preventDefault(); handleNav('cafe'); }}>Mountain Cafe</a></li>
            <li><a href="/#gallery" onClick={(e) => { e.preventDefault(); handleNav('home', 'gallery'); }}>Explore Nearby</a></li>
            <li><a href="/booking" onClick={(e) => { e.preventDefault(); handleNav('booking'); }}>Book a Stay</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-list">
            <li><a href="/privacy-policy" onClick={(e) => { e.preventDefault(); handleNav('privacy-policy'); }}>Privacy Policy</a></li>
            <li><a href="/terms-conditions" onClick={(e) => { e.preventDefault(); handleNav('terms-conditions'); }}>Terms &amp; Conditions</a></li>
            <li><a href="/cancellation-policy" onClick={(e) => { e.preventDefault(); handleNav('cancellation-policy'); }}>Cancellation Policy</a></li>
            <li><a href="/#faq" onClick={(e) => { e.preventDefault(); handleNav('home', 'faq'); }}>FAQs</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-heading">Contact Us</h4>

          <div className="contact-item align-center">
            <div className="contact-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="contact-info">
              <p>Meraki Living Peora Mukteshwar<br/>Uttarakhand India — 263138</p>
            </div>
          </div>

          <div className="contact-item align-center">
            <div className="contact-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className="contact-info">
              <a href="mailto:info@merakiliving.in">info@merakiliving.in</a>
            </div>
          </div>

          <div className="contact-item align-center">
            <div className="contact-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className="contact-info">
              <a href="tel:+919456103445">94561 03445</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Meraki Living. All Rights Reserved.
          </p>
          <a
            href="https://kheemsinghlatwalportfolio.vercel.app/#home"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-developer-link"
          >
            Designed &amp; Developed by Kheem Singh Latwal
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;