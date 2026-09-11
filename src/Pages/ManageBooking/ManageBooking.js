import React, { useState, useEffect } from 'react';
import './ManageBooking.css';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Ticket01Icon,
  Mail01Icon,
  CallIcon,
  Calendar01Icon,
  Calendar02Icon,
  UserGroupIcon,
  Cancel01Icon,
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
  MailAtSign01Icon,
  CustomerSupportIcon,
  Copy01Icon,
  ArrowDown01Icon
} from '@hugeicons/core-free-icons';
import roomImage from '../../assets/images/room-1.webp';

const API_CONFIG_URL = 'http://localhost/merakiliving_backend';

const ManageBooking = ({ setCurrentPage }) => {
  const [searchMethod, setSearchMethod] = useState('bookingId');
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingData, setBookingData] = useState(null);

  const [isCancelling, setIsCancelling] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancellationSuccess, setShowCancellationSuccess] = useState(false);
  const [roomsCache, setRoomsCache] = useState([]);

  // Change Dates Modal State
  const [showDateModal, setShowDateModal] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');

  useEffect(() => {
    // Pre-fetch rooms to map image
    fetch(`${API_CONFIG_URL}/api_rooms.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success') setRoomsCache(data.data);
      })
      .catch(err => console.error("Error fetching rooms", err));
  }, []);

  const validateSearchValue = (method, value) => {
    const trimmed = (value || '').trim();
    if (!trimmed) return 'Please enter your search details.';
    if (method === 'email') {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(trimmed)) return 'Please enter a valid email address.';
    } else if (method === 'phone') {
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number (at least 7-10 digits).';
    } else if (method === 'bookingId') {
      const cleanId = trimmed.replace(/[^a-zA-Z0-9]/g, '');
      if (cleanId.length < 1) return 'Please enter a valid Booking ID (e.g. MERI0001).';
    }
    return null;
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const validationError = validateSearchValue(searchMethod, searchValue);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [bookingsRes, paymentsRes] = await Promise.all([
        fetch(`${API_CONFIG_URL}/api_bookings.php`),
        fetch(`${API_CONFIG_URL}/api_payments.php`)
      ]);
      const bookingsJson = await bookingsRes.json();
      const paymentsJson = await paymentsRes.json();
      
      if (bookingsJson.status !== 'success' || !bookingsJson.data) {
        setErrorMsg('Booking not found');
        setIsLoading(false);
        return;
      }
      
      const cleanSearch = searchValue.trim();
      const searchDigits = cleanSearch.replace(/\D/g, '');
      const searchUpper = cleanSearch.toUpperCase();

      let foundBooking = null;
      for (const b of bookingsJson.data) {
        const formattedId = `MERI${String(b.id).padStart(4, '0')}`;
        const refUpper = (b.booking_reference || '').toUpperCase();
        
        if (searchMethod === 'bookingId') {
          if (String(b.id) === cleanSearch || formattedId === searchUpper || refUpper === searchUpper) {
            foundBooking = b; break;
          }
        } else if (searchMethod === 'email') {
          if (b.guest_email && b.guest_email.toLowerCase() === cleanSearch.toLowerCase()) {
            foundBooking = b; break;
          }
        } else if (searchMethod === 'phone') {
          const guestDigits = (b.guest_phone || '').replace(/\D/g, '');
          if (guestDigits && searchDigits && (guestDigits.includes(searchDigits) || searchDigits.includes(guestDigits))) {
            foundBooking = b; break;
          }
        }
      }
      
      if (!foundBooking) {
        setErrorMsg('Booking not found');
        setHasSearched(false);
      } else {
        const payment = (paymentsJson.data || []).find(p => p.booking_id === foundBooking.id && (p.status === 'Success' || p.status === 'Completed'));
        setBookingData({
          ...foundBooking,
          formattedId: foundBooking.booking_reference || `MERI${String(foundBooking.id).padStart(4, '0')}`,
          paid_amount: payment ? payment.amount : (foundBooking.room_price || 0),
          payment_method: payment ? payment.payment_method : 'N/A',
          payment_status: payment ? payment.status : (foundBooking.status === 'Pending' ? 'Pending' : 'Paid')
        });
        setHasSearched(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while searching.');
    }
    setIsLoading(false);
  };

  const handleCancelClick = () => {
    setIsCancelling(true);
  };

  const abortCancel = () => {
    setIsCancelling(false);
  };

  const confirmCancel = async () => {
    if (!bookingData) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_CONFIG_URL}/api_bookings.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bookingData.id,
          status: 'Cancelled'
        })
      });
      const data = await res.json();
      if (data && data.status === 'success') {
        setBookingData({ ...bookingData, status: 'Cancelled' });
        setIsCancelling(false);
        setShowCancellationSuccess(true);
      } else {
        alert(data.message || 'Error cancelling booking');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
    setActionLoading(false);
  };

  const handleChangeDatesClick = () => {
    setNewCheckIn(bookingData.check_in || '');
    setNewCheckOut(bookingData.check_out || '');
    setShowDateModal(true);
  };

  const submitChangeDates = async () => {
    if (!newCheckIn || !newCheckOut) {
      alert('Please select both dates');
      return;
    }
    setShowDateModal(false);
    await executeModify({ check_in: newCheckIn, check_out: newCheckOut });
  };

  const handleModifyDetails = async () => {
    const newGuests = window.prompt("Enter new number of guests:", bookingData.guest_count);
    if (!newGuests) return;

    await executeModify({ guest_count: parseInt(newGuests, 10) });
  };

  const executeModify = async (updates) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_CONFIG_URL}/api_bookings.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bookingData.id,
          ...updates
        })
      });
      const data = await res.json();
      if (data && data.status === 'success') {
        alert('Booking updated successfully.');
        // Refresh the booking data
        const refreshRes = await fetch(`${API_CONFIG_URL}/api_bookings.php`);
        const refreshJson = await refreshRes.json();
        const updatedBooking = refreshJson.data.find(b => b.id === bookingData.id);
        if (updatedBooking) {
          setBookingData(prev => ({
            ...prev,
            ...updatedBooking
          }));
        }
      } else {
        alert(data.message || 'Error updating booking');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating.');
    }
    setActionLoading(false);
  };

  const copyBookingId = () => {
    if (bookingData && bookingData.formattedId) {
      navigator.clipboard.writeText(bookingData.formattedId);
      alert('Booking ID copied!');
    }
  };
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section className="mb-section">
      <div className="mb-container">
        
        {/* Top Section: Search & Help */}
        <div className="mb-top-grid">
          {/* Left: Search Area */}
          <div className="mb-search-area">
            <h1 className="mb-section-title">Find Your Booking</h1>
            <p className="mb-section-desc">Enter your Booking ID, email address or phone number to view your booking details.</p>
            
            <div className="mb-search-card">
              <div className="mb-search-methods">
                <button 
                  type="button" 
                  className={`mb-method-btn ${searchMethod === 'bookingId' ? 'active' : ''}`}
                  onClick={() => setSearchMethod('bookingId')}
                >
                  <HugeiconsIcon icon={Ticket01Icon} size={18} /> Booking ID
                </button>
                <button 
                  type="button" 
                  className={`mb-method-btn ${searchMethod === 'email' ? 'active' : ''}`}
                  onClick={() => setSearchMethod('email')}
                >
                  <HugeiconsIcon icon={Mail01Icon} size={18} /> Email Address
                </button>
                <button 
                  type="button" 
                  className={`mb-method-btn ${searchMethod === 'phone' ? 'active' : ''}`}
                  onClick={() => setSearchMethod('phone')}
                >
                  <HugeiconsIcon icon={CallIcon} size={18} /> Phone Number
                </button>
              </div>

              <form className="mb-search-form" onSubmit={handleLookup}>
                <div className="mb-input-row">
                  <div className="mb-input-wrapper-lg">
                    {searchMethod === 'bookingId' && <HugeiconsIcon icon={Ticket01Icon} size={20} color="#870097" />}
                    {searchMethod === 'email' && <HugeiconsIcon icon={Mail01Icon} size={20} color="#870097" />}
                    {searchMethod === 'phone' && <HugeiconsIcon icon={CallIcon} size={20} color="#870097" />}
                    <input 
                      type={searchMethod === 'email' ? 'email' : searchMethod === 'phone' ? 'tel' : 'text'}
                      className="mb-input-lg" 
                      placeholder={
                        searchMethod === 'bookingId' ? "Enter your Booking ID" :
                        searchMethod === 'email' ? "Enter your Email" :
                        "Enter your Phone"
                      }
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="mb-submit-btn-lg" disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search Booking'}
                  </button>
                </div>
                {errorMsg && <div className="mb-error-msg">{errorMsg}</div>}
              </form>
            </div>
          </div>
          
          {/* Right: Help Area */}
          <div className="mb-help-area">
            <h2 className="mb-section-title">Need Help?</h2>
            <p className="mb-section-desc">Can't find your booking or facing any issues?</p>

            <div className="mb-help-card-top">
               <div className="mb-help-icon-box">
                 <HugeiconsIcon icon={CustomerSupportIcon} size={28} color="#870097" />
               </div>
               <p className="mb-help-card-text">Our dedicated support team is available to assist you with any questions or modifications.</p>
               <button className="mb-contact-support-btn" onClick={() => window.open('https://wa.me/919456103445?text=Hi%20Meraki%20Living,%20I%20need%20help%20with%20my%20booking.', '_blank')}>
                 Contact Support <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
               </button>
            </div>
          </div>
        </div>

        {/* Conditional: Booking Details */}
        {hasSearched && bookingData && (
          showCancellationSuccess ? (
            <div className="mb-cancel-success-card">
              <div className="mb-cancel-success-anim">
                <svg className="mb-cancel-success-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#2E7D32"/>
                  <path d="M16.0303 9.46967C16.3232 9.76256 16.3232 10.2374 16.0303 10.5303L11.0303 15.5303C10.7374 15.8232 10.2626 15.8232 9.96967 15.5303L6.96967 12.5303C6.67678 12.2374 6.67678 11.7626 6.96967 11.4697C7.26256 11.1768 7.73744 11.1768 8.03033 11.4697L10.5 13.9393L14.9697 9.46967C15.2626 9.17678 15.7374 9.17678 16.0303 9.46967Z" fill="white"/>
                </svg>
              </div>
              <h2 className="mb-cancel-success-title">Your Booking Has Been Cancelled</h2>
              <p className="mb-cancel-success-desc">Your cancellation was successful. Any applicable refunds will be processed according to our policy.</p>
              
              <div className="mb-cancel-success-details">
                <h3 className="mb-cs-title">Cancellation Details</h3>
                <div className="mb-cs-row">
                  <span className="mb-cs-label">Booking ID</span>
                  <span className="mb-cs-value" style={{ color: '#870097', fontWeight: 600 }}>{bookingData.formattedId}</span>
                </div>
                <div className="mb-cs-row">
                  <span className="mb-cs-label">Status</span>
                  <span className="mb-cs-value" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d32f2f', fontWeight: 600 }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d32f2f' }}></span> Cancelled
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="mb-submit-btn-lg" style={{ width: '100%' }} onClick={() => { setShowCancellationSuccess(false); setHasSearched(false); setSearchValue(''); }}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-booking-result">
              <div className="mb-result-header">
                <div>
                  <h2 className="mb-result-title">Booking Details</h2>
                  <p className="mb-result-desc">Here are your booking details. You can review and modify your booking if needed.</p>
                </div>
                <div className={`mb-status-pill mb-status-${bookingData.status?.toLowerCase() === 'cancelled' ? 'cancelled' : 'confirmed'}`}>
                   <span className="mb-dot"></span> {bookingData.status || 'Confirmed'}
                </div>
              </div>

              <div className="mb-details-card">
                 <div className="mb-room-image-col">
                    <img 
                      src={(roomsCache.find(r => r.id === bookingData.room_id) || {}).image_url || roomImage} 
                      alt="Room" 
                      className="mb-room-image" 
                    />
                    <div className="mb-room-name-overlay">{bookingData.room_name || `Room ${bookingData.room_id}`}</div>
                 </div>
                 <div className="mb-details-info-col">
                    <div className="mb-details-grid">
                      <div className="mb-d-item">
                        <HugeiconsIcon icon={Ticket01Icon} size={20} color="#870097" />
                        <div className="mb-d-text">
                          <div className="mb-d-label">Booking ID</div>
                          <div className="mb-d-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {bookingData.formattedId}
                            <button 
                              type="button" 
                              onClick={copyBookingId}
                              title="Copy Booking ID"
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                            >
                              <HugeiconsIcon icon={Copy01Icon} size={16} color="#666" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mb-d-item">
                        <HugeiconsIcon icon={Calendar01Icon} size={20} color="#870097" />
                        <div className="mb-d-text">
                          <div className="mb-d-label">Booking Date</div>
                          <div className="mb-d-value">{formatDate(bookingData.booking_date || bookingData.created_at)}</div>
                        </div>
                      </div>
                      <div className="mb-d-item">
                        <HugeiconsIcon icon={UserGroupIcon} size={20} color="#870097" />
                        <div className="mb-d-text">
                          <div className="mb-d-label">Guest Name</div>
                          <div className="mb-d-value">{bookingData.guest_name || `Guest ${bookingData.guest_id}`}</div>
                        </div>
                      </div>
                      <div className="mb-d-item">
                        <HugeiconsIcon icon={Calendar01Icon} size={20} color="#870097" />
                        <div className="mb-d-text">
                          <div className="mb-d-label">Check In</div>
                          <div className="mb-d-value">{formatDate(bookingData.check_in)}</div>
                        </div>
                      </div>
                      <div className="mb-d-item">
                        <HugeiconsIcon icon={CheckmarkBadge01Icon} size={20} color="#870097" />
                        <div className="mb-d-text">
                          <div className="mb-d-label">Rooms</div>
                          <div className="mb-d-value">1 Room ({bookingData.guest_count} {parseInt(bookingData.guest_count) === 1 ? 'Guest' : 'Guests'})</div>
                        </div>
                      </div>
                      <div className="mb-d-item">
                        <HugeiconsIcon icon={Calendar02Icon} size={20} color="#870097" />
                        <div className="mb-d-text">
                          <div className="mb-d-label">Check Out</div>
                          <div className="mb-d-value">{formatDate(bookingData.check_out)}</div>
                        </div>
                      </div>
                      <div className="mb-d-item">
                        <HugeiconsIcon icon={MailAtSign01Icon} size={20} color="#870097" />
                        <div className="mb-d-text">
                          <div className="mb-d-label">Total Amount</div>
                          <div className="mb-d-value">₹{parseInt(bookingData.paid_amount || 0).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <div className="mb-d-item mb-payment-method-item">
                        <HugeiconsIcon icon={CallIcon} size={20} color="#870097" />
                        <div className="mb-d-text">
                          <div className="mb-d-label">Payment Method</div>
                          <div className="mb-d-value">{bookingData.payment_method || 'Online'}</div>
                        </div>
                      </div>
                    </div>
                    
                    {!isCancelling ? (
                      <div className="mb-details-actions">
                         <button className="mb-btn-outline" onClick={handleChangeDatesClick} disabled={actionLoading || bookingData.status === 'Cancelled'}>
                           <HugeiconsIcon icon={Calendar01Icon} size={16} /> {actionLoading ? 'Updating...' : 'Change Dates'}
                         </button>
                         <button className="mb-btn-outline" onClick={handleModifyDetails} disabled={actionLoading || bookingData.status === 'Cancelled'}>
                           <HugeiconsIcon icon={Ticket01Icon} size={16} /> {actionLoading ? 'Updating...' : 'Modify Booking'}
                         </button>
                         <button className="mb-btn-filled" onClick={handleCancelClick} disabled={bookingData.status === 'Cancelled' || actionLoading}>
                           <HugeiconsIcon icon={Cancel01Icon} size={16} /> Cancel Booking
                         </button>
                      </div>
                    ) : (
                      <div className="mb-cancel-confirm-area">
                        <div className="mb-cancel-warning">
                          <h5>Cancel this booking?</h5>
                          <p>This action cannot be undone. Please review our policy.</p>
                        </div>
                        <div className="mb-cancel-confirm-actions">
                          <button className="mb-btn-outline" onClick={abortCancel} disabled={actionLoading}>Keep Booking</button>
                          <button className="mb-btn-filled" onClick={confirmCancel} disabled={actionLoading}>{actionLoading ? 'Cancelling...' : 'Yes, Cancel'}</button>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )
        )}

        {/* Bottom Sections: Cancellation Policy, FAQ */}
        <div className="mb-bottom-sections">
          
          <div className="mb-policy-card">
             <div className="mb-policy-left">
               <div className="mb-policy-icon">
                 <HugeiconsIcon icon={Cancel01Icon} size={24} color="#870097" />
               </div>
               <div>
                 <h4>Cancellation Policy</h4>
                 <p>You can cancel your booking as per our cancellation policy. The refund (if applicable) will be processed to your original payment method within the specified time.</p>
               </div>
             </div>
             <button className="mb-policy-btn" onClick={() => setCurrentPage && setCurrentPage('cancellation-policy')}>
               View Cancellation Policy <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
             </button>
          </div>
          
          <div className="mb-faq-section">
             <h3 className="mb-faq-title">Frequently Asked Questions</h3>
             
             <details className="mb-faq-item">
               <summary className="mb-faq-summary">How do I find my booking ID? <HugeiconsIcon icon={ArrowDown01Icon} size={20} className="mb-faq-arrow" /></summary>
               <div className="mb-faq-content">Your booking ID is sent to your registered email address and mobile number upon successful payment. It usually starts with MERI.</div>
             </details>

             <details className="mb-faq-item">
               <summary className="mb-faq-summary">What is the cancellation policy? <HugeiconsIcon icon={ArrowDown01Icon} size={20} className="mb-faq-arrow" /></summary>
               <div className="mb-faq-content">Cancellations made 48 hours before check-in are eligible for a full refund. Cancellations made within 48 hours will incur a 1-night charge.</div>
             </details>

             <details className="mb-faq-item">
               <summary className="mb-faq-summary">Will I get a full refund? <HugeiconsIcon icon={ArrowDown01Icon} size={20} className="mb-faq-arrow" /></summary>
               <div className="mb-faq-content">Yes, if you cancel within the eligible free-cancellation window, the full amount will be refunded to your original payment method.</div>
             </details>

             <details className="mb-faq-item">
               <summary className="mb-faq-summary">How long does the refund take? <HugeiconsIcon icon={ArrowDown01Icon} size={20} className="mb-faq-arrow" /></summary>
               <div className="mb-faq-content">Refunds typically take 5-7 business days to reflect in your bank account, depending on your bank's processing time.</div>
             </details>
          </div>

        </div>

        {/* Change Dates Modal */}
        {showDateModal && (
          <div className="mb-modal-overlay">
            <div className="mb-modal-content">
              <h3>Change Booking Dates</h3>
              <p>Select your new check-in and check-out dates.</p>
              <div className="mb-modal-inputs">
                <div className="mb-input-group">
                  <label>Check-in Date</label>
                  <input 
                    type="date" 
                    value={newCheckIn} 
                    onChange={(e) => setNewCheckIn(e.target.value)} 
                    min={new Date().toISOString().split('T')[0]} 
                  />
                </div>
                <div className="mb-input-group">
                  <label>Check-out Date</label>
                  <input 
                    type="date" 
                    value={newCheckOut} 
                    onChange={(e) => setNewCheckOut(e.target.value)} 
                    min={newCheckIn || new Date().toISOString().split('T')[0]} 
                  />
                </div>
              </div>
              <div className="mb-modal-actions">
                <button className="mb-btn-outline" onClick={() => setShowDateModal(false)}>Cancel</button>
                <button className="mb-btn-filled" onClick={submitChangeDates}>Confirm</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ManageBooking;
