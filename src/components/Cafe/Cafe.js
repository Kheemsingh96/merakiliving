import React from 'react';
import './Cafe.css';

// Local images 
import cafeMain from '../../assets/images/cafe-main.png';
import cafeSide1 from '../../assets/images/cafe-side1.png';
import cafeSide2 from '../../assets/images/cafe-side2.png';
import bgMountain from '../../assets/images/mountain-bg.png';

const Cafe = () => {
  return (
    <section 
      className="cafe-section" 
      style={{ backgroundImage: `url(${bgMountain})` }}
    >
      <div className="cafe-overlay"></div>
      
      <div className="cafe-container">
        
        {/* Left Side: Premium Image Grid */}
        <div className="cafe-visuals">
          <div className="cafe-main-image">
            <img src={cafeMain} alt="Meraki Mountain Cafe" loading="lazy" />
          </div>
          <div className="cafe-side-images">
            <div className="cafe-side-image-wrapper">
              <img src={cafeSide1} alt="Handcrafted Coffee" loading="lazy" />
            </div>
            <div className="cafe-side-image-wrapper">
              <img src={cafeSide2} alt="Scenic Dining View" loading="lazy" />
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="cafe-content">
          <h2 className="cafe-title">
            Discover Himalayan Dining<br />
            <span className="cafe-highlight">At Meraki Mountain Café</span>
          </h2>
          
          <p className="cafe-description">
            Experience a unique mountain dining journey where handcrafted beverages, authentic Kumaoni delicacies, freshly prepared meals, and breathtaking Himalayan views come together to create unforgettable memories.
          </p>

          <div className="cafe-features-list">
            
            {/* Feature 1: Coffee & Beverages */}
            <div className="cafe-feature-item">
              <div className="cafe-icon-box">
                {/* Hugeicons Solid: Coffee Cup */}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 19h16v2H4zM20 6c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2h-2v1c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V4h14v2h2zm-4 8V6H6v8c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2zm2-6h2v3h-2V8z" />
                </svg>
              </div>
              <span className="cafe-feature-text">Handcrafted Coffee & Beverages</span>
            </div>

            {/* Feature 2: Kumaoni Cuisine */}
            <div className="cafe-feature-item">
              <div className="cafe-icon-box">
                {/* Hugeicons Solid: Authentic Bowl */}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3a9 9 0 00-8.99 8H2v2h20v-2h-1.01A9 9 0 0012 3zm0 2a7 7 0 016.92 6H5.08A7 7 0 0112 5zm-8 9h16v3c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3v-3z" />
                </svg>
              </div>
              <span className="cafe-feature-text">Authentic Kumaoni Cuisine</span>
            </div>

            {/* Feature 3: Multi-Cuisine Meals */}
            <div className="cafe-feature-item">
              <div className="cafe-icon-box">
                {/* Hugeicons Solid: Dining Cloche */}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C7.3 2 3.4 5.3 2.2 9.8 2.1 10.2 2 10.6 2 11v2h20v-2c0-.4-.1-.8-.2-1.2C20.6 5.3 16.7 2 12 2zm7.8 9H4.2C5.1 6.3 8.3 4 12 4s6.9 2.3 7.8 7zM2 15h20v2H2zM2 19h20v2H2z" />
                </svg>
              </div>
              <span className="cafe-feature-text">Freshly Prepared Multi-Cuisine Meals</span>
            </div>

            {/* Feature 4: Scenic Dining */}
            <div className="cafe-feature-item">
              <div className="cafe-icon-box">
                {/* Hugeicons Solid: Dining Table/Scenic */}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zm-9-8h2v2h-2zm-4 0h2v2H7zm8 0h2v2h-2z" />
                </svg>
              </div>
              <span className="cafe-feature-text">Scenic Indoor & Outdoor Dining</span>
            </div>

          </div>

          <button className="cafe-explore-btn">
            <span>Explore Café</span>
            <div className="cafe-btn-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Cafe;