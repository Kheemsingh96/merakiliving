Created At: 2026-08-31T11:20:40+05:30
Completed At: 2026-08-31T11:20:41+05:30
File Path: `file:///c:/Users/Kheem%20Singh/Desktop/merakiliving/merakiliving/src/Pages/Admin/AdminDashboard/AdminDashboard.js`
Total Lines: 1334
Total Bytes: 74168
Showing lines 1 to 800
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: import React, { useState, useEffect } from 'react';
2: import './AdminDashboard.css';
3: import logo from '../../../assets/images/logo.webp';
4: import {
5:   DashboardSquare01Icon, Calendar01Icon, BedDoubleIcon, Coffee02Icon, UserGroupIcon,
6:   Wallet01Icon, Ticket01Icon, Image01Icon, Settings01Icon, Logout01Icon, PlusSignIcon,
7:   Edit01Icon, Delete01Icon, WhatsappIcon, File02Icon, StarIcon, Doc01Icon, Menu01Icon, Cancel01Icon, Download02Icon
8: } from 'hugeicons-react';
9: import room1 from '../../../assets/images/room-1.webp';
10: import cafe1 from '../../../assets/images/cafe-menu-1.webp';
11: import founder from '../../../assets/images/founder.webp';
12: 
13: const API_CONFIG_URL = 'http://localhost/merakiliving_backend/api/config';
14: 
15: export default function AdminDashboard({ setCurrentPage }) {
16:   const [activeTab, setActiveTab] = useState('dashboard');
17:   const [subTab, setSubTab] = useState('');
18:   const [sidebarOpen, setSidebarOpen] = useState(false);
19:   const [showProfileMenu, setShowProfileMenu] = useState(false);
20: 
21:   const handleLogout = () => {
22:     sessionStorage.removeItem('meraki_admin_auth'); 
23:     window.location.reload();
24:     if (setCurrentPage) setCurrentPage('admin-login');
25:   };
26: 
27:   const navItems = [
28:     { id: 'dashboard', label: 'Dashboard', icon: DashboardSquare01Icon },
29:     {
30:       id: 'bookings', label: 'Bookings', icon: Calendar01Icon,
31:       subItems: [{ id: 'all-bookings', label: 'All Bookings' }, { id: 'calendar', label: 'Calendar / Availability' }]
32:     },
33:     {
34:       id: 'rooms', label: 'Rooms', icon: BedDoubleIcon,
35:       subItems: [{ id: 'manage-rooms', label: 'Manage Rooms' }, { id: 'pricing', label: 'Pricing & Taxes' }]
36:     },
37:     {
38:       id: 'cafe', label: 'Cafe Menu', icon: Coffee02Icon,
39:       subItems: [{ id: 'featured-items', label: 'Featured Items' }, { id: 'full-menu', label: 'Full Menu Categories' }]
40:     },
41:     { id: 'guests', label: 'Guests', icon: UserGroupIcon },
42:     { id: 'payments', label: 'Payments', icon: Wallet01Icon },
43:     { id: 'coupons', label: 'Coupons & Discounts', icon: Ticket01Icon },
44:     {
45:       id: 'website', label: 'Website Content', icon: File02Icon,
46:       subItems: [{ id: 'gallery', label: 'Gallery Manager', icon: Image01Icon }, { id: 'reviews', label: 'Reviews', icon: StarIcon }, { id: 'policies', label: 'Legal Policies', icon: Doc01Icon }]
47:     },
48:     { id: 'settings', label: 'Settings', icon: Settings01Icon }
49:   ];
50: 
51:   const handleNavClick = (id, subId = '') => {
52:     setActiveTab(id);
53:     setSubTab(subId);
54:     setSidebarOpen(false);
55:   };
56: 
57:   const renderContent = () => {
58:     if (activeTab === 'dashboard') return <DashboardTab />;
59:     if (activeTab === 'bookings' && subTab === 'all-bookings') return <BookingsTab />;
60:     if (activeTab === 'bookings' && subTab === 'calendar') return <CalendarTab />;
61:     if (activeTab === 'rooms' && subTab === 'manage-rooms') return <ManageRoomsTab />;
62:     if (activeTab === 'rooms' && subTab === 'pricing') return <PricingTab />;
63:     if (activeTab === 'cafe' && subTab === 'featured-items') return <CafeFeaturedTab />;
64:     if (activeTab === 'cafe' && subTab === 'full-menu') return <CafeMenuTab />;
65:     if (activeTab === 'guests') return <GuestsTab />;
66:     if (activeTab === 'payments') return <PaymentsTab />;
67:     if (activeTab === 'coupons') return <CouponsTab />;
68:     if (activeTab === 'website' && subTab === 'gallery') return <GalleryTab />;
69:     if (activeTab === 'website' && subTab === 'reviews') return <ReviewsTab />;
70:     if (activeTab === 'website' && subTab === 'policies') return <PoliciesTab />;
71:     if (activeTab === 'settings') return <SettingsTab />;
72:     return (
73:       <div className="admin-empty-state">
74:         <DashboardSquare01Icon className="admin-empty-icon" />
75:         <h3>Section Under Construction</h3>
76:         <p>This module is being set up.</p>
77:       </div>
78:     );
79:   };
80: 
81:   return (
82:     <div className="admin-dashboard-container">
83:       <div className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
84:       <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
85:         <div className="admin-sidebar-header">
86:           <img src={logo} alt="Meraki Living" className="admin-sidebar-logo" />
87:           <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}><Cancel01Icon size={20} /></button>
88:         </div>
89:         <nav className="admin-sidebar-nav">
90:           {navItems.map(item => (
91:             <div key={item.id} className="admin-nav-group">
92:               <div className={`admin-nav-item ${activeTab === item.id && !item.subItems ? 'active' : ''}`} onClick={() => handleNavClick(item.id, item.subItems ? item.subItems[0].id : '')}>
93:                 <item.icon size={20} /><span>{item.label}</span>
94:               </div>
95:               {item.subItems && activeTab === item.id && (
96:                 <div className="admin-nav-sublist">
97:                   {item.subItems.map(subItem => (
98:                     <div key={subItem.id} className={`admin-nav-subitem ${subTab === subItem.id ? 'active' : ''}`} onClick={() => handleNavClick(item.id, subItem.id)}>{subItem.label}</div>
99:                   ))}
100:                 </div>
101:               )}
102:             </div>
103:           ))}
104:         </nav>
105:         <div className="admin-sidebar-footer">
106:           <div className="admin-sidebar-footer-profile">
107:             <img src={founder} alt="Admin" className="admin-sidebar-footer-profile-img" style={{objectFit:"cover", width: '36px', height: '36px'}} />
108:             <div className="admin-sidebar-footer-profile-info" style={{flex: 1}}>
109:               <span className="admin-sidebar-footer-profile-name">Pranay Matiyani</span>
110:               <span className="admin-sidebar-footer-profile-role">Super Administrator</span>
111:             </div>
112:             <div style={{color: '#817F7F', display: 'flex', cursor: 'pointer', padding: '4px'}} onClick={(e) => { e.stopPropagation(); setShowProfileMenu(prev => !prev); }}>
113:               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
114:             </div>
115:           </div>
116:           {showProfileMenu && (
117:             <>
118:               <div className="admin-click-away" onClick={() => setShowProfileMenu(false)}></div>
119:               <div className="admin-dropdown-menu admin-fade-in" style={{bottom: '100%', right: '16px', marginBottom: '8px', position: 'absolute', width: '200px', padding: '8px'}}>
120:                 <div className="dropdown-item" onClick={handleLogout} style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626'}}>
121:                   <Logout01Icon size={16} strokeWidth={1.5} /> Logout
122:                 </div>
123:               </div>
124:             </>
125:           )}
126:         </div>
127:       </aside>
128:       <main className="admin-main-content">
129:         <button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)}><Menu01Icon size={22} /></button>
130:         {renderContent()}
131:       </main>
132:     </div>
133:   );
134: }
135: 
136: function PageHeader({ title, subtitle, action }) {
137:   return (
138:     <div className="admin-header">
139:       <div>
140:         <h1 className="admin-page-title">{title}</h1>
141:         <p className="admin-page-subtitle">{subtitle}</p>
142:       </div>
143:       {action && <div className="admin-header-actions">{action}</div>}
144:     </div>
145:   );
146: }
147: 
148: function DashboardTab() {
149:   const [showDateDropdownTop, setShowDateDropdownTop] = useState(false);
150:   const [showDateDropdownChart, setShowDateDropdownChart] = useState(false);
151:   const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
152:   const [dateRange, setDateRange] = useState('Last 7 Days');
153:   const [stats, setStats] = useState({ totalBookings: 0, totalGuests: 0, totalRevenue: '₹0', occupancyRate: '0%' });
154:   const [roomStatuses, setRoomStatuses] = useState([]);
155:   const [recentBookings, setRecentBookings] = useState([]);
156: 
157:   useEffect(() => {
158:     fetch(`${API_CONFIG_URL}/api_dashboard_stats.php`)
159:       .then(res => res.json())
160:       .then(data => {
161:         if(data && data.stats) setStats(data.stats);
162:         if(data && Array.isArray(data.roomStatuses)) setRoomStatuses(data.roomStatuses);
163:         if(data && Array.isArray(data.recentBookings)) setRecentBookings(data.recentBookings);
164:       }).catch(e => console.error("Dashboard JSON Error:", e));
165:   }, []);
166: 
167:   const toggleStatus = (id) => {
168:     const roomToToggle = roomStatuses.find(r => r.id === id);
169:     if (!roomToToggle) return;
170: 
171:     const isAvailable = roomToToggle.status === 'Available';
172:     const newStatus = isAvailable ? 'Booked' : 'Available';
173: 
174:     fetch(`${API_CONFIG_URL}/api_rooms.php`, {
175:       method: 'PUT',
176:       headers: { 'Content-Type': 'application/json' },
177:       body: JSON.stringify({ id: id, status: newStatus })
178:     })
179:     .then(res => res.json())
180:     .then(data => {
181:       if (data && data.status === 'success') {
182:         fetch(`${API_CONFIG_URL}/api_dashboard_stats.php`)
183:           .then(res => res.json())
184:           .then(dashboardData => {
185:             if(dashboardData && Array.isArray(dashboardData.roomStatuses)) {
186:               setRoomStatuses(dashboardData.roomStatuses);
187:             }
188:           }).catch(e => console.error(e));
189:       }
190:     }).catch(err => console.error(err));
191:   };
192: 
193:   return (
194:     <div className="admin-fade-in">
195:       <div className="admin-header">
196:         <div>
197:           <h1 className="admin-page-title">Dashboard</h1>
198:           <p className="admin-page-subtitle" style={{color: '#555', fontWeight: '500'}}>Welcome back, Admin! Here's what's happening today.</p>
199:         </div>
200:         <div className="admin-header-actions" style={{ alignItems: 'center' }}>
201:           <div style={{position: 'relative'}}>
202:             <div className="admin-date-selector" onClick={(e) => { e.stopPropagation(); setShowDateDropdownTop(prev => !prev); setShowNotificationDropdown(false); }}>
203:               <Calendar01Icon size={18} strokeWidth={1.5} />
204:               <span style={{fontWeight: '500', color: '#373737'}}>{dateRange}</span>
205:               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
206:             </div>
207:             {showDateDropdownTop && (
208:               <>
209:                 <div className="admin-click-away" onClick={() => setShowDateDropdownTop(false)}></div>
210:                 <div className="admin-dropdown-menu admin-fade-in">
211:                   {['Last 7 Days', 'Last 30 Days', 'This Month'].map(range => (
212:                     <div key={range} className={`dropdown-item ${dateRange === range ? 'active' : ''}`} onClick={() => {setDateRange(range); setShowDateDropdownTop(false)}}>{range}</div>
213:                   ))}
214:                 </div>
215:               </>
216:             )}
217:           </div>
218:           <div style={{position: 'relative'}}>
219:             <button className="admin-icon-btn" onClick={(e) => { e.stopPropagation(); setShowNotificationDropdown(prev => !prev); setShowDateDropdownTop(false); }}>
220:               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
221:               <span className="admin-notification-badge">0</span>
222:             </button>
223:             {showNotificationDropdown && (
224:               <>
225:                 <div className="admin-click-away" onClick={() => setShowNotificationDropdown(false)}></div>
226:                 <div className="admin-dropdown-menu notification-menu admin-fade-in">
227:                   <div className="dropdown-header">Notifications (0)</div>
228:                 </div>
229:               </>
230:             )}
231:           </div>
232:           <button className="admin-icon-btn logout-top-btn" onClick={() => { sessionStorage.removeItem('meraki_admin_auth'); window.location.reload(); }}>
233:             <Logout01Icon size={20} strokeWidth={1.5} />
234:           </button>
235:         </div>
236:       </div>
237:       <div className="admin-grid-4">
238:         <div className="admin-stat-card gradient-card">
239:           <div className="admin-stat-info">
240:             <div className="stat-card-header"><div className="admin-stat-icon white-icon"><Calendar01Icon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Total Bookings</span></div>
241:             <div className="admin-stat-row"><span className="admin-stat-value">{stats.totalBookings}</span><span className="admin-stat-trend positive">↑</span></div>
242:             <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
243:           </div>
244:         </div>
245:         <div className="admin-stat-card gradient-card">
246:           <div className="admin-stat-info">
247:             <div className="stat-card-header"><div className="admin-stat-icon white-icon"><UserGroupIcon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Total Guests</span></div>
248:             <div className="admin-stat-row"><span className="admin-stat-value">{stats.totalGuests}</span><span className="admin-stat-trend positive">↑</span></div>
249:             <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
250:           </div>
251:         </div>
252:         <div className="admin-stat-card gradient-card">
253:           <div className="admin-stat-info">
254:             <div className="stat-card-header"><div className="admin-stat-icon white-icon"><Wallet01Icon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Total Revenue</span></div>
255:             <div className="admin-stat-row"><span className="admin-stat-value">{stats.totalRevenue}</span><span className="admin-stat-trend positive">↑</span></div>
256:             <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
257:           </div>
258:         </div>
259:         <div className="admin-stat-card gradient-card">
260:           <div className="admin-stat-info">
261:             <div className="stat-card-header"><div className="admin-stat-icon white-icon"><BedDoubleIcon size={20} strokeWidth={1.5} /></div><span className="admin-stat-label">Occupancy Rate</span></div>
262:             <div className="admin-stat-row"><span className="admin-stat-value">{stats.occupancyRate}</span><span className="admin-stat-trend positive">↑</span></div>
263:             <div className="admin-stat-subtext">vs {dateRange.toLowerCase()}</div>
264:           </div>
265:         </div>
266:       </div>
267:       <div className="admin-grid-2-layout">
268:         <div className="admin-card" style={{flex: '2'}}>
269:           <div className="admin-card-header">
270:             <h2 className="admin-card-title">Booking Overview</h2>
271:             <div className="admin-filter-dropdown" onClick={(e) => { e.stopPropagation(); setShowDateDropdownChart(prev => !prev); }}>
272:               <span style={{fontWeight: '500', color: '#373737'}}>{dateRange}</span>
273:               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
274:               {showDateDropdownChart && (
275:                 <>
276:                   <div className="admin-click-away" onClick={(e) => {e.stopPropagation(); setShowDateDropdownChart(false);}}></div>
277:                   <div className="admin-dropdown-menu admin-fade-in" style={{top: '100%', right: '0', marginTop: '8px'}}>
278:                     {['Last 7 Days', 'Last 30 Days', 'This Month'].map(range => (
279:                       <div key={range} className={`dropdown-item ${dateRange === range ? 'active' : ''}`} onClick={(e) => {e.stopPropagation(); setDateRange(range); setShowDateDropdownChart(false)}}>{range}</div>
280:                     ))}
281:                   </div>
282:                 </>
283:               )}
284:             </div>
285:           </div>
286:           <div style={{padding: '24px', height: '320px', position: 'relative'}}>
287:             <div style={{position: 'absolute', top: '24px', bottom: '50px', left: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#817F7F', fontSize: '12px', fontWeight: '500'}}><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span></div>
288:             <div style={{position: 'absolute', top: '30px', bottom: '56px', left: '50px', right: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}><div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div><div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div><div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div><div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div><div style={{borderBottom: '1px solid #cbd5e1', width: '100%'}}></div></div>
289:             <div style={{position: 'absolute', bottom: '20px', left: '50px', right: '24px', display: 'flex', justifyContent: 'space-between', color: '#817F7F', fontSize: '11px', fontWeight: '500'}}><span style={{width: '40px', textAlign: 'center'}}>Day 1</span><span style={{width: '40px', textAlign: 'center'}}>Day 2</span><span style={{width: '40px', textAlign: 'center'}}>Day 3</span><span style={{width: '40px', textAlign: 'center'}}>Day 4</span><span style={{width: '40px', textAlign: 'center'}}>Day 5</span><span style={{width: '40px', textAlign: 'center'}}>Day 6</span><span style={{width: '40px', textAlign: 'center'}}>Day 7</span></div>
290:             <div style={{position: 'absolute', top: '30px', bottom: '56px', left: '65px', right: '39px'}}>
291:               <svg width="100%" height="100%" style={{overflow: 'visible'}}>
292:                 <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8A158F" stopOpacity="0.2"/><stop offset="100%" stopColor="#8A158F" stopOpacity="0"/></linearGradient></defs>
293:                 <path d="M 0 100 L 0 75 L 16.66 25 L 33.33 50 L 50 62.5 L 66.66 62.5 L 83.33 37.5 L 100 12.5 L 100 100 Z" fill="url(#lineGrad)" vectorEffect="non-scaling-stroke" />
294:                 <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M 0 75 L 16.66 25 L 33.33 50 L 50 62.5 L 66.66 62.5 L 83.33 37.5 L 100 12.5" fill="none" stroke="#8A158F" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg>
295:                 <circle cx="0%" cy="75%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="16.66%" cy="25%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="33.33%" cy="50%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="50%" cy="62.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="66.66%" cy="62.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="83.33%" cy="37.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} /><circle cx="100%" cy="12.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth={1.5} />
296:               </svg>
297:             </div>
298:           </div>
299:         </div>
300:         <div className="admin-card" style={{flex: '1'}}>
301:           <div className="admin-card-header"><h2 className="admin-card-title">Bookings by Source</h2></div>
302:           <div style={{padding: '24px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'320px'}}>
303:             <div style={{position:'relative', width:'160px', height:'160px'}}>
304:               <svg width="160" height="160" viewBox="0 0 100 100" style={{transform:'rotate(-90deg)'}}><circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="12" /><circle cx="50" cy="50" r="40" fill="none" stroke="#8A158F" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="113" /><circle cx="50" cy="50" r="40" fill="none" stroke="#ca8bce" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="188.4" /></svg>
305:               <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', textAlign:'center'}}><div style={{fontSize:'22px', fontWeight:'700', color:'#373737', lineHeight:'1.2'}}>{stats.totalBookings}</div><div style={{fontSize:'13px', color:'#555', fontWeight:'500'}}>Total</div></div>
306:             </div>
307:             <div style={{display:'flex', width:'100%', justifyContent:'center', marginTop:'32px', gap:'16px'}}>
308:               <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737', fontWeight:'500'}}><div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#8A158F'}}></div>Direct</div>
309:               <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737', fontWeight:'500'}}><div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#ca8bce'}}></div>Website</div>
310:               <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#373737', fontWeight:'500'}}><div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#f0f0f0'}}></div>OTA</div>
311:             </div>
312:           </div>
313:         </div>
314:       </div>
315:       <div className="admin-grid-2-layout">
316:         <div className="admin-card" style={{flex: '1.5'}}>
317:           <div className="admin-card-header">
318:             <h2 className="admin-card-title">Room Status Overview</h2>
319:             <span style={{fontSize:'13px', color:'#8A158F', fontWeight:'600', cursor:'pointer'}}>Manage Rooms</span>
320:           </div>
321:           <div style={{padding: '24px'}}>
322:             {roomStatuses.map((r) => (
323:               <div key={r.id} className="admin-room-list-item hover-lift-subtle">
324:                 <img src={r.img || room1} alt={r.name} />
325:                 <div className="admin-room-list-info">
326:                   <h4>{r.name}</h4><p>{r.price} / night</p>
327:                 </div>
328:                 <span className="admin-badge admin-status-toggle" style={{background: r.bg || (r.status === 'Available' ? '#f0fdf4' : '#fef2f2'), color: r.color || (r.status === 'Available' ? '#16a34a' : '#dc2626')}} onClick={() => toggleStatus(r.id)} title="Click to toggle status">{r.status}</span>
329:               </div>
330:             ))}
331:           </div>
332:         </div>
333:         <div className="admin-card" style={{flex: '1'}}>
334:           <div className="admin-card-header">
335:             <h2 className="admin-card-title">Recent Bookings</h2>
336:             <span style={{fontSize:'13px', color:'#8A158F', fontWeight:'600', cursor:'pointer'}}>View All</span>
337:           </div>
338:           <div style={{padding: '24px'}}>
339:             {recentBookings.map((b) => (
340:               <div key={b.id} className="recent-booking-item hover-lift-subtle">
341:                 <img src={room1} alt="Booking" />
342:                 <div className="recent-booking-info">
343:                   <h4>{b.name || b.guest_name}</h4><p>{b.room || b.room_name}</p><span>{b.dates || `${b.check_in} - ${b.check_out}`}</span>
344:                 </div>
345:                 <span className={`admin-badge ${b.status === 'Confirmed' || b.status === 'Success' ? 'badge-success' : b.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`} style={b.status === 'Pending' ? {background:'#fff7ed', color:'#ea580c'} : {}}>{b.status}</span>
346:               </div>
347:             ))}
348:           </div>
349:         </div>
350:       </div>
351:     </div>
352:   );
353: }
354: 
355: function BookingsTab() {
356:   const [bookings, setBookings] = useState([]);
357:   const [filter, setFilter] = useState('All');
358: 
359:   useEffect(() => {
360:     Promise.all([
361:       fetch(`${API_CONFIG_URL}/apibooking.php`).then(res => res.json()),
362:       fetch(`${API_CONFIG_URL}/api_payment.php`).then(res => res.json())
363:     ]).then(([bookingsData, paymentsData]) => {
364:       let fetchedPayments = [];
365:       if (paymentsData && paymentsData.status === 'success') {
366:         fetchedPayments = paymentsData.data;
367:       }
368:       if (bookingsData && bookingsData.status === 'success') {
369:         const mergedBookings = bookingsData.data.map(b => {
370:           const payment = fetchedPayments.find(p => p.booking_id === b.id && (p.status === 'Success' || p.status === 'Completed'));
371:           return {
372:             ...b,
373:             paid_amount: payment ? payment.amount : b.room_price
374:           };
375:         });
376:         setBookings(mergedBookings);
377:       }
378:     }).catch(e => console.error("JSON Error in Bookings:", e));
379:   }, []);
380: 
381:   const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);
382: 
383:   return (
384:     <>
385:       <PageHeader title="Booking Management" subtitle="View and manage all homestay reservations." action={<button className="admin-btn-primary" onClick={() => alert('Booking creation is managed via frontend guest flow.')}><PlusSignIcon size={18} /> Create Booking</button>} />
386:       <div className="admin-card">
387:         <div className="admin-filter-bar">
388:           {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
389:             <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
390:           ))}
391:         </div>
392:         <div className="admin-table-wrapper">
393:           <table className="admin-table">
394:             <thead><tr><th>ID</th><th>Guest Name</th><th>Room</th><th>Dates</th><th>Amount Paid</th><th>Status</th><th>Actions</th></tr></thead>
395:             <tbody>
396:               {filteredBookings.map((b, i) => (
397:                 <tr key={i}>
398:                   <td className="admin-text-mono">#BK-{b.id}</td>
399:                   <td><div className="admin-cell-stack"><span>{b.guest_name}</span><span className="admin-cell-muted">{b.guest_phone}</span></div></td>
400:                   <td>{b.room_name}</td>
401:                   <td><div className="admin-cell-stack"><span>{b.check_in} to {b.check_out}</span><span className="admin-cell-muted">Nights</span></div></td>
402:                   <td className="admin-text-medium">₹{b.paid_amount}</td>
403:                   <td><span className={`admin-badge ${b.status === 'Confirmed' ? 'badge-success' : b.status === 'Pending' ? 'badge-info' : 'badge-danger'}`}>{b.status}</span></td>
404:                   <td>
405:                     <div className="admin-action-group"><button className="admin-btn-sm admin-btn-outline" onClick={() => alert('View booking details for BK-' + b.id)}><Edit01Icon size={14} /> View</button><a href={`https://wa.me/${b.guest_phone}`} target="_blank" rel="noreferrer" className="admin-btn-sm admin-btn-whatsapp"><WhatsappIcon size={14} /></a></div>
406:                   </td>
407:                 </tr>
408:               ))}
409:               {filteredBookings.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '24px'}}>No {filter.toLowerCase()} bookings found.</td></tr>}
410:             </tbody>
411:           </table>
412:         </div>
413:       </div>
414:     </>
415:   );
416: }
417: 
418: function CalendarTab() {
419:   return (
420:     <>
421:       <PageHeader title="Availability Calendar" subtitle="Manage room availability and block dates." />
422:       <div className="admin-card admin-card-padded">
423:         <div className="admin-calendar-header"><h2 className="admin-card-title">October 2026</h2><div className="admin-calendar-nav"><button className="admin-btn-outline">Previous</button><button className="admin-btn-outline">Next</button></div></div>
424:         <div className="admin-calendar-grid">
425:           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (<div key={day} className="admin-calendar-header-cell">{day}</div>))}
426:           {[...Array(31)].map((_, i) => (
427:             <div key={i} className="admin-calendar-cell"><span className="admin-calendar-date">{i + 1}</span></div>
428:           ))}
429:         </div>
430:       </div>
431:     </>
432:   );
433: }
434: 
435: function ManageRoomsTab() {
436:   const [rooms, setRooms] = useState([]);
437:   const [editingRoom, setEditingRoom] = useState(null);
438:   
439:   useEffect(() => {
440:     fetch(`${API_CONFIG_URL}/api_rooms.php`)
441:       .then(res => res.json())
442:       .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setRooms(data.data); })
443:       .catch(e => console.error("JSON Error in ManageRooms:", e));
444:   }, []);
445: 
446:   const handleImageUpload = async (e) => {
447:     const file = e.target.files[0];
448:     if (!file) return;
449:     
450:     const formData = new FormData();
451:     formData.append('action', 'upload');
452:     formData.append('image', file);
453:     
454:     try {
455:       const res = await fetch(`${API_CONFIG_URL}/api_rooms.php`, {
456:         method: 'POST',
457:         body: formData
458:       });
459:       const data = await res.json();
460:       if (data.status === 'success') {
461:         setEditingRoom({...editingRoom, image_url: data.image_url});
462:       }
463:     } catch (err) {
464:       console.error("Upload error:", err);
465:     }
466:   };
467: 
468:   const saveRoomDetails = () => {
469:     const isNew = !editingRoom.id;
470:     const method = isNew ? 'POST' : 'PUT';
471:     
472:     fetch(`${API_CONFIG_URL}/api_rooms.php`, {
473:       method: method,
474:       headers: { 'Content-Type': 'application/json' },
475:       body: JSON.stringify({
476:         id: editingRoom.id,
477:         name: editingRoom.name || '',
478:         description: editingRoom.description || '',
479:         status: editingRoom.status || 'Available',
480:         price: editingRoom.price || 0,
481:         original_price: editingRoom.original_price || 0,
482:         image_url: editingRoom.image_url || ''
483:       })
484:     })
485:     .then(res => res.json())
486:     .then(data => {
487:       if(data && data.status === 'success') {
488:         fetch(`${API_CONFIG_URL}/api_rooms.php`)
489:           .then(res => res.json())
490:           .then(refetchData => {
491:             if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data)) {
492:               setRooms(refetchData.data);
493:             }
494:             setEditingRoom(null);
495:           });
496:       }
497:     }).catch(e => console.error("Error saving room:", e));
498:   };
499: 
500:   const deleteRoom = (id) => {
501:     if(!window.confirm("Are you sure you want to delete this room?")) return;
502:     fetch(`${API_CONFIG_URL}/api_rooms.php`, {
503:       method: 'DELETE',
504:       headers: { 'Content-Type': 'application/json' },
505:       body: JSON.stringify({ id })
506:     })
507:     .then(res => res.json())
508:     .then(data => {
509:       if(data && data.status === 'success') {
510:         setRooms(rooms.filter(r => r.id !== id));
511:       }
512:     }).catch(e => console.error("Delete room error:", e));
513:   };
514: 
515:   return (
516:     <div className="admin-fade-in">
517:       <PageHeader title="Manage Rooms" subtitle="Edit room details, descriptions, images and availability." action={<button className="admin-btn-primary" onClick={() => setEditingRoom({})}><PlusSignIcon size={18} /> Add Room</button>} />
518:       <div className="admin-item-grid">
519:         {rooms.map(r => (
520:           <div key={r.id} className="admin-item-card hover-lift">
521:             <img src={r.image_url || room1} alt={r.name} className="admin-item-img" />
522:             <div className="admin-item-content">
523:               <div className="admin-item-header"><h3 className="admin-item-title">{r.name}</h3><span className="admin-badge badge-success">{r.status}</span></div>
524:               <p className="admin-item-desc" style={{color: '#555', fontWeight: '500'}}>{r.description || 'Description not available.'}</p>
525:               <div className="admin-item-actions" style={{marginTop: '20px', gap: '8px', display: 'flex'}}>
526:                 <button className="admin-btn-outline admin-btn-full" onClick={() => setEditingRoom(r)}><Edit01Icon size={16} strokeWidth={1.5} /> Edit Details</button>
527:                 <button className="admin-btn-outline admin-btn-danger" onClick={() => deleteRoom(r.id)}><Delete01Icon size={16} strokeWidth={1.5} /></button>
528:               </div>
529:             </div>
530:           </div>
531:         ))}
532:       </div>
533:       {editingRoom && (
534:         <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
535:           <div className="admin-modal-content">
536:             <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
537:               <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>{editingRoom.id ? 'Edit Room' : 'Add Room'}</h2>
538:               <button onClick={() => setEditingRoom(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
539:             </div>
540:             <div className="admin-form-group"><label className="admin-form-label">Room Title</label><input type="text" className="admin-form-input" value={editingRoom.name || ''} onChange={e => setEditingRoom({...editingRoom, name: e.target.value})} /></div>
541:             <div className="admin-form-group"><label className="admin-form-label">Description</label><textarea className="admin-form-input" rows="3" value={editingRoom.description || ''} onChange={e => setEditingRoom({...editingRoom, description: e.target.value})}></textarea></div>
542:             <div className="admin-form-group">
543:               <label className="admin-form-label">Room Image</label>
544:               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
545:                  {editingRoom.image_url && <img src={editingRoom.image_url} alt="Preview" style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} />}
546:                  <input type="file" accept="image/*" className="admin-form-input" onChange={handleImageUpload} />
547:               </div>
548:             </div>
549:             <div className="admin-form-group"><label className="admin-form-label">Status</label><select className="admin-form-input" value={editingRoom.status || 'Available'} onChange={e => setEditingRoom({...editingRoom, status: e.target.value})}><option>Available</option><option>Inactive</option><option>Maintenance</option></select></div>
550:             <button className="admin-btn-primary admin-btn-full" onClick={saveRoomDetails}>Save Changes</button>
551:           </div>
552:         </div>
553:       )}
554:     </div>
555:   );
556: }
557: 
558: function PricingTab() {
559:   const [rooms, setRooms] = useState([]);
560:   const [isSaved, setIsSaved] = useState(false);
561: 
562:   useEffect(() => {
563:     fetch(`${API_CONFIG_URL}/api_rooms.php`)
564:       .then(res => res.json())
565:       .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setRooms(data.data); })
566:       .catch(e => console.error("JSON Error in Pricing:", e));
567:   }, []);
568: 
569:   const handleSave = () => {
570:     Promise.all(rooms.map(room => 
571:       fetch(`${API_CONFIG_URL}/api_rooms.php`, {
572:         method: 'PUT',
573:         headers: { 'Content-Type': 'application/json' },
574:         body: JSON.stringify({ 
575:           id: room.id, 
576:           price: room.price,
577:           original_price: room.original_price
578:         })
579:       })
580:     )).then(() => {
581:       fetch(`${API_CONFIG_URL}/api_rooms.php`)
582:         .then(res => res.json())
583:         .then(data => {
584:           if(data && data.status === 'success' && Array.isArray(data.data)) {
585:             setRooms(data.data);
586:           }
587:           setIsSaved(true); 
588:           setTimeout(() => setIsSaved(false), 2000);
589:         });
590:     }).catch(e => console.error("Error saving pricing:", e));
591:   };
592: 
593:   const handleDiscountChange = (idx, discountPercent) => {
594:     const newRooms = [...rooms];
595:     const room = newRooms[idx];
596:     const orig = parseFloat(room.original_price) || 0;
597:     const dp = parseFloat(discountPercent) || 0;
598:     if(orig > 0) {
599:        room.price = (orig - (orig * (dp / 100))).toFixed(0);
600:     }
601:     setRooms(newRooms);
602:   };
603: 
604:   return (
605:     <div className="admin-fade-in">
606:       <PageHeader title="Pricing & Taxes" subtitle="Manage room rates, discounts, and global GST settings." action={<button className="admin-btn-primary" onClick={handleSave} style={{transition: 'all 0.3s'}}>{isSaved ? 'Saved Successfully!' : 'Save Changes'}</button>} />
607:       <div className="admin-pricing-grid">
608:         {rooms.map((room, idx) => {
609:            const orig = parseFloat(room.original_price) || 0;
610:            const curr = parseFloat(room.price) || 0;
611:            let discount = 0;
612:            if(orig > 0 && orig > curr) {
613:                discount = (((orig - curr) / orig) * 100).toFixed(1);
614:            }
615:            return (
616:           <div className="admin-card hover-lift" key={room.id} style={{display: 'flex', overflow: 'hidden', padding: 0}}>
617:             <div style={{width: '140px', flexShrink: 0}} className="admin-pricing-img-wrapper"><img src={room.image_url || room1} alt={room.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
618:             <div style={{padding: '24px', flex: 1}}>
619:               <h2 className="admin-card-title" style={{marginBottom: '16px', fontSize: '16px'}}>{room.name}</h2>
620:               <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
621:                 <div className="admin-form-group" style={{marginBottom: 0, flex: 1}}>
622:                   <label className="admin-form-label">Original Price (₹)</label>
623:                   <div className="admin-price-input-wrapper"><span className="admin-price-symbol">₹</span><input type="number" className="admin-form-input" value={room.original_price || 0} onChange={(e) => { const newRooms = [...rooms]; newRooms[idx].original_price = e.target.value; setRooms(newRooms); }} /></div>
624:                 </div>
625:                 <div className="admin-form-group" style={{marginBottom: 0, flex: 1}}>
626:                   <label className="admin-form-label">Selling Price (₹)</label>
627:                   <div className="admin-price-input-wrapper"><span className="admin-price-symbol">₹</span><input type="number" className="admin-form-input" value={room.price || 0} onChange={(e) => { const newRooms = [...rooms]; newRooms[idx].price = e.target.value; setRooms(newRooms); }} /></div>
628:                 </div>
629:                 <div className="admin-form-group" style={{marginBottom: 0, flex: 1}}>
630:                   <label className="admin-form-label">Discount (%)</label>
631:                   <div className="admin-price-input-wrapper"><input type="number" className="admin-form-input" value={discount} onChange={(e) => handleDiscountChange(idx, e.target.value)} /><span className="admin-price-symbol" style={{left: 'auto', right: '12px'}}>%</span></div>
632:                 </div>
633:               </div>
634:             </div>
635:           </div>
636:         )})}
637:       </div>
638:     </div>
639:   );
640: }
641: 
642: function CafeFeaturedTab() {
643:   const [items, setItems] = useState([]);
644:   
645:   useEffect(() => {
646:     fetch(`${API_CONFIG_URL}/api_cafe.php`)
647:       .then(res => res.json())
648:       .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setItems(data.data.filter(i => i.is_featured == 1)); })
649:       .catch(e => console.error("JSON Error in CafeFeatured:", e));
650:   }, []);
651: 
652:   const unfeatureItem = (id) => {
653:     fetch(`${API_CONFIG_URL}/api_cafe.php`, {
654:       method: 'PUT',
655:       headers: { 'Content-Type': 'application/json' },
656:       body: JSON.stringify({ item_id: id, is_featured: 0 })
657:     })
658:     .then(res => res.json())
659:     .then(data => {
660:       if(data && data.status === 'success') {
661:         setItems(items.filter(i => i.item_id !== id));
662:       }
663:     });
664:   };
665: 
666:   return (
667:     <>
668:       <PageHeader title="Featured Menu Items" subtitle="Manage the featured items shown on the Cafe page. Go to Full Menu to edit these items or add new ones." />
669:       <div className="admin-item-grid">
670:         {items.map(item => (
671:           <div key={item.item_id} className="admin-item-card">
672:             <img src={item.image_url || cafe1} alt={item.title} className="admin-item-img" />
673:             <div className="admin-item-content">
674:               <div className="admin-item-header"><h3 className="admin-item-title">{item.title}</h3><span className="admin-badge badge-success">₹{item.price}</span></div>
675:               <div className="admin-item-meta">
676:                 <span className={item.is_veg == 1 ? 'admin-text-veg' : 'admin-text-nonveg'}>{item.is_veg == 1 ? 'Veg' : 'Non-Veg'}</span>
677:                 <span className="admin-cell-muted">Original: ₹{item.original_price || item.price}</span>
678:                 <span className="admin-item-tag"><span className="admin-badge badge-primary">{item.tag || 'Featured'}</span></span>
679:               </div>
680:               <div className="admin-item-actions"><button className="admin-btn-outline admin-btn-danger admin-btn-full" onClick={() => unfeatureItem(item.item_id)}>Remove from Featured</button></div>
681:             </div>
682:           </div>
683:         ))}
684:       </div>
685:     </>
686:   );
687: }
688: 
689: function CafeMenuTab() {
690:   const [activeCategory, setActiveCategory] = useState('Breakfast');
691:   const [allItems, setAllItems] = useState([]);
692:   const [editingItem, setEditingItem] = useState(null);
693:   const categories = ['Breakfast', 'Main Course', 'Healthy', 'Beverages', 'Desserts', 'All Day Snacks', 'Rice & Roti', 'Add Ons', 'Teas', 'Beverages & Soups'];
694: 
695:   useEffect(() => {
696:     fetch(`${API_CONFIG_URL}/api_cafe.php`)
697:       .then(res => res.json())
698:       .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setAllItems(data.data); })
699:       .catch(e => console.error("JSON Error in CafeMenu:", e));
700:   }, []);
701: 
702:   const filteredItems = allItems.filter(i => i.category === activeCategory);
703: 
704:   const handleImageUpload = async (e) => {
705:     const file = e.target.files[0];
706:     if (!file) return;
707:     const formData = new FormData();
708:     formData.append('action', 'upload');
709:     formData.append('image', file);
710:     try {
711:       const res = await fetch(`${API_CONFIG_URL}/api_rooms.php`, {
712:         method: 'POST',
713:         body: formData
714:       });
715:       const data = await res.json();
716:       if (data.status === 'success') {
717:         setEditingItem({...editingItem, image_url: data.image_url});
718:       }
719:     } catch (err) {
720:       console.error(err);
721:     }
722:   };
723: 
724:   const saveItem = () => {
725:     const isNew = !editingItem.item_id;
726:     const method = isNew ? 'POST' : 'PUT';
727:     
728:     fetch(`${API_CONFIG_URL}/api_cafe.php`, {
729:       method: method,
730:       headers: { 'Content-Type': 'application/json' },
731:       body: JSON.stringify({
732:         item_id: editingItem.item_id,
733:         title: editingItem.title || '',
734:         description: editingItem.description || '',
735:         price: editingItem.price || 0,
736:         original_price: editingItem.original_price || 0,
737:         category: editingItem.category || activeCategory,
738:         is_veg: editingItem.is_veg !== undefined ? editingItem.is_veg : 1,
739:         is_featured: editingItem.is_featured !== undefined ? editingItem.is_featured : 0,
740:         tag: editingItem.tag || '',
741:         status: editingItem.status || 'Available',
742:         image_url: editingItem.image_url || ''
743:       })
744:     })
745:     .then(res => res.json())
746:     .then(data => {
747:       if(data && data.status === 'success') {
748:         fetch(`${API_CONFIG_URL}/api_cafe.php`)
749:           .then(res => res.json())
750:           .then(refetchData => {
751:             if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data)) {
752:               setAllItems(refetchData.data);
753:             }
754:             setEditingItem(null);
755:           });
756:       }
757:     }).catch(e => console.error(e));
758:   };
759: 
760:   const deleteItem = (id) => {
761:     if(!window.confirm("Are you sure you want to delete this menu item?")) return;
762:     fetch(`${API_CONFIG_URL}/api_cafe.php`, {
763:       method: 'DELETE',
764:       headers: { 'Content-Type': 'application/json' },
765:       body: JSON.stringify({ item_id: id })
766:     })
767:     .then(res => res.json())
768:     .then(data => {
769:       if(data && data.status === 'success') {
770:         setAllItems(allItems.filter(i => i.item_id !== id));
771:       }
772:     });
773:   };
774:   
775:   const handleDiscountChange = (discountPercent) => {
776:      const orig = parseFloat(editingItem.original_price) || 0;
777:      const dp = parseFloat(discountPercent) || 0;
778:      if(orig > 0) {
779:         setEditingItem({...editingItem, price: (orig - (orig * (dp / 100))).toFixed(0)});
780:      }
781:   };
782: 
783:   return (
784:     <>
785:       <PageHeader title="Full Menu Categories" subtitle="Manage all menu items." action={<button className="admin-btn-primary" onClick={() => setEditingItem({category: activeCategory, is_veg: 1, is_featured: 0})}><PlusSignIcon size={18} /> Add Menu Item</button>} />
786:       <div className="admin-card">
787:         <div className="admin-filter-bar" style={{flexWrap: 'wrap', gap: '8px', padding: '16px'}}>
788:           {categories.map(cat => (<button key={cat} className={`admin-filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>))}
789:         </div>
790:         <div className="admin-table-wrapper">
791:           <table className="admin-table">
792:             <thead><tr><th>Image</th><th>Item Name</th><th>Pricing</th><th>Diet & Status</th><th>Featured</th><th>Actions</th></tr></thead>
793:             <tbody>
794:               {filteredItems.map((item, idx) => (
795:                 <tr key={idx}>
796:                   <td><img src={item.image_url || cafe1} alt="" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} /></td>
797:                   <td>
798:                     <div className="admin-text-medium">{item.title}</div>
799:                     <div className="admin-cell-muted" style={{fontSize: '12px', maxWidth: '2
<truncated 323 bytes>

NOTE: The output was truncated because it was too long. Use a more targeted query or a smaller range to get the information you need.