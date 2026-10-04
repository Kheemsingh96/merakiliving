import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FiHome,
  FiSun,
  FiMaximize2,
  FiWifi,
  FiZap,
  FiEye,
  FiMapPin,
  FiPhone,
  FiMail,
  FiArrowRight,
  FiImage,
  FiX,
  FiCheckCircle,
  FiSend,
  FiLoader
} from 'react-icons/fi';
import { API_CONFIG_URL } from '../../config/api';
import { safeFetchJson } from '../../utils/apiHelper';
import OptimizedImage from '../../components/Common/OptimizedImage';
import './OwnAVilla.css';

import ownvillaHero from '../../assets/images/ownvilla-hero.avif';
import ownvilla1 from '../../assets/images/ownvilla-1.avif';
import ownvilla2 from '../../assets/images/ownvilla-2.avif';
import ownvilla3 from '../../assets/images/ownvilla-3.avif';
import ownvilla4 from '../../assets/images/ownvilla-4.avif';
import ownvilla5 from '../../assets/images/ownvilla-5.avif';

const SIGNATURE_AMENITIES = [
  {
    icon: FiHome,
    title: 'Fully serviced villas/ cottages'
  },
  {
    icon: FiSun,
    title: 'Bright and airy living spaces'
  },
  {
    icon: FiMaximize2,
    title: 'Large wooden balconies'
  },
  {
    icon: FiWifi,
    title: 'Clear mobile and 5G connectivity'
  },
  {
    icon: FiZap,
    title: 'Electricity & water connection'
  },
  {
    icon: FiEye,
    title: 'Panoramic Himalayan view'
  }
];

const SITE_PICTURES = [
  { src: ownvilla1, title: 'Boutique Living Interiors' },
  { src: ownvilla2, title: 'Architectural Stone & Wood Villa' },
  { src: ownvilla3, title: 'Panoramic Mountain Balcony' },
  { src: ownvilla4, title: 'Scenic Himalayan Vista' }
];

const OFFICE_LOCATIONS = [
  {
    city: 'Mumbai',
    address: 'C-214, 2nd Floor, Eastern Business District (Magnet Mall), LBS Road, Bhandup West, Mumbai - 400078.'
  },
  {
    city: 'Delhi NCR',
    address: '311 B, 3rd Floor, Panchsheel Square Mall, Crossing Republic Ghaziabad - 201016.'
  },
  {
    city: 'Nainital',
    address: 'Laxmi Vihar, Malli Bamori, Nr. Balutia Farms, Haldwani Dist - Nainital - 263139.'
  }
];

const ownAVillaSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Own a Villa in Mukteshwar | Meraki Living',
  url: 'https://www.merakiliving.in/own-a-villa',
  description: 'Invest in fully serviced luxury mountain villas and cottages at Meraki Living in Peora, Mukteshwar, Uttarakhand. Panoramic Himalayan views, 5G connectivity, and managed rental returns.',
  publisher: {
    '@type': 'Organization',
    name: 'Meraki Living',
    url: 'https://www.merakiliving.in',
    logo: 'https://www.merakiliving.in/static/media/logo.avif'
  },
  mainEntity: {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Place',
      name: 'Meraki Living Villas & Cottages',
      description: 'Luxury mountain villas and cottages with panoramic Himalayan views in Peora, Mukteshwar, Uttarakhand.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Peora',
        addressRegion: 'Uttarakhand',
        postalCode: '263138',
        addressCountry: 'IN'
      }
    }
  }
};

function OwnAVilla({ setCurrentPage }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    enquiryTopic: 'Custom Luxury Villa Purchase',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('oav-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const animatedElements = document.querySelectorAll('.oav-animate, .oav-stagger');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleOpenExplore = useCallback(() => {
    if (setCurrentPage) {
      setCurrentPage('home', null, 'gallery');
    }
  }, [setCurrentPage]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
    setSubmitError(null);
  }, []);

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const errors = {};
      const trimmedName = formData.fullName.trim();
      const trimmedPhone = formData.phone.trim();
      const trimmedEmail = formData.email.trim();
      const trimmedEnquiryTopic = formData.enquiryTopic.trim();
      const trimmedMessage = formData.message.trim();

      if (!trimmedName) {
        errors.fullName = 'Please enter your name';
      }

      if (!trimmedPhone) {
        errors.phone = 'Please enter your mobile number';
      } else if (!/^[0-9+\-\s()]{7,15}$/.test(trimmedPhone)) {
        errors.phone = 'Please enter a valid mobile number';
      }

      if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        errors.email = 'Please enter a valid email address';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setFormErrors({});
      setSubmitError(null);
      setIsSubmitting(true);

      const payload = {
        name: trimmedName,
        mobile_number: trimmedPhone,
        email: trimmedEmail,
        enquiry_type: trimmedEnquiryTopic,
        message: trimmedMessage
      };

      try {
        let result = await safeFetchJson(`${API_CONFIG_URL}/api_ownvilla.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        // Fallback in case endpoint is mapped to api_ownvilla_enquiries.php
        if (!result.ok && result.status === 404) {
          result = await safeFetchJson(`${API_CONFIG_URL}/api_ownvilla_enquiries.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        if (result.ok) {
          if (result.data && (result.data.status === 'error' || result.data.success === false)) {
            setSubmitError(
              result.data.message ||
                result.data.error ||
                'Unable to submit your enquiry. Please check your information and try again.'
            );
          } else {
            setFormSubmitted(true);
            setFormData({
              fullName: '',
              phone: '',
              email: '',
              enquiryTopic: 'Custom Luxury Villa Purchase',
              message: ''
            });
            setFormErrors({});
            setSubmitError(null);
          }
        } else {
          setSubmitError(
            result.error ||
              'Failed to send enquiry. Please check your connection or try again later.'
          );
        }
      } catch (err) {
        setSubmitError(
          'An unexpected error occurred while sending your enquiry. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting]
  );

  return (
    <div className="oav-page">
      <Helmet>
        <title>Own a Villa in Mukteshwar | Luxury Mountain Cottages | Meraki Living</title>
        <meta
          name="description"
          content="Invest in fully serviced luxury mountain villas and cottages at Meraki Living in Peora, Mukteshwar, Uttarakhand. Panoramic Himalayan views, 5G connectivity, and managed rental returns."
        />
        <link rel="canonical" href="https://www.merakiliving.in/own-a-villa" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Own a Villa in Mukteshwar | Luxury Mountain Cottages | Meraki Living" />
        <meta
          property="og:description"
          content="Invest in fully serviced luxury mountain villas and cottages at Meraki Living in Peora, Mukteshwar, Uttarakhand. Panoramic Himalayan views, 5G connectivity, and managed rental returns."
        />
        <meta property="og:url" content="https://www.merakiliving.in/own-a-villa" />
        <meta property="og:image" content={ownvillaHero} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Own a Villa in Mukteshwar | Luxury Mountain Cottages | Meraki Living" />
        <meta
          name="twitter:description"
          content="Invest in fully serviced luxury mountain villas and cottages at Meraki Living in Peora, Mukteshwar, Uttarakhand."
        />
        <meta name="twitter:image" content={ownvillaHero} />
        <script type="application/ld+json">{JSON.stringify(ownAVillaSchema)}</script>
      </Helmet>
      <section className="oav-hero-section">
        <div className="oav-hero-bg-layer">
          <OptimizedImage
            src={ownvillaHero}
            alt="Majestic Himalayan peaks backdrop at Meraki Living"
            className="oav-hero-bg-img"
            width="1920"
            height="1080"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            noWrapper={true}
          />
          <div className="oav-hero-overlay" aria-hidden="true" />
        </div>

        <div className="oav-container oav-hero-container">
          <div className="oav-hero-content oav-animate">
            <h1 className="oav-hero-title">
              Discover Paradise More Than 5000 Ft. Above Sea Level With Nature as a Lifetime Amenity
            </h1>

            <p className="oav-hero-subtitle">
              Fully Customized Luxury Cottages and Villas
            </p>

            <div className="oav-hero-cta">
              <button
                type="button"
                className="oav-btn-primary"
                onClick={() => scrollToSection('oav-contact')}
              >
                <span>Contact Us</span>
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="oav-section oav-intro-section">
        <div className="oav-container">
          <div className="oav-intro-grid oav-animate">
            <div className="oav-intro-text-col">
              <h2 className="oav-section-title">
                Villa Homes &amp; Cottages with Farm Land from Meraki
              </h2>
              <p className="oav-section-subtitle-brand">
                Customized &amp; Fully Serviceable Luxury Cottages and Villas.
              </p>
              <div className="oav-divider-line" />

              <p className="oav-body-text">
                Our Villas, Cottages and Farm Land/Plots are located at beautiful serene locations of Uttarakhand - Nainital, Bhimtal, Almora, Ranikhet, Ramgarh &amp; Mukteshwar - to name a few.
              </p>

              <p className="oav-body-text">
                Own a home in the lap of nature and give a break to yourself and your family from the pollution, stress, traffic congestion and inorganic life style of Metro Cities. A life that you always wanted from deep within.
              </p>
            </div>

            <div className="oav-intro-media-col">
              <div className="oav-composition-wrap">
                <div className="oav-comp-main">
                  <OptimizedImage
                    src={ownvilla5}
                    alt="Customized luxury cottages and villas at Meraki Living"
                    className="oav-comp-img"
                    width="1086"
                    height="1448"
                    loading="lazy"
                    decoding="async"
                    noWrapper={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="oav-section oav-why-section">
        <div className="oav-container">
          <div className="oav-section-header oav-animate">
            <h2 className="oav-section-title">Why Meraki Living?</h2>
            <div className="oav-divider-line" />
          </div>

          <div className="oav-why-grid oav-animate">
            <div className="oav-why-text-col">
              <h3 className="oav-why-question">
                What do we compromise in the name of comfortable living in bigger cities?
              </h3>
              <p className="oav-why-para">
                With increasing pollution, stress, traffic congetsion, and an inorganic lifestyle leading us towards diseases, chronic illness, mental disorders and high health care costs.
              </p>
              <p className="oav-why-emphasis">
                Did you dream of this life for yourself and your loved ones ...think again!
              </p>

              <p className="oav-why-para">
                We introduce a new way of living - "Meraki Living" - a life that you always wanted from deep within. Where you can breathe fresh air, enjoy lush green trees, find peace walking down the woods, enjoy the melodies of nature listening to ripples of stream flowing downhill or birds chirping. All become part of a living experience that sets it apart from any other residence.
              </p>

              <p className="oav-why-para oav-why-soul">
                We provide you with an adobe that we have built for you with love, passion and a lot of soul.
              </p>

              <p className="oav-why-para oav-why-investment">
                To top it all ...it's not just Luxury Eco Residences with sustainable architecture but an excellent Investment Option that is hard to believe!
              </p>
            </div>

            <div className="oav-why-media-col">
              <div className="oav-nature-image-card">
                <OptimizedImage
                  src={ownvilla4}
                  alt="Highland serenity and nature at Meraki Living"
                  className="oav-nature-img"
                  width="640"
                  height="420"
                  loading="lazy"
                  decoding="async"
                  noWrapper={true}
                />
              </div>

              <div className="oav-quote-box">
                <div className="oav-quote-mark">“</div>
                <blockquote className="oav-quote-content">
                  Nature is Incomprehensibly Beautiful - An Endless Prospect of Magic and Wonder!
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="oav-section oav-dark-section">
        <div className="oav-container">
          <div className="oav-dark-header oav-animate">
            <h2 className="oav-dark-title">OUR VILLA HOMES</h2>
            <p className="oav-dark-subtitle">
              Customized homes in the serenity of Nainital, Mukeshwar, Bhimtal, Binsar, Almora.
            </p>
            <h3 className="oav-dark-loc-heading">
              Most Conveniently Located from every destination worth visiting
            </h3>
          </div>

          <div className="oav-dark-content-block oav-animate">
            <p className="oav-dark-distance-para">
              70 KM from Kathgodam (Nearest Railway Station), 60 KM from Nainital Lake, 55 KM from Jageshwar Dham Temple, 50 KM from Ranikhet Golf Course, 40 KM from Binsar Wildlife Sanctuary, 20 KM from Almora City of Kumaon Cultural Heritage, 20 KM from Mukteshwar Dham.
            </p>

            <p className="oav-dark-rental-para">
              Complete management of the villa with committed rental income.
              <br />
              To know more about this, call us or write to us and we will be glad to assist you.
            </p>
          </div>

          <div className="oav-dark-amenities-row oav-stagger">
            {SIGNATURE_AMENITIES.map((amenity, idx) => {
              const IconComponent = amenity.icon;
              return (
                <div className="oav-dark-amenity-item" key={idx}>
                  <div className="oav-dark-amenity-icon">
                    <IconComponent size={38} />
                  </div>
                  <h4 className="oav-dark-amenity-title">{amenity.title}</h4>
                </div>
              );
            })}
          </div>

          <div className="oav-dark-actions oav-animate">
            <button
              type="button"
              className="oav-btn-gold"
              onClick={handleOpenExplore}
            >
              <FiImage size={16} />
              <span>View Site Pictures</span>
            </button>

            <button
              type="button"
              className="oav-btn-dark-outline"
              onClick={() => scrollToSection('oav-contact')}
            >
              <FiMail size={16} />
              <span>Contact us</span>
            </button>
          </div>
        </div>
      </section>

      <section id="oav-site-pictures" className="oav-section oav-listing-section">
        <div className="oav-container">
          <div className="oav-section-header-center oav-animate">
            <h2 className="oav-section-title">
              Discover a Place You'll Love <span className="oav-heart-icon">❤</span> to Live
            </h2>
            <div className="oav-divider-line oav-divider-center" />
            <p className="oav-body-text oav-lead-text">
              Take a deep dive and browse original property photos, drone footage, resident reviews and local insights to see if the properties for sale are right for you.
            </p>

            <div className="oav-listing-btn-wrap">
              <button
                type="button"
                className="oav-btn-primary"
                onClick={handleOpenExplore}
              >
                <span>View Current Listing</span>
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>

          <div id="oav-gallery-showcase" className="oav-gallery-grid oav-stagger">
            {SITE_PICTURES.map((item, idx) => (
              <div
                className="oav-gallery-card"
                key={idx}
                onClick={() => setSelectedImage(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedImage(item);
                }}
              >
                <div className="oav-gallery-img-wrap">
                  <OptimizedImage
                    src={item.src}
                    alt={item.title}
                    className="oav-gallery-img"
                    width="600"
                    height="420"
                    loading="lazy"
                    decoding="async"
                    noWrapper={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="oav-section oav-operate-section">
        <div className="oav-container">
          <div className="oav-operate-card oav-animate">
            <h2 className="oav-section-title">
              We Build and Operate Successful Properties
            </h2>
            <div className="oav-divider-line" />
            <p className="oav-body-text">
              Meraki Living is a full-service development and management company based in Nainital, Uttarakhand. Our story began in 2021, when our founders decided to venture into developing good residential spaces at a lucrative tourist destination which is a strong niche market that provided better ROI.
            </p>
          </div>
        </div>
      </section>

      <section className="oav-section oav-how-section">
        <div className="oav-container">
          <div className="oav-how-card oav-animate">
            <h2 className="oav-section-title">How Do We Do It?</h2>
            <div className="oav-divider-line" />

            <p className="oav-body-text">
              We develop and operate exceptional properties in Uttarakhand, from boutique guesthouses, private cottages to luxury villas and resorts, to managed residences and co-living co-working spaces. We allow anyone to buy one or more units in our projects and keep the lion's share of the profits. Imagine what it will feel like relaxing in your own vacation retreat that you purchased from Meraki Living that was paid for by other tourists. With a combined experience of over 25 year into Real Estate and Financial Services, our company is staffed to care for your investment at every step of the way. From design and construction to guest check-ins and housekeeping, everything we do is a labour of love by our dedicated team of professionals.
            </p>

            <div className="oav-how-footer-banner">
              <p className="oav-how-prompt">
                To Know more about how it works: please submit your contact details or call us.
              </p>
              <div className="oav-how-actions">
                <button
                  type="button"
                  className="oav-btn-primary"
                  onClick={() => scrollToSection('oav-contact')}
                >
                  <FiMail size={16} />
                  <span>Contact us</span>
                </button>
                <a href="tel:+919456103445" className="oav-btn-outline">
                  <FiPhone size={16} />
                  <span>Call us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="oav-section oav-provide-section">
        <div className="oav-container">
          <div className="oav-section-header-center oav-animate">
            <h2 className="oav-section-title">What We Provide?</h2>
            <p className="oav-provide-subheading">
              Everything that you're looking for is here!
            </p>
            <div className="oav-divider-line oav-divider-center" />
          </div>

          <div className="oav-provide-intro-box oav-animate">
            <p className="oav-body-text">
              These fully serviced villas/ cottages conceptualized using sustainable architecture overlooking the Himalayan foothill with natural flora and fauna. We have taken utmost care in building it with local expertise and yet tried to keep the architecture contemporary to suit everyone's mood. Laze around on dew-laced grass, watch snow-capped peaks melt your heart. Where clouds enter your home during the day and clear sky with sea of stars awaits every night. The bright and airy living spaces feature large wooden balconies, extra-large glass façade with huge windows to let the warm sun-rays filter in, giving the interiors a bright, airy character. Locally sourced stone and refurbished timber are the main key materials used to create rustic charm.
            </p>
          </div>

          <div className="oav-provide-cards-grid oav-stagger">
            <div className="oav-provide-card">
              <div className="oav-provide-img-wrap">
                <OptimizedImage
                  src={ownvilla2}
                  alt="Fully serviced villas and panoramic Himalayan view"
                  className="oav-provide-card-img"
                  width="400"
                  height="260"
                  loading="lazy"
                  decoding="async"
                  noWrapper={true}
                />
              </div>
              <ul className="oav-provide-card-list">
                <li className="oav-provide-bullet">Fully serviced villas/ cottages</li>
                <li className="oav-provide-bullet">Panoramic Himalayan view</li>
              </ul>
            </div>

            <div className="oav-provide-card">
              <div className="oav-provide-img-wrap">
                <OptimizedImage
                  src={ownvilla1}
                  alt="Bright and airy living spaces and large wooden balconies"
                  className="oav-provide-card-img"
                  width="400"
                  height="260"
                  loading="lazy"
                  decoding="async"
                  noWrapper={true}
                />
              </div>
              <ul className="oav-provide-card-list">
                <li className="oav-provide-bullet">Bright and airy living spaces</li>
                <li className="oav-provide-bullet">Large wooden balconies</li>
              </ul>
            </div>

            <div className="oav-provide-card">
              <div className="oav-provide-img-wrap">
                <OptimizedImage
                  src={ownvilla3}
                  alt="Clear mobile and 5G connectivity, electricity and water connection"
                  className="oav-provide-card-img"
                  width="400"
                  height="260"
                  loading="lazy"
                  decoding="async"
                  noWrapper={true}
                />
              </div>
              <ul className="oav-provide-card-list">
                <li className="oav-provide-bullet">Clear mobile and 5G connectivity</li>
                <li className="oav-provide-bullet">Electricity and water connection</li>
              </ul>
            </div>
          </div>

          <div className="oav-provide-cta-center oav-animate">
            <button
              type="button"
              className="oav-btn-primary"
              onClick={() => scrollToSection('oav-contact')}
            >
              <span>Contact us</span>
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section id="oav-contact" className="oav-section oav-contact-section">
        <div className="oav-container">
          <div className="oav-contact-wrapper oav-animate">
            <div className="oav-contact-two-boxes">
              {/* LEFT BOX: Contact Information & Direct Channels */}
              <div className="oav-contact-left-card">
                <div className="oav-contact-left-top">
                  <span className="oav-contact-brand-tag">Meraki Living</span>
                  <h2 className="oav-contact-main-heading">Contact Us</h2>
                  <div className="oav-contact-purple-divider" />
                  <p className="oav-contact-left-para">
                    For any queries regarding &ldquo;MERAKI LIVING&rdquo;, please feel free to fill in the details below and send the query to us. We will be happy to assist you.
                  </p>
                </div>

                <div className="oav-contact-channels-wrap">
                  <a href="tel:+919456103445" className="oav-contact-channel-row">
                    <div className="oav-channel-icon-box">
                      <FiPhone size={18} />
                    </div>
                    <div className="oav-channel-meta">
                      <span className="oav-channel-type">Call Us Directly</span>
                      <span className="oav-channel-val">+91 94561 03445</span>
                    </div>
                  </a>

                  <a href="mailto:merakiliving@inivesh.com" className="oav-contact-channel-row">
                    <div className="oav-channel-icon-box">
                      <FiMail size={18} />
                    </div>
                    <div className="oav-channel-meta">
                      <span className="oav-channel-type">Official Email</span>
                      <span className="oav-channel-val">merakiliving@inivesh.com</span>
                    </div>
                  </a>

                  <a
                    href="https://maps.app.goo.gl/ynXzPSFcLrAJf3p78"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="oav-contact-channel-row"
                  >
                    <div className="oav-channel-icon-box">
                      <FiMapPin size={18} />
                    </div>
                    <div className="oav-channel-meta">
                      <span className="oav-channel-type">Location</span>
                      <span className="oav-channel-val">Peora, Near Mukteshwar, Uttarakhand — 263138</span>
                    </div>
                  </a>
                </div>

                <div className="oav-contact-left-footer">
                  <span className="oav-left-footer-pill">Dedicated Advisory</span>
                  <p className="oav-left-footer-sub">
                    Personalized guidance for luxury holiday homes, site tours &amp; investments.
                  </p>
                </div>
              </div>

              {/* RIGHT BOX: Contact Enquiry Form */}
              <div className="oav-contact-right-card">
                <div className="oav-contact-right-top">
                  <h3 className="oav-form-box-title">Send an Enquiry</h3>
                  <p className="oav-form-box-subtitle">
                    Fill in your details below and our team will get in touch promptly.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="oav-form-success-box" role="alert">
                    <div className="oav-success-circle">
                      <FiCheckCircle size={36} />
                    </div>
                    <h4 className="oav-success-box-title">Message Sent Successfully!</h4>
                    <p className="oav-success-box-text">
                      Thank you for reaching out to Meraki Living. Our advisory team will connect with you shortly.
                    </p>
                    <button
                      type="button"
                      className="oav-btn-outline"
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({
                          fullName: '',
                          phone: '',
                          email: '',
                          enquiryTopic: 'Custom Luxury Villa Purchase',
                          message: ''
                        });
                        setFormErrors({});
                        setSubmitError(null);
                      }}
                    >
                      <span>Send Another Message</span>
                    </button>
                  </div>
                ) : (
                  <form className="oav-duo-form" onSubmit={handleFormSubmit} noValidate>
                    <div className="oav-duo-group">
                      <input
                        id="oav-fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your Name *"
                        disabled={isSubmitting}
                        className={`oav-duo-input ${formErrors.fullName ? 'oav-input-error' : ''}`}
                        aria-label="Your Name"
                      />
                      {formErrors.fullName && (
                        <span className="oav-duo-error">{formErrors.fullName}</span>
                      )}
                    </div>

                    <div className="oav-duo-group">
                      <input
                        id="oav-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your Mobile number *"
                        disabled={isSubmitting}
                        className={`oav-duo-input ${formErrors.phone ? 'oav-input-error' : ''}`}
                        aria-label="Your Mobile number"
                      />
                      {formErrors.phone && (
                        <span className="oav-duo-error">{formErrors.phone}</span>
                      )}
                    </div>

                    <div className="oav-duo-group">
                      <input
                        id="oav-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your Email address"
                        disabled={isSubmitting}
                        className={`oav-duo-input ${formErrors.email ? 'oav-input-error' : ''}`}
                        aria-label="Your Email address"
                      />
                      {formErrors.email && (
                        <span className="oav-duo-error">{formErrors.email}</span>
                      )}
                    </div>

                    <div className="oav-duo-group">
                      <select
                        id="oav-enquiryTopic"
                        name="enquiryTopic"
                        value={formData.enquiryTopic}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="oav-duo-select"
                        aria-label="What are you contacting us about?"
                      >
                        <option value="Custom Luxury Villa Purchase">Custom Luxury Villa Purchase</option>
                        <option value="Cottage with Farm Land / Plot">Cottage with Farm Land / Plot</option>
                        <option value="Managed Villa with Committed Rental Income">Managed Villa with Committed Rental Income</option>
                        <option value="Schedule a Site Visit in Uttarakhand">Schedule a Site Visit in Uttarakhand</option>
                        <option value="General Villa & Pricing Enquiry">General Villa &amp; Pricing Enquiry</option>
                      </select>
                    </div>

                    <div className="oav-duo-group">
                      <textarea
                        id="oav-message"
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="Your Message..."
                        className="oav-duo-textarea"
                        aria-label="Your Message"
                      />
                    </div>

                    {submitError && (
                      <div className="oav-submit-error-banner" role="alert">
                        {submitError}
                      </div>
                    )}

                    <div className="oav-duo-btn-row">
                      <button
                        type="submit"
                        className="oav-duo-submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="oav-submit-spinner-icon" aria-hidden="true">
                              <FiLoader size={15} />
                            </span>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <FiSend size={15} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="oav-offices" className="oav-section oav-dark-section oav-dark-offices-section">
        <div className="oav-container">
          <div className="oav-dark-header oav-animate">
            <span className="oav-dark-badge">Our Presence</span>
            <h2 className="oav-dark-title">Our Offices</h2>
            <div className="oav-divider-line oav-divider-center" />
          </div>

          <div className="oav-offices-grid oav-stagger">
            {OFFICE_LOCATIONS.map((office, idx) => (
              <div className="oav-office-card" key={idx}>
                <div className="oav-office-icon-wrap">
                  <FiMapPin size={22} />
                </div>
                <h3 className="oav-office-city">{office.city}</h3>
                <p className="oav-office-address">{office.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div
          className="oav-modal-backdrop"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image Preview"
        >
          <div className="oav-modal-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="oav-modal-close-btn"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image preview"
            >
              <FiX size={20} />
            </button>
            <div className="oav-modal-img-box">
              <OptimizedImage
                src={selectedImage.src}
                alt={selectedImage.title || 'Meraki Living Villa'}
                className="oav-modal-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnAVilla;
