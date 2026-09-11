const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

c = c.replace(/function BookingsTab\(\) \{\s*return \(/, `function BookingsTab() {
  const [bookings, setBookings] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_bookings.php')
      .then(r => r.json()).then(d => { if(Array.isArray(d.data)) setBookings(d.data); });
  }, []);
  return (`);

c = c.replace(/function GuestsTab\(\) \{\s*return \(/, `function GuestsTab() {
  const [guests, setGuests] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_guests.php')
      .then(r => r.json()).then(d => { if(Array.isArray(d.data)) setGuests(d.data); });
  }, []);
  return (`);

const guestsTbodyRegex = /<tbody>[\s\S]*?<\/tbody>/g;
let tbodyCount = 0;
c = c.replace(guestsTbodyRegex, (match) => {
  tbodyCount++;
  if (tbodyCount === 2) {
    return '<tbody>' +
              '{guests.map(g => (' +
                '<tr key={g.id}>' +
                  '<td className="admin-text-medium">{g.name}</td>' +
                  '<td>' +
                    '<div className="admin-cell-stack">' +
                      '<span>{g.email}</span>' +
                      '<span className="admin-cell-muted">{g.phone}</span>' +
                    '</div>' +
                  '</td>' +
                  '<td>{g.total_stays || 0}</td>' +
                  '<td>{g.last_room || "N/A"}</td>' +
                  '<td>' +
                    '<button className="admin-btn-sm admin-btn-outline" onClick={() => alert(g.name + " has " + (g.total_stays||0) + " stays.")}>History</button>' +
                  '</td>' +
                '</tr>' +
              '))}' +
            '</tbody>';
  }
  return match;
});

c = c.replace(/function CalendarTab\(\) \{\s*return \(/, `function CalendarTab() {
  const [events, setEvents] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_bookings.php')
      .then(r => r.json()).then(d => {
        if(Array.isArray(d.data)) {
          setEvents(d.data.map(b => ({
             room: b.room_name, guest: b.guest_name,
             start: parseInt((b.check_in || "2026-08-01").split('-')[2]), end: parseInt((b.check_out || "2026-08-02").split('-')[2]),
             status: b.status
          })));
        }
      });
  }, []);
  return (`);

c = c.replace(/\{events\.map\(\(ev, i\) => \([\s\S]*?\}\)/, `{events.map((ev, i) => (
                    <div key={i} className={"calendar-event event-" + ev.status.toLowerCase()} style={{gridColumn: ev.start + " / " + ev.end}}>
                      <span className="calendar-event-title">{ev.room} ({ev.guest})</span>
                    </div>
                  ))}`);

c = c.replace(/function PaymentsTab\(\) \{\s*return \(/, `function PaymentsTab() {
  const [payments, setPayments] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_payments.php')
      .then(r => r.json()).then(d => { if(Array.isArray(d.data)) setPayments(d.data); });
  }, []);
  return (`);

let tbodyCountPayments = 0;
c = c.replace(/<tbody>[\s\S]*?<\/tbody>/g, (match) => {
  tbodyCountPayments++;
  if (tbodyCountPayments === 3) { 
    return '<tbody>' +
              '{payments.map(p => (' +
                '<tr key={p.id}>' +
                  '<td className="admin-text-mono">{p.razorpay_payment_id || p.id}</td>' +
                  '<td className="admin-text-medium">#BK-{p.booking_id || p.ref}</td>' +
                  '<td className="admin-text-medium">₹{p.amount}</td>' +
                  '<td>Credit Card</td>' +
                  '<td>{new Date().toLocaleDateString()}</td>' +
                  '<td><span className={"admin-badge badge-" + (p.status === "Success" ? "success" : "warning")}>{p.status}</span></td>' +
                  '<td><button className="admin-btn-sm admin-btn-outline">Receipt</button></td>' +
                '</tr>' +
              '))}' +
            '</tbody>';
  }
  return match;
});

c = c.replace(/function CouponsTab\(\) \{\s*return \(/, `function CouponsTab() {
  const [coupons, setCoupons] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_coupons.php')
      .then(r => r.json()).then(d => { if(Array.isArray(d.data)) setCoupons(d.data); });
  }, []);
  return (`);

let tbodyCountCoupons = 0;
c = c.replace(/<tbody>[\s\S]*?<\/tbody>/g, (match) => {
  tbodyCountCoupons++;
  if (tbodyCountCoupons === 4) { 
    return '<tbody>' +
              '{coupons.map(c => (' +
                '<tr key={c.coupon_id}>' +
                  '<td className="admin-text-mono">{c.code}</td>' +
                  '<td>{c.discount_percentage}%</td>' +
                  '<td><span className={"admin-badge badge-" + (c.status === "Active" ? "success" : "danger")}>{c.status}</span></td>' +
                  '<td><button className="admin-btn-sm admin-btn-outline" onClick={() => {' +
                     'fetch("http://localhost/merakiliving_backend/api_coupons.php", { method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify({coupon_id: c.coupon_id}) }).then(()=>window.location.reload());' +
                  '}}>Delete</button></td>' +
                '</tr>' +
              '))}' +
            '</tbody>';
  }
  return match;
});

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched Missing UseStates and Maps.");
