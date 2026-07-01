import React from 'react';
import './Review.css';

const reviewData = [
  {
    id: 1,
    name: "Rajesh Khanna",
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    text: "The stay at Meraki Living was just like staying at home, but with a luxury mountain twist. Waking up to the view of the Himalayas with a hot cup of tea was the highlight of our trip."
  },
  {
    id: 2,
    name: "Sunita Reddy",
    date: "1 month ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    text: "Honestly, the best cafe experience in the mountains. The Kumaoni thali was so authentic, just like how my grandmother used to make it. Very polite staff and great atmosphere."
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    date: "3 months ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    text: "Perfect place for a weekend getaway. The property is very well-maintained, and the outdoor seating at the cafe is just perfect for evening conversations. Will surely be back."
  },
  {
    id: 4,
    name: "Anjali Deshmukh",
    date: "4 months ago",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    text: "Everything about this place is so aesthetic. The rooms were super clean and the staff made sure we felt comfortable. It's the perfect spot to disconnect and relax."
  },
  {
    id: 5,
    name: "Sanjay Gupta",
    date: "5 months ago",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    text: "Great hospitality and amazing food quality. I visited with my family and everyone loved the multi-cuisine options at the cafe. Highly recommend this place for a peaceful vacation."
  },
  {
    id: 6,
    name: "Deepa Narayan",
    date: "6 months ago",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    text: "The staff was very helpful and the property is genuinely peaceful. We had a lovely time exploring the nearby trails and coming back to a cozy room. A true gem."
  }
];

const Review = () => {
  return (
    <section className="review-section">
      <div className="review-header">
        <h2 className="review-title">
          What Our Guests <span className="review-highlight">Say</span>
        </h2>
        <p className="review-subtitle">
          Read through genuine experiences shared by our wonderful guests on Google.
        </p>
      </div>

      <div className="review-grid">
        {reviewData.map((review, index) => (
          <div className="review-card" key={review.id} style={{ animationDelay: `${index * 0.15}s` }}>
            <div className="review-card-top">
              <div className="review-user">
                <div className="review-avatar">
                  <img src={review.avatar} alt={review.name} loading="lazy" />
                </div>
                <div className="review-user-info">
                  <h4 className="review-name">{review.name}</h4>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
            </div>
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" fill="#F79D00">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              ))}
            </div>
            <p className="review-text">"{review.text}"</p>
          </div>
        ))}
      </div>
      
      <div className="review-action">
  <a 
    href="https://share.google/sktujL0NMtIqfBX45" 
    className="review-btn" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <span className="btn-text">Read All Reviews on Google</span>
    <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  </a>
</div>
    </section>
  );
};

export default Review;