import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FloatingBookingDetails.css';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Ticket01Icon,
  BedDoubleIcon,
  Calendar01Icon,
  UserGroupIcon,
  Cancel01Icon,
  Delete01Icon,
  WhatsappIcon,
  Copy01Icon,
  CheckmarkBadge01Icon,
  RupeeShieldIcon
} from '@hugeicons/core-free-icons';

import room1 from '../../assets/images/room-1.webp';
import room2 from '../../assets/images/room-2.webp';
import room3 from '../../assets/images/room-3.webp';
import room4 from '../../assets/images/room-4.webp';

const API_CONFIG_URL = 'http://localhost/merakiliving_backend';
const ADMIN_WHATSAPP_NUMBER = '919456103445';

const ROOM_IMAGES = {
  1: room1,
  2: room2,
  3: room3,
  4: room4
};

const FloatingBookingDetails = ({ setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showCancellationSuccess, setShowCancellationSuccess] = useState(false);
  const [hasAttentionGuide, setHasAttentionGuide] = useState(false);
  const popupRef = useRef(null);

  const loadBookingFromStorage = useCallback(() => {
    try {
      const showFlag = sessionStorage.getItem('meraki_show_floating_booking');
      const raw = sessionStorage.getItem('meraki_latest_booking');
      if (raw && (showFlag === 'true' || showFlag === null)) {
        const parsed = JSON.parse(raw);
        setBookingData(parsed);

        if (sessionStorage.getItem('meraki_booking_just_confirmed') === 'true') {
          setHasAttentionGuide(true);
          sessionStorage.removeItem('meraki_booking_just_confirmed');
          setTimeout(() => setHasAttentionGuide(false), 3600);
        }

        return parsed;
      }
      setBookingData(null);
      return null;
    } catch (e) {
      setBookingData(null);
      return null;
    }
  }, []);

  const syncWithBackend = useCallback(async (currentBooking) => {
    if (!currentBooking) return;
    const targetRef = currentBooking.booking_reference || currentBooking.id;
    if (!targetRef) return;

    try {
      const res = await fetch(`${API_CONFIG_URL}/api_bookings.php`);
      const json = await res.json();
      if (json && json.status === 'success' && Array.isArray(json.data)) {
        const cleanRef = String(targetRef).toUpperCase().trim();
        const matched = json.data.find(b => {
          const bRef = (b.booking_reference || `MERI${String(b.id).padStart(4, '0')}`).toUpperCase().trim();
          const bId = String(b.id);
          return bRef === cleanRef || bId === cleanRef || (currentBooking.db_id && String(b.id) === String(currentBooking.db_id));
        });

        if (matched) {
          setBookingData(prev => {
            const updated = {
              ...prev,
              ...matched,
              id: matched.booking_reference || `MERI${String(matched.id).padStart(4, '0')}`,
              booking_reference: matched.booking_reference || `MERI${String(matched.id).padStart(4, '0')}`,
              formattedId: matched.booking_reference || `MERI${String(matched.id).padStart(4, '0')}`,
              status: matched.status || prev?.status || 'Confirmed',
              guest_name: matched.guest_name || prev?.guest_name,
              room_name: matched.room_name || prev?.room_name,
              check_in: matched.check_in || prev?.check_in,
              check_out: matched.check_out || prev?.check_out,
              guest_count: matched.guest_count || prev?.guest_count,
              paid_amount: matched.paid_amount || prev?.paid_amount || prev?.amount
            };
            sessionStorage.setItem('meraki_latest_booking', JSON.stringify(updated));
            return updated;
          });
        }
      }
    } catch (err) {
    }
  }, []);

  useEffect(() => {
    const booking = loadBookingFromStorage();
    if (booking) {
      syncWithBackend(booking);
    }

    const handleBookingUpdate = () => {
      const updatedBooking = loadBookingFromStorage();
      if (updatedBooking) {
        syncWithBackend(updatedBooking);
      }
    };

    window.addEventListener('meraki_booking_updated', handleBookingUpdate);
    window.addEventListener('storage', handleBookingUpdate);

    return () => {
      window.removeEventListener('meraki_booking_updated', handleBookingUpdate);
      window.removeEventListener('storage', handleBookingUpdate);
    };
  }, [loadBookingFromStorage, syncWithBackend]);

  useEffect(() => {
    if (isOpen && bookingData) {
      syncWithBackend(bookingData);
    }
  }, [isOpen, bookingData, syncWithBackend]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && popupRef.current && !popupRef.current.contains(e.target)) {
        const triggerBtn = document.getElementById('meraki-floating-booking-trigger');
        if (triggerBtn && triggerBtn.contains(e.target)) return;
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!bookingData) {
    return null;
  }

  const isCancelled = (bookingData.status || '').toLowerCase() === 'cancelled';
  const displayId = bookingData.formattedId || bookingData.booking_reference || bookingData.id || 'MERI0001';
  const roomImg = (bookingData.room_id && ROOM_IMAGES[bookingData.room_id]) ? ROOM_IMAGES[bookingData.room_id] : (bookingData.image || room1);

  const calculateNights = (inDate, outDate) => {
    if (!inDate || !outDate) return 1;
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 1;
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const cleanStr = String(dateStr).trim();
    const parts = cleanStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (parts) {
      const year = parts[1];
      const monthIndex = parseInt(parts[2], 10) - 1;
      const day = parseInt(parts[3], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${day} ${months[monthIndex]} ${year}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const nights = calculateNights(bookingData.check_in, bookingData.check_out);

  const copyBookingId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleCancelClick = () => {
    setIsCancelling(true);
  };

  const abortCancel = () => {
    setIsCancelling(false);
  };

  const confirmCancel = async () => {
    setActionLoading(true);
    const targetDbId = bookingData.db_id || bookingData.id;

    try {
      const res = await fetch(`${API_CONFIG_URL}/api_bookings.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetDbId,
          status: 'Cancelled'
        })
      });
      const data = await res.json();
      if (data && data.status === 'success') {
        const updatedBooking = { ...bookingData, status: 'Cancelled' };
        setBookingData(updatedBooking);
        sessionStorage.setItem('meraki_latest_booking', JSON.stringify(updatedBooking));
        window.dispatchEvent(new Event('meraki_booking_updated'));
        setIsCancelling(false);
        setShowCancellationSuccess(true);
      } else {
        alert(data?.message || 'Error cancelling booking. Please contact support.');
      }
    } catch (err) {
      const updatedBooking = { ...bookingData, status: 'Cancelled' };
      setBookingData(updatedBooking);
      sessionStorage.setItem('meraki_latest_booking', JSON.stringify(updatedBooking));
      window.dispatchEvent(new Event('meraki_booking_updated'));
      setIsCancelling(false);
      setShowCancellationSuccess(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const rawAmount = bookingData.paid_amount || bookingData.amount || bookingData.room_price || 0;
    const formattedAmount = parseInt(String(rawAmount).replace(/,/g, ''), 10).toLocaleString('en-IN');
    
    const message = encodeURIComponent(
      `Hi Meraki Living! \n\n` +
      `I have an inquiry regarding my booking:\n` +
      `• *Booking ID:* ${displayId}\n` +
      `• *Guest Name:* ${bookingData.guest_name || 'Guest'}\n` +
      `• *Room:* ${bookingData.room_name || 'Meraki Homestay'}\n` +
      `• *Check-in:* ${formatDate(bookingData.check_in)}\n` +
      `• *Check-out:* ${formatDate(bookingData.check_out)} (${nights} ${nights === 1 ? 'Night' : 'Nights'})\n` +
      `• *Guests:* ${bookingData.guest_count || 2} Guests\n` +
      `• *Total Amount:* Rs.${formattedAmount}\n` +
      `• *Status:* ${bookingData.status || 'Confirmed'}\n\n` +
      `Please assist me with my reservation. Thank you!`
    );
    window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="meraki-floating-booking-wrapper">
      {/* Animated Circular Floating Trigger Indicator (Positioned neatly outside popup above Chatbot) */}
      <div className="fb-indicator-wrap">
        <button
          type="button"
          id="meraki-floating-booking-trigger"
          className={`fb-indicator-btn ${isOpen ? 'active' : ''} ${hasAttentionGuide ? 'fb-attention-guide' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="View Confirmed Booking Details"
          aria-expanded={isOpen}
          title="Your Confirmed Booking Details"
          style={{ borderRadius: '100px' }}
        >
          {/* Ambient Glow Ripple Ring */}
          <span className="fb-pulse-ring" aria-hidden="true"></span>
          <span className="fb-pulse-ring-inner" aria-hidden="true"></span>

          {/* Centered Reservation / Booking Icon */}
          <div className="fb-icon-inner">
            {isOpen ? (
              <HugeiconsIcon icon={Cancel01Icon} size={22} />
            ) : (
              <HugeiconsIcon icon={Calendar01Icon} size={24} />
            )}
          </div>

          {/* Live Status Indicator Dot */}
          <span
            className="fb-status-badge badge-confirmed"
            aria-label={`Status: ${bookingData.status || 'Confirmed'}`}
          />
        </button>

        {!isOpen && (
          <div className="fb-indicator-tooltip" role="tooltip">
            <span>Booking Details</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fb-popup-card animate-fb-scale" ref={popupRef}>
          <div className="fb-popup-header">
            <div className="fb-header-left">
              <div className="fb-header-icon-box">
                <HugeiconsIcon icon={Ticket01Icon} size={18} color="#870097" />
              </div>
              <div>
                <h4 className="fb-popup-title">Your Booking Details</h4>
                <div className="fb-id-pill" onClick={copyBookingId} title="Click to copy Booking ID">
                  <span className="fb-id-text">{displayId}</span>
                  <HugeiconsIcon icon={Copy01Icon} size={13} color="#817F8F" />
                  {copySuccess && <span className="fb-copied-tag">Copied!</span>}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="fb-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close booking details"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
          </div>

          <div className="fb-popup-body">
            {showCancellationSuccess ? (
              <div className="fb-cancelled-success-banner">
                <div className="fb-cs-icon-wrap">
                  <HugeiconsIcon icon={CheckmarkBadge01Icon} size={28} color="#2E7D32" />
                </div>
                <h5>Booking Cancelled</h5>
                <p>Your cancellation was processed successfully. Refunds are handled per our cancellation policy.</p>
                <button
                  type="button"
                  className="fb-btn-done"
                  onClick={() => setShowCancellationSuccess(false)}
                >
                  View Details
                </button>
              </div>
            ) : (
              <>
                <div className="fb-room-snapshot">
                  <img src={roomImg} alt={bookingData.room_name || 'Room'} className="fb-room-thumb" />
                  <div className="fb-room-info">
                    <div className="fb-room-badge">
                      <HugeiconsIcon icon={BedDoubleIcon} size={12} color="#870097" /> Homestay Room
                    </div>
                    <h5 className="fb-room-name">{bookingData.room_name || 'Himalayan View Room'}</h5>
                    <div className={`fb-status-pill fb-status-${isCancelled ? 'cancelled' : 'confirmed'}`}>
                      <span className="fb-status-dot"></span>
                      <span>{bookingData.status || 'Confirmed'}</span>
                    </div>
                  </div>
                </div>

                <div className="fb-details-grid">
                  <div className="fb-grid-item">
                    <div className="fb-gi-label">
                      <HugeiconsIcon icon={UserGroupIcon} size={13} color="#870097" />
                      <span>Guest</span>
                    </div>
                    <div className="fb-gi-value">{bookingData.guest_name || 'Guest'}</div>
                  </div>

                  <div className="fb-grid-item">
                    <div className="fb-gi-label">
                      <HugeiconsIcon icon={Calendar01Icon} size={13} color="#870097" />
                      <span>Duration</span>
                    </div>
                    <div className="fb-gi-value">
                      {nights} {nights === 1 ? 'Night' : 'Nights'} &bull; {bookingData.guest_count || 2} {parseInt(bookingData.guest_count || 2, 10) === 1 ? 'Guest' : 'Guests'}
                    </div>
                  </div>

                  <div className="fb-grid-item">
                    <div className="fb-gi-label">
                      <HugeiconsIcon icon={Calendar01Icon} size={13} color="#870097" />
                      <span>Check-In</span>
                    </div>
                    <div className="fb-gi-value">{formatDate(bookingData.check_in)}</div>
                  </div>

                  <div className="fb-grid-item">
                    <div className="fb-gi-label">
                      <HugeiconsIcon icon={Calendar01Icon} size={13} color="#870097" />
                      <span>Check-Out</span>
                    </div>
                    <div className="fb-gi-value">{formatDate(bookingData.check_out)}</div>
                  </div>

                  <div className="fb-grid-item fb-grid-full">
                    <div className="fb-gi-label">
                      <HugeiconsIcon icon={RupeeShieldIcon} size={13} color="#870097" />
                      <span>Total Amount</span>
                    </div>
                    <div className="fb-amount-value">
                      ₹{parseInt(String(bookingData.paid_amount || bookingData.amount || bookingData.room_price || 0).replace(/,/g, ''), 10).toLocaleString('en-IN')}
                      <span className="fb-payment-tag">{bookingData.payment_method || 'Online'} &bull; {isCancelled ? 'Cancelled' : 'Paid'}</span>
                    </div>
                  </div>
                </div>

                <div className="fb-actions-area">
                  {!isCancelling ? (
                    <div className="fb-actions-row">
                      {!isCancelled ? (
                        <button
                          type="button"
                          className="fb-btn-cancel-action"
                          onClick={handleCancelClick}
                          disabled={actionLoading}
                          title="Cancel this reservation"
                        >
                          <HugeiconsIcon icon={Delete01Icon} size={15} />
                          <span>Cancel</span>
                        </button>
                      ) : (
                        <div className="fb-cancelled-tag">
                          <HugeiconsIcon icon={Cancel01Icon} size={14} color="#d32f2f" />
                          <span>Cancelled</span>
                        </div>
                      )}

                      <button
                        type="button"
                        className="fb-btn-whatsapp-action"
                        onClick={handleWhatsApp}
                        title="Contact Admin on WhatsApp"
                      >
                        <HugeiconsIcon icon={WhatsappIcon} size={16} />
                        <span>Hello</span>
                      </button>
                    </div>
                  ) : (
                    <div className="fb-cancel-confirm-box">
                      <div className="fb-cancel-confirm-header">
                        <HugeiconsIcon icon={Delete01Icon} size={18} color="#d32f2f" />
                        <div>
                          <h6>Cancel this reservation?</h6>
                          <p>This action cannot be undone. Refunds will be processed per cancellation policy.</p>
                        </div>
                      </div>
                      <div className="fb-cancel-buttons">
                        <button
                          type="button"
                          className="fb-btn-keep"
                          onClick={abortCancel}
                          disabled={actionLoading}
                        >
                          Keep Booking
                        </button>
                        <button
                          type="button"
                          className="fb-btn-confirm-cancel"
                          onClick={confirmCancel}
                          disabled={actionLoading}
                        >
                          {actionLoading ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingBookingDetails;