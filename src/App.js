import React, { useState, useCallback, useEffect } from 'react';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Experience from './components/Experience/Experience';
import Viewpoints from './components/Viewpoints/Viewpoints';
import Rooms from './components/Rooms/Rooms';
import Explore from './components/Explore/Explore';
import Cafe from './components/Cafe/Cafe';
import Review from './components/Review/Review';
import FAQ from './components/FAQ/FAQ';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';

import Booking from './Pages/Booking/Booking';
import GuestDetails from './Pages/GuestDetails/GuestDetails';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy';
import TermsConditions from './Pages/TermsConditions/TermsConditions';
import CancellationPolicy from './Pages/CancellationPolicy/CancellationPolicy';

import './App.css';

const HOME_PAGES = ['home', 'rooms', 'explore', 'cafe', 'faq'];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoomId, setSelectedRoomId] = useState(1);

  const handleNavigate = useCallback((page, roomId = null) => {
    setCurrentPage(page);
    if (roomId) setSelectedRoomId(roomId);

    const history = JSON.parse(sessionStorage.getItem('meraki_navHistory') || '[]');
    history.push(page);
    if (history.length > 10) history.shift();
    sessionStorage.setItem('meraki_navHistory', JSON.stringify(history));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = useCallback(() => {
    if (HOME_PAGES.includes(currentPage)) {
      return (
        <>
          <Hero setCurrentPage={handleNavigate} />
          <Experience />
          <Viewpoints />
          <Rooms setCurrentPage={handleNavigate} />
          <Explore />
          <Cafe />
          <Review />
          <FAQ />
          <CTA setCurrentPage={handleNavigate} />
        </>
      );
    }

    switch (currentPage) {
      case 'booking':
        return <Booking setCurrentPage={handleNavigate} />;
      case 'guest-details':
        return <GuestDetails setCurrentPage={handleNavigate} selectedRoomId={selectedRoomId} />;
      case 'privacy-policy':
        return <PrivacyPolicy setCurrentPage={handleNavigate} />;
      case 'terms-conditions':
        return <TermsConditions setCurrentPage={handleNavigate} />;
      case 'cancellation-policy':
        return <CancellationPolicy setCurrentPage={handleNavigate} />;
      default:
        return (
          <>
            <Hero setCurrentPage={handleNavigate} />
            <Experience />
            <Viewpoints />
            <Rooms setCurrentPage={handleNavigate} />
            <Explore />
            <Cafe />
            <Review />
            <FAQ />
            <CTA setCurrentPage={handleNavigate} />
          </>
        );
    }
  }, [currentPage, selectedRoomId, handleNavigate]);

  useEffect(() => {
    const history = JSON.parse(sessionStorage.getItem('meraki_navHistory') || '[]');
    if (history.length === 0) {
      history.push('home');
      sessionStorage.setItem('meraki_navHistory', JSON.stringify(history));
    }
  }, []);

  return (
    <div className="app-container">
      <Navbar setCurrentPage={handleNavigate} currentPage={currentPage} />
      {renderPage()}
      <Footer setCurrentPage={handleNavigate} />
    </div>
  );
}

export default App;