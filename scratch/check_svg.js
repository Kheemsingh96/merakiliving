const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');
console.log(c.substring(c.indexOf('<svg width="100%"'), c.indexOf('</svg>') + 6));
