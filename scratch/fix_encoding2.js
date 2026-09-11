const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

c = c.split("'?4,500'").join("'?4,500'");
c = c.split("'?3,800'").join("'?3,800'");
c = c.split("'?7,200'").join("'?7,200'");
c = c.split("'?18,000'").join("'?18,000'");
c = c.split(">?1,48,750<").join(">?1,48,750<");
c = c.split("Price (?)").join("Price (?)");
c = c.split("admin-price-symbol\">?<").join("admin-price-symbol\">?<");
c = c.split(">? 18.6%<").join(">? 18.6%<");
c = c.split(">? 22.4%<").join(">? 22.4%<");
c = c.split(">? 16.8%<").join(">? 16.8%<");
c = c.split(">? 8.4%<").join(">? 8.4%<");

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c, 'utf8');
console.log('Fixed exactly using split join');
