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

import './App.css';

const AboutUs = React.lazy(() => import('./components/AboutUs/AboutUs'));
const Booking = React.lazy(() => import('./Pages/Booking/Booking'));
const RoomDetails = React.lazy(() => import('./Pages/RoomDetails/RoomDetails'));
const GuestDetails = React.lazy(() => import('./Pages/GuestDetails/GuestDetails'));
const Payment = React.lazy(() => import('./Pages/Payment/Payment'));
const Confirmation = React.lazy(() => import('./Pages/Confirmation/Confirmation'));
const PrivacyPolicy = React.lazy(() => import('./Pages/PrivacyPolicy/PrivacyPolicy'));
const TermsConditions = React.lazy(() => import('./Pages/TermsConditions/TermsConditions'));
const CancellationPolicy = React.lazy(() => import('./Pages/CancellationPolicy/CancellationPolicy'));
const CafePage = React.lazy(() => import('./Pages/CafePage/CafePage'));

const HOME_PAGES = ['home', 'rooms', 'explore', 'faq'];
const LEGAL_PAGES = ['privacy-policy', 'terms-conditions', 'cancellation-policy'];

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
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

    window.history.pushState({ page }, '', window.location.href);
    
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
      // Gallery ka case yahan se hata diya gaya hai, taaki wo separate page ki tarah nahi, 
      // balki home page ke section ki tarah render ho.
      case 'cafe':
        return <CafePage setCurrentPage={handleNavigate} />;
      case 'room-details':
        return <RoomDetails setCurrentPage={handleNavigate} selectedRoomId={selectedRoomId} />;
      case 'booking':
        return <Booking setCurrentPage={handleNavigate} />;
      case 'guest-details':
        return <GuestDetails setCurrentPage={handleNavigate} selectedRoomId={selectedRoomId} />;
      case 'payment':
        return <Payment setCurrentPage={handleNavigate} selectedRoomId={selectedRoomId} />;
      case 'confirmation':
        return <Confirmation setCurrentPage={handleNavigate} />;
      case 'privacy-policy':
        return <PrivacyPolicy />;
      case 'terms-conditions':
        return <TermsConditions />;
      case 'cancellation-policy':
        return <CancellationPolicy />;
      default:
        return (
          <>
            <div id="home"><Hero setCurrentPage={handleNavigate} /></div>
            <div id="experiences"><Experience /></div>
            <Viewpoints />
            <div id="stay"><Rooms setCurrentPage={handleNavigate} /></div>
            
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
  };

  return (
    <div className="app-container">
      <Navbar setCurrentPage={handleNavigate} currentPage={currentPage} />
      <React.Suspense fallback={<div className="suspense-loader"><div className="suspense-spinner"></div></div>}>
        {renderPage()}
      </React.Suspense>
      <div id="contact"><Footer setCurrentPage={handleNavigate} /></div>
    </div>
  );
}

export default App;