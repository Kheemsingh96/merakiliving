import React, { useState, useEffect } from 'react';
import './GuestDetails.css';

import room1 from '../../assets/images/room-1.png';
import room2 from '../../assets/images/room-2.png';
import room3 from '../../assets/images/room-3.png';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowLeft02Icon,
  BedDoubleIcon,
  Calendar01Icon,
  Call02Icon,
  CheckmarkCircle01Icon,
  Edit02Icon,
  StarIcon,
  UserMultiple02Icon,
  Comment01Icon,
  RupeeShieldIcon,
  User03Icon,
  Mail01Icon,
  Home07Icon,
  SecurityValidationIcon,
  BulbChargingIcon,
  ViewIcon,
  DiscountIcon,
  Tick02Icon
} from '@hugeicons/core-free-icons';

import { FaWhatsapp } from 'react-icons/fa';

const ArrowDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 15l-6-6-6 6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ShieldTickIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 12 15 16 10"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const TickIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const WifiIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);

const CarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
    <circle cx="6.5" cy="16.5" r="2.5"/>
    <circle cx="16.5" cy="16.5" r="2.5"/>
  </svg>
);

const CoffeeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/>
    <line x1="10" y1="1" x2="10" y2="4"/>
    <line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
);

const FireIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

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

const amenityIcons = {
  'Free WiFi': WifiIcon,
  'Free Parking': CarIcon,
  'Breakfast Included': CoffeeIcon,
  'Room Heater': FireIcon,
  'Balcony': ViewIcon,
  'Kitchenette': HomeIcon
};

const GuestDetails = ({ setCurrentPage, selectedRoomId = 1 }) => {
  const [currentStep, setCurrentStep] = useState(2);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    specialRequests: '',
    agreeTerms: false,
    agreePrivacy: false
  });
  const [errors, setErrors] = useState({});
  const [showAmenities, setShowAmenities] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const room = roomsData.find(r => r.id === selectedRoomId) || roomsData[0];

  const storedCheckIn = sessionStorage.getItem('meraki_checkIn');
  const storedCheckOut = sessionStorage.getItem('meraki_checkOut');
  const storedGuests = sessionStorage.getItem('meraki_guests');

  const checkInDate = storedCheckIn ? new Date(storedCheckIn) : new Date();
  const checkOutDate = storedCheckOut ? new Date(storedCheckOut) : new Date(new Date().setDate(new Date().getDate() + 2));
  const guests = storedGuests ? JSON.parse(storedGuests) : { adults: 2, children: 0, rooms: 1 };

  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const pricePerNight = parseInt(room.price.replace(/,/g, ''));
  const subtotal = pricePerNight * nights;
  const discountAmount = couponApplied ? Math.round(subtotal * 0.08) : 0;
  const taxableAmount = subtotal - discountAmount;
  const taxes = Math.round(taxableAmount * 0.05);
  const totalAmount = taxableAmount + taxes;

  const formatDate = (date) => {
    if (!date) return 'Add Dates';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ (\d{4})$/, ', $1');
  };

  const getDayName = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { weekday: 'long' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    if (!formData.agreePrivacy) newErrors.agreePrivacy = 'You must agree to the privacy policy';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    sessionStorage.setItem('meraki_guestDetails', JSON.stringify(formData));
    if (setCurrentPage) {
      setCurrentPage('payment');
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    const validCoupons = ['MERAKI8', 'SAVE8', 'WELCOME8', 'DISCOUNT8'];
    if (validCoupons.includes(couponCode.trim().toUpperCase())) {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponApplied(false);
      setCouponError('Invalid coupon code. Try MERAKI8');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setCouponError('');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi Meraki Living! \n\nI have a booking inquiry for the *${room.title}*\n` +
      `Check-in: ${formatDate(checkInDate)}\n` +
      `Check-out: ${formatDate(checkOutDate)}\n` +
      `Nights: ${nights}\n` +
      `${guests.adults + guests.children} Guests\n` +
      `Rooms: ${guests.rooms}\n` +
      `Total: Rs.${totalAmount.toLocaleString('en-IN')}\n\n` +
      `Guest: ${formData.firstName} ${formData.lastName}\n` +
      `${formData.email}\n` +
      `${formData.countryCode} ${formData.phone}\n\n` +
      `Please confirm availability. Thank you!`
    );
    window.open(`https://wa.me/917037189517?text=${message}`, '_blank');
  };

  const steps = [
    { label: 'Your Stay', number: 1 },
    { label: 'Guest Details', number: 2 },
    { label: 'Payment', number: 3 },
    { label: 'Confirmation', number: 4 }
  ];

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+971', country: 'UAE' },
    { code: '+65', country: 'Singapore' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' }
  ];

  const renderProgressBar = () => (
    <div className="gd-steps">
      {steps.map((step, idx) => (
        <div key={step.number} className={`gd-step ${step.number <= currentStep ? 'active' : ''} ${step.number === currentStep ? 'current' : ''}`}>
          <div className="gd-step-track">
            {idx > 0 && <div className={`gd-step-track-line gd-step-track-left ${step.number <= currentStep ? 'filled' : ''}`}></div>}
            <div className="gd-step-circle">
              {step.number < currentStep ? (
                <HugeiconsIcon icon={Tick02Icon} size={14} />
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            {idx < steps.length - 1 && <div className={`gd-step-track-line gd-step-track-right ${step.number < currentStep ? 'filled' : ''}`}></div>}
          </div>
          <span className="gd-step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );

  const renderRoomSummary = () => (
    <div className="gd-card gd-summary-card">
      <div className="gd-summary-header">
        <div className="gd-summary-room-image">
          <img src={room.image} alt={room.title} loading="lazy" />
        </div>
        <div className="gd-summary-room-info">
          <h3 className="gd-summary-room-title">{room.title}</h3>
          <div className="gd-summary-room-meta">
            <span className="gd-summary-tag">{room.tag}</span>
            <div className="gd-summary-rating">
              <HugeiconsIcon icon={StarIcon} size={14} />
              <span>{room.rating}</span>
              <span className="gd-rating-count">({room.reviews})</span>
            </div>
          </div>
        </div>
      </div>
      <div className="gd-summary-divider"></div>
      <div className="gd-summary-details">
        <div className="gd-summary-row">
          <div className="gd-summary-item">
            <HugeiconsIcon icon={Calendar01Icon} size={16} />
            <div>
              <span className="gd-summary-label">Check-in</span>
              <span className="gd-summary-value">{formatDate(checkInDate)}</span>
              <span className="gd-summary-sub">{getDayName(checkInDate)} &middot; After 12:00 PM</span>
            </div>
          </div>
          <div className="gd-summary-item">
            <HugeiconsIcon icon={Calendar01Icon} size={16} />
            <div>
              <span className="gd-summary-label">Check-out</span>
              <span className="gd-summary-value">{formatDate(checkOutDate)}</span>
              <span className="gd-summary-sub">{getDayName(checkOutDate)} &middot; Before 11:00 AM</span>
            </div>
          </div>
        </div>
        <div className="gd-summary-row">
          <div className="gd-summary-item">
            <HugeiconsIcon icon={UserMultiple02Icon} size={16} />
            <div>
              <span className="gd-summary-label">Guests</span>
              <span className="gd-summary-value">{guests.adults + guests.children} Guests</span>
            </div>
          </div>
          <div className="gd-summary-item">
            <HugeiconsIcon icon={BedDoubleIcon} size={16} />
            <div>
              <span className="gd-summary-label">Rooms</span>
              <span className="gd-summary-value">{guests.rooms} Room{guests.rooms > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div></div>
      <button 
        className="gd-edit-btn"
        onClick={() => {
          if (setCurrentPage) setCurrentPage('booking');
        }}
      >
        <HugeiconsIcon icon={Edit02Icon} size={16} />
        <span>Edit Stay Details</span>
      </button>
    </div>
  );

  const renderPriceBreakdown = () => (
    <div className="gd-card gd-price-card">
      <h4 className="gd-price-title">Price Breakdown</h4>

      <div className="gd-price-room">
        <img src={room.image} alt={room.title} loading="lazy" />
        <div>
          <span className="gd-price-room-name">{room.title}</span>
          <span className="gd-price-room-meta">{nights} nights &middot; {guests.adults + guests.children} guests</span>
        </div>
      </div>

      <div className="gd-price-divider"></div>

      <div className="gd-price-breakdown">
        <div className="gd-price-row">
          <span>Rs.{room.price} x {nights} night{nights > 1 ? 's' : ''}</span>
          <span>Rs.{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className={`gd-price-row ${couponApplied ? 'gd-discount' : ''}`}>
          <span>Coupon Discount</span>
          <span>{couponApplied ? `-Rs.${discountAmount.toLocaleString('en-IN')}` : 'Rs.0'}</span>
        </div>
        <div className="gd-price-row">
          <span>Taxes & Fees (5% GST)</span>
          <span>Rs.{taxes.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="gd-price-divider"></div>
      
      <div className="gd-price-row gd-total-row">
        <span>Total Amount</span>
        <span>Rs.{totalAmount.toLocaleString('en-IN')}</span>
      </div>

      <div className="gd-coupon-section">
        {!couponApplied ? (
          <div className="gd-coupon-input-wrapper">
            <div className="gd-coupon-input-box">
              <HugeiconsIcon icon={DiscountIcon} size={18} />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="gd-coupon-input"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
            </div>
            <button className="gd-coupon-btn" onClick={handleApplyCoupon}>
              Apply
            </button>
          </div>
        ) : (
          <div className="gd-coupon-applied">
            <div className="gd-coupon-applied-left">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
              <div>
                <span className="gd-coupon-code">{couponCode.toUpperCase()}</span>
                <span className="gd-coupon-saved">You saved Rs.{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button className="gd-coupon-remove" onClick={handleRemoveCoupon}>
              Remove
            </button>
          </div>
        )}
        {couponError && <span className="gd-coupon-error">{couponError}</span>}
      </div>

      <div className="gd-guarantees">
        <div className="gd-guarantee-item">
          <HugeiconsIcon icon={RupeeShieldIcon} size={16} />
          <span>Best Price Guarantee</span>
        </div>
        <div className="gd-guarantee-item">
          <HugeiconsIcon icon={SecurityValidationIcon} size={16} />
          <span>Secure Booking</span>
        </div>
        <div className="gd-guarantee-item">
          <HugeiconsIcon icon={BulbChargingIcon} size={16} />
          <span>No Hidden Charges</span>
        </div>
      </div>
    </div>
  );

  const renderGuestForm = () => (
    <div className="gd-card gd-form-card">
      <div className="gd-form-header">
        <div className="gd-form-icon">
          <HugeiconsIcon icon={User03Icon} size={24} />
        </div>
        <div>
          <h3 className="gd-form-title">Primary Guest</h3>
          <p className="gd-form-desc">The person checking in must match these details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="gd-form">
        <div className="gd-form-row">
          <div className={`gd-form-group ${errors.firstName ? 'error' : ''}`}>
            <label className="gd-form-label">
              First Name <span className="gd-required">*</span>
            </label>
            <div className="gd-input-wrapper">
              <HugeiconsIcon icon={User03Icon} size={18} />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="gd-input"
              />
            </div>
            {errors.firstName && <span className="gd-error-text">{errors.firstName}</span>}
          </div>
          <div className={`gd-form-group ${errors.lastName ? 'error' : ''}`}>
            <label className="gd-form-label">
              Last Name <span className="gd-required">*</span>
            </label>
            <div className="gd-input-wrapper">
              <HugeiconsIcon icon={User03Icon} size={18} />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="gd-input"
              />
            </div>
            {errors.lastName && <span className="gd-error-text">{errors.lastName}</span>}
          </div>
        </div>

        <div className={`gd-form-group ${errors.email ? 'error' : ''}`}>
          <label className="gd-form-label">
            Email Address <span className="gd-required">*</span>
          </label>
          <div className="gd-input-wrapper">
            <HugeiconsIcon icon={Mail01Icon} size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="gd-input"
            />
          </div>
          {errors.email && <span className="gd-error-text">{errors.email}</span>}
          <span className="gd-input-hint">Booking confirmation will be sent here</span>
        </div>

        <div className={`gd-form-group ${errors.phone ? 'error' : ''}`}>
          <label className="gd-form-label">
            Phone Number <span className="gd-required">*</span>
          </label>
          <div className="gd-phone-wrapper">
            <div className="gd-country-select">
              <HugeiconsIcon icon={Call02Icon} size={18} />
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="gd-select"
              >
                {countryCodes.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="98765 43210"
              className="gd-input gd-phone-input"
            />
          </div>
          {errors.phone && <span className="gd-error-text">{errors.phone}</span>}
          <span className="gd-input-hint">For booking updates and check-in coordination</span>
        </div>

        <div className="gd-form-group">
          <label className="gd-form-label">Special Requests (Optional)</label>
          <div className="gd-textarea-wrapper">
            <HugeiconsIcon icon={Comment01Icon} size={18} />
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              placeholder="Any special requests? E.g., early check-in, room preference, dietary requirements..."
              className="gd-textarea"
              rows={4}
            />
          </div>
        </div>

        <div className="gd-terms-section">
          <div className={`gd-checkbox-group ${errors.agreeTerms ? 'error' : ''}`}>
            <label className="gd-checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="gd-checkbox"
              />
              <span className="gd-checkbox-custom">
                {formData.agreeTerms && <TickIcon />}
              </span>
              <span className="gd-checkbox-text">
                I agree to the <button type="button" className="gd-link-btn" onClick={() => setCurrentPage && setCurrentPage('terms-conditions')}>Terms & Conditions</button> and <button type="button" className="gd-link-btn" onClick={() => setCurrentPage && setCurrentPage('cancellation-policy')}>Cancellation Policy</button>
              </span>
            </label>
            {errors.agreeTerms && <span className="gd-error-text">{errors.agreeTerms}</span>}
          </div>
          <div className={`gd-checkbox-group ${errors.agreePrivacy ? 'error' : ''}`}>
            <label className="gd-checkbox-label">
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleInputChange}
                className="gd-checkbox"
              />
              <span className="gd-checkbox-custom">
                {formData.agreePrivacy && <TickIcon />}
              </span>
              <span className="gd-checkbox-text">
                I agree to the <button type="button" className="gd-link-btn" onClick={() => setCurrentPage && setCurrentPage('privacy-policy')}>Privacy Policy</button> and consent to receiving booking-related communications
              </span>
            </label>
            {errors.agreePrivacy && <span className="gd-error-text">{errors.agreePrivacy}</span>}
          </div>
        </div>

        <div className="gd-form-actions">
          <button type="button" className="gd-btn-secondary" onClick={() => {
                    const history = JSON.parse(sessionStorage.getItem('meraki_navHistory') || '[]');
                    const prevPage = history.length > 1 ? history[history.length - 2] : 'booking';
                    if (setCurrentPage) setCurrentPage(prevPage);
                  }}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            <span>Back</span>
          </button>
          <button type="submit" className="gd-btn-primary">
            <span>Proceed to Payment</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
          </button>
        </div>
      </form>
    </div>
  );

  const renderAmenitiesCard = () => (
    <div className="gd-card gd-amenities-card">
      <button
        className="gd-amenities-toggle"
        onClick={() => setShowAmenities(!showAmenities)}
      >
        <div className="gd-amenities-toggle-left">
          <HugeiconsIcon icon={Home07Icon} size={20} />
          <span>Room Amenities</span>
        </div>
        {showAmenities ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </button>
      {showAmenities && (
        <div className="gd-amenities-grid">
          {room.amenities.map((amenity, idx) => {
            const IconComp = amenityIcons[amenity];
            return (
              <div className="gd-amenity-item" key={idx}>
                <IconComp />
                <span>{amenity}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderPolicyCard = () => (
    <div className="gd-card gd-policy-card">
      <div className="gd-policy-item">
        <div className="gd-policy-icon">
          <ShieldTickIcon />
        </div>
        <div className="gd-policy-text">
          <span className="gd-policy-title">Free Cancellation</span>
          <span className="gd-policy-desc">Cancel up to 24 hours before check-in for a full refund.</span>
        </div>
      </div>
      <div className="gd-policy-item">
        <div className="gd-policy-icon">
          <ClockIcon />
        </div>
        <div className="gd-policy-text">
          <span className="gd-policy-title">Check-in / Check-out</span>
          <span className="gd-policy-desc">Check-in: 12:00 PM &middot; Check-out: 11:00 AM</span>
        </div>
      </div>
    </div>
  );

  const renderHelpCard = () => (
    <div className="gd-card gd-help-card">
      <div className="gd-help-header">
        <div className="gd-help-icon">
          <HugeiconsIcon icon={Call02Icon} size={24} />
        </div>
        <div>
          <h4 className="gd-help-title">Need Help?</h4>
          <p className="gd-help-desc">Our team is here to assist you</p>
        </div>
      </div>
      <div className="gd-help-actions">
        <button className="gd-help-btn gd-whatsapp-btn" onClick={handleWhatsApp}>
          <FaWhatsapp size={18} />
          <span>WhatsApp Us</span>
        </button>
        <a href="tel:+917037189517" className="gd-help-btn gd-call-btn">
          <HugeiconsIcon icon={Call02Icon} size={18} />
          <span>Call Now</span>
        </a>
      </div>
    </div>
  );

  const renderSecurityNote = () => (
    <div className="gd-security-note">
      <LockIcon />
      <span>Your information is encrypted and secure. We never share your details with third parties.</span>
    </div>
  );

  return (
    <section className="gd-section">
      <div className="gd-container">

        <div className="gd-nav">
          <button className="gd-back-btn" onClick={() => {
            const history = JSON.parse(sessionStorage.getItem('meraki_navHistory') || '[]');
            const prevPage = history.length > 1 ? history[history.length - 2] : 'booking';
            if (setCurrentPage) setCurrentPage(prevPage);
          }}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
            <span>Back to Rooms</span>
          </button>
        </div>

        {renderProgressBar()}

        <div className="gd-page-header">
          <h1 className="gd-page-title">Guest Details</h1>
          <p className="gd-page-subtitle">Please fill in your details to proceed with the booking</p>
        </div>

        <div className="gd-layout">
          <div className="gd-left">
            {renderRoomSummary()}
            {renderGuestForm()}
            {renderSecurityNote()}
          </div>

          <div className="gd-right">
            <div className="gd-sidebar-sticky">
              {renderPriceBreakdown()}
              {renderAmenitiesCard()}
              {renderPolicyCard()}
              {renderHelpCard()}
            </div>
          </div>
        </div>

        <div className="gd-mobile-layout">
          {renderRoomSummary()}
          {renderPriceBreakdown()}
          {renderGuestForm()}
          {renderAmenitiesCard()}
          {renderPolicyCard()}
          {renderHelpCard()}
          {renderSecurityNote()}
        </div>

      </div>
    </section>
  );
};

export default GuestDetails;