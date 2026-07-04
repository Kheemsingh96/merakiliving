// src/Pages/Booking/Booking.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar01Icon,
  UserGroupIcon,
  BedIcon,
  WhatsappIcon,
  CallIcon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  PlusSignIcon,
  MinusSignIcon,
  Edit02Icon,
  ArrowLeft02Icon,
  StarIcon,
  MapPinIcon,
  ViewIcon
} from 'hugeicons-react';
import './Booking.css';

import room1 from '../../assets/images/room-1.png';
import room2 from '../../assets/images/room-2.png';
import room3 from '../../assets/images/room-3.png';

const roomsData = [
  {
    id: 1,
    tag: 'Mountain View',
    image: room1,
    title: 'Himalayan View Room',
    desc: 'Peaceful mountain-facing room designed for couples and relaxing escapes.',
    price: '3,500',
    rating: 4.9,
    reviews: 128,
    guests: '2 Guests',
    bed: 'King Bed',
    view: 'Mountain View',
    size: '280 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Breakfast Included', 'Room Heater'],
    gallery: [room1, room1, room1, room1]
  },
  {
    id: 2,
    tag: 'Valley Surroundings',
    image: room2,
    title: 'Premium Valley Room',
    desc: 'Elegant room with cozy interiors and beautiful valley surroundings.',
    price: '4,500',
    rating: 4.8,
    reviews: 96,
    guests: '2 Guests',
    bed: 'Queen Bed',
    view: 'Private Sitting Area',
    size: '320 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Breakfast Included', 'Balcony'],
    gallery: [room2, room2, room2, room2]
  },
  {
    id: 3,
    tag: 'Family Comfort',
    image: room3,
    title: 'Luxury Family Suite',
    desc: 'Spacious comfort designed for families and memorable mountain stays.',
    price: '6,000',
    rating: 5.0,
    reviews: 84,
    guests: '4 Guests',
    bed: 'Premium Room',
    view: 'Extra Space',
    size: '450 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Breakfast Included', 'Kitchenette'],
    gallery: [room3, room3, room3, room3]
  }
];

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const Booking = ({ setCurrentPage }) => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [selectedThumb, setSelectedThumb] = useState({});
  const [activePopup, setActivePopup] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(null);

  const storedCheckIn = sessionStorage.getItem('meraki_checkIn');
  const storedCheckOut = sessionStorage.getItem('meraki_checkOut');
  const storedGuests = sessionStorage.getItem('meraki_guests');

  const defaultCheckIn = storedCheckIn ? new Date(storedCheckIn) : new Date();
  const defaultCheckOut = storedCheckOut ? new Date(storedCheckOut) : new Date(new Date().setDate(new Date().getDate() + 2));
  const defaultGuests = storedGuests ? JSON.parse(storedGuests) : { adults: 2, children: 0, rooms: 1 };

  const [checkInDate, setCheckInDate] = useState(defaultCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(defaultCheckIn);
  const [guests, setGuests] = useState(defaultGuests);

  const bookingRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bookingRef.current && !bookingRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (checkInDate) sessionStorage.setItem('meraki_checkIn', checkInDate.toISOString());
    if (checkOutDate) sessionStorage.setItem('meraki_checkOut', checkOutDate.toISOString());
    sessionStorage.setItem('meraki_guests', JSON.stringify(guests));
  }, [checkInDate, checkOutDate, guests]);

  const formatDate = (date) => {
    if (!date) return "Add Dates";
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ (\d{4})$/, ', $1');
  };

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diff = checkOutDate - checkInDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getTotalPrice = (pricePerNight) => {
    const nights = getNights();
    const price = parseInt(pricePerNight.replace(/,/g, ''));
    return (price * nights).toLocaleString('en-IN');
  };

  const handleGuestChange = (type, operation) => {
    setGuests(prev => {
      let newGuests = { ...prev };
      if (operation === 'add') {
        newGuests[type] = prev[type] + 1;
      } else {
        if (type === 'adults' && prev.adults <= 1) return prev;
        if (type === 'children' && prev.children <= 0) return prev;
        if (type === 'rooms' && prev.rooms <= 1) return prev;
        newGuests[type] = prev[type] - 1;
      }
      if (type === 'adults') {
        newGuests.rooms = Math.max(newGuests.rooms, Math.ceil(newGuests.adults / 3));
      }
      return newGuests;
    });
  };

  const handleReserve = (room) => {
    setShowConfirmModal(room);
  };

  const confirmReserve = (room) => {
    const inDate = checkInDate ? formatDate(checkInDate) : 'TBD';
    const outDate = checkOutDate ? formatDate(checkOutDate) : 'TBD';
    const guestStr = `${guests.adults + guests.children} Guests`;
    const nights = getNights();
    const totalPrice = getTotalPrice(room.price);
    const message = encodeURIComponent(
      `Hi Meraki Living! 👋\n\nI want to book the *${room.title}*\n` +
      `📅 Check-in: ${inDate}\n` +
      `📅 Check-out: ${outDate}\n` +
      `🌙 Nights: ${nights}\n` +
      `👥 ${guestStr}\n` +
      `🏠 Rooms: ${guests.rooms}\n` +
      `💰 Total: ₹${totalPrice}\n\n` +
      `Please confirm availability. Thank you!`
    );
    window.open(`https://wa.me/917037189517?text=${message}`, '_blank');
    setShowConfirmModal(null);
  };

  const handleViewDetails = (room) => {
    setActiveRoom(activeRoom === room.id ? null : room.id);
  };

  const handleThumbClick = (roomId, thumbIndex) => {
    setSelectedThumb({ ...selectedThumb, [roomId]: thumbIndex });
  };

  const renderCalendar = (alignRight = false) => {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < today;
      let isSelected = false;
      let isInRange = false;
      let isCheckIn = false;
      let isCheckOut = false;

      if (checkInDate && date.getTime() === checkInDate.getTime()) { isSelected = true; isCheckIn = true; }
      if (checkOutDate && date.getTime() === checkOutDate.getTime()) { isSelected = true; isCheckOut = true; }
      if (checkInDate && checkOutDate && date > checkInDate && date < checkOutDate) isInRange = true;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''} ${isCheckIn ? 'check-in' : ''} ${isCheckOut ? 'check-out' : ''}`}
          onClick={() => {
            if (isPast) return;
            if (activePopup === 'checkIn') {
              setCheckInDate(date);
              if (checkOutDate && date >= checkOutDate) setCheckOutDate(null);
              setActivePopup('checkOut');
            } else if (activePopup === 'checkOut') {
              if (checkInDate && date <= checkInDate) {
                setCheckInDate(date);
              } else {
                setCheckOutDate(date);
                setActivePopup(null);
              }
            }
          }}
        >
          {day}
        </div>
      );
    }

    return (
      <div className={`dropdown-popup ${alignRight ? 'dropdown-right' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="calendar-header">
          <button
            className="calendar-nav-btn"
            onClick={(e) => { e.stopPropagation(); setCurrentCalendarMonth(new Date(year, month - 1, 1)); }}
          >
            <ArrowLeft01Icon size={20} />
          </button>
          <div className="calendar-title">{monthNames[month]} {year}</div>
          <button
            className="calendar-nav-btn"
            onClick={(e) => { e.stopPropagation(); setCurrentCalendarMonth(new Date(year, month + 1, 1)); }}
          >
            <ArrowRight01Icon size={20} />
          </button>
        </div>
        <div className="calendar-days-header">
          {dayNames.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>
    );
  };

  const renderGuestsDropdown = () => (
    <div className="dropdown-popup guests-popup" onClick={(e) => e.stopPropagation()}>
      <div className="guest-row">
        <div className="guest-info">
          <span className="guest-type">Adults</span>
          <span className="guest-desc">Age 13+</span>
        </div>
        <div className="guest-controls">
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('adults', 'subtract'); }} disabled={guests.adults <= 1}><MinusSignIcon size={16} /></button>
          <span className="guest-count">{guests.adults}</span>
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('adults', 'add'); }}><PlusSignIcon size={16} /></button>
        </div>
      </div>
      <div className="guest-row">
        <div className="guest-info">
          <span className="guest-type">Children</span>
          <span className="guest-desc">Ages 2-12</span>
        </div>
        <div className="guest-controls">
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('children', 'subtract'); }} disabled={guests.children <= 0}><MinusSignIcon size={16} /></button>
          <span className="guest-count">{guests.children}</span>
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('children', 'add'); }}><PlusSignIcon size={16} /></button>
        </div>
      </div>
      <div className="guest-row">
        <div className="guest-info">
          <span className="guest-type">Rooms</span>
          <span className="guest-desc">Number of rooms</span>
        </div>
        <div className="guest-controls">
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('rooms', 'subtract'); }} disabled={guests.rooms <= 1}><MinusSignIcon size={16} /></button>
          <span className="guest-count">{guests.rooms}</span>
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('rooms', 'add'); }}><PlusSignIcon size={16} /></button>
        </div>
      </div>
      <div className="guest-row guest-done">
        <button className="guest-done-btn" onClick={() => setActivePopup(null)}>Done</button>
      </div>
    </div>
  );

  const nights = getNights();

  return (
    <section className="booking-section">
      <div className="booking-container">

        {/* Back Navigation */}
        <div className="booking-nav">
          <button className="booking-back-btn" onClick={() => setCurrentPage && setCurrentPage('home')}>
            <ArrowLeft02Icon size={18} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="booking-search-wrapper">
          <div className="booking-search-bar" ref={bookingRef}>

            <div
              className={`booking-search-item ${activePopup === 'checkIn' ? 'active' : ''}`}
              onClick={() => setActivePopup(activePopup === 'checkIn' ? null : 'checkIn')}
            >
              <div className="booking-search-icon">
                <Calendar01Icon size={22} variant="stroke" />
              </div>
              <div className="booking-search-info">
                <span className="booking-search-label">Check-in</span>
                <span className="booking-search-value">{formatDate(checkInDate)}</span>
              </div>
              {activePopup === 'checkIn' && renderCalendar(false)}
            </div>

            <div className="booking-search-divider"></div>

            <div
              className={`booking-search-item ${activePopup === 'checkOut' ? 'active' : ''}`}
              onClick={() => setActivePopup(activePopup === 'checkOut' ? null : 'checkOut')}
            >
              <div className="booking-search-icon">
                <Calendar01Icon size={22} variant="stroke" />
              </div>
              <div className="booking-search-info">
                <span className="booking-search-label">Check-out</span>
                <span className="booking-search-value">{formatDate(checkOutDate)}</span>
              </div>
              {activePopup === 'checkOut' && renderCalendar(true)}
            </div>

            <div className="booking-search-divider"></div>

            <div
              className={`booking-search-item ${activePopup === 'guests' ? 'active' : ''}`}
              onClick={() => setActivePopup(activePopup === 'guests' ? null : 'guests')}
            >
              <div className="booking-search-icon">
                <UserGroupIcon size={22} variant="stroke" />
              </div>
              <div className="booking-search-info">
                <span className="booking-search-label">Guests & Rooms</span>
                <span className="booking-search-value">{guests.adults + guests.children} Guests, {guests.rooms} Room{guests.rooms > 1 ? 's' : ''}</span>
              </div>
              {activePopup === 'guests' && renderGuestsDropdown()}
            </div>

            <button className="booking-edit-btn" onClick={() => setActivePopup(null)}>
              <Edit02Icon size={18} />
              <span>Update</span>
            </button>

          </div>
        </div>

        {/* Results Header */}
        <div className="booking-results-header">
          <h2 className="booking-results-title">Available Rooms</h2>
          <p className="booking-results-subtitle">
            {nights > 0 ? `${nights} nights stay` : 'Select dates to see prices'}
            <span className="results-dot">•</span>
            {guests.adults + guests.children} guests
          </p>
        </div>

        <div className="booking-layout">
          <div className="booking-rooms">
            {roomsData.map((room) => (
              <div className="booking-room-card" key={room.id}>
                <div className="booking-room-gallery">
                  <div className="booking-room-main-image">
                    <img
                      src={selectedThumb[room.id] !== undefined ? room.gallery[selectedThumb[room.id]] : room.image}
                      alt={room.title}
                      loading="lazy"
                    />
                    <div className="booking-room-tag">{room.tag}</div>
                    <div className="booking-room-rating">
                      <StarIcon size={14} />
                      <span>{room.rating}</span>
                      <span className="rating-count">({room.reviews})</span>
                    </div>
                  </div>
                  <div className="booking-room-thumbs">
                    {room.gallery.map((thumb, idx) => (
                      <div
                        className={`booking-room-thumb ${selectedThumb[room.id] === idx ? 'active' : ''}`}
                        key={idx}
                        onClick={() => handleThumbClick(room.id, idx)}
                      >
                        <img src={thumb} alt={`${room.title} ${idx + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="booking-room-details">
                  <div className="booking-room-header">
                    <h3 className="booking-room-title">{room.title}</h3>
                    <div className="booking-room-size">
                      <MapPinIcon size={14} />
                      <span>{room.size}</span>
                    </div>
                  </div>
                  <p className="booking-room-desc">{room.desc}</p>
                  <div className="booking-room-meta">
                    <div className="booking-meta-item">
                      <UserGroupIcon size={16} variant="stroke" />
                      <span>{room.guests}</span>
                    </div>
                    <div className="booking-meta-item">
                      <BedIcon size={16} variant="stroke" />
                      <span>{room.bed}</span>
                    </div>
                    <div className="booking-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      <span>{room.view}</span>
                    </div>
                  </div>
                  <div className="booking-room-amenities">
                    {room.amenities.slice(0, 4).map((amenity, idx) => (
                      <div className="booking-amenity-tag" key={idx}>
                        <CheckmarkCircle01Icon size={14} />
                        <span>{amenity}</span>
                      </div>
                    ))}
                    {room.amenities.length > 4 && (
                      <div className="booking-amenity-tag amenity-more">
                        <span>+{room.amenities.length - 4} more</span>
                      </div>
                    )}
                  </div>

                  {activeRoom === room.id && (
                    <div className="booking-room-expanded">
                      <div className="expanded-divider"></div>
                      <h4 className="expanded-title">All Amenities</h4>
                      <div className="expanded-amenities">
                        {room.amenities.map((amenity, idx) => (
                          <div className="expanded-amenity-item" key={idx}>
                            <CheckmarkCircle01Icon size={16} />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="booking-room-footer">
                    <div className="booking-room-price">
                      <div className="booking-price-main">
                        <span className="booking-price-amount">₹{room.price}</span>
                        <span className="booking-price-unit">/ Night</span>
                      </div>
                      {nights > 0 && (
                        <div className="booking-price-total">
                          <span>₹{getTotalPrice(room.price)} total</span>
                          <span className="total-nights">for {nights} night{nights > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    <div className="booking-room-actions">
                      <button
                        className="booking-btn-secondary"
                        onClick={() => handleViewDetails(room)}
                      >
                        <ViewIcon size={16} />
                        <span>{activeRoom === room.id ? 'Hide Details' : 'View Details'}</span>
                      </button>
                      <button
                        className="booking-btn-primary"
                        onClick={() => handleReserve(room)}
                      >
                        <span>Book Now</span>
                        <ArrowRight01Icon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="booking-sidebar">
            <div className="booking-help-card">
              <div className="booking-help-icon">
                <CallIcon size={28} variant="stroke" />
              </div>
              <h4 className="booking-help-title">Need Help?</h4>
              <p className="booking-help-text">Our team can help you find the perfect room for your mountain stay.</p>
              <div className="booking-help-actions">
                <a
                  href="https://wa.me/917037189517?text=Hi%20Meraki%20Living!%20I%20need%20help%20choosing%20a%20room."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="booking-help-btn-primary"
                >
                  <WhatsappIcon size={18} />
                  <span>WhatsApp Us</span>
                </a>
                <a
                  href="tel:+917037189517"
                  className="booking-help-btn-secondary"
                >
                  <CallIcon size={18} variant="stroke" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="booking-modal-overlay" onClick={() => setShowConfirmModal(null)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Your Booking Request</h3>
              <p>Review your stay details before sending</p>
            </div>
            <div className="modal-body">
              <div className="modal-room-info">
                <h4>{showConfirmModal.title}</h4>
                <span className="modal-tag">{showConfirmModal.tag}</span>
              </div>
              <div className="modal-details">
                <div className="modal-detail-row">
                  <Calendar01Icon size={18} />
                  <div>
                    <span className="detail-label">Check-in</span>
                    <span className="detail-value">{formatDate(checkInDate)}</span>
                  </div>
                </div>
                <div className="modal-detail-row">
                  <Calendar01Icon size={18} />
                  <div>
                    <span className="detail-label">Check-out</span>
                    <span className="detail-value">{formatDate(checkOutDate)}</span>
                  </div>
                </div>
                <div className="modal-detail-row">
                  <UserGroupIcon size={18} />
                  <div>
                    <span className="detail-label">Guests</span>
                    <span className="detail-value">{guests.adults + guests.children} Guests, {guests.rooms} Room{guests.rooms > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="modal-detail-row">
                  <BedIcon size={18} />
                  <div>
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{nights} Night{nights > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div className="modal-price">
                <span className="modal-price-label">Estimated Total</span>
                <span className="modal-price-value">₹{getTotalPrice(showConfirmModal.price)}</span>
                <span className="modal-price-note">*Final price may vary based on availability</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn-secondary" onClick={() => setShowConfirmModal(null)}>Cancel</button>
              <button className="modal-btn-primary" onClick={() => confirmReserve(showConfirmModal)}>
                <WhatsappIcon size={18} />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Booking;