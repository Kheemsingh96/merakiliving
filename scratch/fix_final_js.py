import sys
import re

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update Admin Profile Dropdown (lines 153+)
profile_match = re.search(r'<div className="admin-sidebar-footer-profile" onClick=\{handleLogout\}>.*?</div>\s*</div>\s*</aside>', c, re.DOTALL)
if profile_match:
    new_profile = '''<div className="admin-sidebar-footer-profile" onClick={() => setShowProfileMenu(true)}>
            <img src={founder} alt="Admin" className="admin-sidebar-footer-profile-img" style={{objectFit:"cover", width: '36px', height: '36px'}} />
            <div className="admin-sidebar-footer-profile-info" style={{flex: 1}}>
              <span className="admin-sidebar-footer-profile-name">Pranay Matiyani</span>
              <span className="admin-sidebar-footer-profile-role">Super Administrator</span>
            </div>
            <div style={{color: '#817F7F', display: 'flex'}}>
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
      </aside>'''
    c = c[:profile_match.start()] + new_profile + c[profile_match.end():]

# Add showProfileMenu state to AdminDashboard
if 'const [showProfileMenu, setShowProfileMenu] = useState(false);' not in c:
    c = c.replace('const [sidebarOpen, setSidebarOpen] = useState(false);', 'const [sidebarOpen, setSidebarOpen] = useState(false);\n  const [showProfileMenu, setShowProfileMenu] = useState(false);')

# 2. Update DashboardTab Room Status & Click Aways
dashboard_match = re.search(r'function DashboardTab\(\) \{[\s\S]*?(?=function BookingsTab\(\))', c)
if dashboard_match:
    new_dashboard = '''function DashboardTab() {
  const [showDateDropdown, setShowDateDropdown] = React.useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = React.useState(false);
  const [dateRange, setDateRange] = React.useState('Last 7 Days');
  const [roomStatuses, setRoomStatuses] = React.useState([
    { id: 1, name: 'Himalayan View Room', img: room1, status: 'Booked', color: '#dc2626', bg: '#fef2f2', price: '?4,500' },
    { id: 2, name: 'Premium Valley Room', img: room2, status: 'Available', color: '#16a34a', bg: '#f0fdf4', price: '?3,800' },
    { id: 3, name: 'Luxury Family Suite', img: room3, status: 'Booked', color: '#dc2626', bg: '#fef2f2', price: '?7,200' },
    { id: 4, name: 'Entire Homestay', img: room4, status: 'Available', color: '#16a34a', bg: '#f0fdf4', price: '?18,000' }
  ]);

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
          <p className="admin-page-subtitle" style={{color: '#555', fontWeight: '500'}}>Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div className="admin-header-actions" style={{ alignItems: 'center' }}>
          
          <div style={{position: 'relative'}}>
            <div 
              className="admin-date-selector" 
              onClick={() => { setShowDateDropdown(true); setShowNotificationDropdown(false); }}
            >
              <Calendar01Icon size={18} strokeWidth={1.5} />
              <span style={{fontWeight: '500', color: '#373737'}}>{dateRange}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            {showDateDropdown && (
              <>
                <div className="admin-click-away" onClick={() => setShowDateDropdown(false)}></div>
                <div className="admin-dropdown-menu admin-fade-in">
                  <div className={dropdown-item } onClick={() => {setDateRange('Last 7 Days'); setShowDateDropdown(false)}}>Last 7 Days</div>
                  <div className={dropdown-item } onClick={() => {setDateRange('Last 30 Days'); setShowDateDropdown(false)}}>Last 30 Days</div>
                  <div className={dropdown-item } onClick={() => {setDateRange('This Month'); setShowDateDropdown(false)}}>This Month</div>
                </div>
              </>
            )}
          </div>

          <div style={{position: 'relative'}}>
            <button 
              className="admin-icon-btn" 
              onClick={() => { setShowNotificationDropdown(true); setShowDateDropdown(false); }}
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
                    <p>John Doe booked Luxury Cottage.</p>
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
              <span className="admin-stat-value">128</span>
              <span className="admin-stat-trend positive">? 18.6%</span>
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
              <span className="admin-stat-value">256</span>
              <span className="admin-stat-trend positive">? 22.4%</span>
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
              <span className="admin-stat-value">?1,48,750</span>
              <span className="admin-stat-trend positive">? 16.8%</span>
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
              <span className="admin-stat-value">76%</span>
              <span className="admin-stat-trend positive">? 8.4%</span>
            </div>
            <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
          </div>
        </div>
      </div>

      <div className="admin-grid-2-layout">
        <div className="admin-card" style={{flex: '2'}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Booking Overview</h2>
            <div className="admin-filter-dropdown" onClick={() => setShowDateDropdown(true)}>
              <span style={{fontWeight: '500', color: '#373737'}}>{dateRange}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
              {showDateDropdown && (
                <>
                  <div className="admin-click-away" onClick={(e) => {e.stopPropagation(); setShowDateDropdown(false);}}></div>
                  <div className="admin-dropdown-menu admin-fade-in" style={{top: '100%', right: '0', marginTop: '8px'}}>
                    <div className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange('Last 7 Days'); setShowDateDropdown(false)}}>Last 7 Days</div>
                    <div className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange('Last 30 Days'); setShowDateDropdown(false)}}>Last 30 Days</div>
                    <div className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange('This Month'); setShowDateDropdown(false)}}>This Month</div>
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
            
            <div className="recent-booking-item hover-lift-subtle">
              <img src={room1} alt="Booking" />
              <div className="recent-booking-info">
                <h4>John Doe</h4>
                <p>Himalayan View Room</p>
                <span>24 May - 27 May 2024</span>
              </div>
              <span className="admin-badge badge-success">Confirmed</span>
            </div>

            <div className="recent-booking-item hover-lift-subtle">
              <img src={room3} alt="Booking" />
              <div className="recent-booking-info">
                <h4>Emily Johnson</h4>
                <p>Luxury Family Suite</p>
                <span>25 May - 28 May 2024</span>
              </div>
              <span className="admin-badge badge-warning" style={{background:'#fff7ed', color:'#ea580c'}}>Pending</span>
            </div>

            <div className="recent-booking-item hover-lift-subtle">
              <img src={room2} alt="Booking" />
              <div className="recent-booking-info">
                <h4>Michael Brown</h4>
                <p>Premium Valley Room</p>
                <span>26 May - 29 May 2024</span>
              </div>
              <span className="admin-badge badge-success">Confirmed</span>
            </div>

            <div className="recent-booking-item hover-lift-subtle">
              <img src={room4} alt="Booking" />
              <div className="recent-booking-info">
                <h4>Sarah Wilson</h4>
                <p>Entire Homestay</p>
                <span>27 May - 28 May 2024</span>
              </div>
              <span className="admin-badge badge-danger">Cancelled</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
'''
    c = c[:dashboard_match.start()] + new_dashboard + c[dashboard_match.end():]

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'w', encoding='utf-8') as f:
    f.write(c)
print("JS updated successfully")
