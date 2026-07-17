import React, { useEffect, useState } from 'react';
import './Confirmation.css';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  CreditCardPosIcon, 
  CheckmarkBadge01Icon, 
  Shield01Icon 
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

  useEffect(() => {
    // Elegant text transitions
    const textTimer1 = setTimeout(() => setLoadingText('Verifying payment details...'), 1500);
    const textTimer2 = setTimeout(() => setLoadingText('Confirming with your bank...'), 3500);

    // 6 seconds total of processing animation, then switch to success
    const successTimer = setTimeout(() => {
      setStatus('success');
      
      // 2 seconds of success animation, then redirect back to home automatically
      setTimeout(() => {
        if (setCurrentPage) setCurrentPage('home');
      }, 2000);
    }, 6000);

    return () => {
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(successTimer);
    };
  }, [setCurrentPage]);

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
          <div className="conf-content animate-pop">
            
            {/* Subtle Success Ripple */}
            <div className="conf-success-ripple">
              <div className="conf-success-icon">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={42} strokeWidth={1.5} color="#ffffff" />
              </div>
            </div>

            <h2 className="conf-title">Payment Successful</h2>
            <p className="conf-desc">Your booking is confirmed. Redirecting you home...</p>
            
          </div>
        )}
      </div>
    </section>
  );
};

export default Confirmation;