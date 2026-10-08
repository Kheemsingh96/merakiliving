import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { API_CONFIG_URL } from '../../config/api';
import { safeParseResponse, isPrerendering } from '../../utils/apiHelper';
import './PrivacyPolicy.css';

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

const privacySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy | Meraki Living',
  url: 'https://www.merakiliving.in/privacy-policy',
  description: 'Read the Privacy Policy of Meraki Living to understand how guest information and personal data are collected, protected, and handled.',
  publisher: {
    '@type': 'Organization',
    name: 'Meraki Living',
    url: 'https://www.merakiliving.in'
  }
};

const PrivacyPolicy = () => {
  const [content, setContent] = useState(DEFAULT_PRIVACY_POLICY);

  useEffect(() => {
    if (isPrerendering()) return;
    let isMounted = true;
    fetch(`${API_CONFIG_URL}/api_settings.php`)
      .then(res => safeParseResponse(res))
      .then(parsed => {
        if (!isMounted) return;
        const data = parsed.data;
        if (parsed.ok && data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0 && data.data[0].privacy_policy) {
          setContent(data.data[0].privacy_policy);
        } else {
          setContent(DEFAULT_PRIVACY_POLICY);
        }
      })
      .catch(e => {
        if (isMounted) setContent(DEFAULT_PRIVACY_POLICY);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="privacy-policy-wrapper">
      <Helmet>
        <title>Privacy Policy | Meraki Living</title>
        <meta
          name="description"
          content="Read the Privacy Policy of Meraki Living to understand how your personal information is safely collected, protected, and handled during reservations and visits."
        />
        <link rel="canonical" href="https://www.merakiliving.in/privacy-policy" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Privacy Policy | Meraki Living" />
        <meta
          property="og:description"
          content="Read the Privacy Policy of Meraki Living to understand how your personal information is safely collected, protected, and handled during reservations and visits."
        />
        <meta property="og:url" content="https://www.merakiliving.in/privacy-policy" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy | Meraki Living" />
        <meta
          name="twitter:description"
          content="Read the Privacy Policy of Meraki Living to understand how your personal information is safely collected, protected, and handled during reservations and visits."
        />
        <script type="application/ld+json">{JSON.stringify(privacySchema)}</script>
      </Helmet>
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