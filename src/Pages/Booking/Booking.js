import React, { useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  UserMultiple02Icon,
  BedDoubleIcon,
  Call02Icon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  PlusSignIcon,
  MinusSignIcon,
  Edit02Icon,
  ArrowLeft02Icon,
  MapPinIcon,
  ViewIcon,
  MountainIcon,
  ArmchairIcon
} from '@hugeicons/core-free-icons';
import { FaWhatsapp } from 'react-icons/fa';
import './Booking.css';

import room1 from '../../assets/images/room-1.webp';
import room2 from '../../assets/images/room-2.webp';
import room3 from '../../assets/images/room-3.webp';

const roomsData = [
  {
    id: 1,
    image: room1,
    title: 'Himalayan View Room',
    desc: 'Relax in our Himalayan View Room at Meraki Living, featuring cozy interiors, modern comfort, fresh mountain air, and breathtaking Himalayan views.',
    price: '3,500',
    originalPrice: '4,500',
    discount: '22',
    guests: '2 Guests',
    bed: 'King Bed',
    view: 'Mountain View',
    size: '280 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Breakfast Included', 'Room Heater'],
    gallery: [room1, room1, room1, room1]
  },
  {
    id: 2,
    image: room2,
    title: 'Premium Valley Room',
    desc: 'Enjoy our Premium Valley Room at Meraki Living, featuring elegant interiors, peaceful valley views, fresh mountain air, and a cozy relaxing atmosphere.',
    price: '4,500',
    originalPrice: '5,800',
    discount: '22',
    guests: '2 Guests',
    bed: 'Queen Bed',
    view: 'Private Sitting Area',
    size: '320 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Breakfast Included', 'Balcony'],
    gallery: [room2, room2, room2, room2]
  },
  {
    id: 3,
    image: room3,
    title: 'Luxury Family Suite',
    desc: 'Enjoy our Luxury Family Suite at Meraki Living, featuring spacious interiors, premium comfort, modern amenities, and a peaceful mountain atmosphere perfect for families.',
    price: '6,000',
    originalPrice: '7,500',
    discount: '20',
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
  const [selectedThumb, setSelectedThumb] = useState({});
  const [activePopup, setActivePopup] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState({});

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

  const handleBookNow = (room) => {
    const nights = getNights();
    const price = parseInt(room.price.replace(/,/g, ''));
    const totalPrice = price * nights * guests.rooms;
    const bookingData = {
      roomId: room.id,
      roomTitle: room.title,
      roomPrice: room.price,
      roomOriginalPrice: room.originalPrice,
      roomDiscount: room.discount,
      nights: nights,
      rooms: guests.rooms,
      adults: guests.adults,
      children: guests.children,
      checkIn: checkInDate ? checkInDate.toISOString() : null,
      checkOut: checkOutDate ? checkOutDate.toISOString() : null,
      totalAmount: totalPrice
    };
    sessionStorage.setItem('meraki_booking', JSON.stringify(bookingData));
    if (setCurrentPage) {
      setCurrentPage('guest-details', room.id);
    }
  };

  const handleThumbClick = (roomId, thumbIndex) => {
    setSelectedThumb({ ...selectedThumb, [roomId]: thumbIndex });
  };

  const toggleDesc = (roomId) => {
    setExpandedDesc(prev => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const getRoomViewIcon = (view) => {
    if (view.includes('Mountain')) return MountainIcon;
    if (view.includes('Sitting')) return ArmchairIcon;
    return ViewIcon;
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
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </button>
          <div className="calendar-title">{monthNames[month]} {year}</div>
          <button
            className="calendar-nav-btn"
            onClick={(e) => { e.stopPropagation(); setCurrentCalendarMonth(new Date(year, month + 1, 1)); }}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
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
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('adults', 'subtract'); }} disabled={guests.adults <= 1}><HugeiconsIcon icon={MinusSignIcon} size={16} /></button>
          <span className="guest-count">{guests.adults}</span>
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('adults', 'add'); }}><HugeiconsIcon icon={PlusSignIcon} size={16} /></button>
        </div>
      </div>
      <div className="guest-row">
        <div className="guest-info">
          <span className="guest-type">Children</span>
          <span className="guest-desc">Ages 2-12</span>
        </div>
        <div className="guest-controls">
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('children', 'subtract'); }} disabled={guests.children <= 0}><HugeiconsIcon icon={MinusSignIcon} size={16} /></button>
          <span className="guest-count">{guests.children}</span>
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('children', 'add'); }}><HugeiconsIcon icon={PlusSignIcon} size={16} /></button>
        </div>
      </div>
      <div className="guest-row">
        <div className="guest-info">
          <span className="guest-type">Rooms</span>
          <span className="guest-desc">Number of rooms</span>
        </div>
        <div className="guest-controls">
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('rooms', 'subtract'); }} disabled={guests.rooms <= 1}><HugeiconsIcon icon={MinusSignIcon} size={16} /></button>
          <span className="guest-count">{guests.rooms}</span>
          <button className="guest-btn" onClick={(e) => { e.stopPropagation(); handleGuestChange('rooms', 'add'); }}><HugeiconsIcon icon={PlusSignIcon} size={16} /></button>
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

        <div className="booking-nav">
          <button className="booking-back-btn" onClick={() => setCurrentPage && setCurrentPage('home')}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="booking-search-wrapper">
          <div className="booking-search-bar" ref={bookingRef}>

            <div
              className={`booking-search-item ${activePopup === 'checkIn' ? 'active' : ''}`}
              onClick={() => setActivePopup(activePopup === 'checkIn' ? null : 'checkIn')}
            >
              <div className="booking-search-icon">
                <HugeiconsIcon icon={Calendar01Icon} size={22} variant="stroke" />
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
                <HugeiconsIcon icon={Calendar01Icon} size={22} variant="stroke" />
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
                <HugeiconsIcon icon={UserMultiple02Icon} size={22} variant="stroke" />
              </div>
              <div className="booking-search-info">
                <span className="booking-search-label">Guests & Rooms</span>
                <span className="booking-search-value">{guests.adults + guests.children} Guests, {guests.rooms} Room{guests.rooms > 1 ? 's' : ''}</span>
              </div>
              {activePopup === 'guests' && renderGuestsDropdown()}
            </div>

            <button className="booking-edit-btn" onClick={() => setActivePopup(null)}>
              <HugeiconsIcon icon={Edit02Icon} size={18} />
              <span>Update</span>
            </button>

          </div>
        </div>

        <div className="booking-results-header">
          <h2 className="booking-results-title">Available Rooms</h2>
          <p className="booking-results-subtitle">
            {nights > 0 ? `${nights} Nights Stay` : 'Select dates to see prices'}
            <span className="results-dot">&#8226;</span>
            {guests.adults + guests.children} Guests
            {guests.rooms > 1 && (
              <>
                <span className="results-dot">&#8226;</span>
                {guests.rooms} Rooms
              </>
            )}
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
                      <HugeiconsIcon icon={MapPinIcon} size={14} />
                      <span>{room.size}</span>
                    </div>
                  </div>
                  <div className="booking-room-desc-wrapper">
                    <p className={`booking-room-desc ${expandedDesc[room.id] ? 'expanded' : ''}`}>
                      {room.desc}
                    </p>
                    <span className="view-more-btn" onClick={() => toggleDesc(room.id)}>
                      {expandedDesc[room.id] ? 'Read Less' : 'Read More'}
                    </span>
                  </div>
                  <div className="booking-room-meta">
                    <div className="booking-meta-item">
                      <HugeiconsIcon icon={UserMultiple02Icon} size={16} variant="stroke" />
                      <span>{room.guests}</span>
                    </div>
                    <div className="booking-meta-item">
                      <HugeiconsIcon icon={BedDoubleIcon} size={16} variant="stroke" />
                      <span>{room.bed}</span>
                    </div>
                    <div className="booking-meta-item">
                      <HugeiconsIcon icon={getRoomViewIcon(room.view)} size={16} variant="stroke" />
                      <span>{room.view}</span>
                    </div>
                  </div>
                  <div className="booking-room-amenities">
                    {room.amenities.map((amenity, idx) => (
                      <div className="booking-amenity-tag" key={idx}>
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="booking-room-footer">
                    <div className="booking-room-price">
                      <span className="booking-price-amount">&#8377;{room.price}</span>
                      <span className="booking-price-original">&#8377;{room.originalPrice}</span>
                      <span className="booking-price-discount">{room.discount}% OFF</span>
                    </div>
                    <button
                      className="booking-btn-primary"
                      onClick={() => handleBookNow(room)}
                    >
                      <span>Book Now</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="booking-sidebar">
            <div className="booking-help-card">
              <div className="booking-help-icon">
                <HugeiconsIcon icon={Call02Icon} size={28} variant="stroke" />
              </div>
              <h4 className="booking-help-title">Need Help?</h4>
              <p className="booking-help-text">Our team can help you find the perfect room for your mountain stay.</p>
              <div className="booking-help-actions">
                <a
                  href="https://wa.me/919456103445?text=Hi%20Meraki%20Living!%20I%20need%20help%20choosing%20a%20room."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="booking-help-btn-primary"
                >
                  <FaWhatsapp size={18} />
                  <span>WhatsApp Us</span>
                </a>
                <a
                  href="tel:+919456103445"
                  className="booking-help-btn-secondary"
                >
                  <HugeiconsIcon icon={Call02Icon} size={18} variant="stroke" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;