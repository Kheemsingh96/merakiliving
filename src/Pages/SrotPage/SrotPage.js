import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Location01Icon,
  DropletIcon, 
  MountainIcon, 
  WaterfallDown01Icon, 
  Sun01Icon, 
  Leaf01Icon, 
  PineTreeIcon, 
  SparklesIcon, 
  ArrowRight01Icon, 
  ArrowDown01Icon 
} from 'hugeicons-react';
import './SrotPage.css';

import srotHeroImg from '../../assets/images/srot-hero.avif';
import srotPoolImg from '../../assets/images/srot-pool.avif';
import OptimizedImage from '../../components/Common/OptimizedImage';

const SROT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'SROT - Meraki Living',
  'description': 'Discover SROT at Meraki Living—a natural mountain spring water sanctuary surrounded by pine forests, organic orchards, and tranquil streams in Peora, Mukteshwar.',
  'url': 'https://www.merakiliving.in/srot'
};

const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'Mountain Origin',
    tagline: 'High Himalayan Aquifers',
    desc: 'High in the peaks of Uttarakhand, pure mists and precipitation filter naturally through deep Himalayan stone aquifers, shielded from all contamination.',
    Icon: MountainIcon
  },
  {
    step: '02',
    title: 'Natural Spring (स्रोत)',
    tagline: 'Fresh Living Water',
    desc: 'The pristine water emerges naturally through mossy mountain rocks—cold, crystal-clear, and enriched with Himalayan minerals as it flows into natural pools.',
    Icon: WaterfallDown01Icon
  },
  {
    step: '03',
    title: 'Tranquil Serenity',
    tagline: 'Acoustic Calm',
    desc: 'The gentle, soothing murmur of running mountain water weaves through pine forests in Peora, creating a restful atmosphere that quiets the mind.',
    Icon: Sun01Icon
  },
  {
    step: '04',
    title: 'The Meraki Experience',
    tagline: 'Retreat & Nature',
    desc: 'The mountain stream nurtures Meraki Living’s organic orchards, herbal tea gardens, and stone walkways, offering an authentic Himalayan sanctuary.',
    Icon: Leaf01Icon
  }
];

const STORY_FEATURES = [
  {
    title: 'Pure Mountain Spring Water',
    desc: 'Naturally filtered through Himalayan shale and limestone, maintaining crisp sweetness and mineral richness.',
    Icon: DropletIcon
  },
  {
    title: 'Peaceful Himalayan Setting',
    desc: 'Located in Peora, near Mukteshwar, surrounded by lush pine forests, natural rocks, and crisp mountain air.',
    Icon: PineTreeIcon
  },
  {
    title: 'Lifeline of Meraki Living',
    desc: 'Nourishing our organic gardens and farm-to-table cuisine, bringing calm and vitality to your stay.',
    Icon: SparklesIcon
  }
];

function SrotPage({ setCurrentPage }) {
  const [isHeroLoaded, setIsHeroLoaded] = useState(() => typeof navigator !== 'undefined' && /ReactSnap/i.test(navigator.userAgent));

  useEffect(() => {
    const timer = setTimeout(() => setIsHeroLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('srot-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    const elements = document.querySelectorAll('.srot-animate, .srot-stagger-children');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="srot-page">
      <Helmet>
        <title>Srot | Meraki Living</title>
        <meta name="description" content="Discover SROT at Meraki Living—a natural mountain spring water sanctuary surrounded by pine forests, organic orchards, and tranquil streams in Peora, Mukteshwar." />
        <link rel="canonical" href="https://www.merakiliving.in/srot" />
        <meta name="robots" content="index, follow" />
        <meta property="og:site_name" content="Meraki Living" />
        <meta property="og:title" content="Srot | Meraki Living" />
        <meta property="og:description" content="Discover SROT at Meraki Living—a natural mountain spring water sanctuary surrounded by pine forests, organic orchards, and tranquil streams in Peora, Mukteshwar." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.merakiliving.in/srot" />
        <meta property="og:image" content={srotHeroImg} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Srot | Meraki Living" />
        <meta name="twitter:description" content="Discover SROT at Meraki Living—a natural mountain spring water sanctuary surrounded by pine forests, organic orchards, and tranquil streams in Peora, Mukteshwar." />
        <meta name="twitter:image" content={srotHeroImg} />
        <script type="application/ld+json">{JSON.stringify(SROT_SCHEMA)}</script>
      </Helmet>
      {/* 1. HERO SECTION */}
      <section className="srot-hero-section">
        <div className="srot-hero-bg-wrapper">
          <OptimizedImage
            src={srotHeroImg}
            alt="Natural Himalayan water spring (Srot) in Peora, Mukteshwar"
            className="srot-hero-bg"
            width="1920"
            height="1080"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            noWrapper={true}
          />
        </div>

        <div className="srot-hero-overlay-main" aria-hidden="true" />
        <div className="srot-hero-overlay-bottom" aria-hidden="true" />

        <div className="srot-hero-container">
          <div className={isHeroLoaded ? 'srot-hero-content srot-hero-loaded' : 'srot-hero-content'}>
            <div className="srot-hero-text-wrapper">
              <p className="srot-hero-pre-title">Meraki Living</p>

              <h1 className="srot-hero-title">
                SROT <span className="srot-hindi-title">स्रोत</span>
              </h1>

              <h2 className="srot-hero-subtitle">Natural Himalayan Mountain Water Spring</h2>

              <div className="srot-hero-location">
                <Location01Icon size={18} className="srot-location-icon" variant="stroke" />
                <span>Peora &bull; Near Mukteshwar &bull; Uttarakhand</span>
              </div>

              <p className="srot-hero-tagline">Where Fresh Mountain Water Awakens the Soul</p>

              <p className="srot-hero-description">
                Emerging naturally from the mountain rocks of Peora, Mukteshwar, SROT (स्रोत) is a pristine, perennial natural water spring. Cold, crystal-clear, and mineral-rich, it flows through our lush Himalayan sanctuary, bringing life, stillness, and pure freshness to Meraki Living.
              </p>
            </div>

            <div className="srot-hero-btn-group">
              <button
                type="button"
                className="srot-hero-btn-primary"
                onClick={() => scrollToSection('srot-story')}
                aria-label="Discover the Srot Story"
              >
                <span>Discover The Source</span>
                <ArrowDown01Icon size={18} variant="stroke" />
              </button>
              <button
                type="button"
                className="srot-hero-btn-outline"
                onClick={() => setCurrentPage('booking')}
                aria-label="Book your stay at Meraki Living"
              >
                <span>Book Your Stay</span>
                <ArrowRight01Icon size={18} variant="stroke" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE ESSENCE OF SROT (WHAT IS SROT?) */}
      <section id="srot-story" className="srot-section">
        <div className="srot-container srot-animate">
          <div className="srot-story-grid">
            <div className="srot-story-image-col">
              <div className="srot-image-card">
                <OptimizedImage
                  src={srotPoolImg}
                  alt="Crystal-clear natural water spring pool in Peora, Mukteshwar"
                  className="srot-story-img"
                  width="800"
                  height="600"
                  loading="lazy"
                  decoding="async"
                  noWrapper={true}
                />
                <div className="srot-img-badge">
                  <DropletIcon size={18} variant="stroke" />
                  <span>Natural Himalayan Spring</span>
                </div>
              </div>
            </div>

            <div className="srot-story-content-col">
              <div className="srot-story-lead">
                <h2 className="srot-title">
                  What Is a <span className="srot-highlight">SROT</span>?
                </h2>
                <p className="srot-subtitle" style={{ margin: '0', maxWidth: '100%' }}>
                  In the Uttarakhand Himalayas, a SROT (स्रोत) is a natural mountain spring where fresh, crystal-clear water emerges continuously from deep within the earth.
                </p>
              </div>

              <div className="srot-features-list">
                {STORY_FEATURES.map((item, idx) => {
                  const IconComp = item.Icon;
                  return (
                    <div className="srot-feature-item" key={idx}>
                      <div className="srot-feature-icon-box">
                        <IconComp size={22} variant="stroke" />
                      </div>
                      <div className="srot-feature-text">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE NATURAL WATER JOURNEY (Mountain -> Natural Water -> Calm -> Experience) */}
      <section className="srot-section srot-bg-alt">
        <div className="srot-container srot-animate">
          <div className="srot-header">
            <h2 className="srot-title">
              The Journey of <span className="srot-highlight">Living Water</span>
            </h2>
            <p className="srot-subtitle">
              From high Himalayan origins to the serene stillness of your stay in Peora, Mukteshwar.
            </p>
          </div>

          <div className="srot-journey-grid srot-stagger-children">
            {JOURNEY_STEPS.map((stepItem, idx) => {
              const StepIcon = stepItem.Icon;
              return (
                <div className="srot-journey-card" key={idx}>
                  <div className="srot-card-top">
                    <span className="srot-step-num">{stepItem.step}</span>
                    <div className="srot-step-icon-wrap">
                      <StepIcon size={22} variant="stroke" />
                    </div>
                  </div>
                  <span className="srot-card-tag">{stepItem.tagline}</span>
                  <h3 className="srot-card-title">{stepItem.title}</h3>
                  <p className="srot-card-desc">{stepItem.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CLOSING LUXURY CTA */}
      <section className="srot-cta-wrapper">
        <div className="srot-container srot-animate">
          <div className="srot-cta-card">
            <div className="srot-cta-inner">
              <div className="srot-cta-badge">
                <DropletIcon size={16} variant="stroke" />
                <span>Himalayan Mountain Retreat</span>
              </div>
              <h2 className="srot-cta-title">
                Experience the Serenity of SROT at Meraki Living
              </h2>
              <p className="srot-cta-desc">
                Escape to Peora, Mukteshwar, Uttarakhand &mdash; where fresh mountain spring water, handcrafted luxury cottages, and peaceful nature come together.
              </p>
              <div className="srot-cta-buttons">
                <button
                  type="button"
                  className="srot-btn-cta-primary"
                  onClick={() => setCurrentPage('booking')}
                >
                  <span>Book Your Stay</span>
                  <ArrowRight01Icon size={18} variant="stroke" />
                </button>
                <button
                  type="button"
                  className="srot-btn-cta-secondary"
                  onClick={() => setCurrentPage('rooms')}
                >
                  <span>Explore Rooms</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SrotPage;
