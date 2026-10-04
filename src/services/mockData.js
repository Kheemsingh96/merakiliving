// services/mockData.js
// Clean mock/service layer — replace with API calls when backend is ready

const STORAGE_KEY = 'homestay_admin_data';

const initialData = {
  rooms: [
    {
      id: 'room-4',
      title: 'Entire Homestay',
      description: 'Book the entire property for your group. Includes all rooms, common areas, kitchen access, and exclusive use of the garden and cafe space.',
      maxGuests: 10,
      bedType: 'Multiple',
      viewType: '360° Mountain & Valley',
      roomSize: '2000 sq ft',
      price: 18000,
      originalPrice: 20000,
      amenities: ['Free WiFi', 'Room Heater', 'Kitchenette', 'Private Garden', 'Common Lounge', 'Full Kitchen Access', 'Bonfire Area', 'Parking'],
      images: ['/assets/homestay-1.avif', '/assets/homestay-2.avif'],
      status: 'active'
    },
    {
      id: 'room-3',
      title: 'Luxury Family Suite',
      description: 'Spacious suite perfect for families, featuring a separate living area, two bedrooms, and a private sit-out with valley views.',
      maxGuests: 5,
      bedType: 'King + Twin',
      viewType: 'Garden & Valley View',
      roomSize: '550 sq ft',
      price: 7200,
      originalPrice: 8000,
      amenities: ['Free WiFi', 'Room Heater', 'Kitchenette', 'Living Area', 'Hot Shower', 'Tea/Coffee Maker', 'TV', 'Refrigerator'],
      images: ['/assets/room-family-1.avif', '/assets/room-family-2.avif'],
      status: 'active'
    },
    {
      id: 'room-2',
      title: 'Premium Valley Room',
      description: 'Overlooking the lush green valley, this room offers serenity and comfort with floor-to-ceiling windows and handcrafted wooden interiors.',
      maxGuests: 2,
      bedType: 'Queen Size',
      viewType: 'Valley View',
      roomSize: '280 sq ft',
      price: 3800,
      originalPrice: 4200,
      amenities: ['Free WiFi', 'Room Heater', 'Valley View', 'Hot Shower', 'Tea/Coffee Maker', 'Wardrobe'],
      images: ['/assets/room-valley-1.avif', '/assets/room-valley-2.avif'],
      status: 'active'
    },
    {
      id: 'room-1',
      title: 'Himalayan View Room',
      description: 'Wake up to breathtaking panoramic views of the Himalayan ranges. Features a private balcony, premium bedding, and traditional Kumaoni architecture with modern comforts.',
      maxGuests: 2,
      bedType: 'King Size',
      viewType: 'Mountain View',
      roomSize: '320 sq ft',
      price: 4500,
      originalPrice: 5000,
      amenities: ['Free WiFi', 'Room Heater', 'Private Balcony', 'Hot Shower', 'Tea/Coffee Maker', 'Work Desk'],
      images: ['/assets/room-himalayan-1.avif', '/assets/room-himalayan-2.avif'],
      status: 'active'
    }
  ],
  bookings: [
    {
      id: 'BK-240825001',
      guestName: 'Rajesh Khanna',
      email: 'rajesh.k@example.com',
      phone: '9876543210',
      countryCode: '+91',
      checkIn: '2026-08-25',
      checkOut: '2026-08-27',
      nights: 2,
      adults: 2,
      children: 0,
      room: 'Himalayan View Room',
      roomId: 'room-1',
      totalRooms: 1,
      specialRequests: 'Early check-in preferred. Celebrating anniversary.',
      coupon: '',
      totalAmount: 9450,
      paymentStatus: 'success',
      bookingStatus: 'confirmed',
      internalNotes: '',
      razorpayOrderId: 'order_9A12bC34',
      razorpayPaymentId: 'pay_7Xy8zW90',
      createdAt: '2026-08-20T10:30:00Z'
    },
    {
      id: 'BK-240825002',
      guestName: 'Sunita Reddy',
      email: 'sunita.r@example.com',
      phone: '9123456789',
      countryCode: '+91',
      checkIn: '2026-08-26',
      checkOut: '2026-08-29',
      nights: 3,
      adults: 2,
      children: 1,
      room: 'Luxury Family Suite',
      roomId: 'room-3',
      totalRooms: 1,
      specialRequests: 'Need extra bed for child. Vegetarian meals only.',
      coupon: 'MERAKI8',
      totalAmount: 19915,
      paymentStatus: 'success',
      bookingStatus: 'confirmed',
      internalNotes: 'Guest has stayed before. VIP treatment.',
      razorpayOrderId: 'order_8Cd34Ef5',
      razorpayPaymentId: 'pay_6Mn7oP89',
      createdAt: '2026-08-18T14:15:00Z'
    },
    {
      id: 'BK-240825003',
      guestName: 'Amit Sharma',
      email: 'amit.s@example.com',
      phone: '9988776655',
      countryCode: '+91',
      checkIn: '2026-08-28',
      checkOut: '2026-08-30',
      nights: 2,
      adults: 2,
      children: 0,
      room: 'Premium Valley Room',
      roomId: 'room-2',
      totalRooms: 1,
      specialRequests: '',
      coupon: 'SAVE8',
      totalAmount: 6992,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      internalNotes: '',
      razorpayOrderId: 'order_7Gh56Ij6',
      razorpayPaymentId: '',
      createdAt: '2026-08-24T09:00:00Z'
    },
    {
      id: 'BK-240825004',
      guestName: 'Priya Patel',
      email: 'priya.p@example.com',
      phone: '9876512345',
      countryCode: '+91',
      checkIn: '2026-08-25',
      checkOut: '2026-08-25',
      nights: 1,
      adults: 4,
      children: 2,
      room: 'Entire Homestay',
      roomId: 'room-4',
      totalRooms: 1,
      specialRequests: 'Team offsite. Need projector.',
      coupon: '',
      totalAmount: 18900,
      paymentStatus: 'failed',
      bookingStatus: 'cancelled',
      internalNotes: 'Payment failed twice. Guest asked to cancel.',
      razorpayOrderId: 'order_6Kl78Mn7',
      razorpayPaymentId: '',
      createdAt: '2026-08-22T16:45:00Z'
    },
    {
      id: 'BK-240825005',
      guestName: 'Vikram Mehta',
      email: 'vikram.m@example.com',
      phone: '9765432109',
      countryCode: '+91',
      checkIn: '2026-08-30',
      checkOut: '2026-09-02',
      nights: 3,
      adults: 2,
      children: 0,
      room: 'Himalayan View Room',
      roomId: 'room-1',
      totalRooms: 1,
      specialRequests: 'Honeymoon decoration.',
      coupon: '',
      totalAmount: 14175,
      paymentStatus: 'success',
      bookingStatus: 'confirmed',
      internalNotes: '',
      razorpayOrderId: 'order_5Op90Qr8',
      razorpayPaymentId: 'pay_4St3uV78',
      createdAt: '2026-08-15T11:20:00Z'
    }
  ],
  availability: [
    { roomId: 'room-1', date: '2026-08-25', status: 'booked', bookingId: 'BK-240825001' },
    { roomId: 'room-1', date: '2026-08-26', status: 'booked', bookingId: 'BK-240825001' },
    { roomId: 'room-3', date: '2026-08-26', status: 'booked', bookingId: 'BK-240825002' },
    { roomId: 'room-3', date: '2026-08-27', status: 'booked', bookingId: 'BK-240825002' },
    { roomId: 'room-3', date: '2026-08-28', status: 'booked', bookingId: 'BK-240825002' },
    { roomId: 'room-2', date: '2026-08-28', status: 'booked', bookingId: 'BK-240825003' },
    { roomId: 'room-2', date: '2026-08-29', status: 'booked', bookingId: 'BK-240825003' },
    { roomId: 'room-4', date: '2026-08-25', status: 'blocked', reason: 'maintenance' },
    { roomId: 'room-4', date: '2026-08-26', status: 'blocked', reason: 'maintenance' },
    { roomId: 'room-1', date: '2026-09-05', status: 'blocked', reason: 'personal_use' },
    { roomId: 'room-1', date: '2026-09-06', status: 'blocked', reason: 'personal_use' }
  ],
  menu: {
    featured: [
      { id: 'mf-1', name: 'Pahadi Aloo Ke Gutke', description: 'Traditional Kumaoni potato dish tempered with mustard seeds and coriander', category: 'Pahadi Khana', price: 220, originalPrice: 250, tag: 'Best Seller', isVeg: true, available: true, image: '/assets/menu-gutke.avif' },
      { id: 'mf-2', name: 'Rhododendron Tea', description: 'Refreshing herbal tea made from Buransh flowers, unique to the Himalayas', category: 'Teas', price: 120, originalPrice: 150, tag: 'Must Try', isVeg: true, available: true, image: '/assets/menu-rhodo-tea.avif' },
      { id: 'mf-3', name: 'Bhatt Ki Churkani', description: 'Black soybean curry, a Kumaoni delicacy served with steamed rice', category: 'Pahadi Khana', price: 280, originalPrice: 320, tag: 'Best Seller', isVeg: true, available: true, image: '/assets/menu-churkani.avif' }
    ],
    categories: [
      {
        name: 'Breakfast',
        items: [
          { id: 'b-1', name: 'Pahadi Paratha & Dahi', description: 'Stuffed paratha with local greens, served with curd and pickle', price: 180, originalPrice: 200, isVeg: true, available: true },
          { id: 'b-2', name: 'Aloo Puri', description: 'Fluffy deep-fried bread with spiced potato curry', price: 160, originalPrice: 180, isVeg: true, available: true },
          { id: 'b-3', name: 'Masala Omelette & Toast', description: 'Farm-fresh eggs with toast and butter', price: 150, originalPrice: 170, isVeg: false, available: true },
          { id: 'b-4', name: 'Porridge & Honey', description: 'Warm oatmeal with mountain honey and nuts', price: 140, originalPrice: 160, isVeg: true, available: true }
        ]
      },
      {
        name: 'Pahadi Khana',
        items: [
          { id: 'p-1', name: 'Chainsoo', description: 'Urad dal roasted and ground, cooked in traditional style', price: 240, originalPrice: 270, isVeg: true, available: true },
          { id: 'p-2', name: 'Kaapa', description: 'Spinach curry tempered with local spices', price: 200, originalPrice: 220, isVeg: true, available: true },
          { id: 'p-3', name: 'Gahat Ki Dal', description: 'Horse gram lentil soup, a regional specialty', price: 230, originalPrice: 260, isVeg: true, available: true },
          { id: 'p-4', name: 'Aloo Tamatar Jhol', description: 'Simple yet flavorful potato and tomato curry', price: 180, originalPrice: 200, isVeg: true, available: true }
        ]
      },
      {
        name: 'Snacks',
        items: [
          { id: 's-1', name: 'Maggi Noodles', description: 'Classic instant noodles with veggies', price: 80, originalPrice: 100, isVeg: true, available: true },
          { id: 's-2', name: 'Veg Pakora', description: 'Mixed vegetable fritters with mint chutney', price: 120, originalPrice: 140, isVeg: true, available: true },
          { id: 's-3', name: 'Chicken Pakora', description: 'Spiced chicken fritters', price: 180, originalPrice: 200, isVeg: false, available: true },
          { id: 's-4', name: 'French Fries', description: 'Crispy golden fries with ketchup', price: 100, originalPrice: 120, isVeg: true, available: true }
        ]
      },
      {
        name: 'Rice & Roti',
        items: [
          { id: 'r-1', name: 'Steamed Rice', description: 'Fragrant basmati rice', price: 100, originalPrice: 120, isVeg: true, available: true },
          { id: 'r-2', name: 'Jeera Rice', description: 'Cumin-flavored rice', price: 130, originalPrice: 150, isVeg: true, available: true },
          { id: 'r-3', name: 'Tandoori Roti', description: 'Clay oven-baked whole wheat bread', price: 30, originalPrice: 40, isVeg: true, available: true },
          { id: 'r-4', name: 'Butter Naan', description: 'Soft leavened bread with butter', price: 50, originalPrice: 60, isVeg: true, available: true }
        ]
      },
      {
        name: 'Add-ons',
        items: [
          { id: 'a-1', name: 'Papad', description: 'Crispy lentil wafer', price: 30, originalPrice: 40, isVeg: true, available: true },
          { id: 'a-2', name: 'Raita', description: 'Yogurt with cucumber and spices', price: 60, originalPrice: 70, isVeg: true, available: true },
          { id: 'a-3', name: 'Green Salad', description: 'Fresh garden vegetables', price: 80, originalPrice: 100, isVeg: true, available: true },
          { id: 'a-4', name: 'Pickle', description: 'Homemade mixed pickle', price: 40, originalPrice: 50, isVeg: true, available: true }
        ]
      },
      {
        name: 'Teas',
        items: [
          { id: 't-1', name: 'Masala Chai', description: 'Spiced milk tea', price: 50, originalPrice: 60, isVeg: true, available: true },
          { id: 't-2', name: 'Green Tea', description: 'Organic green tea', price: 70, originalPrice: 80, isVeg: true, available: true },
          { id: 't-3', name: 'Ginger Honey Tea', description: 'Soothing ginger tea with honey', price: 80, originalPrice: 90, isVeg: true, available: true },
          { id: 't-4', name: 'Lemon Tea', description: 'Black tea with fresh lemon', price: 60, originalPrice: 70, isVeg: true, available: true }
        ]
      }
    ]
  },
  coupons: [
    { id: 'c-1', code: 'MERAKI8', type: 'percentage', value: 8, enabled: true, maxUses: 100, usesCount: 12, validFrom: '2026-01-01', validUntil: '2026-12-31' },
    { id: 'c-2', code: 'SAVE8', type: 'percentage', value: 8, enabled: true, maxUses: 50, usesCount: 5, validFrom: '2026-06-01', validUntil: '2026-09-30' },
    { id: 'c-3', code: 'WELCOME500', type: 'fixed', value: 500, enabled: false, maxUses: 20, usesCount: 0, validFrom: '2026-08-01', validUntil: '2026-10-31' }
  ],
  reviews: [
    { id: 'r-1', guestName: 'Rajesh Khanna', date: '2026-07-15', text: 'An absolutely magical stay. The Himalayan View Room exceeded all expectations. Waking up to those mountains was a spiritual experience. The hosts made us feel like family.', rating: 5, avatar: '/assets/avatar-rajesh.avif', featured: true, visible: true },
    { id: 'r-2', guestName: 'Sunita Reddy', date: '2026-06-22', text: 'We stayed in the Family Suite with our kids and it was perfect. The kids loved the garden and the home-cooked Pahadi food was the highlight. Already planning our next visit!', rating: 5, avatar: '/assets/avatar-sunita.avif', featured: true, visible: true },
    { id: 'r-3', guestName: 'Amit Sharma', date: '2026-05-10', text: 'Great location and very peaceful. The valley room had stunning views. Would recommend for anyone looking to disconnect from city life.', rating: 4, avatar: '/assets/avatar-amit.avif', featured: false, visible: true },
    { id: 'r-4', guestName: 'Priya Patel', date: '2026-04-18', text: 'Booked the entire homestay for our team offsite. The space was perfect for our workshops and the bonfire evenings were unforgettable.', rating: 5, avatar: '/assets/avatar-priya.avif', featured: true, visible: true }
  ],
  gallery: {
    rooms: {
      'room-1': ['/assets/room-himalayan-1.avif', '/assets/room-himalayan-2.avif', '/assets/room-himalayan-3.avif'],
      'room-2': ['/assets/room-valley-1.avif', '/assets/room-valley-2.avif'],
      'room-3': ['/assets/room-family-1.avif', '/assets/room-family-2.avif', '/assets/room-family-3.avif'],
      'room-4': ['/assets/homestay-1.avif', '/assets/homestay-2.avif', '/assets/homestay-3.avif']
    },
    explore: ['/assets/explore-1.avif', '/assets/explore-2.avif', '/assets/explore-3.avif', '/assets/explore-4.avif'],
    cafe: ['/assets/cafe-1.avif', '/assets/cafe-2.avif', '/assets/cafe-3.avif']
  },
  legal: {
    privacyPolicy: `At Meraki Homestay, we respect your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you book a stay or visit our website.\n\nInformation We Collect\nWe collect your name, email, phone number, and booking details to process reservations and communicate with you.\n\nHow We Use Your Information\nYour information is used solely for booking management, guest communication, and service improvement. We do not sell or share your data with third parties.\n\nData Security\nWe implement appropriate security measures to protect your personal information.\n\nContact Us\nFor privacy-related queries, contact us at stay@merakihomestay.com.`,
    termsAndConditions: `Welcome to Meraki Homestay. By booking with us, you agree to the following terms.\n\nBookings\nAll bookings are subject to availability and confirmation. A booking is only confirmed upon successful payment.\n\nCheck-in / Check-out\nCheck-in time is 12:00 PM and check-out time is 11:00 AM. Early check-in and late check-out are subject to availability.\n\nGuest Responsibility\nGuests are responsible for their belongings. Damages to property caused by guests will be charged accordingly.\n\nLiability\nMeraki Homestay is not liable for any unforeseen circumstances including natural events beyond our control.`,
    cancellationPolicy: `We understand plans can change. Our cancellation policy is designed to be fair to both our guests and our small homestay.\n\nCancellation by Guest\n• 7+ days before check-in: Full refund minus payment gateway charges\n• 3-6 days before check-in: 50% refund\n• Less than 3 days: No refund\n\nNo-show\nIn case of no-show without prior intimation, no refund will be provided.\n\nCancellation by Meraki\nIn rare circumstances, we may need to cancel bookings due to unforeseen events. In such cases, a full refund will be provided.\n\nRefund Processing\nRefunds are processed within 5-7 business days to the original payment method.`
  },
  faqs: [
    { id: 'f-1', question: 'How do I reach Meraki Homestay?', answer: 'We are located in Mukteshwar, Uttarakhand. The nearest railway station is Kathgodam (65 km). We can arrange pickups on request.' },
    { id: 'f-2', question: 'Is WiFi available?', answer: 'Yes, we offer complimentary WiFi in all rooms and common areas. However, being in the mountains, occasional connectivity issues may occur.' },
    { id: 'f-3', question: 'Do you serve non-vegetarian food?', answer: 'Yes, our cafe serves both vegetarian and non-vegetarian options. We also specialize in traditional Kumaoni cuisine.' },
    { id: 'f-4', question: 'Are pets allowed?', answer: 'We love pets! Please inform us in advance if you plan to bring your furry friend. Additional cleaning charges may apply.' },
    { id: 'f-5', question: 'What is the best time to visit?', answer: 'March to June and September to November offer the best weather. Winter (December-February) is magical if you enjoy snow.' }
  ],
  settings: {
    contact: {
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      email: 'stay@merakihomestay.com',
      address: 'Meraki Homestay, Sitla Village, Mukteshwar, Uttarakhand 263138'
    },
    social: {
      instagram: 'https://instagram.com/merakihomestay',
      facebook: 'https://facebook.com/merakihomestay',
      youtube: 'https://youtube.com/@merakihomestay'
    },
    gst: 5,
    admins: [
      { id: 'admin-1', username: 'admin', role: 'primary' }
    ]
  }
};

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
}

function getData() {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function setData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getRooms() { return getData().rooms; }
export function updateRoom(updatedRoom) {
  const data = getData();
  const idx = data.rooms.findIndex(r => r.id === updatedRoom.id);
  if (idx >= 0) { data.rooms[idx] = updatedRoom; setData(data); }
  return data.rooms;
}

export function getBookings() { return getData().bookings; }
export function addBooking(booking) {
  const data = getData();
  booking.id = 'MERI' + String(data.bookings.length + 1).padStart(4, '0');
  booking.createdAt = new Date().toISOString();
  data.bookings.unshift(booking);
  setData(data);
  return data.bookings;
}
export function updateBooking(updatedBooking) {
  const data = getData();
  const idx = data.bookings.findIndex(b => b.id === updatedBooking.id);
  if (idx >= 0) { data.bookings[idx] = updatedBooking; setData(data); }
  return data.bookings;
}
export function deleteBooking(bookingId) {
  const data = getData();
  data.bookings = data.bookings.filter(b => b.id !== bookingId);
  setData(data);
  return data.bookings;
}

export function getAvailability() { return getData().availability; }
export function blockDate(roomId, date, reason) {
  const data = getData();
  const existing = data.availability.find(a => a.roomId === roomId && a.date === date);
  if (existing) { existing.status = 'blocked'; existing.reason = reason; delete existing.bookingId; }
  else { data.availability.push({ roomId, date, status: 'blocked', reason }); }
  setData(data);
  return data.availability;
}
export function unblockDate(roomId, date) {
  const data = getData();
  data.availability = data.availability.filter(a => !(a.roomId === roomId && a.date === date));
  setData(data);
  return data.availability;
}

export function getMenu() { return getData().menu; }
export function updateMenu(menu) {
  const data = getData(); data.menu = menu; setData(data); return data.menu;
}

export function getCoupons() { return getData().coupons; }
export function updateCoupons(coupons) {
  const data = getData(); data.coupons = coupons; setData(data); return data.coupons;
}

export function getReviews() { return getData().reviews; }
export function updateReviews(reviews) {
  const data = getData(); data.reviews = reviews; setData(data); return data.reviews;
}

export function getGallery() { return getData().gallery; }
export function updateGallery(gallery) {
  const data = getData(); data.gallery = gallery; setData(data); return data.gallery;
}

export function getLegal() { return getData().legal; }
export function updateLegal(legal) {
  const data = getData(); data.legal = legal; setData(data); return data.legal;
}

export function getFaqs() { return getData().faqs; }
export function updateFaqs(faqs) {
  const data = getData(); data.faqs = faqs; setData(data); return data.faqs;
}

export function getSettings() { return getData().settings; }
export function updateSettings(settings) {
  const data = getData(); data.settings = settings; setData(data); return data.settings;
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  initStorage();
}

initStorage();