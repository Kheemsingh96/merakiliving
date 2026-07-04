import React, { useState } from 'react';
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
import Booking from './Pages/Booking/Booking';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="app-container">
      <Navbar />
      {currentPage === 'home' ? (
        <>
          <Hero setCurrentPage={setCurrentPage} />
          <Experience />
          <Viewpoints />
          <Rooms />
          <Explore />
          <Cafe />
          <Review />
          <FAQ />
          <CTA />
        </>
      ) : (
        <Booking setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}

export default App;