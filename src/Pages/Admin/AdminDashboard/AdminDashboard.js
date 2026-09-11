import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';
import logo from '../../../assets/images/logo.webp';
import {
  DashboardSquare01Icon, Calendar01Icon, BedDoubleIcon, Coffee02Icon, UserGroupIcon,
  Wallet01Icon, Ticket01Icon, Image01Icon, Settings01Icon, Logout01Icon, PlusSignIcon,
  Edit01Icon, Delete01Icon, File02Icon, StarIcon, Doc01Icon, Menu01Icon, Cancel01Icon, Download02Icon
} from 'hugeicons-react';
import room1 from '../../../assets/images/room-1.webp';
import room2 from '../../../assets/images/room-2.webp';
import room3 from '../../../assets/images/room-3.webp';
import room4 from '../../../assets/images/room-4.webp';
import founder from '../../../assets/images/founder.webp';

const getRoomImage = (id) => {
  const numId = Number(id);
  if (numId === 1 || id === 'Himalayan View Room') return room1;
  if (numId === 2 || id === 'Premium Valley Room') return room2;
  if (numId === 3 || id === 'Luxury Family Suite') return room3;
  if (numId === 4 || id === 'Entire Homestay') return room4;
  return room1;
};

const API_CONFIG_URL = 'http://localhost/merakiliving_backend';

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
      subItems: [{ id: 'manage-rooms', label: 'Manage Rooms' }]
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
  const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_CONFIG_URL}/api_dashboard_stats.php`).then(res => res.json()),
      fetch(`${API_CONFIG_URL}/api_bookings.php`).then(res => res.json()),
      fetch(`${API_CONFIG_URL}/api_payments.php`).then(res => res.json())
    ]).then(([dashboardData, bookingsData, paymentsData]) => {
      let finalStats = { totalBookings: 0, totalGuests: 0, totalRevenue: '₹0', occupancyRate: '0%' };
      
      let fetchedPayments = [];
      if (paymentsData && paymentsData.status === 'success' && Array.isArray(paymentsData.data)) {
        fetchedPayments = paymentsData.data;
      }
      
      if(dashboardData && Array.isArray(dashboardData.roomStatuses)) {
        setRoomStatuses(dashboardData.roomStatuses);
        const totalRooms = dashboardData.roomStatuses.length;
        const bookedRooms = dashboardData.roomStatuses.filter(r => r.status === 'Booked' || r.status === 'Not Available').length;
        if (totalRooms > 0) {
          finalStats.occupancyRate = Math.round((bookedRooms / totalRooms) * 100) + '%';
        }
      }
      if(dashboardData && Array.isArray(dashboardData.recentBookings)) setRecentBookings(dashboardData.recentBookings);
      
      if(bookingsData && bookingsData.status === 'success' && Array.isArray(bookingsData.data)) {
        finalStats.totalBookings = bookingsData.data.length;
        const totalG = bookingsData.data.reduce((sum, b) => sum + parseInt(b.guest_count || 0), 0);
        finalStats.totalGuests = totalG;
        
        const totalRev = bookingsData.data.reduce((sum, b) => {
          const payment = fetchedPayments.find(p => p.booking_id === b.id && (p.status === 'Success' || p.status === 'Completed'));
          let amount = payment ? parseFloat(payment.amount) : parseFloat(String(b.room_price || 0).replace(/,/g, ''));
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        
        finalStats.totalRevenue = '₹' + totalRev.toLocaleString('en-IN');

        // Calculate chart data for the last 7 days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const counts = [0, 0, 0, 0, 0, 0, 0];
        
        bookingsData.data.forEach(b => {
          const bDateStr = b.created_at || b.booking_date;
          if (bDateStr) {
            const bDate = new Date(bDateStr);
            bDate.setHours(0, 0, 0, 0);
            const diffTime = Math.abs(today - bDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays < 7) {
              counts[6 - diffDays] += 1;
            }
          }
        });
        setChartData(counts);
      }
      
      setStats(finalStats);
    }).catch(e => console.error("Dashboard/Bookings JSON Error:", e));
  }, []);

  const toggleStatus = (id) => {
    const roomToToggle = roomStatuses.find(r => r.id === id);
    if (!roomToToggle) return;

    const isAvailable = roomToToggle.status?.toLowerCase().trim() === 'available';
    const newStatus = isAvailable ? 'Booked' : 'Available';

    setRoomStatuses(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, bg: newStatus === 'Available' ? '#f0fdf4' : '#fef2f2', color: newStatus === 'Available' ? '#16a34a' : '#dc2626' } : r));

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
          <NotificationBell 
            showNotificationDropdown={showNotificationDropdown} 
            setShowNotificationDropdown={setShowNotificationDropdown} 
            setShowDateDropdownTop={setShowDateDropdownTop} 
          />
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
            <div className="admin-stat-subtext">{dateRange}</div>
          </div>
        </div>
        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header"><div className="admin-stat-icon white-icon"><UserGroupIcon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Total Guests</span></div>
            <div className="admin-stat-row"><span className="admin-stat-value">{stats.totalGuests}</span><span className="admin-stat-trend positive">↑</span></div>
            <div className="admin-stat-subtext">{dateRange}</div>
          </div>
        </div>
        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header"><div className="admin-stat-icon white-icon"><Wallet01Icon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Total Revenue</span></div>
            <div className="admin-stat-row"><span className="admin-stat-value">{stats.totalRevenue}</span><span className="admin-stat-trend positive">↑</span></div>
            <div className="admin-stat-subtext">{dateRange}</div>
          </div>
        </div>
        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header"><div className="admin-stat-icon white-icon"><BedDoubleIcon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Occupancy Rate</span></div>
            <div className="admin-stat-row"><span className="admin-stat-value">{stats.occupancyRate}</span><span className="admin-stat-trend positive">↑</span></div>
            <div className="admin-stat-subtext">{dateRange}</div>
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
              {(() => {
                const maxVal = Math.max(80, ...chartData);
                const getPoints = () => {
                  return chartData.map((val, i) => {
                    const x = (i / 6) * 100;
                    const y = 100 - ((val / maxVal) * 100);
                    return `${x} ${y}`;
                  });
                };
                const points = getPoints();
                const pathData = `M 0 100 L ${points.map((p, i) => `${p.split(' ')[0]} ${p.split(' ')[1]}`).join(' L ')} L 100 100 Z`;
                const lineData = `M ${points.map((p, i) => `${p.split(' ')[0]} ${p.split(' ')[1]}`).join(' L ')}`;
                return (
                  <svg width="100%" height="100%" style={{overflow: 'visible'}}>
                    <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8A158F" stopOpacity="0.2"/><stop offset="100%" stopColor="#8A158F" stopOpacity="0"/></linearGradient></defs>
                    <path d={pathData} fill="url(#lineGrad)" vectorEffect="non-scaling-stroke" />
                    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d={lineData} fill="none" stroke="#8A158F" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                    </svg>
                    {points.map((p, i) => (
                      <circle key={i} cx={`${p.split(' ')[0]}%`} cy={`${p.split(' ')[1]}%`} r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} />
                    ))}
                  </svg>
                );
              })()}
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
                <img src={r.image_url || getRoomImage(r.id)} alt={r.name} />
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
                <img src={b.room_image_url || getRoomImage(b.room_id || b.room)} alt="Booking" />
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
  const [editingBooking, setEditingBooking] = useState(null);

  const fetchBookings = () => {
    Promise.all([
      fetch(`${API_CONFIG_URL}/api_bookings.php`).then(res => res.json()),
      fetch(`${API_CONFIG_URL}/api_payments.php`).then(res => res.json())
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
            paid_amount: payment ? payment.amount : (b.room_price || 0)
          };
        });
        setBookings(mergedBookings);
      }
    }).catch(e => console.error("JSON Error in Bookings:", e));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const saveBooking = () => {
    const isNew = !editingBooking.id;
    const method = isNew ? 'POST' : 'PUT';
    
    fetch(`${API_CONFIG_URL}/api_bookings.php`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         id: editingBooking.id,
         guest_id: editingBooking.guest_id || 1,
         room_id: editingBooking.room_id || 1,
         check_in: editingBooking.check_in || '',
         check_out: editingBooking.check_out || '',
         guest_count: editingBooking.guest_count,
         status: editingBooking.status || 'Pending'
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        fetchBookings();
        setEditingBooking(null);
      } else {
        alert(data.message || 'Error saving booking');
      }
    }).catch(e => console.error(e));
  };

  const deleteBooking = (id) => {
    if(!window.confirm("Are you sure you want to delete this booking?")) return;
    fetch(`${API_CONFIG_URL}/api_bookings.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        setBookings(bookings.filter(b => b.id !== id));
      } else {
        alert(data.message || 'Error deleting booking');
      }
    }).catch(e => console.error(e));
  };

  const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);
  const formatBookingDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <PageHeader title="Booking Management" subtitle="View and manage all homestay reservations." action={<button className="admin-btn-primary" onClick={() => setEditingBooking({status: 'Pending', guest_id: 1, room_id: 1})}><PlusSignIcon size={18} /> Create Booking</button>} />
      <div className="admin-card">
        <div className="admin-filter-bar">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
            <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Guest Name</th><th>Room</th><th>Dates</th><th>Amount</th><th>Guests</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredBookings.map((b, i) => (
                <tr key={i}>
                  <td className="admin-text-mono">MERI{String(b.id).padStart(4, '0')}</td>
                  <td><div className="admin-cell-stack"><span>{b.guest_name || `Guest ${b.guest_id}`}</span><span className="admin-cell-muted">{b.guest_phone || ''}</span></div></td>
                  <td>{b.room_name || `Room ${b.room_id}`}</td>
                  <td><div className="admin-cell-stack"><span>{formatBookingDate(b.check_in)} to {formatBookingDate(b.check_out)}</span></div></td>
                  <td className="admin-text-medium">&#8377;{b.paid_amount}</td>
                  <td>
                    <div style={{fontWeight: '500'}}>{b.guest_count} {parseInt(b.guest_count) === 1 ? 'Guest' : 'Guests'}</div>
                  </td>
                  <td>
                    <div className="admin-action-group">
                      <button className="admin-btn-sm admin-btn-outline" onClick={() => deleteBooking(b.id)}><Delete01Icon size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '24px'}}>No {filter.toLowerCase()} bookings found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editingBooking && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '500px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px'}}>
              <h2 style={{margin: 0, fontSize: '20px', color: '#373737', fontWeight: '700'}}>{editingBooking.id ? 'Edit Booking' : 'New Booking'}</h2>
              <button onClick={() => setEditingBooking(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div className="admin-form-group">
                <label className="admin-form-label">Guest ID</label>
                <input type="number" className="admin-form-input" value={editingBooking.guest_id || ''} onChange={e => setEditingBooking({...editingBooking, guest_id: e.target.value})} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Room ID</label>
                <input type="number" className="admin-form-input" value={editingBooking.room_id || ''} onChange={e => setEditingBooking({...editingBooking, room_id: e.target.value})} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Check In</label>
                  <input type="date" className="admin-form-input" value={editingBooking.check_in || ''} onChange={e => setEditingBooking({...editingBooking, check_in: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Check Out</label>
                  <input type="date" className="admin-form-input" value={editingBooking.check_out || ''} onChange={e => setEditingBooking({...editingBooking, check_out: e.target.value})} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select className="admin-form-input" value={editingBooking.status || 'Pending'} onChange={e => setEditingBooking({...editingBooking, status: e.target.value})}>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <button className="admin-btn-primary admin-btn-full" onClick={saveBooking}>Save Booking</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CalendarTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_bookings.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && data.data) {
          setBookings(data.data.filter(b => b.status === 'Confirmed' || b.status === 'Pending' || b.status === 'Success'));
        }
      }).catch(err => console.error(err));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const getBookingsForDay = (day) => {
    const d = new Date(year, month, day);
    d.setHours(0,0,0,0);
    return bookings.filter(b => {
      const createdStr = b.booking_date || b.created_at;
      if (!createdStr) return false;
      const createdDate = new Date(createdStr);
      createdDate.setHours(0,0,0,0);
      return d.getTime() === createdDate.getTime();
    });
  };

  return (
    <>
      <PageHeader title="Availability Calendar" subtitle="Manage room availability and block dates." />
      <div className="admin-card admin-card-padded">
        <div className="admin-calendar-header">
          <h2 className="admin-card-title">{monthName}</h2>
          <div className="admin-calendar-nav">
            <button className="admin-btn-outline" onClick={prevMonth}>Previous</button>
            <button className="admin-btn-outline" onClick={nextMonth}>Next</button>
          </div>
        </div>
        <div className="admin-table-wrapper">
          <div className="admin-calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (<div key={day} className="admin-calendar-header-cell">{day}</div>))}
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`blank-${i}`} className="admin-calendar-cell empty"></div>
            ))}
            {Array.from({length: daysInMonth}).map((_, i) => {
              const dayBookings = getBookingsForDay(i + 1);
              return (
                <div key={i} className="admin-calendar-cell" style={{verticalAlign: 'top', minHeight: '120px'}}>
                  <span className="admin-calendar-date">{i + 1}</span>
                  <div style={{marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    {dayBookings.map((b, idx) => (
                      <div key={idx} style={{padding: '4px 0', fontSize: '12px', lineHeight: '1.4'}}>
                        <div style={{fontWeight: '600', color: '#16a34a'}}>{b.guest_name}</div>
                        <div style={{color: '#6b7280'}}>{b.room_name || `Room ${b.room_id}`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function ManageRoomsTab() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);

  const sortRooms = (roomList) => {
    const getOrderRank = (room) => {
      const id = Number(room.id);
      const name = (room.name || room.title || '').toLowerCase();
      if (id === 4 || name.includes('entire')) return 1;
      if (id === 3 || name.includes('family') || name.includes('luxury')) return 2;
      if (id === 2 || name.includes('valley') || name.includes('premium')) return 3;
      if (id === 1 || name.includes('himalayan') || name.includes('view')) return 4;
      return 5;
    };
    return [...roomList].sort((a, b) => getOrderRank(a) - getOrderRank(b));
  };
  
  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_rooms.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setRooms(sortRooms(data.data)); })
      .catch(e => console.error("JSON Error in ManageRooms:", e));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('action', 'upload');
    formData.append('image', file);
    
    try {
      const res = await fetch(`${API_CONFIG_URL}/api_cafe.php`, {
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
              setRooms(sortRooms(refetchData.data));
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
        setRooms(sortRooms(rooms.filter(r => r.id !== id)));
      }
    }).catch(e => console.error("Delete room error:", e));
  };

  return (
    <div className="admin-fade-in">
      <PageHeader title="Manage Rooms" subtitle="Edit room details, descriptions, images and availability." action={<button className="admin-btn-primary" onClick={() => setEditingRoom({status: 'Available'})}><PlusSignIcon size={18} /> Add Room</button>} />
      <div className="admin-item-grid">
        {rooms.map(r => (
          <div key={r.id} className="admin-item-card hover-lift">
            <img src={r.image_url || getRoomImage(r.id)} alt={r.name} className="admin-item-img" />
            <div className="admin-item-content">
              <div className="admin-item-header"><h3 className="admin-item-title">{r.name}</h3><span className="admin-badge badge-success">{r.status}</span></div>
              <p className="admin-item-desc" style={{color: '#555', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{r.description || 'Description not available.'}</p>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginTop: 'auto', flexWrap: 'wrap'}}>
                {parseFloat(r.original_price) > parseFloat(r.price) ? (
                  <>
                    <span style={{fontSize: '14px', color: '#817F7F', textDecoration: 'line-through'}}>₹{parseFloat(r.original_price).toLocaleString('en-IN')}</span>
                    <span style={{fontSize: '18px', fontWeight: '700', color: '#373737'}}>₹{parseFloat(r.price).toLocaleString('en-IN')}</span>
                    <span className="admin-badge" style={{background: '#fdf4ff', color: '#8A158F', fontSize: '11px', fontWeight: '600', padding: '2px 6px'}}>{Math.round(((r.original_price - r.price) / r.original_price) * 100)}% OFF</span>
                  </>
                ) : (
                  <span style={{fontSize: '18px', fontWeight: '700', color: '#373737'}}>₹{parseFloat(r.price).toLocaleString('en-IN')}</span>
                )}
              </div>
              
              <div className="admin-item-actions" style={{marginTop: '12px', gap: '8px', display: 'flex', borderTop: '1px solid rgba(138, 21, 143, 0.06)', paddingTop: '14px'}}>
                <button className="admin-btn-outline admin-btn-full" onClick={() => setEditingRoom(r)}><Edit01Icon size={16} strokeWidth={1.5} /> Edit Details</button>
                <button className="admin-btn-outline admin-btn-danger" onClick={() => deleteRoom(r.id)}><Delete01Icon size={16} strokeWidth={1.5} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingRoom && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '720px', width: '100%', padding: '28px 32px', borderRadius: '16px', boxSizing: 'border-box'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px'}}>
              <h2 style={{margin: 0, fontSize: '20px', color: '#373737', fontWeight: '700'}}>{editingRoom.id ? 'Edit Room' : 'Add Room'}</h2>
              <button onClick={() => setEditingRoom(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
              {/* Row 1: Room Title with Status aligned on the right on the same row */}
              <div style={{display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap'}}>
                <div className="admin-form-group" style={{margin: 0, flex: '2 1 320px'}}>
                  <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600'}}>Room Title</label>
                  <input type="text" className="admin-form-input" value={editingRoom.name || ''} onChange={e => setEditingRoom({...editingRoom, name: e.target.value})} placeholder="Enter room name" />
                </div>
                <div className="admin-form-group" style={{margin: 0, flex: '1 1 180px'}}>
                  <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600'}}>Status</label>
                  <select className="admin-form-input" value={editingRoom.status || 'Available'} onChange={e => setEditingRoom({...editingRoom, status: e.target.value})}>
                    <option>Available</option><option>Booked</option><option>Inactive</option><option>Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Description */}
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600'}}>Description</label>
                <textarea className="admin-form-textarea" rows="2" value={editingRoom.description || ''} onChange={e => setEditingRoom({...editingRoom, description: e.target.value})} placeholder="Describe the room..." style={{resize: 'vertical', minHeight: '60px'}}></textarea>
              </div>

              {/* Row 3: Exact order: Original Price -> Discounted Price -> OFF in one clean horizontal row */}
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px'}}>
                <div className="admin-form-group" style={{margin: 0}}>
                  <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600'}}>Original Price (₹)</label>
                  <input type="number" className="admin-form-input" value={editingRoom.original_price || ''} onChange={e => setEditingRoom({...editingRoom, original_price: e.target.value})} placeholder="0.00" />
                </div>
                <div className="admin-form-group" style={{margin: 0}}>
                  <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600'}}>Discounted Price (₹)</label>
                  <input type="number" className="admin-form-input" value={editingRoom.price || ''} onChange={e => setEditingRoom({...editingRoom, price: e.target.value})} placeholder="0.00" />
                </div>
                <div className="admin-form-group" style={{margin: 0}}>
                  <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600'}}>OFF (%)</label>
                  <input type="text" className="admin-form-input" readOnly value={parseFloat(editingRoom.original_price) > 0 && parseFloat(editingRoom.original_price) > parseFloat(editingRoom.price) ? (((editingRoom.original_price - editingRoom.price) / editingRoom.original_price) * 100).toFixed(1) : 0} style={{background: '#f8fafc', color: '#870097', fontWeight: 'bold', border: '1px solid #cbd5e1', padding: '12px 16px'}} />
                </div>
              </div>

              {/* Row 4: Room Image */}
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600'}}>Room Image</label>
                <div style={{display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc'}}>
                  {editingRoom.image_url && <img src={editingRoom.image_url} alt="Preview" style={{width: '54px', height: '54px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0'}} />}
                  <div style={{flex: 1}}>
                    <input type="file" accept="image/*" className="admin-form-input" onChange={handleImageUpload} style={{padding: '6px 10px', background: '#fff', cursor: 'pointer', border: '1px solid #cbd5e1', fontSize: '13px'}} />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions: Clearly visible and positioned Save and Cancel buttons */}
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9'}}>
              <button className="admin-btn-outline" onClick={() => setEditingRoom(null)} style={{padding: '10px 20px', fontWeight: '600'}}>Cancel</button>
              <button className="admin-btn-primary" onClick={saveRoomDetails} style={{padding: '10px 24px', fontWeight: '600'}}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const initialFeaturedItems = [];

function CafeFeaturedTab() {
  const [items, setItems] = useState(initialFeaturedItems);
  const [editingItem, setEditingItem] = useState(null);

  const handleSave = () => {
    fetch(`${API_CONFIG_URL}/api_cafe.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setItems(items.map(item => item.id === editingItem.id ? editingItem : item));
        setEditingItem(null);
      } else {
        alert(data.message);
      }
    })
    .catch(e => console.error(e));
  };

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_cafe.php`)
      .then(r => r.json())
      .then(d => {
        if(d.status === 'success' && d.data.length > 0) {
          const featured = d.data.filter(i => Number(i.is_featured) === 1 || i.is_featured === true);
          setItems(featured.map(i => ({
               id: i.item_id || i.id,
               image: i.image_url,
               name: i.title,
               desc: i.description,
               category: i.category,
               tag: i.tag,
               rating: i.rating || 4.8,
               price: i.price,
               originalPrice: i.original_price,
               isVeg: Number(i.is_veg) === 1 || i.is_veg === true,
               status: i.status
             })));
        }
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <PageHeader title="Featured Menu Items" subtitle="Manage the featured items shown on the Cafe page." />
      
      {editingItem && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '550px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px'}}>
              <h2 style={{margin: 0, fontSize: '20px', color: '#373737', fontWeight: '700'}}>Edit Featured Item</h2>
              <button onClick={() => setEditingItem(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Item Image</label>
                <div style={{display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc'}}>
                  <img src={editingItem.image} alt="Preview" style={{width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                  <div style={{flex: 1}}>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="admin-form-input" style={{padding: '8px', background: '#fff', cursor: 'pointer', border: '1px solid #cbd5e1'}} />
                    <p style={{margin: '8px 0 0 0', fontSize: '12px', color: '#64748b'}}>Recommended: Square image (1:1 ratio)</p>
                  </div>
                </div>
              </div>

              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Item Name</label>
                <input type="text" className="admin-form-input" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} placeholder="Enter item name" />
              </div>

              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Price (₹)</label>
                <input type="number" className="admin-form-input" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} placeholder="0.00" />
              </div>

              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Description</label>
                <textarea className="admin-form-textarea" rows="3" value={editingItem.desc} onChange={e => setEditingItem({...editingItem, desc: e.target.value})} placeholder="Describe the item..."></textarea>
              </div>
            </div>

            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #f1f5f9'}}>
              <button className="admin-btn-outline" onClick={() => setEditingItem(null)} style={{padding: '10px 20px', fontWeight: '600'}}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSave} style={{padding: '10px 24px', fontWeight: '600'}}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-item-grid">
        {items.map(item => (
          <div key={item.id} className="admin-item-card">
            <img src={item.image} alt={item.name} className="admin-item-img" />
            <div className="admin-item-content">
              <div className="admin-item-header"><h3 className="admin-item-title">{item.name}</h3><span className="admin-badge badge-success">₹{item.price}</span></div>
              <div className="admin-item-meta" style={{display: 'block'}}>
                <p style={{fontSize: '13px', color: '#64748b', marginBottom: '12px', lineHeight: '1.4'}}>{item.desc}</p>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  <span className={item.isVeg ? 'admin-text-veg' : 'admin-text-nonveg'}>{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                  <span className="admin-cell-muted">Category: {item.category}</span>
                </div>
              </div>
              <div className="admin-item-actions">
                <button className="admin-btn-outline admin-btn-full" onClick={() => setEditingItem({...item})} style={{justifyContent: 'center'}}><Edit01Icon size={16} /> Edit Item</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const menuCategories = ["Breakfast", "Pahadi Khana (Seasonal)", "All Day Snacks", "Rice & Roti", "Add Ons", "Teas", "Beverages & Soups"];

const initialMenuItems = [
  { id: 1, category: "Breakfast", name: "Cheese Vegetable Omelette", desc: "Two eggs with tossed vegetable and sprinkled cheese served with butter toast", price: 150, isVeg: false },
  { id: 2, category: "Breakfast", name: "Aloo/ Onion/ Paneer Paratha", desc: "Served with Butter and Fresh Mint Chutney", price: 150, isVeg: true },
  { id: 3, category: "Breakfast", name: "Poha", desc: "Flattened rice, onions, potatoes, green peas peanuts and flavoured with basic spices and herbs", price: 100, isVeg: true },
  { id: 4, category: "Breakfast", name: "Egg Bhurji", desc: "Spiced Indian two scrambled eggs served with butter toast", price: 100, isVeg: false },
  { id: 5, category: "Breakfast", name: "Paneer / Corn / Vegetable Cheese Sandwich", desc: "Classic Indian street food snack, made from layers of chutney, masala mix, cheese and sliced veg/paneer or corn", price: 200, isVeg: true },
  
  { id: 6, category: "Pahadi Khana (Seasonal)", name: "Bhat Ki Dal / Chudkani", desc: "Organic black soybeans cooked in iron pan in authentic style", price: 400, isVeg: true },
  { id: 7, category: "Pahadi Khana (Seasonal)", name: "Pahadi Rajma", desc: "Rajma/Kidney Beans, cooked in Pahadi style along with desi ghee", price: 400, isVeg: true },
  { id: 8, category: "Pahadi Khana (Seasonal)", name: "Gahat Ki Dal", desc: "Gahat Dal or horse gram is one of the oldest Pahadi traditional medicines used to control diabetes", price: 400, isVeg: true },
  { id: 9, category: "Pahadi Khana (Seasonal)", name: "Farm Fresh Organic Vegetable", desc: "Fresh Organic Seasonal Vegetable from Farm to Table", price: 400, isVeg: true },
  { id: 10, category: "Pahadi Khana (Seasonal)", name: "Pahadi Kadi", desc: "Jholi is Curd and Besan thick and spicy curry preparation from hills of Uttarakhand", price: 300, isVeg: true },
  { id: 11, category: "Pahadi Khana (Seasonal)", name: "Pahadi Raita", desc: "Flavoured rice, onions, potatoes, green peas peanuts and flavoured with basic spices and herbs", price: 75, isVeg: true },
  { id: 12, category: "Pahadi Khana (Seasonal)", name: "Bhang Ki Chutney", desc: "Made from Bhang (Hemp) seeds which have no psychoactive properties", price: 50, isVeg: true },
  { id: 13, category: "Pahadi Khana (Seasonal)", name: "Pahadi Mutton/ Chicken Curry", desc: "The unbeatable Pahadi family recipe, this curry is spicy and full of flavours", price: 500, isVeg: false },
  { id: 14, category: "Pahadi Khana (Seasonal)", name: "Veg / Non Veg Authentic Pahadi Lunch/Dinner", desc: "Price per person", price: "500 / 750", isVeg: true },

  { id: 15, category: "All Day Snacks", name: "Masala Maggie", desc: "", price: 120, isVeg: true },
  { id: 16, category: "All Day Snacks", name: "Mix Pakode With Mint Chutney", desc: "", price: 150, isVeg: true },
  { id: 17, category: "All Day Snacks", name: "French Fries With Cheese Dip", desc: "", price: 150, isVeg: true },
  { id: 18, category: "All Day Snacks", name: "Butter Toast", desc: "", price: 100, isVeg: true },
  { id: 19, category: "All Day Snacks", name: "Bun Tikki", desc: "", price: 150, isVeg: true },
  { id: 20, category: "All Day Snacks", name: "Bambaiya Sandwich", desc: "This grilled snack is stuffed with aloo masala and veggies", price: 150, isVeg: true },
  { id: 21, category: "All Day Snacks", name: "Wada Pav", desc: "", price: 150, isVeg: true },

  { id: 22, category: "Rice & Roti", name: "Steamed Basmati Rice", desc: "", price: 150, isVeg: true },
  { id: 23, category: "Rice & Roti", name: "Jeera Rice", desc: "", price: 175, isVeg: true },
  { id: 24, category: "Rice & Roti", name: "Peas Pulav", desc: "", price: 200, isVeg: true },
  { id: 25, category: "Rice & Roti", name: "Special Dal Khichdi", desc: "", price: 200, isVeg: true },
  { id: 26, category: "Rice & Roti", name: "Plain Roti", desc: "", price: 25, isVeg: true },
  { id: 27, category: "Rice & Roti", name: "Raagi Roti", desc: "", price: 50, isVeg: true },
  { id: 28, category: "Rice & Roti", name: "Puri / Paratha", desc: "", price: 50, isVeg: true },

  { id: 29, category: "Add Ons", name: "Roasted Papad", desc: "", price: 50, isVeg: true },
  { id: 30, category: "Add Ons", name: "Masala Papad", desc: "", price: 100, isVeg: true },
  { id: 31, category: "Add Ons", name: "Curd", desc: "", price: 50, isVeg: true },
  { id: 32, category: "Add Ons", name: "Raita", desc: "", price: 75, isVeg: true },
  { id: 33, category: "Add Ons", name: "Green Salad", desc: "", price: 100, isVeg: true },

  { id: 34, category: "Teas", name: "Detox Tea With Honey", desc: "", price: 150, isVeg: true },
  { id: 35, category: "Teas", name: "Mint Ginger Tea", desc: "", price: 120, isVeg: true },
  { id: 36, category: "Teas", name: "Rosemary With Honey", desc: "", price: 120, isVeg: true },
  { id: 37, category: "Teas", name: "Thyme Ginger With Honey", desc: "", price: 120, isVeg: true },
  { id: 38, category: "Teas", name: "Lemon Grass Ginger With Honey", desc: "", price: 120, isVeg: true },
  { id: 39, category: "Teas", name: "Pahadi Chay With Jaggery", desc: "", price: 120, isVeg: true },
  { id: 40, category: "Teas", name: "Exotic Masala Tea", desc: "", price: 120, isVeg: true },
  { id: 41, category: "Teas", name: "Organic Himalayan Turmeric Milk", desc: "", price: 120, isVeg: true },

  { id: 42, category: "Beverages & Soups", name: "Black Coffee", desc: "", price: 100, isVeg: true },
  { id: 43, category: "Beverages & Soups", name: "Expresso Hot Coffee", desc: "", price: 120, isVeg: true },
  { id: 44, category: "Beverages & Soups", name: "Chochlate Shake", desc: "", price: 100, isVeg: true },
  { id: 45, category: "Beverages & Soups", name: "Banana Shake", desc: "", price: 100, isVeg: true },
  { id: 46, category: "Beverages & Soups", name: "Fresh Lime Soda", desc: "", price: 100, isVeg: true },
  { id: 47, category: "Beverages & Soups", name: "Lassi Or Chaans", desc: "", price: 100, isVeg: true },
  { id: 48, category: "Beverages & Soups", name: "Thyme Tomato Soup", desc: "", price: 150, isVeg: true },
];

function CafeMenuTab() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]);
  const [allItems, setAllItems] = useState(initialMenuItems);
  const [editingItem, setEditingItem] = useState(null);

  const filteredItems = allItems.filter(i => i.category === activeCategory);

  const saveItem = () => {
    fetch(`${API_CONFIG_URL}/api_cafe.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setAllItems(allItems.map(item => item.id === editingItem.id ? editingItem : item));
        setEditingItem(null);
      } else {
        alert(data.message);
      }
    })
    .catch(e => console.error(e));
  };

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_cafe.php`)
      .then(r => r.json())
      .then(d => {
        if(d.status === 'success' && d.data.length > 0) {
          setAllItems(d.data.map(i => ({
             id: i.item_id || i.id,
             image: i.image_url,
             name: i.title,
             desc: i.description,
             category: i.category,
             tag: i.tag,
             rating: i.rating || 4.8,
             price: i.price,
             originalPrice: i.original_price,
             isVeg: Number(i.is_veg) === 1 || i.is_veg === true,
             status: i.status
          })));
        }
      });
  }, []);

  return (
    <>
      <PageHeader title="Full Menu Categories" subtitle="Manage all menu items." />
      <div className="admin-card">
        <div className="admin-filter-bar" style={{flexWrap: 'wrap', gap: '8px', padding: '16px'}}>
          {menuCategories.map(cat => (<button key={cat} className={`admin-filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>))}
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Item Name</th><th>Pricing</th><th>Diet</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="admin-text-medium">{item.name}</div>
                    <div className="admin-cell-muted" style={{fontSize: '12px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.desc}</div>
                  </td>
                  <td>
                    <div style={{fontWeight: '600'}}>₹{item.price}</div>
                  </td>
                  <td>
                    <span className={item.isVeg ? 'admin-text-veg' : 'admin-text-nonveg'} style={{fontSize: '12px'}}>{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                  </td>
                  <td>
                    <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingItem({...item})}><Edit01Icon size={14} /></button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '24px', color: '#817F7F'}}>No items in this category.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {editingItem && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '550px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px'}}>
              <h2 style={{margin: 0, fontSize: '20px', color: '#373737', fontWeight: '700'}}>Edit Menu Item</h2>
              <button onClick={() => setEditingItem(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Item Name</label>
                <input type="text" className="admin-form-input" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} placeholder="Enter item name" />
              </div>
              
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Category</label>
                <select className="admin-form-input" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                  {menuCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div className="admin-form-row" style={{margin: 0}}>
                  <div className="admin-form-group" style={{margin: 0}}>
                    <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Price (₹)</label>
                    <input type="number" className="admin-form-input" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} placeholder="0.00" />
                  </div>
                  <div className="admin-form-group" style={{margin: 0}}>
                    <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Diet</label>
                    <select className="admin-form-input" value={editingItem.isVeg ? 'yes' : 'no'} onChange={e => setEditingItem({...editingItem, isVeg: e.target.value === 'yes'})}>
                      <option value="yes">Veg</option>
                      <option value="no">Non-Veg</option>
                    </select>
                  </div>
              </div>

              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Description</label>
                <textarea className="admin-form-textarea" rows="3" value={editingItem.desc} onChange={e => setEditingItem({...editingItem, desc: e.target.value})} placeholder="Describe the item..."></textarea>
              </div>

              <div className="admin-form-row" style={{margin: 0, alignItems: 'center'}}>
                <div className="admin-form-group" style={{margin: 0}}>
                  <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Featured Item</label>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <input type="checkbox" checked={Number(editingItem.is_featured) === 1 || editingItem.is_featured === true || editingItem.isFeatured === true} onChange={e => setEditingItem({...editingItem, isFeatured: e.target.checked, is_featured: e.target.checked ? 1 : 0})} style={{width: '20px', height: '20px', cursor: 'pointer'}} />
                    <span style={{color: '#64748b', fontSize: '14px'}}>Show in featured section</span>
                  </div>
                </div>
              </div>

              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Item Image</label>
                <div style={{display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc'}}>
                  {editingItem.image && <img src={editingItem.image} alt="Preview" style={{width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0'}} />}
                  <div style={{flex: 1}}>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setEditingItem({ ...editingItem, image: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }} className="admin-form-input" style={{padding: '8px', background: '#fff', cursor: 'pointer', border: '1px solid #cbd5e1'}} />
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #f1f5f9'}}>
              <button className="admin-btn-outline" onClick={() => setEditingItem(null)} style={{padding: '10px 20px', fontWeight: '600'}}>Cancel</button>
              <button className="admin-btn-primary" onClick={saveItem} style={{padding: '10px 24px', fontWeight: '600'}}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GuestsTab() {
  const [guests, setGuests] = useState([]);
  const [totalGuestsCount, setTotalGuestsCount] = useState(0);
  const [viewingHistory, setViewingHistory] = useState(null);
  const [guestBookings, setGuestBookings] = useState([]);

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_guests.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setGuests(data.data); })
      .catch(e => console.error("JSON Error in Guests:", e));

    fetch(`${API_CONFIG_URL}/api_bookings.php`)
      .then(res => res.json())
      .then(data => {
        if(data && data.status === 'success' && Array.isArray(data.data)) {
          const totalG = data.data.reduce((sum, b) => sum + parseInt(b.guest_count), 0);
          setTotalGuestsCount(totalG);
          setGuestBookings(data.data);
        }
      }).catch(e => console.error("JSON Error in Bookings:", e));
  }, []);

  return (
    <>
      <PageHeader title="Guest Directory" subtitle="Manage guest information and stay history." />
      
      <div className="admin-card" style={{marginBottom: '24px', padding: '24px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', gap: '16px'}}>
        <div style={{background: '#fff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'}}>
          <UserGroupIcon size={24} color="#0f172a" />
        </div>
        <div>
          <h3 style={{margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500'}}>Total Guests (Across all bookings)</h3>
          <p style={{margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700', color: '#0f172a'}}>{totalGuestsCount}</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Guest Name</th><th>Contact Info</th><th>Total Stays</th><th>Last Room</th><th>Actions</th></tr></thead>
            <tbody>
              {guests.map((g, idx) => (
                <tr key={idx}>
                  <td className="admin-text-medium">{g.name}</td>
                  <td><div className="admin-cell-stack"><span>{g.email}</span><span className="admin-cell-muted">{g.phone}</span></div></td>
                  <td>{g.total_stays}</td>
                  <td>{g.last_room || 'N/A'}</td>
                  <td><button className="admin-btn-sm admin-btn-outline" onClick={() => setViewingHistory(g)}>History</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingHistory && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '600px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px'}}>
              <h2 style={{margin: 0, fontSize: '20px', color: '#373737', fontWeight: '700'}}>Booking History: {viewingHistory.name}</h2>
              <button onClick={() => setViewingHistory(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            <div style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '8px'}}>
              {guestBookings.filter(b => b.guest_id === viewingHistory.id).length === 0 ? (
                <div style={{textAlign: 'center', color: '#64748b', padding: '24px'}}>No booking history found for this guest.</div>
              ) : (
                guestBookings.filter(b => b.guest_id === viewingHistory.id).map((b, i) => (
                  <div key={i} style={{background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e2e8f0'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span style={{fontWeight: '600', color: '#0f172a'}}>#BK-{b.id} &bull; {b.room_name || `Room ${b.room_id}`}</span>
                      <span className={`admin-badge ${b.status === 'Confirmed' || b.status === 'Completed' ? 'badge-success' : b.status === 'Pending' ? 'badge-info' : 'badge-danger'}`}>{b.status}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b'}}>
                      <span>{b.check_in} to {b.check_out}</span>
                      <span>{b.guest_count} {parseInt(b.guest_count) === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [editingPayment, setEditingPayment] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  
  const fetchPayments = () => {
    Promise.all([
      fetch(`${API_CONFIG_URL}/api_payments.php`).then(res => res.json()),
      fetch(`${API_CONFIG_URL}/api_bookings.php`).then(res => res.json())
    ]).then(([paymentsData, bookingsData]) => {
      let fetchedBookings = [];
      if (bookingsData && bookingsData.status === 'success') {
        fetchedBookings = bookingsData.data;
      }
      if (paymentsData && paymentsData.status === 'success') {
        const mergedPayments = paymentsData.data.map(p => {
          const booking = fetchedBookings.find(b => b.id === p.booking_id);
          return {
            ...p,
            guest_name: booking ? (booking.guest_name || `Guest ${booking.guest_id}`) : 'Unknown',
            room_id: booking ? (booking.room_name || `Room ${booking.room_id}`) : 'N/A' 
          };
        });
        setPayments(mergedPayments);
      }
    }).catch(e => console.error("JSON Error in Payments:", e));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const savePayment = () => {
    const isNew = !editingPayment.id;
    const method = isNew ? 'POST' : 'PUT';
    
    fetch(`${API_CONFIG_URL}/api_payments.php`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         id: editingPayment.id,
         booking_id: editingPayment.booking_id || 1,
         razorpay_order_id: editingPayment.razorpay_order_id || '',
         razorpay_payment_id: editingPayment.razorpay_payment_id || '',
         amount: editingPayment.amount || 0,
         payment_method: editingPayment.payment_method || 'Online / Card',
         status: editingPayment.status || 'Pending'
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        fetchPayments();
        setEditingPayment(null);
      } else {
        alert(data.message || 'Error saving payment');
      }
    }).catch(e => console.error(e));
  };

  const deletePayment = (id) => {
    if(!window.confirm("Are you sure you want to delete this payment?")) return;
    fetch(`${API_CONFIG_URL}/api_payments.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        setPayments(payments.filter(p => p.id !== id));
      } else {
        alert(data.message || 'Error deleting payment');
      }
    }).catch(e => console.error(e));
  };

  const filteredPayments = filter === 'All' ? payments : payments.filter(p => p.status === filter);

  return (
    <>
      <PageHeader title="Payment History" subtitle="Track all transactions, settlements, and refunds." action={<button className="admin-btn-primary" onClick={() => setEditingPayment({status: 'Pending', booking_id: 1, amount: 0})}><PlusSignIcon size={18} /> New Payment</button>} />
      <div className="admin-card">
        <div className="admin-filter-bar">
          {['All', 'Success', 'Pending', 'Failed', 'Refunded'].map(f => (
             <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Guest Name</th><th>Room</th><th>Amount</th><th>Method</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredPayments.map((p, i) => (
                <tr key={i}>
                  <td className="admin-text-mono">{p.razorpay_payment_id || `#PAY-${p.id}`}</td>
                  <td className="admin-text-medium">{p.guest_name}</td>
                  <td>{p.room_id}</td>
                  <td className="admin-text-medium">&#8377;{p.amount}</td>
                  <td><div className="admin-cell-stack"><span>Razorpay</span><span className="admin-cell-muted">{p.payment_method || 'Online / Card'}</span></div></td>
                  <td>
                    <div className="admin-action-group">
                      <button className="admin-btn-sm admin-btn-outline" title="Receipt" onClick={() => setViewingReceipt(p)}><Doc01Icon size={14} /></button>
                      <button className="admin-btn-sm admin-btn-outline" onClick={() => deletePayment(p.id)}><Delete01Icon size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && <tr><td colSpan="6" style={{textAlign: 'center', padding: '24px'}}>No {filter.toLowerCase()} payments found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editingPayment && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '500px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px'}}>
              <h2 style={{margin: 0, fontSize: '20px', color: '#373737', fontWeight: '700'}}>{editingPayment.id ? 'Edit Payment' : 'New Payment'}</h2>
              <button onClick={() => setEditingPayment(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div className="admin-form-group">
                <label className="admin-form-label">Booking ID</label>
                <input type="number" className="admin-form-input" value={editingPayment.booking_id || ''} onChange={e => setEditingPayment({...editingPayment, booking_id: e.target.value})} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Razorpay Order ID</label>
                <input type="text" className="admin-form-input" value={editingPayment.razorpay_order_id || ''} onChange={e => setEditingPayment({...editingPayment, razorpay_order_id: e.target.value})} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Razorpay Payment ID</label>
                <input type="text" className="admin-form-input" value={editingPayment.razorpay_payment_id || ''} onChange={e => setEditingPayment({...editingPayment, razorpay_payment_id: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div className="admin-form-group" style={{flex: 1}}>
                  <label className="admin-form-label">Amount</label>
                  <input type="number" className="admin-form-input" value={editingPayment.amount || ''} onChange={e => setEditingPayment({...editingPayment, amount: e.target.value})} />
                </div>
                <div className="admin-form-group" style={{flex: 1}}>
                  <label className="admin-form-label">Method</label>
                  <input type="text" className="admin-form-input" value={editingPayment.payment_method || ''} onChange={e => setEditingPayment({...editingPayment, payment_method: e.target.value})} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select className="admin-form-input" value={editingPayment.status || 'Pending'} onChange={e => setEditingPayment({...editingPayment, status: e.target.value})}>
                  <option>Pending</option>
                  <option>Success</option>
                  <option>Failed</option>
                  <option>Refunded</option>
                </select>
              </div>
              <button className="admin-btn-primary admin-btn-full" onClick={savePayment}>Save Payment</button>
            </div>
          </div>
        </div>
      )}

      {viewingReceipt && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '400px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={{margin: 0, fontSize: '20px', color: '#373737', fontWeight: '700'}}>Payment Receipt</h2>
              <button onClick={() => setViewingReceipt(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={20} strokeWidth={1.5} /></button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px'}}>
                <span style={{color: '#64748b'}}>Transaction ID</span>
                <span style={{fontWeight: '500', color: '#0f172a'}}>{viewingReceipt.razorpay_payment_id || `#PAY-${viewingReceipt.id}`}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px'}}>
                <span style={{color: '#64748b'}}>Order ID</span>
                <span style={{fontWeight: '500', color: '#0f172a'}}>{viewingReceipt.razorpay_order_id || 'N/A'}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px'}}>
                <span style={{color: '#64748b'}}>Guest Name</span>
                <span style={{fontWeight: '500', color: '#0f172a'}}>{viewingReceipt.guest_name}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px'}}>
                <span style={{color: '#64748b'}}>Room ID</span>
                <span style={{fontWeight: '500', color: '#0f172a'}}>{viewingReceipt.room_id}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px'}}>
                <span style={{color: '#64748b'}}>Payment Method</span>
                <span style={{fontWeight: '500', color: '#0f172a'}}>{viewingReceipt.payment_method || 'Online / Card'}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px'}}>
                <span style={{color: '#64748b'}}>Status</span>
                <span className={`admin-badge ${viewingReceipt.status === 'Success' ? 'badge-success' : viewingReceipt.status === 'Pending' ? 'badge-info' : 'badge-danger'}`}>{viewingReceipt.status}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '4px'}}>
                <span style={{color: '#0f172a', fontWeight: '600', fontSize: '15px'}}>Amount Paid</span>
                <span style={{color: '#16a34a', fontWeight: '700', fontSize: '15px'}}>&#8377;{viewingReceipt.amount}</span>
              </div>
            </div>
            <div style={{marginTop: '24px'}}>
              <button className="admin-btn-primary admin-btn-full" onClick={() => {
                const receiptText = `MERAKI LIVING - PAYMENT RECEIPT\n\nTransaction ID: ${viewingReceipt.razorpay_payment_id || '#PAY-'+viewingReceipt.id}\nOrder ID: ${viewingReceipt.razorpay_order_id || 'N/A'}\nGuest Name: ${viewingReceipt.guest_name}\nRoom ID: ${viewingReceipt.room_id}\nPayment Method: ${viewingReceipt.payment_method || 'Online / Card'}\nStatus: ${viewingReceipt.status}\n\nAmount Paid: INR ${viewingReceipt.amount}\n`;
                const blob = new Blob([receiptText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Receipt_${viewingReceipt.razorpay_payment_id || viewingReceipt.id}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontWeight: '600'}}>
                <Download02Icon size={18} strokeWidth={1.5} /> Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CouponsTab() {
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const fetchCoupons = () => {
    fetch(`${API_CONFIG_URL}/api_coupons.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setCoupons(data.data);
        }
      })
      .catch(err => console.error("Error fetching coupons:", err));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const saveCoupon = async () => {
    if (!editingCoupon.code || !editingCoupon.discount_percentage) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      if (editingCoupon.coupon_id) {
        // Update existing
        const res = await fetch(`${API_CONFIG_URL}/api_coupons.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCoupon)
        });
        const data = await res.json();
        if (data.status === 'success') fetchCoupons();
      } else {
        // Create new
        const res = await fetch(`${API_CONFIG_URL}/api_coupons.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCoupon)
        });
        const data = await res.json();
        if (data.status === 'success') fetchCoupons();
      }
      setEditingCoupon(null);
    } catch (err) {
      console.error("Error saving coupon:", err);
    }
  };

  const deleteCoupon = async (id) => {
    if(!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`${API_CONFIG_URL}/api_coupons.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon_id: id })
      });
      const data = await res.json();
      if (data.status === 'success') fetchCoupons();
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  return (
    <div className="admin-fade-in" style={{minHeight: 'calc(100vh - 64px)'}}>
      <PageHeader title="Room Booking Coupons" subtitle="Manage discount coupons specifically for room reservations." action={<button className="admin-btn-primary" onClick={() => setEditingCoupon({status: 'Active', discount_percentage: ''})}><PlusSignIcon size={18} /> Add New Coupon</button>} />
      
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Coupon Code</th><th>Discount Percentage</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.coupon_id}>
                  <td>
                    <div className="admin-text-medium" style={{letterSpacing: '0.5px'}}>{c.code}</div>
                  </td>
                  <td>
                    <div style={{fontWeight: '600', color: '#0f172a'}}>
                      {c.discount_percentage}% OFF
                    </div>
                  </td>
                  <td><span className={`admin-badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}`} style={c.status === 'Inactive' ? {background: '#fef2f2', color: '#dc2626'} : {}}>{c.status}</span></td>
                  <td>
                     <div className="admin-action-group">
                       <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingCoupon(c)}><Edit01Icon size={14} /></button>
                       <button className="admin-btn-sm admin-btn-outline" onClick={() => deleteCoupon(c.coupon_id)}><Delete01Icon size={14} /></button>
                     </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '40px 20px', color: '#64748b'}}>
                    <Ticket01Icon size={40} style={{margin: '0 auto 16px', opacity: 0.5}} />
                    <p style={{margin: 0, fontSize: '15px', fontWeight: '500'}}>No room coupons found</p>
                    <p style={{margin: '4px 0 0', fontSize: '13px'}}>Click "Add New Coupon" to create your first discount code.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {editingCoupon && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '450px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px'}}>
              <h2 style={{margin: 0, fontSize: '20px', color: '#373737', fontWeight: '700'}}>{editingCoupon.coupon_id ? 'Edit Room Coupon' : 'Add New Coupon'}</h2>
              <button onClick={() => setEditingCoupon(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Coupon Code *</label>
                <input type="text" className="admin-form-input" value={editingCoupon.code || ''} onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})} placeholder="e.g. ROOM20" style={{border: '1px solid #cbd5e1', padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600'}} />
              </div>

              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Discount Percentage (%) *</label>
                <input type="number" className="admin-form-input" value={editingCoupon.discount_percentage || ''} onChange={e => setEditingCoupon({...editingCoupon, discount_percentage: e.target.value})} placeholder="e.g. 15" />
              </div>

              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '8px', color: '#334155', fontWeight: '600'}}>Status</label>
                <select className="admin-form-input" value={editingCoupon.status || 'Active'} onChange={e => setEditingCoupon({...editingCoupon, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #f1f5f9'}}>
              <button className="admin-btn-outline" onClick={() => setEditingCoupon(null)} style={{padding: '10px 20px', fontWeight: '600'}}>Cancel</button>
              <button className="admin-btn-primary" onClick={saveCoupon} style={{padding: '10px 24px', fontWeight: '600'}}>Save Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryTab() {
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState('explore');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const fetchGallery = () => {
    fetch(`${API_CONFIG_URL}/api_gallery.php?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success') setImages(data.data); })
      .catch(e => console.error("JSON Error in Gallery:", e));
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e, category, oldImageId = null) => {
    const file = e.target.files[0];
    // reset input to allow uploading the same file again immediately if needed
    e.target.value = '';
    
    if(!file) return;
    
    setIsLoading(true);
    setMessage('Uploading image...');
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('action', 'upload');
    
    try {
      const uploadRes = await fetch(`${API_CONFIG_URL}/api_rooms.php`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();
      
      if(uploadData.status === 'success') {
         setMessage('Saving to gallery...');
         
         const galleryRes = await fetch(`${API_CONFIG_URL}/api_gallery.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: uploadData.image_url, category })
         });
         const galleryData = await galleryRes.json();
         
         if(galleryData.status === 'success') {
            if (oldImageId) {
               setMessage('Removing old image...');
               await fetch(`${API_CONFIG_URL}/api_gallery.php`, {
                 method: 'DELETE',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ image_id: oldImageId })
               });
            }
            setMessage('Update successful!');
            fetchGallery();
            // Dispatch event to notify other components of gallery change
            if (typeof window !== 'undefined') {
               window.dispatchEvent(new Event('galleryUpdated'));
            }
            setTimeout(() => setMessage(''), 3000);
         } else {
            setMessage('Error: Failed to save to gallery');
            setTimeout(() => setMessage(''), 3000);
         }
      } else {
        setMessage('Error: Failed to upload image');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error: An unexpected error occurred');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if(!window.confirm("Are you sure you want to remove this image?")) return;
    setIsLoading(true);
    setMessage('Removing image...');
    try {
      const res = await fetch(`${API_CONFIG_URL}/api_gallery.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: id })
      });
      const data = await res.json();
      if(data.status === 'success') {
        setMessage('Image removed successfully!');
        setImages(prev => prev.filter(img => img.image_id !== id));
      } else {
        setMessage('Error: Failed to remove image');
      }
    } catch(err) {
      console.error(err);
      setMessage('Error: An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const HOME_EXPLORE_SECTIONS = [
    { id: 'Explore - Luxury Rooms', title: 'Luxury Rooms' },
    { id: 'Explore - Exterior', title: 'Exterior' },
    { id: 'Explore - Himalayan Views', title: 'Himalayan Views' },
    { id: 'Explore - Organic Farm', title: 'Organic Farm' },
    { id: 'Explore - Cafe & Dining', title: 'Cafe & Dining' }
  ];

  const CAFE_AMBIANCE_SECTIONS = [
    { id: 'Cafe Ambiance Gallery', title: 'Cafe Ambiance Gallery' }
  ];

  const OTHER_SECTIONS = [
    { id: 'Rooms Gallery', title: 'Rooms Gallery (Existing)' },
    { id: 'Cafe Ambiance', title: 'Cafe Ambiance (Old Legacy)' },
    { id: 'Main Explore Gallery', title: 'Main Explore Gallery (Old Legacy)' }
  ];

  const renderSectionBlock = (section) => {
    const sectionImages = images.filter(img => img.category === section.id);
    return (
      <div key={section.id} className="admin-card" style={{marginBottom: '32px', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px'}}>
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px'}}>
            <h3 style={{fontSize: '18px', fontWeight: 600, color: '#1a1a1a', margin: 0}}>{section.title}</h3>
            <span style={{fontSize: '13px', color: '#666', backgroundColor: '#f5f5f5', padding: '4px 10px', borderRadius: '20px'}}>{sectionImages.length} Images</span>
         </div>
         
         <div className="admin-item-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px'}}>
            {sectionImages.map(img => (
               <div key={img.image_id} style={{border: '1px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fafafa', position: 'relative', display: 'flex', flexDirection: 'column'}}>
                  <div style={{position: 'relative', width: '100%', height: '160px'}}>
                     <img src={img.image_url} alt={section.title} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
                  </div>
                  <div style={{padding: '12px', display: 'flex', gap: '8px', justifyContent: 'space-between', borderTop: '1px solid #eee'}}>
                     <label className="admin-btn-outline" style={{flex: 1, padding: '8px', fontSize: '13px', cursor: isLoading ? 'not-allowed' : 'pointer', textAlign: 'center', opacity: isLoading ? 0.5 : 1}}>
                        Change
                        <input type="file" style={{display: 'none'}} disabled={isLoading} onChange={(e) => handleUpload(e, section.id, img.image_id)} accept="image/*" />
                     </label>
                     <button className="admin-btn-outline" disabled={isLoading} style={{flex: 1, padding: '8px', fontSize: '13px', color: '#d9534f', borderColor: '#ffcdcd', backgroundColor: '#fff5f5', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1}} onClick={() => handleDeleteImage(img.image_id)}>
                        Remove
                     </button>
                  </div>
               </div>
            ))}
            
            <label style={{border: '2px dashed #d9d9d9', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', cursor: isLoading ? 'not-allowed' : 'pointer', backgroundColor: '#fafbfc', transition: 'all 0.2s ease', opacity: isLoading ? 0.5 : 1}}>
               <PlusSignIcon size={28} style={{color: '#870097', marginBottom: '12px'}} />
               <span style={{color: '#333', fontWeight: 500, fontSize: '15px'}}>Upload Image</span>
               <span style={{color: '#888', fontSize: '12px', marginTop: '6px'}}>to {section.title}</span>
               <input type="file" style={{display: 'none'}} disabled={isLoading} onChange={(e) => handleUpload(e, section.id, null)} accept="image/*" />
            </label>
         </div>
      </div>
    );
  };

  return (
    <>
      <PageHeader title="Gallery Manager" subtitle="Manage images for required sections like Home Explore and Cafe Ambiance." />
      
      {message && (
        <div style={{ padding: '12px 20px', backgroundColor: message.includes('Error') ? '#fef2f2' : '#f0fdf4', color: message.includes('Error') ? '#dc2626' : '#16a34a', borderRadius: '8px', marginBottom: '24px', border: `1px solid ${message.includes('Error') ? '#fca5a5' : '#bbf7d0'}`, fontWeight: '500' }}>
          {message}
        </div>
      )}

      <div className="admin-filter-bar" style={{marginBottom: '32px', display: 'flex', gap: '12px', borderBottom: '1px solid #eee', paddingBottom: '16px'}}>
         <button className={`admin-filter-btn ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')} style={{fontSize: '15px'}} disabled={isLoading}>Home → Explore</button>
         <button className={`admin-filter-btn ${activeTab === 'cafe' ? 'active' : ''}`} onClick={() => setActiveTab('cafe')} style={{fontSize: '15px'}} disabled={isLoading}>Cafe Ambiance</button>
         <button className={`admin-filter-btn ${activeTab === 'other' ? 'active' : ''}`} onClick={() => setActiveTab('other')} style={{fontSize: '15px'}} disabled={isLoading}>Other / Legacy</button>
      </div>
      
      <div style={{animation: 'fadeIn 0.3s ease'}}>
         {activeTab === 'explore' && HOME_EXPLORE_SECTIONS.map(renderSectionBlock)}
         {activeTab === 'cafe' && CAFE_AMBIANCE_SECTIONS.map(renderSectionBlock)}
         {activeTab === 'other' && OTHER_SECTIONS.map(renderSectionBlock)}
      </div>
    </>
  );
}

function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_reviews.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setReviews(data.data); })
      .catch(e => console.error("JSON Error in Reviews:", e));
  }, []);

  const saveReview = () => {
    const isNew = !editingReview.review_id;
    const method = isNew ? 'POST' : 'PUT';
    
    fetch(`${API_CONFIG_URL}/api_reviews.php`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         review_id: editingReview.review_id,
         guest_name: editingReview.guest_name || '',
         rating: editingReview.rating || 5,
         review_text: editingReview.review_text || '',
         type: editingReview.type || 'Homestay',
         visibility: editingReview.visibility || 'Visible'
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        fetch(`${API_CONFIG_URL}/api_reviews.php`)
          .then(res => res.json())
          .then(refetchData => {
            if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data)) {
              setReviews(refetchData.data);
            }
            setEditingReview(null);
          });
      }
    }).catch(e => console.error(e));
  };

  const deleteReview = (id) => {
    if(!window.confirm("Are you sure you want to delete this review?")) return;
    fetch(`${API_CONFIG_URL}/api_reviews.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id: id })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        setReviews(reviews.filter(r => r.review_id !== id));
      }
    }).catch(e => console.error(e));
  };

  return (
    <div className="admin-fade-in" style={{minHeight: 'calc(100vh - 64px)'}}>
      <PageHeader title="Reviews & Testimonials" subtitle="Manage guest reviews appearing on the homepage and cafe page." action={<button className="admin-btn-primary" onClick={() => setEditingReview({visibility: 'Visible', rating: 5, type: 'Homestay'})}><PlusSignIcon size={18} /> Add Review</button>} />
      
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', color: '#373737' }}>Homestay Reviews</h3>
        <div className="admin-card">
          <div className="admin-table-wrapper">
            <table className="admin-table admin-table-wrap">
              <thead><tr><th>Guest Name</th><th>Rating</th><th>Review Snippet</th><th>Visibility</th><th>Actions</th></tr></thead>
              <tbody>
                {reviews.filter(r => !r.type || r.type === 'Homestay').map((r, idx) => (
                  <tr key={idx}>
                    <td className="admin-text-medium">{r.guest_name}</td>
                    <td>{r.rating} Stars</td>
                    <td>{r.review_text.substring(0, 50)}...</td>
                    <td><span className="admin-badge badge-success">{r.visibility}</span></td>
                    <td>
                       <div style={{display: 'flex', gap: '8px'}}>
                         <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingReview(r)}>Edit</button>
                         <button className="admin-btn-sm admin-btn-outline" onClick={() => deleteReview(r.review_id)}>Delete</button>
                       </div>
                    </td>
                  </tr>
                ))}
                {reviews.filter(r => !r.type || r.type === 'Homestay').length === 0 && (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '24px', color: '#817F7F'}}>No Homestay reviews found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', color: '#373737' }}>Cafe Reviews</h3>
        <div className="admin-card">
          <div className="admin-table-wrapper">
            <table className="admin-table admin-table-wrap">
              <thead><tr><th>Guest Name</th><th>Rating</th><th>Review Snippet</th><th>Visibility</th><th>Actions</th></tr></thead>
              <tbody>
                {reviews.filter(r => r.type === 'Cafe').map((r, idx) => (
                  <tr key={idx}>
                    <td className="admin-text-medium">{r.guest_name}</td>
                    <td>{r.rating} Stars</td>
                    <td>{r.review_text.substring(0, 50)}...</td>
                    <td><span className="admin-badge badge-success">{r.visibility}</span></td>
                    <td>
                       <div style={{display: 'flex', gap: '8px'}}>
                         <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingReview(r)}>Edit</button>
                         <button className="admin-btn-sm admin-btn-outline" onClick={() => deleteReview(r.review_id)}>Delete</button>
                       </div>
                    </td>
                  </tr>
                ))}
                {reviews.filter(r => r.type === 'Cafe').length === 0 && (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '24px', color: '#817F7F'}}>No Cafe reviews found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {editingReview && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '600px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px'}}>
              <h2 style={{margin: 0, fontSize: '20px', color: '#373737', fontWeight: '700'}}>{editingReview.review_id ? 'Edit Review' : 'Add Review'}</h2>
              <button onClick={() => setEditingReview(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div className="admin-form-row" style={{margin: 0}}>
                <div className="admin-form-group" style={{margin: 0}}><label className="admin-form-label">Review Category</label><select className="admin-form-input" value={editingReview.type || 'Homestay'} onChange={e => setEditingReview({...editingReview, type: e.target.value})}><option value="Homestay">Homestay</option><option value="Cafe">Cafe</option></select></div>
                <div className="admin-form-group" style={{margin: 0}}><label className="admin-form-label">Guest Name</label><input type="text" className="admin-form-input" value={editingReview.guest_name || ''} onChange={e => setEditingReview({...editingReview, guest_name: e.target.value})} /></div>
              </div>
              <div className="admin-form-row" style={{margin: 0}}>
                <div className="admin-form-group" style={{margin: 0}}><label className="admin-form-label">Rating (1-5)</label><input type="number" min="1" max="5" className="admin-form-input" value={editingReview.rating || 5} onChange={e => setEditingReview({...editingReview, rating: e.target.value})} /></div>
                <div className="admin-form-group" style={{margin: 0}}><label className="admin-form-label">Visibility</label><select className="admin-form-input" value={editingReview.visibility || 'Visible'} onChange={e => setEditingReview({...editingReview, visibility: e.target.value})}><option>Visible</option><option>Hidden</option></select></div>
              </div>
              <div className="admin-form-group" style={{margin: 0}}><label className="admin-form-label">Review Text</label><textarea className="admin-form-input" rows="4" value={editingReview.review_text || ''} onChange={e => setEditingReview({...editingReview, review_text: e.target.value})}></textarea></div>
            </div>
            
            <button className="admin-btn-primary admin-btn-full" onClick={saveReview}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

const POLICIES = [
  { 
    id: 'cancellation_policy', 
    label: 'Cancellation Policy',
    defaultHtml: `<div class="cancellation-policy-header">
  <h1 class="cancellation-policy-title">Cancellation Policy</h1>
  <p class="cancellation-policy-intro">We understand that plans can change. Our cancellation policy is designed to be fair and transparent.</p>
</div>
<div class="cancellation-policy-body">
  <div class="cancellation-policy-section">
    <h2>Cancellation Timeframes</h2>
    <div class="cancellation-policy-table-wrapper">
      <table class="cancellation-policy-table">
        <thead><tr><th>Cancellation Time</th><th>Refund Amount</th></tr></thead>
        <tbody>
          <tr><td>More than 7 days before check-in</td><td>Full refund (100%)</td></tr>
          <tr><td>3 to 7 days before check-in</td><td>50% refund</td></tr>
          <tr><td>Less than 3 days before check-in</td><td>No refund</td></tr>
          <tr><td>No-show</td><td>No refund</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="cancellation-policy-section"><h2>How to Cancel</h2><p>To cancel your reservation, please contact us via WhatsApp or phone at least 24 hours in advance. Refunds, if applicable, will be processed within 5 to 7 business days to the original payment method.</p></div>
  <div class="cancellation-policy-section"><h2>Rescheduling</h2><p>Rescheduling requests are subject to availability. If the new dates fall under a different rate period, the price difference will be adjusted accordingly.</p></div>
  <div class="cancellation-policy-section"><h2>Force Majeure</h2><p>In the event of unforeseen circumstances such as natural disasters, government restrictions, or emergencies, we will work with you to reschedule your booking or provide a credit for future stays.</p></div>
  <div class="cancellation-policy-section"><h2>Need Help?</h2><p>For any cancellation or rescheduling queries, feel free to reach out to us directly. We are happy to assist you.</p></div>
  <div class="cancellation-policy-footer"><p>This policy is subject to change. The terms applicable at the time of booking will govern your reservation.</p></div>
</div>`
  },
  { 
    id: 'privacy_policy', 
    label: 'Privacy Policy',
    defaultHtml: `<div class="privacy-policy-header">
  <h1 class="privacy-policy-title">Privacy Policy</h1>
  <p class="privacy-policy-intro">At Meraki Living Farmstay, your privacy is just as important to us as your comfort.</p>
</div>
<div class="privacy-policy-body">
  <div class="privacy-policy-section"><h2>Information We Collect</h2><p>When you make a booking or contact us, we may collect:</p><ul class="privacy-policy-list"><li>Name & Email address</li><li>Mobile number & Postal address</li><li>Payment information (processed securely through our payment gateway)</li><li>Booking preferences and special requests</li></ul></div>
  <div class="privacy-policy-section"><h2>How We Use Your Information</h2><ul class="privacy-policy-list"><li>Process and confirm bookings.</li><li>Communicate regarding your reservation.</li><li>Respond to enquiries and improve our services.</li></ul></div>
  <div class="privacy-policy-section"><h2>Information Sharing & Data Security</h2><p>We do not sell, rent or trade your personal information. Information may be shared only with payment service providers or government authorities where required by law.</p><p>We implement reasonable technical and organisational measures to safeguard your personal information against unauthorised access, misuse or disclosure.</p></div>
  <div class="privacy-policy-section"><h2>Your Rights</h2><p>You may request access to, correction or deletion of your personal information by contacting us.</p></div>
  <div class="privacy-policy-footer"><p>Last updated: July 2026. If you have any questions about this policy, please reach out to us.</p></div>
</div>`
  },
  { 
    id: 'terms_conditions', 
    label: 'Terms & Conditions',
    defaultHtml: `<div class="terms-conditions-header">
  <h1 class="terms-conditions-title">Terms & Conditions</h1>
  <p class="terms-conditions-intro">Welcome to Meraki Living Farmstay. These simple guidelines help ensure that everyone enjoys their stay.</p>
</div>
<div class="terms-conditions-body">
  <div class="terms-conditions-section"><h2>1. Check-in & Check-out</h2><p><strong>Check-in:</strong> 12:00 PM onwards <br/> <strong>Check-out:</strong> 11:00 AM</p><p>Early check-in or late check-out is subject to availability and may attract additional charges.</p></div>
  <div class="terms-conditions-section"><h2>2. Occupancy & Identification</h2><p>Only the number of guests mentioned in the booking are permitted to stay. All adult guests must present a valid government-issued photo ID at the time of check-in.</p></div>
  <div class="terms-conditions-section"><h2>3. Property Care & Quiet Hours</h2><p>Meraki Living Farm Stay is located amidst nature. Guests are requested to respect the surrounding environment, avoid littering, and use resources responsibly. To ensure a peaceful experience for everyone, guests are requested to maintain silence between 10:00 PM and 7:00 AM.</p></div>
  <div class="terms-conditions-section"><h2>4. Smoking, Alcohol & Pets</h2><p>Smoking is strictly prohibited inside the cottages. Alcohol may be consumed responsibly within the property. Pets are welcome only with prior approval.</p></div>
  <div class="terms-conditions-section"><h2>5. Right to Refuse Service</h2><p>Management reserves the right to refuse accommodation or terminate a stay without refund in cases involving illegal activities, abusive behaviour, or violation of these terms.</p></div>
  <div class="terms-conditions-footer"><p>By making a booking, you agree to abide by these terms. For questions, please contact us directly.</p></div>
</div>`
  }
];

function PoliciesTab() {
  const [settings, setSettings] = useState({});
  const [activePolicy, setActivePolicy] = useState('cancellation_policy');
  const [policyContent, setPolicyContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = useCallback(() => {
    fetch(`${API_CONFIG_URL}/api_settings.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
          setSettings(data.data[0]);
          setPolicyContent(data.data[0][activePolicy] || POLICIES.find(p => p.id === activePolicy)?.defaultHtml || '');
        } else {
          setPolicyContent(POLICIES.find(p => p.id === activePolicy)?.defaultHtml || '');
        }
      })
      .catch(e => console.error("Error fetching policies:", e));
  }, [activePolicy]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setPolicyContent(settings[activePolicy] || POLICIES.find(p => p.id === activePolicy)?.defaultHtml || '');
  }, [activePolicy, settings]);

  const handleSave = async () => {
    setIsSaving(true);
    const updatedSettings = { ...settings, [activePolicy]: policyContent };
    try {
      const res = await fetch(`${API_CONFIG_URL}/api_settings.php`, {
        method: updatedSettings.setting_id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('Policy saved successfully!');
        fetchSettings();
      } else {
        alert('Failed to save policy.');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving policy.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-fade-in" style={{minHeight: 'calc(100vh - 64px)'}}>
      <PageHeader title="Legal Policy Management" subtitle="Manage and update the legal policy content displayed on your website." />
      
      <div className="admin-card" style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px'}}>
        
        <div style={{display: 'flex', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px'}}>
          {POLICIES.map(policy => (
            <button 
              key={policy.id} 
              onClick={() => setActivePolicy(policy.id)}
              className={activePolicy === policy.id ? 'admin-btn-primary' : 'admin-btn-outline'}
              style={{padding: '8px 16px', fontWeight: '600', border: activePolicy === policy.id ? 'none' : '1px solid #e2e8f0'}}
            >
              {policy.label}
            </button>
          ))}
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <label className="admin-form-label" style={{fontSize: '16px', color: '#373737', fontWeight: '600'}}>
            {POLICIES.find(p => p.id === activePolicy)?.label} Content
          </label>
          <p style={{fontSize: '13px', color: '#64748b', margin: 0}}>
            Paste or edit the complete policy content here. You may use HTML tags for formatting if needed.
          </p>
          
          <textarea 
            className="admin-form-input" 
            style={{minHeight: '400px', resize: 'vertical', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6', padding: '16px'}}
            value={policyContent}
            onChange={(e) => setPolicyContent(e.target.value)}
            placeholder={`Enter ${POLICIES.find(p => p.id === activePolicy)?.label} content here...`}
          />
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #f1f5f9'}}>
          <button 
            className="admin-btn-primary" 
            style={{padding: '12px 32px', fontSize: '15px', fontWeight: '600'}}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Policy Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState({});
  
  // Admin Account States
  const [adminUsername, setAdminUsername] = useState('');
  const [currentAdminId, setCurrentAdminId] = useState(1);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [accountMessage, setAccountMessage] = useState({ text: '', type: '' });
  
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [adminList, setAdminList] = useState([]);
  const [adminMessage, setAdminMessage] = useState({ text: '', type: '' });

  const fetchAdmins = () => {
    fetch(`${API_CONFIG_URL}/api_settings.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_admins' })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && Array.isArray(data.data)) {
          setAdminList(data.data);
          // Set the first admin as the current one for My Account settings (usually ID 1)
          if (data.data.length > 0) {
            setAdminUsername(data.data[0].username);
            setCurrentAdminId(data.data[0].id);
          }
        }
      })
      .catch(e => console.error("Error fetching admins:", e));
  };

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_settings.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) setSettings(data.data[0]); })
      .catch(e => console.error("JSON Error in Settings:", e));
    
    fetchAdmins();
  }, []);

  const handleSaveContactInfo = () => {
    fetch(`${API_CONFIG_URL}/api_settings.php`, {
      method: settings.setting_id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        alert('Contact Information Saved Successfully');
        fetch(`${API_CONFIG_URL}/api_settings.php`)
          .then(res => res.json())
          .then(refetchData => {
            if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data) && refetchData.data.length > 0) {
              setSettings(refetchData.data[0]);
            }
          });
      } else {
        alert('Error saving contact information');
      }
    }).catch(e => console.error(e));
  };

  const handleUpdateAccount = () => {
    if (!adminUsername.trim()) {
      setAccountMessage({ text: 'Admin Username cannot be empty.', type: 'error' });
      setTimeout(() => setAccountMessage({ text: '', type: '' }), 3000);
      return;
    }
    if (passwords.new || passwords.confirm) {
      if (passwords.new !== passwords.confirm) {
        setAccountMessage({ text: 'New passwords do not match.', type: 'error' });
        setTimeout(() => setAccountMessage({ text: '', type: '' }), 3000);
        return;
      }
      if (!passwords.current) {
        setAccountMessage({ text: 'Current password is required to change your password.', type: 'error' });
        setTimeout(() => setAccountMessage({ text: '', type: '' }), 3000);
        return;
      }
    }
    
    fetch(`${API_CONFIG_URL}/api_settings.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_account',
        admin_id: currentAdminId,
        current_password: passwords.current,
        new_username: adminUsername,
        new_password: passwords.new,
        confirm_password: passwords.confirm
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setAccountMessage({ text: 'Admin account settings updated successfully.', type: 'success' });
        setPasswords({ current: '', new: '', confirm: '' });
        fetchAdmins();
      } else if (data.message === 'No changes provided.') {
        // Handled as success if user just clicked save without changes
        setAccountMessage({ text: 'Admin account settings updated successfully.', type: 'success' });
        setPasswords({ current: '', new: '', confirm: '' });
        fetchAdmins();
      } else {
        setAccountMessage({ text: data.message || 'Error updating account.', type: 'error' });
      }
      setTimeout(() => setAccountMessage({ text: '', type: '' }), 3000);
    })
    .catch(e => {
      console.error(e);
      setAccountMessage({ text: 'Server error updating account.', type: 'error' });
      setTimeout(() => setAccountMessage({ text: '', type: '' }), 3000);
    });
  };

  const handleAddAdmin = () => {
    if (!newAdmin.username || !newAdmin.password) {
      setAdminMessage({ text: 'Username and password are required for new admins.', type: 'error' });
      setTimeout(() => setAdminMessage({ text: '', type: '' }), 3000);
      return;
    }
    
    fetch(`${API_CONFIG_URL}/api_settings.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_admin',
        username: newAdmin.username,
        password: newAdmin.password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setNewAdmin({ username: '', password: '' });
        setAdminMessage({ text: 'New admin account added successfully.', type: 'success' });
        fetchAdmins();
      } else {
        setAdminMessage({ text: data.message || 'Error adding admin.', type: 'error' });
      }
      setTimeout(() => setAdminMessage({ text: '', type: '' }), 3000);
    })
    .catch(e => {
      console.error(e);
      setAdminMessage({ text: 'Server error adding admin.', type: 'error' });
      setTimeout(() => setAdminMessage({ text: '', type: '' }), 3000);
    });
  };

  const handleRemoveAdmin = (id) => {
    if (id === 1) {
      alert("Action Denied: You cannot remove the primary Super Administrator account.");
      return;
    }
    if (window.confirm("Are you sure you want to permanently remove this admin account?")) {
      fetch(`${API_CONFIG_URL}/api_settings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove_admin',
          admin_id: id
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          fetchAdmins();
        } else {
          alert(data.message || 'Error removing admin.');
        }
      })
      .catch(e => console.error(e));
    }
  };

  return (
    <div className="admin-fade-in" style={{ paddingBottom: '40px' }}>
      <PageHeader title="Global Settings" subtitle="Configure contact information, update your profile, and manage admin access." />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Contact Information Card */}
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="admin-card-title">Contact Information</h2>
            <button className="admin-btn-primary" onClick={handleSaveContactInfo} style={{ padding: '8px 20px', fontSize: '14px' }}>Save Contact Info</button>
          </div>
          <div className="admin-card-body admin-grid-2">
            <div className="admin-form-group"><label className="admin-form-label">Primary Phone / WhatsApp</label><input type="text" className="admin-form-input" value={settings.contact_phone || ""} onChange={e => setSettings({...settings, contact_phone: e.target.value})} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Email Address</label><input type="email" className="admin-form-input" value={settings.contact_email || ""} onChange={e => setSettings({...settings, contact_email: e.target.value})} /></div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}><label className="admin-form-label">Physical Address</label><textarea className="admin-form-textarea" value={settings.physical_address || ""} onChange={e => setSettings({...settings, physical_address: e.target.value})} /></div>
          </div>
        </div>

        {/* My Account Settings Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">My Account Settings</h2>
          </div>
          <div className="admin-card-body">
            {accountMessage.text && (
              <div style={{ padding: '12px 16px', marginBottom: '20px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', background: accountMessage.type === 'error' ? '#fef2f2' : '#f0fdf4', color: accountMessage.type === 'error' ? '#dc2626' : '#166534', border: `1px solid ${accountMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}` }}>
                {accountMessage.text}
              </div>
            )}
            
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Admin Username</label>
                <input type="text" className="admin-form-input" value={adminUsername} onChange={e => setAdminUsername(e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Current Password</label>
                <input type="password" className="admin-form-input" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} placeholder="Required only if changing password" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">New Password</label>
                <input type="password" className="admin-form-input" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} placeholder="Enter new password" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Confirm New Password</label>
                <input type="password" className="admin-form-input" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} placeholder="Re-enter new password" />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <button className="admin-btn-primary" onClick={handleUpdateAccount}>Update Account</button>
            </div>
          </div>
        </div>

        {/* Admin Management Section */}
        <div className="admin-grid-2">
          
          {/* Add New Admin */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Add New Admin</h2>
            </div>
            <div className="admin-card-body">
              {adminMessage.text && (
                <div style={{ padding: '12px 16px', marginBottom: '20px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', background: adminMessage.type === 'error' ? '#fef2f2' : '#f0fdf4', color: adminMessage.type === 'error' ? '#dc2626' : '#166534', border: `1px solid ${adminMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}` }}>
                  {adminMessage.text}
                </div>
              )}
              <div className="admin-form-group">
                <label className="admin-form-label">Username</label>
                <input type="text" className="admin-form-input" value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} placeholder="Enter new admin username" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Password</label>
                <input type="password" className="admin-form-input" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} placeholder="Enter temporary password" />
              </div>
              <button className="admin-btn-outline admin-btn-full" onClick={handleAddAdmin} style={{ marginTop: '8px' }}>
                <PlusSignIcon size={18} /> Add Admin Account
              </button>
            </div>
          </div>

          {/* Existing Admins List */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Existing Admins</h2>
            </div>
            <div className="admin-card-body" style={{ padding: 0 }}>
              <div className="admin-table-wrapper" style={{ margin: 0, border: 'none', borderRadius: '0 0 16px 16px' }}>
                <table className="admin-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: '24px' }}>Username</th>
                      <th>Role</th>
                      <th style={{ paddingRight: '24px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminList.map((admin) => (
                      <tr key={admin.id}>
                        <td style={{ paddingLeft: '24px' }}>
                          <div style={{ fontWeight: '600', color: '#373737' }}>{admin.username}</div>
                        </td>
                        <td>
                          <span className="admin-badge badge-success" style={{ background: admin.id === 1 ? '#e0e7ff' : '#f1f5f9', color: admin.id === 1 ? '#4338ca' : '#475569' }}>
                            {admin.role}
                          </span>
                        </td>
                        <td style={{ paddingRight: '24px', textAlign: 'right' }}>
                          {admin.id !== 1 && (
                            <button className="admin-btn-sm admin-btn-outline" onClick={() => handleRemoveAdmin(admin.id)} style={{ color: '#dc2626', borderColor: '#fecaca' }}>
                              <Delete01Icon size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function NotificationBell({ showNotificationDropdown, setShowNotificationDropdown, setShowDateDropdownTop }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_CONFIG_URL}/api_bookings.php`).then(r => r.json()),
      fetch(`${API_CONFIG_URL}/api_payments.php`).then(r => r.json())
    ]).then(([bData, pData]) => {
      let notifs = [];
      if (bData && bData.status === 'success' && Array.isArray(bData.data)) {
        bData.data.forEach(b => {
          notifs.push({
            id: `booking_${b.id}`,
            numericId: parseInt(b.id, 10) * 10, 
            type: 'booking',
            guestName: b.guest_name || `Guest ${b.guest_id}`,
            roomName: b.room_name || `Room ${b.room_id}`,
            guestCount: b.guest_count,
            status: b.status || 'Pending',
            dateStr: b.check_in || 'Recent'
          });
        });
      }
      if (pData && pData.status === 'success' && Array.isArray(pData.data)) {
        pData.data.forEach(p => {
          notifs.push({
            id: `payment_${p.id}`,
            numericId: parseInt(p.id, 10) * 10 + 1, 
            type: 'payment',
            guestName: p.guest_name || 'Guest',
            roomName: p.room_name || 'Room',
            amount: p.amount,
            status: p.status || 'Success',
            dateStr: p.check_in || 'Recent'
          });
        });
      }
      notifs.sort((a, b) => b.numericId - a.numericId);
      setNotifications(notifs.slice(0, 15));
    }).catch(err => console.error(err));
  }, []);

  return (
    <div style={{position: 'relative'}}>
      <button className="admin-icon-btn" onClick={(e) => { e.stopPropagation(); setShowNotificationDropdown(prev => !prev); setShowDateDropdownTop(false); }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        {notifications.length > 0 && <span className="admin-notification-badge">{notifications.length}</span>}
      </button>
      {showNotificationDropdown && (
        <>
          <div className="admin-click-away" onClick={() => setShowNotificationDropdown(false)}></div>
          <div className="admin-dropdown-menu notification-menu admin-fade-in" style={{maxHeight: '400px', overflowY: 'auto', width: '320px', padding: 0, right: 0}}>
            <div className="dropdown-header" style={{padding: '16px', borderBottom: '1px solid #f1f5f9', fontWeight: '600', position: 'sticky', top: 0, background: '#fff', zIndex: 10, margin: 0}}>Notifications ({notifications.length})</div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              {notifications.map(n => (
                <div key={n.id} style={{display: 'flex', flexDirection: 'column', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', whiteSpace: 'normal'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px'}}>
                    <strong style={{color: '#373737', fontSize: '13px'}}>{n.type === 'booking' ? 'New Booking' : 'Payment Completed'}</strong>
                    <span style={{fontSize: '11px', color: '#94a3b8'}}>{n.dateStr}</span>
                  </div>
                  <div style={{fontSize: '13px', color: '#475569', lineHeight: '1.6'}}>
                    <div><strong>Guest:</strong> {n.guestName}</div>
                    <div><strong>Room:</strong> {n.roomName}</div>
                    {n.type === 'booking' ? (
                      <>
                        <div><strong>Guests:</strong> {n.guestCount} {parseInt(n.guestCount) === 1 ? 'Guest' : 'Guests'}</div>
                        <div><strong>Status:</strong> <span style={{color: (n.status === 'Confirmed' || n.status === 'Success') ? '#16a34a' : '#ea580c'}}>{n.status}</span></div>
                      </>
                    ) : (
                      <>
                        <div><strong>Amount:</strong> &#8377;{n.amount}</div>
                        <div><strong>Status:</strong> <span style={{color: (n.status === 'Success' || n.status === 'Completed') ? '#16a34a' : '#ea580c'}}>{n.status}</span></div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {notifications.length === 0 && <div style={{padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px'}}>No new notifications</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
