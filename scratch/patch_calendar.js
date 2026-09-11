const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const calendarTabRegex = /function CalendarTab\(\) \{[\s\S]*?\}\s*function ManageRoomsTab\(\)/;
const calendarTabFixed = `function CalendarTab() {
  const [events, setEvents] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_bookings.php')
      .then(r => r.json()).then(d => {
        if(Array.isArray(d.data)) {
          setEvents(d.data.map(b => ({
             room: b.room_name, guest: b.guest_name,
             start: parseInt((b.check_in || "2026-10-01").split('-')[2]), end: parseInt((b.check_out || "2026-10-02").split('-')[2]),
             status: b.status
          })));
        }
      });
  }, []);
  return (
    <>
      <PageHeader title="Availability Calendar" subtitle="Manage room availability and block dates." />
      <div className="admin-card admin-card-padded">
        <div className="admin-calendar-header">
          <h2 className="admin-card-title">Current Month</h2>
          <div className="admin-calendar-nav">
            <button className="admin-btn-outline">Previous</button>
            <button className="admin-btn-outline">Next</button>
          </div>
        </div>
        <div className="admin-calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="admin-calendar-header-cell">{day}</div>
          ))}
          {[...Array(31)].map((_, i) => {
            const dayEvents = events.filter(e => i + 1 >= e.start && i + 1 <= e.end);
            return (
              <div key={i} className="admin-calendar-cell">
                <span className="admin-calendar-date">{i + 1}</span>
                {dayEvents.map((ev, idx) => (
                  <span key={idx} className={"admin-calendar-event " + (ev.status === 'Cancelled' ? 'maintenance' : '')}>
                    {ev.room} ({ev.guest})
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ManageRoomsTab()`;

c = c.replace(calendarTabRegex, calendarTabFixed);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched CalendarTab completely.");
