const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.css', 'utf8');
c = c.replace('.room-status-badge { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; flex: 1; }', '.room-status-badge { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px; border-radius: 12px; flex: 1; }');
c = c.replace('.room-status-badge .status-label { font-size: 12px; color: inherit; opacity: 0.8; margin-bottom: 2px; }', '.room-status-badge .status-label { font-size: 12px; color: inherit; opacity: 0.7; font-weight: 500; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }');
c = c.replace('.room-status-badge .status-val { font-size: 18px; font-weight: 700; color: inherit; line-height: 1; }', '.room-status-badge .status-val { font-size: 22px; font-weight: 700; color: inherit; line-height: 1; }');
fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.css', c);
console.log('Fixed room status badges');
