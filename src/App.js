import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import linkPreviewImg from './assets/images/meraki_living_link_preview.avif';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Experience from './components/Experience/Experience';
import Viewpoints from './components/Viewpoints/Viewpoints';
import Rooms from './components/Rooms/Rooms';
import Explore from './components/Explore/Explore';
import CafeSection from './components/Cafe/Cafe';
import Review from './components/Review/Review';
import FAQ from './components/FAQ/FAQ';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import CookieConsent from './components/CookieConsent/CookieConsent';
import Chatbot from './components/Chatbot/Chatbot';
import FloatingBookingDetails from './components/FloatingBookingDetails/FloatingBookingDetails';
import StickyFooter from './components/StickyFooter/StickyFooter';
import Preloader from './components/Preloader/Preloader';
import useScrollAnimation from './hooks/useScrollAnimation';

import './App.css';

const AboutUs = React.lazy(() => import('./components/AboutUs/AboutUs'));
const Booking = React.lazy(() => import('./Pages/Booking/Booking'));
const RoomDetails = React.lazy(() => import('./Pages/RoomDetails/RoomDetails'));
const GuestDetails = React.lazy(() => import('./Pages/GuestDetails/GuestDetails'));
const PrivacyPolicy = React.lazy(() => import('./Pages/PrivacyPolicy/PrivacyPolicy'));
const TermsConditions = React.lazy(() => import('./Pages/TermsConditions/TermsConditions'));
const CancellationPolicy = React.lazy(() => import('./Pages/CancellationPolicy/CancellationPolicy'));
const CafePage = React.lazy(() => import('./Pages/CafePage/CafePage'));
const SrotPage = React.lazy(() => import('./Pages/SrotPage/SrotPage'));
const OwnAVilla = React.lazy(() => import('./Pages/OwnAVilla/OwnAVilla'));
const ContactUs = React.lazy(() => import('./Pages/ContactUs/ContactUs'));
const NotFound = React.lazy(() => import('./Pages/NotFound/NotFound'));

const ManageBooking = React.lazy(() => import('./Pages/ManageBooking/ManageBooking'));
const AdminLogin = React.lazy(() => import('./Pages/Admin/AdminLogin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./Pages/Admin/AdminDashboard/AdminDashboard'));


const HOME_WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Meraki Living',
  'url': 'https://www.merakiliving.in'
};

const HOME_ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Meraki Living',
  'url': 'https://www.merakiliving.in',
  'logo': 'https://www.merakiliving.in/static/media/logo.avif',
  'contactPoint': {
    '@type': 'ContactPoint',
    'telephone': '+91-94561-03445',
    'contactType': 'reservations',
    'availableLanguage': ['English', 'Hindi']
  },
  'sameAs': [
    'https://www.instagram.com/merakiliving.in/',
    'https://www.facebook.com/Meraki-Living-2270192013252603'
  ]
};

const HOME_LODGING_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BedAndBreakfast',
  'name': 'Meraki Living',
  'description': 'Nestled in the serene Himalayan village of Peora, surrounded by lush forests, fruit orchards, and a perennial mountain stream, SROT offers thoughtfully designed cottages, farm-fresh cuisine, and unforgettable Himalayan experiences.',
  'url': 'https://www.merakiliving.in',
  'telephone': '+91-94561-03445',
  'priceRange': '₹₹₹',
  'checkinTime': '12:00',
  'checkoutTime': '11:00',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Village Peora, Near Mukteshwar',
    'addressLocality': 'Peora, Mukteshwar',
    'addressRegion': 'Uttarakhand',
    'postalCode': '263138',
    'addressCountry': 'IN'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 29.475,
    'longitude': 79.625
  }
};

const HOME_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'What makes our homestay the perfect place for a relaxing stay?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Our homestay offers a peaceful and comfortable environment where you can unwind, enjoy a welcoming atmosphere, and make the most of your time away from home. With thoughtfully designed rooms, convenient amenities, and an on-site café, we aim to make every stay relaxing, comfortable, and memorable.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What types of rooms are available at our homestay?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'We offer a selection of comfortable rooms designed to suit different guest preferences and travel needs. You can explore our available room options, view their features, check occupancy details, and choose the room that best fits your stay.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What amenities and facilities can guests enjoy during their stay?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Our homestay provides a range of amenities designed to make your stay convenient and comfortable. The facilities available may vary by room, so we recommend checking the individual room details to learn more about the amenities included with your booking.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Does our homestay have an on-site café?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, our homestay features an on-site café where guests can take a break, enjoy a refreshing beverage, and spend quality time in a welcoming setting. It is a convenient place to relax and enjoy a pleasant café experience during your stay.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What food and beverages are available at the café?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Our café offers a variety of delicious options, including authentic Kumaoni cuisine and other delightful food and beverages. From traditional local flavors to refreshing drinks and more, there is something for everyone to enjoy. Explore our Café page to discover the complete menu and learn more about the food and beverages we offer.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Can guests enjoy a meal or coffee at the café without staying overnight?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Absolutely! You can visit our café and enjoy delicious food, refreshing beverages, and a relaxing atmosphere without booking a room at our homestay. Our café welcomes guests who simply want to enjoy a delightful dining experience.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How can I check room availability and pricing for my preferred dates?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Simply select your preferred check-in and check-out dates, enter the number of guests, and search for available rooms. You can then compare the available options and view their current pricing before choosing the room that suits your requirements.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What is the process for booking a room at our homestay?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Booking your stay is simple. Choose your preferred room, select your travel dates, provide the required guest information, and review your reservation details. Once you complete the booking process, you can access your reservation information and prepare for your stay.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Is our homestay suitable for couples, families, and solo travelers?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Our homestay welcomes guests with different travel preferences and needs. Whether you are planning a peaceful getaway for two, a family trip, or a solo escape, you can explore our room options and select an accommodation that matches your group size and requirements.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What should I know before planning my stay at the homestay?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Before booking, we recommend reviewing the room amenities, occupancy details, pricing, check-in and check-out information, and applicable booking policies. You can also explore our café and other available facilities to plan a comfortable and enjoyable stay.'
      }
    }
  ]
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedRoomId, setSelectedRoomId] = useState(() => {
    const stored = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('meraki_selectedRoomId') : null;
    return stored ? parseInt(stored, 10) : 1;
  });

  const [adminAuth, setAdminAuth] = useState(() => {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem('meraki_admin_auth') === 'true';
  });

  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof navigator !== 'undefined' && /ReactSnap/i.test(navigator.userAgent)) return false;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.startsWith('/Pranay-admin')) return false;
    return true;
  });

  const getCurrentPage = useCallback((pathname) => {
    const clean = (pathname || '').replace(/\/+$/, '') || '/';
    if (clean === '/') return 'home';
    if (clean === '/about-us' || clean === '/about') return 'about-us';
    if (clean === '/cafe') return 'cafe';
    if (clean === '/srot') return 'srot';
    if (clean === '/own-a-villa') return 'own-a-villa';
    if (clean === '/contact-us' || clean === '/contact') return 'contact-us';
    if (clean === '/privacy-policy') return 'privacy-policy';
    if (clean === '/terms-conditions') return 'terms-conditions';
    if (clean === '/cancellation-policy') return 'cancellation-policy';
    if (clean === '/booking') return 'booking';
    if (clean === '/room-details') return 'room-details';
    if (clean === '/guest-details') return 'guest-details';
    if (clean === '/manage-booking') return 'manage-booking';
    if (clean === '/Pranay-admin') {
      return adminAuth ? 'admin-dashboard' : 'admin-login';
    }
    return '404';
  }, [adminAuth]);

  const currentPage = getCurrentPage(location.pathname);

  useScrollAnimation([location.pathname]);

  const handleNavigate = useCallback((page, roomId = null, scrollToId = null, hashOverride = null) => {
    if (roomId) {
      setSelectedRoomId(roomId);
      sessionStorage.setItem('meraki_selectedRoomId', String(roomId));
    }

    if (page === 'admin-dashboard') {
      setAdminAuth(true);
      navigate('/Pranay-admin');
      return;
    }
    if (page === 'admin-login') {
      setAdminAuth(false);
      navigate('/Pranay-admin');
      return;
    }

    const ROUTE_MAP = {
      'home': '/',
      'own-a-villa': '/own-a-villa',
      'cafe': '/cafe',
      'srot': '/srot',
      'about-us': '/about-us',
      'about': '/about-us',
      'contact-us': '/contact-us',
      'contact': '/contact-us',
      'manage-booking': '/manage-booking',
      'booking': '/booking',
      'guest-details': '/guest-details',
      'room-details': '/room-details',
      'privacy-policy': '/privacy-policy',
      'terms-conditions': '/terms-conditions',
      'cancellation-policy': '/cancellation-policy'
    };

    let targetPath = ROUTE_MAP[page] || '/';
    let targetHash = hashOverride || (scrollToId ? `#${scrollToId}` : '');

    if (page === 'rooms') {
      targetPath = '/';
      targetHash = '#stay';
    } else if (page === 'explore') {
      targetPath = '/';
      targetHash = '#gallery';
    } else if (page === 'faq') {
      targetPath = '/';
      targetHash = '#faq';
    }

    if (location.pathname === targetPath && targetHash) {
      const elId = targetHash.replace('#', '');
      const el = document.getElementById(elId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(targetPath + targetHash);
    }
  }, [location.pathname, navigate]);

  // Handle legacy hash redirects (e.g. #cafe -> /cafe)
  useEffect(() => {
    const rawHash = (window.location.hash || '').toLowerCase();
    const HASH_REDIRECTS = {
      '#cafe': '/cafe',
      '#about': '/about-us',
      '#about-us': '/about-us',
      '#srot': '/srot',
      '#own-a-villa': '/own-a-villa',
      '#contact': '/contact-us',
      '#contact-us': '/contact-us',
      '#manage-booking': '/manage-booking',
      '#booking': '/booking',
      '#guest-details': '/guest-details',
      '#room-details': '/room-details',
      '#privacy-policy': '/privacy-policy',
      '#terms-conditions': '/terms-conditions',
      '#cancellation-policy': '/cancellation-policy',
      '#home': '/'
    };

    if (HASH_REDIRECTS[rawHash]) {
      navigate(HASH_REDIRECTS[rawHash], { replace: true });
    }
  }, [navigate]);

  // Handle anchor scrolling and top scroll restoration
  useEffect(() => {
    const rawHash = (window.location.hash || '').toLowerCase();
    const targetId = rawHash.replace('#', '');
    if (targetId && document.getElementById(targetId)) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (!rawHash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  const isAdminPath = location.pathname.startsWith('/Pranay-admin');

  if (isAdminPath) {
    return (
      <div className="app-container">
        <React.Suspense fallback={<div className="suspense-loader"><div className="suspense-spinner"></div></div>}>
          <Helmet>
            <title>{adminAuth ? 'Admin Dashboard | Meraki Living' : 'Admin Login | Meraki Living'}</title>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          {adminAuth ? (
            <AdminDashboard setCurrentPage={handleNavigate} />
          ) : (
            <AdminLogin setCurrentPage={handleNavigate} />
          )}
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="app-container">
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      <Navbar setCurrentPage={handleNavigate} currentPage={currentPage} />
      <React.Suspense fallback={<div className="suspense-loader"><div className="suspense-spinner"></div></div>}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Helmet>
                  <title>Meraki Living SROT Peora Mukteshwar</title>
                  <meta name="description" content="Nestled in the serene Himalayan village of Peora, surrounded by lush forests, fruit orchards, and a perennial mountain stream, SROT offers thoughtfully designed cottages, farm-fresh cuisine, and unforgettable Himalayan experiences." />
                  <link rel="canonical" href="https://www.merakiliving.in/" />
                  <meta name="robots" content="index, follow" />
                  <meta property="og:site_name" content="Meraki Living" />
                  <meta property="og:title" content="Meraki Living SROT Peora Mukteshwar" />
                  <meta property="og:description" content="Nestled in the serene Himalayan village of Peora, surrounded by lush forests, fruit orchards, and a perennial mountain stream, SROT offers thoughtfully designed cottages, farm-fresh cuisine, and unforgettable Himalayan experiences." />
                  <meta property="og:type" content="website" />
                  <meta property="og:url" content="https://www.merakiliving.in/" />
                  <meta property="og:image" content={linkPreviewImg} />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:title" content="Meraki Living SROT Peora Mukteshwar" />
                  <meta name="twitter:description" content="Nestled in the serene Himalayan village of Peora, surrounded by lush forests, fruit orchards, and a perennial mountain stream, SROT offers thoughtfully designed cottages, farm-fresh cuisine, and unforgettable Himalayan experiences." />
                  <meta name="twitter:image" content={linkPreviewImg} />
                  <script type="application/ld+json">{JSON.stringify(HOME_WEBSITE_SCHEMA)}</script>
                  <script type="application/ld+json">{JSON.stringify(HOME_ORGANIZATION_SCHEMA)}</script>
                  <script type="application/ld+json">{JSON.stringify(HOME_LODGING_SCHEMA)}</script>
                  <script type="application/ld+json">{JSON.stringify(HOME_FAQ_SCHEMA)}</script>
                </Helmet>
                <div id="home"><Hero setCurrentPage={handleNavigate} /></div>
                <div id="experiences"><Experience /></div>
                <Viewpoints />
                <div id="stay"><Rooms setCurrentPage={handleNavigate} /></div>
                <div id="gallery"><Explore /></div>
                <CafeSection setCurrentPage={handleNavigate} />
                <Review />
                <FAQ />
                <CTA setCurrentPage={handleNavigate} />
              </>
            }
          />
          <Route path="/about-us" element={<AboutUs setCurrentPage={handleNavigate} />} />
          <Route path="/about" element={<Navigate to="/about-us" replace />} />
          <Route path="/cafe" element={<CafePage setCurrentPage={handleNavigate} />} />
          <Route path="/srot" element={<SrotPage setCurrentPage={handleNavigate} />} />
          <Route path="/own-a-villa" element={<OwnAVilla setCurrentPage={handleNavigate} />} />
          <Route path="/contact-us" element={<ContactUs setCurrentPage={handleNavigate} />} />
          <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route
            path="/booking"
            element={
              <>
                <Helmet>
                  <title>Book a Stay | Meraki Living</title>
                  <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <Booking setCurrentPage={handleNavigate} />
              </>
            }
          />
          <Route
            path="/room-details"
            element={
              <>
                <Helmet>
                  <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <RoomDetails setCurrentPage={handleNavigate} selectedRoomId={selectedRoomId} />
              </>
            }
          />
          <Route
            path="/guest-details"
            element={
              <>
                <Helmet>
                  <title>Guest Details | Meraki Living</title>
                  <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <GuestDetails setCurrentPage={handleNavigate} selectedRoomId={selectedRoomId} />
              </>
            }
          />
          <Route
            path="/manage-booking"
            element={
              <>
                <Helmet>
                  <title>Manage Booking | Meraki Living</title>
                  <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <ManageBooking setCurrentPage={handleNavigate} />
              </>
            }
          />
          <Route
            path="/404"
            element={
              <>
                <Helmet>
                  <title>404 - Page Not Found | Meraki Living</title>
                  <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <NotFound setCurrentPage={handleNavigate} />
              </>
            }
          />
          <Route
            path="*"
            element={
              <>
                <Helmet>
                  <title>404 - Page Not Found | Meraki Living</title>
                  <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <NotFound setCurrentPage={handleNavigate} />
              </>
            }
          />
        </Routes>
      </React.Suspense>
      <div id="contact"><Footer setCurrentPage={handleNavigate} /></div>
      <CookieConsent setCurrentPage={handleNavigate} preloaderActive={showPreloader} />
      <Chatbot setCurrentPage={handleNavigate} />
      <FloatingBookingDetails setCurrentPage={handleNavigate} />
      <StickyFooter setCurrentPage={handleNavigate} currentPage={currentPage} />
    </div>
  );
}

export default App;