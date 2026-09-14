import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { parseRoomTitle } from '../../components/Rooms/Rooms';
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
  ViewIcon,
  MountainIcon,
  ArmchairIcon
} from '@hugeicons/core-free-icons';
import { FaWhatsapp } from 'react-icons/fa';
import './Booking.css';

import room1 from '../../assets/images/room-1.webp';
import room1a from '../../assets/images/room-1a.webp';
import room1b from '../../assets/images/room-1b.webp';
import room1c from '../../assets/images/room-1c.webp';
import room2 from '../../assets/images/room-2.webp';
import room2a from '../../assets/images/room-2a.webp';
import room2b from '../../assets/images/room-2b.webp';
import room2c from '../../assets/images/room-2c.webp';
import room3 from '../../assets/images/room-3.webp';
import room3a from '../../assets/images/room-3a.webp';
import room3b from '../../assets/images/room-3b.webp';
import room3c from '../../assets/images/room-3c.webp';
import room4 from '../../assets/images/room-4.webp';
import room4a from '../../assets/images/room-4a.webp';
import room4b from '../../assets/images/room-4b.webp';
import room4c from '../../assets/images/room-4c.webp';

const roomsData = [
  {
    id: 4,
    image: room4,
    title: 'Entire Homestay',
    desc: 'Book the entire Meraki Living homestay for complete privacy and a memorable stay with your loved ones. Perfect for large groups, family gatherings, or special occasions with exclusive access to all amenities and spaces.',
    price: '22,000',
    originalPrice: '30,000',
    discount: '26',
    guests: '14 Guests',
    bed: 'Multiple Rooms',
    view: 'Panoramic View',
    size: '1200 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Power Backup', 'Kitchen'],
    gallery: [room4, room4a, room4b, room4c]
  },
  {
    id: 3,
    image: room3,
    title: 'Luxury Family Suite',
    desc: 'Enjoy our Luxury Family Suite at Meraki Living, featuring spacious interiors, premium comfort, modern amenities, and a peaceful mountain atmosphere perfect for families.',
    price: '6,000',
    originalPrice: '7,500',
    discount: '20',
    guests: '2 Guests',
    bed: 'Premium Room',
    view: 'Extra Space',
    size: '450 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Power Backup', 'Kitchenette'],
    gallery: [room3, room3a, room3b, room3c]
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
    amenities: ['Free WiFi', 'Free Parking', 'Power Backup', 'Balcony'],
    gallery: [room2, room2a, room2b, room2c]
  },
  {
    id: 1,
    image: room1,
    title: 'Himalayan View Room',
    desc: 'Relax in our Himalayan View Room at Meraki Living, featuring cozy interiors, modern comfort, fresh mountain air, and peaceful nature surroundings.',
    price: '3,500',
    originalPrice: '4,500',
    discount: '22',
    guests: '2 Guests',
    bed: 'King Bed',
    view: 'Nature View',
    size: '280 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Power Backup', 'Room Heater'],
    gallery: [room1, room1a, room1b, room1c]
  }
];

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const getRoomViewIcon = (view) => {
  if (view.includes('Mountain')) return MountainIcon;
  if (view.includes('Sitting')) return ArmchairIcon;
  return ViewIcon;
};

const Booking = ({ setCurrentPage }) => {
  const [selectedThumb, setSelectedThumb] = useState({});
  const [activePopup, setActivePopup] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState({});
  const [showBookedPopup, setShowBookedPopup] = useState(false);
  const [rooms, setRooms] = useState(roomsData);

  useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_rooms.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          const merged = roomsData.map(localRoom => {
            const backendRoom = data.data.find(r => r.id === localRoom.id);
            if (backendRoom) {
              const originalPrice = parseFloat(String(backendRoom.original_price || localRoom.originalPrice).replace(/,/g, ''));
              const currentPrice = parseFloat(String(backendRoom.price || localRoom.price).replace(/,/g, ''));
              let calculatedDiscount = localRoom.discount;
              if (originalPrice > 0 && originalPrice > currentPrice) {
                calculatedDiscount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100).toString();
              }
              
              return {
                ...localRoom,
                title: backendRoom.name || localRoom.title,
                desc: backendRoom.description || localRoom.desc,
                price: backendRoom.price?.toLocaleString() || localRoom.price,
                originalPrice: backendRoom.original_price?.toLocaleString() || localRoom.originalPrice,
                discount: calculatedDiscount,
                image: backendRoom.image_url || localRoom.image,
                gallery: backendRoom.image_url ? [backendRoom.image_url, ...localRoom.gallery.slice(1)] : localRoom.gallery,
                status: backendRoom.status
              };
            }
            return localRoom;
          });
          
          const room1Booked = merged.find(r => r.id === 1)?.status?.toLowerCase() === 'booked' ? 1 : 0;
          const room2Booked = merged.find(r => r.id === 2)?.status?.toLowerCase() === 'booked' ? 1 : 0;
          const room3Booked = merged.find(r => r.id === 3)?.status?.toLowerCase() === 'booked' ? 1 : 0;
          const bookedCount = room1Booked + room2Booked + room3Booked;
          const entireHomestayBooked = merged.find(r => r.id === 4)?.status?.toLowerCase() === 'booked';

          const finalRooms = merged.map(r => {
            if (r.id === 4) {
              if (r.status?.toLowerCase() === 'booked') return r;
              return { ...r, status: bookedCount > 0 ? 'Not Available' : r.status };
            } else if (r.id === 1 || r.id === 2 || r.id === 3) {
              if (entireHomestayBooked) {
                return { ...r, status: 'Not Available' };
              }
            }
            return r;
          });
          
          setRooms(finalRooms);
        }
      })
      .catch(err => console.error(err));
  }, []);


  const storedCheckIn = sessionStorage.getItem('meraki_checkIn');
  const storedCheckOut = sessionStorage.getItem('meraki_checkOut');
  const storedGuests = sessionStorage.getItem('meraki_guests');

  const defaultCheckIn = storedCheckIn ? new Date(storedCheckIn) : new Date();
  const defaultCheckOut = storedCheckOut ? new Date(storedCheckOut) : new Date(new Date().setDate(new Date().getDate() + 1));
  const isPageReload = () => {
    try {
      const navEntries = window.performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        return navEntries[0].type === 'reload';
      }
      return window.performance.navigation && window.performance.navigation.type === 1;
    } catch (e) {
      return false;
    }
  };

  let defaultGuests = { adults: 2, children: 0, rooms: 1 };
  if (!isPageReload() && storedGuests) {
    try {
      defaultGuests = JSON.parse(storedGuests);
    } catch (e) {}
  }

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (checkInDate) sessionStorage.setItem('meraki_checkIn', checkInDate.toISOString());
    if (checkOutDate) sessionStorage.setItem('meraki_checkOut', checkOutDate.toISOString());
    sessionStorage.setItem('meraki_guests', JSON.stringify(guests));
  }, [checkInDate, checkOutDate, guests]);

  const formatDate = useCallback((date) => {
    if (!date) return 'Add Dates';
    const str = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const year = date.getFullYear();
    return str.replace(' ' + year, ', ' + year);
  }, []);

  const getNights = useCallback(() => {
    if (!checkInDate || !checkOutDate) return 0;
    return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  }, [checkInDate, checkOutDate]);

  const handleGuestChange = useCallback((type, operation) => {
    setGuests((prev) => {
      const newGuests = { ...prev };
      if (operation === 'add') {
        newGuests[type] = prev[type] + 1;
      } else {
        if (type === 'adults' && prev.adults <= 1) return prev;
        if (type === 'children' && prev.children <= 0) return prev;
        if (type === 'rooms' && prev.rooms <= 1) return prev;
        newGuests[type] = prev[type] - 1;
      }
      return newGuests;
    });
  }, []);

  const handleBookNow = useCallback(async (e, room) => {
    e.stopPropagation();
    
    if (room.status?.toLowerCase() === 'booked' || room.status?.toLowerCase() === 'not available') {
      setShowBookedPopup(true);
      return;
    }
    
    const adultsPerRoom = Math.ceil((guests.adults || 2) / (guests.rooms || 1));
    const kidsPerRoom = Math.ceil((guests.children || 0) / (guests.rooms || 1));

    if (room.id === 1) {
      if (adultsPerRoom > 2 || kidsPerRoom > 2) {
        alert('Himalayan View Room allows a maximum of 2 Adults and 2 Kids per room. Please adjust your guest count or add more rooms.');
        return;
      }
    } else if (room.id === 2 || room.id === 3) {
      if (adultsPerRoom > 6 || kidsPerRoom > 5) {
        alert(`${room.title} allows a maximum of 6 Adults and 5 Kids per room. Please adjust your guest count or add more rooms.`);
        return;
      }
    }
    
    try {
      const res = await fetch('http://localhost/merakiliving_backend/api_rooms.php');
      const data = await res.json();
      if (data && data.status === 'success' && data.data) {
        let isBooked = false;
        const r1 = data.data.find(r => r.id === 1)?.status?.toLowerCase() === 'booked' ? 1 : 0;
        const r2 = data.data.find(r => r.id === 2)?.status?.toLowerCase() === 'booked' ? 1 : 0;
        const r3 = data.data.find(r => r.id === 3)?.status?.toLowerCase() === 'booked' ? 1 : 0;
        const r4 = data.data.find(r => r.id === 4)?.status?.toLowerCase() === 'booked' ? 1 : 0;
        const entireHomestayBooked = r4 > 0;
        
        if (room.id === 4) {
          isBooked = r4 > 0 || (r1 + r2 + r3) > 0;
        } else if (room.id === 1 || room.id === 2 || room.id === 3) {
          const backendRoom = data.data.find(r => r.id === room.id);
          isBooked = (backendRoom && backendRoom.status?.toLowerCase() === 'booked') || entireHomestayBooked;
        } else {
          const backendRoom = data.data.find(r => r.id === room.id);
          isBooked = backendRoom && backendRoom.status?.toLowerCase() === 'booked';
        }
        
        if (isBooked) {
          setShowBookedPopup(true);
          setRooms(prev => prev.map(r => {
            if (r.id === room.id) {
              if (room.id === 4 && r4 === 0) return { ...r, status: 'Not Available' };
              if ((room.id === 1 || room.id === 2 || room.id === 3) && entireHomestayBooked) return { ...r, status: 'Not Available' };
              return { ...r, status: 'Booked' };
            }
            return r;
          }));
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }

    const nights = getNights();
    let price = parseInt(String(room.price).split(',').join(''), 10);
    let extraCharge = 0;
    
    if (room.id === 2 || room.id === 3) {
      const extraAdults = Math.max(0, adultsPerRoom - 2);
      const extraKids = Math.max(0, kidsPerRoom - 2);
      extraCharge = (extraAdults * 1000) + (extraKids * 500);
    } else if (room.id === 4) {
      const extraAdults = Math.max(0, guests.adults - 12);
      const extraKids = Math.max(0, (guests.children || 0) - 2);
      extraCharge = (extraAdults * 1000) + (extraKids * 500);
    }
    
    price += extraCharge;
    const multiplier = room.id === 4 ? 1 : guests.rooms;
    const totalPrice = price * nights * multiplier;
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
  }, [getNights, guests, checkInDate, checkOutDate, setCurrentPage]);

  const handleViewDetails = useCallback((roomId) => {
    if (setCurrentPage) {
      setCurrentPage('room-details', roomId);
    }
  }, [setCurrentPage]);

  const handleThumbClick = useCallback((e, roomId, thumbIndex) => {
    e.stopPropagation();
    setSelectedThumb((prev) => ({ ...prev, [roomId]: thumbIndex }));
  }, []);

  const toggleDesc = useCallback((e, roomId) => {
    e.stopPropagation();
    setExpandedDesc((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
  }, []);

  const calendarDays = useMemo(() => {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ key: `empty-${i}`, empty: true });
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

      days.push({
        key: day,
        day,
        date,
        isPast,
        isSelected,
        isInRange,
        isCheckIn,
        isCheckOut
      });
    }
    return days;
  }, [currentCalendarMonth, checkInDate, checkOutDate]);

  const handleCalendarDayClick = useCallback((date, isPast) => {
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
  }, [activePopup, checkInDate, checkOutDate]);

  const renderCalendar = useCallback((alignRight = false) => {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();

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
          {dayNames.map((day) => <div key={day}>{day}</div>)}
        </div>
        <div className="calendar-grid">
          {calendarDays.map((item) => {
            if (item.empty) {
              return <div key={item.key} className="calendar-day empty"></div>;
            }
            return (
              <div
                key={item.key}
                className={`calendar-day ${item.isPast ? 'disabled' : ''} ${item.isSelected ? 'selected' : ''} ${item.isInRange ? 'in-range' : ''} ${item.isCheckIn ? 'check-in' : ''} ${item.isCheckOut ? 'check-out' : ''}`}
                onClick={() => handleCalendarDayClick(item.date, item.isPast)}
              >
                {item.day}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [currentCalendarMonth, calendarDays, handleCalendarDayClick]);

  const renderGuestsDropdown = useCallback(() => (
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
          <span className="guest-type">Kids</span>
          <span className="guest-desc">Ages 6-12</span>
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
  ), [guests, handleGuestChange]);

  const nights = getNights();

  const roomCards = useMemo(() => {
    return rooms.map((room, roomIdx) => {
      let currentRoomPrice = parseInt(String(room.price).replace(/,/g, ''), 10);
      let extraChargePerNight = 0;
      let extraChargeLabel = null;

      const adultsPerRoom = Math.ceil((guests.adults || 2) / (guests.rooms || 1));
      const kidsPerRoom = Math.ceil((guests.children || 0) / (guests.rooms || 1));

      const totalGuestsInBar = (guests.adults || 2) + (guests.children || 0);
      
      if (room.id === 1) {
        if (totalGuestsInBar > 3) return null;
        if (adultsPerRoom > 2 || kidsPerRoom > 2) return null; // fallback to capacity rule just in case
      } else if (room.id === 2) {
        if (adultsPerRoom > 6 || kidsPerRoom > 5) return null;
        const extraAdults = Math.max(0, adultsPerRoom - 2);
        const extraKids = Math.max(0, kidsPerRoom - 2);
        extraChargePerNight = (extraAdults * 1000) + (extraKids * 500);
      } else if (room.id === 3) {
        if (adultsPerRoom > 6 || kidsPerRoom > 5) return null;
        const extraAdults = Math.max(0, adultsPerRoom - 2);
        const extraKids = Math.max(0, kidsPerRoom - 2);
        extraChargePerNight = (extraAdults * 1000) + (extraKids * 500);
      } else if (room.id === 4) {
        if (guests.adults + (guests.children || 0) > 14) return null;
        const extraAdults = Math.max(0, guests.adults - 12);
        const extraKids = Math.max(0, (guests.children || 0) - 2);
        extraChargePerNight = (extraAdults * 1000) + (extraKids * 500);
      }
      
      currentRoomPrice += extraChargePerNight;
      
      if (extraChargePerNight > 0) {
        const multiplier = room.id === 4 ? 1 : (guests.rooms || 1);
        
        let labelText = [];
        let extraA = 0;
        let extraK = 0;
        if (room.id === 2 || room.id === 3) {
          extraA = Math.max(0, adultsPerRoom - 2);
          extraK = Math.max(0, kidsPerRoom - 2);
        } else if (room.id === 4) {
          extraA = Math.max(0, guests.adults - 12);
          extraK = Math.max(0, (guests.children || 0) - 2);
        }
        
        if (extraA > 0) labelText.push(`${extraA} Extra Adult${extraA > 1 ? 's' : ''}`);
        if (extraK > 0) labelText.push(`${extraK} Extra Kid${extraK > 1 ? 's' : ''}`);
        
        const extraAmountString = `₹${(extraChargePerNight * multiplier).toLocaleString('en-IN')} Extra`;
        extraChargeLabel = <div style={{ fontSize: '13px', color: '#c5221f', marginTop: '4px', fontWeight: '500', width: '100%', display: 'block' }}>{labelText.join(' & ')} &middot; {extraAmountString}</div>;
      }

      return (
      <div className="booking-room-card" key={room.id} onClick={() => handleViewDetails(room.id)}>
        <div className="booking-room-gallery">
          <div className="booking-room-main-image">
            <img
              src={selectedThumb[room.id] !== undefined ? room.gallery[selectedThumb[room.id]] : room.image}
              alt={room.title}
              loading={roomIdx === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
          <div className="booking-room-thumbs">
            {room.gallery.map((thumb, idx) => (
              <div
                className={`booking-room-thumb ${selectedThumb[room.id] === idx ? 'active' : ''}`}
                key={idx}
                onClick={(e) => handleThumbClick(e, room.id, idx)}
              >
                <img src={thumb} alt={`${room.title} ${idx + 1}`} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
        <div className="booking-room-details">
          <div className="booking-room-header">
            {(() => {
              const titleData = parseRoomTitle(room.title);
              return (
                <h3 className="booking-room-title">
                  <span className="booking-room-title-main">{titleData.mainName || room.title}</span>
                  {titleData.subtitle && <span className="booking-room-title-sub"> {titleData.subtitle}</span>}
                  {titleData.roomType && <span className="booking-room-title-type"> {titleData.roomType}</span>}
                </h3>
              );
            })()}
            <div className={`availability-tag availability-desktop ${(room.status?.toLowerCase() === 'booked' || room.status?.toLowerCase() === 'not available') ? 'booked' : 'available'}`}>
              {room.status === 'Not Available' ? 'Not Available' : (room.status?.toLowerCase() === 'booked' ? 'Booked' : 'Available')}
            </div>
          </div>
          <div className="booking-room-desc-wrapper">
            <p className={`booking-room-desc ${expandedDesc[room.id] ? 'expanded' : ''}`}>
              {room.desc}
            </p>
            <span className="view-more-btn" onClick={(e) => toggleDesc(e, room.id)}>
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
            <div className="booking-room-price" style={{ flexWrap: 'wrap' }}>
              <span className="booking-price-amount">&#8377;{currentRoomPrice.toLocaleString('en-IN')}</span>
              <span className="booking-price-original">&#8377;{room.originalPrice}</span>
              <span className="booking-price-discount">{room.discount}% OFF</span>
              <div className={`availability-tag availability-mobile ${(room.status?.toLowerCase() === 'booked' || room.status?.toLowerCase() === 'not available') ? 'booked' : 'available'}`}>
                {room.status === 'Not Available' ? 'Not Available' : (room.status?.toLowerCase() === 'booked' ? 'Booked' : 'Available')}
              </div>
              {extraChargeLabel}
            </div>
            <div className="booking-footer-actions">
              <button className="booking-btn-primary" onClick={(e) => handleBookNow(e, room)}>
                <span>Book Now</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      );
    });
  }, [rooms, selectedThumb, expandedDesc, handleThumbClick, toggleDesc, handleViewDetails, handleBookNow, guests]);

  return (
    <section className="booking-section">
      <div className="booking-container">
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
            {roomCards}
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
                <a href="tel:+919456103445" className="booking-help-btn-secondary">
                  <HugeiconsIcon icon={Call02Icon} size={18} variant="stroke" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookedPopup && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setShowBookedPopup(false)}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%',
            textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', transform: 'translateY(0)',
            animation: 'fadeIn 0.2s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', background: '#fce8e6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c5221f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <h3 style={{fontSize: '22px', fontWeight: '600', color: '#1A1A1A', marginBottom: '12px', marginTop: 0}}>
              Room Unavailable
            </h3>
            <p style={{fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '28px', marginTop: 0}}>
              This room is already booked. Please choose another available room for your stay.
            </p>
            <button className="booking-btn-primary" style={{width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px'}} onClick={() => setShowBookedPopup(false)}>
              Okay, got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Booking;