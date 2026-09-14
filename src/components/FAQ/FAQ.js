import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What makes our homestay the perfect place for a relaxing stay?",
      answer: "Our homestay offers a peaceful and comfortable environment where you can unwind, enjoy a welcoming atmosphere, and make the most of your time away from home. With thoughtfully designed rooms, convenient amenities, and an on-site café, we aim to make every stay relaxing, comfortable, and memorable."
    },
    {
      question: "What types of rooms are available at our homestay?",
      answer: "We offer a selection of comfortable rooms designed to suit different guest preferences and travel needs. You can explore our available room options, view their features, check occupancy details, and choose the room that best fits your stay."
    },
    {
      question: "What amenities and facilities can guests enjoy during their stay?",
      answer: "Our homestay provides a range of amenities designed to make your stay convenient and comfortable. The facilities available may vary by room, so we recommend checking the individual room details to learn more about the amenities included with your booking."
    },
    {
      question: "Does our homestay have an on-site café?",
      answer: "Yes, our homestay features an on-site café where guests can take a break, enjoy a refreshing beverage, and spend quality time in a welcoming setting. It is a convenient place to relax and enjoy a pleasant café experience during your stay."
    },
    {
      question: "What food and beverages are available at the café?",
      answer: "Our café offers a variety of delicious options, including authentic Kumaoni cuisine and other delightful food and beverages. From traditional local flavors to refreshing drinks and more, there is something for everyone to enjoy. Explore our Café page to discover the complete menu and learn more about the food and beverages we offer."
    },
    {
      question: "Can guests enjoy a meal or coffee at the café without staying overnight?",
      answer: "Absolutely! You can visit our café and enjoy delicious food, refreshing beverages, and a relaxing atmosphere without booking a room at our homestay. Our café welcomes guests who simply want to enjoy a delightful dining experience."
    },
    {
      question: "How can I check room availability and pricing for my preferred dates?",
      answer: "Simply select your preferred check-in and check-out dates, enter the number of guests, and search for available rooms. You can then compare the available options and view their current pricing before choosing the room that suits your requirements."
    },
    {
      question: "What is the process for booking a room at our homestay?",
      answer: "Booking your stay is simple. Choose your preferred room, select your travel dates, provide the required guest information, and review your reservation details. Once you complete the booking process, you can access your reservation information and prepare for your stay."
    },
    {
      question: "Is our homestay suitable for couples, families, and solo travelers?",
      answer: "Our homestay welcomes guests with different travel preferences and needs. Whether you are planning a peaceful getaway for two, a family trip, or a solo escape, you can explore our room options and select an accommodation that matches your group size and requirements."
    },
    {
      question: "What should I know before planning my stay at the homestay?",
      answer: "Before booking, we recommend reviewing the room amenities, occupancy details, pricing, check-in and check-out information, and applicable booking policies. You can also explore our café and other available facilities to plan a comfortable and enjoyable stay."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section" aria-label="Frequently Asked Questions">
      <header className="faq-header">
        <h2 className="faq-title">Everything You Need to Know</h2>
        <p className="faq-subtitle">
          Planning your stay at Meraki Living? Here are answers to the questions our guests ask most often before booking their mountain getaway.
        </p>
      </header>

      <div className="faq-container">
        <div className="faq-column">
          {faqs.slice(0, 5).map((faq, colIndex) => {
            const originalIndex = colIndex;
            return (
              <div
                key={originalIndex}
                className={`faq-item ${activeIndex === originalIndex ? 'active' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(originalIndex)}
                  aria-expanded={activeIndex === originalIndex}
                >
                  <h3>{faq.question}</h3>
                  <div className="faq-icon-wrapper">
                    <svg
                      className="faq-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </button>

                <div className="faq-answer-wrapper">
                  <div className="faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq-column">
          {faqs.slice(5, 10).map((faq, colIndex) => {
            const originalIndex = colIndex + 5;
            return (
              <div
                key={originalIndex}
                className={`faq-item ${activeIndex === originalIndex ? 'active' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(originalIndex)}
                  aria-expanded={activeIndex === originalIndex}
                >
                  <h3>{faq.question}</h3>
                  <div className="faq-icon-wrapper">
                    <svg
                      className="faq-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </button>

                <div className="faq-answer-wrapper">
                  <div className="faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;