import { FaWhatsapp } from 'react-icons/fa';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './GuestDetails.css';
import { parseRoomTitle } from '../../components/Rooms/Rooms';
import { useRooms } from '../../hooks/useRooms';
import { API_CONFIG_URL } from '../../config/api';
import { isPrerendering, safeParseResponse } from '../../utils/apiHelper';
import OptimizedImage from '../../components/Common/OptimizedImage';

import room1 from '../../assets/images/room-1.avif';
import room2 from '../../assets/images/room-2.avif';
import room3 from '../../assets/images/room-3.avif';
import room4 from '../../assets/images/room-4.avif';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BedDoubleIcon,
  Calendar01Icon,
  Call02Icon,
  CheckmarkCircle01Icon,
  CheckmarkBadge01Icon,
  Edit02Icon,
  StarIcon,
  UserMultiple02Icon,
  RupeeShieldIcon,
  User03Icon,
  Mail01Icon,
  Home07Icon,
  SecurityValidationIcon,
  BulbChargingIcon,

  DiscountIcon,} from '@hugeicons/core-free-icons';

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



const roomsData = [
  {
    id: 4,
    tag: 'Entire Property',
    image: room4,
    title: 'Entire Homestay',
    desc: 'Book the entire Meraki Living homestay for complete privacy and a memorable stay with your loved ones.',
    price: '22,000',
    rating: 5.0,
    reviews: 42,
    guests: '14 Guests',
    bed: 'Multiple Rooms',
    view: 'Panoramic View',
    size: '1200 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Power Backup', 'Kitchen'],
    gallery: [room4, room4, room4, room4]
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
    guests: '2 Guests',
    bed: 'Premium Room',
    view: 'Extra Space',
    size: '450 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Power Backup', 'Kitchenette'],
    gallery: [room3, room3, room3, room3]
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
    amenities: ['Free WiFi', 'Free Parking', 'Power Backup', 'Balcony'],
    gallery: [room2, room2, room2, room2]
  },
  {
    id: 1,
    tag: 'Peaceful Stay',
    image: room1,
    title: 'Himalayan View Room',
    desc: 'Peaceful room surrounded by nature, designed for couples and relaxing escapes.',
    price: '3,500',
    rating: 4.9,
    reviews: 128,
    guests: '2 Guests',
    bed: 'King Bed',
    view: 'Nature View',
    size: '280 sq ft',
    amenities: ['Free WiFi', 'Free Parking', 'Power Backup', 'Room Heater'],
    gallery: [room1, room1, room1, room1]
  }
];



const EMPTY_GUEST_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  countryCode: '+91',
  agreeTerms: false,
  agreePrivacy: false
};

const DEFAULT_TERMS_CONDITIONS = `
<div style="font-family: inherit; color: #373737;">
  <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #1e293b;">1. Check-in & Check-out</h3>
  <p style="margin-bottom: 14px;"><strong>Check-in:</strong> 12:00 PM onwards &middot; <strong>Check-out:</strong> 11:00 AM<br/>Early check-in or late check-out is subject to availability and may attract additional charges.</p>
  <h3 style="margin-bottom: 8px; font-size: 16px; color: #1e293b;">2. Occupancy & Identification</h3>
  <p style="margin-bottom: 14px;">Only the number of guests mentioned in the booking are permitted to stay. All adult guests must present a valid government-issued photo ID at check-in.</p>
  <h3 style="margin-bottom: 8px; font-size: 16px; color: #1e293b;">3. Property Care & Quiet Hours</h3>
  <p style="margin-bottom: 14px;">Guests are requested to respect the serene mountain environment and observe quiet hours between 10:00 PM and 7:00 AM.</p>
  <h3 style="margin-bottom: 8px; font-size: 16px; color: #1e293b;">4. Smoking, Alcohol & Pets</h3>
  <p style="margin-bottom: 14px;">Smoking is strictly prohibited inside the cottages. Alcohol may be consumed responsibly. Pets are welcome only with prior approval.</p>
</div>
`;

const DEFAULT_CANCELLATION_POLICY = `
<div style="font-family: inherit; color: #373737;">
  <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #1e293b;">Free Cancellation</h3>
  <p style="margin-bottom: 14px;">Cancel up to 24 hours before your check-in date for a 100% full refund.</p>
  <h3 style="margin-bottom: 8px; font-size: 16px; color: #1e293b;">Late Cancellation</h3>
  <p style="margin-bottom: 14px;">Cancellations made within 24 hours of check-in may incur a one-night charge. No-shows will be charged the full booking amount.</p>
  <h3 style="margin-bottom: 8px; font-size: 16px; color: #1e293b;">Refund Timeline</h3>
  <p style="margin-bottom: 14px;">Approved refunds are processed back to the original payment method within 5-7 business days.</p>
</div>
`;

const DEFAULT_PRIVACY_POLICY = `
<div style="font-family: inherit; color: #373737;">
  <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #1e293b;">Information We Collect</h3>
  <p style="margin-bottom: 14px;">When you make a reservation, we collect your Name, Email address, and Mobile number solely to process your booking and communicate essential stay details.</p>
  <h3 style="margin-bottom: 8px; font-size: 16px; color: #1e293b;">Payment Security</h3>
  <p style="margin-bottom: 14px;">Payment information is processed securely through Razorpay. We do not store your credit card or UPI credentials on our servers.</p>
  <h3 style="margin-bottom: 8px; font-size: 16px; color: #1e293b;">Data Protection</h3>
  <p style="margin-bottom: 14px;">We never sell, rent, or trade your personal information with third parties.</p>
</div>
`;

const shouldRestoreGuestData = () => {
  try {
    if (typeof window === 'undefined') return false;
    return !!(sessionStorage.getItem('meraki_guestDetails') || localStorage.getItem('meraki_guestDetails'));
  } catch (e) {
    return false;
  }
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const GuestDetails = ({ setCurrentPage, goBack, selectedRoomId = 1 }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [activePolicyModal, setActivePolicyModal] = useState(null);
  const [policySettings, setPolicySettings] = useState({
    terms: '',
    cancellation: '',
    privacy: ''
  });
  const sentEmailBookingsRef = useRef(new Set());
  const paymentCompletedRef = useRef(false);
  const hasReachedPaymentRef = useRef(false);
  const latestPendingRef = useRef(null);

  const [formData, setFormData] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedDetails = sessionStorage.getItem('meraki_guestDetails') || localStorage.getItem('meraki_guestDetails');
        if (savedDetails) {
          const parsed = JSON.parse(savedDetails);
          if (parsed && typeof parsed === 'object') {
            return { ...EMPTY_GUEST_FORM, ...parsed };
          }
        }
      }
    } catch (e) {}
    return { ...EMPTY_GUEST_FORM };
  });

  const [errors, setErrors] = useState({});
  const [showAmenities, setShowAmenities] = useState(false);
  const [couponCode, setCouponCode] = useState(() =>
    shouldRestoreGuestData() ? sessionStorage.getItem('meraki_couponCode') || '' : ''
  );
  const [couponApplied, setCouponApplied] = useState(() =>
    shouldRestoreGuestData() && sessionStorage.getItem('meraki_couponApplied') === 'true'
  );
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(() => {
    const stored = shouldRestoreGuestData() ? sessionStorage.getItem('meraki_couponDiscount') : null;
    return stored ? parseFloat(stored) : 0;
  });
  const [couponError, setCouponError] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    if (isPrerendering()) return;
    fetch(`${API_CONFIG_URL}/api_coupons.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success') {
          setAvailableCoupons(data.data.filter(c => c.status === 'Active'));
        }
      })
      .catch(err => {
        if (process.env.NODE_ENV === 'development' && !isPrerendering()) {
          console.warn("Could not fetch coupons:", err);
        }
      });

    fetch(`${API_CONFIG_URL}/api_settings.php`)
      .then(res => safeParseResponse(res))
      .then(parsed => {
        const data = parsed.data;
        if (parsed.ok && data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
          setPolicySettings({
            terms: data.data[0].terms_conditions || '',
            cancellation: data.data[0].cancellation_policy || '',
            privacy: data.data[0].privacy_policy || ''
          });
        }
      })
      .catch(() => {});
  }, []);

  const openPolicyView = useCallback((type) => {
    try {
      const serialized = JSON.stringify(formData);
      sessionStorage.setItem('meraki_guestDetails', serialized);
      sessionStorage.setItem('meraki_restoreGuestDetails', 'true');
      localStorage.setItem('meraki_guestDetails', serialized);
    } catch (e) {}

    if (type === 'terms') {
      setActivePolicyModal({
        title: 'Terms & Conditions',
        content: policySettings.terms || DEFAULT_TERMS_CONDITIONS
      });
    } else if (type === 'cancellation') {
      setActivePolicyModal({
        title: 'Cancellation Policy',
        content: policySettings.cancellation || DEFAULT_CANCELLATION_POLICY
      });
    } else if (type === 'privacy') {
      setActivePolicyModal({
        title: 'Privacy Policy',
        content: policySettings.privacy || DEFAULT_PRIVACY_POLICY
      });
    }
  }, [formData, policySettings]);

  const { rooms } = useRooms(roomsData);
  const room = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  const storedCheckIn = sessionStorage.getItem('meraki_checkIn');
  const storedCheckOut = sessionStorage.getItem('meraki_checkOut');
  const storedGuests = sessionStorage.getItem('meraki_guests');

  const parseSafeDate = (dateStr, fallbackDays = 0) => {
    if (!dateStr) return new Date(new Date().setDate(new Date().getDate() + fallbackDays));
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date(new Date().setDate(new Date().getDate() + fallbackDays)) : d;
  };

  const checkInDate = parseSafeDate(storedCheckIn, 0);
  const checkOutDate = parseSafeDate(storedCheckOut, 1);

  const guests = useMemo(() => {
    let g = { adults: 2, children: 0, rooms: 1 };
    try {
      if (storedGuests) {
        const parsed = JSON.parse(storedGuests);
        g = {
          adults: parsed.adults || 2,
          children: parsed.children || 0,
          rooms: parsed.rooms || 1
        };
      }
    } catch (e) { }
    return g;
  }, [storedGuests]);

  let nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  if (isNaN(nights) || nights < 1) nights = 1;

  const priceString = String(room.price).replace(/,/g, '');
  let pricePerNight = parseInt(priceString) || 3500;
  let extraChargePerNight = 0;

  if (room.id === 2 || room.id === 3) {
    const adultsPerRoom = Math.ceil(guests.adults / guests.rooms);
    const kidsPerRoom = Math.ceil(guests.children / guests.rooms);
    const extraAdults = Math.max(0, adultsPerRoom - 2);
    const extraKids = Math.max(0, kidsPerRoom - 2);
    extraChargePerNight = (extraAdults * 1000) + (extraKids * 500);
  } else if (room.id === 4) {
    const extraAdults = Math.max(0, guests.adults - 12);
    const extraKids = Math.max(0, (guests.children || 0) - 2);
    extraChargePerNight = (extraAdults * 1000) + (extraKids * 500);
  }
  
  const multiplier = room.id === 4 ? 1 : guests.rooms;
  const subtotal = (pricePerNight + extraChargePerNight) * nights * multiplier;
  const discountAmount = couponApplied ? Math.round(subtotal * (couponDiscountPercent / 100)) : 0;
  const taxableAmount = subtotal - discountAmount;
  const taxes = Math.round(taxableAmount * 0.05);
  const totalAmount = taxableAmount + taxes;

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    sessionStorage.removeItem('meraki_bookingId');
    sessionStorage.removeItem('meraki_paymentAmount');
    sessionStorage.removeItem('meraki_paymentMethod');
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Add Dates';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ (\d{4})$/, ', $1');
  };

  const formatDateForDB = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  };

  const getDayName = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { weekday: 'long' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      try {
        const serialized = JSON.stringify(updated);
        sessionStorage.setItem('meraki_guestDetails', serialized);
        sessionStorage.setItem('meraki_restoreGuestDetails', 'true');
        localStorage.setItem('meraki_guestDetails', serialized);
      } catch (err) {}
      return updated;
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (emailStr) => {
    if (!emailStr || typeof emailStr !== 'string') return false;
    const email = emailStr.trim();
    if (email.length < 5 || email.length > 254) return false;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email)) return false;
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) return false;
    const parts = email.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1] || parts[0].length > 64) return false;
    const domainParts = parts[1].split('.');
    const tld = domainParts[domainParts.length - 1];
    if (!tld || tld.length < 2 || !/^[a-zA-Z]{2,}$/.test(tld)) return false;
    const fakePatterns = [/^test@test\./i, /^abc@xyz\./i, /^fake@fake\./i, /^admin@admin\./i, /^sample@sample\./i];
    if (fakePatterns.some(pat => pat.test(email))) return false;
    return true;
  };

  const validatePhone = (phoneStr, code = '+91') => {
    if (!phoneStr || typeof phoneStr !== 'string') return false;
    const digits = phoneStr.replace(/\D/g, '');
    switch (code) {
      case '+91': // India: 10 digits starting with 6, 7, 8, 9
        return /^[6-9]\d{9}$/.test(digits);
      case '+1': // USA/Canada: 10 digits, area code 2-9
        return /^[2-9]\d{9}$/.test(digits);
      case '+44': // UK: 10 to 11 digits
        return /^[1-9]\d{9,10}$/.test(digits);
      case '+61': // Australia: 9 to 10 digits
        return /^[1-9]\d{8,9}$/.test(digits);
      case '+971': // UAE: 9 digits
        return /^[1-9]\d{8}$/.test(digits);
      case '+65': // Singapore: 8 digits
        return /^[689]\d{7}$/.test(digits);
      case '+81': // Japan: 10 to 11 digits
        return /^[1-9]\d{9,10}$/.test(digits);
      case '+49': // Germany: 10 to 11 digits
        return /^[1-9]\d{9,10}$/.test(digits);
      default:
        return digits.length >= 7 && digits.length <= 15;
    }
  };

  const getPhoneErrorMessage = (code = '+91') => {
    switch (code) {
      case '+91':
        return 'Please enter a valid 10-digit Indian mobile number';
      case '+1':
        return 'Please enter a valid 10-digit US/Canada phone number';
      case '+44':
        return 'Please enter a valid 10 to 11-digit UK phone number';
      case '+61':
        return 'Please enter a valid 9 to 10-digit Australian phone number';
      case '+971':
        return 'Please enter a valid 9-digit UAE phone number';
      case '+65':
        return 'Please enter a valid 8-digit Singapore phone number';
      default:
        return 'Please enter a valid phone number for your selected country';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fName = (formData.firstName || '').replace(/[<>]/g, '').trim();
    const lName = (formData.lastName || '').replace(/[<>]/g, '').trim();
    const emailVal = (formData.email || '').trim();
    const phoneDigits = (formData.phone || '').replace(/\D/g, '');

    if (!fName) {
      newErrors.firstName = 'First name is required';
    } else if (fName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!lName) {
      newErrors.lastName = 'Last name is required';
    } else if (lName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!emailVal) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(emailVal)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com)';
    }

    if (!phoneDigits) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone, formData.countryCode)) {
      newErrors.phone = getPhoneErrorMessage(formData.countryCode);
    }

    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    if (!formData.agreePrivacy) newErrors.agreePrivacy = 'You must agree to the privacy policy';
    return newErrors;
  };

  const savePendingBooking = useCallback((currentForm = formData) => {
    const fName = (currentForm.firstName || '').replace(/[<>]/g, '').trim();
    const lName = (currentForm.lastName || '').replace(/[<>]/g, '').trim();
    const cleanPhone = (currentForm.phone || '').replace(/\D/g, '');
    const cleanEmail = (currentForm.email || '').trim().toLowerCase();

    // Requires at least Name and Phone to be considered a valid pending booking lead
    const fullName = `${fName} ${lName}`.trim() || fName || lName || 'Guest';
    const hasName = fName.length >= 1 || lName.length >= 1;
    const hasPhone = cleanPhone.length >= 7;
    if (!hasName || !hasPhone) return null;
    const fullPhone = `${currentForm.countryCode || '+91'} ${cleanPhone}`;

    let pendingRef = sessionStorage.getItem('meraki_pending_booking_ref');
    if (!pendingRef) {
      pendingRef = `MERI_P${Date.now()}`;
      sessionStorage.setItem('meraki_pending_booking_ref', pendingRef);
    }

    const pendingBookingObj = {
      id: pendingRef,
      booking_reference: 'MERI',
      formattedId: 'MERI',
      guest_name: fullName,
      guest_email: cleanEmail || 'N/A',
      guest_phone: fullPhone,
      guest_id: null,
      room_id: selectedRoomId,
      room_name: room.title,
      image: room.image,
      check_in: formatDateForDB(checkInDate),
      check_out: formatDateForDB(checkOutDate),
      check_in_display: formatDate(checkInDate),
      check_out_display: formatDate(checkOutDate),
      guest_count: guests.adults + guests.children,
      guest_count_display: `${guests.adults + guests.children} Guests`,
      amount: totalAmount,
      room_price: totalAmount,
      paid_amount: 0,
      payment_status: 'Pending',
      payment_method: 'Pending',
      status: 'Pending',
      booking_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    latestPendingRef.current = pendingBookingObj;

    // Save in session and local storage under meraki_pending_bookings
    try {
      ['meraki_pending_bookings'].forEach(key => {
        [sessionStorage, localStorage].forEach(store => {
          try {
            const raw = store.getItem(key);
            const list = raw ? JSON.parse(raw) : [];
            const filtered = Array.isArray(list) ? list.filter(b => b.id !== pendingRef && b.booking_reference !== pendingRef) : [];
            filtered.unshift(pendingBookingObj);
            store.setItem(key, JSON.stringify(filtered));
          } catch (e) {}
        });
      });
    } catch (e) {}

    try {
      const formStr = JSON.stringify(currentForm);
      sessionStorage.setItem('meraki_guestDetails', formStr);
      sessionStorage.setItem('meraki_restoreGuestDetails', 'true');
      localStorage.setItem('meraki_guestDetails', formStr);
    } catch (e) {}

    window.dispatchEvent(new Event('meraki_booking_updated'));

    // Non-blocking POST to backend api_bookings.php
    fetch(`${API_CONFIG_URL}/api_bookings.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...pendingBookingObj,
        action: 'save_pending'
      }),
      keepalive: true
    }).catch(() => {});

    return pendingBookingObj;
  }, [formData, selectedRoomId, room.title, room.image, checkInDate, checkOutDate, guests, totalAmount]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasReachedPaymentRef.current && !paymentCompletedRef.current) {
        savePendingBooking(formData);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (hasReachedPaymentRef.current && !paymentCompletedRef.current) {
        savePendingBooking(formData);
      }
    };
  }, [formData, savePendingBooking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);
    setConfirmedBooking(null);
    sessionStorage.removeItem('meraki_bookingId');
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Payment gateway failed to load. Please check your internet connection.");
      setIsProcessing(false);
      return;
    }

    try {
      const orderResponse = await fetch(`${API_CONFIG_URL}/api/bookings/create_order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount })
      });
      
      const orderData = await orderResponse.json();

      if (!orderData.id) {
        alert("Server response: " + JSON.stringify(orderData));
        setIsProcessing(false);
        return;
      }

      hasReachedPaymentRef.current = true;

      const options = {
        key: "rzp_test_TTUNJUYE5Iw7qw", 
        amount: totalAmount * 100,
        currency: "INR",
        name: "Meraki Living Homestay",
        description: room.title,
        order_id: orderData.id,
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            if (!paymentCompletedRef.current) {
              savePendingBooking(formData);
            }
          }
        },
        handler: async function (response) {
          setIsVerifyingPayment(true);
          try {
            paymentCompletedRef.current = true;
            const fName = (formData.firstName || '').replace(/[<>]/g, '').trim();
            const lName = (formData.lastName || '').replace(/[<>]/g, '').trim();
            const cleanEmail = (formData.email || '').trim().toLowerCase();
            const cleanPhone = (formData.phone || '').replace(/\D/g, '');

            const finalData = {
              name: `${fName} ${lName}`.trim() || 'Guest',
              email: cleanEmail,
              phone: `${formData.countryCode} ${cleanPhone}`,
              room_id: selectedRoomId,
              check_in: formatDateForDB(checkInDate),
              check_out: formatDateForDB(checkOutDate),
              guest_count: guests.adults + guests.children,
              amount: totalAmount,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            const saveResponse = await fetch(`${API_CONFIG_URL}/api/bookings/create_booking.php`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(finalData)
            });

            const result = await saveResponse.json();
            if (result && (result.status === "success" || result.id || result.booking_reference || result.insert_id || result.data)) {
              let realBookingId = result.booking_reference || result.booking_id || result.bookingId || result.id || result.insert_id || result.insertId ||
                                  (result.data && (result.data.booking_reference || result.data.booking_id || result.data.bookingId || result.data.id || result.data.insert_id || result.data.insertId)) ||
                                  (result.booking && (result.booking.booking_reference || result.booking.id || result.booking.booking_id));

              if (!realBookingId) {
                realBookingId = `MERI${String(result.insert_id || result.id || Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`;
              }

              let finalDisplayId = '';
              const rawStr = String(realBookingId).trim();
              if (/^MERI/i.test(rawStr)) {
                finalDisplayId = rawStr.toUpperCase();
              } else if (/^\d+$/.test(rawStr)) {
                finalDisplayId = `MERI${rawStr.padStart(4, '0')}`;
              } else {
                finalDisplayId = rawStr;
              }

              // Remove the pending booking since it is now Confirmed
              const pRef = sessionStorage.getItem('meraki_pending_booking_ref');
              [sessionStorage, localStorage].forEach(store => {
                try {
                  const raw = store.getItem('meraki_pending_bookings');
                  if (raw) {
                    const list = JSON.parse(raw);
                    const filtered = Array.isArray(list) ? list.filter(b => {
                      if (pRef && (b.id === pRef || b.booking_reference === pRef)) return false;
                      const bPhone = String(b.guest_phone || '').replace(/\D/g, '');
                      if (cleanPhone && bPhone && bPhone.slice(-10) === cleanPhone.slice(-10)) return false;
                      return true;
                    }) : [];
                    store.setItem('meraki_pending_bookings', JSON.stringify(filtered));
                  }
                } catch (e) {}
              });
              sessionStorage.removeItem('meraki_pending_booking_ref');
              sessionStorage.removeItem('meraki_guestDetails');
              sessionStorage.removeItem('meraki_restoreGuestDetails');
              localStorage.removeItem('meraki_guestDetails');

              sessionStorage.setItem('meraki_bookingId', finalDisplayId);
              sessionStorage.setItem('meraki_paymentAmount', totalAmount);
              sessionStorage.setItem('meraki_paymentMethod', 'Online');

              const latestBookingObj = {
                id: finalDisplayId,
                booking_reference: finalDisplayId,
                formattedId: finalDisplayId,
                db_id: result.insert_id || result.id || (result.data && (result.data.id || result.data.insert_id)),
                guest_name: `${fName} ${lName}`.trim() || 'Guest',
                guest_email: cleanEmail,
                guest_phone: `${formData.countryCode} ${cleanPhone}`,
                room_id: selectedRoomId,
                room_name: room.title,
                image: room.image,
                check_in: formatDateForDB(checkInDate),
                check_out: formatDateForDB(checkOutDate),
                guest_count: guests.adults + guests.children,
                amount: totalAmount,
                paid_amount: totalAmount,
                payment_method: 'Online / Razorpay',
                status: 'Confirmed',
                booking_date: new Date().toISOString()
              };

              sessionStorage.setItem('meraki_latest_booking', JSON.stringify(latestBookingObj));
              sessionStorage.setItem('meraki_show_floating_booking', 'true');
              try {
                localStorage.setItem('meraki_confirmed_booking', JSON.stringify(latestBookingObj));
                localStorage.setItem('meraki_booking_updated_ts', Date.now().toString());
              } catch (e) {}
              window.dispatchEvent(new Event('meraki_booking_updated'));

              // Display confirmation message immediately without any delay
              setConfirmedBooking({
                id: finalDisplayId,
                name: `${fName} ${lName}`.trim() || 'Guest'
              });
              setIsVerifyingPayment(false);
              setIsProcessing(false);

              // Asynchronous background email trigger (non-blocking)
              if (!sentEmailBookingsRef.current.has(finalDisplayId)) {
                sentEmailBookingsRef.current.add(finalDisplayId);
                
                const emailPayload = {
                  userEmail: cleanEmail,
                  userName: `${fName} ${lName}`.trim(),
                  serviceName: `${room.title || 'Meraki Living Homestay'} (Booking ID: ${finalDisplayId})`,
                  date: `${formatDate(checkInDate)} to ${formatDate(checkOutDate)}`,
                  bookingId: finalDisplayId,
                  checkIn: formatDate(checkInDate),
                  checkOut: formatDate(checkOutDate),
                  roomName: room.title,
                  phone: `${formData.countryCode} ${cleanPhone}`,
                  amount: totalAmount
                };

                fetch(`${API_CONFIG_URL}/api_send_email.php`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(emailPayload),
                  keepalive: true
                }).catch(() => {});
              }
            } else {
              setIsVerifyingPayment(false);
              setIsProcessing(false);
              alert("Payment successful but booking failed: " + (result?.message || "Unknown error"));
            }
          } catch (err) {
            setIsVerifyingPayment(false);
            setIsProcessing(false);
            alert("Database Error: " + err.message);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: `${formData.countryCode.replace('+', '')}${formData.phone}`
        },
        theme: {
          color: "#800080"
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
        setIsProcessing(false);
        if (!paymentCompletedRef.current) {
          savePendingBooking(formData);
        }
      });

      paymentObject.open();
    } catch (error) {
      alert("Error Details: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    if (hasReachedPaymentRef.current && !paymentCompletedRef.current) {
      savePendingBooking(formData);
    }
    if (goBack) {
      goBack('booking');
    } else if (setCurrentPage) {
      setCurrentPage('booking');
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    const enteredCode = couponCode.trim().toUpperCase();
    const matchedCoupon = availableCoupons.find(c => c.code.toUpperCase() === enteredCode);

    if (matchedCoupon) {
      const percentage = parseFloat(matchedCoupon.discount_percentage) || 0;
      setCouponApplied(true);
      setCouponDiscountPercent(percentage);
      setCouponError('');
      sessionStorage.setItem('meraki_couponCode', enteredCode);
      sessionStorage.setItem('meraki_couponApplied', 'true');
      sessionStorage.setItem('meraki_couponDiscount', percentage);
    } else {
      setCouponApplied(false);
      setCouponDiscountPercent(0);
      setCouponError('Invalid coupon code.');
      sessionStorage.removeItem('meraki_couponCode');
      sessionStorage.removeItem('meraki_couponApplied');
      sessionStorage.removeItem('meraki_couponDiscount');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponDiscountPercent(0);
    setCouponCode('');
    setCouponError('');
    sessionStorage.removeItem('meraki_couponCode');
    sessionStorage.removeItem('meraki_couponApplied');
    sessionStorage.removeItem('meraki_couponDiscount');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi Meraki Living! ✨\n\nI have a booking inquiry for the *${room.title}*\n\n` +
      `Check-in: ${formatDate(checkInDate)} 📅\n` +
      `Check-out: ${formatDate(checkOutDate)}\n` +
      `Nights: ${nights}\n` +
      `Guests: ${guests.adults + guests.children} Guests\n` +
      `Rooms: ${guests.rooms}\n` +
      `Total: Rs.${totalAmount.toLocaleString('en-IN')} 💳\n\n` +
      `Guest: ${formData.firstName} ${formData.lastName}\n` +
      `${formData.email}\n` +
      `${formData.countryCode} ${formData.phone} 📞\n\n` +
      `Please confirm availability. Thank you!`
    );
    window.open(`https://wa.me/919456103445?text=${message}`, '_blank');
  };

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

  const renderRoomSummary = () => {
    const titleData = parseRoomTitle(room.title);
    return (
      <div className="gd-card gd-summary-card">
        <div className="gd-summary-header">
          <div className="gd-summary-room-image">
            <OptimizedImage src={room.image} alt={titleData.mainName || room.title} width="72" height="72" loading="eager" fetchPriority="high" decoding="async" noWrapper={true} />
          </div>
          <div className="gd-summary-room-info">
            <div className="gd-summary-room-title-block">
              <div className="gd-summary-room-title-primary-row">
                {titleData.mainName && <h3 className="gd-summary-room-title">{titleData.mainName}</h3>}
                {titleData.subtitle && <span className="gd-summary-room-sub">{titleData.subtitle}</span>}
              </div>
              {titleData.roomType && <span className="gd-summary-room-type">{titleData.roomType}</span>}
            </div>
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
          </div>
        </div>
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
  };

  const renderPriceBreakdown = () => {
    const titleData = parseRoomTitle(room.title);
    return (
      <div className="gd-card gd-price-card">
        <h4 className="gd-price-title">Price Breakdown</h4>

        <div className="gd-price-room">
          <OptimizedImage src={room.image} alt={titleData.mainName || room.title} width="52" height="52" loading="eager" fetchPriority="high" decoding="async" noWrapper={true} />
          <div className="gd-price-room-info">
            <div className="gd-price-room-title-block">
              <div className="gd-price-room-title-primary-row">
                <span className="gd-price-room-name">{titleData.mainName || room.title}</span>
                {titleData.subtitle && <span className="gd-price-room-sub">{titleData.subtitle}</span>}
              </div>
              {titleData.roomType && <span className="gd-price-room-type">{titleData.roomType}</span>}
            </div>
            <span className="gd-price-room-meta">{nights} nights &middot; {guests.adults + guests.children} guests</span>
          </div>
        </div>

        <div className="gd-price-divider"></div>

      <div className="gd-price-breakdown">
        <div className="gd-price-row">
          <span>Rs.{pricePerNight.toLocaleString('en-IN')} x {nights} night{nights > 1 ? 's' : ''} {room.id !== 4 ? `x ${multiplier} room${multiplier > 1 ? 's' : ''}` : ''}</span>
          <span>Rs.{(pricePerNight * nights * multiplier).toLocaleString('en-IN')}</span>
        </div>
        {extraChargePerNight > 0 && (
          <div className="gd-price-row">
            <span>Extra Guests (+ Rs.{extraChargePerNight * multiplier}/night)</span>
            <span>Rs.{(extraChargePerNight * nights * multiplier).toLocaleString('en-IN')}</span>
          </div>
        )}
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
};

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
                disabled={isProcessing}
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
                disabled={isProcessing}
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
              disabled={isProcessing}
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
                disabled={isProcessing}
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
              disabled={isProcessing}
            />
          </div>
          {errors.phone && <span className="gd-error-text">{errors.phone}</span>}
          <span className="gd-input-hint">For booking updates and check-in coordination</span>
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
                disabled={isProcessing}
              />
              <span className="gd-checkbox-custom">
                {formData.agreeTerms && <TickIcon />}
              </span>
              <span className="gd-checkbox-text">
                I agree to the <button type="button" className="gd-link-btn" onClick={() => openPolicyView('terms')}>Terms & Conditions</button> and <button type="button" className="gd-link-btn" onClick={() => openPolicyView('cancellation')}>Cancellation Policy</button>
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
                disabled={isProcessing}
              />
              <span className="gd-checkbox-custom">
                {formData.agreePrivacy && <TickIcon />}
              </span>
              <span className="gd-checkbox-text">
                I agree to the <button type="button" className="gd-link-btn" onClick={() => openPolicyView('privacy')}>Privacy Policy</button> and consent to receiving booking-related communications
              </span>
            </label>
            {errors.agreePrivacy && <span className="gd-error-text">{errors.agreePrivacy}</span>}
          </div>
        </div>

        <div className="gd-form-actions">
          <button type="button" className="gd-btn-secondary" onClick={handleBackToBooking} disabled={isProcessing}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            <span>Back</span>
          </button>
          <button type="submit" className="gd-btn-primary" disabled={isProcessing}>
            <span>{isProcessing ? 'Processing Payment...' : 'Pay Now'}</span>
            {!isProcessing && <HugeiconsIcon icon={ArrowRight01Icon} size={18} />}
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
          {room.amenities.map((amenity, idx) => (
            <div className="gd-amenity-item" key={idx}>
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
              <span>{amenity}</span>
            </div>
          ))}
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
        <a href="tel:+919456103445" className="gd-help-btn gd-call-btn">
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

  if (isVerifyingPayment) {
    return (
      <section className="conf-section conf-processing-section">
        <div className="conf-card conf-processing-card">
          <div className="conf-processing-content">
            <div className="conf-processing-spinner-wrap">
              <div className="conf-processing-spinner"></div>
              <div className="conf-processing-icon-center">
                <HugeiconsIcon icon={SecurityValidationIcon} size={28} color="#870097" />
              </div>
            </div>

            <h2 className="conf-processing-title">Confirming Booking</h2>
            
            <div className="conf-processing-status-badge">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color="#16A34A" />
              <span>Payment Confirmed</span>
            </div>

            <p className="conf-processing-desc">
              We are securing your reservation.
            </p>

            <div className="conf-processing-bottom-box">
              Please stay on this page.
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (confirmedBooking) {
    return (
      <section className="conf-section">
        <div className="conf-card animate-pop">
          <div className="conf-content">
            <div className="conf-success-ripple">
              <div className="conf-success-icon">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={42} strokeWidth={1.5} color="#ffffff" />
              </div>
            </div>

            <h2 className="conf-title">Payment Successful</h2>
            <p className="conf-desc">Your booking has been confirmed.</p>
            
            <div className="conf-booking-status-box">
              <div className="conf-status-row">
                <span className="conf-status-label">Booking ID</span>
                <span className="conf-booking-id">{confirmedBooking.id}</span>
              </div>
              <div className="conf-status-row">
                <span className="conf-status-label">Status</span>
                <span className="conf-confirmed-badge">
                  <span className="conf-status-dot"></span> Confirmed
                </span>
              </div>
              <div className="conf-status-row">
                <span className="conf-status-label">Guest</span>
                <span className="conf-guest-name">{confirmedBooking.name || 'Guest'}</span>
              </div>
            </div>

            <button 
              className="conf-home-btn" 
              onClick={() => {
                sessionStorage.setItem('meraki_show_floating_booking', 'true');
                sessionStorage.setItem('meraki_booking_just_confirmed', 'true');
                window.dispatchEvent(new Event('meraki_booking_updated'));
                if (setCurrentPage) setCurrentPage('home');
              }}
            >
              <HugeiconsIcon icon={Home07Icon} size={18} />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`gd-section ${animateIn ? 'gd-animate' : ''}`}>
      <div className="gd-container">

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

        {activePolicyModal && (
          <div 
            className="gd-policy-modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '20px'
            }}
            onClick={() => setActivePolicyModal(null)}
          >
            <div 
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                maxWidth: '640px',
                width: '100%',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 22px',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                  {activePolicyModal.title}
                </h3>
                <button 
                  type="button" 
                  onClick={() => setActivePolicyModal(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#64748b',
                    lineHeight: 1,
                    padding: '4px 8px'
                  }}
                  title="Close"
                >
                  &times;
                </button>
              </div>
              <div 
                style={{
                  padding: '20px 22px',
                  overflowY: 'auto',
                  fontSize: '14px',
                  lineHeight: '1.65',
                  color: '#475569'
                }}
                dangerouslySetInnerHTML={{ __html: (activePolicyModal.content || '').replace(/className=/g, 'class=') }}
              />
              <div style={{
                padding: '14px 22px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  className="gd-btn-primary"
                  style={{ padding: '8px 22px', fontSize: '13px' }}
                  onClick={() => setActivePolicyModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default GuestDetails;