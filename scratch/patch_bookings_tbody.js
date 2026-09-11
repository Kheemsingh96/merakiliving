const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const bookingsTbodyRegex = /<tbody>[\s\S]*?<\/tbody>/;
const newBookingsTbody = `<tbody>
              {bookings.map(b => (
              <tr key={b.id}>
                <td className="admin-text-mono">#BK-{b.id}</td>
                <td>
                  <div className="admin-cell-stack">
                    <span>{b.guest_name}</span>
                    <span className="admin-cell-muted">{b.guest_phone}</span>
                  </div>
                </td>
                <td>{b.room_name}</td>
                <td>
                  <div className="admin-cell-stack">
                    <span>{b.check_in} to {b.check_out}</span>
                    <span className="admin-cell-muted"></span>
                  </div>
                </td>
                <td className="admin-text-medium">₹{b.room_price}</td>
                <td><span className={"admin-badge badge-" + (b.status === 'Confirmed' ? 'success' : b.status === 'Pending' ? 'warning' : 'info')}>{b.status}</span></td>
                <td>
                  <div className="admin-action-group">
                    <button className="admin-btn-sm admin-btn-outline" onClick={() => {
                      const newStatus = prompt("Enter new status (Pending, Confirmed, Completed, Cancelled):", b.status);
                      if (newStatus && newStatus !== b.status) {
                        fetch('http://localhost/merakiliving_backend/api_bookings.php', {
                          method: 'PUT', headers: {'Content-Type': 'application/json'},
                          body: JSON.stringify({ id: b.id, status: newStatus })
                        }).then(() => window.location.reload());
                      }
                    }}>
                      <Edit01Icon size={14} /> Edit
                    </button>
                    <button className="admin-btn-sm admin-btn-whatsapp" onClick={() => window.open('https://wa.me/' + b.guest_phone, '_blank')}>
                      <WhatsappIcon size={14} />
                    </button>
                  </div>
                </td>
              </tr>
              ))}
            </tbody>`;

// Notice: replacing the FIRST <tbody> which belongs to BookingsTab.
c = c.replace(bookingsTbodyRegex, newBookingsTbody);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched BookingsTab tbody.");
