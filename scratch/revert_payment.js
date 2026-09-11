const fs = require('fs');
let payment = fs.readFileSync('src/Pages/Payment/Payment.js', 'utf8');

// 1. Remove rooms from default
payment = payment.replace(
  "const guests = storedGuests ? JSON.parse(storedGuests) : { adults: 2, children: 0, rooms: 1 };",
  "const guests = storedGuests ? JSON.parse(storedGuests) : { adults: 2, children: 0 };"
);

// 2. Remove guests.rooms from subtotal
payment = payment.replace(
  "const subtotal = pricePerNight * nights * guests.rooms;",
  "const subtotal = pricePerNight * nights;"
);

// 3. Remove from price breakdown
const priceBreakdownReg = /<span>Rs\.\{room\.price\} x \{nights\} night\{nights > 1 \? 's' : ''\} x \{guests\.rooms\} room\{guests\.rooms > 1 \? 's' : ''\}<\/span>/;
payment = payment.replace(priceBreakdownReg, "<span>Rs.{room.price} x {nights} night{nights > 1 ? 's' : ''}</span>");

fs.writeFileSync('src/Pages/Payment/Payment.js', payment);
console.log('Payment.js updated.');
