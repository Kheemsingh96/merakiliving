import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Experience from './components/Experience/Experience';
import Viewpoints from './components/Viewpoints/Viewpoints';
import Explore from './components/Explore/Explore';
import Cafe from './components/Cafe/Cafe';
import Review from './components/Review/Review';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Experience />
      <Viewpoints />
      <Explore />
      <Cafe />
      <Review />
    </div>
  );
}

export default App;