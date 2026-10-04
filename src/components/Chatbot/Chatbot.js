import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Chatbot.css';
import merakiIcon from '../../assets/images/meraki_icon.avif';
import { useRooms } from '../../hooks/useRooms';
import { ROOMS_DATA, parseRoomTitle } from '../Rooms/Rooms';
import { VIEWPOINTS_DATA } from '../Viewpoints/Viewpoints';
import { matchUserIntent } from './chatbotRules';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar01Icon,
  BedDoubleIcon,
  UserMultiple02Icon,
  MapPinIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Coffee02Icon,
  Wifi01Icon,
  Car01Icon,
  CheckmarkBadge01Icon,
  Search01Icon,
  SparklesIcon,
  UserIcon,
  Mail01Icon,
  CallIcon,
  File02Icon
} from '@hugeicons/core-free-icons';
import { FaWhatsapp } from 'react-icons/fa';
import { IoSend, IoChatbubbleEllipses } from 'react-icons/io5';
import { API_CONFIG_URL } from '../../config/api';
import { safeParseResponse } from '../../utils/apiHelper';
import OptimizedImage from '../Common/OptimizedImage';
const WHATSAPP_LINK = 'https://wa.me/919456103445?text=Hi%20Meraki%20Living!%20%0A%0AI%20need%20assistance%20with%20my%20stay.';
const MAPS_LINK = 'https://maps.app.goo.gl/kL6fpQpMUpJ4nMAr9?g_st=aw';

const BotAvatar = () => (
  <div className="cb-avatar" aria-hidden="true">
    <OptimizedImage src={merakiIcon} alt="Meraki Concierge" className="cb-avatar-img" width="40" height="40" loading="lazy" decoding="async" objectFit="contain" placeholderBg="transparent" noWrapper={true} />
  </div>
);

const Chatbot = ({ setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    try {
      return !!sessionStorage.getItem('meraki_chat_guest') || !!sessionStorage.getItem('meraki_chat_interacted');
    } catch {
      return false;
    }
  });
  
  // Guest Details State
  const [guestDetails, setGuestDetails] = useState(() => {
    try {
      const saved = sessionStorage.getItem('meraki_chat_guest');
      return saved ? JSON.parse(saved) : { id: null, name: '', email: '', phone: '' };
    } catch {
      return { id: null, name: '', email: '', phone: '' };
    }
  });

  const [guestFormSubmitted, setGuestFormSubmitted] = useState(() => {
    try {
      return !!sessionStorage.getItem('meraki_chat_guest');
    } catch {
      return false;
    }
  });

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSavingGuest, setIsSavingGuest] = useState(false);

  // Active Conversation ID & Message Synchronization
  const [conversationId] = useState(() => {
    try {
      const savedId = sessionStorage.getItem('meraki_chat_conv_id');
      if (savedId) return savedId;
      const newId = 'conv_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      sessionStorage.setItem('meraki_chat_conv_id', newId);
      return newId;
    } catch {
      return 'conv_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
    }
  });

  const unsavedQueueRef = useRef([]);
  const isSyncingRef = useRef(false);

  // Conversational Navifation & Context State
  const [history, setHistory] = useState(['home']);
  const { rooms } = useRooms(ROOMS_DATA);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [chatContext, setChatContext] = useState(null);
  const [activeBotMessage, setActiveBotMessage] = useState(null);

  // User input message state
  const [inputMessage, setInputMessage] = useState('');
  const [userQueryLog, setUserQueryLog] = useState([{ type: 'user', text: 'Hello' }]);

  // Manage booking lookup state
  const [searchVal, setSearchVal] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [foundBooking, setFoundBooking] = useState(null);

  // Refund Request Form State
  const [refundBookingId, setRefundBookingId] = useState('');
  const [refundName, setRefundName] = useState('');
  const [refundEmail, setRefundEmail] = useState('');
  const [refundPhone, setRefundPhone] = useState('');
  const [refundReason, setRefundReason] = useState('Cancellation within 7 days window');
  const [refundMessage, setRefundMessage] = useState('');
  const [refundErrors, setRefundErrors] = useState({});
  const [refundSubmitted, setRefundSubmitted] = useState(false);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [refundResponseData, setRefundResponseData] = useState(null);
  const [refundEmailSent, setRefundEmailSent] = useState(null);

  const messagesEndRef = useRef(null);

  // Initialize refund form with guest data when opened
  useEffect(() => {
    if (guestDetails.name && !refundName) setRefundName(guestDetails.name);
    if (guestDetails.email && !refundEmail) setRefundEmail(guestDetails.email);
    if (guestDetails.phone && !refundPhone) setRefundPhone(guestDetails.phone);
  }, [guestDetails, refundName, refundEmail, refundPhone]);

  // Safe background message synchronization with backend
  const syncConversationMessages = useCallback(async (newMsgs = []) => {
    if (Array.isArray(newMsgs) && newMsgs.length > 0) {
      unsavedQueueRef.current = [...unsavedQueueRef.current, ...newMsgs];
    }
    if (isSyncingRef.current || unsavedQueueRef.current.length === 0) return;

    isSyncingRef.current = true;
    const batchToSend = [...unsavedQueueRef.current];

    try {
      const payload = {
        action: 'save_messages',
        conversation_id: conversationId,
        guest_id: guestDetails?.id || null,
        guest_name: guestDetails?.name || null,
        guest_email: guestDetails?.email || null,
        guest_phone: guestDetails?.phone || null,
        messages: batchToSend
      };

      const res = await fetch(`${API_CONFIG_URL}/api_chatbot.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const parsed = await safeParseResponse(res);
        const data = parsed.data || {};
        if (data && data.status === 'success') {
          // Successfully committed batch, remove from pending queue
          unsavedQueueRef.current = unsavedQueueRef.current.slice(batchToSend.length);
        }
      }
    } catch {
      // Retain messages in unsavedQueueRef for retry on next message
    } finally {
      isSyncingRef.current = false;
      if (unsavedQueueRef.current.length > 0) {
        setTimeout(() => syncConversationMessages(), 1500);
      }
    }
  }, [conversationId, guestDetails]);

  // 1. Scroll-triggered appearance (hidden before scroll)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (window.scrollY > 120) {
      setIsVisible(true);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentView = history[history.length - 1];

  const getBotReplyForView = (view, label) => {
    switch (view) {
      case 'rooms':
        return 'Select what you would like to know about our stays:';
      case 'group-select':
        return 'How many guests will be staying with us? (Couples, Families, Large Groups)';
      case 'all-rooms':
        return 'Here are our current room options and starting rates for your mountain getaway.';
      case 'extra-charges':
        return 'Meraki Living Guest & Child Policy: Extra Adult ₹1,000/night, Extra Child ₹500/night, Under 5 Complimentary.';
      case 'policies':
        return 'Choose a topic to view details about your stay (Timings, Dining, Amenities, Cancellation).';
      case 'timings':
        return 'Check-in Time: 12:00 PM – 2:00 PM | Check-out Time: 11:00 AM.';
      case 'dining':
        return 'Fresh complimentary breakfast is included every morning, and handcrafted dishes at Meraki Mountain Cafe.';
      case 'amenities':
        return 'Free on-site parking, high-speed Wi-Fi across all suites, 24/7 power backup, and room heaters.';
      case 'cancellation':
        return '100% Refundable: Free cancellation up to 7 days before scheduled check-in date.';
      case 'refund-form':
        return 'Please provide your booking details to initiate refund verification against our 7-day policy.';
      case 'cancel-flow':
        return 'Bookings can be managed or cancelled through our Manage Booking portal in accordance with our 100% refund policy.';
      case 'refund-guidance':
      case 'refund-status-info':
        return 'Eligible cancellations are processed directly to original payment source within 5–7 business days.';
      case 'modify-booking-info':
        return 'Date modifications and room adjustments can be accommodated based on seasonal room availability.';
      case 'location':
        return 'Get directions or explore scenic viewpoints and attractions around Mukteshwar.';
      case 'reach':
        return 'Meraki Living is located at Peora, Mukteshwar, Uttarakhand (~75 km from Kathgodam Railway Station).';
      case 'sightseeing':
        return 'Top scenic places & viewpoints around Meraki Living (View of Himalayas, Mukteshwar Dham, Chauli Ki Jali, Bhalu Gaad Fall).';
      case 'manage-booking':
        return 'Enter your Booking ID or phone number to look up reservation status and details.';
      default:
        return label ? `Viewing ${label}` : 'How may I assist you further?';
    }
  };

  const navigateTo = (view, label = '') => {
    const timestamp = new Date().toISOString();
    const newMsgs = [];
    if (label) {
      setUserQueryLog((prev) => [...prev, { type: 'user', text: label }]);
      newMsgs.push({ sender: 'user', text: label, timestamp });
    }
    const botReplyText = getBotReplyForView(view, label);
    if (botReplyText) {
      newMsgs.push({ sender: 'bot', text: botReplyText, timestamp });
    }
    if (newMsgs.length > 0) {
      syncConversationMessages(newMsgs);
    }
    setActiveBotMessage(null);
    setHistory((prev) => [...prev, view]);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, prev.length - 1));
      setUserQueryLog((prev) => prev.slice(0, prev.length - 1));
      setActiveBotMessage(null);
    }
  };

  const resetChat = () => {
    const newId = 'conv_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
    try {
      sessionStorage.setItem('meraki_chat_conv_id', newId);
    } catch {}
    setHistory(['home']);
    setUserQueryLog([{ type: 'user', text: 'Hello' }]);
    setSelectedGroup(null);
    setActiveBotMessage(null);
    setChatContext(null);
    setSearchVal('');
    setSearchError('');
    setFoundBooking(null);
    setRefundSubmitted(false);
    setRefundResponseData(null);
    setRefundEmailSent(null);
  };

  // Action Button Behaviour: Close chatbot immediately before navigating to destination page
  const handleNavPage = (page, roomId = null, scrollToId = null) => {
    setIsOpen(false);
    if (setCurrentPage) {
      setCurrentPage(page, roomId, scrollToId);
    }
  };

  // Start conversation trigger from initial message
  const handleStartInteraction = (customText = 'Hello') => {
    setHasInteracted(true);
    try {
      sessionStorage.setItem('meraki_chat_interacted', 'true');
    } catch {}
    setUserQueryLog([{ type: 'user', text: customText }]);
    const now = new Date().toISOString();
    const initialBatch = [
      {
        sender: 'bot',
        text: 'Namaste & Welcome to Meraki Living, Mukteshwar. How may I assist your mountain getaway today?',
        timestamp: now
      },
      {
        sender: 'user',
        text: customText,
        timestamp: now
      },
      {
        sender: 'bot',
        text: 'To help our concierge assist you personally and provide tailored room, pricing, and stay details, please share your contact info:',
        timestamp: now
      }
    ];
    syncConversationMessages(initialBatch);
  };

  // 1. Rule-based conversational message submission
  const handleSendMessage = (e) => {
    e?.preventDefault();
    const trimmed = inputMessage.trim();
    const messageToSend = trimmed || (!hasInteracted ? 'Hello' : '');
    if (!messageToSend) return;

    if (!hasInteracted) {
      handleStartInteraction(messageToSend);
      setInputMessage('');
      return;
    }

    const timestamp = new Date().toISOString();
    const newMsgs = [{ sender: 'user', text: messageToSend, timestamp }];

    // Append user message to display log
    setUserQueryLog((prev) => [...prev, { type: 'user', text: messageToSend }]);

    // Execute rule-based intent matching
    const match = matchUserIntent(messageToSend, chatContext);

    if (match) {
      if (match.setContext) {
        setChatContext(match.setContext);
      } else {
        setChatContext(null);
      }

      if (match.groupParam) {
        setSelectedGroup(match.groupParam);
      }

      setActiveBotMessage({
        title: match.responseTitle,
        text: match.responseText,
        isFallback: !!match.isFallback,
        quickActions: match.quickActions || null
      });

      const fullBotText = (match.responseTitle ? match.responseTitle + ': ' : '') + match.responseText;
      newMsgs.push({ sender: 'bot', text: fullBotText, timestamp });

      if (match.view && match.view !== currentView) {
        setHistory((prev) => [...prev, match.view]);
      }
    } else {
      const fallbackText = "Thank you for asking. Our team is happy to assist you with any questions about stays, dining, or amenities.";
      newMsgs.push({ sender: 'bot', text: fallbackText, timestamp });
    }

    syncConversationMessages(newMsgs);
    setInputMessage('');
  };

  // Guest Information Form Submission Validation with Real Backend API
  const handleGuestFormSubmit = async (e) => {
    e.preventDefault();
    if (isSavingGuest) return;

    const errors = {};

    if (!formName.trim()) {
      errors.name = 'Please enter your name.';
    }

    if (!formEmail.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    const cleanPhone = formPhone.replace(/[^0-9+]/g, '');
    if (!cleanPhone) {
      errors.phone = 'Please enter your mobile number.';
    } else if (cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSavingGuest(true);

    const guestPayload = {
      action: 'save_guest',
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim()
    };

    try {
      const response = await fetch(`${API_CONFIG_URL}/api_chatbot.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestPayload)
      });

      const parsed = await safeParseResponse(response);
      const result = parsed.data;

      if (parsed.ok && result && result.status === 'success' && result.data) {
        const savedGuest = {
          id: result.data.id,
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone
        };

        setGuestDetails(savedGuest);
        setGuestFormSubmitted(true);

        try {
          sessionStorage.setItem('meraki_chat_guest', JSON.stringify(savedGuest));
          sessionStorage.setItem('meraki_chat_interacted', 'true');
        } catch {}

        // Log confirmation and sync conversation with guest details
        const now = new Date().toISOString();
        const welcomeBatch = [
          {
            sender: 'bot',
            text: `Welcome, ${savedGuest.name}! Please select an option or ask any question about your stay.`,
            timestamp: now
          }
        ];

        // Link conversation to saved guest ID on backend
        fetch(`${API_CONFIG_URL}/api_chatbot.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'start_conversation',
            conversation_id: conversationId,
            guest_id: savedGuest.id,
            guest_name: savedGuest.name,
            guest_email: savedGuest.email,
            guest_phone: savedGuest.phone,
            messages: welcomeBatch
          })
        }).catch(() => {});
      } else {
        setFormErrors({
          submit: result?.message || 'Unable to save your details. Please check your connection and try again.'
        });
      }
    } catch {
      setFormErrors({
        submit: 'Unable to connect to concierge server. Please try again in a moment.'
      });
    } finally {
      setIsSavingGuest(false);
    }
  };

  // 3. Refund Request Form Submission with Real Backend API
  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRefund) return;

    const errors = {};

    if (!refundBookingId.trim()) {
      errors.bookingId = 'Please enter your Booking ID (e.g. MERI0001).';
    }

    if (!refundName.trim()) {
      errors.name = 'Please enter your full name.';
    }

    if (!refundEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(refundEmail.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    const cleanPhone = refundPhone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid mobile number.';
    }

    if (Object.keys(errors).length > 0) {
      setRefundErrors(errors);
      return;
    }

    setRefundErrors({});
    setIsSubmittingRefund(true);

    const refundPayload = {
      action: 'save_refund',
      booking_id: refundBookingId.trim(),
      guest_name: refundName.trim(),
      guest_email: refundEmail.trim(),
      guest_phone: refundPhone.trim(),
      reason: refundReason,
      message: refundMessage.trim(),
      guest_id: guestDetails?.id || null,
      conversation_id: conversationId
    };

    try {
      const response = await fetch(`${API_CONFIG_URL}/api_chatbot.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refundPayload)
      });

      const parsed = await safeParseResponse(response);
      const result = parsed.data || {};

      if (parsed.ok && (result.status === 'success' || response.ok)) {
        setRefundResponseData(result.data || {});
        setRefundEmailSent(typeof result.email_sent === 'boolean' ? result.email_sent : true);
        setRefundSubmitted(true);

        const now = new Date().toISOString();
        const refundMsgs = [
          {
            sender: 'user',
            text: `Submitted Refund Request for Booking #${refundBookingId.trim().toUpperCase()} (${refundReason})`,
            timestamp: now
          },
          {
            sender: 'bot',
            text: result.message || 'Your refund request has been received and accepted for processing according to the applicable policy.',
            timestamp: now
          }
        ];
        syncConversationMessages(refundMsgs);
      } else {
        setRefundErrors({
          submit: result?.message || parsed.error || 'Unable to register refund request. Please verify your booking details and try again.'
        });
      }
    } catch {
      setRefundErrors({
        submit: 'Unable to reach the concierge verification server. Please try again shortly.'
      });
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  // Scroll to bottom when conversation advances
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [currentView, isOpen, hasInteracted, guestFormSubmitted, userQueryLog, selectedGroup, foundBooking, refundSubmitted]);

  // Booking Lookup Logic
  const handleBookingSearch = async (e) => {
    e?.preventDefault();
    const query = searchVal.trim();
    if (!query) {
      setSearchError('Please enter your Booking ID or Phone Number.');
      return;
    }

    setSearchLoading(true);
    setSearchError('');
    setFoundBooking(null);

    try {
      const [bookingsRes, paymentsRes] = await Promise.all([
        fetch(`${API_CONFIG_URL}/api_bookings.php`),
        fetch(`${API_CONFIG_URL}/api_payments.php`)
      ]);
      const parsedBookings = await safeParseResponse(bookingsRes);
      const parsedPayments = await safeParseResponse(paymentsRes);
      const bookingsJson = (parsedBookings.ok && parsedBookings.data) ? parsedBookings.data : { status: 'error', data: [] };
      const paymentsJson = (parsedPayments.ok && parsedPayments.data) ? parsedPayments.data : { status: 'error', data: [] };

      if (bookingsJson.status !== 'success' || !bookingsJson.data) {
        setSearchError('No booking found matching your details.');
        setSearchLoading(false);
        return;
      }

      const cleanQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
      const searchDigits = query.replace(/\D/g, '');

      let matched = null;
      for (const b of bookingsJson.data) {
        const formattedId = `meri${String(b.id).padStart(4, '0')}`;
        const refLower = (b.booking_reference || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const phoneDigits = (b.guest_phone || '').replace(/\D/g, '');
        const emailLower = (b.guest_email || '').toLowerCase();

        if (
          String(b.id) === query ||
          formattedId === cleanQuery ||
          refLower === cleanQuery ||
          emailLower === query.toLowerCase() ||
          (phoneDigits && searchDigits && phoneDigits.includes(searchDigits))
        ) {
          matched = b;
          break;
        }
      }

      if (matched) {
        const payment = (paymentsJson.data || []).find(
          (p) => p.booking_id === matched.id && (p.status === 'Success' || p.status === 'Completed')
        );
        setFoundBooking({
          ...matched,
          formattedId: matched.booking_reference || `MERI${String(matched.id).padStart(4, '0')}`,
          paid_amount: payment ? payment.amount : (matched.room_price || 0),
          payment_status: payment ? payment.status : (matched.status === 'Pending' ? 'Pending' : 'Paid')
        });
      } else {
        setSearchError('No active booking found. Please check your details.');
      }
    } catch (err) {
      setSearchError('Unable to connect to reservation server.');
    }
    setSearchLoading(false);
  };

  // Helper for rendering a spacious, premium room recommendation card
  const renderRoomCard = (room) => {
    const titleData = parseRoomTitle(room.title);
    return (
      <div className="cb-room-card" key={room.id}>
        <div className="cb-room-card-img-wrap">
          <OptimizedImage
            src={room.image}
            alt={titleData.mainName || room.title}
            width="280"
            height="180"
            loading="lazy"
            decoding="async"
            noWrapper={true}
          />
          {room.status && (
            <span className={`cb-room-status-badge ${room.status.toLowerCase() === 'booked' || room.status.toLowerCase() === 'not available' ? 'booked' : 'available'}`}>
              {room.status}
            </span>
          )}
        </div>
        <div className="cb-room-card-content">
          <div className="cb-room-card-title-row">
            <h4 className="cb-room-card-name">{titleData.mainName || room.title}</h4>
            {titleData.subtitle && <span className="cb-room-card-sub">{titleData.subtitle}</span>}
          </div>
          {titleData.roomType && <span className="cb-room-card-type">{titleData.roomType}</span>}

          <div className="cb-room-card-specs">
            <span><HugeiconsIcon icon={BedDoubleIcon} size={15} /> {room.bed || 'Comfort Stay'}</span>
            <span><HugeiconsIcon icon={UserMultiple02Icon} size={15} /> {room.guests || (room.id === 4 ? '14 Guests' : '2 Guests')}</span>
          </div>

          <div className="cb-room-card-footer">
            <div className="cb-room-card-price">
              <span className="cb-room-amount">&#8377;{room.price}</span>
              {room.originalPrice && <span className="cb-room-orig">&#8377;{room.originalPrice}</span>}
            </div>
            <div className="cb-room-card-actions">
              <button
                className="cb-btn-secondary"
                onClick={() => handleNavPage('room-details', room.id)}
              >
                View Details
              </button>
              <button
                className="cb-btn-primary"
                onClick={() => handleNavPage('booking')}
              >
                Book
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="meraki-chatbot-wrapper">
      {/* Floating Chat Trigger Area - Single Unified Circular Trigger */}
      <div className={`cb-floating-trigger-wrap ${isVisible || isOpen ? 'visible' : ''}`}>
        {/* Single Trigger Layout Container */}
        <div className="cb-floating-trigger-inner">
          {/* Waving Hand Indicator */}
          {!isOpen && (
            <div className="cb-trigger-arch-banner" role="status" aria-label="Welcome">
              {/* Waving Hand */}
              <span className="cb-arch-wave-hand" role="img" aria-label="wave">
                👋
              </span>
            </div>
          )}

          {/* Single Main Circular Chatbot Button */}
          <button
            className={`cb-floating-btn ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open Mountain Concierge"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <HugeiconsIcon icon={Cancel01Icon} size={22} />
            ) : (
              <>
                <IoChatbubbleEllipses className="cb-trigger-chat-icon" aria-hidden="true" />
                <span className="cb-notification-badge" aria-label="1 unread message">1</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Chatbot Panel */}
      {isOpen && (
        <div className="cb-panel-container">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-brand">
              <div className="cb-header-avatar">
                <OptimizedImage src={merakiIcon} alt="Meraki Host" className="cb-header-avatar-img" width="28" height="28" loading="eager" decoding="async" objectFit="contain" noWrapper={true} />
              </div>
              <div className="cb-header-info">
                <h3 className="cb-header-title">Meraki Mountain Assistant</h3>
                <span className="cb-header-status">
                  <span className="cb-status-dot"></span> Mountain Stay Host
                </span>
              </div>
            </div>
            <div className="cb-header-actions">
              {hasInteracted && guestFormSubmitted && history.length > 1 && (
                <button className="cb-header-btn" onClick={resetChat} title="Return to Main Menu">
                  Main Menu
                </button>
              )}
              <button
                className="cb-header-btn cb-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Assistant"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>
          </div>

          {/* Body Scroll Area */}
          <div className="cb-body" ref={messagesEndRef}>
            {/* Back Navigation Bar if inside a category */}
            {hasInteracted && guestFormSubmitted && history.length > 1 && (
              <div className="cb-nav-bar">
                <button className="cb-back-btn" onClick={goBack}>
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
                  <span>Back</span>
                </button>
              </div>
            )}

            {/* INITIAL WELCOME MESSAGE WITH BRAND AVATAR */}
            <div className="cb-bot-msg-row">
              <BotAvatar />
              <div className="cb-bot-content-col">
                <div className="cb-bubble cb-bubble-bot">
                  <p className="cb-greeting-bold">Namaste &amp; Welcome to Meraki Living Peora</p>
                  <p className="cb-greeting-sub">How can we help plan your mountain stay today</p>
                </div>
              </div>
            </div>

            {/* USER DETAILS FORM AFTER INITIAL HELLO / USER MESSAGE */}
            {hasInteracted && !guestFormSubmitted && (
              <div className="cb-view-container">
                <div className="cb-user-msg-row">
                  <div className="cb-bubble cb-bubble-user">
                    <span>{userQueryLog[0]?.text || 'Hello'}</span>
                  </div>
                </div>

                <div className="cb-bot-msg-row">
                  <BotAvatar />
                  <div className="cb-bot-content-col">
                    <div className="cb-bubble cb-bubble-bot">
                      <p>
                        Please share your contact details to get instant room options and stay help
                      </p>
                    </div>

                    {/* Guest Information Form */}
                    <div className="cb-guest-form-card">
                      <form onSubmit={handleGuestFormSubmit} className="cb-guest-form">
                        <div className="cb-form-group">
                          <div className="cb-form-input-wrap">
                            <HugeiconsIcon icon={UserIcon} size={16} className="cb-form-field-icon" />
                            <input
                              type="text"
                              className={`cb-form-input ${formErrors.name ? 'error' : ''}`}
                              placeholder="Full Name *"
                              value={formName}
                              onChange={(e) => {
                                setFormName(e.target.value);
                                if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
                              }}
                            />
                          </div>
                          {formErrors.name && <span className="cb-form-error">{formErrors.name}</span>}
                        </div>

                        <div className="cb-form-group">
                          <div className="cb-form-input-wrap">
                            <HugeiconsIcon icon={Mail01Icon} size={16} className="cb-form-field-icon" />
                            <input
                              type="email"
                              className={`cb-form-input ${formErrors.email ? 'error' : ''}`}
                              placeholder="Email Address *"
                              value={formEmail}
                              onChange={(e) => {
                                setFormEmail(e.target.value);
                                if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: '' }));
                              }}
                            />
                          </div>
                          {formErrors.email && <span className="cb-form-error">{formErrors.email}</span>}
                        </div>

                        <div className="cb-form-group">
                          <div className="cb-form-input-wrap">
                            <HugeiconsIcon icon={CallIcon} size={16} className="cb-form-field-icon" />
                            <input
                              type="tel"
                              className={`cb-form-input ${formErrors.phone ? 'error' : ''}`}
                              placeholder="Mobile Number *"
                              value={formPhone}
                              onChange={(e) => {
                                setFormPhone(e.target.value);
                                if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: '' }));
                              }}
                            />
                          </div>
                          {formErrors.phone && <span className="cb-form-error">{formErrors.phone}</span>}
                        </div>

                        {formErrors.submit && <div className="cb-form-error" style={{ marginBottom: '8px' }}>{formErrors.submit}</div>}

                        <button type="submit" className="cb-btn-primary cb-btn-block cb-form-submit-btn" disabled={isSavingGuest}>
                          <span>{isSavingGuest ? 'Saving Details...' : 'Continue'}</span>
                          {!isSavingGuest && <HugeiconsIcon icon={ArrowRight01Icon} size={15} />}
                        </button>
                      </form>

                      <div className="cb-form-privacy-note">
                        <HugeiconsIcon icon={CheckmarkBadge01Icon} size={13} className="cb-privacy-icon" />
                        <span>Your details are completely safe and used only to help you plan your stay</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AFTER FORM SUBMISSION: RULE-BASED CONVERSATIONAL FLOWS */}
            {hasInteracted && guestFormSubmitted && (
              <>
                {/* Dynamic Bot Message from Intent Matcher (if triggered by user query) */}
                {activeBotMessage && (
                  <div className="cb-bot-msg-row">
                    <BotAvatar />
                    <div className="cb-bot-content-col">
                      <div className="cb-bubble cb-bubble-bot">
                        {activeBotMessage.title && <strong>{activeBotMessage.title}</strong>}
                        <p>{activeBotMessage.text}</p>
                      </div>

                      {/* Optional Contextual Quick Action Buttons from Rule Matcher */}
                      {activeBotMessage.quickActions && (
                        <div className="cb-contextual-actions">
                          {activeBotMessage.quickActions.map((qa, idx) => (
                            <button
                              key={idx}
                              className="cb-pill-btn"
                              onClick={() => {
                                if (qa.nav) handleNavPage(qa.nav);
                                else if (qa.view) navigateTo(qa.view, qa.label);
                                else if (qa.type === 'whatsapp') window.open(WHATSAPP_LINK, '_blank');
                              }}
                            >
                              <span>{qa.label}</span>
                              <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="cb-pill-arrow" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 1. HOME SCREEN - APPROVED QUICK ACTIONS */}
                {currentView === 'home' && !activeBotMessage && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>{userQueryLog[userQueryLog.length - 1]?.text || 'Hello'}</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-bubble cb-bubble-bot">
                          <p>
                            {guestDetails.name ? `Welcome, ${guestDetails.name}! ` : 'Welcome! '}
                            Please select an option or type any question below:
                          </p>
                        </div>

                        <div className="cb-quick-actions-grid">
                          <button className="cb-action-card" onClick={() => navigateTo('rooms', 'Explore Rooms & Pricing')}>
                            <span className="cb-action-icon">
                              <HugeiconsIcon icon={BedDoubleIcon} size={18} />
                            </span>
                            <div className="cb-action-text">
                              <span className="cb-action-title">Explore Rooms &amp; Pricing</span>
                              <span className="cb-action-desc">Compare rooms capacities and rates</span>
                            </div>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={15} className="cb-action-arrow" />
                          </button>

                          <button className="cb-action-card" onClick={() => navigateTo('policies', 'Check-in, Amenities & Policies')}>
                            <span className="cb-action-icon">
                              <HugeiconsIcon icon={Clock01Icon} size={18} />
                            </span>
                            <div className="cb-action-text">
                              <span className="cb-action-title">Check-in Amenities &amp; Policies</span>
                              <span className="cb-action-desc">Timings breakfast Wi-Fi and refunds</span>
                            </div>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={15} className="cb-action-arrow" />
                          </button>

                          <button className="cb-action-card" onClick={() => navigateTo('dining', 'Meraki Mountain Café')}>
                            <span className="cb-action-icon">
                              <HugeiconsIcon icon={Coffee02Icon} size={18} />
                            </span>
                            <div className="cb-action-text">
                              <span className="cb-action-title">Meraki Mountain Café</span>
                              <span className="cb-action-desc">Explore food menu coffee and mountain ambience</span>
                            </div>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={15} className="cb-action-arrow" />
                          </button>

                          <button className="cb-action-card" onClick={() => navigateTo('location', 'Location & Nearby Sights')}>
                            <span className="cb-action-icon">
                              <HugeiconsIcon icon={MapPinIcon} size={18} />
                            </span>
                            <div className="cb-action-text">
                              <span className="cb-action-title">Location &amp; Nearby Sights</span>
                              <span className="cb-action-desc">How to reach and scenic viewpoints</span>
                            </div>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={15} className="cb-action-arrow" />
                          </button>

                          <button className="cb-action-card" onClick={() => navigateTo('manage-booking', 'Manage / Track My Booking')}>
                            <span className="cb-action-icon">
                              <HugeiconsIcon icon={Search01Icon} size={18} />
                            </span>
                            <div className="cb-action-text">
                              <span className="cb-action-title">Manage / Track My Booking</span>
                              <span className="cb-action-desc">Look up reservation status and details</span>
                            </div>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={15} className="cb-action-arrow" />
                          </button>
                        </div>

                        {/* WhatsApp Quick Host Touchpoint */}
                        <div className="cb-whatsapp-banner">
                          <div className="cb-whatsapp-text">
                            <strong>Need personalized help?</strong>
                            <span>Chat directly with our mountain host.</span>
                          </div>
                          <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cb-whatsapp-btn"
                          >
                            <FaWhatsapp size={15} />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ROOMS MENU */}
                {currentView === 'rooms' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Explore Rooms &amp; Pricing</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-bubble cb-bubble-bot">
                          <p>Select what you would like to know about our stays:</p>
                        </div>

                        <div className="cb-pill-options">
                          <button className="cb-pill-btn" onClick={() => navigateTo('group-select', 'Find best room for my group')}>
                            <HugeiconsIcon icon={UserMultiple02Icon} size={16} />
                            <span>Which room is best for my group?</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="cb-pill-arrow" />
                          </button>
                          <button className="cb-pill-btn" onClick={() => navigateTo('all-rooms', 'Check room prices')}>
                            <HugeiconsIcon icon={Calendar01Icon} size={16} />
                            <span>Check Room Availability &amp; Prices</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="cb-pill-arrow" />
                          </button>
                          <button className="cb-pill-btn" onClick={() => navigateTo('extra-charges', 'Extra guest charges')}>
                            <HugeiconsIcon icon={SparklesIcon} size={16} />
                            <span>Extra Guest &amp; Children Charges</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="cb-pill-arrow" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2A. GROUP SELECTION */}
                {currentView === 'group-select' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Find best room for my group</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-bubble cb-bubble-bot">
                          <p>How many guests will be staying with us?</p>
                        </div>

                        <div className="cb-group-selector-pills">
                          <button
                            className={`cb-group-pill ${selectedGroup === '2' ? 'active' : ''}`}
                            onClick={() => setSelectedGroup('2')}
                          >
                            2 Guests / Couple or Solo
                          </button>
                          <button
                            className={`cb-group-pill ${selectedGroup === '3-4' ? 'active' : ''}`}
                            onClick={() => setSelectedGroup('3-4')}
                          >
                            3–4 Guests / Small Family
                          </button>
                          <button
                            className={`cb-group-pill ${selectedGroup === '8-14' ? 'active' : ''}`}
                            onClick={() => setSelectedGroup('8-14')}
                          >
                            Large Group / Entire 3-BHK Villa (8–14 Guests)
                          </button>
                        </div>

                        {selectedGroup && (
                          <div className="cb-recommendations-wrap">
                            <div className="cb-bubble cb-bubble-bot">
                              <p>
                                {selectedGroup === '2' && 'Recommended suites for couples & solo travelers:'}
                                {selectedGroup === '3-4' && 'Recommended suite for families & small groups:'}
                                {selectedGroup === '8-14' && 'Private 3-Bedroom Himalayan Villa (Exclusive Stay):'}
                              </p>
                            </div>

                            <div className="cb-rooms-list">
                              {selectedGroup === '2' && (
                                <>
                                  {rooms.find((r) => r.id === 1) && renderRoomCard(rooms.find((r) => r.id === 1))}
                                  {rooms.find((r) => r.id === 2) && renderRoomCard(rooms.find((r) => r.id === 2))}
                                </>
                              )}
                              {selectedGroup === '3-4' && (
                                <>{rooms.find((r) => r.id === 3) && renderRoomCard(rooms.find((r) => r.id === 3))}</>
                              )}
                              {selectedGroup === '8-14' && (
                                <>{rooms.find((r) => r.id === 4) && renderRoomCard(rooms.find((r) => r.id === 4))}</>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2B. ALL ROOMS LIST */}
                {currentView === 'all-rooms' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Check room prices</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-bubble cb-bubble-bot">
                          <p>Here are our current room options and starting rates:</p>
                        </div>

                        <div className="cb-rooms-list">
                          {rooms.map((room) => renderRoomCard(room))}
                        </div>

                        <div className="cb-cta-box">
                          <p className="cb-cta-desc">Ready to reserve your stay for specific dates?</p>
                          <button
                            className="cb-btn-primary cb-btn-block"
                            onClick={() => handleNavPage('booking')}
                          >
                            <HugeiconsIcon icon={Calendar01Icon} size={15} />
                            <span>Select Dates &amp; Book</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2C. EXTRA CHARGES */}
                {currentView === 'extra-charges' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Extra guest charges</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-bubble cb-bubble-bot">
                          <p><strong>Meraki Living Guest &amp; Child Policy:</strong></p>
                        </div>

                        <div className="cb-info-card">
                          <div className="cb-info-row">
                            <div className="cb-info-label-group">
                              <HugeiconsIcon icon={UserMultiple02Icon} size={16} className="cb-info-icon" />
                              <span>Extra Adult (Age 13+)</span>
                            </div>
                            <span className="cb-info-value">&#8377;1,000 / night</span>
                          </div>
                          <div className="cb-info-row">
                            <div className="cb-info-label-group">
                              <HugeiconsIcon icon={UserMultiple02Icon} size={16} className="cb-info-icon" />
                              <span>Extra Child (Ages 6–12)</span>
                            </div>
                            <span className="cb-info-value">&#8377;500 / night</span>
                          </div>
                          <div className="cb-info-row">
                            <div className="cb-info-label-group">
                              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="cb-info-icon" />
                              <span>Children (Under 5 years)</span>
                            </div>
                            <span className="cb-info-value cb-text-green">Complimentary</span>
                          </div>
                          <div className="cb-info-note">
                            * Base room rates include 2 adults (12 adults for Entire Homestay). Extra charges apply for additional guests.
                          </div>
                        </div>

                        <button
                          className="cb-btn-primary cb-btn-block"
                          onClick={() => handleNavPage('booking')}
                        >
                          Book with Guest Count
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. POLICIES & AMENITIES MENU */}
                {currentView === 'policies' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Check-in, Amenities &amp; Policies</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-bubble cb-bubble-bot">
                          <p>Choose a topic to view details about your stay:</p>
                        </div>

                        <div className="cb-pill-options">
                          <button className="cb-pill-btn" onClick={() => navigateTo('timings', 'Check-in timings')}>
                            <HugeiconsIcon icon={Clock01Icon} size={16} />
                            <span>Check-in &amp; Check-out Timings</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="cb-pill-arrow" />
                          </button>
                          <button className="cb-pill-btn" onClick={() => navigateTo('dining', 'Breakfast & Cafe')}>
                            <HugeiconsIcon icon={Coffee02Icon} size={16} />
                            <span>Breakfast &amp; Mountain Cafe</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="cb-pill-arrow" />
                          </button>
                          <button className="cb-pill-btn" onClick={() => navigateTo('amenities', 'Wi-Fi & Parking')}>
                            <HugeiconsIcon icon={Wifi01Icon} size={16} />
                            <span>Parking, Wi-Fi &amp; Workation</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="cb-pill-arrow" />
                          </button>
                          <button className="cb-pill-btn" onClick={() => navigateTo('cancellation', 'Cancellation Policy')}>
                            <HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} />
                            <span>Cancellation &amp; Refund Policy</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="cb-pill-arrow" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3A. TIMINGS */}
                {currentView === 'timings' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Check-in timings</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-info-card">
                          <div className="cb-info-row">
                            <div className="cb-info-label-group">
                              <HugeiconsIcon icon={Clock01Icon} size={16} className="cb-info-icon" />
                              <span>Check-in Time</span>
                            </div>
                            <span className="cb-info-value">12:00 PM – 2:00 PM</span>
                          </div>
                          <div className="cb-info-row">
                            <div className="cb-info-label-group">
                              <HugeiconsIcon icon={Clock01Icon} size={16} className="cb-info-icon" />
                              <span>Check-out Time</span>
                            </div>
                            <span className="cb-info-value">11:00 AM</span>
                          </div>
                          <div className="cb-info-note">
                            Early check-in or late check-out is accommodated based on room availability upon prior request.
                          </div>
                        </div>

                        <a
                          href={WHATSAPP_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cb-btn-outline cb-btn-block"
                        >
                          <FaWhatsapp size={15} />
                          <span>Request Early Check-in on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3B. DINING & CAFE */}
                {currentView === 'dining' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Meraki Mountain Café</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-cafe-card">
                          <div className="cb-cafe-header">
                            <HugeiconsIcon icon={Coffee02Icon} size={20} color="#870097" />
                            <div>
                              <h4 className="cb-cafe-title">Meraki Mountain Café</h4>
                              <p className="cb-cafe-desc">
                                Enjoy freshly cooked Pahadi specials all day snacks and organic herbal teas right at Peora
                              </p>
                            </div>
                          </div>

                          <div className="cb-cafe-categories">
                            <div className="cb-cafe-cat-group">
                              <div className="cb-cafe-cat-title">
                                <HugeiconsIcon icon={SparklesIcon} size={13} color="#870097" />
                                <span>Breakfast &amp; Pahadi Khana</span>
                              </div>
                              <div className="cb-cafe-items-list">
                                <div className="cb-cafe-item">
                                  <span>Aloo / Paneer Paratha</span>
                                  <strong>&#8377;150</strong>
                                </div>
                                <div className="cb-cafe-item">
                                  <span>Cheese Vegetable Omelette</span>
                                  <strong>&#8377;150</strong>
                                </div>
                                <div className="cb-cafe-item">
                                  <span>Authentic Pahadi Rajma</span>
                                  <strong>&#8377;400</strong>
                                </div>
                                <div className="cb-cafe-item">
                                  <span>Bhat Ki Dal (Organic Black Soy)</span>
                                  <strong>&#8377;400</strong>
                                </div>
                                <div className="cb-cafe-item">
                                  <span>Pahadi Mutton / Chicken Curry</span>
                                  <strong>&#8377;500</strong>
                                </div>
                              </div>
                            </div>

                            <div className="cb-cafe-cat-group">
                              <div className="cb-cafe-cat-title">
                                <HugeiconsIcon icon={SparklesIcon} size={13} color="#870097" />
                                <span>All Day Snacks</span>
                              </div>
                              <div className="cb-cafe-items-list">
                                <div className="cb-cafe-item">
                                  <span>Pahadi Masala Maggie</span>
                                  <strong>&#8377;120</strong>
                                </div>
                                <div className="cb-cafe-item">
                                  <span>Mix Pakode with Mint Chutney</span>
                                  <strong>&#8377;150</strong>
                                </div>
                                <div className="cb-cafe-item">
                                  <span>French Fries with Cheese Dip</span>
                                  <strong>&#8377;150</strong>
                                </div>
                                <div className="cb-cafe-item">
                                  <span>Bambaiya Grilled Sandwich</span>
                                  <strong>&#8377;150</strong>
                                </div>
                              </div>
                            </div>

                            <div className="cb-cafe-cat-group">
                              <div className="cb-cafe-cat-title">
                                <HugeiconsIcon icon={SparklesIcon} size={13} color="#870097" />
                                <span>Garden Herbal Teas &amp; Drinks</span>
                              </div>
                              <div className="cb-cafe-items-list">
                                <div className="cb-cafe-item">
                                  <span>Detox Tea with Honey</span>
                                  <strong>&#8377;150</strong>
                                </div>
                                <div className="cb-cafe-item">
                                  <span>Mint Ginger Herbal Tea</span>
                                  <strong>&#8377;120</strong>
                                </div>
                                <div className="cb-cafe-item">
                                  <span>Pahadi Chay with Jaggery</span>
                                  <strong>&#8377;120</strong>
                                </div>
                                <div className="cb-cafe-item">
                                  <span>Espresso Hot Coffee</span>
                                  <strong>&#8377;120</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="cb-cafe-actions">
                          <button
                            className="cb-btn-secondary cb-btn-block"
                            onClick={() => handleNavPage('cafe')}
                          >
                            <HugeiconsIcon icon={Coffee02Icon} size={15} />
                            <span>View Full Menu</span>
                          </button>
                          <button
                            className="cb-btn-primary cb-btn-block"
                            onClick={() => handleNavPage('cafe')}
                          >
                            <span>Visit Café Page</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3C. AMENITIES */}
                {currentView === 'amenities' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Wi-Fi &amp; Parking</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-info-card">
                          <div className="cb-feature-item">
                            <HugeiconsIcon icon={Car01Icon} size={18} className="cb-feature-icon" />
                            <div>
                              <strong>Free On-Site Parking</strong>
                              <p>Dedicated parking space for all guest vehicles and two-wheelers.</p>
                            </div>
                          </div>
                          <div className="cb-feature-item">
                            <HugeiconsIcon icon={Wifi01Icon} size={18} className="cb-feature-icon" />
                            <div>
                              <strong>High-Speed Wi-Fi</strong>
                              <p>Reliable internet coverage across all suites, cafe, and garden lawns for workations.</p>
                            </div>
                          </div>
                          <div className="cb-feature-item">
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="cb-feature-icon" />
                            <div>
                              <strong>24/7 Power Backup &amp; Heaters</strong>
                              <p>Continuous power backup and room heaters for comfortable winter mountain stays.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3D. CANCELLATION POLICY */}
                {currentView === 'cancellation' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Cancellation Policy</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-info-card">
                          <div className="cb-policy-highlight">
                            <span className="cb-policy-badge">100% Refundable</span>
                            <p>Free cancellation up to <strong>7 days</strong> before your scheduled check-in date.</p>
                          </div>
                          <div className="cb-info-note">
                            * Cancellations within 7 days of arrival are non-refundable. Date adjustments can be accommodated subject to room availability.
                          </div>
                        </div>

                        <div className="cb-pill-options">
                          <button
                            className="cb-btn-secondary cb-btn-block"
                            onClick={() => navigateTo('refund-form', 'Request Refund')}
                          >
                            <span>Submit Refund Request</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                          </button>
                          <button
                            className="cb-btn-outline cb-btn-block"
                            onClick={() => handleNavPage('cancellation-policy')}
                          >
                            View Full Cancellation Policy Page
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3E. REFUND REQUEST FLOW */}
                {currentView === 'refund-form' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Refund Request</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        {!refundSubmitted ? (
                          <div className="cb-guest-form-card">
                            <div className="cb-guest-form-header">
                              <HugeiconsIcon icon={File02Icon} size={16} className="cb-guest-form-icon" />
                              <span className="cb-guest-form-title">Refund Request Submission</span>
                            </div>

                            <p className="cb-refund-explainer">
                              Please provide your cancelled booking details to initiate your refund verification. Requests are validated against our 7-day policy.
                            </p>

                            <form onSubmit={handleRefundSubmit} className="cb-guest-form">
                              <div className="cb-form-group">
                                <label className="cb-form-label">Booking ID</label>
                                <div className="cb-form-input-wrap">
                                  <HugeiconsIcon icon={Search01Icon} size={15} className="cb-form-field-icon" />
                                  <input
                                    type="text"
                                    className={`cb-form-input ${refundErrors.bookingId ? 'error' : ''}`}
                                    placeholder="e.g. MERI0001 or reference"
                                    value={refundBookingId}
                                    onChange={(e) => {
                                      setRefundBookingId(e.target.value);
                                      if (refundErrors.bookingId) setRefundErrors((prev) => ({ ...prev, bookingId: '' }));
                                    }}
                                  />
                                </div>
                                {refundErrors.bookingId && <span className="cb-form-error">{refundErrors.bookingId}</span>}
                              </div>

                              <div className="cb-form-group">
                                <label className="cb-form-label">Guest Name</label>
                                <div className="cb-form-input-wrap">
                                  <HugeiconsIcon icon={UserIcon} size={15} className="cb-form-field-icon" />
                                  <input
                                    type="text"
                                    className={`cb-form-input ${refundErrors.name ? 'error' : ''}`}
                                    placeholder="Full Name as on Booking"
                                    value={refundName}
                                    onChange={(e) => {
                                      setRefundName(e.target.value);
                                      if (refundErrors.name) setRefundErrors((prev) => ({ ...prev, name: '' }));
                                    }}
                                  />
                                </div>
                                {refundErrors.name && <span className="cb-form-error">{refundErrors.name}</span>}
                              </div>

                              <div className="cb-form-group">
                                <label className="cb-form-label">Email Address</label>
                                <div className="cb-form-input-wrap">
                                  <HugeiconsIcon icon={Mail01Icon} size={15} className="cb-form-field-icon" />
                                  <input
                                    type="email"
                                    className={`cb-form-input ${refundErrors.email ? 'error' : ''}`}
                                    placeholder="Registered Email"
                                    value={refundEmail}
                                    onChange={(e) => {
                                      setRefundEmail(e.target.value);
                                      if (refundErrors.email) setRefundErrors((prev) => ({ ...prev, email: '' }));
                                    }}
                                  />
                                </div>
                                {refundErrors.email && <span className="cb-form-error">{refundErrors.email}</span>}
                              </div>

                              <div className="cb-form-group">
                                <label className="cb-form-label">Mobile Number</label>
                                <div className="cb-form-input-wrap">
                                  <HugeiconsIcon icon={CallIcon} size={15} className="cb-form-field-icon" />
                                  <input
                                    type="tel"
                                    className={`cb-form-input ${refundErrors.phone ? 'error' : ''}`}
                                    placeholder="Phone Number"
                                    value={refundPhone}
                                    onChange={(e) => {
                                      setRefundPhone(e.target.value);
                                      if (refundErrors.phone) setRefundErrors((prev) => ({ ...prev, phone: '' }));
                                    }}
                                  />
                                </div>
                                {refundErrors.phone && <span className="cb-form-error">{refundErrors.phone}</span>}
                              </div>

                              <div className="cb-form-group">
                                <label className="cb-form-label">Reason for Refund</label>
                                <select
                                  className="cb-form-input"
                                  value={refundReason}
                                  onChange={(e) => setRefundReason(e.target.value)}
                                >
                                  <option value="Cancellation within 7 days window">Cancellation (7+ days before check-in)</option>
                                  <option value="Date Adjustment Refund">Date Adjustment / Room Downgrade</option>
                                  <option value="Double/Duplicate Payment">Duplicate / Overpayment</option>
                                  <option value="Emergency Cancellation">Emergency Cancellation</option>
                                  <option value="Other">Other Inquiry</option>
                                </select>
                              </div>

                              <div className="cb-form-group">
                                <label className="cb-form-label">Additional Message (Optional)</label>
                                <textarea
                                  className="cb-form-input cb-form-textarea"
                                  placeholder="Any notes for our accounts team..."
                                  rows={2}
                                  value={refundMessage}
                                  onChange={(e) => setRefundMessage(e.target.value)}
                                />
                              </div>

                              {refundErrors.submit && (
                                <div className="cb-form-error" style={{ marginBottom: '12px' }}>
                                  {refundErrors.submit}
                                </div>
                              )}

                              <button type="submit" className="cb-btn-primary cb-btn-block" disabled={isSubmittingRefund}>
                                <span>{isSubmittingRefund ? 'Submitting Request...' : 'Submit Refund Request'}</span>
                                {!isSubmittingRefund && <HugeiconsIcon icon={ArrowRight01Icon} size={15} />}
                              </button>
                            </form>

                            <div className="cb-form-privacy-note">
                              <HugeiconsIcon icon={CheckmarkBadge01Icon} size={13} className="cb-privacy-icon" />
                              <span>Requests are verified with banking partners within 5–7 business days.</span>
                            </div>
                          </div>
                        ) : (
                          <div className="cb-info-card cb-refund-success-card">
                            <div className="cb-refund-success-badge">
                              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
                              <strong>Refund Request Logged for Review</strong>
                            </div>

                            <div className="cb-refund-summary">
                              <div className="cb-info-row">
                                <span>Booking ID:</span>
                                <strong>{(refundResponseData?.booking_id || refundBookingId).toUpperCase()}</strong>
                              </div>
                              <div className="cb-info-row">
                                <span>Guest Name:</span>
                                <strong>{refundName}</strong>
                              </div>
                              <div className="cb-info-row">
                                <span>Email Update:</span>
                                <strong>{refundEmail}</strong>
                              </div>
                              <div className="cb-info-row">
                                <span>Status:</span>
                                <span className="cb-status-pill pending">{refundResponseData?.status || 'Pending'}</span>
                              </div>
                            </div>

                            {refundEmailSent === false ? (
                              <p className="cb-info-note" style={{ color: '#b45309' }}>
                                Your refund request has been received and accepted for processing. However, the confirmation email could not be dispatched at this moment.
                              </p>
                            ) : (
                              <p className="cb-info-note">
                                Your request has been received and accepted for processing according to policy. A confirmation email has been dispatched to your address.
                              </p>
                            )}

                            <div className="cb-refund-card-actions">
                              <button
                                className="cb-btn-secondary cb-btn-block"
                                onClick={() => handleNavPage('manage-booking')}
                              >
                                Check in Manage Booking
                              </button>
                              <a
                                href={WHATSAPP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cb-btn-outline cb-btn-block"
                              >
                                <FaWhatsapp size={14} />
                                <span>Expedite via WhatsApp</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3F. CANCEL BOOKING FLOW */}
                {currentView === 'cancel-flow' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Cancel Booking</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-info-card">
                          <div className="cb-policy-highlight">
                            <span className="cb-policy-badge">Cancellation Guidance</span>
                            <p>
                              Bookings can be cancelled through our Manage Booking portal in accordance with our 100% refund policy (7+ days before check-in).
                            </p>
                          </div>
                        </div>

                        <div className="cb-pill-options">
                          <button
                            className="cb-btn-primary cb-btn-block"
                            onClick={() => handleNavPage('manage-booking')}
                          >
                            <HugeiconsIcon icon={Search01Icon} size={15} />
                            <span>Open Manage Booking to Cancel</span>
                          </button>
                          <button
                            className="cb-btn-secondary cb-btn-block"
                            onClick={() => navigateTo('refund-form', 'Request Refund')}
                          >
                            <HugeiconsIcon icon={File02Icon} size={15} />
                            <span>Already Cancelled? Request Refund</span>
                          </button>
                          <button
                            className="cb-btn-outline cb-btn-block"
                            onClick={() => handleNavPage('cancellation-policy')}
                          >
                            View Cancellation Policy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3G. REFUND GUIDANCE / STATUS */}
                {(currentView === 'refund-guidance' || currentView === 'refund-status-info') && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Refund &amp; Cancellation Status</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-info-card">
                          <div className="cb-policy-highlight">
                            <span className="cb-policy-badge">100% Eligible for 7+ Days</span>
                            <p>
                              Eligible cancellations are processed directly to the original payment source within 5–7 business days of request submission.
                            </p>
                          </div>
                        </div>

                        <div className="cb-pill-options">
                          <button
                            className="cb-btn-primary cb-btn-block"
                            onClick={() => navigateTo('refund-form', 'Submit Refund Request')}
                          >
                            <HugeiconsIcon icon={File02Icon} size={15} />
                            <span>Submit / Re-verify Refund Request</span>
                          </button>
                          <button
                            className="cb-btn-secondary cb-btn-block"
                            onClick={() => handleNavPage('manage-booking')}
                          >
                            <span>Check Status in Manage Booking</span>
                          </button>
                          <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cb-btn-outline cb-btn-block"
                          >
                            <FaWhatsapp size={14} />
                            <span>Direct Host Assistance</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3H. MODIFY BOOKING INFO */}
                {currentView === 'modify-booking-info' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Modify Booking</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-info-card">
                          <p>
                            Date modifications and room adjustments can be accommodated based on seasonal room availability.
                          </p>
                        </div>

                        <div className="cb-pill-options">
                          <button
                            className="cb-btn-primary cb-btn-block"
                            onClick={() => handleNavPage('manage-booking')}
                          >
                            <span>Manage Booking Portal</span>
                          </button>
                          <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cb-btn-outline cb-btn-block"
                          >
                            <FaWhatsapp size={14} />
                            <span>Request Reschedule on WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. LOCATION & SIGHTS MENU */}
                {currentView === 'location' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Location &amp; Nearby Sights</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-bubble cb-bubble-bot">
                          <p>Get directions or explore scenic viewpoints and attractions:</p>
                        </div>

                        <div className="cb-pill-options">
                          <button className="cb-pill-btn" onClick={() => navigateTo('reach', 'How to reach Meraki Living')}>
                            <HugeiconsIcon icon={MapPinIcon} size={16} />
                            <span>How do I reach Meraki Living?</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="cb-pill-arrow" />
                          </button>
                          <button className="cb-pill-btn" onClick={() => navigateTo('sightseeing', 'Nearby Viewpoints')}>
                            <HugeiconsIcon icon={SparklesIcon} size={16} />
                            <span>Nearby Viewpoints &amp; Tourist Places</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="cb-pill-arrow" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4A. HOW TO REACH */}
                {currentView === 'reach' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>How to reach Meraki Living</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-info-card">
                          <div className="cb-location-header">
                            <HugeiconsIcon icon={MapPinIcon} size={20} className="cb-location-pin" />
                            <div>
                              <strong>Meraki Living</strong>
                              <p>Peora, Mukteshwar, Uttarakhand — 263138</p>
                            </div>
                          </div>
                          <div className="cb-distance-row">
                            <div className="cb-distance-item">
                              <span className="cb-dist-mode">Railway Station</span>
                              <span className="cb-dist-name">Kathgodam (~75 km / 2.5 hrs)</span>
                            </div>
                            <div className="cb-distance-item">
                              <span className="cb-dist-mode">Airport</span>
                              <span className="cb-dist-name">Pantnagar Airport (~110 km / 3.5 hrs)</span>
                            </div>
                            <div className="cb-distance-item">
                              <span className="cb-dist-mode">By Road</span>
                              <span className="cb-dist-name">Kathgodam &rarr; Bhowali &rarr; Peora</span>
                            </div>
                          </div>
                        </div>

                        <a
                          href={MAPS_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cb-btn-primary cb-btn-block"
                        >
                          <HugeiconsIcon icon={MapPinIcon} size={15} />
                          <span>Open in Google Maps</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4B. SIGHTSEEING - REUSING EXACT VIEWPOINTS DATA FROM WEBSITE */}
                {currentView === 'sightseeing' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Nearby Viewpoints</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-bubble cb-bubble-bot">
                          <p>Top scenic places &amp; viewpoints around Meraki Living:</p>
                        </div>

                        <div className="cb-sight-cards">
                          {VIEWPOINTS_DATA.map((item) => (
                            <div className="cb-sight-card" key={item.id}>
                              <div className="cb-sight-card-header">
                                <div className="cb-sight-title-group">
                                  <HugeiconsIcon icon={MapPinIcon} size={16} className="cb-sight-pin-icon" />
                                  <strong>{item.title}</strong>
                                </div>
                                <span className="cb-sight-badge">{item.distance}</span>
                              </div>
                              <p className="cb-sight-desc">{item.description}</p>
                            </div>
                          ))}
                        </div>

                        <button
                          className="cb-btn-outline cb-btn-block"
                          onClick={() => handleNavPage('home', null, 'viewpoints')}
                        >
                          <span>Explore Full Viewpoints Gallery</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. MANAGE BOOKING LOOKUP */}
                {currentView === 'manage-booking' && (
                  <div className="cb-view-container">
                    <div className="cb-user-msg-row">
                      <div className="cb-bubble cb-bubble-user">
                        <span>Manage / Track My Booking</span>
                      </div>
                    </div>

                    <div className="cb-bot-msg-row">
                      <BotAvatar />
                      <div className="cb-bot-content-col">
                        <div className="cb-bubble cb-bubble-bot">
                          <p>Enter your Booking ID (e.g. MERI0001), Phone Number, or Email to check your reservation status:</p>
                        </div>

                        <form className="cb-search-form" onSubmit={handleBookingSearch}>
                          <div className="cb-search-input-wrap">
                            <input
                              type="text"
                              className="cb-search-input"
                              placeholder="Booking ID or Phone Number"
                              value={searchVal}
                              onChange={(e) => setSearchVal(e.target.value)}
                            />
                            <button type="submit" className="cb-search-submit-btn" disabled={searchLoading} aria-label="Search Booking">
                              <HugeiconsIcon icon={Search01Icon} size={15} />
                            </button>
                          </div>
                          {searchError && <p className="cb-search-error">{searchError}</p>}
                        </form>

                        {searchLoading && (
                          <div className="cb-loader-wrap">
                            <div className="cb-spinner"></div>
                            <span>Locating reservation...</span>
                          </div>
                        )}

                        {foundBooking && (
                          <div className="cb-booking-result-card">
                            <div className="cb-br-header">
                              <span className="cb-br-id">{foundBooking.formattedId}</span>
                              <span className={`cb-br-status ${foundBooking.status?.toLowerCase() === 'cancelled' ? 'cancelled' : 'confirmed'}`}>
                                {foundBooking.status || 'Confirmed'}
                              </span>
                            </div>

                            <div className="cb-br-body">
                              <div className="cb-br-row">
                                <span>Room:</span>
                                <strong>{foundBooking.room_title || 'Meraki Suite'}</strong>
                              </div>
                              <div className="cb-br-row">
                                <span>Check-in:</span>
                                <strong>{foundBooking.check_in ? new Date(foundBooking.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</strong>
                              </div>
                              <div className="cb-br-row">
                                <span>Check-out:</span>
                                <strong>{foundBooking.check_out ? new Date(foundBooking.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</strong>
                              </div>
                              <div className="cb-br-row">
                                <span>Total:</span>
                                <strong>&#8377;{parseFloat(String(foundBooking.paid_amount || foundBooking.total_amount || 0)).toLocaleString('en-IN')}</strong>
                              </div>
                            </div>

                            <button
                              className="cb-btn-secondary cb-btn-block"
                              onClick={() => handleNavPage('manage-booking')}
                            >
                              Open Full Booking Manager
                            </button>
                          </div>
                        )}

                        {!foundBooking && (
                          <div className="cb-direct-manage-link">
                            <span>Need to modify dates, cancel, or review past bookings?</span>
                            <button
                              className="cb-btn-outline cb-btn-block"
                              onClick={() => handleNavPage('manage-booking')}
                            >
                              Go to Manage Booking Page
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Chatbot Message Input Form with Send Icon */}
          <form className="cb-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="cb-chat-input"
              placeholder={
                !hasInteracted
                  ? 'Type "Hello" to get started...'
                  : !guestFormSubmitted
                  ? 'Please complete your details above...'
                  : 'Ask about rooms, timings, refunds, sights...'
              }
              value={inputMessage}
              disabled={hasInteracted && !guestFormSubmitted}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              type="submit"
              className="cb-send-btn"
              disabled={
                (hasInteracted && !guestFormSubmitted) ||
                (hasInteracted && !inputMessage.trim())
              }
              aria-label="Send message"
              title="Send"
            >
              <IoSend size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
