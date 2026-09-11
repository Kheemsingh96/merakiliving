import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import logo from '../../../assets/images/logo.webp';
import {
  DashboardSquare01Icon, Calendar01Icon, BedDoubleIcon, Coffee02Icon, UserGroupIcon,
  Wallet01Icon, Ticket01Icon, Image01Icon, Settings01Icon, Logout01Icon, PlusSignIcon,
  Edit01Icon, Delete01Icon, WhatsappIcon, File02Icon, StarIcon, Doc01Icon, Menu01Icon, Cancel01Icon, Download02Icon
} from 'hugeicons-react';
import room1 from '../../../assets/images/room-1.webp';
import cafe1 from '../../../assets/images/cafe-menu-1.webp';
import founder from '../../../assets/images/founder.webp';

const API_CONFIG_URL = 'http://localhost/merakiliving_backend/api/config';

export default function AdminDashboard({ setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('meraki_admin_auth'); 
    window.location.reload();
    if (setCurrentPage) setCurrentPage('admin-login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardSquare01Icon },
    {
      id: 'bookings', label: 'Bookings', icon: Calendar01Icon,
      subItems: [{ id: 'all-bookings', label: 'All Bookings' }, { id: 'calendar', label: 'Calendar / Availability' }]
    },
    {
      id: 'rooms', label: 'Rooms', icon: BedDoubleIcon,
      subItems: [{ id: 'manage-rooms', label: 'Manage Rooms' }, { id: 'pricing', label: 'Pricing & Taxes' }]
    },
    {
      id: 'cafe', label: 'Cafe Menu', icon: Coffee02Icon,
      subItems: [{ id: 'featured-items', label: 'Featured Items' }, { id: 'full-menu', label: 'Full Menu Categories' }]
    },
    { id: 'guests', label: 'Guests', icon: UserGroupIcon },
    { id: 'payments', label: 'Payments', icon: Wallet01Icon },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Ticket01Icon },
    {
      id: 'website', label: 'Website Content', icon: File02Icon,
      subItems: [{ id: 'gallery', label: 'Gallery Manager', icon: Image01Icon }, { id: 'reviews', label: 'Reviews', icon: StarIcon }, { id: 'policies', label: 'Legal Policies', icon: Doc01Icon }]
    },
    { id: 'settings', label: 'Settings', icon: Settings01Icon }
  ];

  const handleNavClick = (id, subId = '') => {
    setActiveTab(id);
    setSubTab(subId);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') return <DashboardTab />;
    if (activeTab === 'bookings' && subTab === 'all-bookings') return <BookingsTab />;
    if (activeTab === 'bookings' && subTab === 'calendar') return <CalendarTab />;
    if (activeTab === 'rooms' && subTab === 'manage-rooms') return <ManageRoomsTab />;
    if (activeTab === 'rooms' && subTab === 'pricing') return <PricingTab />;
    if (activeTab === 'cafe' && subTab === 'featured-items') return <CafeFeaturedTab />;
    if (activeTab === 'cafe' && subTab === 'full-menu') return <CafeMenuTab />;
    if (activeTab === 'guests') return <GuestsTab />;
    if (activeTab === 'payments') return <PaymentsTab />;
    if (activeTab === 'coupons') return <CouponsTab />;
    if (activeTab === 'website' && subTab === 'gallery') return <GalleryTab />;
    if (activeTab === 'website' && subTab === 'reviews') return <ReviewsTab />;
    if (activeTab === 'website' && subTab === 'policies') return <PoliciesTab />;
    if (activeTab === 'settings') return <SettingsTab />;
    return (
      <div className="admin-empty-state">
        <DashboardSquare01Icon className="admin-empty-icon" />
        <h3>Section Under Construction</h3>
        <p>This module is being set up.</p>
      </div>
    );
  };

  return (
    <div className="admin-dashboard-container">
      <div className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src={logo} alt="Meraki Living" className="admin-sidebar-logo" />
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}><Cancel01Icon size={20} /></button>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map(item => (
            <div key={item.id} className="admin-nav-group">
              <div className={`admin-nav-item ${activeTab === item.id && !item.subItems ? 'active' : ''}`} onClick={() => handleNavClick(item.id, item.subItems ? item.subItems[0].id : '')}>
                <item.icon size={20} /><span>{item.label}</span>
              </div>
              {item.subItems && activeTab === item.id && (
                <div className="admin-nav-sublist">
                  {item.subItems.map(subItem => (
                    <div key={subItem.id} className={`admin-nav-subitem ${subTab === subItem.id ? 'active' : ''}`} onClick={() => handleNavClick(item.id, subItem.id)}>{subItem.label}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-footer-profile">
            <img src={founder} alt="Admin" className="admin-sidebar-footer-profile-img" style={{objectFit:"cover", width: '36px', height: '36px'}} />
            <div className="admin-sidebar-footer-profile-info" style={{flex: 1}}>
              <span className="admin-sidebar-footer-profile-name">Pranay Matiyani</span>
              <span className="admin-sidebar-footer-profile-role">Super Administrator</span>
            </div>
            <div style={{color: '#817F7F', display: 'flex', cursor: 'pointer', padding: '4px'}} onClick={(e) => { e.stopPropagation(); setShowProfileMenu(prev => !prev); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          {showProfileMenu && (
            <>
              <div className="admin-click-away" onClick={() => setShowProfileMenu(false)}></div>
              <div className="admin-dropdown-menu admin-fade-in" style={{bottom: '100%', right: '16px', marginBottom: '8px', position: 'absolute', width: '200px', padding: '8px'}}>
                <div className="dropdown-item" onClick={handleLogout} style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626'}}>
                  <Logout01Icon size={16} strokeWidth={1.5} /> Logout
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
      <main className="admin-main-content">
        <button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)}><Menu01Icon size={22} /></button>
        {renderContent()}
      </main>
    </div>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="admin-header">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        <p className="admin-page-subtitle">{subtitle}</p>
      </div>
      {action && <div className="admin-header-actions">{action}</div>}
    </div>
  );
}

function DashboardTab() {
  const [showDateDropdownTop, setShowDateDropdownTop] = useState(false);
  const [showDateDropdownChart, setShowDateDropdownChart] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [stats, setStats] = useState({ totalBookings: 0, totalGuests: 0, totalRevenue: '₹0', occupancyRate: '0%' });
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_dashboard_stats.php`)
      .then(res => res.json())
      .then(data => {
        if(data && data.stats) setStats(data.stats);
        if(data && Array.isArray(data.roomStatuses)) setRoomStatuses(data.roomStatuses);
        if(data && Array.isArray(data.recentBookings)) setRecentBookings(data.recentBookings);
      }).catch(e => console.error("Dashboard JSON Error:", e));
  }, []);

  const toggleStatus = (id) => {
    const roomToToggle = roomStatuses.find(r => r.id === id);
    if (!roomToToggle) return;

    const isAvailable = roomToToggle.status === 'Available';
    const newStatus = isAvailable ? 'Booked' : 'Available';

    fetch(`${API_CONFIG_URL}/api_rooms.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, status: newStatus })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.status === 'success') {
        fetch(`${API_CONFIG_URL}/api_dashboard_stats.php`)
          .then(res => res.json())
          .then(dashboardData => {
            if(dashboardData && Array.isArray(dashboardData.roomStatuses)) {
              setRoomStatuses(dashboardData.roomStatuses);
            }
          }).catch(e => console.error(e));
      }
    }).catch(err => console.error(err));
  };

  return (
    <div className="admin-fade-in">
      <div className="admin-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle" style={{color: '#555', fontWeight: '500'}}>Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div className="admin-header-actions" style={{ alignItems: 'center' }}>
          <div style={{position: 'relative'}}>
            <div className="admin-date-selector" onClick={(e) => { e.stopPropagation(); setShowDateDropdownTop(prev => !prev); setShowNotificationDropdown(false); }}>
              <Calendar01Icon size={18} strokeWidth={1.5} />
              <span style={{fontWeight: '500', color: '#373737'}}>{dateRange}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            {showDateDropdownTop && (
              <>
                <div className="admin-click-away" onClick={() => setShowDateDropdownTop(false)}></div>
                <div className="admin-dropdown-menu admin-fade-in">
                  {['Last 7 Days', 'Last 30 Days', 'This Month'].map(range => (
                    <div key={range} className={`dropdown-item ${dateRange === range ? 'active' : ''}`} onClick={() => {setDateRange(range); setShowDateDropdownTop(false)}}>{range}</div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div style={{position: 'relative'}}>
            <button className="admin-icon-btn" onClick={(e) => { e.stopPropagation(); setShowNotificationDropdown(prev => !prev); setShowDateDropdownTop(false); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="admin-notification-badge">0</span>
            </button>
            {showNotificationDropdown && (
              <>
                <div className="admin-click-away" onClick={() => setShowNotificationDropdown(false)}></div>
                <div className="admin-dropdown-menu notification-menu admin-fade-in">
                  <div className="dropdown-header">Notifications (0)</div>
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
            <div className="stat-card-header"><div className="admin-stat-icon white-icon"><Calendar01Icon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Total Bookings</span></div>
            <div className="admin-stat-row"><span className="admin-stat-value">{stats.totalBookings}</span><span className="admin-stat-trend positive">↑</span></div>
            <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
          </div>
        </div>
        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header"><div className="admin-stat-icon white-icon"><UserGroupIcon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Total Guests</span></div>
            <div className="admin-stat-row"><span className="admin-stat-value">{stats.totalGuests}</span><span className="admin-stat-trend positive">↑</span></div>
            <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
          </div>
        </div>
        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header"><div className="admin-stat-icon white-icon"><Wallet01Icon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Total Revenue</span></div>
            <div className="admin-stat-row"><span className="admin-stat-value">{stats.totalRevenue}</span><span className="admin-stat-trend positive">↑</span></div>
            <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
          </div>
        </div>
        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header"><div className="admin-stat-icon white-icon"><BedDoubleIcon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Occupancy Rate</span></div>
            <div className="admin-stat-row"><span className="admin-stat-value">{stats.occupancyRate}</span><span className="admin-stat-trend positive">↑</span></div>
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
                    {['Last 7 Days', 'Last 30 Days', 'This Month'].map(range => (
                      <div key={range} className={`dropdown-item ${dateRange === range ? 'active' : ''}`} onClick={(e) => {e.stopPropagation(); setDateRange(range); setShowDateDropdownChart(false)}}>{range}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div style={{padding: '24px', height: '320px', position: 'relative'}}>
            <div style={{position: 'absolute', top: '24px', bottom: '50px', left: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#817F7F', fontSize: '12px', fontWeight: '500'}}><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span></div>
            <div style={{position: 'absolute', top: '30px', bottom: '56px', left: '50px', right: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}><div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div><div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div><div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div><div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div><div style={{borderBottom: '1px solid #cbd5e1', width: '100%'}}></div></div>
            <div style={{position: 'absolute', bottom: '20px', left: '50px', right: '24px', display: 'flex', justifyContent: 'space-between', color: '#817F7F', fontSize: '11px', fontWeight: '500'}}><span style={{width: '40px', textAlign: 'center'}}>Day 1</span><span style={{width: '40px', textAlign: 'center'}}>Day 2</span><span style={{width: '40px', textAlign: 'center'}}>Day 3</span><span style={{width: '40px', textAlign: 'center'}}>Day 4</span><span style={{width: '40px', textAlign: 'center'}}>Day 5</span><span style={{width: '40px', textAlign: 'center'}}>Day 6</span><span style={{width: '40px', textAlign: 'center'}}>Day 7</span></div>
            <div style={{position: 'absolute', top: '30px', bottom: '56px', left: '65px', right: '39px'}}>
              <svg width="100%" height="100%" style={{overflow: 'visible'}}>
                <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8A158F" stopOpacity="0.2"/><stop offset="100%" stopColor="#8A158F" stopOpacity="0"/></linearGradient></defs>
                <path d="M 0 100 L 0 75 L 16.66 25 L 33.33 50 L 50 62.5 L 66.66 62.5 L 83.33 37.5 L 100 12.5 L 100 100 Z" fill="url(#lineGrad)" vectorEffect="non-scaling-stroke" />
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M 0 75 L 16.66 25 L 33.33 50 L 50 62.5 L 66.66 62.5 L 83.33 37.5 L 100 12.5" fill="none" stroke="#8A158F" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg>
                <circle cx="0%" cy="75%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="16.66%" cy="25%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="33.33%" cy="50%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="50%" cy="62.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="66.66%" cy="62.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="83.33%" cy="37.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="100%" cy="12.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} />
              </svg>
            </div>
          </div>
        </div>
        <div className="admin-card" style={{flex: '1'}}>
          <div className="admin-card-header"><h2 className="admin-card-title">Bookings by Source</h2></div>
          <div style={{padding: '24px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'320px'}}>
            <div style={{position:'relative', width:'160px', height:'160px'}}>
              <svg width="160" height="160" viewBox="0 0 100 100" style={{transform:'rotate(-90deg)'}}><circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="12" /><circle cx="50" cy="50" r="40" fill="none" stroke="#8A158F" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="113" /><circle cx="50" cy="50" r="40" fill="none" stroke="#ca8bce" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="188.4" /></svg>
              <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', textAlign:'center'}}><div style={{fontSize:'22px', fontWeight:'700', color:'#373737', lineHeight:'1.2'}}>{stats.totalBookings}</div><div style={{fontSize:'13px', color:'#555', fontWeight:'500'}}>Total</div></div>
            </div>
            <div style={{display:'flex', width:'100%', justifyContent:'center', marginTop:'32px', gap:'16px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737', fontWeight:'500'}}><div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#8A158F'}}></div>Direct</div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737', fontWeight:'500'}}><div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#ca8bce'}}></div>Website</div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737', fontWeight:'500'}}><div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#f0f0f0'}}></div>OTA</div>
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
                <img src={r.img || room1} alt={r.name} />
                <div className="admin-room-list-info">
                  <h4>{r.name}</h4><p>{r.price} / night</p>
                </div>
                <span className="admin-badge admin-status-toggle" style={{background: r.bg || (r.status === 'Available' ? '#f0fdf4' : '#fef2f2'), color: r.color || (r.status === 'Available' ? '#16a34a' : '#dc2626')}} onClick={() => toggleStatus(r.id)} title="Click to toggle status">{r.status}</span>
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
            {recentBookings.map((b) => (
              <div key={b.id} className="recent-booking-item hover-lift-subtle">
                <img src={room1} alt="Booking" />
                <div className="recent-booking-info">
                  <h4>{b.name || b.guest_name}</h4><p>{b.room || b.room_name}</p><span>{b.dates || `${b.check_in} - ${b.check_out}`}</span>
                </div>
                <span className={`admin-badge ${b.status === 'Confirmed' || b.status === 'Success' ? 'badge-success' : b.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`} style={b.status === 'Pending' ? {background:'#fff7ed', color:'#ea580c'} : {}}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    Promise.all([
      fetch(`${API_CONFIG_URL}/apibooking.php`).then(res => res.json()),
      fetch(`${API_CONFIG_URL}/api_payment.php`).then(res => res.json())
    ]).then(([bookingsData, paymentsData]) => {
      let fetchedPayments = [];
      if (paymentsData && paymentsData.status === 'success') {
        fetchedPayments = paymentsData.data;
      }
      if (bookingsData && bookingsData.status === 'success') {
        const mergedBookings = bookingsData.data.map(b => {
          const payment = fetchedPayments.find(p => p.booking_id === b.id && (p.status === 'Success' || p.status === 'Completed'));
          return {
            ...b,
            paid_amount: payment ? payment.amount : b.room_price
          };
        });
        setBookings(mergedBookings);
      }
    }).catch(e => console.error("JSON Error in Bookings:", e));
  }, []);

  const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <>
      <PageHeader title="Booking Management" subtitle="View and manage all homestay reservations." action={<button className="admin-btn-primary" onClick={() => alert('Booking creation is managed via frontend guest flow.')}><PlusSignIcon size={18} /> Create Booking</button>} />
      <div className="admin-card">
        <div className="admin-filter-bar">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
            <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Guest Name</th><th>Room</th><th>Dates</th><th>Amount Paid</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredBookings.map((b, i) => (
                <tr key={i}>
                  <td className="admin-text-mono">#BK-{b.id}</td>
                  <td><div className="admin-cell-stack"><span>{b.guest_name}</span><span className="admin-cell-muted">{b.guest_phone}</span></div></td>
                  <td>{b.room_name}</td>
                  <td><div className="admin-cell-stack"><span>{b.check_in} to {b.check_out}</span><span className="admin-cell-muted">Nights</span></div></td>
                  <td className="admin-text-medium">₹{b.paid_amount}</td>
                  <td><span className={`admin-badge ${b.status === 'Confirmed' ? 'badge-success' : b.status === 'Pending' ? 'badge-info' : 'badge-danger'}`}>{b.status}</span></td>
                  <td>
                    <div className="admin-action-group"><button className="admin-btn-sm admin-btn-outline" onClick={() => alert('View booking details for BK-' + b.id)}><Edit01Icon size={14} /> View</button><a href={`https://wa.me/${b.guest_phone}`} target="_blank" rel="noreferrer" className="admin-btn-sm admin-btn-whatsapp"><WhatsappIcon size={14} /></a></div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '24px'}}>No {filter.toLowerCase()} bookings found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CalendarTab() {
  return (
    <>
      <PageHeader title="Availability Calendar" subtitle="Manage room availability and block dates." />
      <div className="admin-card admin-card-padded">
        <div className="admin-calendar-header"><h2 className="admin-card-title">October 2026</h2><div className="admin-calendar-nav"><button className="admin-btn-outline">Previous</button><button className="admin-btn-outline">Next</button></div></div>
        <div className="admin-calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (<div key={day} className="admin-calendar-header-cell">{day}</div>))}
          {[...Array(31)].map((_, i) => (
            <div key={i} className="admin-calendar-cell"><span className="admin-calendar-date">{i + 1}</span></div>
          ))}
        </div>
      </div>
    </>
  );
}

function ManageRoomsTab() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  
  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_rooms.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setRooms(data.data); })
      .catch(e => console.error("JSON Error in ManageRooms:", e));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('action', 'upload');
    formData.append('image', file);
    
    try {
      const res = await fetch(`${API_CONFIG_URL}/api_rooms.php`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        setEditingRoom({...editingRoom, image_url: data.image_url});
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const saveRoomDetails = () => {
    const isNew = !editingRoom.id;
    const method = isNew ? 'POST' : 'PUT';
    
    fetch(`${API_CONFIG_URL}/api_rooms.php`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingRoom.id,
        name: editingRoom.name || '',
        description: editingRoom.description || '',
        status: editingRoom.status || 'Available',
        price: editingRoom.price || 0,
        original_price: editingRoom.original_price || 0,
        image_url: editingRoom.image_url || ''
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        fetch(`${API_CONFIG_URL}/api_rooms.php`)
          .then(res => res.json())
          .then(refetchData => {
            if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data)) {
              setRooms(refetchData.data);
            }
            setEditingRoom(null);
          });
      }
    }).catch(e => console.error("Error saving room:", e));
  };

  const deleteRoom = (id) => {
    if(!window.confirm("Are you sure you want to delete this room?")) return;
    fetch(`${API_CONFIG_URL}/api_rooms.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        setRooms(rooms.filter(r => r.id !== id));
      }
    }).catch(e => console.error("Delete room error:", e));
  };

  return (
    <div className="admin-fade-in">
      <PageHeader title="Manage Rooms" subtitle="Edit room details, descriptions, images and availability." action={<button className="admin-btn-primary" onClick={() => setEditingRoom({})}><PlusSignIcon size={18} /> Add Room</button>} />
      <div className="admin-item-grid">
        {rooms.map(r => (
          <div key={r.id} className="admin-item-card hover-lift">
            <img src={r.image_url || room1} alt={r.name} className="admin-item-img" />
            <div className="admin-item-content">
              <div className="admin-item-header"><h3 className="admin-item-title">{r.name}</h3><span className="admin-badge badge-success">{r.status}</span></div>
              <p className="admin-item-desc" style={{color: '#555', fontWeight: '500'}}>{r.description || 'Description not available.'}</p>
              <div className="admin-item-actions" style={{marginTop: '20px', gap: '8px', display: 'flex'}}>
                <button className="admin-btn-outline admin-btn-full" onClick={() => setEditingRoom(r)}><Edit01Icon size={16} strokeWidth={1.5} /> Edit Details</button>
                <button className="admin-btn-outline admin-btn-danger" onClick={() => deleteRoom(r.id)}><Delete01Icon size={16} strokeWidth={1.5} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingRoom && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content">
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>{editingRoom.id ? 'Edit Room' : 'Add Room'}</h2>
              <button onClick={() => setEditingRoom(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            <div className="admin-form-group"><label className="admin-form-label">Room Title</label><input type="text" className="admin-form-input" value={editingRoom.name || ''} onChange={e => setEditingRoom({...editingRoom, name: e.target.value})} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Description</label><textarea className="admin-form-input" rows="3" value={editingRoom.description || ''} onChange={e => setEditingRoom({...editingRoom, description: e.target.value})}></textarea></div>
            <div className="admin-form-group">
              <label className="admin-form-label">Room Image</label>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                 {editingRoom.image_url && <img src={editingRoom.image_url} alt="Preview" style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} />}
                 <input type="file" accept="image/*" className="admin-form-input" onChange={handleImageUpload} />
              </div>
            </div>
            <div className="admin-form-group"><label className="admin-form-label">Status</label><select className="admin-form-input" value={editingRoom.status || 'Available'} onChange={e => setEditingRoom({...editingRoom, status: e.target.value})}><option>Available</option><option>Inactive</option><option>Maintenance</option></select></div>
            <button className="admin-btn-primary admin-btn-full" onClick={saveRoomDetails}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PricingTab() {
  const [rooms, setRooms] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_rooms.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setRooms(data.data); })
      .catch(e => console.error("JSON Error in Pricing:", e));
  }, []);

  const handleSave = () => {
    Promise.all(rooms.map(room => 
      fetch(`${API_CONFIG_URL}/api_rooms.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: room.id, 
          price: room.price,
          original_price: room.original_price
        })
      })
    )).then(() => {
      fetch(`${API_CONFIG_URL}/api_rooms.php`)
        .then(res => res.json())
        .then(data => {
          if(data && data.status === 'success' && Array.isArray(data.data)) {
            setRooms(data.data);
          }
          setIsSaved(true); 
          setTimeout(() => setIsSaved(false), 2000);
        });
    }).catch(e => console.error("Error saving pricing:", e));
  };

  const handleDiscountChange = (idx, discountPercent) => {
    const newRooms = [...rooms];
    const room = newRooms[idx];
    const orig = parseFloat(room.original_price) || 0;
    const dp = parseFloat(discountPercent) || 0;
    if(orig > 0) {
       room.price = (orig - (orig * (dp / 100))).toFixed(0);
    }
    setRooms(newRooms);
  };

  return (
    <div className="admin-fade-in">
      <PageHeader title="Pricing & Taxes" subtitle="Manage room rates, discounts, and global GST settings." action={<button className="admin-btn-primary" onClick={handleSave} style={{transition: 'all 0.3s'}}>{isSaved ? 'Saved Successfully!' : 'Save Changes'}</button>} />
      <div className="admin-pricing-grid">
        {rooms.map((room, idx) => {
           const orig = parseFloat(room.original_price) || 0;
           const curr = parseFloat(room.price) || 0;
           let discount = 0;
           if(orig > 0 && orig > curr) {
               discount = (((orig - curr) / orig) * 100).toFixed(1);
           }
           return (
          <div className="admin-card hover-lift" key={room.id} style={{display: 'flex', overflow: 'hidden', padding: 0}}>
            <div style={{width: '140px', flexShrink: 0}} className="admin-pricing-img-wrapper"><img src={room.image_url || room1} alt={room.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
            <div style={{padding: '24px', flex: 1}}>
              <h2 className="admin-card-title" style={{marginBottom: '16px', fontSize: '16px'}}>{room.name}</h2>
              <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
                <div className="admin-form-group" style={{marginBottom: 0, flex: 1}}>
                  <label className="admin-form-label">Original Price (₹)</label>
                  <div className="admin-price-input-wrapper"><span className="admin-price-symbol">₹</span><input type="number" className="admin-form-input" value={room.original_price || 0} onChange={(e) => { const newRooms = [...rooms]; newRooms[idx].original_price = e.target.value; setRooms(newRooms); }} /></div>
                </div>
                <div className="admin-form-group" style={{marginBottom: 0, flex: 1}}>
                  <label className="admin-form-label">Selling Price (₹)</label>
                  <div className="admin-price-input-wrapper"><span className="admin-price-symbol">₹</span><input type="number" className="admin-form-input" value={room.price || 0} onChange={(e) => { const newRooms = [...rooms]; newRooms[idx].price = e.target.value; setRooms(newRooms); }} /></div>
                </div>
                <div className="admin-form-group" style={{marginBottom: 0, flex: 1}}>
                  <label className="admin-form-label">Discount (%)</label>
                  <div className="admin-price-input-wrapper"><input type="number" className="admin-form-input" value={discount} onChange={(e) => handleDiscountChange(idx, e.target.value)} /><span className="admin-price-symbol" style={{left: 'auto', right: '12px'}}>%</span></div>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}

function CafeFeaturedTab() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_cafe.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setItems(data.data.filter(i => i.is_featured == 1)); })
      .catch(e => console.error("JSON Error in CafeFeatured:", e));
  }, []);

  const unfeatureItem = (id) => {
    fetch(`${API_CONFIG_URL}/api_cafe.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: id, is_featured: 0 })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        setItems(items.filter(i => i.item_id !== id));
      }
    });
  };

  return (
    <>
      <PageHeader title="Featured Menu Items" subtitle="Manage the featured items shown on the Cafe page. Go to Full Menu to edit these items or add new ones." />
      <div className="admin-item-grid">
        {items.map(item => (
          <div key={item.item_id} className="admin-item-card">
            <img src={item.image_url || cafe1} alt={item.title} className="admin-item-img" />
            <div className="admin-item-content">
              <div className="admin-item-header"><h3 className="admin-item-title">{item.title}</h3><span className="admin-badge badge-success">₹{item.price}</span></div>
              <div className="admin-item-meta">
                <span className={item.is_veg == 1 ? 'admin-text-veg' : 'admin-text-nonveg'}>{item.is_veg == 1 ? 'Veg' : 'Non-Veg'}</span>
                <span className="admin-cell-muted">Original: ₹{item.original_price || item.price}</span>
                <span className="admin-item-tag"><span className="admin-badge badge-primary">{item.tag || 'Featured'}</span></span>
              </div>
              <div className="admin-item-actions"><button className="admin-btn-outline admin-btn-danger admin-btn-full" onClick={() => unfeatureItem(item.item_id)}>Remove from Featured</button></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CafeMenuTab() {
  const [activeCategory, setActiveCategory] = useState('Breakfast');
  const [allItems, setAllItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const categories = ['Breakfast', 'Main Course', 'Healthy', 'Beverages', 'Desserts', 'All Day Snacks', 'Rice & Roti', 'Add Ons', 'Teas', 'Beverages & Soups'];

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_cafe.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setAllItems(data.data); })
      .catch(e => console.error("JSON Error in CafeMenu:", e));
  }, []);

  const filteredItems = allItems.filter(i => i.category === activeCategory);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('action', 'upload');
    formData.append('image', file);
    try {
      const res = await fetch(`${API_CONFIG_URL}/api_rooms.php`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        setEditingItem({...editingItem, image_url: data.image_url});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveItem = () => {
    const isNew = !editingItem.item_id;
    const method = isNew ? 'POST' : 'PUT';
    
    fetch(`${API_CONFIG_URL}/api_cafe.php`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_id: editingItem.item_id,
        title: editingItem.title || '',
        description: editingItem.description || '',
        price: editingItem.price || 0,
        original_price: editingItem.original_price || 0,
        category: editingItem.category || activeCategory,
        is_veg: editingItem.is_veg !== undefined ? editingItem.is_veg : 1,
        is_featured: editingItem.is_featured !== undefined ? editingItem.is_featured : 0,
        tag: editingItem.tag || '',
        status: editingItem.status || 'Available',
        image_url: editingItem.image_url || ''
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        fetch(`${API_CONFIG_URL}/api_cafe.php`)
          .then(res => res.json())
          .then(refetchData => {
            if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data)) {
              setAllItems(refetchData.data);
            }
            setEditingItem(null);
          });
      }
    }).catch(e => console.error(e));
  };

  const deleteItem = (id) => {
    if(!window.confirm("Are you sure you want to delete this menu item?")) return;
    fetch(`${API_CONFIG_URL}/api_cafe.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: id })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        setAllItems(allItems.filter(i => i.item_id !== id));
      }
    });
  };
  
  const handleDiscountChange = (discountPercent) => {
     const orig = parseFloat(editingItem.original_price) || 0;
     const dp = parseFloat(discountPercent) || 0;
     if(orig > 0) {
        setEditingItem({...editingItem, price: (orig - (orig * (dp / 100))).toFixed(0)});
     }
  };

  return (
    <>
      <PageHeader title="Full Menu Categories" subtitle="Manage all menu items." action={<button className="admin-btn-primary" onClick={() => setEditingItem({category: activeCategory, is_veg: 1, is_featured: 0})}><PlusSignIcon size={18} /> Add Menu Item</button>} />
      <div className="admin-card">
        <div className="admin-filter-bar" style={{flexWrap: 'wrap', gap: '8px', padding: '16px'}}>
          {categories.map(cat => (<button key={cat} className={`admin-filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>))}
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Item Name</th><th>Pricing</th><th>Diet & Status</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredItems.map((item, idx) => (
                <tr key={idx}>
                  <td><img src={item.image_url || cafe1} alt="" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} /></td>
                  <td>
                    <div className="admin-text-medium">{item.title}</div>
                    <div className="admin-cell-muted" style={{fontSize: '12px', maxWidth: '2