const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const waRegex = /<button className="admin-btn-sm admin-btn-whatsapp">/g;
const newWa = `<button className="admin-btn-sm admin-btn-whatsapp" onClick={() => window.open('https://wa.me/' + (typeof b !== 'undefined' ? b.guest_phone : g.phone), '_blank')}>`;

c = c.replace(waRegex, newWa);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched WA button.");
