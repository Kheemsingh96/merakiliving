const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

c = c.replace(/if \(Array\.isArray\(data\)\) setBookings\(data\);/g, 'if (Array.isArray(data.data)) setBookings(data.data);');
c = c.replace(/if \(Array\.isArray\(data\)\) setRooms\(data\);/g, 'if (Array.isArray(data.data)) setRooms(data.data);');
c = c.replace(/if \(Array\.isArray\(data\)\) setGuests\(data\);/g, 'if (Array.isArray(data.data)) setGuests(data.data);');
c = c.replace(/if \(Array\.isArray\(data\)\) setPayments\(data\);/g, 'if (Array.isArray(data.data)) setPayments(data.data);');

c = c.replace(/<td>\{g\.totalStays\}<\/td>/g, '<td>{g.total_stays || 0}</td>');
c = c.replace(/<td>\{g\.lastRoom\}<\/td>/g, '<td>{g.last_room || "N/A"}</td>');

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched data structure and Guest mapping");
