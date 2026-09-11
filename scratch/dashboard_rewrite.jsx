function DashboardTab() {
  const [showDateDropdown, setShowDateDropdown] = React.useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = React.useState(false);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div className="admin-header-actions" style={{ alignItems: 'center' }}>
          
          <div style={{position: 'relative'}}>
            <div 
              className="admin-date-selector" 
              onClick={() => { setShowDateDropdown(!showDateDropdown); setShowNotificationDropdown(false); }}
            >
              <Calendar01Icon size={16} />
              <span>24 May - 31 May 2024</span>
              <span style={{marginLeft: '4px'}}>?</span>
            </div>
            {showDateDropdown && (
              <div className="admin-dropdown-menu">
                <div className="dropdown-item active">Last 7 Days</div>
                <div className="dropdown-item">Last 30 Days</div>
                <div className="dropdown-item">This Month</div>
                <div className="dropdown-item">Custom Range...</div>
              </div>
            )}
          </div>

          <div style={{position: 'relative'}}>
            <button 
              className="admin-icon-btn" 
              onClick={() => { setShowNotificationDropdown(!showNotificationDropdown); setShowDateDropdown(false); }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="admin-notification-badge">2</span>
            </button>
            {showNotificationDropdown && (
              <div className="admin-dropdown-menu notification-menu">
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
            )}
          </div>

          <button className="admin-icon-btn logout-top-btn" onClick={() => sessionStorage.removeItem('meraki_admin_auth')}>
            <Logout01Icon size={20} />
          </button>
        </div>
      </div>

      <div className="admin-grid-4">
        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header">
              <div className="admin-stat-icon white-icon">
                <Calendar01Icon size={20} />
              </div>
              <span className="admin-stat-label">Total Bookings</span>
            </div>
            <div className="admin-stat-row">
              <span className="admin-stat-value">128</span>
              <span className="admin-stat-trend positive">? 18.6%</span>
            </div>
            <div className="admin-stat-subtext">vs last 7 days</div>
          </div>
        </div>

        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header">
              <div className="admin-stat-icon white-icon">
                <UserGroupIcon size={20} />
              </div>
              <span className="admin-stat-label">Total Guests</span>
            </div>
            <div className="admin-stat-row">
              <span className="admin-stat-value">256</span>
              <span className="admin-stat-trend positive">? 22.4%</span>
            </div>
            <div className="admin-stat-subtext">vs last 7 days</div>
          </div>
        </div>

        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header">
              <div className="admin-stat-icon white-icon">
                <Wallet01Icon size={20} />
              </div>
              <span className="admin-stat-label">Total Revenue</span>
            </div>
            <div className="admin-stat-row">
              <span className="admin-stat-value">?1,48,750</span>
              <span className="admin-stat-trend positive">? 16.8%</span>
            </div>
            <div className="admin-stat-subtext">vs last 7 days</div>
          </div>
        </div>

        <div className="admin-stat-card gradient-card">
          <div className="admin-stat-info">
            <div className="stat-card-header">
              <div className="admin-stat-icon white-icon">
                <BedDoubleIcon size={20} />
              </div>
              <span className="admin-stat-label">Occupancy Rate</span>
            </div>
            <div className="admin-stat-row">
              <span className="admin-stat-value">76%</span>
              <span className="admin-stat-trend positive">? 8.4%</span>
            </div>
            <div className="admin-stat-subtext">vs last 7 days</div>
          </div>
        </div>
      </div>

      <div className="admin-grid-2-layout">
        <div className="admin-card" style={{flex: '2'}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Booking Overview</h2>
            <div className="admin-filter-dropdown">
              <span>Last 7 Days</span>
              <span style={{fontSize:'10px'}}>?</span>
            </div>
          </div>
          <div style={{padding: '24px 32px 32px 32px', height: '300px', width: '100%'}}>
            <svg width="100%" height="100%" viewBox="0 0 600 240" preserveAspectRatio="none" style={{overflow:'visible'}}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8A158F" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#8A158F" stopOpacity="0"/>
                </linearGradient>
              </defs>
              
              <text x="-25" y="10" fontSize="11" fill="#817F7F">80</text>
              <line x1="0" y1="6" x2="600" y2="6" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4"/>
              
              <text x="-25" y="60" fontSize="11" fill="#817F7F">60</text>
              <line x1="0" y1="56" x2="600" y2="56" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4"/>
              
              <text x="-25" y="110" fontSize="11" fill="#817F7F">40</text>
              <line x1="0" y1="106" x2="600" y2="106" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4"/>
              
              <text x="-25" y="160" fontSize="11" fill="#817F7F">20</text>
              <line x1="0" y1="156" x2="600" y2="156" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4"/>
              
              <text x="-20" y="210" fontSize="11" fill="#817F7F">0</text>
              <line x1="0" y1="206" x2="600" y2="206" stroke="#e2e8f0" strokeWidth="1"/>
              
              <text x="0" y="235" fontSize="11" fill="#817F7F" textAnchor="middle">24 May</text>
              <text x="100" y="235" fontSize="11" fill="#817F7F" textAnchor="middle">25 May</text>
              <text x="200" y="235" fontSize="11" fill="#817F7F" textAnchor="middle">26 May</text>
              <text x="300" y="235" fontSize="11" fill="#817F7F" textAnchor="middle">27 May</text>
              <text x="400" y="235" fontSize="11" fill="#817F7F" textAnchor="middle">28 May</text>
              <text x="500" y="235" fontSize="11" fill="#817F7F" textAnchor="middle">29 May</text>
              <text x="600" y="235" fontSize="11" fill="#817F7F" textAnchor="middle">30 May</text>

              <path d="M 0 156 L 100 56 L 200 106 L 300 131 L 400 131 L 500 81 L 600 31 L 600 206 L 0 206 Z" fill="url(#lineGrad)" />
              <path d="M 0 156 L 100 56 L 200 106 L 300 131 L 400 131 L 500 81 L 600 31" fill="none" stroke="#8A158F" strokeWidth="3" />
              
              <circle cx="0" cy="156" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
              <circle cx="100" cy="56" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
              <circle cx="200" cy="106" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
              <circle cx="300" cy="131" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
              <circle cx="400" cy="131" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
              <circle cx="500" cy="81" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
              <circle cx="600" cy="31" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        <div className="admin-card" style={{flex: '1'}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Bookings by Source</h2>
          </div>
          <div style={{padding: '24px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'300px'}}>
            <div style={{position:'relative', width:'160px', height:'160px'}}>
              <svg width="160" height="160" viewBox="0 0 100 100" style={{transform:'rotate(-90deg)'}}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8A158F" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="113" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ca8bce" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="188.4" />
              </svg>
              <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', textAlign:'center'}}>
                <div style={{fontSize:'22px', fontWeight:'700', color:'#373737', lineHeight:'1.2'}}>128</div>
                <div style={{fontSize:'12px', color:'#817F7F', fontWeight:'500'}}>Total</div>
              </div>
            </div>
            <div style={{display:'flex', width:'100%', justifyContent:'center', marginTop:'32px', gap:'20px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737'}}>
                <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#8A158F'}}></div>
                Direct (45%)
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737'}}>
                <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#ca8bce'}}></div>
                Website (30%)
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737'}}>
                <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#f0f0f0'}}></div>
                OTA (25%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-grid-2-layout">
        <div className="admin-card" style={{flex: '1.5'}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Room Status Overview</h2>
            <span style={{fontSize:'13px', color:'#8A158F', fontWeight:'600', cursor:'pointer'}}>View All Rooms</span>
          </div>
          <div style={{padding: '24px'}}>
            <div style={{display:'flex', gap:'16px', marginBottom:'32px'}}>
              <div className="room-status-badge total">
                <BedDoubleIcon size={20} style={{marginRight:'8px'}} />
                <div>
                  <div className="status-label">Total Rooms</div>
                  <div className="status-val">4</div>
                </div>
              </div>
              <div className="room-status-badge available">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><polyline points="20 6 9 17 4 12"></polyline></svg>
                <div>
                  <div className="status-label">Available</div>
                  <div className="status-val">2</div>
                </div>
              </div>
              <div className="room-status-badge booked">
                <UserGroupIcon size={20} style={{marginRight:'8px'}} />
                <div>
                  <div className="status-label">Booked</div>
                  <div className="status-val">2</div>
                </div>
              </div>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{paddingLeft:'16px'}}>ROOM NAME</th>
                  <th>PRICE/NIGHT</th>
                  <th style={{textAlign:'right', paddingRight:'16px'}}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{paddingLeft:'16px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                      <img src={room1} alt="Room" style={{width:'44px', height:'44px', borderRadius:'8px', objectFit:'cover'}} />
                      <span style={{fontWeight:'500', color:'#373737'}}>Himalayan View Room</span>
                    </div>
                  </td>
                  <td style={{color:'#555', fontWeight:'500'}}>?4,500</td>
                  <td style={{textAlign:'right', paddingRight:'16px'}}><span className="admin-badge badge-warning" style={{background:'#fef2f2', color:'#dc2626'}}>Booked</span></td>
                </tr>
                <tr>
                  <td style={{paddingLeft:'16px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                      <img src={room2} alt="Room" style={{width:'44px', height:'44px', borderRadius:'8px', objectFit:'cover'}} />
                      <span style={{fontWeight:'500', color:'#373737'}}>Premium Valley Room</span>
                    </div>
                  </td>
                  <td style={{color:'#555', fontWeight:'500'}}>?3,800</td>
                  <td style={{textAlign:'right', paddingRight:'16px'}}><span className="admin-badge badge-success">Available</span></td>
                </tr>
                <tr>
                  <td style={{paddingLeft:'16px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                      <img src={room3} alt="Room" style={{width:'44px', height:'44px', borderRadius:'8px', objectFit:'cover'}} />
                      <span style={{fontWeight:'500', color:'#373737'}}>Luxury Family Suite</span>
                    </div>
                  </td>
                  <td style={{color:'#555', fontWeight:'500'}}>?7,200</td>
                  <td style={{textAlign:'right', paddingRight:'16px'}}><span className="admin-badge badge-warning" style={{background:'#fef2f2', color:'#dc2626'}}>Booked</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card" style={{flex: '1'}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Bookings</h2>
            <span style={{fontSize:'13px', color:'#8A158F', fontWeight:'600', cursor:'pointer'}}>View All</span>
          </div>
          <div style={{padding: '24px'}}>
            
            <div className="recent-booking-item">
              <img src={room1} alt="Booking" />
              <div className="recent-booking-info">
                <h4>John Doe</h4>
                <p>Himalayan View Room</p>
                <span>24 May - 27 May 2024</span>
              </div>
              <span className="admin-badge badge-success">Confirmed</span>
            </div>

            <div className="recent-booking-item">
              <img src={room3} alt="Booking" />
              <div className="recent-booking-info">
                <h4>Emily Johnson</h4>
                <p>Luxury Family Suite</p>
                <span>25 May - 28 May 2024</span>
              </div>
              <span className="admin-badge badge-warning" style={{background:'#fff7ed', color:'#ea580c'}}>Pending</span>
            </div>

            <div className="recent-booking-item">
              <img src={room2} alt="Booking" />
              <div className="recent-booking-info">
                <h4>Michael Brown</h4>
                <p>Premium Valley Room</p>
                <span>26 May - 29 May 2024</span>
              </div>
              <span className="admin-badge badge-success">Confirmed</span>
            </div>

            <div className="recent-booking-item">
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
    </>
  );
}
