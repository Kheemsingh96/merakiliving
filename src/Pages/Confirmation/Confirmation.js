import React, { useEffect, useState } from 'react';
import './Confirmation.css';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  CreditCardPosIcon, 
  CheckmarkBadge01Icon, 
  Shield01Icon,
  Home07Icon 
} from '@hugeicons/core-free-icons';

// Minimal Custom Smartphone Icon for UPI
const SmartphoneIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="3" ry="3"/>
    <path d="M12 18h.01"/>
  </svg>
);

const Confirmation = ({ setCurrentPage }) => {
  const [status, setStatus] = useState('processing');
  const [loadingText, setLoadingText] = useState('Initiating secure connection...');
  const [bookingDetails, setBookingDetails] = useState({ id: '', name: '' });

  useEffect(() => {
    try {
      const savedBookingId = sessionStorage.getItem('meraki_bookingId');
      const savedGuestDetails = sessionStorage.getItem('meraki_guestDetails');
      if (savedBookingId && savedGuestDetails) {
        const guest = JSON.parse(savedGuestDetails);
        setBookingDetails({
          id: savedBookingId,
          name: guest.firstName ? `${guest.firstName} ${guest.lastName}` : ''
        });
      }
    } catch (e) {}

    // Elegant text transitions
    const textTimer1 = setTimeout(() => setLoadingText('Verifying payment details...'), 1500);
    const textTimer2 = setTimeout(() => setLoadingText('Confirming with your bank...'), 3500);

    // 6 seconds total of processing animation, then switch to success
    const successTimer = setTimeout(() => {
      setStatus('success');
    }, 6000);

    return () => {
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(successTimer);
    };
  }, []);

  return (
    <section className="conf-section">
      <div className="conf-card">
        {status === 'processing' ? (
          <div className="conf-content animate-fade-in">
            
            {/* Elegant Processing Animation */}
            <div className="conf-animation-container">
              <div className="conf-icon-floating card-icon">
                <HugeiconsIcon icon={CreditCardPosIcon} size={36} strokeWidth={1.2} />
              </div>
              
              <div className="conf-scanner-track">
                <div className="conf-scanner-beam"></div>
              </div>
              
              <div className="conf-icon-floating phone-icon">
                <SmartphoneIcon />
              </div>
            </div>

            <h2 className="conf-title">Processing Payment</h2>
            <p className="conf-desc fade-text" key={loadingText}>{loadingText}</p>
            
            <div className="conf-secure-badge">
              <HugeiconsIcon icon={Shield01Icon} size={14} />
              <span>256-bit SSL Encrypted</span>
            </div>
            
          </div>
        ) : (
          <div className="conf-content animate-pop" style={{ width: '100%' }}>
            
            {/* Subtle Success Ripple */}
            <div className="conf-success-ripple">
              <div className="conf-success-icon">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={42} strokeWidth={1.5} color="#ffffff" />
              </div>
            </div>

            <h2 className="conf-title" style={{ marginBottom: '4px' }}>Payment Successful</h2>
            <p className="conf-desc" style={{ marginBottom: '24px' }}>Your booking has been confirmed.</p>
            
            <div className="conf-booking-status-box" style={{ background: '#FDF5FF', border: '1px solid #F3E0F5', borderRadius: '12px', padding: '16px', width: '100%', marginBottom: '28px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#666' }}>Booking ID</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#870097' }}>{bookingDetails.id || 'ML-CONFIRMED'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#666' }}>Status</span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2E7D32' }}></div> Confirmed</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#666' }}>Guest</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{bookingDetails.name || 'Guest'}</span>
              </div>
            </div>

            <button 
              className="conf-home-btn" 
              onClick={() => { if (setCurrentPage) setCurrentPage('home'); }}
              style={{ background: '#870097', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#6B007A'}
              onMouseOut={(e) => e.currentTarget.style.background = '#870097'}
            >
              <HugeiconsIcon icon={Home07Icon} size={18} /> Return Home
            </button>
            
          </div>
        )}
      </div>
    </section>
  );
};

export default Confirmation;