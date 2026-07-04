import React from 'react';
import './Rooms.css';

import room1 from '../../assets/images/room-1.png';
import room2 from '../../assets/images/room-2.png';
import room3 from '../../assets/images/room-3.png';

const roomsData = [
  {
    id: 1,
    tag: 'Mountain View',
    image: room1,
    title: 'Himalayan View Room',
    desc: 'Wake up to peaceful mountain views and a relaxing stay surrounded by nature.',
    price: '3,500',
    rating: 4.9,
    reviews: 128,
    amenities: [
      { icon: 'wifi', label: 'Free WiFi' },
      { icon: 'parking', label: 'Free Parking' },
      { icon: 'breakfast', label: 'Breakfast' }
    ]
  },
  {
    id: 2,
    tag: 'Valley Surroundings',
    image: room2,
    title: 'Premium Valley Room',
    desc: 'A cozy and elegant space designed for comfort with beautiful valley surroundings.',
    price: '4,500',
    rating: 4.8,
    reviews: 96,
    amenities: [
      { icon: 'wifi', label: 'Free WiFi' },
      { icon: 'parking', label: 'Free Parking' },
      { icon: 'breakfast', label: 'Breakfast' }
    ]
  },
  {
    id: 3,
    tag: 'Family Comfort',
    image: room3,
    title: 'Luxury Family Suite',
    desc: 'A spacious stay experience crafted for families and unforgettable mountain moments.',
    price: '6,000',
    rating: 5.0,
    reviews: 84,
    amenities: [
      { icon: 'wifi', label: 'Free WiFi' },
      { icon: 'parking', label: 'Free Parking' },
      { icon: 'breakfast', label: 'Breakfast' }
    ]
  }
];

const amenityIcons = {
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  ),
  parking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/>
      <path d="M9 17h6"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  ),
  breakfast: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/>
      <line x1="10" y1="1" x2="10" y2="4"/>
      <line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  )
};

const starIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const Rooms = () => {
  return (
    <section className="rooms-section">
      <div className="rooms-container">
        <div className="rooms-header">
          <h2 className="rooms-title">Stay in Timeless Comfort</h2>
          <p className="rooms-subtitle">
            Discover thoughtfully designed rooms at Meraki Living, where modern comfort, peaceful interiors, and breathtaking Himalayan surroundings create the perfect mountain escape.
          </p>
        </div>

        <div className="rooms-grid">
          {roomsData.map((room) => (
            <div className="room-card" key={room.id}>
              <div className="room-image-box">
                <img src={room.image} alt={room.title} loading="lazy" />
                <div className="room-tag">{room.tag}</div>
                <div className="room-rating">
                  <div className="room-rating-stars">
                    {starIcon}
                    <span>{room.rating}</span>
                  </div>
                  <span className="room-rating-count">({room.reviews} reviews)</span>
                </div>
              </div>
              <div className="room-body">
                <h3 className="room-title">{room.title}</h3>
                <p className="room-desc">{room.desc}</p>
                <div className="room-amenities">
                  {room.amenities.map((amenity, index) => (
                    <div className="room-amenity" key={index}>
                      {amenityIcons[amenity.icon]}
                      <span>{amenity.label}</span>
                    </div>
                  ))}
                </div>
                <div className="room-footer">
                  <div className="room-price">
                    <span className="room-price-label">Starting from</span>
                    <div className="room-price-value">
                      <span className="room-price-symbol">₹</span>
                      <span className="room-price-amount">{room.price}</span>
                      <span className="room-price-unit">/ Night</span>
                    </div>
                  </div>
                  <a 
                    href={`https://wa.me/917037189517?text=Hi%20Meraki%20Living!%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(room.title)}.`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="room-btn"
                  >
                    <span>View Room</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;