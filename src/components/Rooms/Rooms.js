import React from 'react';
import './Rooms.css';

import room1 from '../../assets/images/room-1.webp';
import room2 from '../../assets/images/room-2.webp';
import room3 from '../../assets/images/room-3.webp';
import room4 from '../../assets/images/room-4.webp';

export const ROOMS_DATA = [
  {
    id: 1,
    image: room1,
    title: 'Himalayan View Room',
    desc: 'Enjoy breathtaking Himalayan views with cozy interiors and peaceful mountain-inspired comfort.',
    originalPrice: '5,000',
    price: '3,500',
    buttonText: 'View'
  },
  {
    id: 2,
    image: room2,
    title: 'Premium Valley Room',
    desc: 'Wake up to breathtaking valley views with elegant comfort and peaceful Himalayan charm.',
    originalPrice: '6,500',
    price: '4,500',
    buttonText: 'View'
  },
  {
    id: 3,
    image: room3,
    title: 'Luxury Family Suite',
    desc: 'A spacious stay experience crafted for families and unforgettable mountain moments.',
    originalPrice: '8,000',
    price: '6,000',
    buttonText: 'View'
  },
  {
    id: 4,
    image: room4,
    title: 'Entire Homestay',
    desc: 'Book the entire Meraki Living homestay for complete privacy and a memorable stay with your loved ones.',
    originalPrice: '30,000',
    price: '22,000',
    buttonText: 'View'
  }
];

function Rooms({ setCurrentPage }) {
  const handleViewRoom = (roomId) => {
    if (setCurrentPage) {
      setCurrentPage('room-details', roomId);
    }
  };

  return (
    <section className="rooms-section" aria-label="Stay in Timeless Comfort">
      <div className="rooms-container">
        <div className="rooms-header">
          <h2 className="rooms-title">Stay in Timeless Comfort</h2>
          <p className="rooms-subtitle">
            Discover thoughtfully designed rooms at Meraki Living, where modern comfort, peaceful interiors, and breathtaking Himalayan surroundings create the perfect mountain escape.
          </p>
        </div>

        <div className="rooms-grid">
          {ROOMS_DATA.map((room) => (
            <article className="room-card" key={room.id}>
              <div className="room-image-box">
                <img src={room.image} alt={room.title} width="640" height="480" loading="lazy" />
              </div>
              <div className="room-body">
                <h3 className="room-title">{room.title}</h3>
                <p className="room-desc">{room.desc}</p>
                <div className="room-footer">
                  <div className="room-price">
                    <span className="room-price-original">Rs. {room.originalPrice}</span>
                    <div className="room-price-value">
                      <span className="room-price-symbol">Rs.</span>
                      <span className="room-price-amount">{room.price}</span>
                    </div>
                  </div>
                  <button
                    className="room-btn"
                    onClick={() => handleViewRoom(room.id)}
                    aria-label={`View ${room.title} details`}
                  >
                    <span>{room.buttonText}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Rooms;