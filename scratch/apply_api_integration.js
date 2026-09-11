const fs = require('fs');
const path = require('path');

let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

// DashboardTab
const dashboardMatch = c.match(/function DashboardTab\(\) \{[\s\S]*?(?=function BookingsTab\(\) \{)/);
if (dashboardMatch) {
    let newDashboard = `function DashboardTab() {
  const [showDateDropdownTop, setShowDateDropdownTop] = React.useState(false);
  const [showDateDropdownChart, setShowDateDropdownChart] = React.useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = React.useState(false);
  const [dateRange, setDateRange] = React.useState('Last 7 Days');
  
  const [roomStatuses, setRoomStatuses] = React.useState([
    { id: 1, name: 'Himalayan View Room', img: room1, status: 'Booked', color: '#dc2626', bg: '#fef2f2', price: '₹4,500' },
    { id: 2, name: 'Premium Valley Room', img: room2, status: 'Available', color: '#16a34a', bg: '#f0fdf4', price: '₹3,800' },
    { id: 3, name: 'Luxury Family Suite', img: room3, status: 'Booked', color: '#dc2626', bg: '#fef2f2', price: '₹7,200' },
    { id: 4, name: 'Entire Homestay', img: room4, status: 'Available', color: '#16a34a', bg: '#f0fdf4', price: '₹18,000' }
  ]);

  const [stats, setStats] = React.useState({
    totalBookings: '128',
    totalGuests: '256',
    totalRevenue: '₹1,48,750',
    occupancyRate: '76%'
  });

  const [recentBookings, setRecentBookings] = React.useState([
    { id: 1, img: room1, name: 'John Doe', room: 'Himalayan View Room', dates: '24 May - 27 May 2024', status: 'Confirmed' },
    { id: 2, img: room3, name: 'Emily Johnson', room: 'Luxury Family Suite', dates: '25 May - 28 May 2024', status: 'Pending' },
    { id: 3, img: room2, name: 'Michael Brown', room: 'Premium Valley Room', dates: '26 May - 29 May 2024', status: 'Confirmed' },
    { id: 4, img: room4, name: 'Sarah Wilson', room: 'Entire Homestay', dates: '27 May - 28 May 2024', status: 'Cancelled' }
  ]);

  React.useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_dashboard_stats.php');
        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(prev => ({ ...prev, ...data.stats }));
          if (data.roomStatuses) setRoomStatuses(data.roomStatuses);
          if (data.recentBookings) setRecentBookings(data.recentBookings);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };
    fetchDashboardStats();
  }, []);

  const toggleStatus = (id) => {
    setRoomStatuses(prev => prev.map(r => {
      if (r.id === id) {
        const isAvailable = r.status === 'Available';
        return {
          ...r,
          status: isAvailable ? 'Booked' : 'Available',
          color: isAvailable ? '#dc2626' : '#16a34a',
          bg: isAvailable ? '#fef2f2' : '#f0fdf4'
        };
      }
      return r;
    }));
  };

  return (
    <div className="admin-fade-in">
      <div className="admin-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle" style={{color: '#555', fontWeight: '500'}}>Welcome back Admin! Here's what's happening today </p>
        </div>
        <div className="admin-header-actions" style={{ alignItems: 'center' }}>
          
          <div style={{position: 'relative'}}>
            <div 
              className="admin-date-selector" 
              onClick={(e) => { e.stopPropagation(); setShowDateDropdownTop(prev => !prev); setShowNotificationDropdown(false); }}
            >
              <Calendar01Icon size={18} strokeWidth={1.5} />
              <span style={{fontWeight: '500', color: '#373737'}}>{dateRange}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            {showDateDropdownTop && (
              <>
                <div className="admin-click-away" onClick={() => setShowDateDropdownTop(false)}></div>
                <div className="admin-dropdown-menu admin-fade-in">
                  <div className={\`dropdown-item \${dateRange === 'Last 7 Days' ? 'active' : ''}\`} onClick={() => {setDateRange('Last 7 Days'); setShowDateDropdownTop(false)}}>Last 7 Days</div>
                  <div className={\`dropdown-item \${dateRange === 'Last 30 Days' ? 'active' : ''}\`} onClick={() => {setDateRange('Last 30 Days'); setShowDateDropdownTop(false)}}>Last 30 Days</div>
                  <div className={\`dropdown-item \${dateRange === 'This Month' ? 'active' : ''}\`} onClick={() => {setDateRange('This Month'); setShowDateDropdownTop(false)}}>This Month</div>
                </div>
              </>
            )}
          </div>

          <div style={{position: 'relative'}}>
            <button 
              className="admin-icon-btn" 
              onClick={(e) => { e.stopPropagation(); setShowNotificationDropdown(prev => !prev); setShowDateDropdownTop(false); }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="admin-notification-badge">2</span>
            </button>
            {showNotificationDropdown && (
              <>
                <div className="admin-click-away" onClick={() => setShowNotificationDropdown(false)}></div>
                <div className="admin-dropdown-menu notification-menu admin-fade-in">
                  <div className="dropdown-header">Notifications (2)</div>
                  <div className="dropdown-item">
                    <strong>New Booking!</strong>
                    <p>John Doe booked Luxury Cottage</p>
                  </div>
                  <div className="dropdown-item">
                    <strong>Cancellation</strong>
                    <p>Sarah Wilson cancelled standard room.</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="admin-icon-btn logout-top-btn" onClick={() => { sessionStorage.removeItem('meraki_admin_auth'); window.location.reload(); }}>
            <Logout01Icon size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="admin-grid-4">
        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header">
              <div className="admin-stat-icon white-icon">
                <Calendar01Icon size={20} strokeWidth={1.5} />
              </div>
              <span className="admin-stat-label">Total Bookings</span>
            </div>
            <div className="admin-stat-row">
              <span className="admin-stat-value">{stats.totalBookings}</span>
              <span className="admin-stat-trend positive">↑ 18.6%</span>
            </div>
            <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
          </div>
        </div>

        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header">
              <div className="admin-stat-icon white-icon">
                <UserGroupIcon size={20} strokeWidth={1.5} />
              </div>
              <span className="admin-stat-label">Total Guests</span>
            </div>
            <div className="admin-stat-row">
              <span className="admin-stat-value">{stats.totalGuests}</span>
              <span className="admin-stat-trend positive">↑ 22.4%</span>
            </div>
            <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
          </div>
        </div>

        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header">
              <div className="admin-stat-icon white-icon">
                <Wallet01Icon size={20} strokeWidth={1.5} />
              </div>
              <span className="admin-stat-label">Total Revenue</span>
            </div>
            <div className="admin-stat-row">
              <span className="admin-stat-value">{stats.totalRevenue}</span>
              <span className="admin-stat-trend positive">↑ 16.8%</span>
            </div>
            <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
          </div>
        </div>

        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header">
              <div className="admin-stat-icon white-icon">
                <BedDoubleIcon size={20} strokeWidth={1.5} />
              </div>
              <span className="admin-stat-label">Occupancy Rate</span>
            </div>
            <div className="admin-stat-row">
              <span className="admin-stat-value">{stats.occupancyRate}</span>
              <span className="admin-stat-trend positive">↑ 8.4%</span>
            </div>
            <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
          </div>
        </div>
      </div>

      <div className="admin-grid-2-layout">
        <div className="admin-card" style={{flex: '2'}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Booking Overview</h2>
            <div className="admin-filter-dropdown" onClick={(e) => { e.stopPropagation(); setShowDateDropdownChart(prev => !prev); }}>
              <span style={{fontWeight: '500', color: '#373737'}}>{dateRange}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
              {showDateDropdownChart && (
                <>
                  <div className="admin-click-away" onClick={(e) => {e.stopPropagation(); setShowDateDropdownChart(false);}}></div>
                  <div className="admin-dropdown-menu admin-fade-in" style={{top: '100%', right: '0', marginTop: '8px'}}>
                    <div className={\`dropdown-item \${dateRange === 'Last 7 Days' ? 'active' : ''}\`} onClick={(e) => {e.stopPropagation(); setDateRange('Last 7 Days'); setShowDateDropdownChart(false)}}>Last 7 Days</div>
                    <div className={\`dropdown-item \${dateRange === 'Last 30 Days' ? 'active' : ''}\`} onClick={(e) => {e.stopPropagation(); setDateRange('Last 30 Days'); setShowDateDropdownChart(false)}}>Last 30 Days</div>
                    <div className={\`dropdown-item \${dateRange === 'This Month' ? 'active' : ''}\`} onClick={(e) => {e.stopPropagation(); setDateRange('This Month'); setShowDateDropdownChart(false)}}>This Month</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div style={{padding: '24px', height: '320px', position: 'relative'}}>
            <div style={{position: 'absolute', top: '24px', bottom: '50px', left: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#817F7F', fontSize: '12px', fontWeight: '500'}}>
              <span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
            </div>
            <div style={{position: 'absolute', top: '30px', bottom: '56px', left: '50px', right: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
              <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
              <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
              <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
              <div style={{borderBottom: '1px solid #cbd5e1', width: '100%'}}></div>
            </div>
            <div style={{position: 'absolute', bottom: '20px', left: '50px', right: '24px', display: 'flex', justifyContent: 'space-between', color: '#817F7F', fontSize: '11px', fontWeight: '500'}}>
              <span style={{width: '40px', textAlign: 'center'}}>Day 1</span>
              <span style={{width: '40px', textAlign: 'center'}}>Day 2</span>
              <span style={{width: '40px', textAlign: 'center'}}>Day 3</span>
              <span style={{width: '40px', textAlign: 'center'}}>Day 4</span>
              <span style={{width: '40px', textAlign: 'center'}}>Day 5</span>
              <span style={{width: '40px', textAlign: 'center'}}>Day 6</span>
              <span style={{width: '40px', textAlign: 'center'}}>Day 7</span>
            </div>
            <div style={{position: 'absolute', top: '30px', bottom: '56px', left: '65px', right: '39px'}}>
              <svg width="100%" height="100%" style={{overflow: 'visible'}}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8A158F" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#8A158F" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M 0 100 L 0 75 L 16.66 25 L 33.33 50 L 50 62.5 L 66.66 62.5 L 83.33 37.5 L 100 12.5 L 100 100 Z" fill="url(#lineGrad)" vectorEffect="non-scaling-stroke" />
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0 75 L 16.66 25 L 33.33 50 L 50 62.5 L 66.66 62.5 L 83.33 37.5 L 100 12.5" fill="none" stroke="#8A158F" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                </svg>
                <circle cx="0%" cy="75%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} />
                <circle cx="16.66%" cy="25%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} />
                <circle cx="33.33%" cy="50%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} />
                <circle cx="50%" cy="62.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} />
                <circle cx="66.66%" cy="62.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} />
                <circle cx="83.33%" cy="37.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} />
                <circle cx="100%" cy="12.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} />
              </svg>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{flex: '1'}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Bookings by Source</h2>
          </div>
          <div style={{padding: '24px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'320px'}}>
            <div style={{position:'relative', width:'160px', height:'160px'}}>
              <svg width="160" height="160" viewBox="0 0 100 100" style={{transform:'rotate(-90deg)'}}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8A158F" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="113" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ca8bce" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="188.4" />
              </svg>
              <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', textAlign:'center'}}>
                <div style={{fontSize:'22px', fontWeight:'700', color:'#373737', lineHeight:'1.2'}}>128</div>
                <div style={{fontSize:'13px', color:'#555', fontWeight:'500'}}>Total</div>
              </div>
            </div>
            <div style={{display:'flex', width:'100%', justifyContent:'center', marginTop:'32px', gap:'16px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737', fontWeight:'500'}}>
                <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#8A158F'}}></div>
                Direct
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737', fontWeight:'500'}}>
                <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#ca8bce'}}></div>
                Website
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737', fontWeight:'500'}}>
                <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#f0f0f0'}}></div>
                OTA
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-grid-2-layout">
        <div className="admin-card" style={{flex: '1.5'}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Room Status Overview</h2>
            <span style={{fontSize:'13px', color:'#8A158F', fontWeight:'600', cursor:'pointer'}}>Manage Rooms</span>
          </div>
          <div style={{padding: '24px'}}>
            {roomStatuses.map((r) => (
              <div key={r.id} className="admin-room-list-item hover-lift-subtle">
                <img src={r.img} alt={r.name} />
                <div className="admin-room-list-info">
                  <h4>{r.name}</h4>
                  <p>{r.price} / night</p>
                </div>
                <span className="admin-badge admin-status-toggle" style={{background: r.bg, color: r.color}} onClick={() => toggleStatus(r.id)} title="Click to toggle status">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card" style={{flex: '1'}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Bookings</h2>
            <span style={{fontSize:'13px', color:'#8A158F', fontWeight:'600', cursor:'pointer'}}>View All</span>
          </div>
          <div style={{padding: '24px'}}>
            {recentBookings.map(b => (
              <div key={b.id} className="recent-booking-item hover-lift-subtle">
                <img src={b.img} alt="Booking" />
                <div className="recent-booking-info">
                  <h4>{b.name}</h4>
                  <p>{b.room}</p>
                  <span>{b.dates}</span>
                </div>
                <span className={\`admin-badge badge-\${b.status?.toLowerCase() === 'pending' ? 'warning' : b.status?.toLowerCase() === 'cancelled' ? 'danger' : 'success'}\`} style={b.status?.toLowerCase() === 'pending' ? {background:'#fff7ed', color:'#ea580c'} : {}}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
    c = c.replace(dashboardMatch[0], newDashboard);
}

// BookingsTab
const bookingsMatch = c.match(/function BookingsTab\(\) \{[\s\S]*?(?=function CalendarTab\(\) \{)/);
if (bookingsMatch) {
    let newBookings = `function BookingsTab() {
  const [bookings, setBookings] = React.useState([
    { id: '#BK-1024', guestName: 'Vikram Malhotra', phone: '+91 9876543210', room: 'Himalayan View Room', dates: '12 Oct - 15 Oct', nights: '3 Nights', amount: '₹10,500', status: 'Confirmed' },
    { id: '#BK-1025', guestName: 'Sunita Reddy', phone: '+91 9123456789', room: 'Luxury Family Suite', dates: '18 Oct - 20 Oct', nights: '2 Nights', amount: '₹12,000', status: 'Pending' }
  ]);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_bookings.php');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setBookings(data);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const handleCreateBooking = async () => {
    try {
      const newBooking = { guestName: "New Guest", phone: "N/A", room: "TBD", dates: "TBD", nights: "1 Night", amount: "₹0", status: "Pending" };
      const res = await fetch('http://localhost/merakiliving_backend/api_bookings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
      if (res.ok) {
        const created = await res.json();
        setBookings(prev => [created, ...prev]);
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  return (
    <>
      <PageHeader
        title="Booking Management"
        subtitle="View and manage all homestay reservations."
        action={
          <button className="admin-btn-primary" onClick={handleCreateBooking}>
            <PlusSignIcon size={18} /> Create Booking
          </button>
        }
      />

      <div className="admin-card">
        <div className="admin-filter-bar">
          <button className="admin-filter-btn active">All</button>
          <button className="admin-filter-btn">Pending</button>
          <button className="admin-filter-btn">Confirmed</button>
          <button className="admin-filter-btn">Completed</button>
          <button className="admin-filter-btn">Cancelled</button>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={i}>
                  <td className="admin-text-mono">{b.id}</td>
                  <td>
                    <div className="admin-cell-stack">
                      <span>{b.guestName}</span>
                      <span className="admin-cell-muted">{b.phone}</span>
                    </div>
                  </td>
                  <td>{b.room}</td>
                  <td>
                    <div className="admin-cell-stack">
                      <span>{b.dates}</span>
                      <span className="admin-cell-muted">{b.nights}</span>
                    </div>
                  </td>
                  <td className="admin-text-medium">{b.amount}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
`;
    c = c.replace(bookingsMatch[0], newBookings);
}

// ManageRoomsTab
const manageRoomsMatch = c.match(/function ManageRoomsTab\(\) \{[\s\S]*?(?=function PricingTab\(\) \{)/);
if (manageRoomsMatch) {
    let newManageRooms = `function ManageRoomsTab() {
  const [editingRoom, setEditingRoom] = React.useState(null);
  const [rooms, setRooms] = React.useState([
    { id: 1, title: 'Himalayan View Room', img: room1, status: 'Active', desc: 'Beautiful mountain views with a cozy interior.' },
    { id: 2, title: 'Premium Valley Room', img: room2, status: 'Active', desc: 'Overlooking the lush green valley.' },
    { id: 3, title: 'Luxury Family Suite', img: room3, status: 'Active', desc: 'Spacious suite perfect for families.' },
    { id: 4, title: 'Entire Homestay', img: room4, status: 'Active', desc: 'Book the entire property for complete privacy.' }
  ]);

  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_rooms.php');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setRooms(data);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleSaveRoom = async () => {
    try {
      const res = await fetch('http://localhost/merakiliving_backend/api_rooms.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRoom)
      });
      if (res.ok) {
        setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
      }
    } catch (error) {
      console.error("Failed to update room:", error);
    }
    setEditingRoom(null);
  };

  return (
    <div className="admin-fade-in">
      <PageHeader
        title="Manage Rooms"
        subtitle="Edit room details, descriptions, and availability status."
      />
      <div className="admin-item-grid">
        {rooms.map(r => (
          <div key={r.id} className="admin-item-card hover-lift">
            <img src={r.img} alt={r.title} className="admin-item-img" />
            <div className="admin-item-content">
              <div className="admin-item-header">
                <h3 className="admin-item-title">{r.title}</h3>
                <span className="admin-badge badge-success">{r.status}</span>
              </div>
              <p className="admin-item-desc" style={{color: '#555', fontWeight: '400'}}>{r.desc}</p>
              <div className="admin-item-actions" style={{marginTop: '20px'}}>
                <button className="admin-btn-outline admin-btn-full" onClick={() => setEditingRoom(r)}>
                  <Edit01Icon size={16} strokeWidth={1.5} /> Edit Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingRoom && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content admin-fade-in" style={{maxWidth: '500px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737'}}>Edit Room: {editingRoom.title}</h2>
              <button onClick={() => setEditingRoom(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}>
                <Cancel01Icon size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Room Title</label>
              <input type="text" className="admin-form-input" value={editingRoom.title || ''} onChange={e => setEditingRoom({...editingRoom, title: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Description</label>
              <textarea className="admin-form-input" rows="3" value={editingRoom.desc || ''} onChange={e => setEditingRoom({...editingRoom, desc: e.target.value})}></textarea>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select className="admin-form-input" value={editingRoom.status || 'Active'} onChange={e => setEditingRoom({...editingRoom, status: e.target.value})}>
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
            <button className="admin-btn-primary admin-btn-full" onClick={handleSaveRoom}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
`;
    c = c.replace(manageRoomsMatch[0], newManageRooms);
}

// GuestsTab
const guestsMatch = c.match(/function GuestsTab\(\) \{[\s\S]*?(?=function PaymentsTab\(\) \{)/);
if (guestsMatch) {
    let newGuests = `function GuestsTab() {
  const [guests, setGuests] = React.useState([
    { name: 'Rajesh Khanna', email: 'rajesh.k@example.com', phone: '+91 9876543210', totalStays: 2, lastRoom: 'Premium Valley Room' }
  ]);

  React.useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_guests.php');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setGuests(data);
        }
      } catch (error) {
        console.error("Failed to fetch guests:", error);
      }
    };
    fetchGuests();
  }, []);

  return (
    <>
      <PageHeader
        title="Guest Directory"
        subtitle="Manage guest information and stay history."
      />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Contact Info</th>
                <th>Total Stays</th>
                <th>Last Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g, i) => (
                <tr key={i}>
                  <td className="admin-text-medium">{g.name}</td>
                  <td>
                    <div className="admin-cell-stack">
                      <span>{g.email}</span>
                      <span className="admin-cell-muted">{g.phone}</span>
                    </div>
                  </td>
                  <td>{g.totalStays}</td>
                  <td>{g.lastRoom}</td>
                  <td>
                    <button className="admin-btn-sm admin-btn-outline">History</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
`;
    c = c.replace(guestsMatch[0], newGuests);
}

// PaymentsTab
const paymentsMatch = c.match(/function PaymentsTab\(\) \{[\s\S]*?(?=function CouponsTab\(\) \{)/);
if (paymentsMatch) {
    let newPayments = `function PaymentsTab() {
  const [payments, setPayments] = React.useState([
    { id: 'pay_Kjs821jdnH', ref: '#BK-1024', amount: '₹10,500', date: '12 Oct 2026', status: 'Success' },
    { id: 'pay_L91ksj8Hs', ref: '#BK-1025', amount: '₹12,000', date: '10 Oct 2026', status: 'Success' }
  ]);

  React.useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_payments.php');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setPayments(data);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };
    fetchPayments();
  }, []);

  return (
    <>
      <PageHeader
        title="Payments & Revenue"
        subtitle="View Razorpay transactions and revenue logs."
      />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Booking Ref</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i}>
                  <td className="admin-text-mono">{p.id}</td>
                  <td className="admin-text-medium">{p.ref}</td>
                  <td className="admin-text-medium">{p.amount}</td>
                  <td>{p.date}</td>
                  <td><span className={\`admin-badge badge-\${p.status?.toLowerCase() === 'success' ? 'success' : 'warning'}\`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
`;
    c = c.replace(paymentsMatch[0], newPayments);
}

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log('Successfully applied API integrations to DashboardTab, BookingsTab, ManageRoomsTab, GuestsTab, PaymentsTab.');
