const fs = require('fs');
let guest = fs.readFileSync('src/Pages/GuestDetails/GuestDetails.js', 'utf8');

guest = guest.replace(/<div className="gd-summary-item">\s*<HugeiconsIcon icon=\{BedDoubleIcon\} size=\{16\} \/>\s*<div>\s*<span className="gd-summary-label">Rooms<\/span>\s*<span className="gd-summary-value">\{guests\.rooms\} Room\{guests\.rooms > 1 \? 's' : ''\}<\/span>\s*<\/div>\s*<\/div>/g, "");

fs.writeFileSync('src/Pages/GuestDetails/GuestDetails.js', guest);
