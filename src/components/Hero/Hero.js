import React, { useState, useEffect } from 'react';
import { Location01Icon } from 'hugeicons-react';
import './Hero.css';

import hero1 from '../../assets/images/hero1.png';
import hero2 from '../../assets/images/hero2.png';
import hero3 from '../../assets/images/hero3.png';
import hero4 from '../../assets/images/hero4.png';

const SLIDES = [hero1, hero2, hero3, hero4];

function Hero({ setCurrentPage }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000); // 4s transition gives a more premium, relaxed feel than 3s

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="hero-section" aria-label="Hero Banner">
      {/* Background Slider */}
      <div className="hero-bg-wrapper">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`hero-bg ${index === activeIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide}')` }}
            role="img"
            aria-label={`Hero background ${index + 1}`}
          />
        ))}
      </div>

      {/* Gradients */}
      <div className="hero-overlay-main" />
      <div className="hero-overlay-bottom" />

      {/* Content */}
      <div className="hero-container">
        <div className={`hero-content ${isLoaded ? 'hero-loaded' : ''}`}>
          <div className="hero-text-wrapper">
            <p className="hero-pre-title">Meraki Living</p>

            <h1 className="hero-title">
              SROT <span className="hindi-title">स्रोत</span>
            </h1>

            <h2 className="hero-subtitle">Luxury Boutique Farm Retreat</h2>

            <div className="hero-location">
              <Location01Icon size={18} className="location-icon" variant="stroke" />
              <span>Peora &bull; Near Mukteshwar &bull; Kumaon Himalayas</span>
            </div>

            <p className="hero-tagline">Where Every Journey Finds Its Source</p>

            <p className="hero-description">
              Nestled in the serene Himalayan village of Peora, surrounded by lush forests, fruit orchards, and a perennial mountain stream, SROT offers thoughtfully designed cottages, farm-fresh cuisine, and unforgettable Himalayan experiences.
            </p>
          </div>

          <div className="hero-btn-group">
            <button
              className="hero-btn"
              aria-label="Book Your Stay"
              type="button"
              onClick={() => setCurrentPage('booking')}
            >
              Book Your Stay
            </button>
            <button
              className="hero-btn-outline"
              aria-label="Explore स्रोत"
              type="button"
              onClick={() => setCurrentPage('explore')}
            >
              Explore स्रोत
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;