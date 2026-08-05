import React, { useEffect } from 'react';
import { 
  FiArrowRight, 
  FiUsers, 
  FiHome, 
  FiCoffee,
  FiMapPin
} from 'react-icons/fi';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  SaladIcon, 
  PieIcon, 
  HandPlatterIcon, 
  TeaIcon
} from '@hugeicons/core-free-icons';

import './AboutUs.css';

import heroTopImg from "../../assets/images/hero-top.webp";
import heroBottomLeftImg from "../../assets/images/hero-bottom-left.webp";
import heroBottomRightImg from "../../assets/images/hero-bottom-right.webp";
import founderImg from "../../assets/images/founder.webp";

const specialFeatures = [
  { icon: SaladIcon, title: "Locally Sourced", desc: "We use local ingredients and support local communities." },
  { icon: PieIcon, title: "Made with Love", desc: "From our kitchen to your room, everything is made with care." },
  { icon: TeaIcon, title: "Himalayan Soul", desc: "Experience the true essence of the Himalayas." },
  { icon: HandPlatterIcon, title: "Safe & Secure", desc: "Your safety, comfort and privacy are our top priority." }
];

const highlights = [
  { icon: FiUsers, number: "500+", title: "Happy Guests", desc: "Every visit begins with a warm welcome and leaves behind memories that feel just like home." },
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
      <section className="mcf-ab-hero">
        <div className="mcf-ab-container mcf-animate">
          <div className="mcf-ab-hero-split">
            <div className="mcf-ab-hero-text-wrap">
              <h1 className="mcf-ab-hero-title">
                Driving Innovation: Our Mission Vision at Meraki
              </h1>
              <p className="mcf-ab-hero-desc">
                At the core of our hospitality, our carefully curated experiences are designed to transform your stay and bring peace to your mind.
              </p>
            </div>
            <div className="mcf-ab-hero-right">
              <div className="mcf-ab-hero-img-top-wrap">
                <img src={heroTopImg} alt="Meraki Main View" loading="lazy" decoding="async" />
              </div>
              <div className="mcf-ab-hero-img-bottom-wrap">
                <div className="mcf-ab-img-inner">
                  <img src={heroBottomLeftImg} alt="Meraki Details" loading="lazy" decoding="async" />
                </div>
                <div className="mcf-ab-img-inner">
                  <img src={heroBottomRightImg} alt="Meraki Ambiance" loading="lazy" decoding="async" />
                </div>
              </div>
            </div>
            <div className="mcf-ab-hero-boxes-wrapper mcf-stagger-children">
              {specialFeatures.map((feat, idx) => (
                <div className="mcf-ab-hero-box" key={idx}>
                  <div className="mcf-ab-hero-box-icon">
                    <HugeiconsIcon icon={feat.icon} size={24} color="#870097" strokeWidth={1.5} />
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

      <section className="mcf-ab-story">
        <div className="mcf-ab-container mcf-animate">
          <div className="mcf-ab-story-card">
            <h2 className="mcf-ab-story-title mcf-mobile-title">
              Where Every Stay Feels Personal
            </h2>
            <div className="mcf-ab-story-split">
              <div className="mcf-ab-story-left">
                <div className="mcf-ab-story-img-wrap">
                  <img 
                    src={founderImg} 
                    alt="Pranay Matiyani — Founder of Meraki Living" 
                    loading="lazy" 
                    decoding="async"
                  />
                  <div className="mcf-ab-story-overlay">
                    <p className="mcf-ab-story-admin">
                      <span className="mcf-ab-story-qmark open">&ldquo;</span>
                      Meraki Living was born from a dream to create more than a destination &mdash; a place where time slows down, nature takes the lead, and every guest feels an effortless sense of belonging.
                      <span className="mcf-ab-story-qmark close">&rdquo;</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mcf-ab-story-text">
                <h2 className="mcf-ab-story-title mcf-desktop-title">
                  The Heart Behind Meraki Living
                </h2>
                <div className="mcf-ab-story-body">
                  <p>Meraki Living was created with a vision to offer more than just a destination&mdash;it was designed to be a place where every guest feels welcomed, every moment feels meaningful, and every stay becomes a cherished memory. Surrounded by the untouched beauty of the Kumaon Himalayas, every experience is thoughtfully curated to blend elegant comfort with the calm of nature, creating a retreat that feels both luxurious and deeply personal. Every room reflects timeless simplicity, every sunrise brings a sense of renewal, and every gesture of hospitality is inspired by warmth, authenticity, and genuine care. Whether you are seeking a peaceful escape, celebrating life&apos;s special moments, or simply embracing the serenity of the mountains, Meraki Living offers an experience that feels intimate, effortless, and unforgettable. At Café Meraki, the journey continues with handcrafted coffee, authentic Kumaoni flavours, and carefully prepared dishes that celebrate local traditions while bringing people together over unforgettable moments.</p>
                </div>
                <div className="mcf-ab-story-signature-wrap">
                  <h4 className="mcf-ab-story-signature-name">Pranay Matiyani</h4>
                  <span className="mcf-ab-story-signature-title">Founder Meraki Living &amp; Cafe Meraki</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mcf-ab-cta">
        <div className="mcf-ab-container mcf-animate">
          <div className="mcf-ab-cta-inner">
            <div className="mcf-ab-cta-accent-line" />
            <span className="mcf-ab-cta-label">
              Your Himalayan Escape Awaits
            </span>
            <h2 className="mcf-ab-cta-title">
              Come. Stay. Belong.
            </h2>
            <p className="mcf-ab-cta-desc">
              Experience the warmth of authentic mountain hospitality at Meraki Living. 
              Let the Himalayas welcome you home.
            </p>
            <a href="/book" className="mcf-ab-cta-btn">
              <span>Book Your Stay</span>
              <FiArrowRight size={18} strokeWidth={2} />
            </a>
            <div className="mcf-ab-cta-orb orb-1" />
            <div className="mcf-ab-cta-orb orb-2" />
            <div className="mcf-ab-cta-orb orb-3" />
            <div className="mcf-ab-cta-orb orb-4" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;