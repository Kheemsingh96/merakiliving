import React, { useState, useEffect } from 'react';
import './PrivacyPolicy.css';

const API_CONFIG_URL = 'http://localhost/merakiliving_backend';

const DEFAULT_PRIVACY_POLICY = `
<div className="privacy-policy-header">
  <h1 className="privacy-policy-title">Privacy Policy</h1>
  <p className="privacy-policy-intro">At Meraki Living Farmstay, your privacy is just as important to us as your comfort.</p>
</div>

<div className="privacy-policy-body">
  <div className="privacy-policy-section">
    <h2>Information We Collect</h2>
    <p>When you make a booking or contact us, we may collect:</p>
    <ul className="privacy-policy-list">
      <li>Name & Email address</li>
      <li>Mobile number & Postal address</li>
      <li>Payment information (processed securely through our payment gateway)</li>
      <li>Booking preferences and special requests</li>
    </ul>
  </div>

  <div className="privacy-policy-section">
    <h2>How We Use Your Information</h2>
    <ul className="privacy-policy-list">
      <li>Process and confirm bookings.</li>
      <li>Communicate regarding your reservation.</li>
      <li>Respond to enquiries and improve our services.</li>
    </ul>
  </div>

  <div className="privacy-policy-section">
    <h2>Information Sharing & Data Security</h2>
    <p>We do not sell, rent or trade your personal information. Information may be shared only with payment service providers or government authorities where required by law.</p>
    <p>We implement reasonable technical and organisational measures to safeguard your personal information against unauthorised access, misuse or disclosure.</p>
  </div>

  <div className="privacy-policy-section">
    <h2>Your Rights</h2>
    <p>You may request access to, correction or deletion of your personal information by contacting us.</p>
  </div>

  <div className="privacy-policy-footer">
    <p>Last updated: July 2026. If you have any questions about this policy, please reach out to us.</p>
  </div>
</div>
`;

const PrivacyPolicy = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_settings.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0 && data.data[0].privacy_policy) {
          setContent(data.data[0].privacy_policy);
        } else {
          setContent(DEFAULT_PRIVACY_POLICY);
        }
      })
      .catch(e => {
        console.error("Error fetching policy:", e);
        setContent(DEFAULT_PRIVACY_POLICY);
      });
  }, []);

  return (
    <div className="privacy-policy-wrapper">
      <div className="privacy-policy-outer">
        <div 
          className="privacy-policy-content" 
          dangerouslySetInnerHTML={{ __html: content.replace(/className=/g, 'class=') }} 
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;