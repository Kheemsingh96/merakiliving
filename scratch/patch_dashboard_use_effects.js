const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const insertAfter = (str, target, insert) => {
  const index = str.indexOf(target);
  if (index === -1) return str;
  const insertIndex = index + target.length;
  return str.slice(0, insertIndex) + '\n' + insert + str.slice(insertIndex);
};

// 1. DashboardTab: fetch dashboard stats
c = insertAfter(c, 'const [recentBookings, setRecentBookings] = React.useState([]);', `
  const [notifications, setNotifications] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resStats = await fetch('http://localhost/merakiliving_backend/api_dashboard_stats.php');
        if (resStats.ok) {
          const data = await resStats.json();
          setStats(data.stats);
          setRecentBookings(data.recentBookings);
          setRoomStatuses(data.roomStatuses);
        }
        const resNotif = await fetch('http://localhost/merakiliving_backend/api_notifications.php');
        if (resNotif.ok) {
          const nData = await resNotif.json();
          if (Array.isArray(nData.data)) setNotifications(nData.data);
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);
`);

// Modify notifications render
c = c.replace(/<div className="dropdown-header">Notifications \(2\)<\/div>[\s\S]*?<\/div>\s*<\/div>/, `<div className="dropdown-header">Notifications ({notifications.length})</div>
                    {notifications.map(n => (
                      <div className="dropdown-item" key={n.id}>
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                      </div>
                    ))}
                  </div>
                </>`);
c = c.replace(/<span className="admin-notification-badge">2<\/span>/, '<span className="admin-notification-badge">{notifications.length}</span>');

// Dashboard tab mappings
c = c.replace(/<span className="admin-stat-value">\{stats\.totalBookings\}<\/span>/, '<span className="admin-stat-value">{stats.totalBookings}</span>');
// wait, the original was hardcoded!
c = c.replace(/<span className="admin-stat-value">128<\/span>/, '<span className="admin-stat-value">{stats.totalBookings}</span>');
c = c.replace(/<span className="admin-stat-value">256<\/span>/, '<span className="admin-stat-value">{stats.totalGuests}</span>');
c = c.replace(/<span className="admin-stat-value">,11,48,750<\/span>/, '<span className="admin-stat-value">{stats.totalRevenue}</span>');
c = c.replace(/<span className="admin-stat-value">76%<\/span>/, '<span className="admin-stat-value">{stats.occupancyRate}</span>');

// Map recent bookings correctly
c = c.replace(/<h4>\{b\.name\}<\/h4>/g, '<h4>{b.guest_name || b.name}</h4>');
c = c.replace(/<p>\{b\.room\}<\/p>/g, '<p>{b.room_name || b.room}</p>');
c = c.replace(/<span>\{b\.dates\}<\/span>/g, '<span>{b.check_in} to {b.check_out}</span>');


fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched DashboardTab.");
