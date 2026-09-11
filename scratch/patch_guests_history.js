const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const historyBtnRegex = /<button className="admin-btn-sm admin-btn-outline">History<\/button>/g;
const newHistoryBtn = `<button className="admin-btn-sm admin-btn-outline" onClick={() => alert(\`\${g.name} has \${g.total_stays} total stays. Last stayed in \${g.last_room}.\`)}>History</button>`;

c = c.replace(historyBtnRegex, newHistoryBtn);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched Guests History button.");
