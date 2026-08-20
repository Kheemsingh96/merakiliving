import React, { useState, useEffect, useRef, memo } from 'react';
import { Location01Icon } from 'hugeicons-react';
import './Hero.css';

import hero1 from '../../assets/images/hero1.webp';
import hero2 from '../../assets/images/hero2.webp';
import hero3 from '../../assets/images/hero3.webp';

const SLIDES = [hero1, hero2, hero3];
const SLIDE_INTERVAL = 4000;

function Hero({ setCurrentPage }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 200);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-bg-wrapper">
        {SLIDES.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Hero Background ${index + 1}`}
            className={index === activeIndex ? 'hero-bg active' : 'hero-bg'}
            width="1920"
            height="1080"
            loading="eager"
            fetchPriority={index === activeIndex ? 'high' : 'low'}
            decoding="async"
            draggable="false"
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
              type="button"
              className="hero-btn"
              onClick={() => setCurrentPage('booking')}
              aria-label="Book your stay at SROT"
            >
              Book Your Stay
            </button>
            <button
              type="button"
              className="hero-btn-outline"
              onClick={() => setCurrentPage('explore')}
              aria-label="Explore SROT retreat"
            >
              Explore स्रोत
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);