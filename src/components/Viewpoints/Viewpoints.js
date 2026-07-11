import React from 'react';
import './Viewpoints.css';

import imgKainchiDham from '../../assets/images/kainchidham.png';
import imgMukteshwar from '../../assets/images/mukteshwar.png';
import imgKapileshwar from '../../assets/images/kapileshwar.png';
import imgKasarDevi from '../../assets/images/kasardevi.png';
import imgKausani from '../../assets/images/kausani.png';
import imgDolAshram from '../../assets/images/dolashram.png';
import imgNainital from '../../assets/images/nainital.png';

const VIEWPOINTS_DATA = [
  {
    id: 1,
    title: 'Kainchi Dham',
    distance: '20 km - 30 min drive',
    description: "Blessings of Neem Karoli Baba. Experience peaceful prayers, riverside serenity, and the divine presence of Neem Karoli Baba's sacred ashram.",
    image: imgKainchiDham,
  },
  {
    id: 2,
    title: 'Mukteshwar',
    distance: '9 km - 20 min drive',
    description: 'Where Mountains Meet Serenity. Witness majestic Himalayan peaks, ancient Shiva temple, peaceful forests, and unforgettable sunrise and sunset views.',
    image: imgMukteshwar,
  },
  {
    id: 3,
    title: 'Kapileshwar Mahadev',
    distance: '13 km - 20 min drive',
    description: 'Sacred Cave of Lord Shiva. Visit the ancient cave temple dedicated to Lord Shiva, surrounded by peaceful hills and natural beauty.',
    image: imgKapileshwar,
  },
  {
    id: 4,
    title: 'Kasar Devi',
    distance: '22 km - 30 min drive',
    description: 'A Timeless Spiritual Escape. Meditate amidst tranquil Himalayan landscapes at the historic hilltop temple, cherished by seekers worldwide.',
    image: imgKasarDevi,
  },
  {
    id: 5,
    title: 'Kausani',
    distance: '35 km - 58 min drive',
    description: 'Panoramic Himalayan Retreat. Admire spectacular Himalayan vistas, lush tea gardens, and breathtaking sunrises in this peaceful hill station.',
    image: imgKausani,
  },
  {
    id: 6,
    title: 'Dol Ashram',
    distance: '35 km - 60 min drive',
    description: 'Peace, Yoga & Spiritual Retreat. Reconnect through yoga, meditation, spiritual teachings, and serene Himalayan surroundings in a peaceful ashram setting.',
    image: imgDolAshram,
  },
  {
    id: 7,
    title: 'Nainital',
    distance: '32 km - 50 min drive',
    description: 'The Jewel of Kumaon. Enjoy boating on Naini Lake, vibrant Mall Road, scenic viewpoints, and charming cafes surrounded by green hills.',
    image: imgNainital,
  },
];

function Viewpoints() {
  return (
    <section className="viewpoints-section" aria-label="Discover the Beauty Around Meraki Living">
      <div className="viewpoints-header">
        <h2 className="viewpoints-title">
          Discover the Beauty Around
          <span className="viewpoints-highlight"> Meraki Living</span>
        </h2>
        <p className="viewpoints-subtitle">
          From ancient temples and breathtaking viewpoints to serene lakes and hidden waterfalls,
          the beauty around Meraki Living is endless. Step out, explore, and create memories that stay with you forever.
        </p>
      </div>

      <div className="viewpoints-grid">
        {VIEWPOINTS_DATA.map((item) => (
          <article className="viewpoint-card" key={item.id}>
            <img
              src={item.image}
              alt={item.title}
              className="viewpoint-image"
              width="640"
              height="380"
              loading="lazy"
            />
            <div className="viewpoint-overlay" />

            <div className="viewpoint-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {item.distance}
            </div>

            <div className="viewpoint-content">
              <h3 className="viewpoint-card-title">{item.title}</h3>
              <p className="viewpoint-card-desc">{item.description}</p>
              <a href="#explore" className="viewpoint-link">
                Explore Destination
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Viewpoints;