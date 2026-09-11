const fs = require('fs');

let booking = fs.readFileSync('src/Pages/Booking/Booking.js', 'utf8');

// 1. Remove 'rooms' from defaultGuests
booking = booking.replace(
  "const defaultGuests = storedGuests ? JSON.parse(storedGuests) : { adults: 2, children: 0, rooms: 1 };",
  "const defaultGuests = storedGuests ? JSON.parse(storedGuests) : { adults: 2, children: 0 };"
);

// 2. Remove guests.rooms manipulation in handleGuestChange
booking = booking.replace(
  "          if (type === 'rooms' && prev.rooms <= 1) return prev;\n          newGuests[type] = prev[type] - 1;\n        }\n        if (type === 'adults') {\n          newGuests.rooms = Math.max(newGuests.rooms, Math.ceil(newGuests.adults / 3));\n        }",
  "          newGuests[type] = prev[type] - 1;\n        }"
);

// 3. Remove Rooms from bookingData
booking = booking.replace(
  "      rooms: guests.rooms,",
  ""
);

// 4. Update totalPrice
booking = booking.replace(
  "const totalPrice = price * nights * guests.rooms;",
  "const totalPrice = price * nights;"
);

// 5. Remove Rooms row from renderGuestsDropdown
const roomsDropdownReg = /<div className="guest-row">\s*<div className="guest-info">\s*<span className="guest-type">Rooms<\/span>\s*<span className="guest-desc">Number of rooms<\/span>\s*<\/div>\s*<div className="guest-controls">\s*<button className="guest-btn" onClick=\{\(e\) => \{ e\.stopPropagation\(\); handleGuestChange\('rooms', 'subtract'\); \}\} disabled=\{guests\.rooms <= 1\}><HugeiconsIcon icon=\{MinusSignIcon\} size=\{16\} \/><\/button>\s*<span className="guest-count">\{guests\.rooms\}<\/span>\s*<button className="guest-btn" onClick=\{\(e\) => \{ e\.stopPropagation\(\); handleGuestChange\('rooms', 'add'\); \}\}><HugeiconsIcon icon=\{PlusSignIcon\} size=\{16\} \/><\/button>\s*<\/div>\s*<\/div>/;

booking = booking.replace(roomsDropdownReg, "");

// 6. Remove Rooms from search label
booking = booking.replace(
  '<span className="booking-search-label">Guests & Rooms</span>',
  '<span className="booking-search-label">Guests</span>'
);

booking = booking.replace(
  /<span className="booking-search-value">\{guests\.adults \+ guests\.children\} Guests, \{guests\.rooms\} Room\{guests\.rooms > 1 \? 's' : ''\}<\/span>/,
  '<span className="booking-search-value">{guests.adults + guests.children} Guests</span>'
);

// 7. Remove Rooms from results subtitle
booking = booking.replace(
  /\{guests\.rooms > 1 && \(\s*<>\s*<span className="results-dot">&#8226;<\/span>\s*\{guests\.rooms\} Rooms\s*<\/>\s*\)\}/,
  ""
);

fs.writeFileSync('src/Pages/Booking/Booking.js', booking);
console.log('Booking.js updated.');
