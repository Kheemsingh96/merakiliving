const fs = require('fs');
let guest = fs.readFileSync('src/Pages/GuestDetails/GuestDetails.js', 'utf8');

const str = '<div className="gd-summary-item">\n              <div className="gd-summary-icon">\n                <HugeiconsIcon icon={BedDoubleIcon} size={16} />\n              </div>\n              <div>\n                <span className="gd-summary-label">Rooms</span>\n                <span className="gd-summary-value">{guests.rooms} Room{guests.rooms > 1 ? \\'s\\' : \\'\\'}</span>\n              </div>\n            </div>';

// use string parsing to remove that section by matching 'Rooms</span>'
const idx = guest.indexOf('<span className="gd-summary-label">Rooms</span>');
if (idx !== -1) {
  const start = guest.lastIndexOf('<div className="gd-summary-item">', idx);
  const end = guest.indexOf('</div>\n            </div>', idx) + 24;
  guest = guest.substring(0, start) + guest.substring(end);
}

fs.writeFileSync('src/Pages/GuestDetails/GuestDetails.js', guest);
console.log('done.');
