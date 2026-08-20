import React, { useState, useEffect } from 'react';
import './Review.css';

const REVIEW_DATA = [
  {
    id: 1,
    name: 'Rajesh Khanna',
    date: '2 weeks ago',
    text: 'The stay at Meraki Living was just like staying at home, but with a luxury mountain twist. Waking up to the view of the Himalayas with a hot cup of tea was the highlight of our trip.'
  },
  {
    id: 2,
    name: 'Sunita Reddy',
    date: '1 month ago',
    text: 'Honestly, the best cafe experience in the mountains. The Kumaoni thali was so authentic, just like how my grandmother used to make it. Very polite staff and great atmosphere.'
  },
  {
    id: 3,
    name: 'Vikram Malhotra',
    date: '3 months ago',
    text: 'Perfect place for a weekend getaway. The property is very well-maintained, and the outdoor seating at the cafe is just perfect for evening conversations. Will surely be back.'
  },
  {
    id: 4,
    name: 'Anjali Deshmukh',
    date: '4 months ago',
    text: "Everything about this place is so aesthetic. The rooms were super clean and the staff made sure we felt comfortable. It's the perfect spot to disconnect and relax."
  },
  {
    id: 5,
    name: 'Sanjay Gupta',
    date: '5 months ago',
    text: 'Great hospitality and amazing food quality. I visited with my family and everyone loved the multi-cuisine options at the cafe. Highly recommend this place for a peaceful vacation.'
  },
  {
    id: 6,
    name: 'Deepa Narayan',
    date: '6 months ago',
    text: 'The staff was very helpful and the property is genuinely peaceful. We had a lovely time exploring the nearby trails and coming back to a cozy room. A true gem.'
  }
];

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const Review = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % REVIEW_DATA.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const getPositionClass = (index) => {
    const length = REVIEW_DATA.length;
    let dist = (index - activeIndex + length) % length;
    
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

  const activeReview = REVIEW_DATA[activeIndex];

  return (
    <section className="premium-review-section">
      <div className="review-container">
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
              {[...Array(5)].map((_, i) => (
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

            {REVIEW_DATA.map((review, index) => (
              <div 
                key={review.id} 
                className={`avatar-item ${getPositionClass(index)}`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="avatar-circle">
                  {getInitials(review.name)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;