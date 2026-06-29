// src/components/Experience/Experience.js
import React from 'react';
import './Experience.css';

// Importing image assets for the icons
import iconHimalayas from '../../assets/images/image (1).png';
import iconForest from '../../assets/images/image (2).png';
import iconBonfire from '../../assets/images/image (3).png';
import iconCafe from '../../assets/images/image (4).png';
import iconSunrise from '../../assets/images/image (5).png';
import iconFood from '../../assets/images/image (6).png';

const features = [
  {
    title: "Himalayan Views",
    image: iconHimalayas
  },
  {
    title: "Pine Forest Walks",
    image: iconForest
  },
  {
    title: "Evening Bonfire",
    image: iconBonfire
  },
  {
    title: "Mountain Café",
    image: iconCafe
  },
  {
    title: "Sunrise & Sunset",
    image: iconSunrise
  },
  {
    title: "Authentic Kumaoni Food",
    image: iconFood
  }
];

const Experience = () => {
  return (
    <section className="experience-section">
      <div className="experience-header">
        <h2 className="experience-title">The Meraki Living Experience</h2>
        <p className="experience-subtitle">
          Experience peaceful mountain mornings, breathtaking Himalayan views, cozy café moments, authentic Kumaoni hospitality, and unforgettable memories only at Meraki Living
        </p>
      </div>

      <div className="experience-row">
        {features.map((feature, index) => (
          <div className="experience-card" key={index}>
            <div className="experience-icon-wrapper">
              <img src={feature.image} alt={feature.title} className="experience-icon" />
            </div>
            <h3 className="experience-card-title">{feature.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;