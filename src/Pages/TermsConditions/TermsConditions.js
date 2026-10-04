import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { API_CONFIG_URL } from '../../config/api';
import { safeParseResponse } from '../../utils/apiHelper';
import './TermsConditions.css';

const DEFAULT_TERMS_CONDITIONS = `
<div className="terms-conditions-header">
  <h1 className="terms-conditions-title">Terms & Conditions</h1>
  <p className="terms-conditions-intro">Welcome to Meraki Living Farmstay. These simple guidelines help ensure that everyone enjoys their stay.</p>
</div>

<div className="terms-conditions-body">
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
`;

const termsSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms & Conditions | Meraki Living',
  url: 'https://www.merakiliving.in/terms-conditions',
  description: 'Review the terms and conditions for booking and staying at Meraki Living Farmstay in Peora, Mukteshwar.',
  publisher: {
    '@type': 'Organization',
    name: 'Meraki Living',
    url: 'https://www.merakiliving.in'
  }
};

const TermsConditions = () => {
  const [content, setContent] = useState(DEFAULT_TERMS_CONDITIONS);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_CONFIG_URL}/api_settings.php`)
      .then(res => safeParseResponse(res))
      .then(parsed => {
        if (!isMounted) return;
        const data = parsed.data;
        if (parsed.ok && data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0 && data.data[0].terms_conditions) {
          setContent(data.data[0].terms_conditions);
        } else {
          setContent(DEFAULT_TERMS_CONDITIONS);
        }
      })
      .catch(e => {
        if (isMounted) setContent(DEFAULT_TERMS_CONDITIONS);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="terms-conditions-wrapper">
      <Helmet>
        <title>Terms & Conditions | Meraki Living</title>
        <meta
          name="description"
          content="Review the terms and conditions for booking and staying at Meraki Living Farmstay in Peora, Mukteshwar."
        />
        <link rel="canonical" href="https://www.merakiliving.in/terms-conditions" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Terms & Conditions | Meraki Living" />
        <meta
          property="og:description"
          content="Review the terms and conditions for booking and staying at Meraki Living Farmstay in Peora, Mukteshwar."
        />
        <meta property="og:url" content="https://www.merakiliving.in/terms-conditions" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Terms & Conditions | Meraki Living" />
        <meta
          name="twitter:description"
          content="Review the terms and conditions for booking and staying at Meraki Living Farmstay in Peora, Mukteshwar."
        />
        <script type="application/ld+json">{JSON.stringify(termsSchema)}</script>
      </Helmet>
      <div className="terms-conditions-outer">
        <div 
          className="terms-conditions-content" 
          dangerouslySetInnerHTML={{ __html: content.replace(/className=/g, 'class=') }} 
        />
      </div>
    </div>
  );
};

export default TermsConditions;