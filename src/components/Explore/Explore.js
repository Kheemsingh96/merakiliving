import React, { useState, useCallback, useEffect, useRef } from 'react';
import { API_CONFIG_URL } from '../../config/api';
import { safeParseResponse, formatImageUrl } from '../../utils/apiHelper';
import './Explore.css';

import luxuryMain from '../../assets/images/luxury-main.avif';
import luxury1 from '../../assets/images/luxury-1.avif';
import luxury2 from '../../assets/images/luxury-2.avif';
import luxury3 from '../../assets/images/luxury-3.avif';

import exteriorMain from '../../assets/images/exterior-main.avif';
import exterior1 from '../../assets/images/exterior-1.avif';
import exterior2 from '../../assets/images/exterior-2.avif';

import himalayanMain from '../../assets/images/himalayan-main.avif';
import himalayan1 from '../../assets/images/himalayan-1.avif';
import himalayan2 from '../../assets/images/himalayan-2.avif';
import himalayan3 from '../../assets/images/himalayan-3.avif';

import gardenMain from '../../assets/images/garden-main.avif';
import garden1 from '../../assets/images/garden-1.avif';
import garden2 from '../../assets/images/garden-2.avif';
import garden3 from '../../assets/images/garden-3.avif';
import garden4 from '../../assets/images/garden-4.avif';
import garden5 from '../../assets/images/garden-5.avif';
import garden6 from '../../assets/images/garden-6.avif';

import cafeMain from '../../assets/images/cafe-main.avif';
import cafe1 from '../../assets/images/cafe-1.avif';
import cafe2 from '../../assets/images/cafe-2.avif';
import cafe3 from '../../assets/images/cafe-3.avif';
import cafe4 from '../../assets/images/cafe-4.avif';
import cafe5 from '../../assets/images/cafe-5.avif';
import cafe6 from '../../assets/images/cafe-6.avif';
import cafe7 from '../../assets/images/cafe-7.avif';
import OptimizedImage from '../Common/OptimizedImage';

const EXPLORE_DATA = [
  {
    id: 1,
    title: 'Luxury Rooms',
    photosCount: '4 Photos',
    coverImage: luxuryMain,
    gallery: [
      { src: luxuryMain },
      { src: luxury1 },
      { src: luxury2 },
      { src: luxury3 },
    ],
  },
  {
    id: 2,
    title: 'Exterior',
    photosCount: '3 Photos',
    coverImage: exteriorMain,
    gallery: [
      { src: exteriorMain },
      { src: exterior1 },
      { src: exterior2 },
    ],
  },
  {
    id: 3,
    title: 'Himalayan Views',
    photosCount: '4 Photos',
    coverImage: himalayanMain,
    gallery: [
      { src: himalayanMain },
      { src: himalayan1 },
      { src: himalayan2 },
      { src: himalayan3 },
    ],
  },
  {
    id: 4,
    title: 'Organic Farm',
    photosCount: '7 Photos',
    coverImage: gardenMain,
    gallery: [
      { src: gardenMain },
      { src: garden1 },
      { src: garden2 },
      { src: garden3 },
      { src: garden4 },
      { src: garden5 },
      { src: garden6 },
    ],
  },
  {
    id: 5,
    title: 'Cafe & Dining',
    photosCount: '8 Photos',
    coverImage: cafeMain,
    gallery: [
      { src: cafeMain },
      { src: cafe1 },
      { src: cafe2 },
      { src: cafe3 },
      { src: cafe4 },
      { src: cafe5 },
      { src: cafe6 },
      { src: cafe7 },
    ],
  },
];

function Explore() {
  const [activeGallery, setActiveGallery] = useState(null);
  const [exploreData, setExploreData] = useState(EXPLORE_DATA);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchExploreData = useCallback(() => {
    fetch(`${API_CONFIG_URL}/api_gallery.php`)
      .then(res => safeParseResponse(res))
      .then(parsed => {
        if (!isMountedRef.current) return;
        const data = parsed.data;
        if (parsed.ok && data && data.status === 'success' && Array.isArray(data.data)) {
          const apiImages = data.data;
          const updatedData = EXPLORE_DATA.map(item => {
            const catName = `Explore - ${item.title}`;
            const imagesForCat = apiImages.filter(img => img.category === catName);
            if (imagesForCat.length > 0) {
              return {
                ...item,
                coverImage: formatImageUrl(imagesForCat[0].image_url),
                photosCount: `${imagesForCat.length} Photos`,
                gallery: imagesForCat.map(img => ({ src: formatImageUrl(img.image_url) }))
              };
            }
            return item;
          });
          setExploreData(updatedData);
        }
      })
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching explore images:", err);
        }
      });
  }, []);

  useEffect(() => {
    fetchExploreData();
    const handler = () => {
      fetchExploreData();
    };
    window.addEventListener('galleryUpdated', handler);
    return () => {
      window.removeEventListener('galleryUpdated', handler);
    };
  }, [fetchExploreData]);

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
      <div className="explore-header reveal-fade-up">
        <h2 className="explore-title">
          Explore <span className="explore-highlight">Meraki Living</span>
        </h2>
        <p className="explore-subtitle">
          Discover every corner of Meraki Living through beautifully curated spaces. From elegant interiors and cozy rooms to breathtaking Himalayan views, peaceful outdoor retreats, and our fresh organic farm — every place is designed to make your stay truly unforgettable.
        </p>
      </div>

      <div className="explore-grid reveal-stagger">
        {exploreData.map((item) => (
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
              <OptimizedImage
                src={item.coverImage}
                alt={item.title}
                className="explore-image"
                width="600"
                height="400"
                loading="lazy"
                decoding="async"
                noWrapper={true}
              />
              <div className="explore-overlay" />
            </div>
            
            <div className="explore-content">
              <h3 className="explore-card-title">{item.title}</h3>
              <div className="explore-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>{item.photosCount}</span>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="gallery-modal-body">
              <div className="gallery-grid">
                {activeGallery.gallery.map((photo, index) => (
                  <div className="gallery-card" key={index}>
                    <OptimizedImage
                      src={photo.src}
                      alt={`${activeGallery.title} - ${index + 1}`}
                      width="800"
                      height="600"
                      loading="lazy"
                      decoding="async"
                      noWrapper={true}
                    />
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