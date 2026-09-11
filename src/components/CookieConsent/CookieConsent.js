import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

export default function CookieConsent({ setCurrentPage }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or declined
    const savedConsent = localStorage.getItem('meraki_cookie_consent');
    if (savedConsent) {
      return;
    }

    // Show after scrolling a bit or after a short delay
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fallback timer so it shows after 3 seconds even if user stays at top
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem('meraki_cookie_consent', 'accepted');
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { consent: 'accepted' } }));
  };

  const handleDecline = () => {
    localStorage.setItem('meraki_cookie_consent', 'rejected');
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { consent: 'rejected' } }));
  };

  const handlePageClick = (e, page) => {
    e.preventDefault();
    if (setCurrentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-container" role="dialog" aria-live="polite" aria-label="Website Disclaimer and Cookie Consent">
      <div className="cookie-consent-content">
        <div className="cookie-consent-header">
          <div className="cookie-consent-icon-wrapper" aria-hidden="true">
            <svg 
              className="cookie-consent-icon-svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#870097" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              <path d="M8.5 8.5v.01" />
              <path d="M16 15.5v.01" />
              <path d="M12 12v.01" />
              <path d="M11 17v.01" />
              <path d="M7 13v.01" />
            </svg>
          </div>
          <h3 className="cookie-consent-title">Website Disclaimer</h3>
        </div>

        <div className="cookie-consent-body">
          <p className="cookie-disclaimer-paragraph">
            The information provided on the Meraki Living Farmstay website is intended for general information and booking purposes only. While we make every effort to ensure that all information, photographs, descriptions, pricing and availability are accurate and up to date, occasional errors or changes may occur.
          </p>
          <p className="cookie-disclaimer-paragraph">
            Photographs shown on the website are representative of the property and surrounding areas. Seasonal changes in weather, vegetation, views and farming activities may result in slight variations from the images displayed.
          </p>
          <p className="cookie-disclaimer-paragraph">
            Tariffs, packages, facilities and services are subject to change without prior notice. Availability of specific cottages, activities and amenities may vary depending on the season, maintenance schedules or operational requirements.
          </p>
          <p className="cookie-disclaimer-paragraph">
            Meraki Living Farmstay is located in the Himalayan region. Road conditions, weather, power supply, internet connectivity and mobile network availability may occasionally be affected by natural conditions beyond our control. We appreciate your understanding and patience in such situations.
          </p>
          <p className="cookie-disclaimer-paragraph">
            Guests participating in trekking, village walks, bonfires, farm activities or any outdoor experiences do so voluntarily and at their own risk. While reasonable safety measures are maintained, Meraki Living Farmstay shall not be liable for injuries, accidents, loss or damage arising from participation in such activities.
          </p>
          <p className="cookie-disclaimer-paragraph">
            Our website may contain links to third-party websites for your convenience. Meraki Living Farmstay is not responsible for the content, privacy practices or services offered by such external websites.
          </p>
          <p className="cookie-disclaimer-paragraph">
            By using this website and making a reservation, you acknowledge that you have read and accepted our{' '}
            <button type="button" className="cookie-consent-link" onClick={(e) => handlePageClick(e, 'terms-conditions')}>
              Terms & Conditions
            </button>,{' '}
            <button type="button" className="cookie-consent-link" onClick={(e) => handlePageClick(e, 'cancellation-policy')}>
              Cancellation Policy
            </button>, Refund Policy and{' '}
            <button type="button" className="cookie-consent-link" onClick={(e) => handlePageClick(e, 'privacy-policy')}>
              Privacy Policy
            </button>.
          </p>
          <p className="cookie-disclaimer-paragraph cookie-disclaimer-highlight">
            Meraki Living Farmstay is a boutique Himalayan farm stay located in Peora, Near Mukteshwar, Uttarakhand. Our policies are designed to ensure a peaceful, transparent and enjoyable experience for all our guests while preserving the natural beauty and serenity of our surroundings.
          </p>
        </div>

        <div className="cookie-consent-actions">
          <button 
            type="button" 
            className="cookie-btn cookie-btn-decline"
            onClick={handleDecline}
          >
            Reject All
          </button>
          <button 
            type="button" 
            className="cookie-btn cookie-btn-accept"
            onClick={handleAccept}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
