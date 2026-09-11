const fs = require('fs');
let booking = fs.readFileSync('src/Pages/Booking/Booking.js', 'utf8');

booking = booking.replace(
  "        if (type === 'adults') {\n          newGuests.rooms = Math.max(newGuests.rooms, Math.ceil(newGuests.adults / 3));\n        }",
  ""
);

fs.writeFileSync('src/Pages/Booking/Booking.js', booking);
