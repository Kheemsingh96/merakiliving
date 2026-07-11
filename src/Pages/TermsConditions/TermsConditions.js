import React from 'react';
import './TermsConditions.css';

const TermsConditions = () => {
  return (
    <div className="terms-conditions-wrapper">
      <div className="terms-conditions-container">
        <div className="terms-conditions-header">
          <h1 className="terms-conditions-title">Terms & Conditions</h1>
          <p className="terms-conditions-intro">Welcome to Meraki Living Farmstay. These simple guidelines help ensure that everyone enjoys their stay.</p>
        </div>

        <div className="terms-conditions-content">
          <div className="terms-conditions-section">
            <h2>1. Check-in & Check-out</h2>
            <p><strong>Check-in:</strong> 12:00 PM onwards <br/> <strong>Check-out:</strong> 11:00 AM</p>
            <p>Early check-in or late check-out is subject to availability and may attract additional charges.</p>
          </div>

          <div className="terms-conditions-section">
            <h2>2. Occupancy & Identification</h2>
            <p>Only the number of guests mentioned in the booking are permitted to stay. All adult guests must present a valid government-issued photo ID at the time of check-in.</p>
          </div>

          <div className="terms-conditions-section">
            <h2>3. Property Care & Quiet Hours</h2>
            <p>Meraki Living Farm Stay is located amidst nature. Guests are requested to respect the surrounding environment, avoid littering, and use resources responsibly. To ensure a peaceful experience for everyone, guests are requested to maintain silence between 10:00 PM and 7:00 AM.</p>
          </div>

          <div className="terms-conditions-section">
            <h2>4. Smoking, Alcohol & Pets</h2>
            <p>Smoking is strictly prohibited inside the cottages. Alcohol may be consumed responsibly within the property. Pets are welcome only with prior approval.</p>
          </div>

          <div className="terms-conditions-section">
            <h2>5. Right to Refuse Service</h2>
            <p>Management reserves the right to refuse accommodation or terminate a stay without refund in cases involving illegal activities, abusive behaviour, or violation of these terms.</p>
          </div>

          <div className="terms-conditions-footer">
            <p>By making a booking, you agree to abide by these terms. For questions, please contact us directly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;