const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const viewBtnRegex = /<button className="admin-btn-sm admin-btn-outline">\s*<Edit01Icon size=\{14\} \/> View\s*<\/button>/g;
const newViewBtn = `<button className="admin-btn-sm admin-btn-outline" onClick={() => {
  const newStatus = prompt("Enter new status (Pending, Confirmed, Completed, Cancelled):", b.status);
  if (newStatus && newStatus !== b.status) {
    fetch('http://localhost/merakiliving_backend/api_bookings.php', {
      method: 'PUT', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id: b.id, status: newStatus })
    }).then(() => window.location.reload());
  }
}}>
  <Edit01Icon size={14} /> Edit
</button>`;

c = c.replace(viewBtnRegex, newViewBtn);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched Bookings View button.");
