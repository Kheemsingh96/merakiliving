import React, { useState, useEffect } from 'react';
import './Rooms.css';

import room1 from '../../assets/images/room-1.webp';
import room2 from '../../assets/images/room-2.webp';
import room3 from '../../assets/images/room-3.webp';
import room4 from '../../assets/images/room-4.webp';

export const ROOMS_DATA = [
  {
    id: 4,
    image: room4,
    title: 'Entire Homestay',
    desc: 'Book the entire Meraki Living homestay for complete privacy and a memorable stay with your loved ones.',
    originalPrice: '30,000',
    price: '22,000',
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
    id: 2,
    image: room2,
    title: 'Premium Valley Room',
    desc: 'Wake up to breathtaking valley views with elegant comfort and peaceful Himalayan charm.',
    originalPrice: '6,500',
    price: '4,500',
    buttonText: 'View'
  },
  {
    id: 1,
    image: room1,
    title: 'Himalayan View Room',
    desc: 'Enjoy breathtaking Himalayan views with cozy interiors and peaceful mountain-inspired comfort.',
    originalPrice: '5,000',
    price: '3,500',
    buttonText: 'View'
  }
];

export function parseRoomTitle(rawTitle) {
  if (!rawTitle || typeof rawTitle !== 'string') {
    return { mainName: rawTitle ? String(rawTitle) : '', subtitle: '', roomType: '' };
  }

  const clean = rawTitle.trim();
  if (!clean) {
    return { mainName: '', subtitle: '', roomType: '' };
  }

  // 1. If contains newlines
  if (clean.includes('\n')) {
    const lines = clean.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (lines.length >= 3) {
      return {
        mainName: lines[0],
        subtitle: lines[1].replace(/^\*+|\*+$/g, '').trim(),
        roomType: lines.slice(2).join(' ')
      };
    } else if (lines.length === 2) {
      if (/^\*.*\*$/.test(lines[1])) {
        return {
          mainName: lines[0],
          subtitle: lines[1].replace(/^\*+|\*+$/g, '').trim(),
          roomType: ''
        };
      }
      return {
        mainName: lines[0],
        subtitle: '',
        roomType: lines[1].replace(/^\*+|\*+$/g, '').trim()
      };
    } else if (lines.length === 1) {
      return { mainName: lines[0], subtitle: '', roomType: '' };
    }
  }

  // 2. If contains delimiters like " - ", " – ", " — ", " | "
  const parts = clean.split(/\s*(?:[-–—|]|\s\/\s)\s*/).map(s => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return {
      mainName: parts[0],
      subtitle: parts[1].replace(/^\*+|\*+$/g, '').trim(),
      roomType: parts.slice(2).join(' - ')
    };
  } else if (parts.length === 2) {
    if (/^\*.*\*$/.test(parts[1])) {
      return {
        mainName: parts[0],
        subtitle: parts[1].replace(/^\*+|\*+$/g, '').trim(),
        roomType: ''
      };
    }
    return {
      mainName: parts[0],
      subtitle: '',
      roomType: parts[1].replace(/^\*+|\*+$/g, '').trim()
    };
  }

  // 3. Fallback: single name
  return {
    mainName: clean,
    subtitle: '',
    roomType: ''
  };
}

function Rooms({ setCurrentPage }) {
  const [rooms, setRooms] = useState(ROOMS_DATA);

  useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_rooms.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          const merged = ROOMS_DATA.map(localRoom => {
            const backendRoom = data.data.find(r => r.id === localRoom.id);
            if (backendRoom) {
              return {
                ...localRoom,
                title: backendRoom.name || localRoom.title,
                desc: backendRoom.description || localRoom.desc,
                price: backendRoom.price?.toLocaleString() || localRoom.price,
                originalPrice: backendRoom.original_price?.toLocaleString() || localRoom.originalPrice,
                image: backendRoom.image_url || localRoom.image
              };
            }
            return localRoom;
          });
          setRooms(merged);
        }
      })
      .catch(err => console.error(err));
  }, []);

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
          {rooms.map((room) => {
            const titleData = parseRoomTitle(room.title);
            return (
              <article className="room-card" key={room.id}>
                <div className="room-image-box">
                  <img src={room.image} alt={titleData.mainName || room.title} width="640" height="480" loading="lazy" decoding="async" />
                </div>
                <div className="room-body">
                  <div className="room-title-block">
                    <div className="room-title-header-row">
                      {titleData.mainName && <h3 className="room-title-main">{titleData.mainName}</h3>}
                      {titleData.subtitle && <span className="room-title-sub">{titleData.subtitle}</span>}
                    </div>
                    {titleData.roomType && <span className="room-title-type">{titleData.roomType}</span>}
                  </div>
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
                      aria-label={`View ${titleData.mainName || room.title} details`}
                    >
                      <span>{room.buttonText}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Rooms;