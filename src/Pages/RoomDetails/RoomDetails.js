import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft02Icon,
  ArrowRight02Icon
} from '@hugeicons/core-free-icons';
import './RoomDetails.css';

import room1 from '../../assets/images/room-1.webp';
import room2 from '../../assets/images/room-2.webp';
import room3 from '../../assets/images/room-3.webp';
import room4 from '../../assets/images/room-4.webp';

const SHARED_POLICY = [
  'Free cancellation up to 7 days before check-in',
  '100% refund for eligible cancellations',
  'Check-in: 12:00 PM',
  'Check-out: 11:00 AM'
];

const SHARED_GUIDELINES = [
  'No smoking inside the cottages',
  'Pets allowed with prior approval',
  'Valid ID required at check-in'
];

const ROOMS_DATA = [
  {
    id: 1,
    image: room1,
    title: 'Himalayan View Room',
    desc: 'Wake up to peaceful mountain views and a relaxing stay surrounded by nature. Designed for comfort and tranquility, our Himalayan View Room offers a perfect blend of warm interiors and breathtaking mountain views. Ideal for couples and solo travelers looking for a peaceful mountain escape.',
    originalPrice: '5,000',
    price: '3,500',
    discount: '30',
    guests: '2 Guests',
    bed: '1 King Bed',
    view: 'Mountain View',
    size: '220 sq ft',
    rating: '4.9',
    reviews: '120',
    amenities: [
      'Free WiFi', 'Electric Kettle', 'Hair Dryer', 'Room Heater',
      'Complimentary Toiletries', 'Daily Housekeeping', 'Hot Water',
      'Work Desk', 'Wardrobe', 'Mirror'
    ],
    highlights: [
      'Private balcony with mountain views',
      'Cozy sitting area',
      'Work desk with lamp and seating',
      'Heater',
      'Wardrobe space'
    ],
    reviewBreakdown: [
      { label: 'Cleanliness', score: '4.9' },
      { label: 'Location', score: '4.9' },
      { label: 'Service', score: '4.8' },
      { label: 'Value for Money', score: '4.8' }
    ],
    reviewsList: [
      { name: 'Ananya S.', rating: 5, date: 'Jun 2025', text: 'Absolutely loved the view from the balcony. The room was spotless and the staff was very helpful.' },
      { name: 'Rahul K.', rating: 5, date: 'May 2025', text: 'Perfect getaway spot. Cozy room with amazing mountain views. Will definitely come back!' },
      { name: 'Priya M.', rating: 4, date: 'Apr 2025', text: 'Great experience overall. The heater was a lifesaver in the cold weather.' }
    ]
  },
  {
    id: 2,
    image: room2,
    title: 'Premium Valley Room',
    desc: 'Wake up to breathtaking valley views with elegant comfort and peaceful Himalayan charm. Our Premium Valley Room offers a serene retreat with premium furnishings, panoramic valley vistas, and all modern amenities for a luxurious mountain stay.',
    originalPrice: '6,500',
    price: '4,500',
    discount: '30',
    guests: '2 Guests',
    bed: 'Queen Bed',
    view: 'Private Sitting Area',
    size: '320 sq ft',
    rating: '4.8',
    reviews: '95',
    amenities: [
      'Free WiFi', 'Electric Kettle', 'Hair Dryer', 'Balcony',
      'Complimentary Toiletries', 'Daily Housekeeping', 'Hot Water',
      'Work Desk', 'Wardrobe', 'Mirror', 'Room Service'
    ],
    highlights: [
      'Private balcony with valley views',
      'Cozy sitting area with armchairs',
      'Premium bedding and linens',
      'Balcony access',
      'Spacious wardrobe'
    ],
    reviewBreakdown: [
      { label: 'Cleanliness', score: '4.9' },
      { label: 'Location', score: '4.8' },
      { label: 'Service', score: '4.8' },
      { label: 'Value for Money', score: '4.7' }
    ],
    reviewsList: [
      { name: 'Vikram R.', rating: 5, date: 'Jun 2025', text: 'The valley view from this room is unreal. Premium quality stay with excellent service.' },
      { name: 'Sneha P.', rating: 5, date: 'May 2025', text: 'Loved the private sitting area. Perfect for morning tea with a view.' },
      { name: 'Amit T.', rating: 4, date: 'Apr 2025', text: 'Spacious room with great amenities. The balcony was the highlight.' }
    ]
  },
  {
    id: 3,
    image: room3,
    title: 'Luxury Family Suite',
    desc: 'A spacious stay experience crafted for families and unforgettable mountain moments. Our Luxury Family Suite offers ample space, premium comfort, and all the amenities needed for a memorable family vacation in the Himalayas.',
    originalPrice: '8,000',
    price: '6,000',
    discount: '25',
    guests: '4 Guests',
    bed: 'Premium Room',
    view: 'Extra Space',
    size: '450 sq ft',
    rating: '4.9',
    reviews: '78',
    amenities: [
      'Free WiFi', 'Electric Kettle', 'Hair Dryer', 'Kitchenette',
      'Complimentary Toiletries', 'Daily Housekeeping', 'Hot Water',
      'Work Desk', 'Wardrobe', 'Mirror', 'Room Service', 'Extra Bed'
    ],
    highlights: [
      'Spacious living area for family',
      'Kitchenette with basic amenities',
      'Extra bed available on request',
      'Large wardrobe space',
      'Family-friendly layout'
    ],
    reviewBreakdown: [
      { label: 'Cleanliness', score: '4.9' },
      { label: 'Location', score: '4.9' },
      { label: 'Service', score: '4.9' },
      { label: 'Value for Money', score: '4.8' }
    ],
    reviewsList: [
      { name: 'Meera J.', rating: 5, date: 'Jun 2025', text: 'Perfect for our family of 4. The kitchenette was super helpful with kids.' },
      { name: 'Rajesh K.', rating: 5, date: 'May 2025', text: 'Spacious, clean, and comfortable. Our kids loved the extra space.' },
      { name: 'Divya S.', rating: 5, date: 'Apr 2025', text: 'Best family stay in the mountains. Highly recommend for families.' }
    ]
  },
  {
    id: 4,
    image: room4,
    title: 'Entire Homestay',
    desc: 'Book the entire Meraki Living homestay for complete privacy and a memorable stay with your loved ones. Perfect for large groups, family gatherings, or special occasions with exclusive access to all amenities and spaces.',
    originalPrice: '30,000',
    price: '22,000',
    discount: '26',
    guests: '8+ Guests',
    bed: 'Multiple Rooms',
    view: 'Panoramic View',
    size: '1200 sq ft',
    rating: '5.0',
    reviews: '45',
    amenities: [
      'Free WiFi', 'Electric Kettle', 'Hair Dryer', 'Kitchen',
      'Complimentary Toiletries', 'Daily Housekeeping', 'Hot Water',
      'Work Desk', 'Wardrobe', 'Mirror', 'Room Service', 'Parking',
      'Garden Access', 'Bonfire Area'
    ],
    highlights: [
      'Exclusive access to entire property',
      'Full kitchen with dining area',
      'Private garden and bonfire area',
      'Multiple bedrooms with attached baths',
      'Perfect for groups and events'
    ],
    reviewBreakdown: [
      { label: 'Cleanliness', score: '5.0' },
      { label: 'Location', score: '4.9' },
      { label: 'Service', score: '5.0' },
      { label: 'Value for Money', score: '4.9' }
    ],
    reviewsList: [
      { name: 'Arjun M.', rating: 5, date: 'Jun 2025', text: 'We booked the entire place for a family reunion. It was absolutely perfect!' },
      { name: 'Neha R.', rating: 5, date: 'May 2025', text: 'The private bonfire area was magical. Best experience for our group of 10.' },
      { name: 'Karan S.', rating: 5, date: 'Apr 2025', text: 'Exclusive privacy with all amenities. Felt like our own mountain home.' }
    ]
  }
];

const SvgIcon = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {children}
  </svg>
);

const MapPinIcon = ({ size }) => (
  <SvgIcon size={size}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </SvgIcon>
);

const CheckIcon = ({ size }) => (
  <SvgIcon size={size}>
    <path d="M20 6L9 17l-5-5"/>
  </SvgIcon>
);

const InfoIcon = ({ size }) => (
  <SvgIcon size={size}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 8v4M12 16h.01"/>
  </SvgIcon>
);

const ShieldIcon = ({ size }) => (
  <SvgIcon size={size}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </SvgIcon>
);

const MailIcon = ({ size }) => (
  <SvgIcon size={size}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </SvgIcon>
);

const HeadsetIcon = ({ size }) => (
  <SvgIcon size={size}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </SvgIcon>
);

const ArrowRightIcon = ({ size }) => (
  <SvgIcon size={size}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </SvgIcon>
);

const CancelCircleIcon = ({ size }) => (
  <SvgIcon size={size}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M15 9l-6 6M9 9l6 6"/>
  </SvgIcon>
);

const BedIcon = ({ size }) => (
  <SvgIcon size={size}>
    <path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1"/>
    <path d="M4 18l-1-3h18l-1 3"/>
    <path d="M11 12h7"/>
    <path d="M11 12V8h4"/>
  </SvgIcon>
);

const SquareIcon = ({ size }) => (
  <SvgIcon size={size}>
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18"/>
    <path d="M9 21V9"/>
  </SvgIcon>
);

const UsersIcon = ({ size }) => (
  <SvgIcon size={size}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </SvgIcon>
);

const EyeIcon = ({ size }) => (
  <SvgIcon size={size}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </SvgIcon>
);

function RoomDetails({ setCurrentPage, selectedRoomId }) {
  const room = ROOMS_DATA.find((r) => r.id === selectedRoomId) || ROOMS_DATA[0];
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayedAmenities = showAllAmenities ? room.amenities : room.amenities.slice(0, 6);
  const displayedReviews = showAllReviews ? room.reviewsList : room.reviewsList.slice(0, 2);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedRoomId]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="rd-star rd-star-full">&#9733;</span>);
      } else if (i === fullStars && hasHalf) {
        stars.push(<span key={i} className="rd-star rd-star-half">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="rd-star rd-star-empty">&#9733;</span>);
      }
    }
    return stars;
  };

  const handleBookNow = () => {
    if (setCurrentPage) {
      setCurrentPage('booking');
    }
  };

  return (
    <section className="room-details-section">
      <div className="room-details-container">

        <div className="rd-nav">
          <button className="rd-back-btn" onClick={() => setCurrentPage && setCurrentPage('home')}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="rd-main-grid">

          <div className="rd-left-col">

            <div className="rd-gallery-desktop">
              <div className="rd-gallery-main">
                <img src={room.image} alt={room.title} />
              </div>
              <div className="rd-gallery-side">
                <div className="rd-gallery-side-top">
                  <img src={room.image} alt={`${room.title} 2`} />
                </div>
                <div className="rd-gallery-side-bottom">
                  <img src={room.image} alt={`${room.title} 3`} />
                  <div className="rd-gallery-overlay">
                    <span>See All Photos</span>
                    <ArrowRightIcon size={14} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rd-gallery-mobile">
              <div className="rd-gallery-mobile-main">
                <img src={room.image} alt={room.title} />
              </div>
            </div>

            <h1 className="rd-title">{room.title}</h1>
            <div className="rd-rating-row">
              <div className="rd-rating-stars">{renderStars(parseFloat(room.rating))}</div>
              <span className="rd-rating-score">{room.rating}</span>
              <span className="rd-rating-text">Exceptional</span>
              <span className="rd-rating-dot">&#8226;</span>
              <span className="rd-rating-count">{room.reviews} Ratings</span>
            </div>

            <div className="rd-address">
              <MapPinIcon size={16} />
              <span>Meraki Living, Bhimtal, Uttarakhand</span>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="rd-view-map">
                View on Google map
              </a>
            </div>

            <div className="rd-divider"></div>

            <div className="rd-section">
              <h2 className="rd-section-title">About This Room</h2>
              <p className="rd-section-text">{room.desc}</p>
            </div>

            <div className="rd-section">
              <h2 className="rd-section-title">Amenities</h2>
              <div className="rd-amenities-grid">
                {displayedAmenities.map((amenity, idx) => (
                  <div className="rd-amenity-item" key={idx}>
                    <CheckIcon size={18} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              {room.amenities.length > 6 && (
                <button className="rd-show-more" onClick={() => setShowAllAmenities(!showAllAmenities)}>
                  {showAllAmenities ? 'Show Less' : 'Show All Amenities'}
                </button>
              )}
            </div>

            <div className="rd-section">
              <h2 className="rd-section-title">Guest Reviews</h2>
              <div className="rd-reviews-summary">
                <div className="rd-reviews-big">
                  <span className="rd-reviews-score">{room.rating}</span>
                  <div className="rd-reviews-stars">{renderStars(parseFloat(room.rating))}</div>
                  <span className="rd-reviews-total">Based on {room.reviews} reviews</span>
                </div>
                <div className="rd-reviews-breakdown">
                  {room.reviewBreakdown.map((item, idx) => (
                    <div className="rd-review-bar" key={idx}>
                      <span className="rd-review-bar-label">{item.label}</span>
                      <div className="rd-review-bar-track">
                        <div className="rd-review-bar-fill" style={{ width: `${(parseFloat(item.score) / 5) * 100}%` }}></div>
                      </div>
                      <span className="rd-review-bar-score">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rd-reviews-list">
                {displayedReviews.map((review, idx) => (
                  <div className="rd-review-card" key={idx}>
                    <div className="rd-review-header">
                      <div className="rd-review-avatar">{review.name.charAt(0)}</div>
                      <div className="rd-review-info">
                        <span className="rd-review-name">{review.name}</span>
                        <span className="rd-review-date">{review.date}</span>
                      </div>
                      <div className="rd-review-stars-small">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="rd-review-text">{review.text}</p>
                  </div>
                ))}
              </div>
              {room.reviewsList.length > 2 && (
                <button className="rd-show-more" onClick={() => setShowAllReviews(!showAllReviews)}>
                  {showAllReviews ? 'Show Less' : `Show All ${room.reviews} Reviews`}
                </button>
              )}
            </div>

            <div className="rd-section">
              <h2 className="rd-section-title">Stay Guidelines</h2>
              <div className="rd-important-grid">
                {SHARED_GUIDELINES.map((item, idx) => (
                  <div className="rd-important-item" key={idx}>
                    <InfoIcon size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rd-trust-badges">
              <div className="rd-trust-item">
                <ShieldIcon size={22} />
                <div>
                  <span className="rd-trust-title">Secure Payment</span>
                  <span className="rd-trust-desc">All transactions are safe and encrypted.</span>
                </div>
              </div>
              <div className="rd-trust-item">
                <CheckIcon size={22} />
                <div>
                  <span className="rd-trust-title">Instant Confirmation</span>
                  <span className="rd-trust-desc">Receive booking confirmation immediately.</span>
                </div>
              </div>
              <div className="rd-trust-item">
                <MailIcon size={22} />
                <div>
                  <span className="rd-trust-title">Email Confirmation</span>
                  <span className="rd-trust-desc">Booking details sent to your email.</span>
                </div>
              </div>
              <div className="rd-trust-item">
                <HeadsetIcon size={22} />
                <div>
                  <span className="rd-trust-title">24/7 Customer Support</span>
                  <span className="rd-trust-desc">We are here to help you anytime.</span>
                </div>
              </div>
            </div>

            <div className="rd-section rd-overview-desktop">
              <h2 className="rd-section-title">Room Overview</h2>
              <div className="rd-overview-list">
                <div className="rd-overview-item">
                  <BedIcon size={18} />
                  <span className="rd-overview-label">Room Type</span>
                  <span className="rd-overview-value">{room.title}</span>
                </div>
                <div className="rd-overview-item">
                  <UsersIcon size={18} />
                  <span className="rd-overview-label">Guests</span>
                  <span className="rd-overview-value">{room.guests}</span>
                </div>
                <div className="rd-overview-item">
                  <BedIcon size={18} />
                  <span className="rd-overview-label">Bed Type</span>
                  <span className="rd-overview-value">{room.bed}</span>
                </div>
                <div className="rd-overview-item">
                  <EyeIcon size={18} />
                  <span className="rd-overview-label">View</span>
                  <span className="rd-overview-value">{room.view}</span>
                </div>
                <div className="rd-overview-item">
                  <SquareIcon size={18} />
                  <span className="rd-overview-label">Room Size</span>
                  <span className="rd-overview-value">{room.size}</span>
                </div>
              </div>
            </div>

            <div className="rd-section rd-policy-desktop">
              <h2 className="rd-section-title">Cancellation Policy</h2>
              {SHARED_POLICY.map((item, idx) => (
                <div className="rd-policy-item" key={idx}>
                  <CheckIcon size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="rd-section rd-guarantee-desktop">
              <div className="rd-guarantee-card">
                <ShieldIcon size={28} />
                <div>
                  <h4>Best Price Guarantee</h4>
                  <p>Get the best rates when you book directly with us. No hidden charges.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rd-right-col">
            <div className="rd-sidebar">

              <div className="rd-book-card">
                <div className="rd-book-price-row">
                  <div className="rd-book-price-current">
                    <span className="rd-book-currency">Rs.</span>
                    <span className="rd-book-amount">{room.price}</span>
                  </div>
                  <div className="rd-book-price-old">
                    <span className="rd-book-original">Rs. {room.originalPrice}</span>
                    <span className="rd-book-discount">{room.discount}% OFF</span>
                  </div>
                </div>
                <p className="rd-book-tax">+ taxes per night</p>
                <button className="rd-book-btn" onClick={handleBookNow}>
                  <span>Check Availability</span>
                  <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
                </button>
                <div className="rd-book-trust">
                  <div className="rd-book-trust-item">
                    <CheckIcon size={14} />
                    <span>Instant Confirmation</span>
                  </div>
                  <div className="rd-book-trust-item">
                    <ShieldIcon size={14} />
                    <span>Secure Booking</span>
                  </div>
                </div>
              </div>

              <div className="rd-sidebar-section rd-overview-mobile">
                <h3 className="rd-sidebar-title">Room Overview</h3>
                <div className="rd-overview-list">
                  <div className="rd-overview-item">
                    <BedIcon size={18} />
                    <span className="rd-overview-label">Room Type</span>
                    <span className="rd-overview-value">{room.title}</span>
                  </div>
                  <div className="rd-overview-item">
                    <UsersIcon size={18} />
                    <span className="rd-overview-label">Guests</span>
                    <span className="rd-overview-value">{room.guests}</span>
                  </div>
                  <div className="rd-overview-item">
                    <BedIcon size={18} />
                    <span className="rd-overview-label">Bed Type</span>
                    <span className="rd-overview-value">{room.bed}</span>
                  </div>
                  <div className="rd-overview-item">
                    <EyeIcon size={18} />
                    <span className="rd-overview-label">View</span>
                    <span className="rd-overview-value">{room.view}</span>
                  </div>
                  <div className="rd-overview-item">
                    <SquareIcon size={18} />
                    <span className="rd-overview-label">Room Size</span>
                    <span className="rd-overview-value">{room.size}</span>
                  </div>
                </div>
              </div>

              <div className="rd-sidebar-section rd-sidebar-highlight">
                <div className="rd-sidebar-icon">
                  <MapPinIcon size={20} />
                </div>
                <h4 className="rd-sidebar-subtitle">Peaceful Mountain Stay</h4>
                <p className="rd-sidebar-text">Surrounded by nature, wake up to views, fresh air, and a truly relaxing mountain experience.</p>
              </div>

              <div className="rd-sidebar-section rd-sidebar-highlight rd-policy-mobile">
                <div className="rd-sidebar-icon">
                  <CancelCircleIcon size={20} />
                </div>
                <h4 className="rd-sidebar-subtitle">Cancellation Policy</h4>
                {SHARED_POLICY.map((item, idx) => (
                  <div className="rd-policy-item" key={idx}>
                    <CheckIcon size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="rd-sidebar-section rd-sidebar-highlight rd-guarantee-mobile">
                <div className="rd-sidebar-icon">
                  <ShieldIcon size={20} />
                </div>
                <h4 className="rd-sidebar-subtitle">Best Price Guarantee</h4>
                <p className="rd-sidebar-text">Get the best rates when you book directly with us. No hidden charges.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    

        <div className="rd-sticky-footer">
          <div className="rd-sticky-price">
            <div className="rd-sticky-price-current">
              <span className="rd-sticky-currency">Rs.</span>
              <span className="rd-sticky-amount">{room.price}</span>
            </div>
            <div className="rd-sticky-price-old">
              <span className="rd-sticky-original">Rs. {room.originalPrice}</span>
              <span className="rd-sticky-discount">{room.discount}% OFF</span>
            </div>
          </div>
          <button className="rd-sticky-btn" onClick={handleBookNow}>
            <span>Check Availability</span>
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
          </button>
        </div>

    </section>
  );
}

export default RoomDetails;