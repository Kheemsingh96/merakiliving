import React, { useState } from 'react';
import './Explore.css';

const exploreData = [
  {
    id: 1,
    title: 'Luxury Rooms',
    photosCount: '4 Photos',
    coverImage: 'https://kimi-web-img.moonshot.cn/img/imageio.forbes.com/b760ed38588b2b52e6ff4876ae7c0c59dcb3b383.jpg',
    gallery: [
      'https://kimi-web-img.moonshot.cn/img/imageio.forbes.com/b760ed38588b2b52e6ff4876ae7c0c59dcb3b383.jpg',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    id: 2,
    title: 'Exterior',
    photosCount: '3 Photos',
    coverImage: 'https://kimi-web-img.moonshot.cn/img/images.adsttc.com/66c5c6b482f05cbd4079ae9e61313d6a11a1c639.jpg',
    gallery: [
      'https://kimi-web-img.moonshot.cn/img/images.adsttc.com/66c5c6b482f05cbd4079ae9e61313d6a11a1c639.jpg',
      'https://images.unsplash.com/photo-1600596542815-78b9dba3b914?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    id: 3,
    title: 'Himalayan Views',
    photosCount: '4 Photos',
    coverImage: 'https://kimi-web-img.moonshot.cn/img/thumbs.dreamstime.com/fdf3e13fc1c012371f30804b2b562c29d25afec3.jpg',
    gallery: [
      'https://kimi-web-img.moonshot.cn/img/thumbs.dreamstime.com/fdf3e13fc1c012371f30804b2b562c29d25afec3.jpg',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1483728642387-6c3ba6c6af5f?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    id: 4,
    title: 'Garden & Outdoor',
    photosCount: '3 Photos',
    coverImage: 'https://kimi-web-img.moonshot.cn/img/occa-design.com/ca295fd152a2739eca253c05600d1d1f5195c54f.webp',
    gallery: [
      'https://kimi-web-img.moonshot.cn/img/occa-design.com/ca295fd152a2739eca253c05600d1d1f5195c54f.webp',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1598533781289-54316d93e157?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    id: 5,
    title: 'Cafe & Dining',
    photosCount: '3 Photos',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000'
    ]
  }
];

const Explore = () => {
  const [activeGallery, setActiveGallery] = useState(null);

  const handleOpenGallery = (item) => {
    setActiveGallery(item);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseGallery = () => {
    setActiveGallery(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="explore-section">
      <div className="explore-header">
        <h2 className="explore-title">
          Explore <span className="explore-highlight">Meraki Living</span>
        </h2>
        <p className="explore-subtitle">
          Discover every corner of Meraki Living through beautifully curated spaces. From elegant interiors and cozy rooms to breathtaking Himalayan views and peaceful outdoor retreats, every place is designed to make your stay truly unforgettable.
        </p>
      </div>

      <div className="explore-grid">
        {exploreData.map((item, index) => (
          <div
            className="explore-card"
            key={item.id}
            style={{ animationDelay: `${index * 0.15}s` }}
            onClick={() => handleOpenGallery(item)}
          >
            <div className="explore-image-wrapper">
              <img src={item.coverImage} alt={item.title} className="explore-image" />
              <div className="explore-overlay"></div>
            </div>

            <div className="explore-content">
              <div className="explore-info">
                <h3 className="explore-card-title">{item.title}</h3>
                <div className="explore-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3" ry="3"></rect>
                    <path d="M2 14L6.5 9.5C7.32843 8.67157 8.67157 8.67157 9.5 9.5L14 14"></path>
                    <path d="M12 12L14.5 9.5C15.3284 8.67157 16.6716 8.67157 17.5 9.5L22 14"></path>
                    <circle cx="17.5" cy="8.5" r="1.5" fill="currentColor"></circle>
                  </svg>
                  <span>{item.photosCount}</span>
                </div>
              </div>

              <div className="explore-action">
                <span className="explore-action-text">View Gallery</span>
                <div className="explore-action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeGallery && (
        <div className="gallery-modal-overlay" onClick={handleCloseGallery}>
          <div className="gallery-modal-container" onClick={(e) => e.stopPropagation()}>

            <div className="gallery-modal-header">
              <div className="gallery-modal-title-box">
                <h3 className="gallery-modal-title">{activeGallery.title}</h3>
                <span className="gallery-modal-count">{activeGallery.photosCount}</span>
              </div>
              <button className="gallery-modal-close" onClick={handleCloseGallery} aria-label="Close Gallery">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 5L5 19M5 5L19 19"></path>
                </svg>
              </button>
            </div>

            <div className="gallery-modal-body">
              <div className="gallery-masonry">
                {activeGallery.gallery.map((photo, index) => (
                  <div className="gallery-masonry-item" key={index}>
                    <img src={photo} alt={`${activeGallery.title} - ${index + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default Explore;