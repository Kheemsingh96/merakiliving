const fs = require('fs');

let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

let newBookingsMap = `              {bookings.map((b, i) => (
                <tr key={i}>
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
                  <td><span className={\`admin-badge badge-\${b.status?.toLowerCase() === 'pending' ? 'info' : 'success'}\`}>{b.status}</span></td>
                  <td>
                    <div className="admin-action-group">
                      <button className="admin-btn-sm admin-btn-outline">
                        <Edit01Icon size={14} /> View
                      </button>
                      <button className="admin-btn-sm admin-btn-whatsapp">
                        <WhatsappIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}`;

c = c.replace(/\{\s*bookings\.map\(\(b, i\) => \([\s\S]*?\)\)\s*\}/, newBookingsMap);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched bookings map");
