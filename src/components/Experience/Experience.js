import React from 'react';
import './Experience.css';

import iconHimalayas from '../../assets/images/image (1).webp';
import iconForest from '../../assets/images/image (2).webp';
import iconBonfire from '../../assets/images/image (3).webp';
import iconCafe from '../../assets/images/image (4).webp';
import iconSunrise from '../../assets/images/image (5).webp';
import iconFood from '../../assets/images/image (6).webp';

const FEATURES = [
  { title: 'Himalayan Views', image: iconHimalayas },
  { title: 'Pine Forest Walks', image: iconForest },
  { title: 'Evening Bonfire', image: iconBonfire },
  { title: 'Mountain Cafe', image: iconCafe },
  { title: 'Sunrise & Sunset', image: iconSunrise },
  { title: 'Authentic Kumaoni Food', image: iconFood },
];

function Experience() {
  return (
    <section className="experience-section" aria-label="The Meraki Living Experience">
      <div className="experience-header">
        <h2 className="experience-title">The Meraki Living Experience</h2>
        <p className="experience-subtitle">
          Experience peaceful mountain mornings, breathtaking Himalayan views, cozy cafe moments, authentic Kumaoni hospitality, and unforgettable memories only at Meraki Living.
        </p>
      </div>

      <div className="experience-row">
        {FEATURES.map((feature) => (
          <div className="experience-card" key={feature.title}>
            <div className="experience-icon-wrapper">
              <img
                src={feature.image}
                alt={feature.title}
                className="experience-icon"
                width="110"
                height="100"
                loading="lazy"
              />
            </div>
            <h3 className="experience-card-title">{feature.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experience;