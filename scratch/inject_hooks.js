const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const hookInject = `  const [stats, setStats] = React.useState({ totalBookings: '0', totalGuests: '0', totalRevenue: '₹0', occupancyRate: '0%' });
  const [recentBookings, setRecentBookings] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resStats = await fetch('http://localhost/merakiliving_backend/api_dashboard_stats.php');
        if (resStats.ok) {
          const data = await resStats.json();
          if (data.stats) setStats(data.stats);
          if (data.recentBookings) setRecentBookings(data.recentBookings);
          if (data.roomStatuses) setRoomStatuses(data.roomStatuses);
        }
        const resNotif = await fetch('http://localhost/merakiliving_backend/api_notifications.php');
        if (resNotif.ok) {
          const nData = await resNotif.json();
          if (Array.isArray(nData.data)) setNotifications(nData.data);
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);`;

c = c.replace(/const \[roomStatuses, setRoomStatuses\] = React\.useState\(\[\]\);/, `const [roomStatuses, setRoomStatuses] = React.useState([]);\n${hookInject}`);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Injected hooks into DashboardTab.");
