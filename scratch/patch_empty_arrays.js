const fs = require('fs');

let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

// 1. DashboardTab: setRoomStatuses and setRecentBookings
c = c.replace(/const \[roomStatuses, setRoomStatuses\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, `const [roomStatuses, setRoomStatuses] = React.useState([]);`);
c = c.replace(/const \[recentBookings, setRecentBookings\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, `const [recentBookings, setRecentBookings] = React.useState([]);`);

// 2. BookingsTab: setBookings
c = c.replace(/const \[bookings, setBookings\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, `const [bookings, setBookings] = React.useState([]);`);

// 3. ManageRoomsTab: setRooms
c = c.replace(/const \[rooms, setRooms\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, `const [rooms, setRooms] = React.useState([]);`);

// 4. PricingTab: setRooms
c = c.replace(/const \[rooms, setRooms\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, `const [rooms, setRooms] = React.useState([]);`);

// 5. GuestsTab: setGuests
c = c.replace(/const \[guests, setGuests\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, `const [guests, setGuests] = React.useState([]);`);

// 6. PaymentsTab: setPayments
c = c.replace(/const \[payments, setPayments\] = React\.useState\(\[\s*\{[\s\S]*?\}\s*\]\);/, `const [payments, setPayments] = React.useState([]);`);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched empty arrays");
