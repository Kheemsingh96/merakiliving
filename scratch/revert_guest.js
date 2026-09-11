const fs = require('fs');
let guest = fs.readFileSync('src/Pages/GuestDetails/GuestDetails.js', 'utf8');

// 1. Remove rooms from default
guest = guest.replace(
  "const guests = storedGuests ? JSON.parse(storedGuests) : { adults: 2, children: 0, rooms: 1 };",
  "const guests = storedGuests ? JSON.parse(storedGuests) : { adults: 2, children: 0 };"
);

// 2. Remove guests.rooms from subtotal
guest = guest.replace(
  "const subtotal = pricePerNight * nights * guests.rooms;",
  "const subtotal = pricePerNight * nights;"
);

// 3. Remove Rooms from whatsapp message
guest = guest.replace(
  "        `Rooms: ${guests.rooms}\\n` +\n",
  ""
);

// 4. Remove from summary card
const summaryRoomsReg = /<div className="gd-summary-item">\s*<div className="gd-summary-icon">\s*<HugeiconsIcon icon=\{BedDoubleIcon\} size=\{16\} \/>\s*<\/div>\s*<div>\s*<span className="gd-summary-label">Rooms<\/span>\s*<span className="gd-summary-value">\{guests\.rooms\} Room\{guests\.rooms > 1 \? 's' : ''\}<\/span>\s*<\/div>\s*<\/div>/;
guest = guest.replace(summaryRoomsReg, "");

// 5. Remove from price breakdown
const priceBreakdownReg = /<span>Rs\.\{room\.price\} x \{nights\} night\{nights > 1 \? 's' : ''\} x \{guests\.rooms\} room\{guests\.rooms > 1 \? 's' : ''\}<\/span>/;
guest = guest.replace(priceBreakdownReg, "<span>Rs.{room.price} x {nights} night{nights > 1 ? 's' : ''}</span>");

fs.writeFileSync('src/Pages/GuestDetails/GuestDetails.js', guest);
console.log('GuestDetails.js updated.');
