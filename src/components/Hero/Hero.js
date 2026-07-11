import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar01Icon, UserGroupIcon, ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon, MinusSignIcon } from 'hugeicons-react';
import './Hero.css';
import hero1 from '../../assets/images/hero1.png';
import hero2 from '../../assets/images/hero2.png';
import hero3 from '../../assets/images/hero3.png';
import hero4 from '../../assets/images/hero4.png';

const SLIDES = [
  {
    image: hero1,
    title: 'Where Every Stay Feels Like Home',
    description: 'Experience the charm of Uttarakhand at Meraki Living. Wake up to panoramic mountain views, unwind in peaceful surroundings, and enjoy warm hospitality that makes every moment memorable.',
  },
  {
    image: hero2,
    title: 'Comfort Meets Nature In Every Corner',
    description: 'Experience beautifully designed spaces surrounded by the peaceful beauty of Mukteshwar. Relax in comfortable rooms, enjoy fresh mountain air, and discover thoughtful hospitality.',
  },
  {
    image: hero3,
    title: 'Experience Divine Peace At Mukteshwar Temple',
    description: 'Visit the iconic Mukteshwar Temple and embrace its peaceful atmosphere surrounded by the Himalayas. Discover spiritual heritage, scenic beauty, and a sense of tranquility that makes every visit unforgettable.',
  },
  {
    image: hero4,
    title: 'Explore The Timeless Beauty Of Kausani',
    description: 'Known as the Switzerland of India, Kausani offers spectacular Himalayan panoramas, peaceful surroundings, and unforgettable sunrise views, making every visit a truly memorable mountain experience.',
  },
];

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const getStoredDate = (key) => {
  const raw = sessionStorage.getItem(key);
  return raw ? new Date(raw) : null;
};

const getStoredGuests = () => {
  try {
    const raw = sessionStorage.getItem('meraki_guests');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const formatDate = (date) => {
  if (!date) return 'Add Dates';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ (\d{4})$/, ', $1');
};

const getGuestString = (guests) => {
  const total = guests.adults + guests.children;
  return `${total} Guest${total > 1 ? 's' : ''}, ${guests.rooms} Room${guests.rooms > 1 ? 's' : ''}`;
};

function Hero({ setCurrentPage }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePopup, setActivePopup] = useState(null);
  const [checkInDate, setCheckInDate] = useState(() => getStoredDate('meraki_checkIn'));
  const [checkOutDate, setCheckOutDate] = useState(() => getStoredDate('meraki_checkOut'));
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(() => getStoredDate('meraki_checkIn') || new Date());
  const [guests, setGuests] = useState(() => getStoredGuests() || { adults: 2, children: 0, rooms: 1 });

  const bookingRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bookingRef.current && !bookingRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGuestChange = useCallback((type, operation) => {
    setGuests((prev) => {
      let next = { ...prev };
      if (operation === 'add') {
        next[type] = prev[type] + 1;
      } else {
        if (type === 'adults' && prev.adults <= 1) return prev;
        if (type === 'children' && prev.children <= 0) return prev;
        if (type === 'rooms' && prev.rooms <= 1) return prev;
        next[type] = prev[type] - 1;
      }
      if (type === 'adults') {
        next.rooms = Math.max(next.rooms, Math.ceil(next.adults / 3));
      }
      return next;
    });
  }, []);

  const handleSearchClick = useCallback(() => {
    if (checkInDate) sessionStorage.setItem('meraki_checkIn', checkInDate.toISOString());
    if (checkOutDate) sessionStorage.setItem('meraki_checkOut', checkOutDate.toISOString());
    sessionStorage.setItem('meraki_guests', JSON.stringify(guests));
    if (setCurrentPage) setCurrentPage('booking');
  }, [checkInDate, checkOutDate, guests, setCurrentPage]);

  const handleNavClick = useCallback((page) => {
    setActivePopup(null);
    if (setCurrentPage) setCurrentPage(page);
  }, [setCurrentPage]);

  const handleDotClick = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const handlePopupToggle = useCallback((popup) => {
    setActivePopup((prev) => (prev === popup ? null : popup));
  }, []);

  const handleCalendarNav = useCallback((direction) => {
    setCurrentCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  }, []);

  const handleDayClick = useCallback((date, isPast) => {
    if (isPast) return;
    if (activePopup === 'checkIn') {
      setCheckInDate(date);
      setCheckOutDate((prev) => (prev && date >= prev ? null : prev));
      setActivePopup('checkOut');
    } else if (activePopup === 'checkOut') {
      setCheckInDate((prev) => {
        if (prev && date <= prev) return date;
        return prev;
      });
      if (checkInDate && date > checkInDate) {
        setCheckOutDate(date);
        setActivePopup(null);
      }
    }
  }, [activePopup, checkInDate]);

  const renderCalendar = useCallback(() => {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`e${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < today;
      const isSelected = (checkInDate && date.getTime() === checkInDate.getTime()) || (checkOutDate && date.getTime() === checkOutDate.getTime());
      const isInRange = checkInDate && checkOutDate && date > checkInDate && date < checkOutDate;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`}
          onClick={() => handleDayClick(date, isPast)}
          role="button"
          tabIndex={isPast ? -1 : 0}
          aria-label={date.toDateString()}
          aria-disabled={isPast}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="dropdown-popup" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Calendar">
        <div className="calendar-header">
          <button className="calendar-nav-btn" onClick={(e) => { e.stopPropagation(); handleCalendarNav(-1); }} aria-label="Previous month" type="button">
            <ArrowLeft01Icon size={20} />
          </button>
          <div className="calendar-title">{MONTH_NAMES[month]} {year}</div>
          <button className="calendar-nav-btn" onClick={(e) => { e.stopPropagation(); handleCalendarNav(1); }} aria-label="Next month" type="button">
            <ArrowRight01Icon size={20} />
          </button>
        </div>
        <div className="calendar-days-header">
          {DAY_NAMES.map((day) => <div key={day}>{day}</div>)}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>
    );
  }, [currentCalendarMonth, checkInDate, checkOutDate, handleCalendarNav, handleDayClick]);

  const renderGuestsDropdown = useCallback(() => (
    <div className="dropdown-popup guests-popup" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Guest selection">
      {[
        { key: 'adults', label: 'Adults', desc: 'Age 13+', min: 1 },
        { key: 'children', label: 'Children', desc: 'Ages 2-12', min: 0 },
        { key: 'rooms', label: 'Rooms', desc: 'Number of rooms', min: 1 },
      ].map(({ key, label, desc, min }) => (
        <div className="guest-row" key={key}>
          <div className="guest-info">
            <span className="guest-type">{label}</span>
            <span className="guest-desc">{desc}</span>
          </div>
          <div className="guest-controls">
            <button
              className="guest-btn"
              onClick={(e) => { e.stopPropagation(); handleGuestChange(key, 'subtract'); }}
              disabled={guests[key] <= min}
              aria-label={`Decrease ${label}`}
              type="button"
            >
              <MinusSignIcon size={16} />
            </button>
            <span className="guest-count" aria-live="polite">{guests[key]}</span>
            <button
              className="guest-btn"
              onClick={(e) => { e.stopPropagation(); handleGuestChange(key, 'add'); }}
              aria-label={`Increase ${label}`}
              type="button"
            >
              <PlusSignIcon size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  ), [guests, handleGuestChange]);

  const activeSlide = SLIDES[activeIndex];

  return (
    <section className="hero-section" aria-label="Hero Banner">
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`hero-bg ${index === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
          role="img"
          aria-label={slide.title}
        />
      ))}

      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-text-wrapper" key={activeIndex}>
          <h1 className="hero-title">{activeSlide.title}</h1>
          <p className="hero-description">{activeSlide.description}</p>
        </div>
        <button className="hero-btn" onClick={handleSearchClick} aria-label="Explore available rooms" type="button">
          Explore Rooms
        </button>
      </div>

      <div className="hero-booking-container">
        <div className="hero-booking-bar" ref={bookingRef}>
          <div className={`booking-item ${activePopup === 'checkIn' ? 'active-item' : ''}`} onClick={() => handlePopupToggle('checkIn')} role="button" tabIndex={0} aria-expanded={activePopup === 'checkIn'} aria-label="Select check-in date">
            <div className="booking-icon-wrapper">
              <Calendar01Icon className="booking-icon" size={24} variant="stroke" aria-hidden="true" />
            </div>
            <div className="booking-info">
              <span className="booking-label">Check In</span>
              <span className={`booking-value ${checkInDate ? 'selected-text' : ''}`}>{formatDate(checkInDate)}</span>
            </div>
            {activePopup === 'checkIn' && renderCalendar()}
          </div>

          <div className="booking-divider" aria-hidden="true" />

          <div className={`booking-item ${activePopup === 'checkOut' ? 'active-item' : ''}`} onClick={() => handlePopupToggle('checkOut')} role="button" tabIndex={0} aria-expanded={activePopup === 'checkOut'} aria-label="Select check-out date">
            <div className="booking-icon-wrapper">
              <Calendar01Icon className="booking-icon" size={24} variant="stroke" aria-hidden="true" />
            </div>
            <div className="booking-info">
              <span className="booking-label">Check Out</span>
              <span className={`booking-value ${checkOutDate ? 'selected-text' : ''}`}>{formatDate(checkOutDate)}</span>
            </div>
            {activePopup === 'checkOut' && renderCalendar()}
          </div>

          <div className="booking-divider" aria-hidden="true" />

          <div className={`booking-item ${activePopup === 'guests' ? 'active-item' : ''}`} onClick={() => handlePopupToggle('guests')} role="button" tabIndex={0} aria-expanded={activePopup === 'guests'} aria-label="Select guests and rooms">
            <div className="booking-icon-wrapper">
              <UserGroupIcon className="booking-icon" size={24} variant="stroke" aria-hidden="true" />
            </div>
            <div className="booking-info">
              <span className="booking-label">Guests & Rooms</span>
              <span className="booking-value selected-text">{getGuestString(guests)}</span>
            </div>
            {activePopup === 'guests' && renderGuestsDropdown()}
          </div>

          <button className="booking-search-btn" onClick={handleSearchClick} aria-label="Search available rooms" type="button">
            Search
          </button>
        </div>
      </div>

      <div className="hero-dots" role="tablist" aria-label="Slide navigation">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;