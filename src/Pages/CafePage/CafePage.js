import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { API_CONFIG_URL } from '../../config/api';
import { safeParseResponse, formatImageUrl, isPrerendering } from '../../utils/apiHelper';
import { 
  FiArrowRight, 
  FiX, 
  FiWifi, 
  FiPhone, 
  FiMapPin, 
  FiClock,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
  FiMusic
} from 'react-icons/fi';
import { 
  FaParking, 
  FaStar, 
  FaWhatsapp 
} from 'react-icons/fa';
import { 
  TbMountain, 
  TbChefHat 
} from 'react-icons/tb';
import { 
  Location01Icon,
  Tick02Icon,
  Coffee02Icon,
  ApplePieIcon,
  RestaurantTableIcon
} from 'hugeicons-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PieIcon, HandPlatterIcon, TeaIcon } from '@hugeicons/core-free-icons';

import './CafePage.css';
import '../../components/Review/Review.css';
import OptimizedImage from '../../components/Common/OptimizedImage';

import cafeHeroImg1 from "../../assets/images/cafe-hero-1.avif";
import cafeHeroImg2 from "../../assets/images/cafe-hero-2.avif";
import cafeHeroImg3 from "../../assets/images/cafe-hero-3.avif";
import cafeAboutImg from "../../assets/images/cafe-about.avif";
import ragi from "../../assets/images/ragi.avif";
import mutton from "../../assets/images/mutton.avif";
import sandwich from "../../assets/images/sandwich.avif";
import omelette from "../../assets/images/omelette.avif";
import fries from "../../assets/images/fries.avif";
import cafeAmbianceImg from "../../assets/images/cafe-ambiance.avif";
import cafeLifestyle1 from "../../assets/images/cafe-lifestyle-1.avif";
import cafeLifestyle2 from "../../assets/images/cafe-menu-7.avif";
import tea from "../../assets/images/tea.avif";
import rosemary from "../../assets/images/rosemary.avif";
import maggie from "../../assets/images/maggie.avif";

const CAFE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  'name': 'Meraki Mountain Cafe',
  'description': 'Farm-to-table Himalayan dining, handcrafted coffees, artisanal beverages, and authentic Kumaoni cuisine in Peora, Mukteshwar.',
  'url': 'https://www.merakiliving.in/cafe',
  'telephone': '+91-94561-03445',
  'servesCuisine': ['Himalayan', 'Kumaoni', 'Indian', 'Cafe', 'Organic'],
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Village Peora, Near Mukteshwar',
    'addressLocality': 'Peora, Mukteshwar',
    'addressRegion': 'Uttarakhand',
    'postalCode': '263138',
    'addressCountry': 'IN'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 29.475,
    'longitude': 79.625
  }
};

const SLIDES = [cafeHeroImg1, cafeHeroImg2, cafeHeroImg3];
const SLIDE_INTERVAL = 4000;
const PHONE_NUMBER = "919456103445";

const VegIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="14" height="14" rx="2" stroke="#128C12" strokeWidth="1.5"/>
    <circle cx="8" cy="8" r="4" fill="#128C12"/>
  </svg>
);

const NonVegIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="14" height="14" rx="2" stroke="#CC0000" strokeWidth="1.5"/>
    <path d="M8 4L12 11H4L8 4Z" fill="#CC0000"/>
  </svg>
);

const featuredMenuItems = [
  { id: 1, image: ragi, name: "Traditional Ragi Roti", desc: "Soft, wholesome mandua (ragi) roti served fresh with authentic Himalayan flavours and traditional local accompaniments.", category: "Healthy", tag: "Chef's Special", rating: 4.9, price: 120, originalPrice: 160, isVeg: true },
  { id: 2, image: mutton, name: "Kumaoni Mutton Curry", desc: "Slow-cooked in traditional mountain spices, this rich and aromatic mutton curry delivers the true taste of Kumaoni heritage.", category: "Main Course", tag: "Popular", rating: 4.8, price: 550, originalPrice: 650, isVeg: false },
  { id: 3, image: sandwich, name: "Garden Veg Sandwich", desc: "Fresh seasonal vegetables, creamy cheese, and toasted artisan bread, grilled to golden perfection.", category: "Healthy", tag: "New", rating: 4.7, price: 180, originalPrice: 220, isVeg: true },
  { id: 4, image: omelette, name: "Cheese Herb Omelette", desc: "Fluffy farm-fresh eggs with melted cheese and herbs, served hot for a wholesome breakfast.", category: "Breakfast", tag: "Best Seller", rating: 4.9, price: 150, originalPrice: 190, isVeg: false },
  { id: 5, image: fries, name: "Crispy French Fries", desc: "Golden, perfectly seasoned potato fries served hot and crispy, making the perfect snack anytime.", category: "Desserts", tag: "Must Try", rating: 4.8, price: 140, originalPrice: 180, isVeg: true },
  { id: 6, image: tea, name: "Organic Himalayan Tea", desc: "A soothing blend of handpicked mountain herbs, perfect for relaxing in the crisp mountain air.", category: "Beverages", tag: "Signature", rating: 4.9, price: 90, originalPrice: 120, isVeg: true },
  { id: 7, image: rosemary, name: "Rosemary Herbal Tea", desc: "A soothing herbal infusion with fragrant rosemary, offering a refreshing taste and calming mountain-inspired warmth.", category: "Beverages", tag: "Chef's Special", rating: 4.8, price: 80, originalPrice: 400, isVeg: true },
  { id: 8, image: maggie, name: "Pahadi Masala Maggie", desc: "The ultimate mountain comfort food, loaded with fresh veggies and our secret spice mix.", category: "Breakfast", tag: "Popular", rating: 4.7, price: 120, originalPrice: 150, isVeg: true }
];

const modalMenuPages = [
  {
    id: 1,
    pageTitle: "Food Menu",
    subtitle: "Breakfast & Pahadi Khana",
    sections: [
      {
        title: "Breakfast",
        items: [
          { name: "Cheese Vegetable Omelette", desc: "Two eggs with tossed vegetable and sprinkled cheese served with butter toast", price: 150 },
          { name: "Aloo/ Onion/ Paneer Paratha", desc: "Served with Butter and Fresh Mint Chutney", price: 150 },
          { name: "Poha", desc: "Flattened rice, onions, potatoes, green peas peanuts and flavoured with basic spices and herbs", price: 100 },
          { name: "Egg Bhurji", desc: "Spiced Indian two scrambled eggs served with butter toast", price: 100 },
          { name: "Paneer / Corn / Vegetable Cheese Sandwich", desc: "Classic Indian street food snack, made from layers of chutney, masala mix, cheese and sliced veg/paneer or corn", price: 200 }
        ]
      },
      {
        title: "Pahadi Khana (Seasonal)",
        items: [
          { name: "Bhat Ki Dal / Chudkani", desc: "Organic black soybeans cooked in iron pan in authentic style", price: 400 },
          { name: "Pahadi Rajma", desc: "Rajma/Kidney Beans, cooked in Pahadi style along with desi ghee", price: 400 },
          { name: "Gahat Ki Dal", desc: "Gahat Dal or horse gram is one of the oldest Pahadi traditional medicines used to control diabetes", price: 400 },
          { name: "Farm Fresh Organic Vegetable", desc: "Fresh Organic Seasonal Vegetable from Farm to Table", price: 400 },
          { name: "Pahadi Kadi", desc: "Jholi is Curd and Besan thick and spicy curry preparation from hills of Uttarakhand", price: 300 },
          { name: "Pahadi Raita", desc: "Flavoured rice, onions, potatoes, green peas peanuts and flavoured with basic spices and herbs", price: 75 },
          { name: "Bhang Ki Chutney", desc: "Made from Bhang (Hemp) seeds which have no psychoactive properties", price: 50 },
          { name: "Pahadi Mutton/ Chicken Curry", desc: "The unbeatable Pahadi family recipe, this curry is spicy and full of flavours", price: 500 },
          { name: "Veg / Non Veg Authentic Pahadi Lunch/Dinner", desc: "Price per person", price: "500 / 750" }
        ]
      }
    ]
  },
  {
    id: 2,
    pageTitle: "Food Menu",
    subtitle: "Snacks, Rice, Roti & Add-ons",
    sections: [
      {
        title: "All Day Snacks",
        items: [
          { name: "Masala Maggie", price: 120 },
          { name: "Mix Pakode With Mint Chutney", price: 150 },
          { name: "French Fries With Cheese Dip", price: 150 },
          { name: "Butter Toast", price: 100 },
          { name: "Bun Tikki", price: 150 },
          { name: "Bambaiya Sandwich", desc: "This grilled snack is stuffed with aloo masala and veggies", price: 150 },
          { name: "Wada Pav", price: 150 }
        ]
      },
      {
        title: "Rice & Roti",
        items: [
          { name: "Steamed Basmati Rice", price: 150 },
          { name: "Jeera Rice", price: 175 },
          { name: "Peas Pulav", price: 200 },
          { name: "Special Dal Khichdi", price: 200 },
          { name: "Plain Roti", price: 25 },
          { name: "Raagi Roti", price: 50 },
          { name: "Puri / Paratha", price: 50 }
        ]
      },
      {
        title: "Add Ons",
        items: [
          { name: "Roasted Papad", price: 50 },
          { name: "Masala Papad", price: 100 },
          { name: "Curd", price: 50 },
          { name: "Raita", price: 75 },
          { name: "Green Salad", price: 100 }
        ]
      }
    ]
  },
  {
    id: 3,
    pageTitle: "Herbal Tea Menu",
    subtitle: "Best selection of herbal teas to suit every taste",
    sections: [
      {
        title: "Teas",
        items: [
          { name: "Detox Tea With Honey", tag: "Recommended", price: 150 },
          { name: "Mint Ginger Tea", price: 120 },
          { name: "Rosemary With Honey", price: 120 },
          { name: "Thyme Ginger With Honey", price: 120 },
          { name: "Lemon Grass Ginger With Honey", price: 120 },
          { name: "Pahadi Chay With Jaggery", price: 120 },
          { name: "Exotic Masala Tea", price: 120 },
          { name: "Organic Himalayan Turmeric Milk", price: 120 }
        ]
      }
    ]
  },
  {
    id: 4,
    pageTitle: "Beverages & Soup",
    subtitle: "Refreshing drinks and comforting soups",
    sections: [
      {
        title: "Beverages & Soups",
        items: [
          { name: "Black Coffee", price: 100 },
          { name: "Expresso Hot Coffee", price: 120 },
          { name: "Chochlate Shake", price: 100 },
          { name: "Banana Shake", price: 100 },
          { name: "Fresh Lime Soda", price: 100 },
          { name: "Lassi Or Chaans", price: 100 },
          { name: "Thyme Tomato Soup", price: 150 }
        ]
      }
    ]
  }
];

const aboutFeatures = [
  { icon: Coffee02Icon, title: "Garden-Fresh Herbal Tea", desc: "Handpicked herbs from our mountain garden, brewed to perfection for a refreshing experience." },
  { icon: ApplePieIcon, title: "Authentic Kumaoni Food", desc: "Traditional recipes passed down through generations, prepared with locally sourced ingredients." },
  { icon: RestaurantTableIcon, title: "Open-Air Nature Dining", desc: "Breathe in the fresh mountain air while dining amidst panoramic Himalayan views." }
];

const features = [
  { icon: TbMountain, title: "Valley Views", desc: "Panoramic Himalayan views from every table" },
  { icon: FiWifi, title: "Free WiFi", desc: "High-speed internet for remote workers" },
  { icon: FaParking, title: "Free Parking", desc: "Ample parking space for all guests" },
  { icon: FiMusic, title: "Live Music", desc: "Acoustic evenings every weekend" },
  { icon: TbChefHat, title: "Expert Chefs", desc: "Culinary masters crafting every dish" }
];

const ambianceItems = [
  "Open-air terrace seating with valley views",
  "Cozy indoor fireplace lounge for winter evenings",
  "Private dining nook for special occasions",
  "Live acoustic music every Friday & Saturday",
  "Pet-friendly outdoor garden seating"
];

const galleryImages = [
  cafeAmbianceImg,
  cafeLifestyle1,
  tea,
  rosemary,
  cafeLifestyle2,
  omelette,
  ragi
];

const DEFAULT_REVIEW_DATA = [
  {
    id: 1,
    name: "Rajesh Khanna",
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    text: "The coffee at Meraki Mountain Cafe is absolutely phenomenal. Sipping a Himalayan brew while watching the sunrise over the peaks was the highlight of our trip. The wood-fired pizza is a must-try!"
  },
  {
    id: 2,
    name: "Sunita Reddy",
    date: "1 month ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    text: "Honestly, the best cafe experience in the mountains. The Kumaoni thali was so authentic, just like how my grandmother used to make it. Very polite staff and the terrace views are breathtaking."
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    date: "3 months ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    text: "Perfect place for a weekend brunch. The pancake stack with fresh berries was divine, and the outdoor seating is just perfect for evening conversations with the valley as your backdrop."
  }
];

const CafePage = () => {
  const [foodIndex, setFoodIndex] = useState(0);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [currentMenuPage, setCurrentMenuPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const [heroSlidesState] = useState(SLIDES);
  const [aboutImgState] = useState(null);
  const [featuredMenuState] = useState(featuredMenuItems);
  const [modalMenuState] = useState(modalMenuPages);
  const [galleryImagesState, setGalleryImagesState] = useState(galleryImages);
  const [ambianceMainImg] = useState(null);
  const [imgCacheBuster, setImgCacheBuster] = useState(() => Date.now());

  const formatImageUrlWithBuster = useCallback((url, ts) => {
    if (!url) return '';
    const formatted = formatImageUrl(url);
    if (!formatted) return '';
    if (formatted.startsWith('data:') || formatted.startsWith('blob:')) return formatted;
    const sep = formatted.includes('?') ? '&' : '?';
    return `${formatted}${sep}v=${ts || imgCacheBuster}`;
  }, [imgCacheBuster]);

  // Review section state
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [reviews, setReviews] = useState(DEFAULT_REVIEW_DATA);

  useEffect(() => {
    if (isPrerendering()) return;
    let isMounted = true;
    fetch(`${API_CONFIG_URL}/api_reviews.php`)
      .then(res => safeParseResponse(res))
      .then(parsed => {
        if (!isMounted) return;
        const data = parsed.data;
        if (parsed.ok && data && data.status === 'success' && Array.isArray(data.data)) {
          const cafeReviews = data.data
            .filter(r => r.visibility === 'Visible' && r.type === 'Cafe')
            .map(r => ({
              id: r.review_id,
              name: r.guest_name || 'Guest',
              date: 'Recent',
              avatar: null,
              text: r.review_text,
              rating: r.rating || 5
            }));
          if (cafeReviews.length > 0) {
            setReviews(cafeReviews);
            setActiveReviewIndex(0);
          }
        }
      })
      .catch(e => {
        if (process.env.NODE_ENV === 'development' && !isPrerendering()) {
          console.warn("Could not load backend cafe reviews, maintaining default reviews.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => {
      setActiveReviewIndex((current) => (current + 1) % reviews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const getPositionClass = (index) => {
    const length = reviews.length;
    let dist = (index - activeReviewIndex + length) % length;
    
    if (dist > Math.floor(length / 2)) {
      dist -= length;
    }

    if (dist === 0) return 'pos-center';
    if (dist === -1) return 'pos-left';
    if (dist === 1) return 'pos-right';
    if (dist === -2) return 'pos-far-left';
    if (dist === 2) return 'pos-far-right';
    return 'pos-hidden';
  };

  const activeReview = reviews[activeReviewIndex];

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchCafeGallery = useCallback((ts) => {
    if (isPrerendering()) return;
    const currentTs = ts || Date.now();
    fetch(`${API_CONFIG_URL}/api_gallery.php?t=${Date.now()}`)
      .then(res => safeParseResponse(res))
      .then(parsed => {
        if (!isMountedRef.current) return;
        const data = parsed.data;
        if (parsed.ok && data && data.status === 'success' && Array.isArray(data.data)) {
           const cafeImages = data.data.filter(img => {
             const cat = (img.category || '').toLowerCase().trim();
             return cat.includes('cafe');
           });
           
           if (cafeImages.length > 0) {
              const formattedUrls = cafeImages.map(img => formatImageUrlWithBuster(img.image_url, currentTs));
              setGalleryImagesState(formattedUrls);
           } else {
              setGalleryImagesState(galleryImages);
           }
        }
      }).catch(e => {
        if (process.env.NODE_ENV === 'development' && !isPrerendering()) {
          console.warn("Could not load backend cafe gallery, maintaining default gallery.");
        }
      });
  }, [formatImageUrlWithBuster]);

  useEffect(() => {
    if (isPrerendering()) return;
    const handleUpdate = (isEvent = false) => {
      let ts;
      try {
        ts = localStorage.getItem('meraki_cafe_updated_ts') || '1';
      } catch (e) {
        ts = '1';
      }
      setImgCacheBuster(ts);
      fetchCafeGallery(ts);
    };

    const handleStorage = (e) => {
      if (!e || e.key === 'meraki_gallery_updated_ts' || !e.key) {
        handleUpdate(true);
      }
    };

    handleUpdate(false);

    const handleEventUpdate = () => handleUpdate(true);

    window.addEventListener('galleryUpdated', handleEventUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('galleryUpdated', handleEventUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchCafeGallery]);


  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  const itemsPerPage = 4;
  const currentFoodItems = featuredMenuState.slice(foodIndex, foodIndex + itemsPerPage);

  const nextFood = () => {
    if (foodIndex + itemsPerPage < featuredMenuState.length) {
      setFoodIndex(foodIndex + itemsPerPage);
    }
  };

  const prevFood = () => {
    if (foodIndex - itemsPerPage >= 0) {
      setFoodIndex(foodIndex - itemsPerPage);
    }
  };

  const [mountedSlides] = useState([0, 1, 2]);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => {
      setPrevSlide(prev);
      const slideCount = heroSlidesState.length || 1;
      return (prev + 1) % slideCount;
    });
  }, [heroSlidesState.length]);

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsHeroLoaded(true), 50);
    const intervalId = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => {
      clearTimeout(loadTimer);
      clearInterval(intervalId);
    };
  }, [nextSlide]);

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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePreOrder = (itemName) => {
    const message = encodeURIComponent(`Hi Meraki Cafe!\n\nI would like to pre-order: *${itemName}*`);
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
  };

  useEffect(() => {
    if (isMenuModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuModalOpen]);

  return (
    <section className="mcf-section">
      <Helmet>
        <title>Cafe Meraki | Mountain Dining & Artisanal Coffee in Peora Mukteshwar</title>
        <meta name="description" content="Savor farm-to-table Himalayan dining, authentic Kumaoni dishes, artisanal coffee, and herbal teas at Cafe Meraki in Peora, Mukteshwar with panoramic valley views." />
        <link rel="canonical" href="https://www.merakiliving.in/cafe" />
        <meta name="robots" content="index, follow" />
        <meta property="og:site_name" content="Meraki Living" />
        <meta property="og:title" content="Cafe Meraki | Mountain Dining & Artisanal Coffee in Peora Mukteshwar" />
        <meta property="og:description" content="Savor farm-to-table Himalayan dining, authentic Kumaoni dishes, artisanal coffee, and herbal teas at Cafe Meraki in Peora, Mukteshwar with panoramic valley views." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.merakiliving.in/cafe" />
        <meta property="og:image" content={cafeHeroImg1} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Café Meraki | Mountain Dining & Artisanal Coffee in Peora Mukteshwar" />
        <meta name="twitter:description" content="Savor farm-to-table Himalayan dining, authentic Kumaoni dishes, artisanal coffee, and herbal teas at Café Meraki in Peora, Mukteshwar with panoramic valley views." />
        <meta name="twitter:image" content={cafeHeroImg1} />
        <script type="application/ld+json">{JSON.stringify(CAFE_SCHEMA)}</script>
      </Helmet>
      <div className="mcf-hero-wrapper">
        <div className="mcf-hero-bg-wrapper">
          {heroSlidesState.map((slide, index) => {
            if (!mountedSlides.includes(index)) return null;
            let slideClass = '';
            if (index === activeSlide) {
              slideClass = 'active';
            } else if (index === prevSlide) {
              slideClass = 'prev';
            }

            return (
              <OptimizedImage
                key={index}
                src={slide}
                alt={`Meraki Mountain Cafe scenic view and dining in Peora Mukteshwar - view ${index + 1}`}
                className={slideClass}
                loading="eager"
                fetchPriority={index === 0 ? 'high' : 'low'}
                decoding="async"
                width="1920"
                height="1080"
                noWrapper={true}
              />
            );
          })}
        </div>
        <div className="mcf-hero-overlay-main" aria-hidden="true" />
        <div className="mcf-hero-overlay-bottom" aria-hidden="true" />
        <div className="mcf-hero-container">
          <div className={isHeroLoaded ? 'mcf-hero-content mcf-hero-loaded' : 'mcf-hero-content'}>
            <div className="mcf-hero-text-wrapper">
              <p className="mcf-hero-pre-title">Meraki Living</p>
              <h1 className="mcf-hero-title">
                Cafe <span className="mcf-hero-hindi">Meraki</span>
              </h1>
              <h2 className="mcf-hero-subtitle">Artisanal Mountain Cafe & Kitchen</h2>
              <div className="mcf-hero-location">
                <Location01Icon size={18} className="mcf-hero-location-icon" variant="stroke" />
                <span>Peora &bull; Near Mukteshwar &bull; Kumaon Himalayas</span>
              </div>
              <p className="mcf-hero-tagline">Good Food. Great Views. Pure Bliss.</p>
              <p className="mcf-hero-desc">
                Savor artisanal brews, gourmet delights, and panoramic Himalayan views at our cozy mountain cafe. Every cup tells a story, every bite is an experience.
              </p>
            </div>
            <div className="mcf-hero-btn-group">
              <button className="mcf-hero-btn" onClick={() => setIsMenuModalOpen(true)}>
                View Full Menu
              </button>
              <button className="mcf-hero-btn-outline" onClick={() => scrollToSection('about')}>
                Our Story
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="about" className="mcf-about">
        <div className="mcf-about-container mcf-animate">
          <div className="mcf-about-image">
            <OptimizedImage src={aboutImgState || cafeAboutImg} alt="Cozy cafe interior with mountain views" loading="lazy" decoding="async" width="640" height="480" noWrapper={true} />
          </div>
          <div className="mcf-about-text-header">
            <h2 className="mcf-about-title">Experience the Soul of Café Meraki</h2>
            <p className="mcf-about-desc">
              Located on a vibrant picturesque location with a majestic view of himalayas, Café Meraki is one of a kind, a bright and airy space with open air sitting, serving our signature herbal tea made from garden fresh herbs and all day food menus.
            </p>
          </div>
          <div className="mcf-about-features">
            {aboutFeatures.map((feat, idx) => (
              <div className="mcf-about-feature" key={idx}>
                <div className="mcf-about-feature-icon">
                  <feat.icon size={22} color="#870097" />
                </div>
                <div className="mcf-about-feature-text">
                  <span className="mcf-about-feature-title">{feat.title}</span>
                  <span className="mcf-about-feature-desc">{feat.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mcf-features-strip">
        <div className="mcf-features-grid mcf-stagger-children">
          {features.map((feat, idx) => (
            <div className="mcf-feature-card" key={idx}>
              <div className="mcf-feature-icon">
                <feat.icon size={26} color="#870097" />
              </div>
              <span className="mcf-feature-title">{feat.title}</span>
              <span className="mcf-feature-desc">{feat.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div id="menu" className="mcf-premium-menu-section">
        <div className="mcf-menu-container mcf-animate">

          <div className="mcf-menu-header-wrapper">
            <div className="mcf-menu-header-center">
              <h2 className="mcf-menu-title">Made Fresh. Made Local. Made for You.</h2>
              <p className="mcf-menu-subtitle">
                Every dish is crafted with love using the freshest local ingredients,<br/> bringing you authentic mountain flavors with a modern twist.
              </p>
            </div>
          </div>

          <div className="mcf-menu-board">
            <div className="mcf-board-grid mcf-stagger-children">
              {currentFoodItems.map((item) => (
                <div className="mcf-premium-food-card" key={item.id}>
                  <div className="mcf-fc-image">
                    <OptimizedImage src={item.image} alt={item.name} loading="lazy" decoding="async" width="400" height="300" noWrapper={true} />
                    <span className={`mcf-fc-tag ${item.tag === 'Best Seller' ? 'gold' : ''}`}>{item.tag}</span>
                    <div className="mcf-fc-rating">
                      <FaStar size={12} color="#C78D3A" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <div className="mcf-fc-content">
                    <div className="mcf-fc-title-row">
                      {item.isVeg ? <VegIcon /> : <NonVegIcon />}
                      <h3 className="mcf-fc-title">{item.name}</h3>
                    </div>
                    <p className="mcf-fc-desc">{item.desc}</p>
                    <div className="mcf-fc-footer">
                      <div className="mcf-fc-price-group">
                        <span className="mcf-fc-price-new">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="mcf-fc-price-old">₹{item.originalPrice}</span>
                        )}
                      </div>
                      <button className="mcf-fc-preorder-btn" onClick={() => handlePreOrder(item.name)}>
                        Pre Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mcf-board-controls-bottom">
              <button 
                className="mcf-control-btn" 
                onClick={prevFood} 
                disabled={foodIndex === 0}
              >
                <FiChevronLeft size={20}/>
              </button>
              <button 
                className="mcf-control-btn dark" 
                onClick={nextFood} 
                disabled={foodIndex + itemsPerPage >= featuredMenuState.length}
              >
                <FiChevronRight size={20}/>
              </button>
            </div>

            <div className="mcf-board-footer-bottom">
              <div className="mcf-board-features">
                <div className="mcf-bf-item">
                  <div className="mcf-bf-icon">
                    <HugeiconsIcon icon={PieIcon} size={22} color="#870097" strokeWidth={1.5} />
                  </div>
                  <div className="mcf-bf-text">
                    <h3>Farm Fresh Ingredients</h3>
                    <p>Freshly sourced from local farms</p>
                  </div>
                </div>
                <div className="mcf-bf-item">
                  <div className="mcf-bf-icon">
                    <HugeiconsIcon icon={HandPlatterIcon} size={22} color="#870097" strokeWidth={1.5} />
                  </div>
                  <div className="mcf-bf-text">
                    <h3>Chef's Special Recipes</h3>
                    <p>Crafted with authentic flavors</p>
                  </div>
                </div>
                <div className="mcf-bf-item">
                  <div className="mcf-bf-icon">
                    <HugeiconsIcon icon={TeaIcon} size={22} color="#870097" strokeWidth={1.5} />
                  </div>
                  <div className="mcf-bf-text">
                    <h3>Herbal Mountain Tea</h3>
                    <p>Refreshing Himalayan herbal blends</p>
                  </div>
                </div>
              </div>

              <div className="mcf-board-cta">
                <button className="mcf-btn-full-menu" onClick={() => setIsMenuModalOpen(true)}>
                  View Full Menu <FiArrowRight size={18} />
                </button>
                <p className="mcf-cta-sub">Explore more delicious options</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div id="ambiance" className="mcf-ambiance">
        <div className="mcf-ambiance-container mcf-animate">
          <div className="mcf-ambiance-image">
            <OptimizedImage src={ambianceMainImg || cafeAmbianceImg} alt="Cafe ambiance with mountain view" loading="lazy" decoding="async" width="640" height="480" noWrapper={true} />
          </div>
          <div className="mcf-ambiance-text-header">
            <h2 className="mcf-ambiance-title">Good Food in Good Company</h2>
            <p className="mcf-ambiance-desc">
              Whether you are here for a morning coffee, a leisurely lunch, or a romantic dinner, our cafe offers the perfect setting. Warm wooden interiors, soft ambient lighting, and floor-to-ceiling windows frame the majestic Himalayas.
            </p>
          </div>
          <ul className="mcf-ambiance-list">
            {ambianceItems.map((item, idx) => (
              <li key={idx}>
                <Tick02Icon size={20} color="#870097" variant="stroke" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mcf-ambiance-btn-wrapper">
            <button className="mcf-ambiance-btn" onClick={() => scrollToSection('contact')}>
              <span>Reserve a Table</span>
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div id="gallery" className="mcf-gallery">
        <div className="mcf-gallery-container mcf-animate">
          <div className="mcf-gallery-header">
            <h2 className="mcf-gallery-title">Moments at Café Meraki</h2>
          </div>
          <div className="mcf-gallery-grid mcf-stagger-children">
            {galleryImagesState.map((img, idx) => (
              <div
                className="mcf-gallery-item"
                key={idx}
                onClick={() => setSelectedImage(img)}
              >
                <OptimizedImage src={img} alt={`Café Meraki Ambiance & Dining Experience - Photo ${idx + 1}`} loading="lazy" decoding="async" width="400" height="300" noWrapper={true} />
                <div className="mcf-gallery-overlay">
                  <FiImage size={24} color="#ffffff" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="reviews" className="premium-review-section">
        <div className="review-container mcf-animate">
          <header className="review-header">
            <h2 className="review-title">
              What Our Guests <span className="review-highlight">Say</span>
            </h2>
            <p className="review-subtitle">
              Read through genuine experiences shared by our wonderful guests on Google.
            </p>
          </header>

          <div className="premium-review-box">
            <div className="review-content">
              <div className="review-stars">
                {[...Array(parseInt(activeReview?.rating) || 5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" fill="#F79D00">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>

              <h3 className="review-quote-text">
                “{activeReview.text}”
              </h3>
              
              <div className="review-author-info">
                <h4 className="author-name">{activeReview.name}</h4>
                <p className="author-date">{activeReview.date}</p>
              </div>
            </div>

            <div className="avatar-carousel">
              <svg className="carousel-arc" viewBox="0 0 340 70" preserveAspectRatio="xMidYMid meet">
                <path d="M 20 60 Q 170 -10 320 60" stroke="#E2E8F0" strokeWidth="2" fill="none" />
              </svg>

              {reviews.map((review, index) => (
                <div 
                  key={review.id} 
                  className={`avatar-item ${getPositionClass(index)}`}
                  onClick={() => setActiveReviewIndex(index)}
                >
                  <div className="avatar-circle">
                    {review.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="contact" className="mcf-contact">
        <div className="mcf-contact-container mcf-animate">
          <div className="mcf-contact-content">
            <h2 className="mcf-contact-title">Come for the View,<br /><span className="mcf-contact-accent">Stay for the Moments</span></h2>
            <p className="mcf-contact-desc">Reserve your table today and experience the magic of mountain dining. We can't wait to welcome you!</p>
            <div className="mcf-contact-actions">
              <a href={`https://wa.me/${PHONE_NUMBER}?text=Hi%20Meraki%20Cafe!%20%0A%0AI%20would%20like%20to%20reserve%20a%20table.`} target="_blank" rel="noopener noreferrer" className="mcf-contact-btn-primary">
                <FaWhatsapp size={20} />
                <span>WhatsApp Reservation</span>
              </a>
              <a href={`tel:+${PHONE_NUMBER}`} className="mcf-contact-btn-secondary">
                <FiPhone size={18} />
                <span>Call Now</span>
              </a>
            </div>
            <div className="mcf-contact-info">
              <div className="mcf-contact-item">
                <FiMapPin size={18} color="#C78D3A" />
                <span>Cafe Meraki Peora Mukteshwar, Uttarakhand India — 263138</span>
              </div>
              <div className="mcf-contact-item">
                <FiClock size={18} color="#C78D3A" />
                <span>Open Daily: 7:00 AM - 10:00 PM</span>
              </div>
              <div className="mcf-contact-item">
                <FiPhone size={18} color="#C78D3A" />
                <span>+91 94561 03445</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="mcf-lightbox" onClick={() => setSelectedImage(null)}>
          <button className="mcf-lightbox-close" onClick={() => setSelectedImage(null)}>
            <FiX size={28} />
          </button>
          <OptimizedImage src={selectedImage} alt="Café Meraki dining area and mountain view preview" loading="lazy" decoding="async" objectFit="contain" noWrapper={true} />
        </div>
      )}

      {isMenuModalOpen && (
        <div className="mcf-menu-modal-overlay" onClick={() => setIsMenuModalOpen(false)}>
          <div className="mcf-menu-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="mcf-menu-modal-header">
              <div className="mcf-menu-modal-header-text">
                <p className="mcf-menu-modal-pretitle">Café Meraki</p>
                <h2 className="mcf-menu-modal-title">{modalMenuState[currentMenuPage].pageTitle}</h2>
                {modalMenuState[currentMenuPage].subtitle && (
                  <p className="mcf-menu-modal-subtitle">{modalMenuState[currentMenuPage].subtitle}</p>
                )}
              </div>
              <button className="mcf-menu-modal-close" onClick={() => setIsMenuModalOpen(false)}>
                <FiX size={24} />
              </button>
            </div>

            <div className="mcf-menu-modal-body">
              {modalMenuState[currentMenuPage].sections.map((section, idx) => (
                <div className="mcf-menu-modal-section" key={idx}>
                  <h3 className="mcf-menu-modal-section-title"><span>{section.title}</span></h3>
                  {section.desc && <p className="mcf-menu-modal-section-desc">{section.desc}</p>}

                  <div className="mcf-menu-modal-list">
                    {section.items.map((item, itemIdx) => (
                      <div className="mcf-menu-modal-item" key={itemIdx}>
                        <div className="mcf-menu-modal-item-info">
                          <h4 className="mcf-menu-modal-item-name">
                            {item.name}
                            {item.tag && <span className="mcf-menu-modal-item-tag">{item.tag}</span>}
                          </h4>
                          {item.desc && <p className="mcf-menu-modal-item-desc">{item.desc}</p>}
                        </div>
                        <div className="mcf-menu-modal-item-actions">
                          <span className="mcf-menu-modal-item-price">₹{item.price}</span>
                          <button 
                            className="mcf-menu-modal-preorder-btn" 
                            onClick={() => handlePreOrder(item.name)}
                          >
                            Pre Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mcf-menu-modal-footer">
              <div className="mcf-menu-modal-pagination">
                <button 
                  disabled={currentMenuPage === 0} 
                  onClick={() => setCurrentMenuPage(prev => prev - 1)}
                  className="mcf-modal-page-btn"
                >
                  <FiChevronLeft size={20} /> Prev
                </button>
                <span className="mcf-modal-page-indicator">
                  Page {currentMenuPage + 1} of {modalMenuState.length}
                </span>
                <button 
                  disabled={currentMenuPage === modalMenuState.length - 1} 
                  onClick={() => setCurrentMenuPage(prev => prev + 1)}
                  className="mcf-modal-page-btn"
                >
                  Next <FiChevronRight size={20} />
                </button>
              </div>

              <div className="mcf-menu-modal-cta-box">
                <p>Pre-order your food to avoid waiting!</p>
                <div className="mcf-menu-modal-cta-buttons">
                  <a href={`https://wa.me/${PHONE_NUMBER}?text=Hi%20Meraki%20Cafe!%20%0A%0AI%20would%20like%20to%20pre-order...`} target="_blank" rel="noopener noreferrer" className="mcf-btn-whatsapp">
                    <FaWhatsapp size={18} /> WhatsApp
                  </a>
                  <a href={`tel:+${PHONE_NUMBER}`} className="mcf-btn-call">
                    <FiPhone size={18} /> Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CafePage;