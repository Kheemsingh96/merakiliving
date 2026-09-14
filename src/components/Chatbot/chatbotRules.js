/**
 * Meraki Living - Rule-Based Conversational Chatbot Engine
 * Defines intent rules, keyword matching, synonyms, and conversational routing.
 * Architecture is frontend-only and ready for future API/backend hooks.
 */

// Normalizes query text for case-insensitive, punctuation-free, whitespace-trimmed matching
export const normalizeText = (text = '') => {
  return text
    .toLowerCase()
    .replace(/[^\w\s\d]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Checks if text matches any of the provided patterns/phrases
 */
const matchesAny = (text, phrases) => {
  return phrases.some((phrase) => {
    if (phrase instanceof RegExp) {
      return phrase.test(text);
    }
    const cleanPhrase = normalizeText(phrase);
    return text.includes(cleanPhrase);
  });
};

/**
 * Checks if text contains all keywords in a group
 */
const containsAll = (text, keywords) => {
  return keywords.every((kw) => text.includes(kw.toLowerCase()));
};

/**
 * Priority-based intent definitions
 * Higher priority rules are evaluated first.
 */
export const CHATBOT_RULES = [
  // --------------------------------------------------------------------------
  // 1. REFUND FLOW (Highest Priority for specific refund queries)
  // --------------------------------------------------------------------------
  {
    id: 'refund-request-form',
    priority: 100,
    name: 'Refund Request Form',
    match: (text) =>
      matchesAny(text, [
        'request refund',
        'submit refund',
        'apply for refund',
        'fill refund form',
        'want my refund',
        'need refund',
        'get my refund',
        'give my refund',
        'process my refund',
        'i want a refund',
        'i need my refund',
        'how to get refund',
        'how do i get my refund',
        'refund request'
      ]),
    view: 'refund-form',
    responseTitle: 'Submit a Refund Request',
    responseText:
      'I can help you submit a refund request for your cancelled booking. Please provide your booking details below so our reservations team can verify eligibility against our cancellation policy.',
    followUp: null
  },

  {
    id: 'cancelled-booking-refund',
    priority: 95,
    name: 'Cancelled Booking Refund Inquiry',
    match: (text) =>
      matchesAny(text, [
        'cancelled my booking',
        'cancelled the booking',
        'booking was cancelled',
        'booking is cancelled',
        'already cancelled',
        'i have cancelled',
        'after cancellation',
        'what about my refund',
        'where is my refund',
        'refund after cancel',
        'cancellation refund'
      ]) ||
      (containsAll(text, ['cancel']) && containsAll(text, ['refund'])),
    view: 'refund-guidance',
    responseTitle: 'Refund for Cancelled Booking',
    responseText:
      'If your booking was cancelled at least 7 days before check-in, you are eligible for a 100% refund. You can submit a refund request or check your booking status through Manage Booking.',
    quickActions: [
      { label: 'Submit Refund Request', view: 'refund-form' },
      { label: 'Check Booking Status', view: 'manage-booking' },
      { label: 'View Cancellation Policy', nav: 'cancellation-policy' }
    ],
    setContext: 'awaiting_refund_action'
  },

  {
    id: 'refund-pending-status',
    priority: 90,
    name: 'Refund Status / Delay',
    match: (text) =>
      matchesAny(text, [
        'refund not arrived',
        'refund not received',
        'refund pending',
        'haven t received refund',
        'haven t got refund',
        'delay in refund',
        'when will i get refund',
        'how long for refund',
        'request refund again',
        'refund again',
        'status of refund'
      ]),
    view: 'refund-status-info',
    responseTitle: 'Refund Processing & Status',
    responseText:
      'Refunds for eligible cancellations are verified by our team and processed directly to the original payment source. If you have already submitted a request and it has been more than 5–7 business days, our host can check the status directly with our bank.',
    quickActions: [
      { label: 'Submit / Re-verify Refund', view: 'refund-form' },
      { label: 'Track in Manage Booking', view: 'manage-booking' },
      { label: 'WhatsApp Mountain Host', type: 'whatsapp' }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. CANCELLATION FLOW
  // --------------------------------------------------------------------------
  {
    id: 'cancel-booking-action',
    priority: 85,
    name: 'Cancel Booking',
    match: (text) =>
      matchesAny(text, [
        'cancel my booking',
        'cancel booking',
        'cancel reservation',
        'cancel stay',
        'want to cancel',
        'how to cancel',
        'how do i cancel',
        'i want to cancel my room',
        'need to cancel'
      ]),
    view: 'cancel-flow',
    responseTitle: 'Cancel Your Booking',
    responseText:
      'You can cancel your reservation directly through our Manage Booking portal using your Booking ID or phone number. We offer a 100% refund for cancellations made up to 7 days before your arrival date.',
    quickActions: [
      { label: 'Open Manage Booking to Cancel', nav: 'manage-booking' },
      { label: 'Read Cancellation Policy', nav: 'cancellation-policy' },
      { label: 'Already Cancelled? Request Refund', view: 'refund-form' }
    ]
  },

  {
    id: 'cancellation-policy',
    priority: 80,
    name: 'Cancellation Policy',
    match: (text) =>
      matchesAny(text, [
        'cancellation policy',
        'cancellation rule',
        'cancellation term',
        'refund policy',
        'is it refundable',
        'can i get refund if i cancel',
        'cancellation charges'
      ]),
    view: 'cancellation',
    responseTitle: 'Meraki Living Cancellation Policy',
    responseText:
      'We offer 100% free cancellation up to 7 days before check-in. Cancellations made within 7 days of arrival are non-refundable, but date adjustments can be accommodated based on availability.'
  },

  // --------------------------------------------------------------------------
  // 3. BOOKING LOOKUP & MODIFICATION
  // --------------------------------------------------------------------------
  {
    id: 'manage-booking-lookup',
    priority: 75,
    name: 'Manage / Track Booking',
    match: (text) =>
      matchesAny(text, [
        'track my booking',
        'check my booking',
        'find my booking',
        'look up booking',
        'show my booking',
        'where is my reservation',
        'booking status',
        'booking details',
        'manage booking',
        'my booking'
      ]),
    view: 'manage-booking',
    responseTitle: 'Manage / Track Your Booking',
    responseText:
      'Enter your Booking ID (e.g. MERI0001), phone number, or email to track your reservation status in real-time.'
  },

  {
    id: 'modify-booking-dates',
    priority: 72,
    name: 'Modify Booking / Change Dates',
    match: (text) =>
      matchesAny(text, [
        'modify booking',
        'change date',
        'change check in date',
        'change check out date',
        'reschedule booking',
        'postpone booking',
        'prepone booking',
        'change dates',
        'modify stay'
      ]),
    view: 'modify-booking-info',
    responseTitle: 'Modify Dates or Booking',
    responseText:
      'Date modifications can be accommodated subject to room availability. You can check your booking details in the Booking Manager or contact our mountain host directly for immediate assistance.',
    quickActions: [
      { label: 'Open Manage Booking', nav: 'manage-booking' },
      { label: 'Request Date Change via WhatsApp', type: 'whatsapp' }
    ]
  },

  // --------------------------------------------------------------------------
  // 4. ROOM DISCOVERY & GROUP RECOMMENDATIONS
  // --------------------------------------------------------------------------
  {
    id: 'room-couples-solo',
    priority: 70,
    name: 'Couples / Solo Stays (2 Guests)',
    match: (text) =>
      matchesAny(text, [
        'couple',
        'couples',
        'honeymoon',
        'romantic',
        'solo',
        '2 people',
        '2 guests',
        'two people',
        'two guests',
        'for 2',
        'for two',
        'just 2 of us',
        'room for 2'
      ]),
    view: 'group-select',
    groupParam: '2',
    responseTitle: 'Suites for Couples & Solo Travelers',
    responseText:
      'For 2 guests or couples, we recommend our Deluxe Suite 1 (with private balcony) and Deluxe Suite 2 (cozy Himalayan mountain view):'
  },

  {
    id: 'room-family-small-group',
    priority: 70,
    name: 'Family / Small Group (3–4 Guests)',
    match: (text) =>
      matchesAny(text, [
        'family',
        'small family',
        '3 people',
        '4 people',
        '3 guests',
        '4 guests',
        'three people',
        'four people',
        'for 3',
        'for 4',
        'for 3 people',
        'for 4 people',
        'room for 4',
        'room for 3',
        'family room',
        'family suite'
      ]),
    view: 'group-select',
    groupParam: '3-4',
    responseTitle: 'Suites for Families & Small Groups',
    responseText:
      'For 3 to 4 guests or families, our Family Suite 3 offers an expansive bedroom and attached living lounge overlooking the valley:'
  },

  {
    id: 'room-large-group-villa',
    priority: 70,
    name: 'Large Group / Entire Homestay (8–14 Guests)',
    match: (text) =>
      matchesAny(text, [
        'large group',
        'entire homestay',
        'entire villa',
        'full property',
        'entire cottage',
        'whole place',
        'whole villa',
        '8 people',
        '10 people',
        '12 people',
        '14 people',
        '8 guests',
        '10 guests',
        '12 guests',
        '14 guests',
        'big group',
        'group stay',
        '3 bhk'
      ]),
    view: 'group-select',
    groupParam: '8-14',
    responseTitle: 'Private 3-BHK Himalayan Villa (Exclusive Stay)',
    responseText:
      'For larger groups of 8 to 14 guests, you can book the Entire 3-BHK Homestay exclusively, including all 3 suites, private living areas, lawns, and dedicated staff:'
  },

  {
    id: 'room-group-inquiry-general',
    priority: 65,
    name: 'Which room is best for my group',
    match: (text) =>
      matchesAny(text, [
        'which room is best',
        'room for my group',
        'recommend a room',
        'best room',
        'which room should i book',
        'suggest a room',
        'how many people',
        'room capacity',
        'suitable room'
      ]),
    view: 'group-select',
    responseTitle: 'Find the Best Room for Your Group',
    responseText:
      'How many guests will be staying with us? Select your group size to see our tailored room recommendations:',
    setContext: 'awaiting_group_size'
  },

  {
    id: 'room-pricing-and-rates',
    priority: 62,
    name: 'Room Pricing & Starting Rates',
    match: (text) =>
      matchesAny(text, [
        'room price',
        'room rate',
        'how much is the room',
        'how much does it cost',
        'cost of room',
        'cost per night',
        'tariff',
        'rates',
        'pricing',
        'cheap room',
        'room charges'
      ]),
    view: 'all-rooms',
    responseTitle: 'Current Room Rates & Starting Prices',
    responseText:
      'Here are our available rooms with current starting rates and seasonal discounts for Meraki Living:'
  },

  {
    id: 'room-extra-guest-charges',
    priority: 60,
    name: 'Extra Guest & Child Charges',
    match: (text) =>
      matchesAny(text, [
        'extra guest',
        'extra person',
        'extra bed',
        'extra adult',
        'child charge',
        'children policy',
        'kids charges',
        'kids free',
        'child free',
        'baby cot'
      ]),
    view: 'extra-charges',
    responseTitle: 'Extra Guest & Child Policy',
    responseText:
      'Our base room rates include 2 adults (12 for the entire homestay). Here are our extra guest and child pricing details:'
  },

  {
    id: 'rooms-all-general',
    priority: 55,
    name: 'Explore All Rooms & Availability',
    match: (text) =>
      matchesAny(text, [
        'what rooms do you have',
        'show rooms',
        'show all rooms',
        'all rooms',
        'available rooms',
        'view rooms',
        'rooms available',
        'explore rooms',
        'types of rooms',
        'room list',
        'room options',
        'rooms'
      ]),
    view: 'all-rooms',
    responseTitle: 'Meraki Living Suites & Stays',
    responseText:
      'We offer luxury boutique suites with panoramic views of the Himalayas. Explore our rooms and starting rates below:'
  },

  // --------------------------------------------------------------------------
  // 5. POLICIES, TIMINGS, DINING & AMENITIES
  // --------------------------------------------------------------------------
  {
    id: 'checkin-checkout-timings',
    priority: 50,
    name: 'Check-in & Check-out Timings',
    match: (text) =>
      matchesAny(text, [
        'check in time',
        'check out time',
        'checkin',
        'checkout',
        'what time is check in',
        'what time is check out',
        'early check in',
        'late check out',
        'timing',
        'timings'
      ]),
    view: 'timings',
    responseTitle: 'Check-in & Check-out Timings',
    responseText:
      'Our standard check-in time is 12:00 PM – 2:00 PM, and check-out is by 11:00 AM. Early check-in or late check-out is subject to room availability upon prior request.'
  },

  {
    id: 'dining-breakfast-cafe',
    priority: 48,
    name: 'Breakfast & Mountain Cafe',
    match: (text) =>
      matchesAny(text, [
        'breakfast',
        'is breakfast included',
        'food',
        'meals',
        'cafe',
        'restaurant',
        'menu',
        'coffee',
        'tea',
        'dining',
        'lunch',
        'dinner',
        'kumaoni food'
      ]),
    view: 'dining',
    responseTitle: 'Breakfast & Mountain Cafe',
    responseText:
      'A fresh complimentary mountain breakfast is included with every stay. Additionally, our on-site Meraki Mountain Cafe serves artisan coffees, authentic Kumaoni dishes, and continental meals.'
  },

  {
    id: 'amenities-wifi-parking-heaters',
    priority: 45,
    name: 'Parking, Wi-Fi & Workation',
    match: (text) =>
      matchesAny(text, [
        'wifi',
        'wi fi',
        'internet',
        'parking',
        'car parking',
        'free parking',
        'workation',
        'work from mountains',
        'heater',
        'heaters',
        'power backup',
        'generator',
        'amenities',
        'facilities'
      ]),
    view: 'amenities',
    responseTitle: 'Parking, Wi-Fi & Amenities',
    responseText:
      'We offer free dedicated on-site parking, high-speed optical Wi-Fi for workations, 24/7 power backup, and cozy room heaters in every suite.'
  },

  // --------------------------------------------------------------------------
  // 6. LOCATION, DIRECTIONS & VIEWPOINTS
  // --------------------------------------------------------------------------
  {
    id: 'location-how-to-reach',
    priority: 40,
    name: 'Location & How to Reach',
    match: (text) =>
      matchesAny(text, [
        'where is meraki living',
        'where are you located',
        'location',
        'address',
        'how to reach',
        'directions',
        'how far from kathgodam',
        'nearest railway station',
        'nearest airport',
        'pantnagar',
        'kathgodam',
        'peora',
        'mukteshwar',
        'how do i reach'
      ]),
    view: 'reach',
    responseTitle: 'Location & Directions to Meraki Living',
    responseText:
      'Meraki Living is nestled in Peora, Mukteshwar (Uttarakhand — 263138). It is ~75 km from Kathgodam Railway Station (2.5 hrs) and ~110 km from Pantnagar Airport (3.5 hrs).'
  },

  {
    id: 'sightseeing-viewpoints',
    priority: 38,
    name: 'Nearby Viewpoints & Attractions',
    match: (text) =>
      matchesAny(text, [
        'nearby places',
        'viewpoints',
        'places to visit',
        'sightseeing',
        'tourist places',
        'attractions',
        'things to do',
        'what is near',
        'near the property',
        'mukteshwar temple',
        'chauli ki jali',
        'bhalu gaad',
        'view point'
      ]),
    view: 'sightseeing',
    responseTitle: 'Nearby Viewpoints & Sights',
    responseText:
      'Explore top scenic spots around Meraki Living, including Peora Pine Trails, Mukteshwar Dham, Chauli Ki Jali, and Bhalu Gaad Waterfalls:'
  },

  // --------------------------------------------------------------------------
  // 7. GREETINGS & GENERAL CONVERSATION
  // --------------------------------------------------------------------------
  {
    id: 'general-greetings',
    priority: 30,
    name: 'Greetings & Hello',
    match: (text) =>
      matchesAny(text, [
        'hello',
        'hi',
        'hey',
        'namaste',
        'good morning',
        'good afternoon',
        'good evening',
        'start',
        'help',
        'menu'
      ]),
    view: 'home',
    responseTitle: 'How can I assist you?',
    responseText:
      'Namaste! Please let me know what you would like to explore today:'
  }
];

/**
 * Match a user message to an intent rule.
 * Takes current conversation context into account for follow-ups.
 */
export const matchUserIntent = (messageText, currentContext = null) => {
  const clean = normalizeText(messageText);
  if (!clean) return null;

  // 1. Handle Context-Aware Follow-Ups first
  if (currentContext === 'awaiting_group_size') {
    if (matchesAny(clean, ['2', 'two', 'couple', 'solo', '1', 'one', 'just me', 'two of us'])) {
      return {
        ...CHATBOT_RULES.find((r) => r.id === 'room-couples-solo'),
        isFollowUp: true
      };
    }
    if (matchesAny(clean, ['3', '4', 'three', 'four', 'family', 'small family', 'small group'])) {
      return {
        ...CHATBOT_RULES.find((r) => r.id === 'room-family-small-group'),
        isFollowUp: true
      };
    }
    if (matchesAny(clean, ['8', '10', '12', '14', 'large', 'villa', 'entire', 'whole', 'homestay', 'group', 'many'])) {
      return {
        ...CHATBOT_RULES.find((r) => r.id === 'room-large-group-villa'),
        isFollowUp: true
      };
    }
  }

  if (currentContext === 'awaiting_refund_action') {
    if (matchesAny(clean, ['yes', 'submit', 'request', 'form', 'fill', 'apply', 'proceed'])) {
      return {
        ...CHATBOT_RULES.find((r) => r.id === 'refund-request-form'),
        isFollowUp: true
      };
    }
    if (matchesAny(clean, ['manage', 'track', 'check', 'booking status'])) {
      return {
        ...CHATBOT_RULES.find((r) => r.id === 'manage-booking-lookup'),
        isFollowUp: true
      };
    }
  }

  // 2. Sort rules by priority descending and find first match
  const sortedRules = [...CHATBOT_RULES].sort((a, b) => (b.priority || 0) - (a.priority || 0));

  for (const rule of sortedRules) {
    if (rule.match && rule.match(clean)) {
      return rule;
    }
  }

  // 3. Fallback when no rule matched
  return {
    id: 'fallback-humanized',
    priority: 0,
    name: 'Humanized Fallback',
    view: 'home',
    isFallback: true,
    responseTitle: 'How May I Assist You?',
    responseText:
      'I’d be happy to help with your stay. You can ask me about rooms, availability, booking, cancellation, refunds, check-in, the café, location, or nearby places.',
    quickActions: [
      { label: 'Explore Rooms & Pricing', view: 'rooms' },
      { label: 'Check-in & Timings', view: 'timings' },
      { label: 'Cancellation & Refunds', view: 'cancellation' },
      { label: 'Location & Sights', view: 'location' },
      { label: 'Manage / Track Booking', view: 'manage-booking' }
    ]
  };
};
