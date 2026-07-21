import React, { useState, useCallback, useEffect } from 'react';
import './Explore.css';

import luxuryMain from '../../assets/images/luxury-main.webp';
import luxury1 from '../../assets/images/luxury-1.webp';
import luxury2 from '../../assets/images/luxury-2.webp';
import luxury3 from '../../assets/images/luxury-3.webp';

import exteriorMain from '../../assets/images/exterior-main.webp';
import exterior1 from '../../assets/images/exterior-1.webp';
import exterior2 from '../../assets/images/exterior-2.webp';

import himalayanMain from '../../assets/images/himalayan-main.webp';
import himalayan1 from '../../assets/images/himalayan-1.webp';
import himalayan2 from '../../assets/images/himalayan-2.webp';
import himalayan3 from '../../assets/images/himalayan-3.webp';

import gardenMain from '../../assets/images/garden-main.webp';
import garden1 from '../../assets/images/garden-1.webp';
import garden2 from '../../assets/images/garden-2.webp';
import garden3 from '../../assets/images/garden-3.webp';
import garden4 from '../../assets/images/garden-4.webp';
import garden5 from '../../assets/images/garden-5.webp';
import garden6 from '../../assets/images/garden-6.webp';

import cafeMain from '../../assets/images/cafe-main.webp';
import cafe1 from '../../assets/images/cafe-1.webp';
import cafe2 from '../../assets/images/cafe-2.webp';
import cafe3 from '../../assets/images/cafe-3.webp';
import cafe4 from '../../assets/images/cafe-4.webp';
import cafe5 from '../../assets/images/cafe-5.webp';
import cafe6 from '../../assets/images/cafe-6.webp';
import cafe7 from '../../assets/images/cafe-7.webp';

const EXPLORE_DATA = [
  {
    id: 1,
    title: 'Luxury Rooms',
    photosCount: '4 Photos',
    coverImage: luxuryMain,
    gallery: [
      { src: luxuryMain, name: 'Master Suite', desc: 'Spacious king-size bedroom with panoramic valley views and premium linen bedding.' },
      { src: luxury1, name: 'Deluxe Twin Room', desc: 'Elegant twin bedroom with handcrafted wooden interiors and ambient lighting.' },
      { src: luxury2, name: 'Premium Suite', desc: 'Luxurious suite featuring a private balcony and modern amenities.' },
      { src: luxury3, name: 'Family Room', desc: 'Comfortable family room with cozy seating and nature-inspired decor.' },
    ],
  },
  {
    id: 2,
    title: 'Exterior',
    photosCount: '3 Photos',
    coverImage: exteriorMain,
    gallery: [
      { src: exteriorMain, name: 'Main Entrance', desc: 'Grand stone pathway leading to the resort entrance surrounded by lush gardens.' },
      { src: exterior1, name: 'Resort Facade', desc: 'Stunning architectural design blending modern luxury with Himalayan aesthetics.' },
      { src: exterior2, name: 'Evening View', desc: 'Resort illuminated beautifully at dusk with warm ambient lighting.' },
    ],
  },
  {
    id: 3,
    title: 'Himalayan Views',
    photosCount: '4 Photos',
    coverImage: himalayanMain,
    gallery: [
      { src: himalayanMain, name: 'Sunrise Panorama', desc: 'Breathtaking sunrise over the snow-capped Himalayan peaks from the terrace.' },
      { src: himalayan1, name: 'Valley Vista', desc: 'Sweeping views of the verdant valley stretching into the distant mountains.' },
      { src: himalayan2, name: 'Golden Hour', desc: 'Himalayan ranges bathed in golden light during the magical evening hours.' },
      { src: himalayan3, name: 'Misty Morning', desc: 'Serene morning mist rolling through the mountain valleys at dawn.' },
    ],
  },
  {
    id: 4,
    title: 'Organic Farm',
    photosCount: '6 Photos',
    coverImage: gardenMain,
    gallery: [
      { src: gardenMain, name: 'Organic Vegetable Patch', desc: 'Fresh seasonal vegetables grown naturally without any chemicals or pesticides.' },
      { src: garden1, name: 'Herb Garden', desc: 'Aromatic herbs like basil, rosemary, and mint cultivated for the kitchen.' },
      { src: garden2, name: 'Flower Walkway', desc: 'Colorful flower-lined pathways perfect for a peaceful morning stroll.' },
      { src: garden3, name: 'Fruit Orchard', desc: 'Seasonal fruit trees bearing apples, pears, and local Himalayan fruits.' },
      { src: garden4, name: 'Greenhouse', desc: 'Climate-controlled greenhouse nurturing exotic plants and seedlings.' },
      { src: garden5, name: 'Compost Area', desc: 'Sustainable composting system turning organic waste into rich garden soil.' },
      { src: garden6, name: 'Garden Seating', desc: 'Cozy outdoor seating nestled among blooming flowers and greenery.' },
    ],
  },
  {
    id: 5,
    title: 'Cafe & Dining',
    photosCount: '7 Photos',
    coverImage: cafeMain,
    gallery: [
      { src: cafeMain, name: 'Main Dining Hall', desc: 'Elegant dining space with floor-to-ceiling windows and mountain views.' },
      { src: cafe1, name: 'Outdoor Cafe', desc: 'Al fresco dining on the terrace with fresh mountain air and scenic vistas.' },
      { src: cafe2, name: 'Breakfast Spread', desc: 'Hearty breakfast featuring farm-fresh ingredients and local delicacies.' },
      { src: cafe3, name: "Chef's Special", desc: 'Gourmet dishes crafted by our expert chefs using organic produce.' },
      { src: cafe4, name: 'Coffee Corner', desc: 'Artisanal coffee bar serving freshly brewed Himalayan coffee and pastries.' },
      { src: cafe5, name: 'Private Dining', desc: 'Intimate private dining room for special celebrations and gatherings.' },
      { src: cafe6, name: 'Bar Area', desc: 'Well-stocked bar offering premium spirits, cocktails, and local brews.' },
      { src: cafe7, name: 'Evening Ambience', desc: 'Warm candlelit dining experience under the starlit Himalayan sky.' },
    ],
  },
];

function Explore() {
  const [activeGallery, setActiveGallery] = useState(null);

  const handleOpenGallery = useCallback((item) => {
    setActiveGallery(item);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleCloseGallery = useCallback(() => {
    setActiveGallery(null);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeGallery) {
        handleCloseGallery();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeGallery, handleCloseGallery]);

  return (
    <section className="explore-section" aria-label="Explore Meraki Living">
      <div className="explore-header">
        <h2 className="explore-title">
          Explore <span className="explore-highlight">Meraki Living</span>
        </h2>
        <p className="explore-subtitle">
          Discover every corner of Meraki Living through beautifully curated spaces. From elegant interiors and cozy rooms to breathtaking Himalayan views, peaceful outdoor retreats, and our fresh organic farm — every place is designed to make your stay truly unforgettable.
        </p>
      </div>

      <div className="explore-grid">
        {EXPLORE_DATA.map((item) => (
          <article
            className="explore-card"
            key={item.id}
            onClick={() => handleOpenGallery(item)}
            role="button"
            tabIndex={0}
            aria-label={`Open ${item.title} gallery`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenGallery(item); }}
          >
            <div className="explore-image-wrapper">
              <img src={item.coverImage} alt={item.title} className="explore-image" loading="lazy" />
              <div className="explore-overlay" />
            </div>
            <div className="explore-content">
              <div className="explore-info">
                <h3 className="explore-card-title">{item.title}</h3>
                <div className="explore-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="3" ry="3" />
                    <path d="M2 14L6.5 9.5C7.32843 8.67157 8.67157 8.67157 9.5 9.5L14 14" />
                    <path d="M12 12L14.5 9.5C15.3284 8.67157 16.6716 8.67157 17.5 9.5L22 14" />
                    <circle cx="17.5" cy="8.5" r="1.5" fill="currentColor" />
                  </svg>
                  <span>{item.photosCount}</span>
                </div>
              </div>
              <div className="explore-action">
                <span className="explore-action-text">View Gallery</span>
                <div className="explore-action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeGallery && (
        <div className="gallery-modal-overlay" onClick={handleCloseGallery} role="dialog" aria-modal="true" aria-label={`${activeGallery.title} Gallery`}>
          <div className="gallery-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-modal-header">
              <div className="gallery-modal-title-box">
                <h3 className="gallery-modal-title">{activeGallery.title}</h3>
                <span className="gallery-modal-count">{activeGallery.photosCount}</span>
              </div>
              <button className="gallery-modal-close" onClick={handleCloseGallery} aria-label="Close Gallery" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 5L5 19M5 5L19 19" />
                </svg>
              </button>
            </div>
            <div className="gallery-modal-body">
              <div className="gallery-grid">
                {activeGallery.gallery.map((photo, index) => (
                  <div className="gallery-card" key={index}>
                    <div className="gallery-card-image-box">
                      <img src={photo.src} alt={photo.name} loading="lazy" />
                    </div>
                    <div className="gallery-card-content">
                      <h4 className="gallery-card-name">{photo.name}</h4>
                      <p className="gallery-card-desc">{photo.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Explore;