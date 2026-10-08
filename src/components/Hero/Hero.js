import React, { useState, useEffect, useRef, memo } from 'react';
import { Location01Icon } from 'hugeicons-react';
import './Hero.css';

import hero1 from '../../assets/images/hero1.avif';
import hero2 from '../../assets/images/hero2.avif';
import hero3 from '../../assets/images/hero3.avif';

import OptimizedImage from '../Common/OptimizedImage';

const SLIDES = [hero1, hero2, hero3];
const SLIDE_INTERVAL = 4000;

function Hero({ setCurrentPage }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(() => typeof navigator !== 'undefined' && /ReactSnap/i.test(navigator.userAgent));
  const [mountedSlides, setMountedSlides] = useState(() => {
    if (typeof navigator !== 'undefined' && /ReactSnap/i.test(navigator.userAgent)) return [0, 1, 2];
    return [0];
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 50);

    // Defer loading background slides 1 and 2 until after the opening animation finishes
    const deferTimer = setTimeout(() => {
      setMountedSlides([0, 1, 2]);
    }, 2200);

    intervalRef.current = setInterval(() => {
      setActiveIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % SLIDES.length;
      });
    }, SLIDE_INTERVAL);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(deferTimer);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-bg-wrapper">
        {SLIDES.map((slide, index) => {
          if (!mountedSlides.includes(index)) return null;
          let slideClass = 'hero-bg';
          if (index === activeIndex) {
            slideClass = 'hero-bg active';
          } else if (index === prevIndex) {
            slideClass = 'hero-bg prev';
          }

          return (
            <OptimizedImage
              key={index}
              src={slide}
              alt={`Meraki Living Homestay and Mountain Retreat in Peora - View ${index + 1}`}
              className={slideClass}
              width="1920"
              height="1080"
              loading="eager"
              fetchPriority={index === 0 ? 'high' : 'low'}
              decoding="async"
              draggable="false"
              aria-hidden="true"
              noWrapper={true}
            />
          );
        })}
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
              onClick={() => setCurrentPage('srot')}
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