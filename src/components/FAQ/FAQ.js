import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What are the check-in and check-out timings?",
      answer: "Our standard check-in time is 2:00 PM, and check-out is 11:00 AM. If you need an early check-in or a late check-out, simply let us know in advance, and we'll do our best to accommodate your request based on availability."
    },
    {
      question: "Is breakfast included with the stay?",
      answer: "Yes. A freshly prepared complimentary breakfast is included with your stay, featuring a selection of delicious local and classic favorites to start your day."
    },
    {
      question: "Does Meraki Living have its own cafe?",
      answer: "Absolutely. The Meraki Mountain Cafe serves handcrafted beverages, authentic Kumaoni specialties, and freshly prepared meals in a peaceful mountain setting with beautiful Himalayan views."
    },
    {
      question: "Is parking available at the property?",
      answer: "Yes. Complimentary on-site parking is available for all guests, providing a safe and convenient experience throughout your stay."
    },
    {
      question: "Which attractions are close to Meraki Living?",
      answer: "Meraki Living is conveniently located near popular destinations including Mukteshwar Temple, Chauli Ki Jali, Kainchi Dham, Bhalu Gaad Waterfall, and several scenic viewpoints, making it an ideal base for exploring the region."
    },
    {
      question: "Is Wi-Fi available throughout the property?",
      answer: "Yes. High-speed Wi-Fi is available throughout the property, allowing you to stay connected whether you're working remotely or simply sharing your mountain moments."
    },
    {
      question: "Can families and couples stay at Meraki Living?",
      answer: "Absolutely. Meraki Living is thoughtfully designed for couples, families, solo travelers, and small groups seeking a peaceful and comfortable mountain retreat."
    },
    {
      question: "How can I book my stay?",
      answer: "You can book your stay directly through our website or contact us via phone or WhatsApp. Our team will be happy to help you choose the perfect room and assist with your reservation."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" aria-label="Frequently Asked Questions">
      <header className="faq-header">
        <h2 className="faq-title">Everything You Need to Know</h2>
        <p className="faq-subtitle">
          Planning your stay at Meraki Living? Here are answers to the questions our guests ask most often before booking their mountain getaway.
        </p>
      </header>

      <div className="faq-container">
        <div className="faq-column">
          {faqs.filter((_, i) => i % 2 === 0).map((faq, colIndex) => {
            const originalIndex = colIndex * 2;
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
          {faqs.filter((_, i) => i % 2 === 1).map((faq, colIndex) => {
            const originalIndex = colIndex * 2 + 1;
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