const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

// DashboardTab
c = c.replace(/const \[roomStatuses, setRoomStatuses\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [roomStatuses, setRoomStatuses] = React.useState([]);');
c = c.replace(/const \[stats, setStats\] = React\.useState\(\{[\s\S]*?\}\);/, "const [stats, setStats] = React.useState({ totalBookings: '0', totalGuests: '0', totalRevenue: '₹0', occupancyRate: '0%' });");
c = c.replace(/const \[recentBookings, setRecentBookings\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [recentBookings, setRecentBookings] = React.useState([]);');

// BookingsTab
c = c.replace(/const \[bookings, setBookings\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [bookings, setBookings] = React.useState([]);');

// CalendarTab
c = c.replace(/const \[events, setEvents\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [events, setEvents] = React.useState([]);');

// ManageRoomsTab
c = c.replace(/const \[rooms, setRooms\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [rooms, setRooms] = React.useState([]);');

// PricingTab
c = c.replace(/const \[rooms, setRooms\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [rooms, setRooms] = React.useState([]);');

// CafeFeaturedTab
c = c.replace(/const items = \[\s*\{[\s\S]*?\];/, 'const [items, setItems] = React.useState([]);');

// CafeMenuTab
c = c.replace(/const allItems = \[\s*\{[\s\S]*?\];/, 'const [allItems, setAllItems] = React.useState([]);');

// GuestsTab
c = c.replace(/const \[guests, setGuests\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [guests, setGuests] = React.useState([]);');

// PaymentsTab
c = c.replace(/const \[payments, setPayments\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [payments, setPayments] = React.useState([]);');

// CouponsTab
c = c.replace(/const \[coupons, setCoupons\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [coupons, setCoupons] = React.useState([]);');

// GalleryTab
c = c.replace(/const \[images, setImages\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [images, setImages] = React.useState([]);');

// ReviewsTab
c = c.replace(/const \[reviews, setReviews\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, 'const [reviews, setReviews] = React.useState([]);');

// PoliciesTab
c = c.replace(/const \[policies, setPolicies\] = React\.useState\(\{[\s\S]*?\}\);/, "const [policies, setPolicies] = React.useState({ privacyPolicy: '', terms: '', cancellation: '' });");

// SettingsTab
c = c.replace(/const \[settings, setSettings\] = React\.useState\(\{[\s\S]*?\}\);/, "const [settings, setSettings] = React.useState({ gst: '', phone: '', email: '', address: '' });");

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Replaced all initial states with empty arrays/objects.");
