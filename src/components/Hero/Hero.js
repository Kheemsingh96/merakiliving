// src/components/Hero/Hero.js
import React, { useState, useEffect, useRef } from 'react';
import { Calendar01Icon, UserGroupIcon, ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon, MinusSignIcon } from 'hugeicons-react';
import './Hero.css';
import hero1 from '../../assets/images/hero1.png';
import hero2 from '../../assets/images/hero2.png';
import hero3 from '../../assets/images/hero3.png';
import hero4 from '../../assets/images/hero4.png';

const slides = [
  {
    image: hero1,
    title: "Where Every Stay Feels Like Home",
    description: "Experience the charm of Uttarakhand at Meraki Living. Wake up to panoramic mountain views, unwind in peaceful surroundings, and enjoy warm hospitality that makes every moment memorable."
  },
  {
    image: hero2,
    title: "Comfort Meets Nature In Every Corner",
    description: "Experience beautifully designed spaces surrounded by the peaceful beauty of Mukteshwar. Relax in comfortable rooms, enjoy fresh mountain air, and discover thoughtful hospitality"
  },
  {
    image: hero3,
    title: "Experience Divine Peace At Mukteshwar Temple",
    description: "Visit the iconic Mukteshwar Temple and embrace its peaceful atmosphere surrounded by the Himalayas. Discover spiritual heritage, scenic beauty, and a sense of tranquility that makes every visit unforgettable."
  },
  {
    image: hero4,
    title: "Explore The Timeless Beauty Of Kausani",
    description: "Known as the Switzerland of India, Kausani offers spectacular Himalayan panoramas, peaceful surroundings, and unforgettable sunrise views, making every visit a truly memorable mountain experience."
  }
];

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const Hero = ({ setCurrentPage }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePopup, setActivePopup] = useState(null);
  
  const storedCheckIn = sessionStorage.getItem('meraki_checkIn');
  const storedCheckOut = sessionStorage.getItem('meraki_checkOut');
  const storedGuests = sessionStorage.getItem('meraki_guests');

  const [checkInDate, setCheckInDate] = useState(storedCheckIn ? new Date(storedCheckIn) : null);
  const [checkOutDate, setCheckOutDate] = useState(storedCheckOut ? new Date(storedCheckOut) : null);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(storedCheckIn ? new Date(storedCheckIn) : new Date());
  const [guests, setGuests] = useState(storedGuests ? JSON.parse(storedGuests) : { adults: 2, children: 0, rooms: 1 });
  
  const bookingRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bookingRef.current && !bookingRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return "Add Dates";
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ (\d{4})$/, ', $1');
  };

  const getGuestString = () => {
    const totalGuests = guests.adults + guests.children;
    return `${totalGuests} Guest${totalGuests > 1 ? 's' : ''}, ${guests.rooms} Room${guests.rooms > 1 ? 's' : ''}`;
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

  const handleSearchClick = () => {
    if (checkInDate) sessionStorage.setItem('meraki_checkIn', checkInDate.toISOString());
    if (checkOutDate) sessionStorage.setItem('meraki_checkOut', checkOutDate.toISOString());
    sessionStorage.setItem('meraki_guests', JSON.stringify(guests));
    setCurrentPage('booking');
  };

  const renderCalendar = () => {
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
      
      if (checkInDate && date.getTime() === checkInDate.getTime()) isSelected = true;
      if (checkOutDate && date.getTime() === checkOutDate.getTime()) isSelected = true;
      if (checkInDate && checkOutDate && date > checkInDate && date < checkOutDate) isInRange = true;

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`}
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
      <div className="dropdown-popup" onClick={(e) => e.stopPropagation()}>
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
    </div>
  );

  return (
    <section className="hero-section">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-bg ${index === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        ></div>
      ))}
      
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <div className="hero-text-wrapper" key={activeIndex}>
          <h1 className="hero-title">{slides[activeIndex].title}</h1>
          <p className="hero-description">{slides[activeIndex].description}</p>
        </div>
        <button className="hero-btn" onClick={handleSearchClick}>Explore Rooms</button>
      </div>

      <div className="hero-booking-container">
        <div className="hero-booking-bar" ref={bookingRef}>
          
          <div className={`booking-item ${activePopup === 'checkIn' ? 'active-item' : ''}`} onClick={() => setActivePopup(activePopup === 'checkIn' ? null : 'checkIn')}>
            <div className="booking-icon-wrapper">
              <Calendar01Icon className="booking-icon" size={24} variant="stroke" />
            </div>
            <div className="booking-info">
              <span className="booking-label">Check In</span>
              <span className={`booking-value ${checkInDate ? 'selected-text' : ''}`}>{formatDate(checkInDate)}</span>
            </div>
            {activePopup === 'checkIn' && renderCalendar()}
          </div>
          
          <div className="booking-divider"></div>
          
          <div className={`booking-item ${activePopup === 'checkOut' ? 'active-item' : ''}`} onClick={() => setActivePopup(activePopup === 'checkOut' ? null : 'checkOut')}>
            <div className="booking-icon-wrapper">
              <Calendar01Icon className="booking-icon" size={24} variant="stroke" />
            </div>
            <div className="booking-info">
              <span className="booking-label">Check Out</span>
              <span className={`booking-value ${checkOutDate ? 'selected-text' : ''}`}>{formatDate(checkOutDate)}</span>
            </div>
            {activePopup === 'checkOut' && renderCalendar()}
          </div>
          
          <div className="booking-divider"></div>
          
          <div className={`booking-item ${activePopup === 'guests' ? 'active-item' : ''}`} onClick={() => setActivePopup(activePopup === 'guests' ? null : 'guests')}>
            <div className="booking-icon-wrapper">
              <UserGroupIcon className="booking-icon" size={24} variant="stroke" />
            </div>
            <div className="booking-info">
              <span className="booking-label">Guests & Rooms</span>
              <span className="booking-value selected-text">{getGuestString()}</span>
            </div>
            {activePopup === 'guests' && renderGuestsDropdown()}
          </div>
          
          <button className="booking-search-btn" onClick={handleSearchClick}>Search</button>
        </div>
      </div>

      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;