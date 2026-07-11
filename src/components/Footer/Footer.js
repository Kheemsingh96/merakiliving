import React from 'react';
import './Footer.css';
import logo from '../../assets/images/logo.png';

const Footer = ({ setCurrentPage }) => {
  const handleNav = (page) => {
    if (setCurrentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">

        <div className="footer-brand">
          <img src={logo} alt="Meraki Living Logo" className="footer-logo" width="170" height="auto" loading="lazy" />
          <p className="footer-story">
            A peaceful mountain retreat in Mukteshwar offering comfortable stays,
            authentic Kumaoni hospitality, and scenic Himalayan views.
          </p>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.35z"/>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-list">
            <li><button onClick={() => handleNav('home')}>Home</button></li>
            <li><button onClick={() => handleNav('rooms')}>Our Rooms</button></li>
            <li><button onClick={() => handleNav('cafe')}>Mountain Cafe</button></li>
            <li><button onClick={() => handleNav('explore')}>Explore Nearby</button></li>
            <li><button onClick={() => handleNav('booking')}>Book a Stay</button></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-list">
            <li><button onClick={() => handleNav('privacy-policy')}>Privacy Policy</button></li>
            <li><button onClick={() => handleNav('terms-conditions')}>Terms & Conditions</button></li>
            <li><button onClick={() => handleNav('cancellation-policy')}>Cancellation Policy</button></li>
            <li><button onClick={() => handleNav('faq')}>FAQs</button></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-heading">Contact Us</h4>

          <div className="contact-item">
            <div className="contact-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="contact-info">
              <span className="contact-label">Location</span>
              <p>Meraki Living, Mukteshwar<br/>Uttarakhand, India — 263138</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className="contact-info">
              <span className="contact-label">Call Us</span>
              <a href="tel:+919456103445">+91 94561 03445</a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className="contact-info">
              <span className="contact-label">Email</span>
              <a href="mailto:info@merakiliving.com">info@merakiliving.com</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Meraki Living. All Rights Reserved.
          </p>
          <p className="footer-tagline">Crafted with care in the Himalayas</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;