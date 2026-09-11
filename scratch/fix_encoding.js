const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

c = c.replace(/price: '\?4,500'/g, "price: '?4,500'");
c = c.replace(/price: '\?3,800'/g, "price: '?3,800'");
c = c.replace(/price: '\?7,200'/g, "price: '?7,200'");
c = c.replace(/price: '\?18,000'/g, "price: '?18,000'");
c = c.replace(/>\?1,48,750</g, '>?1,48,750<');
c = c.replace(/Price \(\?\)/g, 'Price (?)');
c = c.replace(/admin-price-symbol\">\?</g, 'admin-price-symbol\">?<');
c = c.replace(/>\? 18\.6%</g, '>? 18.6%<');
c = c.replace(/>\? 22\.4%</g, '>? 22.4%<');
c = c.replace(/>\? 16\.8%</g, '>? 16.8%<');
c = c.replace(/>\? 8\.4%</g, '>? 8.4%<');

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c, 'utf8');
console.log('Fixed rupees and arrows');
