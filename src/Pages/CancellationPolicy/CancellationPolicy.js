import React from 'react';
import './CancellationPolicy.css';

const CancellationPolicy = () => {
  return (
    <div className="cancellation-policy-wrapper">
      <div className="cancellation-policy-outer">
        <div className="cancellation-policy-content">
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
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;