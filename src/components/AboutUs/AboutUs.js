import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FiUsers, 
  FiHome, 
  FiCoffee,
  FiMapPin
} from 'react-icons/fi';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  TreesIcon, 
  MountainIcon, 
  SaladIcon, 
  HandHeartIcon
} from '@hugeicons/core-free-icons';

import './AboutUs.css';

import heroTopImg from "../../assets/images/hero-top.avif";
import founderImg from "../../assets/images/founder.avif";
import OptimizedImage from '../Common/OptimizedImage';

const ABOUT_PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  'name': 'About Us - Meraki Living',
  'description': 'Learn about Meraki Living in Peora, Mukteshwar—our story, vision, Himalayan hospitality, organic farm living, and sustainable mountain sanctuary.',
  'url': 'https://www.merakiliving.in/about-us',
  'mainEntity': {
    '@type': 'LodgingBusiness',
    'name': 'Meraki Living',
    'telephone': '+91-94561-03445',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Village Peora, Near Mukteshwar',
      'addressLocality': 'Peora, Mukteshwar',
      'addressRegion': 'Uttarakhand',
      'postalCode': '263138',
      'addressCountry': 'IN'
    }
  }
};

const specialFeatures = [
  { 
    icon: TreesIcon, 
    title: "Live With Nature", 
    desc: "Life in the mountains has always meant living close to the land — growing what we can, using resources thoughtfully and making the most of what nature provides. We try to carry that same spirit into the way we live and build at Meraki." 
  },
  { 
    icon: MountainIcon, 
    title: "Pahadi Roots", 
    desc: "The Kumaon hills have a culture shaped by generations of stories, traditions, food and simple ways of living. We want to keep these traditions alive not just by talking about them, but by giving our guests a chance to experience them." 
  },
  { 
    icon: SaladIcon, 
    title: "From Our Land", 
    desc: "For us, food is one of the simplest ways to understand a place. We grow what we can, source from people around us and cook with local and seasonal ingredients. At our table, we want you to discover the honest, comforting flavours of Kumaon — food that connects you to where you are." 
  },
  { 
    icon: HandHeartIcon, 
    title: "Made by Local Hands", 
    desc: "The mountains are home to generations of farmers, craftspeople and artisans whose skills are part of the cultural fabric of the region. Wherever possible, we choose to work with local people and celebrate what they create — because when something is made by hand, it carries more than just its form. It carries a story, a skill and a little piece of the place it comes from." 
  }
];

const highlights = [
  { icon: FiUsers, number: "1500+", title: "Happy Guests", desc: "Every visit begins with a warm welcome and leaves behind memories that feel just like home." },
  { icon: FiHome, number: "", title: "Boutique Stays", desc: "Thoughtfully designed spaces where comfort, elegance, and the peaceful rhythm of the Himalayas come together." },
  { icon: FiCoffee, number: "", title: "Café Meraki", desc: "Fresh coffee, authentic Kumaoni flavours, and soulful dining inspired by the beauty of the mountains." },
  { icon: FiMapPin, number: "", title: "Nature's Address", desc: "Wake up to crisp mountain air, breathtaking views, and the quiet charm of Kumaon's timeless landscapes." }
];

const AboutPage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mcf-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );

    const elements = document.querySelectorAll('.mcf-animate, .mcf-stagger-children');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mcf-ab-page-wrapper">
      <Helmet>
        <title>About Us | Meraki Living</title>
        <meta name="description" content="Learn about Meraki Living in Peora, Mukteshwar—our story, vision, Himalayan hospitality, organic farm living, and sustainable mountain sanctuary." />
        <link rel="canonical" href="https://www.merakiliving.in/about-us" />
        <meta name="robots" content="index, follow" />
        <meta property="og:site_name" content="Meraki Living" />
        <meta property="og:title" content="About Us | Meraki Living" />
        <meta property="og:description" content="Learn about Meraki Living in Peora, Mukteshwar—our story, vision, Himalayan hospitality, organic farm living, and sustainable mountain sanctuary." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.merakiliving.in/about-us" />
        <meta property="og:image" content={heroTopImg} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Meraki Living" />
        <meta name="twitter:description" content="Learn about Meraki Living in Peora, Mukteshwar—our story, vision, Himalayan hospitality, organic farm living, and sustainable mountain sanctuary." />
        <meta name="twitter:image" content={heroTopImg} />
        <script type="application/ld+json">{JSON.stringify(ABOUT_PAGE_SCHEMA)}</script>
      </Helmet>

      <section className="mcf-ab-story">
        <div className="mcf-ab-container mcf-animate">
          <div className="mcf-ab-story-card">
            <h2 className="mcf-ab-story-title mcf-mobile-title">
              The Heart Behind Meraki Living
            </h2>
            <div className="mcf-ab-story-split">
              <div className="mcf-ab-story-left">
                <div className="mcf-ab-story-img-wrap">
                  <OptimizedImage 
                    src={founderImg} 
                    alt="Pranay Matiyani — Founder of Meraki Living" 
                    width="480"
                    height="560"
                    loading="lazy" 
                    decoding="async"
                    noWrapper={true}
                  />
                  <div className="mcf-ab-story-overlay">
                    <p className="mcf-ab-story-quote">
                      Meraki means putting a part of your soul into what you create.
                    </p>
                    <h3 className="mcf-ab-story-name">
                      Pranay Matiyani
                    </h3>
                    <p className="mcf-ab-story-designation">
                      Founder, Meraki Living &amp; Café Meraki Himalayas
                    </p>
                  </div>
                </div>
              </div>
              <div className="mcf-ab-story-text">
                <h2 className="mcf-ab-story-title mcf-desktop-title">
                  The Heart Behind Meraki Living
                </h2>
                <div className="mcf-ab-story-body">
                  <p>Meraki, to me, means <strong>building something with your soul — putting a little piece of yourself into everything you create.</strong></p>
                  <p>That is how Meraki Living began.</p>
                  <p>I wanted to create a place where people could experience the mountains not just as a destination, but as a way of life.</p>
                  <p>I have always been drawn to the quiet wisdom of the hills — the way our Pahadi communities have lived close to nature, grown their own food, used what the land provides and cared for their surroundings. What we call sustainable living today has, in many ways, simply been a part of life here for generations.</p>
                  <p>Through Meraki Living, I want to share that wisdom.</p>
                  <p>I want our guests to slow down, breathe a little deeper, taste local food, discover our traditions and experience the warmth and simplicity that make the Kumaon hills so special.</p>
                  <p>I also want to preserve and share the practices our generations have followed naturally for hundreds of years — living with the land, growing organically, using resources thoughtfully, wasting less, and respecting nature and wildlife.</p>
                  <p>I believe these old ways still have much to teach us.</p>
                  <p>Through our farm, our food, our homes and our hospitality, I hope to give people a chance to experience them for themselves.</p>
                  <p>I don't want you to simply come to the mountains and see them.</p>
                  <p><strong>I want you to experience how we live here.</strong></p>
                  <p>And if you leave with a little more love for the mountains, a deeper appreciation for our Pahadi culture, and perhaps a desire to take a little of this way of life back home with you — then Meraki Living has served its purpose.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mcf-ab-hero">
        <div className="mcf-ab-container mcf-animate">
          <div className="mcf-ab-hero-content">
            <div className="mcf-ab-hero-text-wrap">
              <p className="mcf-ab-hero-pre-title">Meraki Living - Our Philosophy</p>
              <h1 className="mcf-ab-hero-title">
                More Than a Stay. A Way of Life.
              </h1>
              <p className="mcf-ab-hero-desc">
                At Meraki Living, we want you to experience the mountains as we experience them — through our food, traditions, people, craftsmanship and a way of life deeply connected to nature.
              </p>
              <p className="mcf-ab-hero-desc">
                We believe there is a quiet wisdom in the hills, passed down through generations, and we want to share a little of it with you.
              </p>
            </div>
            <div className="mcf-ab-hero-boxes-wrapper mcf-stagger-children">
              {specialFeatures.map((feat, idx) => (
                <div className="mcf-ab-hero-box" key={idx}>
                  <div className="mcf-ab-hero-box-icon">
                    <HugeiconsIcon icon={feat.icon} size={24} color="currentColor" strokeWidth={1.5} />
                  </div>
                  <div className="mcf-ab-hero-box-text">
                    <h4>{feat.title}</h4>
                    <p>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mcf-ab-highlights">
        <div className="mcf-ab-highlights-inner mcf-animate">
          <div className="mcf-ab-highlights-grid mcf-stagger-children">
            {highlights.map((item, idx) => (
              <div className="mcf-ab-highlight" key={idx}>
                <div className="mcf-ab-highlight-icon">
                  <item.icon size={26} color="#870097" strokeWidth={1.5} />
                </div>
                <h3 className="mcf-ab-highlight-title">
                  {item.number && <span className="mcf-ab-highlight-number">{item.number} </span>}
                  {item.title}
                </h3>
                <p className="mcf-ab-highlight-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;