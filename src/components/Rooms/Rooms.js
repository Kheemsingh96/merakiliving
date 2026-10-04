import React from 'react';
import { useRooms } from '../../hooks/useRooms';
import './Rooms.css';

import room1 from '../../assets/images/room-1.avif';
import room2 from '../../assets/images/room-2.avif';
import room3 from '../../assets/images/room-3.avif';
import room4 from '../../assets/images/room-4.avif';
import OptimizedImage from '../Common/OptimizedImage';

export const ROOMS_DATA = [
  {
    id: 4,
    image: room4,
    title: 'SROT Anant The Infinite Himalayan 3 Bedroom Villa',
    desc: 'Book the entire Meraki Living homestay for privacy comfort and a memorable mountain stay Enjoy spacious living areas peaceful surroundings fresh mountain air and access to amenities Perfect for large groups family gatherings and special occasions offering a welcoming space where everyone can relax connect and enjoy their time together',
    originalPrice: '30,000',
    price: '22,000',
    buttonText: 'View'
  },
  {
    id: 3,
    image: room3,
    title: 'SROT Shikhar The Summit Himalayan Royal Suite',
    desc: 'Experience our Luxury Family Suite at Meraki Living with spacious interiors comfortable furnishings and thoughtful modern amenities Enjoy peaceful mountain surroundings fresh air and beautiful views with plenty of room to relax together Designed for families and longer stays this suite offers a refined atmosphere warm comfort and memorable moments',
    originalPrice: '8,000',
    price: '6,000',
    buttonText: 'View'
  },
  {
    id: 2,
    image: room2,
    title: 'SROT Aaroh The Ascent Himalayan Grand Suite',
    desc: 'Enjoy our Premium Valley Room at Meraki Living featuring elegant interiors comfortable furnishings and beautiful valley views Wake up to fresh mountain air and peaceful surroundings while relaxing in a designed space Perfect for couples and travellers seeking a refined stay with modern comfort natural beauty and a calm atmosphere.',
    originalPrice: '6,500',
    price: '4,500',
    buttonText: 'View'
  },
  {
    id: 1,
    image: room1,
    title: 'SROT Prarambh The Beginning King Room',
    desc: 'Relax in our Himalayan View Room at Meraki Living with wooden interiors comfortable furnishings and peaceful surroundings Enjoy fresh mountain air Himalayan views and a cozy atmosphere designed for restful stays Whether you are travelling for leisure or seeking quiet moments this room offers comfort charm and a refreshing mountain experience',
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

  return {
    mainName: clean,
    subtitle: '',
    roomType: ''
  };
}

function Rooms({ setCurrentPage }) {
  const { rooms } = useRooms(ROOMS_DATA);

  const handleViewRoom = (roomId) => {
    if (setCurrentPage) {
      setCurrentPage('room-details', roomId);
    }
  };

  return (
    <section className="rooms-section" aria-label="Stay in Timeless Comfort">
      <div className="rooms-container">
        <div className="rooms-header reveal-fade-up">
          <h2 className="rooms-title">Stay in Timeless Comfort</h2>
          <p className="rooms-subtitle">
            Discover thoughtfully designed rooms at Meraki Living, where modern comfort, peaceful interiors, and breathtaking Himalayan surroundings create the perfect mountain escape.
          </p>
        </div>

        <div className="rooms-grid reveal-stagger">
          {rooms.map((room) => {
            const titleData = parseRoomTitle(room.title);
            return (
              <article className="room-card" key={room.id}>
                <div className="room-image-box">
                  <OptimizedImage
                    src={room.image}
                    alt={titleData.mainName || room.title}
                    width="640"
                    height="480"
                    loading="lazy"
                    decoding="async"
                    noWrapper={true}
                  />
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
                      onClick={() => handleViewRoom(Number(room.id))}
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