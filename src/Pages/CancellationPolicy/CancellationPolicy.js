import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { API_CONFIG_URL } from '../../config/api';
import { safeParseResponse } from '../../utils/apiHelper';
import './CancellationPolicy.css';

const DEFAULT_CANCELLATION_POLICY = `
<div className="cancellation-policy-header">
  <h1 className="cancellation-policy-title">Cancellation Policy</h1>
  <p className="cancellation-policy-intro">We understand that plans can change. Our cancellation policy is designed to be fair and transparent.</p>
</div>

<div className="cancellation-policy-body">
  <div className="cancellation-policy-section">
    <h2>Cancellation Timeframes</h2>
    <div className="cancellation-policy-table-wrapper">
      <table className="cancellation-policy-table">
        <thead>
          <tr>
            <th>Cancellation Time</th>
            <th>Refund Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>More than 7 days before check-in</td>
            <td>Full refund (100%)</td>
          </tr>
          <tr>
            <td>3 to 7 days before check-in</td>
            <td>50% refund</td>
          </tr>
          <tr>
            <td>Less than 3 days before check-in</td>
            <td>No refund</td>
          </tr>
          <tr>
            <td>No-show</td>
            <td>No refund</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div className="cancellation-policy-section">
    <h2>How to Cancel</h2>
    <p>To cancel your reservation, please contact us via WhatsApp or phone at least 24 hours in advance. Refunds, if applicable, will be processed within 5 to 7 business days to the original payment method.</p>
  </div>

  <div className="cancellation-policy-section">
    <h2>Rescheduling</h2>
    <p>Rescheduling requests are subject to availability. If the new dates fall under a different rate period, the price difference will be adjusted accordingly.</p>
  </div>

  <div className="cancellation-policy-section">
    <h2>Force Majeure</h2>
    <p>In the event of unforeseen circumstances such as natural disasters, government restrictions, or emergencies, we will work with you to reschedule your booking or provide a credit for future stays.</p>
  </div>

  <div className="cancellation-policy-section">
    <h2>Need Help?</h2>
    <p>For any cancellation or rescheduling queries, feel free to reach out to us directly. We are happy to assist you.</p>
  </div>

  <div className="cancellation-policy-footer">
    <p>This policy is subject to change. The terms applicable at the time of booking will govern your reservation.</p>
  </div>
</div>
`;

const cancellationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Cancellation Policy | Meraki Living',
  url: 'https://www.merakiliving.in/cancellation-policy',
  description: 'Understand the booking cancellation, refund timelines, and rescheduling policy for Meraki Living Farmstay in Peora, Mukteshwar.',
  publisher: {
    '@type': 'Organization',
    name: 'Meraki Living',
    url: 'https://www.merakiliving.in'
  }
};

const CancellationPolicy = () => {
  const [content, setContent] = useState(DEFAULT_CANCELLATION_POLICY);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_CONFIG_URL}/api_settings.php`)
      .then(res => safeParseResponse(res))
      .then(parsed => {
        if (!isMounted) return;
        const data = parsed.data;
        if (parsed.ok && data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0 && data.data[0].cancellation_policy) {
          setContent(data.data[0].cancellation_policy);
        } else {
          setContent(DEFAULT_CANCELLATION_POLICY);
        }
      })
      .catch(e => {
        if (isMounted) setContent(DEFAULT_CANCELLATION_POLICY);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="cancellation-policy-wrapper">
      <Helmet>
        <title>Cancellation Policy | Meraki Living</title>
        <meta
          name="description"
          content="Understand the booking cancellation, refund timelines, and rescheduling policy for Meraki Living Farmstay in Peora, Mukteshwar."
        />
        <link rel="canonical" href="https://www.merakiliving.in/cancellation-policy" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cancellation Policy | Meraki Living" />
        <meta
          property="og:description"
          content="Understand the booking cancellation, refund timelines, and rescheduling policy for Meraki Living Farmstay in Peora, Mukteshwar."
        />
        <meta property="og:url" content="https://www.merakiliving.in/cancellation-policy" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Cancellation Policy | Meraki Living" />
        <meta
          name="twitter:description"
          content="Understand the booking cancellation, refund timelines, and rescheduling policy for Meraki Living Farmstay in Peora, Mukteshwar."
        />
        <script type="application/ld+json">{JSON.stringify(cancellationSchema)}</script>
      </Helmet>
      <div className="cancellation-policy-outer">
        <div 
          className="cancellation-policy-content" 
          dangerouslySetInnerHTML={{ __html: content.replace(/className=/g, 'class=') }} 
        />
      </div>
    </div>
  );
};

export default CancellationPolicy;