import React, { useState, useEffect } from 'react';
import './Payment.css';

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
  StarIcon,
  UserMultiple02Icon,
  RupeeShieldIcon,
  SecurityValidationIcon,
  BulbChargingIcon,
  DiscountIcon,
  Tick02Icon,
  CreditCardPosIcon,
  BankIcon,
  Wallet02Icon,
  LockIcon
} from '@hugeicons/core-free-icons';

import { FaWhatsapp } from 'react-icons/fa';
import { SiGooglepay, SiPhonepe } from 'react-icons/si';

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ShieldTickIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 12 15 16 10"/>
  </svg>
);

const SmartphoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const CheckmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const PaytmIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#00BAF2"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">P</text>
  </svg>
);

const BhimIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#0066B3"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">B</text>
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
    amenities: ['Free WiFi', 'Free Parking', 'Breakfast Included', 'Room Heater']
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
    amenities: ['Free WiFi', 'Free Parking', 'Breakfast Included', 'Balcony']
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
    amenities: ['Free WiFi', 'Free Parking', 'Breakfast Included', 'Kitchenette']
  }
];

const paymentMethods = [
  {
    id: 'upi',
    label: 'UPI',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: SmartphoneIcon
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, RuPay, Amex',
    icon: CreditCardPosIcon
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    subtitle: 'All major banks supported',
    icon: BankIcon
  },
  {
    id: 'wallet',
    label: 'Wallets',
    subtitle: 'Paytm, PhonePe, Amazon Pay, Mobikwik',
    icon: Wallet02Icon
  }
];

const upiOptions = [
  { id: 'gpay', label: 'Google Pay', color: '#4285F4', Icon: SiGooglepay, scheme: 'tez://upi/pay' },
  { id: 'phonepe', label: 'PhonePe', color: '#5f259f', Icon: SiPhonepe, scheme: 'phonepe://pay' },
  { id: 'paytm', label: 'Paytm', color: '#00BAF2', Icon: PaytmIcon, scheme: 'paytmmp://upi/pay' },
  { id: 'bhim', label: 'BHIM UPI', color: '#0066B3', Icon: BhimIcon, scheme: 'bhim://upi/pay' }
];

const cardNetworks = [
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'rupay', label: 'RuPay' },
  { id: 'amex', label: 'Amex' }
];

const Payment = ({ setCurrentPage, selectedRoomId = 1 }) => {
  const currentStep = 3;
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [selectedUpi, setSelectedUpi] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedCardNetwork, setSelectedCardNetwork] = useState('visa');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const room = roomsData.find(r => r.id === selectedRoomId) || roomsData[0];

  const storedCheckIn = sessionStorage.getItem('meraki_checkIn');
  const storedCheckOut = sessionStorage.getItem('meraki_checkOut');
  const storedGuests = sessionStorage.getItem('meraki_guests');
  const storedCoupon = sessionStorage.getItem('meraki_couponApplied');
  const storedCouponCode = sessionStorage.getItem('meraki_couponCode');

  const checkInDate = storedCheckIn ? new Date(storedCheckIn) : new Date();
  const checkOutDate = storedCheckOut ? new Date(storedCheckOut) : new Date(new Date().setDate(new Date().getDate() + 2));
  const guests = storedGuests ? JSON.parse(storedGuests) : { adults: 2, children: 0, rooms: 1 };
  const couponApplied = storedCoupon === 'true';
  const couponCode = storedCouponCode || '';

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

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + ' / ' + v.substring(2, 4);
    }
    return v;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms to proceed';
    }
    if (selectedMethod === 'upi') {
      if (!upiId.trim()) {
        newErrors.upiId = 'Please enter your UPI ID';
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/.test(upiId.trim())) {
        newErrors.upiId = 'Please enter a valid UPI ID (e.g., name@upi)';
      }
    }
    if (selectedMethod === 'card') {
      const cleanNumber = cardNumber.replace(/\s/g, '');
      if (!cleanNumber || cleanNumber.length < 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!cardName.trim()) {
        newErrors.cardName = 'Please enter the name on card';
      }
      const cleanExpiry = cardExpiry.replace(/\s/g, '').replace(/\//g, '');
      if (!cleanExpiry || cleanExpiry.length < 4) {
        newErrors.cardExpiry = 'Please enter valid expiry (MM/YY)';
      }
      if (!cardCvv || cardCvv.length < 3) {
        newErrors.cardCvv = 'Please enter CVV';
      }
    }
    return newErrors;
  };

  const handlePayNow = () => {
    const validationErrors = validatePayment();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (setCurrentPage) setCurrentPage('confirmation');
    }, 2000);
  };

  const handleBack = () => {
    const history = JSON.parse(sessionStorage.getItem('meraki_navHistory') || '[]');
    const prevPage = history.length > 1 ? history[history.length - 2] : 'guest-details';
    if (setCurrentPage) setCurrentPage(prevPage);
  };

  const handleOpenUpiApp = () => {
    const upi = upiOptions.find(u => u.id === selectedUpi);
    if (upi && upi.scheme) {
      const url = `${upi.scheme}?pa=${encodeURIComponent(upiId)}&pn=Meraki+Living&am=${totalAmount}&cu=INR&tn=Room+Booking`;
      window.location.href = url;
    }
  };

  const steps = [
    { label: 'Your Stay', number: 1 },
    { label: 'Guest Details', number: 2 },
    { label: 'Payment', number: 3 },
    { label: 'Confirmation', number: 4 }
  ];

  const renderProgressBar = () => (
    <div className="pay-progress">
      <div className="pay-progress-track">
        <div 
          className="pay-progress-fill" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <div className="pay-progress-steps">
        {steps.map((step) => {
          const isActive = step.number <= currentStep;
          const isCurrent = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          return (
            <div 
              key={step.number} 
              className={`pay-progress-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="pay-progress-circle">
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span className="pay-progress-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRoomSummary = () => (
    <div className="pay-card pay-summary-card">
      <div className="pay-summary-header">
        <div className="pay-summary-room-image">
          <img src={room.image} alt={room.title} loading="lazy" />
        </div>
        <div className="pay-summary-room-info">
          <h3 className="pay-summary-room-title">{room.title}</h3>
          <div className="pay-summary-room-meta">
            <span className="pay-summary-tag">{room.tag}</span>
            <div className="pay-summary-rating">
              <HugeiconsIcon icon={StarIcon} size={14} />
              <span>{room.rating}</span>
              <span className="pay-rating-count">({room.reviews})</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pay-summary-divider"></div>
      <div className="pay-summary-details">
        <div className="pay-summary-row">
          <div className="pay-summary-item">
            <HugeiconsIcon icon={Calendar01Icon} size={16} />
            <div>
              <span className="pay-summary-label">Check-in</span>
              <span className="pay-summary-value">{formatDate(checkInDate)}</span>
              <span className="pay-summary-sub">{getDayName(checkInDate)} &middot; After 12:00 PM</span>
            </div>
          </div>
          <div className="pay-summary-item">
            <HugeiconsIcon icon={Calendar01Icon} size={16} />
            <div>
              <span className="pay-summary-label">Check-out</span>
              <span className="pay-summary-value">{formatDate(checkOutDate)}</span>
              <span className="pay-summary-sub">{getDayName(checkOutDate)} &middot; Before 11:00 AM</span>
            </div>
          </div>
        </div>
        <div className="pay-summary-row">
          <div className="pay-summary-item">
            <HugeiconsIcon icon={UserMultiple02Icon} size={16} />
            <div>
              <span className="pay-summary-label">Guests</span>
              <span className="pay-summary-value">{guests.adults + guests.children} Guests</span>
            </div>
          </div>
          <div className="pay-summary-item">
            <HugeiconsIcon icon={BedDoubleIcon} size={16} />
            <div>
              <span className="pay-summary-label">Rooms</span>
              <span className="pay-summary-value">{guests.rooms} Room{guests.rooms > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPriceBreakdown = () => (
    <div className="pay-card pay-price-card">
      <h4 className="pay-price-title">Price Breakdown</h4>
      <div className="pay-price-room">
        <img src={room.image} alt={room.title} loading="lazy" />
        <div>
          <span className="pay-price-room-name">{room.title}</span>
          <span className="pay-price-room-meta">{nights} night{nights > 1 ? 's' : ''} &middot; {guests.adults + guests.children} guests</span>
        </div>
      </div>
      <div className="pay-price-divider"></div>
      <div className="pay-price-breakdown">
        <div className="pay-price-row">
          <span>Rs.{room.price} x {nights} night{nights > 1 ? 's' : ''}</span>
          <span>Rs.{subtotal.toLocaleString('en-IN')}</span>
        </div>
        {couponApplied && (
          <div className="pay-price-row pay-discount">
            <span>Coupon Discount ({couponCode.toUpperCase()})</span>
            <span>-Rs.{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="pay-price-row">
          <span>Taxes & Fees (5% GST)</span>
          <span>Rs.{taxes.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div className="pay-price-divider"></div>
      <div className="pay-price-row pay-total-row">
        <span>Total Amount</span>
        <span>Rs.{totalAmount.toLocaleString('en-IN')}</span>
      </div>
      {couponApplied && (
        <div className="pay-coupon-applied">
          <div className="pay-coupon-applied-left">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
            <div>
              <span className="pay-coupon-code">{couponCode.toUpperCase()}</span>
              <span className="pay-coupon-saved">You saved Rs.{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
      <div className="pay-guarantees">
        <div className="pay-guarantee-item">
          <HugeiconsIcon icon={RupeeShieldIcon} size={16} />
          <span>Best Price Guarantee</span>
        </div>
        <div className="pay-guarantee-item">
          <HugeiconsIcon icon={SecurityValidationIcon} size={16} />
          <span>Secure Booking</span>
        </div>
        <div className="pay-guarantee-item">
          <HugeiconsIcon icon={BulbChargingIcon} size={16} />
          <span>No Hidden Charges</span>
        </div>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="pay-card pay-payment-card">
      <div className="pay-payment-header">
        <div className="pay-payment-icon">
          <HugeiconsIcon icon={CreditCardPosIcon} size={24} />
        </div>
        <div>
          <h3 className="pay-payment-title">Select Payment Method</h3>
          <p className="pay-payment-desc">Choose your preferred way to pay</p>
        </div>
      </div>
      <div className="pay-methods-list">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const IconComp = method.icon;
          return (
            <div
              key={method.id}
              className={`pay-method-item ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                setSelectedMethod(method.id);
                setErrors({});
              }}
            >
              <div className="pay-method-radio">
                <div className={`pay-radio-circle ${isSelected ? 'active' : ''}`}>
                  {isSelected && <div className="pay-radio-dot"></div>}
                </div>
              </div>
              <div className="pay-method-icon">
                {method.id === 'upi' ? (
                  <IconComp />
                ) : (
                  <HugeiconsIcon icon={IconComp} size={22} />
                )}
              </div>
              <div className="pay-method-info">
                <span className="pay-method-label">{method.label}</span>
                <span className="pay-method-subtitle">{method.subtitle}</span>
              </div>
              {isSelected && (
                <div className="pay-method-check">
                  <CheckmarkIcon />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedMethod === 'upi' && (
        <div className="pay-method-form">
          <div className="pay-upi-options">
            {upiOptions.map((upi) => (
              <button
                key={upi.id}
                className={`pay-upi-option ${selectedUpi === upi.id ? 'active' : ''}`}
                onClick={() => setSelectedUpi(upi.id)}
              >
                {upi.Icon ? (
                  <upi.Icon size={18} style={{ color: upi.color, flexShrink: 0 }} />
                ) : (
                  <div className="pay-upi-dot" style={{ background: upi.color }}></div>
                )}
                <span>{upi.label}</span>
              </button>
            ))}
          </div>
          <div className={`pay-form-group ${errors.upiId ? 'error' : ''}`}>
            <label className="pay-form-label">
              UPI ID <span className="pay-required">*</span>
            </label>
            <div className="pay-input-wrapper">
              <input
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  if (errors.upiId) setErrors(prev => ({ ...prev, upiId: '' }));
                }}
                placeholder="yourname@upi"
                className="pay-input"
              />
            </div>
            {errors.upiId && <span className="pay-error-text">{errors.upiId}</span>}
            <span className="pay-input-hint">You will receive a payment request on your UPI app</span>
            {upiId && /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/.test(upiId.trim()) && (
              <button 
                className="pay-upi-open-btn" 
                onClick={handleOpenUpiApp}
                type="button"
              >
                Open {upiOptions.find(u => u.id === selectedUpi)?.label}
              </button>
            )}
          </div>
        </div>
      )}
      {selectedMethod === 'card' && (
        <div className="pay-method-form">
          <div className="pay-card-networks">
            {cardNetworks.map((net) => (
              <button
                key={net.id}
                className={`pay-card-network ${selectedCardNetwork === net.id ? 'active' : ''}`}
                onClick={() => setSelectedCardNetwork(net.id)}
              >
                {net.label}
              </button>
            ))}
          </div>
          <div className={`pay-form-group ${errors.cardNumber ? 'error' : ''}`}>
            <label className="pay-form-label">
              Card Number <span className="pay-required">*</span>
            </label>
            <div className="pay-input-wrapper">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(formatCardNumber(e.target.value));
                  if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' }));
                }}
                placeholder="0000 0000 0000 0000"
                className="pay-input"
                maxLength={19}
              />
            </div>
            {errors.cardNumber && <span className="pay-error-text">{errors.cardNumber}</span>}
          </div>
          <div className={`pay-form-group ${errors.cardName ? 'error' : ''}`}>
            <label className="pay-form-label">
              Name on Card <span className="pay-required">*</span>
            </label>
            <div className="pay-input-wrapper">
              <input
                type="text"
                value={cardName}
                onChange={(e) => {
                  setCardName(e.target.value);
                  if (errors.cardName) setErrors(prev => ({ ...prev, cardName: '' }));
                }}
                placeholder="Full name as on card"
                className="pay-input"
              />
            </div>
            {errors.cardName && <span className="pay-error-text">{errors.cardName}</span>}
          </div>
          <div className="pay-form-row">
            <div className={`pay-form-group ${errors.cardExpiry ? 'error' : ''}`}>
              <label className="pay-form-label">
                Expiry (MM/YY) <span className="pay-required">*</span>
              </label>
              <div className="pay-input-wrapper">
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => {
                    setCardExpiry(formatExpiry(e.target.value));
                    if (errors.cardExpiry) setErrors(prev => ({ ...prev, cardExpiry: '' }));
                  }}
                  placeholder="MM / YY"
                  className="pay-input"
                  maxLength={7}
                />
              </div>
              {errors.cardExpiry && <span className="pay-error-text">{errors.cardExpiry}</span>}
            </div>
            <div className={`pay-form-group ${errors.cardCvv ? 'error' : ''}`}>
              <label className="pay-form-label">
                CVV <span className="pay-required">*</span>
              </label>
              <div className="pay-input-wrapper">
                <input
                  type="password"
                  value={cardCvv}
                  onChange={(e) => {
                    setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                    if (errors.cardCvv) setErrors(prev => ({ ...prev, cardCvv: '' }));
                  }}
                  placeholder="123"
                  className="pay-input"
                  maxLength={4}
                />
              </div>
              {errors.cardCvv && <span className="pay-error-text">{errors.cardCvv}</span>}
            </div>
          </div>
        </div>
      )}
      {selectedMethod === 'netbanking' && (
        <div className="pay-method-form">
          <div className="pay-netbanking-placeholder">
            <HugeiconsIcon icon={BankIcon} size={32} />
            <span className="pay-placeholder-title">Net Banking</span>
            <span className="pay-placeholder-desc">You will be redirected to your bank's secure payment page to complete the transaction.</span>
          </div>
        </div>
      )}
      {selectedMethod === 'wallet' && (
        <div className="pay-method-form">
          <div className="pay-wallet-placeholder">
            <HugeiconsIcon icon={Wallet02Icon} size={32} />
            <span className="pay-placeholder-title">Wallets</span>
            <span className="pay-placeholder-desc">Pay using your preferred wallet. Razorpay will handle the wallet selection at checkout.</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityCard = () => (
    <div className="pay-card pay-security-card">
      <div className="pay-security-header">
        <div className="pay-security-icon">
          <HugeiconsIcon icon={LockIcon} size={24} />
        </div>
        <div>
          <h3 className="pay-security-title">Secure Payment</h3>
          <p className="pay-security-desc">Your payment is protected with 256-bit SSL encryption</p>
        </div>
      </div>
      <div className="pay-security-badges">
        <div className="pay-security-badge">
          <ShieldTickIcon />
          <span>PCI DSS Compliant</span>
        </div>
        <div className="pay-security-badge">
          <HugeiconsIcon icon={LockIcon} size={16} />
          <span>256-bit SSL</span>
        </div>
        <div className="pay-security-badge">
          <HugeiconsIcon icon={RupeeShieldIcon} size={16} />
          <span>Razorpay Secure</span>
        </div>
      </div>
    </div>
  );

  const renderPolicyCard = () => (
    <div className="pay-card pay-policy-card">
      <div className="pay-policy-item">
        <div className="pay-policy-icon">
          <ShieldTickIcon />
        </div>
        <div className="pay-policy-text">
          <span className="pay-policy-title">Free Cancellation</span>
          <span className="pay-policy-desc">Cancel up to 24 hours before check-in for a full refund.</span>
        </div>
      </div>
      <div className="pay-policy-item">
        <div className="pay-policy-icon">
          <ClockIcon />
        </div>
        <div className="pay-policy-text">
          <span className="pay-policy-title">Check-in / Check-out</span>
          <span className="pay-policy-desc">Check-in: 12:00 PM &middot; Check-out: 11:00 AM</span>
        </div>
      </div>
    </div>
  );

  const renderTermsSection = () => (
    <div className="pay-card pay-terms-card">
      <div className={`pay-checkbox-group ${errors.agreeTerms ? 'error' : ''}`}>
        <label className="pay-checkbox-label">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (errors.agreeTerms) setErrors(prev => ({ ...prev, agreeTerms: '' }));
            }}
            className="pay-checkbox"
          />
          <span className="pay-checkbox-custom">
            {agreeTerms && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </span>
          <span className="pay-checkbox-text">
            I agree to the <button type="button" className="pay-link-btn" onClick={() => setCurrentPage && setCurrentPage('terms-conditions')}>Terms & Conditions</button>, <button type="button" className="pay-link-btn" onClick={() => setCurrentPage && setCurrentPage('cancellation-policy')}>Cancellation Policy</button>, and authorize the payment of Rs.{totalAmount.toLocaleString('en-IN')} for this booking.
          </span>
        </label>
        {errors.agreeTerms && <span className="pay-error-text">{errors.agreeTerms}</span>}
      </div>
    </div>
  );

  const renderPayButton = () => (
    <div className="pay-card pay-action-card">
      <div className="pay-action-summary">
        <div className="pay-action-amount">
          <span className="pay-action-label">Total Payable</span>
          <span className="pay-action-value">Rs.{totalAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="pay-action-meta">
          <span>{nights} night{nights > 1 ? 's' : ''} &middot; {guests.adults + guests.children} guests</span>
        </div>
      </div>
      <button
        className={`pay-btn-primary ${isProcessing ? 'processing' : ''}`}
        onClick={handlePayNow}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <span className="pay-spinner"></span>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Pay Rs.{totalAmount.toLocaleString('en-IN')}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
          </>
        )}
      </button>
      <div className="pay-action-secure">
        <HugeiconsIcon icon={LockIcon} size={14} />
        <span>Secure payment powered by Razorpay</span>
      </div>
    </div>
  );

  const renderHelpCard = () => (
    <div className="pay-card pay-help-card">
      <div className="pay-help-header">
        <div className="pay-help-icon">
          <HugeiconsIcon icon={Call02Icon} size={24} />
        </div>
        <div>
          <h4 className="pay-help-title">Need Help?</h4>
          <p className="pay-help-desc">Our team is here to assist you</p>
        </div>
      </div>
      <div className="pay-help-actions">
        <a href="https://wa.me/917037189517" target="_blank" rel="noopener noreferrer" className="pay-help-btn pay-whatsapp-btn">
          <FaWhatsapp size={18} />
          <span>WhatsApp Us</span>
        </a>
        <a href="tel:+917037189517" className="pay-help-btn pay-call-btn">
          <HugeiconsIcon icon={Call02Icon} size={18} />
          <span>Call Now</span>
        </a>
      </div>
    </div>
  );

  return (
    <section className="pay-section">
      <div className="pay-container">
        <div className="pay-nav">
          <button className="pay-back-btn" onClick={handleBack}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
            <span>Back to Guest Details</span>
          </button>
        </div>

        {renderProgressBar()}

        <div className="pay-page-header">
          <h1 className="pay-page-title">Payment</h1>
          <p className="pay-page-subtitle">Complete your booking securely</p>
        </div>

        <div className="pay-layout">
          <div className="pay-left">
            {renderRoomSummary()}
            {renderPaymentMethods()}
            {renderSecurityCard()}
            {renderTermsSection()}
          </div>
          <div className="pay-right">
            <div className="pay-sidebar-sticky">
              {renderPriceBreakdown()}
              {renderPayButton()}
              {renderPolicyCard()}
              {renderHelpCard()}
            </div>
          </div>
        </div>

        <div className="pay-mobile-layout">
          {renderRoomSummary()}
          {renderPriceBreakdown()}
          {renderPaymentMethods()}
          {renderSecurityCard()}
          {renderTermsSection()}
          {renderPayButton()}
          {renderPolicyCard()}
          {renderHelpCard()}
        </div>
      </div>
    </section>
  );
};

export default Payment;