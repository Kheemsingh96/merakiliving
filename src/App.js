import React, { useState, useCallback, useEffect } from 'react';

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

import './App.css';

const AboutUs = React.lazy(() => import('./components/AboutUs/AboutUs'));
const Booking = React.lazy(() => import('./Pages/Booking/Booking'));
const RoomDetails = React.lazy(() => import('./Pages/RoomDetails/RoomDetails'));
const GuestDetails = React.lazy(() => import('./Pages/GuestDetails/GuestDetails'));
const PrivacyPolicy = React.lazy(() => import('./Pages/PrivacyPolicy/PrivacyPolicy'));
const TermsConditions = React.lazy(() => import('./Pages/TermsConditions/TermsConditions'));
const CancellationPolicy = React.lazy(() => import('./Pages/CancellationPolicy/CancellationPolicy'));
const CafePage = React.lazy(() => import('./Pages/CafePage/CafePage'));
const NotFound = React.lazy(() => import('./Pages/NotFound/NotFound'));

// Admin Pages
const ManageBooking = React.lazy(() => import('./Pages/ManageBooking/ManageBooking'));
const AdminLogin = React.lazy(() => import('./Pages/Admin/AdminLogin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./Pages/Admin/AdminDashboard/AdminDashboard'));

const HOME_PAGES = ['home', 'rooms', 'explore', 'faq'];
const LEGAL_PAGES = ['privacy-policy', 'terms-conditions', 'cancellation-policy'];

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/Pranay-admin') {
      return sessionStorage.getItem('meraki_admin_auth') === 'true' ? 'admin-dashboard' : 'admin-login';
    }
    
    return sessionStorage.getItem('meraki_currentPage') || 'home';
  });
  const [selectedRoomId, setSelectedRoomId] = useState(() => {
    const stored = sessionStorage.getItem('meraki_selectedRoomId');
    return stored ? parseInt(stored, 10) : 1;
  });

  const handleNavigate = useCallback((page, roomId = null, scrollToId = null) => {
    setCurrentPage(page);
    sessionStorage.setItem('meraki_currentPage', page);
    if (roomId) {
      setSelectedRoomId(roomId);
      sessionStorage.setItem('meraki_selectedRoomId', roomId);
    }

    const history = JSON.parse(sessionStorage.getItem('meraki_navHistory') || '[]');
    history.push(page);
    if (history.length > 10) history.shift();
    sessionStorage.setItem('meraki_navHistory', JSON.stringify(history));

    // Handle updating URL for admin routes so they match the requirements (/Pranay-admin)
    let url = window.location.href;
    if (page === 'admin-login' || page === 'admin-dashboard') url = '/Pranay-admin';
    else if (window.location.pathname.startsWith('/Pranay-admin')) url = '/';

    window.history.pushState({ page }, '', url);
    
    if (scrollToId) {
      setTimeout(() => {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/Pranay-admin') {
        setCurrentPage(sessionStorage.getItem('meraki_admin_auth') === 'true' ? 'admin-dashboard' : 'admin-login');
        return;
      }

      const history = JSON.parse(sessionStorage.getItem('meraki_navHistory') || '[]');
      if (history.length > 1) {
        history.pop();
        const previousPage = history[history.length - 1];
        sessionStorage.setItem('meraki_navHistory', JSON.stringify(history));
        sessionStorage.setItem('meraki_currentPage', previousPage);
        setCurrentPage(previousPage);
      } else {
        setCurrentPage('home');
        sessionStorage.setItem('meraki_currentPage', 'home');
        sessionStorage.setItem('meraki_navHistory', JSON.stringify(['home']));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (LEGAL_PAGES.includes(currentPage)) {
      window.history.pushState({ page: currentPage }, '', window.location.href);
    }
  }, [currentPage]);

  useEffect(() => {
    const history = JSON.parse(sessionStorage.getItem('meraki_navHistory') || '[]');
    if (history.length === 0) {
      history.push('home');
      sessionStorage.setItem('meraki_navHistory', JSON.stringify(history));
    }
  }, []);

  const renderPage = () => {
    if (HOME_PAGES.includes(currentPage)) {
      return (
        <>
          <div id="home"><Hero setCurrentPage={handleNavigate} /></div>
          <div id="experiences"><Experience /></div>
          <Viewpoints />
          <div id="stay"><Rooms setCurrentPage={handleNavigate} /></div>
          
          {/* Gallery Navbar link par click hone par is section par scroll hoga */}
          <div id="gallery">
            <Explore />
          </div>
          
          <CafeSection setCurrentPage={handleNavigate} />
          <Review />
          <FAQ />
          <CTA setCurrentPage={handleNavigate} />
        </>
      );
    }

    switch (currentPage) {
      case 'about-us':
        return <AboutUs setCurrentPage={handleNavigate} />;
      case 'cafe':
        return <CafePage setCurrentPage={handleNavigate} />;
      case 'room-details':
        return <RoomDetails setCurrentPage={handleNavigate} selectedRoomId={selectedRoomId} />;
      case 'booking':
        return <Booking setCurrentPage={handleNavigate} />;
      case 'guest-details':
        return <GuestDetails setCurrentPage={handleNavigate} selectedRoomId={selectedRoomId} />;
      case 'privacy-policy':
        return <PrivacyPolicy />;
      case 'terms-conditions':
        return <TermsConditions />;
      case 'manage-booking':
        return <ManageBooking setCurrentPage={handleNavigate} />;
      case 'cancellation-policy':
        return <CancellationPolicy />;
      case '404':
      default:
        return <NotFound setCurrentPage={handleNavigate} />;
    }
  };

  const renderLayout = () => {
    if (currentPage === 'admin-login') {
      return (
        <React.Suspense fallback={<div className="suspense-loader"><div className="suspense-spinner"></div></div>}>
          <AdminLogin setCurrentPage={handleNavigate} />
        </React.Suspense>
      );
    }
    
    if (currentPage === 'admin-dashboard') {
      return (
        <React.Suspense fallback={<div className="suspense-loader"><div className="suspense-spinner"></div></div>}>
          <AdminDashboard setCurrentPage={handleNavigate} />
        </React.Suspense>
      );
    }

    return (
      <>
        <Navbar setCurrentPage={handleNavigate} currentPage={currentPage} />
        <React.Suspense fallback={<div className="suspense-loader"><div className="suspense-spinner"></div></div>}>
          {renderPage()}
        </React.Suspense>
        <div id="contact"><Footer setCurrentPage={handleNavigate} /></div>
        <CookieConsent setCurrentPage={handleNavigate} />
      </>
    );
  };

  return (
    <div className="app-container">
      {renderLayout()}
    </div>
  );
}

export default App;