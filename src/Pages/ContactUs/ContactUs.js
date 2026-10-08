import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FiArrowRight, 
  FiSend, 
  FiNavigation,
  FiChevronDown
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Call02Icon, 
  Mail01Icon, 
  MapPinIcon, 
  CheckmarkCircle01Icon
} from '@hugeicons/core-free-icons';

import { API_CONFIG_URL } from '../../config/api';
import OptimizedImage from '../../components/Common/OptimizedImage';
import heroBgImg from '../../assets/images/mountain-bg.avif';
import './ContactUs.css';

const ENQUIRY_OPTIONS = [
  'Room Booking',
  'Stay Enquiry',
  'Travel Information',
  'Cafe Enquiry',
  'Own a Villa',
  'Other'
];

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Us | Meraki Living',
  url: 'https://www.merakiliving.in/contact-us',
  description: 'Get in touch with Meraki Living homestay in Peora, Mukteshwar, Uttarakhand. Contact us for room reservations, cafe enquiries, villa investments, and location directions.',
  mainEntity: {
    '@type': 'LodgingBusiness',
    name: 'Meraki Living',
    telephone: '+919456103445',
    email: 'info@merakiliving.in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Village Peora, Near Mukteshwar',
      addressLocality: 'Mukteshwar',
      addressRegion: 'Uttarakhand',
      postalCode: '263138',
      addressCountry: 'IN'
    }
  }
};

function ContactUs({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enquiryType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setFormError('Please provide an email address or phone number so we can reach you.');
      return;
    }
    if (!formData.message.trim()) {
      setFormError('Please enter your message.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const payload = {
      name: formData.fullName.trim(),
      full_name: formData.fullName.trim(),
      mobile_number: formData.phone.trim(),
      phone_number: formData.phone.trim(),
      email: formData.email.trim(),
      email_address: formData.email.trim(),
      enquiry_type: formData.enquiryType || 'General Enquiry',
      message: formData.message.trim()
    };

    try {
      let res = await fetch(`${API_CONFIG_URL}/api_contact.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 404) {
        res = await fetch(`${API_CONFIG_URL}/api_contactus.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json().catch(() => null);

      if (res.ok && data && (data.status === 'success' || data.success === true)) {
        setIsSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          enquiryType: '',
          message: ''
        });
      } else {
        const errMsg =
          data && (data.message || data.error)
            ? data.message || data.error
            : 'Unable to submit your enquiry. Please check your information and try again.';
        setFormError(errMsg);
      }
    } catch (err) {
      setFormError('Unable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+919456103445';
  };

  const handleWhatsAppClick = () => {
    const phone = '919456103445';
    const msg = encodeURIComponent('Hi Meraki Living!\n\nI am planning a visit and would like to know more about bookings and stay availability.');
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@merakiliving.in';
  };

  const handleDirectionsClick = () => {
    window.open('https://www.google.com/maps/dir/?api=1&destination=Meraki+Living+Peora+Mukteshwar', '_blank');
  };

  return (
    <div className="contact-page">
      <Helmet>
        <title>Contact Us | Meraki Living Peora Mukteshwar</title>
        <meta
          name="description"
          content="Get in touch with Meraki Living in Peora, Mukteshwar for homestay reservations, location details, and travel assistance. Call, email, or chat on WhatsApp."
        />
        <link rel="canonical" href="https://www.merakiliving.in/contact-us" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Us | Meraki Living Peora Mukteshwar" />
        <meta
          property="og:description"
          content="Get in touch with Meraki Living in Peora, Mukteshwar for homestay reservations, location details, and travel assistance. Call, email, or chat on WhatsApp."
        />
        <meta property="og:url" content="https://www.merakiliving.in/contact-us" />
        <meta property="og:image" content={heroBgImg} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Meraki Living Peora Mukteshwar" />
        <meta
          name="twitter:description"
          content="Get in touch with Meraki Living in Peora, Mukteshwar for homestay reservations, location details, and travel assistance."
        />
        <meta name="twitter:image" content={heroBgImg} />
        <script type="application/ld+json">{JSON.stringify(contactSchema)}</script>
      </Helmet>
      {/* 1. Hero Header Section */}
      <section className="contact-hero-section">
        <div className="contact-hero-bg">
          <OptimizedImage
            src={heroBgImg}
            alt="Scenic mountain view surrounding Meraki Living in Peora, Mukteshwar"
            className="contact-hero-img"
            width="1920"
            height="1080"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            noWrapper={true}
          />
        </div>
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-container">
          <div className="contact-hero-content">
            <span className="contact-pre-badge">Get In Touch</span>
            <h1 className="contact-hero-title">Contact Us</h1>
            <p className="contact-hero-subtitle">
              Planning a peaceful mountain escape?<br />We’re here to help you plan your stay at Meraki Living Mukteshwar
            </p>
          </div>
        </div>
      </section>

      {/* 2. Contact Cards Grid Section */}
      <section className="contact-cards-section">
        <div className="contact-container">
          <header className="contact-section-header">
            <h2 className="contact-section-title">We’re Here to Help</h2>
            <p className="contact-section-desc">
              Whether you need help choosing your room, planning your visit, or simply want to know more about Meraki Living, feel free to reach out to us. Our team will be happy to assist you.
            </p>
          </header>

          <div className="contact-cards-grid">
            {/* Card 1: Call Us */}
            <div className="contact-card">
              <div className="contact-card-icon-wrap">
                <HugeiconsIcon icon={Call02Icon} size={24} color="#870097" />
              </div>
              <h3 className="contact-card-title">Call Us</h3>
              <p className="contact-card-desc">
                Speak with us directly for bookings, stay details, or any questions.
              </p>
              <div className="contact-card-detail">
                <span>+91 94561 03445</span>
              </div>
              <button
                type="button"
                className="contact-card-btn"
                onClick={handleCallClick}
                aria-label="Call Meraki Living directly"
              >
                <span>Call Now</span>
                <FiArrowRight />
              </button>
            </div>

            {/* Card 2: WhatsApp Us */}
            <div className="contact-card">
              <div className="contact-card-icon-wrap whatsapp-bg">
                <FaWhatsapp size={24} color="#25D366" />
              </div>
              <h3 className="contact-card-title">WhatsApp Us</h3>
              <p className="contact-card-desc">
                Send us a message and we’ll help you with your stay and travel plans.
              </p>
              <div className="contact-card-detail">
                <span>Instant Live Chat</span>
                <span className="contact-card-subdetail">Quick response on WhatsApp</span>
              </div>
              <button
                type="button"
                className="contact-card-btn whatsapp-btn"
                onClick={handleWhatsAppClick}
                aria-label="Message Meraki Living on WhatsApp"
              >
                <span>WhatsApp Us</span>
                <FiArrowRight />
              </button>
            </div>

            {/* Card 3: Email Us */}
            <div className="contact-card">
              <div className="contact-card-icon-wrap">
                <HugeiconsIcon icon={Mail01Icon} size={24} color="#870097" />
              </div>
              <h3 className="contact-card-title">Email Us</h3>
              <p className="contact-card-desc">
                Write to us for enquiries, booking assistance, or any other information.
              </p>
              <div className="contact-card-detail">
                <span>info@merakiliving.in</span>
                <span className="contact-card-subdetail">merakiliving@inivesh.com</span>
              </div>
              <button
                type="button"
                className="contact-card-btn"
                onClick={handleEmailClick}
                aria-label="Email Meraki Living"
              >
                <span>Email Us</span>
                <FiArrowRight />
              </button>
            </div>

            {/* Card 4: Location */}
            <div className="contact-card">
              <div className="contact-card-icon-wrap">
                <HugeiconsIcon icon={MapPinIcon} size={24} color="#870097" />
              </div>
              <h3 className="contact-card-title">Visit Meraki Living</h3>
              <p className="contact-card-desc">
                Village Peora, Mukteshwar, Uttarakhand
              </p>
              <div className="contact-card-detail">
                <span>Peora, Near Mukteshwar</span>
                <span className="contact-card-subdetail">District Nainital – 263138</span>
              </div>
              <button
                type="button"
                className="contact-card-btn"
                onClick={handleDirectionsClick}
                aria-label="Get Directions to Meraki Living on Google Maps"
              >
                <span>Get Directions</span>
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Inquiry Form & Travel Directions Section */}
      <section className="contact-main-section">
        <div className="contact-container">
          <div className="contact-split-grid">
            {/* Left Box: Enquiry Form */}
            <div className="contact-form-box">
              <header className="contact-form-header">
                <h2 className="contact-form-title">Send Us Your Enquiry</h2>
                <p className="contact-form-desc">
                  Have a question or planning something special? Share your details and we’ll get back to you with the information you need.
                </p>
              </header>

              {isSubmitted ? (
                <div className="contact-success-box" role="alert">
                  <div className="contact-success-icon">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={36} color="#15803D" />
                  </div>
                  <h3>Thank you for reaching out to Meraki Living.</h3>
                  <p>We’ve received your enquiry and will get back to you soon.</p>
                  <button
                    type="button"
                    className="contact-reset-btn"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {formError && (
                    <div className="contact-error-alert" role="alert">
                      {formError}
                    </div>
                  )}

                  <div className="contact-field-group">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="contact-input"
                      placeholder="Full Name *"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      aria-label="Full Name *"
                    />
                  </div>

                  <div className="contact-field-row">
                    <div className="contact-field-group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="contact-input"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        aria-label="Email Address"
                      />
                    </div>

                    <div className="contact-field-group">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="contact-input"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        aria-label="Phone Number"
                      />
                    </div>
                  </div>

                  <div className="contact-field-group">
                    <div className="contact-select-wrap">
                      <select
                        id="enquiryType"
                        name="enquiryType"
                        className="contact-select"
                        value={formData.enquiryType}
                        onChange={handleChange}
                        aria-label="Select Enquiry Type"
                      >
                        <option value="" disabled hidden>Select Enquiry Type</option>
                        {ENQUIRY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <FiChevronDown className="contact-select-icon" />
                    </div>
                  </div>

                  <div className="contact-field-group">
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      className="contact-textarea"
                      placeholder="Message *"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      aria-label="Message *"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className={`contact-submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Sending Enquiry...</span>
                    ) : (
                      <>
                        <span>Send Enquiry</span>
                        <FiSend />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Box: Find Your Way to Meraki Living */}
            <div className="contact-travel-card">
              <header className="contact-travel-header">
                <h3 className="contact-travel-title">Find Your Way to Meraki Living</h3>
                <p className="contact-travel-desc">
                  Meraki Living is located in the peaceful village of Peora near Mukteshwar, Uttarakhand. Here is how you can reach us:
                </p>
              </header>

              <div className="contact-travel-list">
                <div className="contact-travel-item">
                  <div className="contact-travel-icon">🚗</div>
                  <div className="contact-travel-info">
                    <h4>By Road</h4>
                    <p>Reach Meraki Living by road through the scenic mountain routes of Uttarakhand. The final drive towards Peora offers a peaceful Himalayan travel experience.</p>
                  </div>
                </div>

                <div className="contact-travel-item">
                  <div className="contact-travel-icon">🚆</div>
                  <div className="contact-travel-info">
                    <h4>By Train</h4>
                    <p>The nearest major railway station is Kathgodam. From Kathgodam, Meraki Living is approximately 60 km away by road.</p>
                  </div>
                </div>

                <div className="contact-travel-item">
                  <div className="contact-travel-icon">✈️</div>
                  <div className="contact-travel-info">
                    <h4>By Air</h4>
                    <p>The nearest airport is Pantnagar Airport. From Pantnagar, Meraki Living is approximately 85 km away by road.</p>
                  </div>
                </div>
              </div>

              <div className="contact-travel-action">
                <button
                  type="button"
                  className="contact-directions-btn"
                  onClick={handleDirectionsClick}
                >
                  <span>Get Directions</span>
                  <FiNavigation />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
