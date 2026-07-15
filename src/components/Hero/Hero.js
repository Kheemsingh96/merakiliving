import React, { useState, useEffect, useCallback } from 'react';
import { Location01Icon } from 'hugeicons-react';
import './Hero.css';

import hero1 from '../../assets/images/hero1.png';
import hero2 from '../../assets/images/hero2.png';
import hero3 from '../../assets/images/hero3.png';

const SLIDES = [hero1, hero2, hero3];
const SLIDE_INTERVAL = 4000;

function Hero({ setCurrentPage }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 200);
    const intervalId = setInterval(nextSlide, SLIDE_INTERVAL);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(intervalId);
    };
  }, [nextSlide]);

  return (
    <section className="hero-section">
      <div className="hero-bg-wrapper">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={index === activeIndex ? 'hero-bg active' : 'hero-bg'}
            style={{ backgroundImage: `url(${slide})` }}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="hero-overlay-main" aria-hidden="true" />
      <div className="hero-overlay-bottom" aria-hidden="true" />

      <div className="hero-container">
        <div className={isLoaded ? 'hero-content hero-loaded' : 'hero-content'}>
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
              onClick={() => setCurrentPage('booking')}
            >
              Book Your Stay
            </button>
            <button
              className="hero-btn-outline"
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