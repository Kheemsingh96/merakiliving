const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

c = c.replace(/<span className="admin-stat-value">.*?1,48,750<\/span>/, '<span className="admin-stat-value">{stats.totalRevenue}</span>');

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched Revenue stat.");
