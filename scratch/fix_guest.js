const fs = require('fs');
let guest = fs.readFileSync('src/Pages/GuestDetails/GuestDetails.js', 'utf8');

// For Whatsapp:
const msgStart = guest.indexOf('`Rooms: ${guests.rooms}\\n` +');
if (msgStart !== -1) {
  const msgEnd = guest.indexOf('\\n', msgStart) + 3;
  guest = guest.substring(0, msgStart) + guest.substring(msgEnd);
} else {
  // Let's use regex
  guest = guest.replace(/ {8}`Rooms: \$\{guests\.rooms\}\\n` \+\n/, "");
}

// For Summary card:
guest = guest.replace(/ {12}<div className="gd-summary-item">\s*<div className="gd-summary-icon">\s*<HugeiconsIcon icon=\{BedDoubleIcon\} size=\{16\} \/>\s*<\/div>\s*<div>\s*<span className="gd-summary-label">Rooms<\/span>\s*<span className="gd-summary-value">\{guests\.rooms\} Room\{guests\.rooms > 1 \? 's' : ''\}<\/span>\s*<\/div>\s*<\/div>/, "");

fs.writeFileSync('src/Pages/GuestDetails/GuestDetails.js', guest);
console.log('Done.');
