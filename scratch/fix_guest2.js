const fs = require('fs');
let guest = fs.readFileSync('src/Pages/GuestDetails/GuestDetails.js', 'utf8');

const regex = /<div className="gd-summary-item">\s*<div className="gd-summary-icon">\s*<HugeiconsIcon icon=\{BedDoubleIcon\} size=\{16\} \/>\s*<\/div>\s*<div>\s*<span className="gd-summary-label">Rooms<\/span>\s*<span className="gd-summary-value">\{guests\.rooms\} Room\{guests\.rooms > 1 \? 's' : ''\}<\/span>\s*<\/div>\s*<\/div>/g;

guest = guest.replace(/<div className="gd-summary-item">\s*<div className="gd-summary-icon">\s*<HugeiconsIcon icon=\{BedDoubleIcon\} size=\{16\} \/>\s*<\/div>\s*<div>\s*<span className="gd-summary-label">Rooms<\/span>\s*<span className="gd-summary-value">\{guests\.rooms\} Room\{guests\.rooms > 1 \? 's' : ''\}<\/span>\s*<\/div>\s*<\/div>/g, "");

// also whatsapp
guest = guest.replace(/`Rooms: \$\{guests\.rooms\}\\n` \+\r?\n\s*/g, "");

fs.writeFileSync('src/Pages/GuestDetails/GuestDetails.js', guest);
