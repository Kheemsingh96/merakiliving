import React, { useState } from 'react';
import './AdminDashboard.css';
import logo from '../../../assets/images/logo.webp';

import {
  DashboardSquare01Icon,
  Calendar01Icon,
  BedDoubleIcon,
  Coffee02Icon,
  UserGroupIcon,
  Wallet01Icon,
  Ticket01Icon,
  Image01Icon,
  Settings01Icon,
  Logout01Icon,
  PlusSignIcon,
  Edit01Icon,
  Delete01Icon,
  WhatsappIcon,
  File02Icon,
  StarIcon,
  Doc01Icon,
  Menu01Icon,
  Cancel01Icon
} from 'hugeicons-react';

import room1 from '../../../assets/images/room-1.webp';
import room2 from '../../../assets/images/room-2.webp';
import room3 from '../../../assets/images/room-3.webp';
import room4 from '../../../assets/images/room-4.webp';
import founder from '../../../assets/images/founder.webp';

import cafe1 from '../../../assets/images/cafe-menu-1.webp';
import cafe2 from '../../../assets/images/cafe-menu-2.webp';
import cafe3 from '../../../assets/images/cafe-menu-3.webp';

export default function AdminDashboard({ setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('meraki_admin_auth'); window.location.reload();;
    if (setCurrentPage) setCurrentPage('admin-login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardSquare01Icon },
    {
      id: 'bookings', label: 'Bookings', icon: Calendar01Icon,
      subItems: [
        { id: 'all-bookings', label: 'All Bookings' },
        { id: 'calendar', label: 'Calendar / Availability' }
      ]
    },
    {
      id: 'rooms', label: 'Rooms', icon: BedDoubleIcon,
      subItems: [
        { id: 'manage-rooms', label: 'Manage Rooms' },
        { id: 'pricing', label: 'Pricing & Taxes' }
      ]
    },
    {
      id: 'cafe', label: 'Cafe Menu', icon: Coffee02Icon,
      subItems: [
        { id: 'featured-items', label: 'Featured Items' },
        { id: 'full-menu', label: 'Full Menu Categories' }
      ]
    },
    { id: 'guests', label: 'Guests', icon: UserGroupIcon },
    { id: 'payments', label: 'Payments', icon: Wallet01Icon },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Ticket01Icon },
    {
      id: 'website', label: 'Website Content', icon: File02Icon,
      subItems: [
        { id: 'gallery', label: 'Gallery Manager', icon: Image01Icon },
        { id: 'reviews', label: 'Reviews', icon: StarIcon },
        { id: 'policies', label: 'Legal Policies', icon: Doc01Icon }
      ]
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
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <Cancel01Icon size={20} />
          </button>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map(item => (
            <div key={item.id} className="admin-nav-group">
              <div
                className={`admin-nav-item ${activeTab === item.id && !item.subItems ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id, item.subItems ? item.subItems[0].id : '')}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
              {item.subItems && activeTab === item.id && (
                <div className="admin-nav-sublist">
                  {item.subItems.map(subItem => (
                    <div
                      key={subItem.id}
                      className={`admin-nav-subitem ${subTab === subItem.id ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id, subItem.id)}
                    >
                      {subItem.label}
                    </div>
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
        <button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)}>
          <Menu01Icon size={22} />
        </button>
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
                  <div className={`dropdown-item ${dateRange === 'Last 7 Days' ? 'active' : ''}`} onClick={() => {setDateRange('Last 7 Days'); setShowDateDropdownTop(false)}}>Last 7 Days</div>
                  <div className={`dropdown-item ${dateRange === 'Last 30 Days' ? 'active' : ''}`} onClick={() => {setDateRange('Last 30 Days'); setShowDateDropdownTop(false)}}>Last 30 Days</div>
                  <div className={`dropdown-item ${dateRange === 'This Month' ? 'active' : ''}`} onClick={() => {setDateRange('This Month'); setShowDateDropdownTop(false)}}>This Month</div>
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
              <span className="admin-stat-value">256</span>
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
              <span className="admin-stat-value">₹1,48,750</span>
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
              <span className="admin-stat-value">76%</span>
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
                    <div className={`dropdown-item ${dateRange === 'Last 7 Days' ? 'active' : ''}`} onClick={(e) => {e.stopPropagation(); setDateRange('Last 7 Days'); setShowDateDropdownChart(false)}}>Last 7 Days</div>
                    <div className={`dropdown-item ${dateRange === 'Last 30 Days' ? 'active' : ''}`} onClick={(e) => {e.stopPropagation(); setDateRange('Last 30 Days'); setShowDateDropdownChart(false)}}>Last 30 Days</div>
                    <div className={`dropdown-item ${dateRange === 'This Month' ? 'active' : ''}`} onClick={(e) => {e.stopPropagation(); setDateRange('This Month'); setShowDateDropdownChart(false)}}>This Month</div>
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
function BookingsTab() {
  return (
    <>
      <PageHeader
        title="Booking Management"
        subtitle="View and manage all homestay reservations."
        action={
          <button className="admin-btn-primary">
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
              <tr>
                <td className="admin-text-mono">#BK-1024</td>
                <td>
                  <div className="admin-cell-stack">
                    <span>Vikram Malhotra</span>
                    <span className="admin-cell-muted">+91 9876543210</span>
                  </div>
                </td>
                <td>Himalayan View Room</td>
                <td>
                  <div className="admin-cell-stack">
                    <span>12 Oct - 15 Oct</span>
                    <span className="admin-cell-muted">3 Nights</span>
                  </div>
                </td>
                <td className="admin-text-medium">₹10,500</td>
                <td><span className="admin-badge badge-success">Confirmed</span></td>
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
              <tr>
                <td className="admin-text-mono">#BK-1025</td>
                <td>
                  <div className="admin-cell-stack">
                    <span>Sunita Reddy</span>
                    <span className="admin-cell-muted">+91 9123456789</span>
                  </div>
                </td>
                <td>Luxury Family Suite</td>
                <td>
                  <div className="admin-cell-stack">
                    <span>18 Oct - 20 Oct</span>
                    <span className="admin-cell-muted">2 Nights</span>
                  </div>
                </td>
                <td className="admin-text-medium">₹12,000</td>
                <td><span className="admin-badge badge-info">Pending</span></td>
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
      <PageHeader
        title="Availability Calendar"
        subtitle="Manage room availability and block dates."
      />
      <div className="admin-card admin-card-padded">
        <div className="admin-calendar-header">
          <h2 className="admin-card-title">October 2026</h2>
          <div className="admin-calendar-nav">
            <button className="admin-btn-outline">Previous</button>
            <button className="admin-btn-outline">Next</button>
          </div>
        </div>
        <div className="admin-calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="admin-calendar-header-cell">{day}</div>
          ))}
          {[...Array(31)].map((_, i) => (
            <div key={i} className="admin-calendar-cell">
              <span className="admin-calendar-date">{i + 1}</span>
              {i === 11 && <span className="admin-calendar-event">Himalayan View (Vikram)</span>}
              {i === 12 && <span className="admin-calendar-event">Himalayan View (Vikram)</span>}
              {i === 17 && <span className="admin-calendar-event maintenance">Premium Valley (Maintenance)</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ManageRoomsTab() {
  const [editingRoom, setEditingRoom] = React.useState(null);
  const rooms = [
    { id: 1, title: 'Himalayan View Room', img: room1, status: 'Active', desc: 'Beautiful mountain views with a cozy interior.' },
    { id: 2, title: 'Premium Valley Room', img: room2, status: 'Active', desc: 'Overlooking the lush green valley.' },
    { id: 3, title: 'Luxury Family Suite', img: room3, status: 'Active', desc: 'Spacious suite perfect for families.' },
    { id: 4, title: 'Entire Homestay', img: room4, status: 'Active', desc: 'Book the entire property for complete privacy.' }
  ];

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
              <p className="admin-item-desc" style={{color: '#555', fontWeight: '500'}}>{r.desc}</p>
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
        <div className="admin-modal-overlay admin-fade-in">
          <div className="admin-modal-content">
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>Edit Room: {editingRoom.title}</h2>
              <button onClick={() => setEditingRoom(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}>
                <Cancel01Icon size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Room Title</label>
              <input type="text" className="admin-form-input" defaultValue={editingRoom.title} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Description</label>
              <textarea className="admin-form-input" rows="3" defaultValue={editingRoom.desc}></textarea>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select className="admin-form-input" defaultValue={editingRoom.status}>
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
            <button className="admin-btn-primary admin-btn-full" onClick={() => setEditingRoom(null)}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
function PricingTab() {
  const [rooms, setRooms] = React.useState([
    { id: 1, title: 'Himalayan View Room', img: room1, price: 4500, origPrice: 5000 },
    { id: 2, title: 'Premium Valley Room', img: room2, price: 3800, origPrice: 4200 },
    { id: 3, title: 'Luxury Family Suite', img: room3, price: 7200, origPrice: 8000 },
    { id: 4, title: 'Entire Homestay', img: room4, price: 18000, origPrice: 20000 }
  ]);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="admin-fade-in">
      <PageHeader
        title="Pricing & Taxes"
        subtitle="Manage room rates, discounts, and global GST settings."
        action={<button className="admin-btn-primary" onClick={handleSave} style={{transition: 'all 0.3s'}}>{isSaved ? 'Saved Successfully!' : 'Save Changes'}</button>}
      />

      <div className="admin-pricing-grid">
        {rooms.map((room, idx) => (
          <div className="admin-card hover-lift" key={room.id} style={{display: 'flex', overflow: 'hidden', padding: 0}}>
            <div style={{width: '140px', flexShrink: 0}} className="admin-pricing-img-wrapper">
              <img src={room.img} alt={room.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
            <div style={{padding: '24px', flex: 1}}>
              <h2 className="admin-card-title" style={{marginBottom: '16px', fontSize: '16px'}}>{room.title}</h2>
              <div className="admin-form-row">
                <div className="admin-form-group" style={{marginBottom: 0}}>
                  <label className="admin-form-label">Regular Price (₹)</label>
                  <div className="admin-price-input-wrapper">
                    <span className="admin-price-symbol">₹</span>
                    <input type="number" className="admin-form-input" value={room.price} onChange={(e) => {
                      const newRooms = [...rooms]; newRooms[idx].price = e.target.value; setRooms(newRooms);
                    }} />
                  </div>
                </div>
                <div className="admin-form-group" style={{marginBottom: 0}}>
                  <label className="admin-form-label">Original Price (₹)</label>
                  <div className="admin-price-input-wrapper">
                    <span className="admin-price-symbol" style={{color: '#94a3b8'}}>₹</span>
                    <input type="number" className="admin-form-input" style={{color: '#64748b', textDecoration: 'line-through'}} value={room.origPrice} onChange={(e) => {
                      const newRooms = [...rooms]; newRooms[idx].origPrice = e.target.value; setRooms(newRooms);
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card admin-mt-4">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Global Settings</h2>
        </div>
        <div className="admin-card-body admin-card-body-narrow" style={{padding: '24px'}}>
          <div className="admin-form-group">
            <label className="admin-form-label">Global GST (%)</label>
            <input type="number" className="admin-form-input" defaultValue="12" />
            <p className="admin-form-help" style={{marginTop: '8px', fontSize: '13px', color: '#555', fontWeight: '500'}}>This tax rate will be applied to all room bookings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
function CafeFeaturedTab() {
  const items = [
    { id: 1, title: 'Traditional Ragi Roti', img: cafe1, price: '120', origPrice: '160', tag: "Chef's Special", veg: true },
    { id: 2, title: 'Kumaoni Mutton Curry', img: cafe2, price: '550', origPrice: '650', tag: 'Popular', veg: false },
    { id: 3, title: 'Garden Veg Sandwich', img: cafe3, price: '180', origPrice: '220', tag: 'New', veg: true },
    { id: 4, title: 'Cheese Herb Omelette', img: cafe1, price: '150', origPrice: '190', tag: 'Best Seller', veg: false },
    { id: 5, title: 'Crispy French Fries', img: cafe2, price: '140', origPrice: '180', tag: 'Must Try', veg: true },
    { id: 6, title: 'Organic Himalayan Tea', img: cafe3, price: '90', origPrice: '120', tag: 'Signature', veg: true },
    { id: 7, title: 'Spicy Chicken Tikka', img: cafe1, price: '350', origPrice: '400', tag: "Chef's Special", veg: false },
    { id: 8, title: 'Pahadi Masala Maggie', img: cafe2, price: '120', origPrice: '150', tag: 'Popular', veg: true }
  ];

  return (
    <>
      <PageHeader
        title="Featured Menu Items"
        subtitle="Manage the 8 featured items shown on the Cafe page."
        action={
          <button className="admin-btn-primary">
            <PlusSignIcon size={18} /> Add Featured Item
          </button>
        }
      />
      <div className="admin-item-grid">
        {items.map(item => (
          <div key={item.id} className="admin-item-card">
            <img src={item.img} alt={item.title} className="admin-item-img" />
            <div className="admin-item-content">
              <div className="admin-item-header">
                <h3 className="admin-item-title">{item.title}</h3>
                <span className="admin-badge badge-success">₹{item.price}</span>
              </div>
              <div className="admin-item-meta">
                <span className={item.veg ? 'admin-text-veg' : 'admin-text-nonveg'}>
                  {item.veg ? 'Veg' : 'Non-Veg'}
                </span>
                <span className="admin-cell-muted">Original: ₹{item.origPrice}</span>
                <span className="admin-item-tag">
                  <span className="admin-badge badge-primary">{item.tag}</span>
                </span>
              </div>
              <div className="admin-item-actions">
                <button className="admin-btn-outline admin-btn-full">
                  <Edit01Icon size={16} /> Edit
                </button>
                <button className="admin-btn-outline admin-btn-danger">
                  <Delete01Icon size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CafeMenuTab() {
  const [activeCategory, setActiveCategory] = useState('Breakfast');

  const categories = [
    'Breakfast',
    'Pahadi Khana',
    'All Day Snacks',
    'Rice & Roti',
    'Add Ons',
    'Teas',
    'Beverages & Soups'
  ];

  const allItems = [
    { cat: 'Breakfast', name: 'Cheese Vegetable Omelette', price: '150', desc: 'Two eggs with tossed vegetable...', veg: false, status: 'Available' },
    { cat: 'Breakfast', name: 'Aloo/ Onion/ Paneer Paratha', price: '150', desc: 'Served with Butter and Fresh Mint Chutney', veg: true, status: 'Available' },
    { cat: 'Breakfast', name: 'Poha', price: '100', desc: 'Flattened rice, onions, potatoes...', veg: true, status: 'Available' },
    { cat: 'Breakfast', name: 'Egg Bhurji', price: '100', desc: 'Spiced Indian two scrambled eggs', veg: false, status: 'Available' },
    { cat: 'Breakfast', name: 'Paneer / Corn / Veg Cheese Sandwich', price: '200', desc: 'Classic Indian street food snack', veg: true, status: 'Available' },

    { cat: 'Pahadi Khana', name: 'Bhat Ki Dal / Chudkani', price: '400', desc: 'Organic black soybeans cooked in iron pan', veg: true, status: 'Available' },
    { cat: 'Pahadi Khana', name: 'Pahadi Rajma', price: '400', desc: 'Cooked in Pahadi style with desi ghee', veg: true, status: 'Available' },
    { cat: 'Pahadi Khana', name: 'Gahat Ki Dal', price: '400', desc: 'Horse gram traditional medicine', veg: true, status: 'Available' },
    { cat: 'Pahadi Khana', name: 'Farm Fresh Organic Vegetable', price: '400', desc: 'From Farm to Table', veg: true, status: 'Available' },
    { cat: 'Pahadi Khana', name: 'Pahadi Kadi', price: '300', desc: 'Jholi is Curd and Besan thick curry', veg: true, status: 'Available' },
    { cat: 'Pahadi Khana', name: 'Pahadi Raita', price: '75', desc: 'Flavoured with basic spices and herbs', veg: true, status: 'Available' },
    { cat: 'Pahadi Khana', name: 'Bhang Ki Chutney', price: '50', desc: 'Made from Bhang (Hemp) seeds', veg: true, status: 'Available' },
    { cat: 'Pahadi Khana', name: 'Pahadi Mutton/ Chicken Curry', price: '500', desc: 'The unbeatable Pahadi family recipe', veg: false, status: 'Available' },
    { cat: 'Pahadi Khana', name: 'Authentic Pahadi Lunch/Dinner', price: '500-750', desc: 'Price per person (Veg / Non Veg)', veg: false, status: 'Available' },

    { cat: 'All Day Snacks', name: 'Masala Maggie', price: '120', desc: '', veg: true, status: 'Available' },
    { cat: 'All Day Snacks', name: 'Mix Pakode With Mint Chutney', price: '150', desc: '', veg: true, status: 'Available' },
    { cat: 'All Day Snacks', name: 'French Fries With Cheese Dip', price: '150', desc: '', veg: true, status: 'Available' },
    { cat: 'All Day Snacks', name: 'Butter Toast', price: '100', desc: '', veg: true, status: 'Available' },
    { cat: 'All Day Snacks', name: 'Bun Tikki', price: '150', desc: '', veg: true, status: 'Available' },
    { cat: 'All Day Snacks', name: 'Bambaiya Sandwich', price: '150', desc: 'Stuffed with aloo masala and veggies', veg: true, status: 'Available' },
    { cat: 'All Day Snacks', name: 'Wada Pav', price: '150', desc: '', veg: true, status: 'Available' },

    { cat: 'Rice & Roti', name: 'Steamed Basmati Rice', price: '150', desc: '', veg: true, status: 'Available' },
    { cat: 'Rice & Roti', name: 'Jeera Rice', price: '175', desc: '', veg: true, status: 'Available' },
    { cat: 'Rice & Roti', name: 'Peas Pulav', price: '200', desc: '', veg: true, status: 'Available' },
    { cat: 'Rice & Roti', name: 'Special Dal Khichdi', price: '200', desc: '', veg: true, status: 'Available' },
    { cat: 'Rice & Roti', name: 'Plain Roti', price: '25', desc: '', veg: true, status: 'Available' },
    { cat: 'Rice & Roti', name: 'Raagi Roti', price: '50', desc: '', veg: true, status: 'Available' },
    { cat: 'Rice & Roti', name: 'Puri / Paratha', price: '50', desc: '', veg: true, status: 'Available' },

    { cat: 'Add Ons', name: 'Roasted Papad', price: '50', desc: '', veg: true, status: 'Available' },
    { cat: 'Add Ons', name: 'Masala Papad', price: '100', desc: '', veg: true, status: 'Available' },
    { cat: 'Add Ons', name: 'Curd', price: '50', desc: '', veg: true, status: 'Available' },
    { cat: 'Add Ons', name: 'Raita', price: '75', desc: '', veg: true, status: 'Available' },
    { cat: 'Add Ons', name: 'Green Salad', price: '100', desc: '', veg: true, status: 'Available' },

    { cat: 'Teas', name: 'Detox Tea With Honey', price: '150', desc: 'Recommended', veg: true, status: 'Available' },
    { cat: 'Teas', name: 'Mint Ginger Tea', price: '120', desc: '', veg: true, status: 'Available' },
    { cat: 'Teas', name: 'Rosemary With Honey', price: '120', desc: '', veg: true, status: 'Available' },
    { cat: 'Teas', name: 'Thyme Ginger With Honey', price: '120', desc: '', veg: true, status: 'Available' },
    { cat: 'Teas', name: 'Lemon Grass Ginger With Honey', price: '120', desc: '', veg: true, status: 'Available' },
    { cat: 'Teas', name: 'Pahadi Chay With Jaggery', price: '120', desc: '', veg: true, status: 'Available' },
    { cat: 'Teas', name: 'Exotic Masala Tea', price: '120', desc: '', veg: true, status: 'Available' },
    { cat: 'Teas', name: 'Organic Himalayan Turmeric Milk', price: '120', desc: '', veg: true, status: 'Available' },

    { cat: 'Beverages & Soups', name: 'Black Coffee', price: '100', desc: '', veg: true, status: 'Available' },
    { cat: 'Beverages & Soups', name: 'Expresso Hot Coffee', price: '120', desc: '', veg: true, status: 'Available' },
    { cat: 'Beverages & Soups', name: 'Chochlate Shake', price: '100', desc: '', veg: true, status: 'Available' },
    { cat: 'Beverages & Soups', name: 'Banana Shake', price: '100', desc: '', veg: true, status: 'Available' },
    { cat: 'Beverages & Soups', name: 'Fresh Lime Soda', price: '100', desc: '', veg: true, status: 'Available' },
    { cat: 'Beverages & Soups', name: 'Lassi Or Chaans', price: '100', desc: '', veg: true, status: 'Available' },
    { cat: 'Beverages & Soups', name: 'Thyme Tomato Soup', price: '150', desc: '', veg: true, status: 'Available' }
  ];

  const filteredItems = allItems.filter(i => i.cat === activeCategory);

  return (
    <>
      <PageHeader
        title="Full Menu Categories"
        subtitle="Manage all menu items across Breakfast, Pahadi Khana, Snacks, etc."
        action={
          <button className="admin-btn-primary">
            <PlusSignIcon size={18} /> Add Menu Item
          </button>
        }
      />
      <div className="admin-card">
        <div className="admin-filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`admin-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price (₹)</th>
                <th>Diet</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="admin-text-medium">{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <span className={item.veg ? 'admin-text-veg' : 'admin-text-nonveg'}>
                      {item.veg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td className="admin-cell-muted">{item.desc || '-'}</td>
                  <td><span className="admin-badge badge-success">{item.status}</span></td>
                  <td>
                    <button className="admin-btn-sm admin-btn-outline">Edit</button>
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

function GuestsTab() {
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
              <tr>
                <td className="admin-text-medium">Rajesh Khanna</td>
                <td>
                  <div className="admin-cell-stack">
                    <span>rajesh.k@example.com</span>
                    <span className="admin-cell-muted">+91 9876543210</span>
                  </div>
                </td>
                <td>2</td>
                <td>Premium Valley Room</td>
                <td>
                  <button className="admin-btn-sm admin-btn-outline">History</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PaymentsTab() {
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
              <tr>
                <td className="admin-text-mono">pay_Kjs821jdnH</td>
                <td className="admin-text-medium">#BK-1024</td>
                <td className="admin-text-medium">₹10,500</td>
                <td>12 Oct 2026</td>
                <td><span className="admin-badge badge-success">Success</span></td>
              </tr>
              <tr>
                <td className="admin-text-mono">pay_L91ksj8Hs</td>
                <td className="admin-text-medium">#BK-1025</td>
                <td className="admin-text-medium">₹12,000</td>
                <td>10 Oct 2026</td>
                <td><span className="admin-badge badge-success">Success</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CouponsTab() {
  return (
    <>
      <PageHeader
        title="Coupons & Discounts"
        subtitle="Manage promotional codes like MERAKI8 and SAVE8."
        action={
          <button className="admin-btn-primary">
            <PlusSignIcon size={18} /> New Coupon
          </button>
        }
      />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="admin-text-medium">MERAKI8</td>
                <td>8% Off</td>
                <td><span className="admin-badge badge-success">Active</span></td>
                <td>
                  <button className="admin-btn-sm admin-btn-outline">Edit</button>
                </td>
              </tr>
              <tr>
                <td className="admin-text-medium">SAVE8</td>
                <td>8% Off</td>
                <td><span className="admin-badge badge-success">Active</span></td>
                <td>
                  <button className="admin-btn-sm admin-btn-outline">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function GalleryTab() {
  return (
    <>
      <PageHeader
        title="Gallery Manager"
        subtitle="Manage images for rooms, cafe ambiance, and explore sections."
        action={
          <button className="admin-btn-primary">
            <PlusSignIcon size={18} /> Upload Image
          </button>
        }
      />
      <div className="admin-empty-state">
        <Image01Icon className="admin-empty-icon" />
        <h3>Select a category to manage images</h3>
        <div className="admin-empty-actions">
          <button className="admin-btn-outline">Rooms Gallery</button>
          <button className="admin-btn-outline">Cafe Ambiance</button>
          <button className="admin-btn-outline">Main Explore Gallery</button>
        </div>
      </div>
    </>
  );
}

function ReviewsTab() {
  return (
    <>
      <PageHeader
        title="Reviews & Testimonials"
        subtitle="Manage guest reviews appearing on the homepage."
        action={
          <button className="admin-btn-primary">
            <PlusSignIcon size={18} /> Add Review
          </button>
        }
      />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Rating</th>
                <th>Review Snippet</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="admin-text-medium">Rajesh Khanna</td>
                <td>5 Stars</td>
                <td>The coffee at Meraki Mountain...</td>
                <td><span className="admin-badge badge-success">Visible</span></td>
                <td>
                  <button className="admin-btn-sm admin-btn-outline">Edit</button>
                </td>
              </tr>
              <tr>
                <td className="admin-text-medium">Sunita Reddy</td>
                <td>5 Stars</td>
                <td>Honestly, the best cafe experience...</td>
                <td><span className="admin-badge badge-success">Visible</span></td>
                <td>
                  <button className="admin-btn-sm admin-btn-outline">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PoliciesTab() {
  return (
    <>
      <PageHeader
        title="Legal Policies & FAQ"
        subtitle="Update website content for legal pages and FAQs."
      />
      <div className="admin-empty-state">
        <Doc01Icon className="admin-empty-icon" />
        <h3>Select content to edit</h3>
        <div className="admin-empty-actions">
          <button className="admin-btn-outline">Privacy Policy</button>
          <button className="admin-btn-outline">Terms & Conditions</button>
          <button className="admin-btn-outline">Cancellation Policy</button>
          <button className="admin-btn-outline">FAQs</button>
        </div>
      </div>
    </>
  );
}

function SettingsTab() {
  return (
    <>
      <PageHeader
        title="Global Settings"
        subtitle="Configure contact information and admin accounts."
        action={<button className="admin-btn-primary">Save Configuration</button>}
      />
      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Contact Information</h2>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label className="admin-form-label">Primary Phone / WhatsApp</label>
              <input type="text" className="admin-form-input" defaultValue="+91 94561 03445" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email Address</label>
              <input type="email" className="admin-form-input" defaultValue="contact@merakiliving.in" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Physical Address</label>
              <textarea className="admin-form-textarea" defaultValue="Peora, Near Mukteshwar, Kumaon Himalayas" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Admin Accounts</h2>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label className="admin-form-label">Change Password</label>
              <input type="password" className="admin-form-input" placeholder="Enter new password" />
            </div>
            <button className="admin-btn-outline admin-btn-full">
              <PlusSignIcon size={16} /> Add Secondary Admin
            </button>
          </div>
        </div>
      </div>
    </>
  );
}