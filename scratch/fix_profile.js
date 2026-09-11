const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');
c = c.replace("import room4 from '../../../assets/images/room-4.webp';", "import room4 from '../../../assets/images/room-4.webp';\nimport founder from '../../../assets/images/founder.webp';");
c = c.replace('<div className="admin-sidebar-footer-profile-img">P</div>', '<img src={founder} alt="Admin" className="admin-sidebar-footer-profile-img" style={{objectFit:"cover"}} />');
fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log('Fixed profile image');
