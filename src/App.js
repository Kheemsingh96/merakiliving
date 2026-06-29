import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Experience from './components/Experience/Experience';
import Viewpoints from './components/Viewpoints/Viewpoints';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Experience />
      <Viewpoints />
    </div>
  );
}

export default App;