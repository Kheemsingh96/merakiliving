// src/components/Navbar/Navbar.js
import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Meraki Living" className="logo-img" />
        </div>
        
        {/* Desktop Navigation */}
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#own-villa">Own a Villa</a></li>
          <li><a href="#sell-rent">Sell/Rent</a></li>
          <li><a href="#cafe-meraki">Cafe Meraki</a></li>
          <li><a href="#farm-stay">Farm Stay</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#contact">Contact us</a></li>
        </ul>

        <div className="navbar-actions">
          <button className="btn-book-now">Book Now</button>
        </div>

        {/* Transforming Hamburger Button */}
        <button 
          className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
      ></div>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <img src={logo} alt="Meraki Living" className="mobile-logo-img" />
          {/* Alag se close button hata diya gaya hai. Wahi hamburger use hoga. */}
        </div>
        
        <ul className="mobile-navbar-links">
          <li><a href="#home" onClick={toggleMenu}>Home</a></li>
          <li><a href="#own-villa" onClick={toggleMenu}>Own a Villa</a></li>
          <li><a href="#sell-rent" onClick={toggleMenu}>Sell/Rent</a></li>
          <li><a href="#cafe-meraki" onClick={toggleMenu}>Cafe Meraki</a></li>
          <li><a href="#farm-stay" onClick={toggleMenu}>Farm Stay</a></li>
          <li><a href="#gallery" onClick={toggleMenu}>Gallery</a></li>
          <li><a href="#contact" onClick={toggleMenu}>Contact us</a></li>
        </ul>

        <div className="mobile-navbar-actions">
          <button className="btn-book-now-mobile" onClick={toggleMenu}>Book Now</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;