import React from 'react';
import './CTA.css';
import ctaBg from '../../assets/images/cta-bg.png';

const CTA = () => {
  const handleWhatsAppClick = () => {
    const phone = '917037189517';
    const message = encodeURIComponent('Hi Meraki Living! I am interested in booking a stay at your beautiful property. Could you please share availability and pricing details?');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleMapClick = () => {
    window.open('https://www.google.com/maps/dir/29.5297322,79.6710796/Meraki+Living+Luxury+Villas+and+Home+Stay,+Peora,+Mukteshwar,+Uttarakhand+263138/@29.520054,79.6200544,14z/data=!4m9!4m8!1m1!4e1!1m5!1m1!1s0x39a0bbca72b0f415:0xe00b477ac40f9306!2m2!1d79.6289414!2d29.516633?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D', '_blank');
  };

  return (
    <section className="cta-section">
      <div className="cta-bg" style={{ backgroundImage: `url(${ctaBg})` }}></div>

      <div className="cta-container">
        <div className="cta-header">
          <h2 className="cta-title">Plan Your Mountain Escape</h2>
          <p className="cta-subtitle">
            Whether you are planning a peaceful getaway, a family vacation, or a memorable dining experience, we are here to help. Reach out to us or visit Meraki Living and experience the beauty of Mukteshwar.
          </p>
        </div>

        <div className="cta-content">
          <div className="cta-left-box">
            <div className="cta-map-frame" onClick={handleMapClick}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3463.0!2d79.6289414!3d29.516633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a0bbca72b0f415%3A0xe00b477ac40f9306!2sMeraki%20Living%20Luxury%20Villas%20and%20Home%20Stay!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Meraki Living Location"
              ></iframe>
              <div className="cta-map-overlay">
                <div className="cta-map-pin">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Meraki Living</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-right-box">
            <div className="cta-info-list">
              <div className="cta-info-item">
                <div className="cta-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="cta-info-text">
                  <h4>Address</h4>
                  <p>Meraki Living, Peora, Mukteshwar, Uttarakhand – 263132</p>
                </div>
              </div>

              <div className="cta-info-item">
                <div className="cta-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="cta-info-text">
                  <h4>Phone Number</h4>
                  <p>+91 70371 89517</p>
                </div>
              </div>

              <div className="cta-info-item">
                <div className="cta-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="cta-info-text">
                  <h4>Email Address</h4>
                  <p>merakiliving@inivesh.com</p>
                </div>
              </div>

              <div className="cta-info-item">
                <div className="cta-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="cta-info-text">
                  <h4>Opening Hours</h4>
                  <p>Open 24 Hours, Every Day</p>
                </div>
              </div>
            </div>

            <div className="cta-features-row">
              <div className="cta-feature-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                  <circle cx="7" cy="17" r="2"/>
                  <path d="M9 17h6"/>
                  <circle cx="17" cy="17" r="2"/>
                </svg>
                <span>Free Parking</span>
              </div>
              <div className="cta-feature-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>Easy Road Access</span>
              </div>
              <div className="cta-feature-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 22h20"/>
                  <path d="M6 18v-7"/>
                  <path d="M10 18v-10"/>
                  <path d="M14 18v-5"/>
                  <path d="M18 18v-8"/>
                </svg>
                <span>Mountain View</span>
              </div>
              <div className="cta-feature-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                <span>Open Every Day</span>
              </div>
            </div>

            <div className="cta-actions">
              <button className="cta-btn-primary" onClick={handleWhatsAppClick}>
                <span>Book Your Stay</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button className="cta-btn-secondary" onClick={handleWhatsAppClick}>
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;