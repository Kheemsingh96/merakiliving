import React from 'react';
import './Cafe.css';

import cafeMain from '../../assets/images/cafe-main.webp';
import cafeSide1 from '../../assets/images/cafe-side1.webp';
import cafeSide2 from '../../assets/images/cafe-side2.webp';
import bgMountain from '../../assets/images/mountain-bg.webp';

const Cafe = () => {
  return (
    <section className="cafe-section" style={{ backgroundImage: `url(${bgMountain})` }}>
      <div className="cafe-overlay"></div>

      <div className="cafe-container">

        <div className="cafe-visuals">
          <div className="cafe-main-image">
            <img src={cafeMain} alt="Meraki Mountain Cafe exterior with Himalayan mountain views" width="640" height="480" loading="lazy" />
          </div>
          <div className="cafe-side-images">
            <div className="cafe-side-image-wrapper">
              <img src={cafeSide1} alt="Handcrafted coffee being prepared at Meraki Mountain Cafe" width="640" height="480" loading="lazy" />
            </div>
            <div className="cafe-side-image-wrapper">
              <img src={cafeSide2} alt="Scenic outdoor dining area with mountain views" width="640" height="480" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="cafe-content">
          <header className="cafe-header">
            <h2 className="cafe-title">
              Discover Himalayan Dining<br />
              <span className="cafe-highlight">At Meraki Mountain Cafe</span>
            </h2>
            <p className="cafe-desc">
              Experience a unique mountain dining journey where handcrafted beverages, authentic Kumaoni delicacies, freshly prepared meals, and breathtaking Himalayan views come together to create unforgettable memories.
            </p>
          </header>

          <ul className="cafe-features-list">
            <li className="cafe-feature-item">
              <div className="cafe-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/>
                  <line x1="10" y1="1" x2="10" y2="4"/>
                  <line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <span className="cafe-feature-text">Handcrafted Coffee & Beverages</span>
            </li>

            <li className="cafe-feature-item">
              <div className="cafe-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 10c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
                  <path d="M2 10h20v2a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8v-2z"/>
                  <path d="M8 21h8"/>
                </svg>
              </div>
              <span className="cafe-feature-text">Authentic Kumaoni Cuisine</span>
            </li>

            <li className="cafe-feature-item">
              <div className="cafe-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2C7 2 3 6 3 11v1h18v-1c0-5-4-9-9-9z"/>
                  <path d="M2 12h20"/>
                  <path d="M4 12v4a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4"/>
                </svg>
              </div>
              <span className="cafe-feature-text">Freshly Prepared Multi-Cuisine Meals</span>
            </li>

            <li className="cafe-feature-item">
              <div className="cafe-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="cafe-feature-text">Scenic Indoor & Outdoor Dining</span>
            </li>
          </ul>

          <a
            href="https://wa.me/919456103445?text=Hi%20Meraki%20Mountain%20Cafe%2C%20I%20would%20like%20to%20know%20more%20about%20your%20cafe!"
            target="_blank"
            rel="noopener noreferrer"
            className="cafe-btn"
            aria-label="Explore Meraki Mountain Cafe on WhatsApp"
          >
            <span>Explore Cafe</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
};

export default Cafe;