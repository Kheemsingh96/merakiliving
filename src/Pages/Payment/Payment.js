import React, { useState, useEffect } from 'react';
import './Payment.css';

import room1 from '../../assets/images/room-1.webp';
import room2 from '../../assets/images/room-2.webp';
import room3 from '../../assets/images/room-3.webp';
import gpayLogo from '../../assets/images/gpay.webp';
import phonepeLogo from '../../assets/images/phonepe.webp';
import paytmLogo from '../../assets/images/paytm.webp';
import bhimLogo from '../../assets/images/bhim.webp';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft02Icon,
  BedDoubleIcon,
  SecurityValidationIcon,
  CreditCardPosIcon,
  BankIcon,
  Wallet02Icon,
  User03Icon,
  Mail01Icon,
  Call02Icon,
  DiscountIcon,
  CheckmarkCircle01Icon
} from '@hugeicons/core-free-icons';

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

const roomsData = [
  {
    id: 1,
    tag: 'Mountain View',
    image: room1,
    title: 'Himalayan View Room',
    price: '3,500',
    rating: 4.9,
    reviews: 128
  },
  {
    id: 2,
    tag: 'Valley Surroundings',
    image: room2,
    title: 'Premium Valley Room',
    price: '4,500',
    rating: 4.8,
    reviews: 96
  },
  {
    id: 3,
    tag: 'Family Comfort',
    image: room3,
    title: 'Luxury Family Suite',
    price: '6,000',
    rating: 5.0,
    reviews: 84
  }
];

const paymentMethods = [
  { id: 'upi', label: 'UPI', subtitle: 'Google Pay, PhonePe, Paytm', icon: SmartphoneIcon },
  { id: 'card', label: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay', icon: CreditCardPosIcon },
  { id: 'netbanking', label: 'Net Banking', subtitle: 'All major banks supported', icon: BankIcon },
  { id: 'wallet', label: 'Wallets', subtitle: 'Paytm, PhonePe, Amazon Pay', icon: Wallet02Icon }
];

const upiOptions = [
  { id: 'gpay', label: 'Google Pay', image: gpayLogo, link: 'upi://pay' },
  { id: 'phonepe', label: 'PhonePe', image: phonepeLogo, link: 'phonepe://pay' },
  { id: 'paytm', label: 'Paytm', image: paytmLogo, link: 'paytmmp://pay' },
  { id: 'bhim', label: 'BHIM UPI', image: bhimLogo, link: 'bhim://pay' }
];

const cardNetworks = [
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'rupay', label: 'RuPay' },
  { id: 'amex', label: 'Amex' }
];

const formatText = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const formatEmail = (email) => {
  if (!email) return '';
  return email.toLowerCase();
};

const Payment = ({ setCurrentPage, goBack, selectedRoomId = 1 }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [currentStep] = useState(3);
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

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const [guestData, setGuestData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+91'
  });

  const room = roomsData.find(r => r.id === selectedRoomId) || roomsData[0];

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    
    try {
      const savedDetails = sessionStorage.getItem('meraki_guestDetails');
      if (savedDetails) {
        const parsed = JSON.parse(savedDetails);
        setGuestData({
          firstName: parsed.firstName || '',
          lastName: parsed.lastName || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          countryCode: parsed.countryCode || '+91'
        });
      }
      
      const savedCoupon = sessionStorage.getItem('meraki_couponCode');
      const isApplied = sessionStorage.getItem('meraki_couponApplied') === 'true';
      if (savedCoupon && isApplied) {
        setCouponCode(savedCoupon);
        setCouponApplied(true);
      }
    } catch (e) {
    }
    
    return () => clearTimeout(timer);
  }, []);

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
      sessionStorage.setItem('meraki_couponApplied', 'true');
      sessionStorage.setItem('meraki_couponCode', couponCode.trim().toUpperCase());
    } else {
      setCouponApplied(false);
      setCouponError('Invalid coupon code. Try MERAKI8');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setCouponError('');
    sessionStorage.removeItem('meraki_couponApplied');
    sessionStorage.removeItem('meraki_couponCode');
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
      if (cardExpiry.length < 4) {
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
    }, 1500);
  };

  const handleBack = () => {
    if (goBack) {
      goBack('guest-details');
    } else if (setCurrentPage) {
      setCurrentPage('guest-details');
    }
  };

  const handleUpiClick = (upi) => {
    setSelectedUpi(upi.id);
    if (window.innerWidth <= 768) {
      window.location.href = upi.link;
    }
  };

  const steps = [
    { label: 'Your Stay', number: 1, icon: BedDoubleIcon },
    { label: 'Guest Details', number: 2, icon: User03Icon },
    { label: 'Payment', number: 3, icon: CreditCardPosIcon },
    { label: 'Confirmation', number: 4, icon: SecurityValidationIcon }
  ];

  const renderProgressBar = () => (
    <div className="pay-steps">
      {steps.map((step, idx) => {
        const isActive = step.number <= currentStep;
        const isCurrent = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        return (
          <div key={step.number} className={`pay-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}>
            <div className="pay-step-track">
              {idx > 0 && (
                <div className={`pay-step-track-line pay-step-track-left ${isActive ? 'filled' : ''}`}></div>
              )}
              <div className="pay-step-circle">
                <HugeiconsIcon icon={step.icon} size={14} />
              </div>
              {idx < steps.length - 1 && (
                <div className={`pay-step-track-line pay-step-track-right ${isCompleted ? 'filled' : ''}`}></div>
              )}
            </div>
            <span className="pay-step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );

  const renderGuestDetails = () => (
    <div className="pay-card pay-summary-card">
      <div className="pay-summary-header" style={{ marginBottom: '16px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="pay-payment-icon" style={{ width: '36px', height: '36px' }}>
            <HugeiconsIcon icon={User03Icon} size={18} />
          </div>
          <h3 className="pay-payment-title">Guest Information</h3>
        </div>
        <button className="pay-link-btn" onClick={handleBack} style={{ fontSize: '13px' }}>Edit Details</button>
      </div>
      
      <div className="pay-summary-details">
        <div className="pay-guest-premium-grid">
          <div className="pay-guest-item">
            <span className="pay-summary-label">Full Name</span>
            <span className="pay-summary-value">
              {guestData.firstName || guestData.lastName 
                ? `${formatText(guestData.firstName)} ${formatText(guestData.lastName)}`
                : '-'}
            </span>
          </div>
          <div className="pay-guest-item">
            <span className="pay-summary-label">Email Address</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HugeiconsIcon icon={Mail01Icon} size={14} color="#888" />
              <span className="pay-summary-value">{formatEmail(guestData.email) || '-'}</span>
            </div>
          </div>
          <div className="pay-guest-item">
            <span className="pay-summary-label">Mobile Number</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HugeiconsIcon icon={Call02Icon} size={14} color="#888" />
              <span className="pay-summary-value">
                {guestData.phone ? `${guestData.countryCode} ${guestData.phone}` : '-'}
              </span>
            </div>
          </div>
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
          <p className="pay-payment-desc">All transactions are secure and encrypted.</p>
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
        <div className="pay-method-form animate-fade-in">
          <div className="pay-upi-options">
            {upiOptions.map((upi) => (
              <button
                key={upi.id}
                className={`pay-upi-option ${selectedUpi === upi.id ? 'active' : ''}`}
                onClick={() => handleUpiClick(upi)}
              >
                <img src={upi.image} alt={upi.label} className="pay-upi-img" />
                <span className="pay-upi-name">{upi.label}</span>
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
          </div>
        </div>
      )}

      {selectedMethod === 'card' && (
        <div className="pay-method-form animate-fade-in">
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
          
          <div className="pay-card-fields-container">
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
        </div>
      )}

      {(selectedMethod === 'netbanking' || selectedMethod === 'wallet') && (
        <div className="pay-method-form animate-fade-in">
          <div className="pay-placeholder">
            <HugeiconsIcon icon={selectedMethod === 'netbanking' ? BankIcon : Wallet02Icon} size={32} />
            <span className="pay-placeholder-title">{selectedMethod === 'netbanking' ? 'Net Banking' : 'Wallets'}</span>
            <span className="pay-placeholder-desc">You will be redirected to the secure payment page to complete the transaction.</span>
          </div>
        </div>
      )}
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
            I agree to the <button type="button" className="pay-link-btn" onClick={() => setCurrentPage && setCurrentPage('terms-conditions')}>Terms & Conditions</button>, <button type="button" className="pay-link-btn" onClick={() => setCurrentPage && setCurrentPage('cancellation-policy')}>Cancellation Policy</button>, and authorize the payment.
          </span>
        </label>
        {errors.agreeTerms && <span className="pay-error-text">{errors.agreeTerms}</span>}
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
          <span className="pay-price-room-meta">{nights} nights &middot; {guests.adults + guests.children} guests</span>
        </div>
      </div>
      <div className="pay-price-divider"></div>
      
      <div className="pay-price-breakdown">
        <div className="pay-price-row">
          <span>Rs.{room.price} x {nights} night{nights > 1 ? 's' : ''}</span>
          <span>Rs.{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className={`pay-price-row ${couponApplied ? 'pay-discount' : ''}`}>
          <span>Coupon Discount</span>
          <span>{couponApplied ? `-Rs.${discountAmount.toLocaleString('en-IN')}` : 'Rs.0'}</span>
        </div>
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

      <div className="pay-coupon-section">
        {!couponApplied ? (
          <div className="pay-coupon-input-wrapper">
            <div className="pay-coupon-input-box">
              <HugeiconsIcon icon={DiscountIcon} size={18} />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="pay-coupon-input"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
            </div>
            <button className="pay-coupon-btn" onClick={handleApplyCoupon}>
              Apply
            </button>
          </div>
        ) : (
          <div className="pay-coupon-applied">
            <div className="pay-coupon-applied-left">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
              <div>
                <span className="pay-coupon-code">{couponCode.toUpperCase()}</span>
                <span className="pay-coupon-saved">You saved Rs.{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button className="pay-coupon-remove" onClick={handleRemoveCoupon}>
              Remove
            </button>
          </div>
        )}
        {couponError && <span className="pay-coupon-error">{couponError}</span>}
      </div>
      
      <div className="pay-price-divider" style={{ marginTop: '20px' }}></div>

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
          <span>Pay Rs.{totalAmount.toLocaleString('en-IN')}</span>
        )}
      </button>
      <div className="pay-secure-checkout" style={{ marginTop: '12px' }}>
        <HugeiconsIcon icon={SecurityValidationIcon} size={14} />
        <span>100% Safe & Secure Checkout</span>
      </div>
    </div>
  );

  return (
    <section className={`pay-section ${animateIn ? 'pay-animate' : ''}`}>
      <div className="pay-container">
        <div className="pay-nav">
          <button
            className="pay-back-btn"
            onClick={handleBack}
            aria-label="Back to Guest Details"
            title="Back to Guest Details"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
          </button>
        </div>

        {renderProgressBar()}

        <div className="pay-page-header">
          <h1 className="pay-page-title">Payment</h1>
          <p className="pay-page-subtitle">Complete your booking securely</p>
        </div>

        <div className="pay-layout">
          <div className="pay-left">
            {renderGuestDetails()}
            {renderPaymentMethods()}
            {renderTermsSection()}
          </div>
          
          <div className="pay-right">
            <div className="pay-sidebar-sticky">
              {renderPriceBreakdown()}
            </div>
          </div>
        </div>

        <div className="pay-mobile-layout">
          {renderGuestDetails()}
          {renderPaymentMethods()}
          {renderTermsSection()}
          {renderPriceBreakdown()}
        </div>
      </div>
    </section>
  );
};

export default Payment;