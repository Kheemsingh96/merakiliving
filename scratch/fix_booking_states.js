const fs = require('fs');
let c = fs.readFileSync('src/Pages/Booking/Booking.js', 'utf8');

c = c.replace(
  /const Booking = \(\{ setCurrentPage \}\) => \{\r?\n\s*const \[selectedThumb/,
  "const Booking = ({ setCurrentPage }) => {\n  const [roomAvailability, setRoomAvailability] = useState({});\n  const [displayRooms, setDisplayRooms] = useState(roomsData);\n  const [showBookedPopup, setShowBookedPopup] = useState(false);\n  const [selectedThumb"
);

fs.writeFileSync('src/Pages/Booking/Booking.js', c);
console.log('Fixed states!');
