const fs = require('fs');

let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

let newPaymentsMap = `              {payments.map((p, i) => (
                <tr key={i}>
                  <td className="admin-text-mono">{p.razorpay_payment_id || p.id}</td>
                  <td className="admin-text-medium">#BK-{p.booking_id || p.ref}</td>
                  <td className="admin-text-medium">₹{p.amount}</td>
                  <td>N/A</td>
                  <td><span className={\`admin-badge badge-\${p.status?.toLowerCase() === 'success' ? 'success' : 'warning'}\`}>{p.status}</span></td>
                </tr>
              ))}`;

c = c.replace(/\{\s*payments\.map\(\(p, i\) => \([\s\S]*?\)\)\s*\}/, newPaymentsMap);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched payments map");
