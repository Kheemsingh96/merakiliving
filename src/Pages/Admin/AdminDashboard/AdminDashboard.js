import React, { useState, useEffect, useCallback, useRef } from 'react';
import './AdminDashboard.css';
import logo from '../../../assets/images/logo.avif';
import {
  DashboardSquare01Icon, Calendar01Icon, BedDoubleIcon, UserGroupIcon,
  Wallet01Icon, Ticket01Icon, Image01Icon, Settings01Icon, Logout01Icon, PlusSignIcon,
  Edit01Icon, Delete01Icon, File02Icon, StarIcon, Doc01Icon, Menu01Icon, Cancel01Icon, Download02Icon,
  Message01Icon, Home01Icon, EyeIcon, ArrowLeft01Icon, ArrowRight01Icon, Mail01Icon
} from 'hugeicons-react';
import { API_CONFIG_URL } from '../../../config/api';
import { safeParseResponse } from '../../../utils/apiHelper';
import {
  areDateRangesOverlapping,
  isBookingActive,
  extractBookingRoomId,
  normalizeRoomId,
  normalizeDateToMidnight,
  checkRoomConflict,
  getAllMergedBookings,
  isRemovedOfflineGuest,
  markBookingAsCancelled
} from '../../../utils/dateAvailability';
import room1 from '../../../assets/images/room-1.avif';
import room2 from '../../../assets/images/room-2.avif';
import room3 from '../../../assets/images/room-3.avif';
import room4 from '../../../assets/images/room-4.avif';
import founder from '../../../assets/images/founder.avif';
import OptimizedImage from '../../../components/Common/OptimizedImage';
import { ROOMS_DATA } from '../../../components/Rooms/Rooms';

const getRoomImage = (id) => {
  const numId = Number(id);
  if (numId === 1 || id === 'Himalayan View Room') return room1;
  if (numId === 2 || id === 'Premium Valley Room') return room2;
  if (numId === 3 || id === 'Luxury Family Suite') return room3;
  if (numId === 4 || id === 'Entire Homestay') return room4;
  return room1;
};

const getRoomTitle = (id) => {
  const numId = Number(id);
  if (numId === 1) return 'Himalayan View Room';
  if (numId === 2) return 'Premium Valley Room';
  if (numId === 3) return 'Luxury Family Suite';
  if (numId === 4) return 'Entire Homestay';
  return id || 'Room';
};

const formatDateNumeric = (dateStr) => {
  if (!dateStr) return '—';
  
  if (dateStr instanceof Date) {
    if (isNaN(dateStr.getTime())) return '—';
    const d = String(dateStr.getDate()).padStart(2, '0');
    const m = String(dateStr.getMonth() + 1).padStart(2, '0');
    const y = dateStr.getFullYear();
    return `${d}/${m}/${y}`;
  }

  if (typeof dateStr === 'number') {
    const timestamp = dateStr > 1e11 ? dateStr : dateStr * 1000;
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return '—';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  if (typeof dateStr === 'string') {
    const cleanStr = dateStr.trim();
    if (!cleanStr || cleanStr === 'N/A' || cleanStr === '—' || cleanStr === 'null' || cleanStr === 'undefined') return '—';

    // Matches YYYY-MM-DD or YYYY/MM/DD (with optional time)
    const ymdMatch = cleanStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (ymdMatch) {
      const y = ymdMatch[1];
      const m = ymdMatch[2].padStart(2, '0');
      const d = ymdMatch[3].padStart(2, '0');
      return `${d}/${m}/${y}`;
    }

    // Matches DD-MM-YYYY or DD/MM/YYYY (with optional time)
    const dmyMatch = cleanStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmyMatch) {
      const d = dmyMatch[1].padStart(2, '0');
      const m = dmyMatch[2].padStart(2, '0');
      const y = dmyMatch[3];
      return `${d}/${m}/${y}`;
    }

    // Matches DD Mon YYYY or DD Month YYYY (e.g. "13 Sep 2026")
    const monMatch = cleanStr.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (monMatch) {
      const d = monMatch[1].padStart(2, '0');
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const mIndex = monthNames.findIndex(mn => monMatch[2].toLowerCase().startsWith(mn));
      if (mIndex !== -1) {
        const m = String(mIndex + 1).padStart(2, '0');
        const y = monMatch[3];
        return `${d}/${m}/${y}`;
      }
    }
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatBookingTime = (dateStr) => {
  if (!dateStr) return '';
  
  if (dateStr instanceof Date) {
    if (isNaN(dateStr.getTime())) return '';
    let h = dateStr.getHours();
    const m = String(dateStr.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  }

  if (typeof dateStr === 'number') {
    const timestamp = dateStr > 1e11 ? dateStr : dateStr * 1000;
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return '';
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  }

  if (typeof dateStr === 'string') {
    const cleanStr = dateStr.trim();
    if (!cleanStr || cleanStr === 'N/A' || cleanStr === '—' || cleanStr === 'null' || cleanStr === 'undefined') return '';

    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(cleanStr) || /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(cleanStr)) {
      return '';
    }

    const timeMatch = cleanStr.match(/(?:[ T]|^)(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm|AM|PM)?/);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2].padStart(2, '0');
      const ampmModifier = timeMatch[4] ? timeMatch[4].toUpperCase() : null;

      if (!isNaN(h) && h >= 0 && h <= 23) {
        if (ampmModifier) {
          if (ampmModifier === 'PM' && h < 12) h += 12;
          if (ampmModifier === 'AM' && h === 12) h = 0;
        }
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${String(displayH).padStart(2, '0')}:${m} ${ampm}`;
      }
    }

    if (cleanStr.includes('T') || cleanStr.includes('Z')) {
      const d = new Date(cleanStr);
      if (!isNaN(d.getTime())) {
        let h = d.getHours();
        const m = String(d.getMinutes()).padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
      }
    }
  }

  return '';
};

const getStatusBadge = (status) => {
  const s = (status || 'Pending').toLowerCase().trim();
  if (s === 'confirmed' || s === 'completed' || s === 'success' || s === 'active') {
    return <span className="admin-badge badge-success">{status || 'Confirmed'}</span>;
  }
  if (s === 'pending') {
    return <span className="admin-badge badge-warning">Pending</span>;
  }
  if (s.includes('cancel') || s === 'failed' || s === 'inactive') {
    return <span className="admin-badge badge-danger">{status || 'Cancelled'}</span>;
  }
  if (s === 'refunded') {
    return <span className="admin-badge badge-info">Refunded</span>;
  }
  return <span className="admin-badge badge-info">{status || 'Pending'}</span>;
};



const computeLiveRoomStatuses = (roomStatusesList, allBookings) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const activeBookings = (Array.isArray(allBookings) ? allBookings : []).filter(b => isBookingActive(b) && !isRemovedOfflineGuest(b));
  const conflictingToday = activeBookings.filter(b => {
    const bIn = b.check_in || b.checkIn || b.check_in_date || b.start_date;
    const bOut = b.check_out || b.checkOut || b.check_out_date || b.end_date;
    if (!bIn || !bOut) return false;
    return areDateRangesOverlapping(today, tomorrow, bIn, bOut);
  });

  const isRoom1 = conflictingToday.some(b => extractBookingRoomId(b) === 1);
  const isRoom2 = conflictingToday.some(b => extractBookingRoomId(b) === 2);
  const isRoom3 = conflictingToday.some(b => extractBookingRoomId(b) === 3);
  const isRoom4 = conflictingToday.some(b => extractBookingRoomId(b) === 4);

  return (roomStatusesList || []).map(r => {
    const rId = Number(r.id);
    let status = 'Available';

    if (rId === 4) {
      if (isRoom4) status = 'Booked';
      else if (isRoom1 || isRoom2 || isRoom3) status = 'Not Available';
      else status = 'Available';
    } else if (rId === 1) {
      if (isRoom1) status = 'Booked';
      else if (isRoom4) status = 'Not Available';
      else status = 'Available';
    } else if (rId === 2) {
      if (isRoom2) status = 'Booked';
      else if (isRoom4) status = 'Not Available';
      else status = 'Available';
    } else if (rId === 3) {
      if (isRoom3) status = 'Booked';
      else if (isRoom4) status = 'Not Available';
      else status = 'Available';
    } else {
      const isBooked = conflictingToday.some(b => extractBookingRoomId(b) === rId);
      status = isBooked ? 'Booked' : 'Available';
    }

    const bg = status === 'Available' ? '#f0fdf4' : '#fef2f2';
    const color = status === 'Available' ? '#16a34a' : '#dc2626';

    return {
      ...r,
      status,
      bg,
      color
    };
  });
};

export default function AdminDashboard({ setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.removeItem('meraki_offline_bookings');
      localStorage.removeItem('meraki_offline_bookings');

      // Purge any stored keys if they contain removed offline or Pankaj Gupta data
      ['meraki_latest_booking', 'meraki_booking', 'meraki_confirmed_booking', 'meraki_admin_bookings'].forEach(key => {
        [sessionStorage, localStorage].forEach(store => {
          try {
            const raw = store.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (isRemovedOfflineGuest(parsed)) {
                store.removeItem(key);
              }
            }
          } catch (e) {}
        });
      });
    } catch (e) {}
  }, []);

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

    { id: 'guests', label: 'Guests', icon: UserGroupIcon },
    { id: 'payments', label: 'Payments', icon: Wallet01Icon },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Ticket01Icon },
    {
      id: 'chatbot', label: 'Chatbot', icon: Message01Icon,
      subItems: [
        { id: 'chatbot-guests', label: 'Guest Details' },
        { id: 'chatbot-conversations', label: 'Conversations' },
        { id: 'chatbot-refunds', label: 'Refund Requests' }
      ]
    },
    {
      id: 'website', label: 'Website Content', icon: File02Icon,
      subItems: [{ id: 'gallery', label: 'Gallery Manager', icon: Image01Icon }, { id: 'reviews', label: 'Reviews', icon: StarIcon }, { id: 'policies', label: 'Legal Policies', icon: Doc01Icon }]
    },
    {
      id: 'own-a-villa', label: 'Enquiries', icon: Home01Icon,
      subItems: [{ id: 'own-a-villa', label: 'Own A Villa' }, { id: 'contact-us', label: 'Contact Us' }]
    },
    { id: 'settings', label: 'Settings', icon: Settings01Icon }
  ];

  const handleNavClick = (id, subId = '') => {
    setActiveTab(id);
    setSubTab(subId);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') return <DashboardTab setActiveTab={setActiveTab} setSubTab={setSubTab} />;
    if (activeTab === 'bookings' && subTab === 'all-bookings') return <BookingsTab />;
    if (activeTab === 'bookings' && subTab === 'calendar') return <CalendarTab />;
    if (activeTab === 'rooms' && subTab === 'manage-rooms') return <ManageRoomsTab />;

    if (activeTab === 'guests') return <GuestsTab />;
    if (activeTab === 'payments') return <PaymentsTab />;
    if (activeTab === 'coupons') return <CouponsTab />;
    if (activeTab === 'chatbot' && (subTab === 'chatbot-guests' || !subTab)) return <AdminChatbotGuestsTab />;
    if (activeTab === 'chatbot' && subTab === 'chatbot-conversations') return <AdminChatbotConversationsTab />;
    if (activeTab === 'chatbot' && subTab === 'chatbot-refunds') return <AdminChatbotRefundsTab />;
    if (activeTab === 'website' && subTab === 'gallery') return <GalleryTab />;
    if (activeTab === 'website' && subTab === 'reviews') return <ReviewsTab />;
    if (activeTab === 'website' && subTab === 'policies') return <PoliciesTab />;
    if (activeTab === 'own-a-villa') return <OwnAVillaTab subTab={subTab} />;
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
          <OptimizedImage src={logo} alt="Meraki Living" className="admin-sidebar-logo" loading="eager" fetchPriority="high" decoding="async" noWrapper={true} />
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
            <OptimizedImage src={founder} alt="Admin" className="admin-sidebar-footer-profile-img" style={{objectFit:"cover", width: '40px', height: '40px', borderRadius: '50%'}} loading="eager" width={40} height={40} decoding="async" noWrapper={true} />
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

function RoomAvailabilityCalendarModal({ room, onClose, onDataChanged }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Selection state
  const [rangeStart, setRangeStart] = useState(null); // Date obj at midnight
  const [rangeEnd, setRangeEnd] = useState(null);     // Date obj at midnight

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setActionError('');
    try {
      const res = await fetch(`${API_CONFIG_URL}/api_bookings.php`);
      const parsed = await safeParseResponse(res);
      const raw = (parsed.ok && parsed.data && parsed.data.status === 'success' && Array.isArray(parsed.data.data))
        ? parsed.data.data
        : [];
      const merged = getAllMergedBookings(raw).filter(b => isBookingActive(b) && !isRemovedOfflineGuest(b));
      setBookings(merged);
    } catch (err) {
      setActionError('Unable to load bookings from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Calendar info
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Previous month trailing days
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = Array.from({ length: firstDayIndex }).map((_, i) => {
    return daysInPrevMonth - firstDayIndex + 1 + i;
  });

  // Next month leading days to complete the row
  const totalDaysRendered = firstDayIndex + daysInMonth;
  const remainingCells = (7 - (totalDaysRendered % 7)) % 7;
  const nextMonthDays = Array.from({ length: remainingCells }).map((_, i) => i + 1);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setActionError('');
    setActionSuccess('');
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setActionError('');
    setActionSuccess('');
  };
  const jumpToday = () => {
    setCurrentDate(new Date());
    setActionError('');
    setActionSuccess('');
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Format Helpers
  const formatYMD = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatDisplay = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Day status calculator
  const getDayDetails = (day) => {
    const dayStart = new Date(year, month, day);
    dayStart.setHours(0, 0, 0, 0);
    const dayMs = dayStart.getTime();
    const isPast = dayMs < todayMs;

    const dayEnd = new Date(year, month, day + 1);
    dayEnd.setHours(0, 0, 0, 0);

    if (isPast) {
      return {
        dayStart,
        dayEnd,
        isPast: true,
        status: 'Past',
        hasConflict: false,
        isDirectBooking: false,
        bookings: []
      };
    }

    const conflictResult = checkRoomConflict(room.id, dayStart, dayEnd, bookings);
    const hasConflict = conflictResult.hasConflict;
    const conflictingBookings = conflictResult.conflictingBookings || [];

    const isDirectBooking = conflictingBookings.some(b => extractBookingRoomId(b) === normalizeRoomId(room.id));

    let status = 'Available';
    if (hasConflict) {
      status = isDirectBooking ? 'Booked' : 'Blocked';
    }

    return {
      dayStart,
      dayEnd,
      isPast: false,
      status,
      hasConflict,
      isDirectBooking,
      bookings: conflictingBookings
    };
  };

  // Date click handler (Check-in -> Check-out)
  const handleDateClick = (day) => {
    const { dayStart, dayEnd, isPast, status, bookings: dayBookings } = getDayDetails(day);
    if (isPast) return;

    setActionError('');
    setActionSuccess('');

    // If day is booked / blocked and user clicks it directly:
    if (status !== 'Available' && dayBookings.length > 0) {
      const b = dayBookings[0];
      const bIn = normalizeDateToMidnight(b.check_in || b.checkIn || b.start_date || b.check_in_date);
      const bOut = normalizeDateToMidnight(b.check_out || b.checkOut || b.end_date || b.check_out_date);
      setRangeStart(bIn ? new Date(bIn) : dayStart);
      setRangeEnd(bOut ? new Date(bOut) : dayEnd);
      return;
    }

    // Available day clicked:
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dayStart);
      setRangeEnd(null);
    } else {
      // rangeStart is set, rangeEnd is null
      if (dayStart.getTime() > rangeStart.getTime()) {
        setRangeEnd(dayStart);
      } else if (dayStart.getTime() === rangeStart.getTime()) {
        // Same day click -> 1-night stay
        setRangeEnd(dayEnd);
      } else {
        // Clicked before rangeStart -> make this the new check-in
        setRangeStart(dayStart);
        setRangeEnd(null);
      }
    }
  };

  // Day selection classes
  const getDaySelectionType = (day) => {
    const d = new Date(year, month, day).getTime();
    if (!rangeStart) return null;
    const startMs = rangeStart.getTime();

    if (!rangeEnd) {
      return d === startMs ? 'selected check-in' : null;
    }

    const endMs = rangeEnd.getTime();
    if (d === startMs) return 'selected check-in';
    if (d === endMs) return 'selected check-out';
    if (d > startMs && d < endMs) return 'selected in-range';
    return null;
  };

  const isToday = (day) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const selectedNights = (rangeStart && rangeEnd)
    ? Math.max(1, Math.round((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)))
    : (rangeStart ? 1 : 0);

  // Action: Mark as Booked
  const handleMarkAsBooked = async () => {
    if (!rangeStart) {
      setActionError('Please select Check-in and Check-out dates on the calendar.');
      return;
    }
    const finalStart = rangeStart;
    const finalEnd = rangeEnd || new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + 1);

    if (finalStart.getTime() < todayMs) {
      setActionError('Cannot book past dates. Please select current or future dates.');
      return;
    }

    const conflictCheck = checkRoomConflict(room.id, finalStart, finalEnd, bookings);
    if (conflictCheck.hasConflict) {
      setActionError('Selected date range overlaps an existing active booking. Please select available dates.');
      return;
    }

    setSubmitting(true);
    setActionError('');
    setActionSuccess('');

    try {
      const checkInStr = formatYMD(finalStart);
      const checkOutStr = formatYMD(finalEnd);
      const numericPrice = typeof room.price === 'number'
        ? room.price
        : parseInt(String(room.price || '3500').replace(/\D/g, ''), 10) || 3500;
      const totalAmount = numericPrice * selectedNights;

      const payload = {
        room_id: Number(room.id),
        guest_name: 'Admin Block',
        guest_email: 'admin@merakiliving.com',
        guest_phone: '9456103445',
        check_in: checkInStr,
        check_out: checkOutStr,
        guest_count: Number(room.id) === 4 ? 10 : 2,
        status: 'Confirmed',
        room_price: totalAmount,
        paid_amount: totalAmount,
        payment_status: 'Paid',
        source: 'Direct / Admin'
      };

      const res = await fetch(`${API_CONFIG_URL}/api_bookings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const parsed = await safeParseResponse(res);
      if (parsed.ok && parsed.data && (parsed.data.status === 'success' || parsed.data.id || parsed.status === 200)) {
        setActionSuccess(`Room marked as Booked for ${formatDisplay(finalStart)} → ${formatDisplay(finalEnd)}.`);
        setRangeStart(null);
        setRangeEnd(null);
        window.dispatchEvent(new Event('meraki_booking_updated'));
        window.dispatchEvent(new Event('meraki_rooms_updated'));
        await fetchBookings();
        if (onDataChanged) onDataChanged();
      } else {
        setActionError(parsed.error || parsed.data?.message || 'Error saving room booking to server.');
      }
    } catch (err) {
      setActionError('Network error while updating room availability.');
    } finally {
      setSubmitting(false);
    }
  };

  // Action: Mark as Available
  const handleMarkAsAvailable = async () => {
    if (!rangeStart) {
      setActionError('Please select Check-in and Check-out dates on the calendar.');
      return;
    }
    const finalStart = rangeStart;
    const finalEnd = rangeEnd || new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + 1);

    // Find all active bookings overlapping with [finalStart, finalEnd) for this room
    const conflictResult = checkRoomConflict(room.id, finalStart, finalEnd, bookings);
    const conflicting = conflictResult.conflictingBookings || [];

    // Filter direct bookings for this room
    const directBookings = conflicting.filter(b => extractBookingRoomId(b) === normalizeRoomId(room.id));

    if (directBookings.length === 0) {
      if (conflicting.length > 0) {
        setActionError('These dates are blocked due to conflict with Entire Homestay. Please manage Entire Homestay to modify.');
      } else {
        setActionSuccess('Selected dates are already Available.');
      }
      return;
    }

    setSubmitting(true);
    setActionError('');
    setActionSuccess('');

    try {
      // Cancel each direct booking covering this date range
      for (const b of directBookings) {
        markBookingAsCancelled(b);
        await fetch(`${API_CONFIG_URL}/api_bookings.php`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: b.id })
        }).then(safeParseResponse).catch(() => {});
      }

      setActionSuccess(`Selected dates (${formatDisplay(finalStart)} → ${formatDisplay(finalEnd)}) marked as Available!`);
      setRangeStart(null);
      setRangeEnd(null);
      window.dispatchEvent(new Event('meraki_booking_updated'));
      window.dispatchEvent(new Event('meraki_rooms_updated'));
      await fetchBookings();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      setActionError('Error releasing room booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay admin-fade-in" style={{ zIndex: 9999 }} onClick={onClose}>
      <div 
        className="admin-room-calendar-modal-content" 
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-modal-title"
      >
        {/* Header */}
        <div className="admin-room-calendar-header">
          <div className="admin-room-calendar-header-info">
            <OptimizedImage 
              src={room.image_url || getRoomImage(room.id)} 
              alt={room.name} 
              className="admin-room-calendar-thumb" 
              loading="eager" 
              width={44}
              height={44}
              decoding="async" 
              noWrapper={true} 
            />
            <div style={{minWidth: 0}}>
              <h2 id="calendar-modal-title" className="admin-room-calendar-title">{room.name}</h2>
              <div className="admin-room-calendar-meta">
                <span>{room.price} / night</span>
                <span className="admin-room-calendar-dot">•</span>
                <span>Today: <strong className="admin-cal-header-status-text" style={{ color: room.status === 'Booked' ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                  {room.status === 'Booked' ? 'Booked' : 'Available'}
                </strong></span>
              </div>
            </div>
          </div>
          <button 
            type="button" 
            className="admin-modal-close-btn" 
            onClick={onClose} 
            aria-label="Close modal"
          >
            <Cancel01Icon size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body Container */}
        <div className="admin-room-calendar-body">
          {/* Navigation Bar */}
          <div className="admin-room-calendar-nav">
            <button type="button" className="admin-cal-nav-btn" onClick={prevMonth} title="Previous Month" aria-label="Previous Month">
              <ArrowLeft01Icon size={20} strokeWidth={2} />
            </button>
            <div className="admin-cal-month-title">
              <Calendar01Icon size={18} strokeWidth={1.5} style={{ color: '#8A158F' }} />
              <span>{monthName}</span>
            </div>
            <div className="admin-cal-nav-actions">
              <button type="button" className="admin-cal-today-btn" onClick={jumpToday}>
                Today
              </button>
              <button type="button" className="admin-cal-nav-btn" onClick={nextMonth} title="Next Month" aria-label="Next Month">
                <ArrowRight01Icon size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="admin-room-calendar-grid-wrap">
            <div className="admin-room-calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="admin-room-calendar-day-header">{d}</div>
              ))}
              {prevMonthDays.map((d, i) => (
                <div key={`prev-${i}`} className="admin-room-calendar-day-cell other-month disabled">
                  <span className="admin-cal-date-number">{d}</span>
                  <span className="admin-cal-status-pill past">—</span>
                </div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const { isPast, status, bookings: dayBookings } = getDayDetails(dayNum);
                const selectionType = getDaySelectionType(dayNum);
                const isTodayDay = isToday(dayNum);

                let cellClass = 'admin-room-calendar-day-cell';
                if (isPast) {
                  cellClass += ' past disabled';
                } else {
                  cellClass += ` ${status.toLowerCase()}`;
                }
                if (selectionType) cellClass += ` ${selectionType}`;
                if (isTodayDay) cellClass += ' today';

                let tooltip = isPast ? `${dayNum} ${monthName}: Past Date` : `${dayNum} ${monthName}: ${status}`;
                if (!isPast && dayBookings.length > 0) {
                  const b = dayBookings[0];
                  const bRef = b.booking_reference || `MERI${String(b.id).padStart(4, '0')}`;
                  tooltip += ` (#${bRef})`;
                }

                return (
                  <button
                    key={dayNum}
                    type="button"
                    className={cellClass}
                    onClick={() => handleDateClick(dayNum)}
                    disabled={isPast}
                    title={tooltip}
                  >
                    <span className="admin-cal-date-number">{dayNum}</span>
                    {!isPast ? (
                      <span className={`admin-cal-status-pill ${status.toLowerCase()}`}>
                        {status === 'Booked' ? 'Booked' : status === 'Blocked' ? 'Blocked' : 'Available'}
                      </span>
                    ) : (
                      <span className="admin-cal-status-pill past">—</span>
                    )}
                  </button>
                );
              })}
              {nextMonthDays.map((d, i) => (
                <div key={`next-${i}`} className="admin-room-calendar-day-cell other-month disabled">
                  <span className="admin-cal-date-number">{d}</span>
                  <span className="admin-cal-status-pill past">—</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="admin-room-calendar-legend">
            <div className="admin-cal-legend-item">
              <span className="admin-cal-legend-dot available" />
              <span>Available</span>
            </div>
            <div className="admin-cal-legend-item">
              <span className="admin-cal-legend-dot booked" />
              <span>Booked</span>
            </div>
            <div className="admin-cal-legend-item">
              <span className="admin-cal-legend-dot blocked" />
              <span>Blocked (Conflict)</span>
            </div>
            <div className="admin-cal-legend-item">
              <span className="admin-cal-legend-dot selected" />
              <span>Selected Range</span>
            </div>
          </div>

          {/* Action Control Panel: Pure Available / Booked Controls */}
          <div className="admin-room-calendar-action-panel">
            <div className="admin-cal-selection-bar">
              <div className="admin-cal-selection-info">
                {rangeStart ? (
                  <>
                    <span className="admin-cal-selection-label">Selected Range</span>
                    <h4 className="admin-cal-selection-dates">
                      <span>{formatDisplay(rangeStart)}</span>
                      {rangeEnd && (
                        <>
                          <ArrowRight01Icon size={16} strokeWidth={2.2} className="admin-cal-range-arrow" />
                          <span>{formatDisplay(rangeEnd)}</span>
                        </>
                      )}
                      <span className="admin-cal-nights-text">({selectedNights} {selectedNights === 1 ? 'night' : 'nights'})</span>
                    </h4>
                  </>
                ) : (
                  <p className="admin-cal-selection-placeholder">
                    Select <strong>Check-in</strong> and <strong>Check-out</strong> dates above to manage room availability.
                  </p>
                )}
              </div>

              <div className="admin-cal-action-buttons">
                {rangeStart && (
                  <button
                    type="button"
                    className="admin-cal-btn-clear"
                    onClick={() => { setRangeStart(null); setRangeEnd(null); setActionError(''); setActionSuccess(''); }}
                    disabled={submitting || loading}
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  className="admin-cal-btn-available"
                  onClick={handleMarkAsAvailable}
                  disabled={!rangeStart || submitting || loading}
                  title="Mark selected dates as Available"
                >
                  {submitting ? 'Updating...' : 'Available'}
                </button>
                <button
                  type="button"
                  className="admin-cal-btn-booked"
                  onClick={handleMarkAsBooked}
                  disabled={!rangeStart || submitting || loading}
                  title="Mark selected dates as Booked"
                >
                  {submitting ? 'Updating...' : 'Booked'}
                </button>
              </div>
            </div>

            {/* Alerts */}
            {actionError && (
              <div className="admin-cal-alert error admin-fade-in" style={{ marginTop: '12px' }}>
                {actionError}
              </div>
            )}
            {actionSuccess && (
              <div className="admin-cal-alert success admin-fade-in" style={{ marginTop: '12px' }}>
                {actionSuccess}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="admin-room-calendar-footer">
          <button type="button" className="admin-room-calendar-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardTab({ setActiveTab, setSubTab }) {
  const [showDateDropdownTop, setShowDateDropdownTop] = useState(false);
  const [showDateDropdownChart, setShowDateDropdownChart] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [stats, setStats] = useState({ totalBookings: 0, totalGuests: 0, totalRevenue: '₹0', occupancyRate: '0%' });
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [calendarModalRoom, setCalendarModalRoom] = useState(null);
  const dashboardReqRef = useRef(0);

  const loadDashboardData = useCallback(() => {
    const currentReq = ++dashboardReqRef.current;
    Promise.all([
      fetch(`${API_CONFIG_URL}/api_dashboard_stats.php`).then(res => res.json()).catch(() => null),
      fetch(`${API_CONFIG_URL}/api_bookings.php`).then(res => res.json()).catch(() => ({ status: 'error', data: [] })),
      fetch(`${API_CONFIG_URL}/api_payments.php`).then(res => res.json()).catch(() => ({ status: 'error', data: [] })),
      fetch(`${API_CONFIG_URL}/api_guests.php`).then(res => res.json()).catch(() => ({ data: [] }))
    ]).then(([dashboardData, bookingsData, paymentsData, guestsData]) => {
      if (currentReq !== dashboardReqRef.current) return;
      let finalStats = { totalBookings: 0, totalGuests: 0, totalRevenue: '₹0', occupancyRate: '0%' };
      
      let fetchedPayments = [];
      if (paymentsData && paymentsData.status === 'success' && Array.isArray(paymentsData.data)) {
        fetchedPayments = paymentsData.data.filter(p => !isRemovedOfflineGuest(p.guest_name));
      }
      let fetchedGuests = [];
      if (guestsData && guestsData.status === 'success' && Array.isArray(guestsData.data)) {
        fetchedGuests = guestsData.data.filter(g => !isRemovedOfflineGuest(g.name));
      }
      
      let rawBookings = [];
      if (bookingsData && bookingsData.status === 'success' && Array.isArray(bookingsData.data)) {
        rawBookings = bookingsData.data.filter(b => !isRemovedOfflineGuest(b));
      }

      // Merge online bookings across API, sessionStorage, and localStorage
      const mergedAll = getAllMergedBookings(rawBookings).filter(b => !isRemovedOfflineGuest(b));

      const mappedBookings = mergedAll.map(b => {
        const payment = fetchedPayments.find(p => p.booking_id === b.id && (p.status === 'Success' || p.status === 'Completed')) ||
                        fetchedPayments.find(p => p.booking_id === b.id);
        const guest = fetchedGuests.find(g => g.id === b.guest_id);
        const bIn = b.check_in || b.checkIn || b.check_in_date || b.start_date || '';
        const bOut = b.check_out || b.checkOut || b.check_out_date || b.end_date || '';
        const timeCandidates = [
          b.time,
          b.booking_time,
          b.created_time,
          b.created_at,
          payment ? (payment.time || payment.created_at || payment.payment_date) : '',
          b.booking_date
        ].filter(Boolean);
        const rawBookingTimestamp = timeCandidates.find(t => typeof t === 'string' && (t.includes(':') || t.includes('T'))) || b.created_at || b.booking_date || '';
        const rawBookingDate = b.booking_date || b.created_at || (payment ? (payment.payment_date || payment.created_at || payment.date) : '') || '';

        return {
          ...b,
          guest_name: b.guest_name || b.name || (guest ? guest.name : (b.guest_id ? `Guest ${b.guest_id}` : 'Guest')),
          guest_email: b.guest_email || b.email || (guest ? guest.email : 'N/A'),
          guest_phone: b.guest_phone || b.phone || (guest ? guest.phone : 'N/A'),
          room_name: b.room_name || b.room || getRoomTitle(b.room_id || b.roomId),
          booking_date: rawBookingDate,
          created_at: rawBookingTimestamp || b.created_at,
          booking_time: b.booking_time || b.time || (payment ? payment.time : '') || rawBookingTimestamp,
          paid_amount: payment ? payment.amount : (b.room_price || b.paid_amount || 0),
          payment_status: payment ? payment.status : (b.payment_status || (b.status === 'Confirmed' || b.status === 'Completed' ? 'Paid' : b.status === 'Pending' ? 'Pending' : 'Unpaid')),
          payment_method: payment ? payment.payment_method : (b.payment_method || (b.paid_amount ? 'Online / UPI' : 'Pending')),
          transaction_id: payment ? (payment.razorpay_payment_id || payment.transaction_id || 'N/A') : (b.transaction_id || 'N/A'),
          check_in: bIn,
          check_out: bOut,
          room_id: extractBookingRoomId(b) || b.room_id || b.roomId || 1
        };
      });

      let initialRoomStatuses = [];
      if (dashboardData && Array.isArray(dashboardData.roomStatuses)) {
        initialRoomStatuses = dashboardData.roomStatuses;
      } else {
        initialRoomStatuses = [
          { id: 1, name: 'Himalayan View Room', price: '₹3,500', status: 'Available' },
          { id: 2, name: 'Premium Valley Room', price: '₹4,500', status: 'Available' },
          { id: 3, name: 'Luxury Family Suite', price: '₹6,000', status: 'Available' },
          { id: 4, name: 'Entire Homestay', price: '₹22,000', status: 'Available' }
        ];
      }

      // Compute date-based live room statuses for today
      const liveStatuses = computeLiveRoomStatuses(initialRoomStatuses, mappedBookings);
      setRoomStatuses(liveStatuses);

      const totalRooms = liveStatuses.length;
      const bookedRooms = liveStatuses.filter(r => r.status === 'Booked' || r.status === 'Not Available').length;
      if (totalRooms > 0) {
        finalStats.occupancyRate = Math.round((bookedRooms / totalRooms) * 100) + '%';
      }

      // Populate recent bookings dynamically from real sorted bookings
      const sortedRecent = [...mappedBookings]
        .filter(b => !isRemovedOfflineGuest(b))
        .sort((a, b) => {
          const timeA = new Date(a.created_at || a.booking_date || 0).getTime() || (Number(a.id) || 0);
          const timeB = new Date(b.created_at || b.booking_date || 0).getTime() || (Number(b.id) || 0);
          return timeB - timeA;
        });

      if (sortedRecent.length > 0) {
        setRecentBookings(sortedRecent.slice(0, 5));
      } else if (dashboardData && Array.isArray(dashboardData.recentBookings)) {
        setRecentBookings(dashboardData.recentBookings.filter(b => !isRemovedOfflineGuest(b)));
      } else {
        setRecentBookings([]);
      }

      finalStats.totalBookings = mappedBookings.length;
      const totalG = mappedBookings.reduce((sum, b) => sum + parseInt(b.guest_count || 1, 10), 0);
      finalStats.totalGuests = totalG;
      
      const totalRev = mappedBookings.reduce((sum, b) => {
        const payment = fetchedPayments.find(p => p.booking_id === b.id && (p.status === 'Success' || p.status === 'Completed'));
        let amount = payment ? parseFloat(payment.amount) : parseFloat(String(b.room_price || b.paid_amount || 0).replace(/,/g, ''));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      finalStats.totalRevenue = '₹' + totalRev.toLocaleString('en-IN');

      // Calculate chart data for the last 7 days
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const counts = [0, 0, 0, 0, 0, 0, 0];
      
      mappedBookings.forEach(b => {
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
      setStats(finalStats);
    }).catch(e => console.error("Dashboard/Bookings JSON Error:", e));
  }, []);

  useEffect(() => {
    loadDashboardData();

    const handleUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener('meraki_booking_updated', handleUpdate);
    window.addEventListener('meraki_rooms_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('meraki_booking_updated', handleUpdate);
      window.removeEventListener('meraki_rooms_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadDashboardData]);

  const handleRoomStatusClick = (room) => {
    setCalendarModalRoom(room);
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
        <div className="admin-card" style={{flex: '1.5', minWidth: 0}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Room Status Overview</h2>
            <span 
              style={{fontSize:'13px', color:'#8A158F', fontWeight:'600', cursor:'pointer'}}
              onClick={() => { if (setActiveTab) { setActiveTab('rooms'); if (setSubTab) setSubTab('manage-rooms'); } }}
            >
              Manage Rooms
            </span>
          </div>
          <div style={{padding: '24px'}}>
            {roomStatuses.map((r) => (
              <div key={r.id} className="admin-room-list-item hover-lift-subtle">
                <OptimizedImage src={r.image_url || getRoomImage(r.id)} alt={r.name} loading="eager" width={48} height={48} decoding="async" noWrapper={true} />
                <div className="admin-room-list-info">
                  <h4>{r.name}</h4><p>{r.price} / night</p>
                </div>
                <span 
                  className="admin-badge admin-status-toggle" 
                  style={{
                    background: r.bg || (r.status === 'Available' ? '#f0fdf4' : '#fef2f2'), 
                    color: r.color || (r.status === 'Available' ? '#16a34a' : '#dc2626'),
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }} 
                  onClick={() => handleRoomStatusClick(r)} 
                  title="Click to view calendar & manage availability by date"
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card" style={{flex: '1', minWidth: 0}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Bookings</h2>
            <span 
              style={{fontSize:'13px', color:'#8A158F', fontWeight:'600', cursor:'pointer'}}
              onClick={() => { if (setActiveTab) { setActiveTab('bookings'); if (setSubTab) setSubTab('all-bookings'); } }}
            >
              View All
            </span>
          </div>
          <div style={{padding: '24px'}}>
            {recentBookings.length === 0 ? (
              <div style={{textAlign: 'center', color: '#888', padding: '24px 0', fontSize: '13px'}}>No recent bookings found</div>
            ) : (
              recentBookings.map((b) => {
                const bTime = formatBookingTime(b.created_at || b.booking_time || b.time || b.booking_date);
                const roomName = b.room_name || b.room || getRoomTitle(b.room_id);
                const guestName = b.guest_name || b.name || 'Guest';
                const checkInFormatted = formatDateNumeric(b.check_in);
                const checkOutFormatted = formatDateNumeric(b.check_out);
                const statusBadgeClass = (b.status === 'Confirmed' || b.status === 'Success' || b.status === 'Completed') 
                  ? 'badge-success' 
                  : (b.status === 'Pending' ? 'badge-warning' : 'badge-danger');

                return (
                  <div key={b.id || `${guestName}-${b.check_in}`} className="recent-booking-item hover-lift-subtle">
                    <OptimizedImage 
                      src={b.room_image_url || getRoomImage(b.room_id || b.room || roomName)} 
                      alt={roomName} 
                      loading="eager" 
                      width={48} 
                      height={48} 
                      decoding="async" 
                      noWrapper={true} 
                    />
                    <div className="recent-booking-info">
                      <h4>{guestName}</h4>
                      <p>{roomName}</p>
                      <span className="recent-booking-details-line">
                        <span>{checkInFormatted} → {checkOutFormatted}</span>
                        {bTime && (
                          <span style={{color: '#8A158F', fontWeight: '600'}}>
                            • {bTime}
                          </span>
                        )}
                      </span>
                    </div>
                    <span 
                      className={`admin-badge ${statusBadgeClass}`} 
                      style={{
                        ...(b.status === 'Pending' ? {background:'#fff7ed', color:'#ea580c'} : {}),
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      {b.status || 'Confirmed'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {calendarModalRoom && (
        <RoomAvailabilityCalendarModal
          room={calendarModalRoom}
          onClose={() => setCalendarModalRoom(null)}
          onDataChanged={loadDashboardData}
        />
      )}
    </div>
  );
}

function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPageNum] = useState(1);
  const [editingBooking, setEditingBooking] = useState(null);
  const [viewingBooking, setViewingBooking] = useState(null);
  const bookingsReqRef = useRef(0);

  const ITEMS_PER_PAGE = 10;

  const fetchBookings = useCallback(() => {
    const currentReq = ++bookingsReqRef.current;
    Promise.all([
      fetch(`${API_CONFIG_URL}/api_bookings.php`).then(res => res.json()).catch(() => ({ status: 'error', data: [] })),
      fetch(`${API_CONFIG_URL}/api_payments.php`).then(res => res.json()).catch(() => ({ status: 'error', data: [] })),
      fetch(`${API_CONFIG_URL}/api_guests.php`).then(res => res.json()).catch(() => ({ data: [] }))
    ]).then(([bookingsData, paymentsData, guestsData]) => {
      if (currentReq !== bookingsReqRef.current) return;
      let fetchedPayments = [];
      if (paymentsData && paymentsData.status === 'success' && Array.isArray(paymentsData.data)) {
        fetchedPayments = paymentsData.data.filter(p => !isRemovedOfflineGuest(p.guest_name));
      }
      let fetchedGuests = [];
      if (guestsData && guestsData.status === 'success' && Array.isArray(guestsData.data)) {
        fetchedGuests = guestsData.data.filter(g => !isRemovedOfflineGuest(g.name));
      }
      const rawBookings = (bookingsData && bookingsData.status === 'success' && Array.isArray(bookingsData.data)) ? bookingsData.data.filter(b => !isRemovedOfflineGuest(b)) : [];
      const mergedBookingsList = getAllMergedBookings(rawBookings).filter(b => !isRemovedOfflineGuest(b));

      const mergedBookings = mergedBookingsList.map(b => {
        const payment = fetchedPayments.find(p => p.booking_id === b.id && (p.status === 'Success' || p.status === 'Completed')) ||
                        fetchedPayments.find(p => p.booking_id === b.id);
        const guest = fetchedGuests.find(g => g.id === b.guest_id);
        const timeCandidates = [
          b.time,
          b.booking_time,
          b.created_time,
          b.created_at,
          payment ? (payment.time || payment.created_at || payment.payment_date) : '',
          b.booking_date
        ].filter(Boolean);
        const rawBookingTimestamp = timeCandidates.find(t => typeof t === 'string' && (t.includes(':') || t.includes('T'))) || b.created_at || b.booking_date || '';
        const rawBookingDate = b.booking_date || b.created_at || (payment ? (payment.payment_date || payment.created_at || payment.date) : '') || '';

        return {
          ...b,
          booking_date: rawBookingDate,
          created_at: rawBookingTimestamp,
          booking_time: b.booking_time || b.time || (payment ? payment.time : '') || rawBookingTimestamp,
          paid_amount: payment ? payment.amount : (b.room_price || b.paid_amount || 0),
          payment_info: payment,
          payment_status: payment ? payment.status : (b.payment_status || (b.status === 'Confirmed' || b.status === 'Completed' ? 'Paid' : b.status === 'Pending' ? 'Pending' : 'Unpaid')),
          payment_method: payment ? payment.payment_method : (b.payment_method || (b.paid_amount ? 'Online / UPI' : 'Pending')),
          transaction_id: payment ? (payment.razorpay_payment_id || payment.transaction_id || 'N/A') : (b.transaction_id || 'N/A'),
          payment_date: payment ? (payment.created_at || payment.payment_date || payment.date || rawBookingTimestamp) : rawBookingTimestamp,
          guest_name: b.guest_name || (guest ? guest.name : (b.guest_id ? `Guest ${b.guest_id}` : 'Guest')),
          guest_email: b.guest_email || (guest ? guest.email : 'N/A'),
          guest_phone: b.guest_phone || (guest ? guest.phone : '')
        };
      }).filter(b => !isRemovedOfflineGuest(b));
      setBookings(mergedBookings);
    }).catch(e => console.error("JSON Error in Bookings:", e));
  }, []);

  useEffect(() => {
    fetchBookings();

    const handleUpdate = () => {
      fetchBookings();
    };

    window.addEventListener('meraki_booking_updated', handleUpdate);
    window.addEventListener('meraki_rooms_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('meraki_booking_updated', handleUpdate);
      window.removeEventListener('meraki_rooms_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchBookings]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPageNum(1);
  };

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
        if (editingBooking.status && editingBooking.status.toLowerCase().includes('cancel')) {
          markBookingAsCancelled(editingBooking);
        }
        fetchBookings();
        setEditingBooking(null);
        window.dispatchEvent(new Event('meraki_booking_updated'));
        window.dispatchEvent(new Event('meraki_rooms_updated'));
      } else {
        alert(data.message || 'Error saving booking');
      }
    }).catch(e => console.error(e));
  };

  const deleteBooking = (id) => {
    if(!window.confirm("Are you sure you want to delete this booking?")) return;
    markBookingAsCancelled(id);
    fetch(`${API_CONFIG_URL}/api_bookings.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        setBookings(prev => prev.filter(b => b.id !== id));
        setViewingBooking(null);
        window.dispatchEvent(new Event('meraki_booking_updated'));
        window.dispatchEvent(new Event('meraki_rooms_updated'));
      } else {
        alert(data.message || 'Error deleting booking');
      }
    }).catch(e => console.error(e));
  };

  const calculateNights = (inDate, outDate) => {
    if (!inDate || !outDate) return null;
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => {
        const s = (b.status || '').toLowerCase().trim();
        const f = filter.toLowerCase().trim();
        if (f === 'cancelled') return s.includes('cancel');
        if (f === 'confirmed') return s === 'confirmed';
        if (f === 'completed') return s === 'completed';
        if (f === 'pending') return s === 'pending';
        return s === f;
      });
  const totalFiltered = filteredBookings.length;
  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE) || 1;
  const safePage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <PageHeader
        title="Booking Management"
        subtitle="View and manage all homestay reservations."
        action={
          <button className="admin-btn-primary" onClick={() => setEditingBooking({status: 'Pending', guest_id: 1, room_id: 1})}>
            <PlusSignIcon size={18} /> Create Booking
          </button>
        }
      />

      <div className="admin-card">
        {/* Status Filter Tabs */}
        <div className="admin-filter-bar">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
            <button
              key={f}
              className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => handleFilterChange(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 7-Column Premium Booking Table */}
        <div className="admin-table-wrapper">
          <table className="admin-booking-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Stay Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span className="admin-booking-id">
                      {b.booking_reference || `MERI${String(b.id).padStart(4, '0')}`}
                    </span>
                  </td>
                  <td>
                    <div className="admin-guest-cell">
                      <span className="admin-guest-name">
                        {b.guest_name || (b.guest_id ? `Guest ${b.guest_id}` : 'Guest')}
                      </span>
                      {b.guest_phone && (
                        <span className="admin-guest-phone">{b.guest_phone}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="admin-room-name">{b.room_name || `Room ${b.room_id}`}</span>
                  </td>
                  <td>
                    <div className="admin-stay-dates">
                      <span>{formatDateNumeric(b.check_in)}</span>
                      <span className="admin-stay-arrow">→</span>
                      <span>{formatDateNumeric(b.check_out)}</span>
                    </div>
                  </td>
                  <td>
                    <span className="admin-booking-amount">
                      &#8377;{Number(b.paid_amount || b.room_price || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    {getStatusBadge(b.status)}
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <button
                      type="button"
                      className="admin-btn-view"
                      onClick={() => setViewingBooking(b)}
                      title="View Details"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '36px 20px', color: '#64748b'}}>
                    No {filter === 'All' ? '' : filter.toLowerCase() + ' '}bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right-Aligned 10-Record Pagination */}
        {filteredBookings.length > 0 && (
          <div className="admin-booking-pagination">
            <div className="admin-booking-pagination-info">
              Showing <strong>{startIndex + 1}</strong>&ndash;<strong>{Math.min(startIndex + ITEMS_PER_PAGE, totalFiltered)}</strong> of <strong>{totalFiltered}</strong> bookings
            </div>
            <div className="admin-booking-pagination-controls">
              <button
                type="button"
                className="admin-pagination-btn"
                disabled={safePage <= 1}
                onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Previous</span>
              </button>
              <span className="admin-pagination-page-indicator">
                Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                className="admin-pagination-btn"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPageNum(prev => Math.min(totalPages, prev + 1))}
              >
                <span>Next</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Premium Booking Details View Popup */}
      {viewingBooking && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}} onClick={() => setViewingBooking(null)}>
          <div className="admin-booking-modal-content" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                <h2 style={{margin: 0, fontSize: '19px', color: '#373737', fontWeight: '700'}}>
                  Booking Details
                </h2>
                <span className="admin-booking-id" style={{fontSize: '12px'}}>
                  {viewingBooking.booking_reference || `MERI${String(viewingBooking.id).padStart(4, '0')}`}
                </span>
                {getStatusBadge(viewingBooking.status)}
              </div>
              <button
                type="button"
                onClick={() => setViewingBooking(null)}
                style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px', display: 'flex', alignItems: 'center'}}
                title="Close"
              >
                <Cancel01Icon size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Body - Scrollable content area */}
            <div className="admin-booking-modal-body">
              
              {/* Section 1: Guest Information */}
              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Guest Information</div>
                <div className="admin-modal-grid-2">
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Guest Name</span>
                    <span className="admin-modal-value admin-text-medium">
                      {viewingBooking.guest_name || (viewingBooking.guest_id ? `Guest ${viewingBooking.guest_id}` : 'Guest')}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Mobile Number</span>
                    <span className="admin-modal-value">
                      {viewingBooking.guest_phone || 'N/A'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Email Address</span>
                    <span className="admin-modal-value">
                      {viewingBooking.guest_email || 'N/A'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Total Guests</span>
                    <span className="admin-modal-value">
                      {viewingBooking.guest_count || (Number(viewingBooking.adults || 0) + Number(viewingBooking.children || 0)) || 1} Guests
                      {(viewingBooking.adults || viewingBooking.children) && (
                        <span style={{fontSize: '12px', color: '#64748B', marginLeft: '6px'}}>
                          ({viewingBooking.adults || 0} Adults, {viewingBooking.children || 0} Children)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Room & Stay Details */}
              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Room & Stay Details</div>
                <div className="admin-modal-grid-2">
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Room / Property</span>
                    <span className="admin-modal-value admin-text-medium">
                      {viewingBooking.room_name || `Room ${viewingBooking.room_id}`}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Room ID</span>
                    <span className="admin-modal-value">
                      #{viewingBooking.room_id || 'N/A'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Check-in Date</span>
                    <span className="admin-modal-value">
                      {formatDateNumeric(viewingBooking.check_in)}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Check-out Date</span>
                    <span className="admin-modal-value">
                      {formatDateNumeric(viewingBooking.check_out)}
                    </span>
                  </div>
                  {calculateNights(viewingBooking.check_in, viewingBooking.check_out) && (
                    <div className="admin-modal-field">
                      <span className="admin-modal-label">Duration of Stay</span>
                      <span className="admin-modal-value">
                        {calculateNights(viewingBooking.check_in, viewingBooking.check_out)} {calculateNights(viewingBooking.check_in, viewingBooking.check_out) === 1 ? 'Night' : 'Nights'}
                      </span>
                    </div>
                  )}
                  {viewingBooking.property_type && (
                    <div className="admin-modal-field">
                      <span className="admin-modal-label">Property Type</span>
                      <span className="admin-modal-value">{viewingBooking.property_type}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Booking Metadata */}
              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Booking Information</div>
                <div className="admin-modal-grid-2">
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Booking Date</span>
                    <span className="admin-modal-value">
                      {formatDateNumeric(viewingBooking.booking_date || viewingBooking.created_at || viewingBooking.payment_date)}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Exact Booking Time</span>
                    <span className="admin-modal-value">
                      {formatBookingTime(viewingBooking.booking_time || viewingBooking.created_at || viewingBooking.payment_date || viewingBooking.booking_date) || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Payment & Billing */}
              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Payment & Billing</div>
                <div className="admin-modal-grid-2">
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Total Booking Amount</span>
                    <span className="admin-modal-value" style={{fontWeight: '700', color: '#8A158F', fontSize: '15px'}}>
                      &#8377;{Number(viewingBooking.paid_amount || viewingBooking.room_price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Payment Status</span>
                    <span className="admin-modal-value">
                      {viewingBooking.payment_status || (viewingBooking.status === 'Confirmed' || viewingBooking.status === 'Completed' ? 'Paid' : viewingBooking.status)}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Payment Method</span>
                    <span className="admin-modal-value">
                      {viewingBooking.payment_method || 'Online / UPI / Card'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Transaction ID</span>
                    <span className="admin-modal-value" style={{fontFamily: 'monospace', fontSize: '12px'}}>
                      {viewingBooking.transaction_id || viewingBooking.razorpay_payment_id || 'N/A'}
                    </span>
                  </div>
                  {viewingBooking.coupon_code && (
                    <div className="admin-modal-field">
                      <span className="admin-modal-label">Coupon / Discount</span>
                      <span className="admin-modal-value">
                        {viewingBooking.coupon_code} {viewingBooking.discount ? `(-₹${viewingBooking.discount})` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cancellation Details if Cancelled */}
              {((viewingBooking.status && viewingBooking.status.toLowerCase().includes('cancel')) || viewingBooking.cancelled_at || viewingBooking.cancellation_reason) && (
                <div className="admin-modal-section" style={{borderLeft: '3px solid #ef4444', backgroundColor: '#fef2f2', padding: '12px 14px', borderRadius: '6px'}}>
                  <div className="admin-modal-section-title" style={{color: '#991b1b', marginBottom: '8px', borderBottomColor: '#fecaca'}}>Cancellation Details</div>
                  <div className="admin-modal-grid-2">
                    {viewingBooking.cancelled_at && (
                      <div className="admin-modal-field">
                        <span className="admin-modal-label" style={{color: '#991b1b'}}>Cancelled On</span>
                        <span className="admin-modal-value" style={{color: '#7f1d1d'}}>
                          {formatDateNumeric(viewingBooking.cancelled_at)} {formatBookingTime(viewingBooking.cancelled_at) ? `(${formatBookingTime(viewingBooking.cancelled_at)})` : ''}
                        </span>
                      </div>
                    )}
                    <div className="admin-modal-field" style={{gridColumn: viewingBooking.cancelled_at ? 'auto' : '1 / -1'}}>
                      <span className="admin-modal-label" style={{color: '#991b1b'}}>Cancellation Reason</span>
                      <span className="admin-modal-value" style={{color: '#7f1d1d'}}>
                        {viewingBooking.cancellation_reason || 'Cancelled by guest / admin'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Notes / Requests */}
              {(viewingBooking.notes || viewingBooking.special_requests) && (
                <div className="admin-modal-section">
                  <div className="admin-modal-section-title">Special Requests / Notes</div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-value">
                      {viewingBooking.notes || viewingBooking.special_requests}
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-modal-btn-delete"
                onClick={() => {
                  const idToDelete = viewingBooking.id;
                  deleteBooking(idToDelete);
                }}
              >
                <Delete01Icon size={16} />
                <span>Delete</span>
              </button>

              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <button
                  type="button"
                  className="admin-modal-btn-close"
                  onClick={() => setViewingBooking(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="admin-modal-btn-edit"
                  onClick={() => {
                    const bToEdit = { ...viewingBooking };
                    setViewingBooking(null);
                    setEditingBooking(bToEdit);
                  }}
                >
                  <Edit01Icon size={16} />
                  <span>Edit Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-booking-modal-content" style={{maxWidth: '520px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '700'}}>
                {editingBooking.id ? `Edit Booking (${editingBooking.booking_reference || `MERI${String(editingBooking.id).padStart(4, '0')}`})` : 'New Booking'}
              </h2>
              <button onClick={() => setEditingBooking(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px'}}>
                <Cancel01Icon size={22} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="admin-booking-modal-body">
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600', fontSize: '13px'}}>Guest ID</label>
                <input type="number" className="admin-form-input" style={{fontSize: '13px'}} value={editingBooking.guest_id || ''} onChange={e => setEditingBooking({...editingBooking, guest_id: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600', fontSize: '13px'}}>Room ID</label>
                <input type="number" className="admin-form-input" style={{fontSize: '13px'}} value={editingBooking.room_id || ''} onChange={e => setEditingBooking({...editingBooking, room_id: e.target.value})} />
              </div>
              <div className="admin-form-row" style={{margin: 0, gap: '12px'}}>
                <div className="admin-form-group" style={{margin: 0}}>
                  <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600', fontSize: '13px'}}>Check In</label>
                  <input type="date" className="admin-form-input" style={{fontSize: '13px'}} value={editingBooking.check_in || ''} onChange={e => setEditingBooking({...editingBooking, check_in: e.target.value})} />
                </div>
                <div className="admin-form-group" style={{margin: 0}}>
                  <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600', fontSize: '13px'}}>Check Out</label>
                  <input type="date" className="admin-form-input" style={{fontSize: '13px'}} value={editingBooking.check_out || ''} onChange={e => setEditingBooking({...editingBooking, check_out: e.target.value})} />
                </div>
              </div>
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600', fontSize: '13px'}}>Guest Count</label>
                <input type="number" className="admin-form-input" style={{fontSize: '13px'}} value={editingBooking.guest_count || ''} onChange={e => setEditingBooking({...editingBooking, guest_count: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600', fontSize: '13px'}}>Status</label>
                <select className="admin-form-input" style={{fontSize: '13px'}} value={editingBooking.status || 'Pending'} onChange={e => setEditingBooking({...editingBooking, status: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer" style={{justifyContent: 'flex-end'}}>
              <button className="admin-modal-btn-close" onClick={() => setEditingBooking(null)}>Cancel</button>
              <button className="admin-modal-btn-edit" onClick={saveBooking}>Save Booking</button>
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
  const calendarReqRef = useRef(0);

  const fetchCalendarBookings = useCallback(() => {
    const currentReq = ++calendarReqRef.current;
    fetch(`${API_CONFIG_URL}/api_bookings.php`)
      .then(res => res.json())
      .then(data => {
        if (currentReq !== calendarReqRef.current) return;
        const raw = (data && data.status === 'success' && Array.isArray(data.data)) ? data.data.filter(b => !isRemovedOfflineGuest(b)) : [];
        const merged = getAllMergedBookings(raw).filter(b => !isRemovedOfflineGuest(b));
        setBookings(merged.filter(b => isBookingActive(b) && !isRemovedOfflineGuest(b)));
      }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchCalendarBookings();

    const handleUpdate = () => {
      fetchCalendarBookings();
    };

    window.addEventListener('meraki_booking_updated', handleUpdate);
    window.addEventListener('meraki_rooms_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('meraki_booking_updated', handleUpdate);
      window.removeEventListener('meraki_rooms_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchCalendarBookings]);

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
      if (b.check_in && b.check_out) {
        const dIn = new Date(b.check_in);
        dIn.setHours(0,0,0,0);
        const dOut = new Date(b.check_out);
        dOut.setHours(0,0,0,0);
        if (!isNaN(dIn.getTime()) && !isNaN(dOut.getTime())) {
          return d.getTime() >= dIn.getTime() && d.getTime() < dOut.getTime();
        }
      }
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

const validateAvifFile = (file) => {
  if (!file) return { valid: false, message: 'No file selected.' };
  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();
  const isAvif = fileName.endsWith('.avif') || fileType === 'image/avif';
  if (!isAvif) {
    return {
      valid: false,
      message: 'Only .avif image files are allowed. Non-AVIF images (JPG, JPEG, PNG, etc.) cannot be uploaded.'
    };
  }
  return { valid: true };
};

function ManageRoomsTab() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);

  const sortRooms = (roomList) => {
    const getOrderRank = (room) => {
      const id = Number(room.id);
      if (id === 1) return 1;
      if (id === 2) return 2;
      if (id === 3) return 3;
      if (id === 4) return 4;
      return 5;
    };
    return [...roomList].sort((a, b) => getOrderRank(a) - getOrderRank(b));
  };
  
  const fetchRooms = useCallback(() => {
    fetch(`${API_CONFIG_URL}/api_rooms.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setRooms(sortRooms(data.data)); })
      .catch(e => console.error("JSON Error in ManageRooms:", e));
  }, []);

  useEffect(() => {
    fetchRooms();

    const handleRoomsUpdate = () => {
      fetchRooms();
    };

    window.addEventListener('meraki_rooms_updated', handleRoomsUpdate);
    return () => {
      window.removeEventListener('meraki_rooms_updated', handleRoomsUpdate);
    };
  }, [fetchRooms]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateAvifFile(file);
    if (!validation.valid) {
      alert(validation.message);
      e.target.value = '';
      return;
    }
    
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
        fetchRooms();
        setEditingRoom(null);
        window.dispatchEvent(new Event('meraki_rooms_updated'));
        window.dispatchEvent(new Event('meraki_booking_updated'));
        try { localStorage.setItem('meraki_rooms_updated_ts', Date.now().toString()); } catch(e){}
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
        setRooms(prev => prev.filter(r => r.id !== id));
        window.dispatchEvent(new Event('meraki_rooms_updated'));
        window.dispatchEvent(new Event('meraki_booking_updated'));
        try { localStorage.setItem('meraki_rooms_updated_ts', Date.now().toString()); } catch(e){}
      }
    }).catch(e => console.error("Error deleting room:", e));
  };

  return (
    <div className="admin-fade-in">
      <PageHeader title="Manage Rooms" subtitle="Edit room details, descriptions, images and availability." action={<button className="admin-btn-primary" onClick={() => setEditingRoom({status: 'Available'})}><PlusSignIcon size={18} /> Add Room</button>} />
      <div className="admin-item-grid">
        {rooms.map(r => (
          <div key={r.id} className="admin-item-card hover-lift">
            <OptimizedImage src={r.image_url || getRoomImage(r.id)} alt={r.name} className="admin-item-img" loading="eager" decoding="async" noWrapper={true} />
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
                <div style={{display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', boxSizing: 'border-box', overflow: 'hidden'}}>
                  {editingRoom.image_url && (
                    <div style={{width: '54px', height: '54px', minWidth: '54px', maxWidth: '54px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0'}}>
                      <OptimizedImage src={editingRoom.image_url} alt="Preview" style={{width: '54px', height: '54px', objectFit: 'cover', display: 'block'}} loading="eager" width={54} height={54} decoding="async" noWrapper={true} />
                    </div>
                  )}
                  <div style={{flex: 1, minWidth: 0}}>
                    <input type="file" accept=".avif,image/avif" className="admin-form-input" onChange={handleImageUpload} style={{padding: '6px 10px', background: '#fff', cursor: 'pointer', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%', boxSizing: 'border-box'}} />
                    <p style={{margin: '6px 0 0 0', fontSize: '12px', color: '#dc2626', fontWeight: '600'}}>⚠️ Only .avif image files are allowed.</p>
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


function GuestsTab() {
  const [guests, setGuests] = useState([]);
  const [totalGuestsCount, setTotalGuestsCount] = useState(0);
  const [viewingHistory, setViewingHistory] = useState(null);
  const [currentPage, setCurrentPageNum] = useState(1);
  const guestsReqRef = useRef(0);

  const ITEMS_PER_PAGE = 10;

  const normalizePhone = (phone) => {
    if (!phone) return '';
    return String(phone).replace(/\D/g, '');
  };

  const normalizeEmail = (email) => {
    if (!email) return '';
    return String(email).trim().toLowerCase();
  };

  const normalizeName = (name) => {
    if (!name) return '';
    return String(name).trim().toLowerCase();
  };

  const calculateNights = (inDate, outDate) => {
    if (!inDate || !outDate) return null;
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const fetchGuestDirectory = useCallback(() => {
    const currentReq = ++guestsReqRef.current;
    Promise.all([
      fetch(`${API_CONFIG_URL}/api_guests.php`).then(res => res.json()).catch(() => ({ data: [] })),
      fetch(`${API_CONFIG_URL}/api_bookings.php`).then(res => res.json()).catch(() => ({ data: [] })),
      fetch(`${API_CONFIG_URL}/api_payments.php`).then(res => res.json()).catch(() => ({ data: [] }))
    ]).then(([guestsData, bookingsData, paymentsData]) => {
      if (currentReq !== guestsReqRef.current) return;
      let rawGuests = (guestsData && guestsData.status === 'success' && Array.isArray(guestsData.data)) ? guestsData.data.filter(g => !isRemovedOfflineGuest(g.name)) : [];
      let rawBookings = (bookingsData && bookingsData.status === 'success' && Array.isArray(bookingsData.data)) ? bookingsData.data.filter(b => !isRemovedOfflineGuest(b)) : [];
      let rawPayments = (paymentsData && paymentsData.status === 'success' && Array.isArray(paymentsData.data)) ? paymentsData.data.filter(p => !isRemovedOfflineGuest(p.guest_name)) : [];

      // Calculate total guest head count across all bookings
      const totalG = rawBookings.reduce((sum, b) => sum + parseInt(b.guest_count || 1, 10), 0);
      setTotalGuestsCount(totalG);

      // Enrich all bookings with payment & formatted information
      const enrichedBookings = rawBookings.map(b => {
        const payment = rawPayments.find(p => p.booking_id === b.id && (p.status === 'Success' || p.status === 'Completed')) ||
                        rawPayments.find(p => p.booking_id === b.id);
        const timeCandidates = [
          b.time,
          b.booking_time,
          b.created_time,
          b.created_at,
          payment ? (payment.time || payment.created_at || payment.payment_date) : '',
          b.booking_date
        ].filter(Boolean);
        const rawBookingTimestamp = timeCandidates.find(t => typeof t === 'string' && (t.includes(':') || t.includes('T'))) || b.created_at || b.booking_date || '';
        const rawBookingDate = b.booking_date || b.created_at || (payment ? (payment.payment_date || payment.created_at || payment.date) : '') || '';

        return {
          ...b,
          booking_date: rawBookingDate,
          created_at: rawBookingTimestamp,
          booking_time: b.booking_time || b.time || (payment ? payment.time : '') || rawBookingTimestamp,
          paid_amount: payment ? payment.amount : (b.room_price || b.paid_amount || 0),
          payment_info: payment,
          payment_status: payment ? payment.status : (b.payment_status || (b.status === 'Confirmed' || b.status === 'Completed' ? 'Paid' : b.status === 'Pending' ? 'Pending' : 'Unpaid')),
          payment_method: payment ? payment.payment_method : (b.payment_method || (b.paid_amount ? 'Online / UPI' : 'Pending')),
          transaction_id: payment ? (payment.razorpay_payment_id || payment.transaction_id || 'N/A') : (b.transaction_id || 'N/A')
        };
      });

      // Build unified guest records list
      const guestList = rawGuests.map(g => ({
        id: String(g.id),
        guest_ids: [String(g.id)],
        name: g.name || 'Guest',
        email: g.email || '',
        phone: g.phone || '',
        last_room: g.last_room || 'N/A',
        bookings: []
      }));

      // Match each booking to existing guest group or create a new one
      enrichedBookings.forEach(b => {
        const bPhone = normalizePhone(b.guest_phone || b.phone);
        const bEmail = normalizeEmail(b.guest_email || b.email);
        const bName = normalizeName(b.guest_name || b.name);

        let match = guestList.find(g => {
          // 1. Direct ID match
          if (b.guest_id && g.guest_ids && g.guest_ids.includes(String(b.guest_id))) return true;
          // 2. Phone match (exact or last 10 digits)
          const gPhone = normalizePhone(g.phone);
          if (bPhone && gPhone && (bPhone === gPhone || (bPhone.length >= 10 && gPhone.length >= 10 && bPhone.slice(-10) === gPhone.slice(-10)))) return true;
          // 3. Email match
          const gEmail = normalizeEmail(g.email);
          if (bEmail && gEmail && bEmail === gEmail) return true;
          // 4. Name match (exact non-generic)
          const gName = normalizeName(g.name);
          if (bName && gName && bName === gName && bName !== 'guest' && bName.length > 2) return true;
          return false;
        });

        if (match) {
          match.bookings.push(b);
          if (b.guest_id && !match.guest_ids.includes(String(b.guest_id))) {
            match.guest_ids.push(String(b.guest_id));
          }
          if (!match.phone && (b.guest_phone || b.phone)) match.phone = b.guest_phone || b.phone;
          if (!match.email && (b.guest_email || b.email)) match.email = b.guest_email || b.email;
          if ((!match.name || match.name.toLowerCase() === 'guest') && b.guest_name) match.name = b.guest_name;
        } else {
          const newGuest = {
            id: b.guest_id ? String(b.guest_id) : `bk_guest_${b.id}`,
            guest_ids: b.guest_id ? [String(b.guest_id)] : [],
            name: b.guest_name || (b.guest_id ? `Guest ${b.guest_id}` : 'Guest'),
            email: b.guest_email || '',
            phone: b.guest_phone || '',
            last_room: b.room_name || `Room ${b.room_id}`,
            bookings: [b]
          };
          guestList.push(newGuest);
        }
      });

      // Finalize summary metrics per guest
      guestList.forEach(g => {
        // Sort bookings chronologically descending (newest first)
        g.bookings.sort((x, y) => {
          const tX = new Date(x.time || x.created_at || x.booking_date || x.check_in).getTime() || x.id || 0;
          const tY = new Date(y.time || y.created_at || y.booking_date || y.check_in).getTime() || y.id || 0;
          return tY - tX;
        });

        g.total_stays = g.bookings.length;
        g.active_stays = g.bookings.filter(bk => !((bk.status || '').toLowerCase().includes('cancel'))).length;
        g.cancelled_stays = g.bookings.filter(bk => (bk.status || '').toLowerCase().includes('cancel')).length;
        if (g.bookings.length > 0) {
          g.last_room = g.bookings[0].room_name || `Room ${g.bookings[0].room_id}`;
        }
      });

      // Sort guests: guests with more stays and recent bookings first
      guestList.sort((a, b) => {
        if (b.total_stays !== a.total_stays) return b.total_stays - a.total_stays;
        return (b.id || '').localeCompare(a.id || '');
      });

      setGuests(guestList);

      // Keep viewingHistory synced if modal is open
      setViewingHistory(prev => {
        if (!prev) return null;
        return guestList.find(g => g.id === prev.id || (prev.guest_ids && g.guest_ids && g.guest_ids.some(id => prev.guest_ids.includes(id)))) || prev;
      });
    }).catch(e => console.error("Guest Directory Loading Error:", e));
  }, []);

  useEffect(() => {
    fetchGuestDirectory();

    const handleUpdate = () => {
      fetchGuestDirectory();
    };

    window.addEventListener('meraki_booking_updated', handleUpdate);
    window.addEventListener('meraki_rooms_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('meraki_booking_updated', handleUpdate);
      window.removeEventListener('meraki_rooms_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchGuestDirectory]);

  const totalGuests = guests.length;
  const totalPages = Math.ceil(totalGuests / ITEMS_PER_PAGE) || 1;
  const safePage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedGuests = guests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <PageHeader title="Guest Directory" subtitle="Manage guest information, reservation history, and stay records." />
      
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
          <table className="admin-booking-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Contact Info</th>
                <th>Total Bookings</th>
                <th>Last Room</th>
                <th style={{textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGuests.map((g, idx) => (
                <tr key={g.id || idx}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap'}}>
                      <span className="admin-text-medium" style={{fontWeight: '600', color: '#373737'}}>{g.name}</span>
                      {g.total_stays > 1 && (
                        <span className="admin-badge badge-primary" style={{fontSize: '11px', padding: '2px 7px'}}>
                          {g.total_stays} Bookings
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-cell-stack">
                      <span style={{fontSize: '13px', color: '#373737'}}>{g.email || 'N/A'}</span>
                      <span className="admin-cell-muted" style={{fontSize: '11px'}}>{g.phone || ''}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                      <span className="admin-badge badge-primary" style={{width: 'fit-content'}}>
                        {g.total_stays || 0} {g.total_stays === 1 ? 'Stay' : 'Stays'}
                      </span>
                      {g.cancelled_stays > 0 && (
                        <span style={{fontSize: '11px', color: '#dc2626', fontWeight: '500'}}>
                          {g.cancelled_stays} Cancelled
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{fontSize: '13px', color: '#373737'}}>{g.last_room || 'N/A'}</span>
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <button
                      type="button"
                      className="admin-btn-view"
                      onClick={() => setViewingHistory(g)}
                      title="View Stay History"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>History</span>
                    </button>
                  </td>
                </tr>
              ))}
              {guests.length === 0 && (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '36px 20px', color: '#64748B'}}>
                    No guest records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right-Aligned 10-Record Pagination */}
        {guests.length > 0 && (
          <div className="admin-booking-pagination">
            <div className="admin-booking-pagination-info">
              Showing <strong>{startIndex + 1}</strong>&ndash;<strong>{Math.min(startIndex + ITEMS_PER_PAGE, totalGuests)}</strong> of <strong>{totalGuests}</strong> guests
            </div>
            <div className="admin-booking-pagination-controls">
              <button
                type="button"
                className="admin-pagination-btn"
                disabled={safePage <= 1}
                onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Previous</span>
              </button>
              <span className="admin-pagination-page-indicator">
                Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                className="admin-pagination-btn"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPageNum(prev => Math.min(totalPages, prev + 1))}
              >
                <span>Next</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complete Guest Booking History Modal */}
      {viewingHistory && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}} onClick={() => setViewingHistory(null)}>
          <div className="admin-booking-modal-content" style={{maxWidth: '680px'}} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px'}}>
              <div>
                <h2 style={{margin: 0, fontSize: '19px', color: '#373737', fontWeight: '700'}}>
                  Stay History: {viewingHistory.name}
                </h2>
                <div style={{display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12px', color: '#64748B', flexWrap: 'wrap'}}>
                  <span><strong>Email:</strong> {viewingHistory.email || 'N/A'}</span>
                  <span><strong>Mobile:</strong> {viewingHistory.phone || 'N/A'}</span>
                  <span><strong>Total Stays:</strong> {viewingHistory.total_stays || (viewingHistory.bookings ? viewingHistory.bookings.length : 0)}</span>
                </div>
              </div>
              <button onClick={() => setViewingHistory(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px', display: 'flex', alignItems: 'center'}}>
                <Cancel01Icon size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="admin-booking-modal-body">
              {(!viewingHistory.bookings || viewingHistory.bookings.length === 0) ? (
                <div style={{textAlign: 'center', color: '#64748B', padding: '36px 16px'}}>
                  No booking records found for this guest.
                </div>
              ) : (
                viewingHistory.bookings.map((b, i) => {
                  const isCancelled = (b.status && b.status.toLowerCase().includes('cancel')) || b.cancelled_at || b.cancellation_reason;
                  const nights = calculateNights(b.check_in, b.check_out);

                  return (
                    <div
                      key={b.id || i}
                      className="admin-modal-section"
                      style={{
                        marginBottom: '14px',
                        borderLeft: isCancelled ? '3px solid #ef4444' : '3px solid #8A158F',
                        backgroundColor: isCancelled ? '#fffafb' : '#faf5fb',
                        padding: '14px',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px'}}>
                        <span style={{fontWeight: '700', color: '#373737', fontSize: '14px'}}>
                          <span className="admin-booking-id" style={{fontSize: '12px', marginRight: '8px'}}>
                            {b.booking_reference || `MERI${String(b.id).padStart(4, '0')}`}
                          </span>
                          {b.room_name || `Room ${b.room_id}`}
                        </span>
                        {getStatusBadge(b.status)}
                      </div>

                      <div className="admin-modal-grid-2" style={{gap: '10px'}}>
                        <div>
                          <span className="admin-modal-label">Stay Dates</span>
                          <span className="admin-modal-value">
                            {formatDateNumeric(b.check_in)} → {formatDateNumeric(b.check_out)}
                            {nights && (
                              <span style={{fontSize: '11px', color: '#64748B', marginLeft: '6px'}}>
                                ({nights} {nights === 1 ? 'Night' : 'Nights'})
                              </span>
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="admin-modal-label">Total Guests</span>
                          <span className="admin-modal-value">
                            {b.guest_count || 1} {parseInt(b.guest_count || 1, 10) === 1 ? 'Guest' : 'Guests'}
                          </span>
                        </div>
                        <div>
                          <span className="admin-modal-label">Booked On</span>
                          <span className="admin-modal-value">
                            {formatDateNumeric(b.booking_date || b.created_at)}
                            {formatBookingTime(b.booking_date || b.created_at) ? ` (${formatBookingTime(b.booking_date || b.created_at)})` : ''}
                          </span>
                        </div>
                        <div>
                          <span className="admin-modal-label">Amount</span>
                          <span className="admin-modal-value" style={{fontWeight: '700', color: '#8A158F'}}>
                            &#8377;{Number(b.paid_amount || b.room_price || 0).toLocaleString('en-IN')}
                            <span style={{fontSize: '11px', color: '#64748B', fontWeight: 'normal', marginLeft: '6px'}}>
                              ({b.payment_status || 'Paid'})
                            </span>
                          </span>
                        </div>
                        {b.payment_method && (
                          <div>
                            <span className="admin-modal-label">Payment Method</span>
                            <span className="admin-modal-value" style={{fontSize: '12px'}}>
                              {b.payment_method}
                            </span>
                          </div>
                        )}
                        {b.transaction_id && b.transaction_id !== 'N/A' && (
                          <div>
                            <span className="admin-modal-label">Transaction ID</span>
                            <span className="admin-modal-value" style={{fontFamily: 'monospace', fontSize: '11px'}}>
                              {b.transaction_id}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Cancellation box if cancelled */}
                      {isCancelled && (
                        <div style={{marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #fecaca', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                          <span style={{fontSize: '12px', fontWeight: '600', color: '#b91c1c'}}>
                            Cancellation Information:
                          </span>
                          {b.cancelled_at && (
                            <span style={{fontSize: '12px', color: '#7f1d1d'}}>
                              <strong>Cancelled On:</strong> {formatDateNumeric(b.cancelled_at)} {formatBookingTime(b.cancelled_at) ? `(${formatBookingTime(b.cancelled_at)})` : ''}
                            </span>
                          )}
                          <span style={{fontSize: '12px', color: '#7f1d1d'}}>
                            <strong>Reason:</strong> {b.cancellation_reason || 'Cancelled by guest / admin'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="admin-modal-footer" style={{justifyContent: 'flex-end'}}>
              <button className="admin-modal-btn-close" onClick={() => setViewingHistory(null)}>Close</button>
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
  const [viewingPayment, setViewingPayment] = useState(null);
  const [currentPage, setCurrentPageNum] = useState(1);
  const paymentsReqRef = useRef(0);

  const ITEMS_PER_PAGE = 10;
  
  const fetchPayments = useCallback(() => {
    const currentReq = ++paymentsReqRef.current;
    Promise.all([
      fetch(`${API_CONFIG_URL}/api_payments.php`).then(res => res.json()).catch(() => ({ status: 'error', data: [] })),
      fetch(`${API_CONFIG_URL}/api_bookings.php`).then(res => res.json()).catch(() => ({ status: 'error', data: [] })),
      fetch(`${API_CONFIG_URL}/api_guests.php`).then(res => res.json()).catch(() => ({ data: [] }))
    ]).then(([paymentsData, bookingsData, guestsData]) => {
      if (currentReq !== paymentsReqRef.current) return;
      let fetchedBookings = [];
      if (bookingsData && bookingsData.status === 'success' && Array.isArray(bookingsData.data)) {
        fetchedBookings = bookingsData.data.filter(b => !isRemovedOfflineGuest(b));
      }

      let fetchedGuests = [];
      if (guestsData && guestsData.status === 'success' && Array.isArray(guestsData.data)) {
        fetchedGuests = guestsData.data.filter(g => !isRemovedOfflineGuest(g.name));
      }
      if (paymentsData && paymentsData.status === 'success' && Array.isArray(paymentsData.data)) {
        let basePayments = paymentsData.data.filter(p => !isRemovedOfflineGuest(p.guest_name));

        const mergedPayments = basePayments.map(p => {
          const booking = fetchedBookings.find(b => b.id === p.booking_id);
          const guest = booking ? fetchedGuests.find(g => g.id === booking.guest_id) : (p.guest_id ? fetchedGuests.find(g => g.id === p.guest_id) : null);
          return {
            ...p,
            booking: booking || null,
            booking_id: p.booking_id,
            booking_reference: booking ? (booking.booking_reference || `MERI${String(booking.id).padStart(4, '0')}`) : (p.booking_id ? `MERI${String(p.booking_id).padStart(4, '0')}` : 'N/A'),
            booking_status: booking ? booking.status : (p.booking_status || 'N/A'),
            guest_name: booking ? (booking.guest_name || (guest ? guest.name : (booking.guest_id ? `Guest ${booking.guest_id}` : 'Guest'))) : (p.guest_name || (guest ? guest.name : 'Guest')),
            guest_phone: booking ? (booking.guest_phone || (guest ? guest.phone : '')) : (p.guest_phone || (guest ? guest.phone : '')),
            guest_email: booking ? (booking.guest_email || (guest ? guest.email : '')) : (p.guest_email || (guest ? guest.email : '')),
            room_name: booking ? (booking.room_name || `Room ${booking.room_id}`) : (p.room_name || (p.room_id ? `Room ${p.room_id}` : 'N/A')),
            room_id: booking ? (booking.room_name || `Room ${booking.room_id}`) : (p.room_name || p.room_id || 'N/A'),
            coupon_code: booking ? booking.coupon_code : (p.coupon_code || ''),
            discount: booking ? booking.discount : (p.discount || 0),
            payment_date: p.time || p.payment_date || p.created_at || p.date || (booking ? (booking.time || booking.created_at || booking.booking_date) : '')
          };
        }).filter(p => !isRemovedOfflineGuest(p.guest_name));
        setPayments(mergedPayments);
      }
    }).catch(e => console.error("JSON Error in Payments:", e));
  }, []);

  useEffect(() => {
    fetchPayments();

    const handleUpdate = () => {
      fetchPayments();
    };

    window.addEventListener('meraki_booking_updated', handleUpdate);
    window.addEventListener('meraki_rooms_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('meraki_booking_updated', handleUpdate);
      window.removeEventListener('meraki_rooms_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchPayments]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPageNum(1);
  };

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
        window.dispatchEvent(new Event('meraki_booking_updated'));
        window.dispatchEvent(new Event('meraki_rooms_updated'));
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
        setPayments(prev => prev.filter(p => p.id !== id));
        window.dispatchEvent(new Event('meraki_booking_updated'));
        window.dispatchEvent(new Event('meraki_rooms_updated'));
      } else {
        alert(data.message || 'Error deleting payment');
      }
    }).catch(e => console.error(e));
  };

  const filteredPayments = filter === 'All' ? payments : payments.filter(p => p.status === filter);
  const totalPayments = filteredPayments.length;
  const totalPages = Math.ceil(totalPayments / ITEMS_PER_PAGE) || 1;
  const safePage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <PageHeader
        title="Payment History"
        subtitle="Track all transactions, settlements, and refunds."
        action={
          <button className="admin-btn-primary" onClick={() => setEditingPayment({status: 'Pending', booking_id: 1, amount: 0})}>
            <PlusSignIcon size={18} /> New Payment
          </button>
        }
      />

      <div className="admin-card">
        {/* Status Filter Tabs */}
        <div className="admin-filter-bar">
          {['All', 'Success', 'Pending', 'Failed', 'Refunded'].map(f => (
             <button
               key={f}
               className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
               onClick={() => handleFilterChange(f)}
             >
               {f}
             </button>
          ))}
        </div>

        {/* 7-Column Premium Payment Management Table */}
        <div className="admin-table-wrapper">
          <table className="admin-booking-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th style={{textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((p, i) => (
                <tr key={p.id || i}>
                  <td>
                    <span className="admin-booking-id">
                      {p.razorpay_payment_id || (p.id ? `#PAY-${p.id}` : 'PAY')}
                    </span>
                  </td>
                  <td>
                    <div className="admin-guest-cell">
                      <span className="admin-guest-name">{p.guest_name || 'Guest'}</span>
                      {p.guest_phone && (
                        <span className="admin-guest-phone">{p.guest_phone}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="admin-room-name">{p.room_name || p.room_id || 'N/A'}</span>
                  </td>
                  <td>
                    <span className="admin-booking-amount">
                      &#8377;{Number(p.amount || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span style={{fontSize: '13px', color: '#373737'}}>{p.payment_method || 'Online / UPI'}</span>
                  </td>
                  <td>
                    {getStatusBadge(p.status)}
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <button
                      type="button"
                      className="admin-btn-view"
                      onClick={() => setViewingPayment(p)}
                      title="View Details"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '36px 20px', color: '#64748B'}}>
                    No {filter === 'All' ? '' : filter.toLowerCase() + ' '}payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right-Aligned 10-Record Pagination */}
        {filteredPayments.length > 0 && (
          <div className="admin-booking-pagination">
            <div className="admin-booking-pagination-info">
              Showing <strong>{startIndex + 1}</strong>&ndash;<strong>{Math.min(startIndex + ITEMS_PER_PAGE, totalPayments)}</strong> of <strong>{totalPayments}</strong> payments
            </div>
            <div className="admin-booking-pagination-controls">
              <button
                type="button"
                className="admin-pagination-btn"
                disabled={safePage <= 1}
                onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Previous</span>
              </button>
              <span className="admin-pagination-page-indicator">
                Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                className="admin-pagination-btn"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPageNum(prev => Math.min(totalPages, prev + 1))}
              >
                <span>Next</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Payment Modal */}
      {editingPayment && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-booking-modal-content" style={{maxWidth: '500px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px'}}>
              <h2 style={{margin: 0, fontSize: '19px', color: '#373737', fontWeight: '700'}}>{editingPayment.id ? 'Edit Payment' : 'New Payment'}</h2>
              <button onClick={() => setEditingPayment(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px', display: 'flex', alignItems: 'center'}}>
                <Cancel01Icon size={22} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="admin-booking-modal-body">
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#373737', fontWeight: '600', fontSize: '13px'}}>Booking ID</label>
                <input type="number" className="admin-form-input" style={{fontSize: '13px'}} value={editingPayment.booking_id || ''} onChange={e => setEditingPayment({...editingPayment, booking_id: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#373737', fontWeight: '600', fontSize: '13px'}}>Razorpay Order ID</label>
                <input type="text" className="admin-form-input" style={{fontSize: '13px'}} value={editingPayment.razorpay_order_id || ''} onChange={e => setEditingPayment({...editingPayment, razorpay_order_id: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#373737', fontWeight: '600', fontSize: '13px'}}>Razorpay Payment ID</label>
                <input type="text" className="admin-form-input" style={{fontSize: '13px'}} value={editingPayment.razorpay_payment_id || ''} onChange={e => setEditingPayment({...editingPayment, razorpay_payment_id: e.target.value})} />
              </div>
              <div className="admin-form-row" style={{margin: 0, gap: '12px'}}>
                <div className="admin-form-group" style={{margin: 0}}>
                  <label className="admin-form-label" style={{marginBottom: '6px', color: '#373737', fontWeight: '600', fontSize: '13px'}}>Amount (₹)</label>
                  <input type="number" className="admin-form-input" style={{fontSize: '13px'}} value={editingPayment.amount || ''} onChange={e => setEditingPayment({...editingPayment, amount: e.target.value})} />
                </div>
                <div className="admin-form-group" style={{margin: 0}}>
                  <label className="admin-form-label" style={{marginBottom: '6px', color: '#373737', fontWeight: '600', fontSize: '13px'}}>Method</label>
                  <input type="text" className="admin-form-input" style={{fontSize: '13px'}} value={editingPayment.payment_method || ''} onChange={e => setEditingPayment({...editingPayment, payment_method: e.target.value})} />
                </div>
              </div>
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#373737', fontWeight: '600', fontSize: '13px'}}>Status</label>
                <select className="admin-form-input" style={{fontSize: '13px'}} value={editingPayment.status || 'Pending'} onChange={e => setEditingPayment({...editingPayment, status: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer" style={{justifyContent: 'flex-end'}}>
              <button className="admin-modal-btn-close" onClick={() => setEditingPayment(null)}>Cancel</button>
              <button className="admin-modal-btn-edit" onClick={savePayment}>Save Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Payment Details View Popup */}
      {viewingPayment && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}} onClick={() => setViewingPayment(null)}>
          <div className="admin-booking-modal-content" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                <h2 style={{margin: 0, fontSize: '19px', color: '#373737', fontWeight: '700'}}>
                  Payment Details
                </h2>
                <span className="admin-booking-id" style={{fontSize: '12px'}}>
                  {viewingPayment.razorpay_payment_id || (viewingPayment.id ? `#PAY-${viewingPayment.id}` : 'PAY')}
                </span>
                {getStatusBadge(viewingPayment.status)}
              </div>
              <button
                type="button"
                onClick={() => setViewingPayment(null)}
                style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px', display: 'flex', alignItems: 'center'}}
                title="Close"
              >
                <Cancel01Icon size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="admin-booking-modal-body">
              
              {/* Section 1: Transaction Information */}
              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Transaction Information</div>
                <div className="admin-modal-grid-2">
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Transaction ID</span>
                    <span className="admin-modal-value" style={{fontFamily: 'monospace', fontWeight: '600', color: '#8A158F'}}>
                      {viewingPayment.razorpay_payment_id || (viewingPayment.id ? `#PAY-${viewingPayment.id}` : 'N/A')}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Razorpay Order ID</span>
                    <span className="admin-modal-value" style={{fontFamily: 'monospace'}}>
                      {viewingPayment.razorpay_order_id || 'N/A'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Payment Date</span>
                    <span className="admin-modal-value">
                      {formatDateNumeric(viewingPayment.payment_date || viewingPayment.created_at || viewingPayment.date)}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Payment Time</span>
                    <span className="admin-modal-value">
                      {formatBookingTime(viewingPayment.payment_date || viewingPayment.created_at || viewingPayment.date) || 'N/A'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Payment Method</span>
                    <span className="admin-modal-value">
                      {viewingPayment.payment_method || 'Online / Card'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Payment Status</span>
                    <span className="admin-modal-value">
                      {viewingPayment.status || 'Pending'}
                    </span>
                  </div>
                  <div className="admin-modal-field" style={{gridColumn: '1 / -1'}}>
                    <span className="admin-modal-label">Total Amount Paid</span>
                    <span className="admin-modal-value" style={{fontWeight: '700', color: '#8A158F', fontSize: '16px'}}>
                      &#8377;{Number(viewingPayment.amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Associated Booking & Guest Information */}
              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Booking & Guest Information</div>
                <div className="admin-modal-grid-2">
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Booking ID / Ref</span>
                    <span className="admin-modal-value admin-booking-id" style={{display: 'inline-block', width: 'fit-content'}}>
                      {viewingPayment.booking_reference || (viewingPayment.booking_id ? `MERI${String(viewingPayment.booking_id).padStart(4, '0')}` : 'N/A')}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Room / Property</span>
                    <span className="admin-modal-value">
                      {viewingPayment.room_name || viewingPayment.room_id || 'N/A'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Guest Name</span>
                    <span className="admin-modal-value admin-text-medium">
                      {viewingPayment.guest_name || 'Guest'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Mobile Number</span>
                    <span className="admin-modal-value">
                      {viewingPayment.guest_phone || 'N/A'}
                    </span>
                  </div>
                  {viewingPayment.guest_email && (
                    <div className="admin-modal-field">
                      <span className="admin-modal-label">Email Address</span>
                      <span className="admin-modal-value">
                        {viewingPayment.guest_email}
                      </span>
                    </div>
                  )}
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Booking Status</span>
                    <span className="admin-modal-value">
                      {getStatusBadge(viewingPayment.booking_status || (viewingPayment.booking ? viewingPayment.booking.status : 'Active'))}
                    </span>
                  </div>
                  {viewingPayment.coupon_code && (
                    <div className="admin-modal-field">
                      <span className="admin-modal-label">Coupon / Discount</span>
                      <span className="admin-modal-value">
                        {viewingPayment.coupon_code} {viewingPayment.discount ? `(-₹${viewingPayment.discount})` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notice if associated booking is cancelled */}
              {((viewingPayment.booking_status && viewingPayment.booking_status.toLowerCase().includes('cancel')) || (viewingPayment.booking && viewingPayment.booking.status && viewingPayment.booking.status.toLowerCase().includes('cancel'))) && (
                <div className="admin-modal-section" style={{borderLeft: '3px solid #f59e0b', backgroundColor: '#fffbeb', padding: '12px 14px', borderRadius: '6px'}}>
                  <div className="admin-modal-section-title" style={{color: '#b45309', marginBottom: '4px', borderBottomColor: '#fde68a'}}>Associated Reservation Cancelled</div>
                  <p style={{margin: 0, fontSize: '13px', color: '#92400e', lineHeight: '1.4'}}>
                    The reservation linked to this transaction has been cancelled. Review the transaction status and amount above to process any required refund or record keeping.
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-modal-btn-delete"
                onClick={() => {
                  const idToDelete = viewingPayment.id;
                  deletePayment(idToDelete);
                  setViewingPayment(null);
                }}
              >
                <Delete01Icon size={16} />
                <span>Delete</span>
              </button>

              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <button
                  type="button"
                  className="admin-modal-btn-close"
                  onClick={() => setViewingPayment(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="admin-modal-btn-edit"
                  onClick={() => {
                    const dtStr = formatDateNumeric(viewingPayment.payment_date || viewingPayment.created_at || viewingPayment.date);
                    const tmStr = formatBookingTime(viewingPayment.payment_date || viewingPayment.created_at || viewingPayment.date);
                    const receiptText = `MERAKI LIVING - PAYMENT RECEIPT\n--------------------------------\nTransaction ID: ${viewingPayment.razorpay_payment_id || '#PAY-'+viewingPayment.id}\nOrder ID: ${viewingPayment.razorpay_order_id || 'N/A'}\nBooking Ref: ${viewingPayment.booking_reference || 'N/A'}\nGuest Name: ${viewingPayment.guest_name}\nPhone: ${viewingPayment.guest_phone || 'N/A'}\nRoom: ${viewingPayment.room_name || viewingPayment.room_id}\nPayment Method: ${viewingPayment.payment_method || 'Online / Card'}\nStatus: ${viewingPayment.status}\nDate: ${dtStr} ${tmStr}\nAmount Paid: INR ${viewingPayment.amount}\n--------------------------------\nThank you for choosing Meraki Living!`;
                    const blob = new Blob([receiptText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Receipt_${viewingPayment.razorpay_payment_id || viewingPayment.id}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download02Icon size={16} />
                  <span>Download Receipt</span>
                </button>
              </div>
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
  const [currentPage, setCurrentPageNum] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const fetchCoupons = () => {
    fetch(`${API_CONFIG_URL}/api_coupons.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
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

  const totalCoupons = coupons.length;
  const totalPages = Math.ceil(totalCoupons / ITEMS_PER_PAGE) || 1;
  const safePage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedCoupons = coupons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="admin-fade-in" style={{minHeight: 'calc(100vh - 64px)'}}>
      <PageHeader
        title="Room Booking Coupons"
        subtitle="Manage discount coupons specifically for room reservations."
        action={
          <button className="admin-btn-primary" onClick={() => setEditingCoupon({status: 'Active', discount_percentage: ''})}>
            <PlusSignIcon size={18} /> Add New Coupon
          </button>
        }
      />
      
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-booking-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount Percentage</th>
                <th>Status</th>
                <th style={{textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoupons.map((c) => (
                <tr key={c.coupon_id}>
                  <td>
                    <span className="admin-booking-id" style={{letterSpacing: '0.8px', fontWeight: '700'}}>
                      {c.code}
                    </span>
                  </td>
                  <td>
                    <div style={{fontWeight: '600', color: '#0f172a', fontSize: '13px'}}>
                      {c.discount_percentage}% OFF
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(c.status)}
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <div className="admin-action-group" style={{justifyContent: 'flex-end'}}>
                      <button
                        type="button"
                        className="admin-btn-view"
                        onClick={() => setEditingCoupon(c)}
                        title="Edit Coupon"
                      >
                        <Edit01Icon size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="admin-modal-btn-delete"
                        style={{padding: '6px 10px', fontSize: '12px'}}
                        onClick={() => deleteCoupon(c.coupon_id)}
                        title="Delete Coupon"
                      >
                        <Delete01Icon size={14} />
                      </button>
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

        {/* Right-Aligned 10-Record Pagination */}
        {coupons.length > 0 && (
          <div className="admin-booking-pagination">
            <div className="admin-booking-pagination-info">
              Showing <strong>{startIndex + 1}</strong>&ndash;<strong>{Math.min(startIndex + ITEMS_PER_PAGE, totalCoupons)}</strong> of <strong>{totalCoupons}</strong> coupons
            </div>
            <div className="admin-booking-pagination-controls">
              <button
                type="button"
                className="admin-pagination-btn"
                disabled={safePage <= 1}
                onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Previous</span>
              </button>
              <span className="admin-pagination-page-indicator">
                Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                className="admin-pagination-btn"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPageNum(prev => Math.min(totalPages, prev + 1))}
              >
                <span>Next</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {editingCoupon && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-booking-modal-content" style={{maxWidth: '480px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '700'}}>
                {editingCoupon.coupon_id ? 'Edit Room Coupon' : 'Add New Coupon'}
              </h2>
              <button onClick={() => setEditingCoupon(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px'}}>
                <Cancel01Icon size={22} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="admin-booking-modal-body">
              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600', fontSize: '13px'}}>Coupon Code *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={editingCoupon.code || ''}
                  onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. ROOM20"
                  style={{border: '1px solid #cbd5e1', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', fontSize: '13px'}}
                />
              </div>

              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600', fontSize: '13px'}}>Discount Percentage (%) *</label>
                <input
                  type="number"
                  className="admin-form-input"
                  style={{fontSize: '13px'}}
                  value={editingCoupon.discount_percentage || ''}
                  onChange={e => setEditingCoupon({...editingCoupon, discount_percentage: e.target.value})}
                  placeholder="e.g. 15"
                />
              </div>

              <div className="admin-form-group" style={{margin: 0}}>
                <label className="admin-form-label" style={{marginBottom: '6px', color: '#334155', fontWeight: '600', fontSize: '13px'}}>Status</label>
                <select
                  className="admin-form-input"
                  style={{fontSize: '13px'}}
                  value={editingCoupon.status || 'Active'}
                  onChange={e => setEditingCoupon({...editingCoupon, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="admin-modal-footer" style={{justifyContent: 'flex-end'}}>
              <button className="admin-modal-btn-close" onClick={() => setEditingCoupon(null)}>Cancel</button>
              <button className="admin-modal-btn-edit" onClick={saveCoupon}>Save Coupon</button>
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
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedImageIds([]);
  };

  const fetchGallery = () => {
    fetch(`${API_CONFIG_URL}/api_gallery.php?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => { 
        if(data && data.status === 'success' && Array.isArray(data.data)) {
          const sorted = [...data.data].sort((a, b) => Number(a.image_id || a.id || 0) - Number(b.image_id || b.id || 0));
          setImages(sorted);
        }
      })
      .catch(e => console.error("JSON Error in Gallery:", e));
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e, category, oldImageId = null) => {
    const files = Array.from(e.target.files);
    e.target.value = '';
    
    if(files.length === 0) return;

    for (const file of files) {
      const validation = validateAvifFile(file);
      if (!validation.valid) {
        alert(validation.message);
        return;
      }
    }
    
    setIsLoading(true);
    setMessage(files.length > 1 ? `Uploading ${files.length} images...` : 'Uploading image...');
    
    let hasError = false;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (files.length > 1) {
          setMessage(`Uploading image ${i + 1} of ${files.length}...`);
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('action', 'upload');
        
        const uploadRes = await fetch(`${API_CONFIG_URL}/api_rooms.php`, {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        
        if(uploadData.status === 'success') {
           const galleryRes = await fetch(`${API_CONFIG_URL}/api_gallery.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image_url: uploadData.image_url, category })
           });
           const galleryData = await galleryRes.json();
           
           if(galleryData.status === 'success') {
              if (oldImageId && i === 0) {
                 await fetch(`${API_CONFIG_URL}/api_gallery.php`, {
                   method: 'DELETE',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ image_id: oldImageId })
                 });
              }
           } else {
              hasError = true;
           }
        } else {
          hasError = true;
        }
      }
      
      if (hasError) {
        setMessage('Error: Some images failed to upload');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Update successful!');
        setTimeout(() => setMessage(''), 3000);
      }
      
      fetchGallery();
      if (typeof window !== 'undefined') {
         window.dispatchEvent(new Event('galleryUpdated'));
         window.dispatchEvent(new Event('meraki_rooms_updated'));
         window.dispatchEvent(new Event('meraki_cafe_updated'));
         try {
           localStorage.setItem('meraki_gallery_updated_ts', Date.now().toString());
           localStorage.setItem('meraki_rooms_updated_ts', Date.now().toString());
           localStorage.setItem('meraki_cafe_updated_ts', Date.now().toString());
         } catch(e){}
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
        setSelectedImageIds(prev => prev.filter(x => x !== id));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('galleryUpdated'));
          window.dispatchEvent(new Event('meraki_rooms_updated'));
          window.dispatchEvent(new Event('meraki_cafe_updated'));
          try {
            localStorage.setItem('meraki_gallery_updated_ts', Date.now().toString());
            localStorage.setItem('meraki_rooms_updated_ts', Date.now().toString());
            localStorage.setItem('meraki_cafe_updated_ts', Date.now().toString());
          } catch(e){}
        }
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

  const toggleSelectImage = (id) => {
    setSelectedImageIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllSection = (sectionImages) => {
    const ids = sectionImages.map(img => img.image_id);
    const allSelected = ids.length > 0 && ids.every(id => selectedImageIds.includes(id));
    if (allSelected) {
      setSelectedImageIds(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelectedImageIds(prev => Array.from(new Set([...prev, ...ids])));
    }
  };

  const handleDeleteSelected = async (sectionId) => {
    const sectionImages = images.filter(img => img.category === sectionId);
    const toDelete = sectionImages.filter(img => selectedImageIds.includes(img.image_id));
    if (toDelete.length === 0) return;

    if (!window.confirm(`Are you sure you want to remove ${toDelete.length} selected image(s)?`)) return;

    setIsLoading(true);
    setMessage(`Removing ${toDelete.length} selected image(s)...`);

    try {
      let hasDeleteError = false;
      for (const img of toDelete) {
        const res = await fetch(`${API_CONFIG_URL}/api_gallery.php`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_id: img.image_id })
        });
        const data = await res.json();
        if (data.status !== 'success') {
          hasDeleteError = true;
        }
      }

      const deletedIds = new Set(toDelete.map(img => img.image_id));
      setImages(prev => prev.filter(img => !deletedIds.has(img.image_id)));
      setSelectedImageIds(prev => prev.filter(id => !deletedIds.has(id)));

      if (hasDeleteError) {
        setMessage('Warning: Some images could not be removed');
      } else {
        setMessage('Selected image(s) removed successfully!');
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('galleryUpdated'));
        window.dispatchEvent(new Event('meraki_rooms_updated'));
        window.dispatchEvent(new Event('meraki_cafe_updated'));
        try {
          localStorage.setItem('meraki_gallery_updated_ts', Date.now().toString());
          localStorage.setItem('meraki_rooms_updated_ts', Date.now().toString());
          localStorage.setItem('meraki_cafe_updated_ts', Date.now().toString());
        } catch(e){}
      }
    } catch (err) {
      console.error(err);
      setMessage('Error: An unexpected error occurred while deleting');
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

  const ROOM_IMAGES_SECTIONS = [...ROOMS_DATA].sort((a, b) => a.id - b.id).map(room => ({
    id: `Room Gallery - ${room.id}`,
    title: room.title
  }));

  const CAFE_AMBIANCE_SECTIONS = [
    { id: 'Cafe Ambiance Gallery', title: 'Cafe Ambiance Gallery' }
  ];

  const renderSectionBlock = (section) => {
    const sectionImages = images
      .filter(img => img.category === section.id)
      .sort((a, b) => Number(a.image_id || a.id || 0) - Number(b.image_id || b.id || 0));
    const selectedInThisSection = sectionImages.filter(img => selectedImageIds.includes(img.image_id));
    const allSelectedInThisSection = sectionImages.length > 0 && selectedInThisSection.length === sectionImages.length;

    return (
      <div key={section.id} className="admin-card" style={{marginBottom: '32px', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px'}}>
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px', flexWrap: 'wrap', gap: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <h3 style={{fontSize: '18px', fontWeight: 600, color: '#1a1a1a', margin: 0}}>{section.title}</h3>
              <span style={{fontSize: '13px', color: '#666', backgroundColor: '#f5f5f5', padding: '4px 10px', borderRadius: '20px'}}>{sectionImages.length} Images</span>
            </div>
            {sectionImages.length > 0 && (
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <button
                  type="button"
                  className="admin-btn-outline"
                  style={{padding: '6px 14px', fontSize: '13px', borderRadius: '6px', cursor: isLoading ? 'not-allowed' : 'pointer'}}
                  onClick={() => handleSelectAllSection(sectionImages)}
                  disabled={isLoading}
                >
                  {allSelectedInThisSection ? 'Deselect All' : 'Select All'}
                </button>
                {selectedInThisSection.length > 0 && (
                  <button
                    type="button"
                    className="admin-btn-outline"
                    style={{padding: '6px 14px', fontSize: '13px', borderRadius: '6px', backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer'}}
                    onClick={() => handleDeleteSelected(section.id)}
                    disabled={isLoading}
                  >
                    <Delete01Icon size={14} style={{marginRight: '6px'}} /> Delete Selected ({selectedInThisSection.length})
                  </button>
                )}
              </div>
            )}
         </div>
         
         <div className="admin-item-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px'}}>
            {sectionImages.map((img, index) => {
               const isSelected = selectedImageIds.includes(img.image_id);
               return (
                 <div 
                   key={img.image_id} 
                   style={{
                     border: isSelected ? '2px solid #8A158F' : '1px solid #e0e0e0', 
                     borderRadius: '10px', 
                     overflow: 'hidden', 
                     backgroundColor: '#fafafa', 
                     position: 'relative', 
                     display: 'flex', 
                     flexDirection: 'column',
                     transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                     boxShadow: isSelected ? '0 0 0 1px #8A158F' : 'none'
                   }}
                 >
                    <div style={{position: 'relative', width: '100%', height: '160px'}}>
                       <OptimizedImage src={img.image_url} alt={section.title} style={{width: '100%', height: '160px', objectFit: 'cover', display: 'block'}} loading="eager" width={220} height={160} decoding="async" noWrapper={true} />
                       <div 
                         style={{
                           position: 'absolute', 
                           top: '8px', 
                           left: '8px', 
                           zIndex: 2, 
                           backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                           borderRadius: '6px', 
                           padding: '4px 6px', 
                           display: 'flex', 
                           alignItems: 'center', 
                           boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                           cursor: 'pointer'
                         }}
                         onClick={(e) => { e.stopPropagation(); toggleSelectImage(img.image_id); }}
                       >
                         <input 
                           type="checkbox" 
                           checked={isSelected} 
                           onChange={() => toggleSelectImage(img.image_id)} 
                           style={{cursor: 'pointer', width: '16px', height: '16px', accentColor: '#8A158F', margin: 0}}
                         />
                       </div>
                    </div>
                    <div style={{padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', background: '#fff'}}>
                       <span style={{fontSize: '12px', color: '#666', fontWeight: 500}}>
                         #{index + 1}
                       </span>
                       <button className="admin-btn-outline" disabled={isLoading} style={{padding: '6px 10px', color: '#dc2626', borderColor: '#fca5a5', backgroundColor: '#fef2f2', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px'}} onClick={() => handleDeleteImage(img.image_id)} title="Delete image">
                          <Delete01Icon size={15} />
                       </button>
                    </div>
                 </div>
               );
            })}
            
            <label style={{border: '2px dashed #d9d9d9', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', cursor: isLoading ? 'not-allowed' : 'pointer', backgroundColor: '#fafbfc', transition: 'all 0.2s ease', opacity: isLoading ? 0.5 : 1}}>
               <PlusSignIcon size={28} style={{color: '#870097', marginBottom: '12px'}} />
               <span style={{color: '#333', fontWeight: 500, fontSize: '15px'}}>Upload Image(s)</span>
               <span style={{color: '#dc2626', fontSize: '11px', marginTop: '6px', fontWeight: '600'}}>⚠️ Only .avif image files are allowed.</span>
               <input type="file" multiple style={{display: 'none'}} disabled={isLoading} onChange={(e) => handleUpload(e, section.id, null)} accept=".avif,image/avif" />
            </label>
         </div>
      </div>
    );
  };

  return (
    <>
      <PageHeader title="Gallery Manager" subtitle="Manage images for required sections like Home Explore, Room Images, and Cafe Ambiance." />
      
      {message && (
        <div style={{ padding: '12px 20px', backgroundColor: message.includes('Error') ? '#fef2f2' : '#f0fdf4', color: message.includes('Error') ? '#dc2626' : '#16a34a', borderRadius: '8px', marginBottom: '24px', border: `1px solid ${message.includes('Error') ? '#fca5a5' : '#bbf7d0'}`, fontWeight: '500' }}>
          {message}
        </div>
      )}

      <div className="admin-filter-bar" style={{marginBottom: '32px', display: 'flex', gap: '12px', borderBottom: '1px solid #eee', paddingBottom: '16px'}}>
         <button className={`admin-filter-btn ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => handleTabChange('explore')} style={{fontSize: '15px'}} disabled={isLoading}>Home → Explore</button>
         <button className={`admin-filter-btn ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => handleTabChange('rooms')} style={{fontSize: '15px'}} disabled={isLoading}>Room Images</button>
         <button className={`admin-filter-btn ${activeTab === 'cafe' ? 'active' : ''}`} onClick={() => handleTabChange('cafe')} style={{fontSize: '15px'}} disabled={isLoading}>Cafe Ambiance</button>
      </div>
      
      <div style={{animation: 'fadeIn 0.3s ease'}}>
         {activeTab === 'explore' && HOME_EXPLORE_SECTIONS.map(renderSectionBlock)}
         {activeTab === 'rooms' && ROOM_IMAGES_SECTIONS.map(renderSectionBlock)}
         {activeTab === 'cafe' && CAFE_AMBIANCE_SECTIONS.map(renderSectionBlock)}
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

  const fetchNotifications = useCallback(() => {
    Promise.all([
      fetch(`${API_CONFIG_URL}/api_bookings.php`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_CONFIG_URL}/api_payments.php`).then(r => r.json()).catch(() => ({ data: [] }))
    ]).then(([bData, pData]) => {
      let notifs = [];
      if (bData && bData.status === 'success' && Array.isArray(bData.data)) {
        bData.data.filter(b => !isRemovedOfflineGuest(b)).forEach(b => {
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
        pData.data.filter(p => !isRemovedOfflineGuest(p.guest_name)).forEach(p => {
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

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('meraki_booking_updated', handleUpdate);
    window.addEventListener('meraki_rooms_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('meraki_booking_updated', handleUpdate);
      window.removeEventListener('meraki_rooms_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchNotifications]);

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

/* ==========================================================================
   Admin Chatbot Components: Guests, Conversations, Refund Requests
   ========================================================================== */

function AdminChatbotGuestsTab() {
  const [guests, setGuests] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGuests = useCallback(async (targetPage = 1, search = '') => {
    setLoading(true);
    setError('');
    try {
      const url = `${API_CONFIG_URL}/api_chatbot.php?action=admin_guests&page=${targetPage}&limit=20&search=${encodeURIComponent(search)}`;
      const res = await fetch(url, {
        headers: { 'Authorization': 'Bearer superadmin' }
      });
      const data = await res.json();
      if (data && data.status === 'success') {
        setGuests(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total || 0);
        setPage(data.page || targetPage);
        setTotalPages(data.total_pages || 1);
      } else {
        setError(data?.message || 'Failed to fetch chatbot guests.');
      }
    } catch {
      setError('Unable to connect to the chatbot server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests(1, searchTerm);
  }, [fetchGuests, searchTerm]);

  return (
    <>
      <PageHeader
        title="Chatbot Guests"
        subtitle="Directory of all guest contacts captured through the public concierge assistant."
      />

      {/* Summary Stat Card */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '24px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: '#fff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <UserGroupIcon size={24} color="#0f172a" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Total Chatbot Inquiries</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{total}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-chatbot-search-card">
        <input
          type="text"
          className="admin-chatbot-search-input"
          placeholder="Search guests by name, email, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="admin-btn-sm admin-btn-outline" onClick={() => setSearchTerm('')}>
            Clear
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <div className="cb-spinner" style={{ margin: '0 auto 12px' }}></div>
            <span>Loading chatbot guest records...</span>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>
            <p>{error}</p>
            <button className="admin-btn-sm admin-btn-primary" onClick={() => fetchGuests(page, searchTerm)} style={{ marginTop: '12px' }}>
              Retry
            </button>
          </div>
        ) : guests.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            <UserGroupIcon size={36} color="#94a3b8" style={{ margin: '0 auto 12px', display: 'block' }} />
            <h4 style={{ margin: '0 0 6px', color: '#373737' }}>No Guest Records Found</h4>
            <p style={{ margin: 0, fontSize: '13px' }}>
              {searchTerm ? 'No guests match your search filter.' : 'No guest contact details have been captured yet.'}
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-booking-table">
              <thead>
                <tr>
                  <th>Guest ID</th>
                  <th>Guest Name</th>
                  <th>Contact Details</th>
                  <th>Conversations</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => (
                  <tr key={g.id}>
                    <td>
                      <span className="admin-booking-id">#G-{String(g.id).padStart(3, '0')}</span>
                    </td>
                    <td className="admin-text-medium">{g.name}</td>
                    <td>
                      <div className="admin-cell-stack">
                        <span>{g.email}</span>
                        <span className="admin-cell-muted" style={{ fontSize: '11px' }}>{g.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge badge-info">{g.conversation_count || 0} {g.conversation_count === 1 ? 'Session' : 'Sessions'}</span>
                    </td>
                    <td>
                      {g.created_at ? (
                        <div className="admin-date-time-stack">
                          <span>{formatDateNumeric(g.created_at)}</span>
                          <span className="admin-time-sub">{formatBookingTime(g.created_at)}</span>
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total records)
            </span>
            <div className="admin-pagination-actions">
              <button
                className="admin-btn-sm admin-btn-outline"
                disabled={page <= 1}
                onClick={() => fetchGuests(page - 1, searchTerm)}
              >
                Previous
              </button>
              <button
                className="admin-btn-sm admin-btn-outline"
                disabled={page >= totalPages}
                onClick={() => fetchGuests(page + 1, searchTerm)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function AdminChatbotConversationsTab() {
  const [conversations, setConversations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Show Chat Modal state
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');

  const fetchConversations = useCallback(async (targetPage = 1, search = '') => {
    setLoading(true);
    setError('');
    try {
      const url = `${API_CONFIG_URL}/api_chatbot.php?action=admin_conversations&page=${targetPage}&limit=20&search=${encodeURIComponent(search)}`;
      const res = await fetch(url, {
        headers: { 'Authorization': 'Bearer superadmin' }
      });
      const data = await res.json();
      if (data && data.status === 'success') {
        setConversations(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total || 0);
        setPage(data.page || targetPage);
        setTotalPages(data.total_pages || 1);
      } else {
        setError(data?.message || 'Failed to fetch conversations.');
      }
    } catch {
      setError('Unable to connect to the conversations server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations(1, searchTerm);
  }, [fetchConversations, searchTerm]);

  const openShowChat = async (convId) => {
    setSelectedConvId(convId);
    setChatLoading(true);
    setChatError('');
    setChatData(null);
    try {
      const url = `${API_CONFIG_URL}/api_chatbot.php?action=get_conversation&conversation_id=${encodeURIComponent(convId)}`;
      const res = await fetch(url, {
        headers: { 'Authorization': 'Bearer superadmin' }
      });
      const data = await res.json();
      if (data && data.status === 'success' && data.data) {
        setChatData(data.data);
      } else {
        setChatError(data?.message || 'Conversation history not found.');
      }
    } catch {
      setChatError('Failed to load conversation messages.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Chatbot Conversations"
        subtitle="Review complete chronological chat transcripts and interactions across guest sessions."
      />

      {/* Search Bar */}
      <div className="admin-chatbot-search-card">
        <input
          type="text"
          className="admin-chatbot-search-input"
          placeholder="Search by Conversation ID, Guest Name, Email, or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="admin-btn-sm admin-btn-outline" onClick={() => setSearchTerm('')}>
            Clear
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <div className="cb-spinner" style={{ margin: '0 auto 12px' }}></div>
            <span>Loading conversation logs...</span>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>
            <p>{error}</p>
            <button className="admin-btn-sm admin-btn-primary" onClick={() => fetchConversations(page, searchTerm)} style={{ marginTop: '12px' }}>
              Retry
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            <Message01Icon size={36} color="#94a3b8" style={{ margin: '0 auto 12px', display: 'block' }} />
            <h4 style={{ margin: '0 0 6px', color: '#373737' }}>No Conversations Found</h4>
            <p style={{ margin: 0, fontSize: '13px' }}>
              {searchTerm ? 'No sessions match your search query.' : 'No chatbot conversation sessions recorded yet.'}
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-booking-table">
              <thead>
                <tr>
                  <th>Conversation ID</th>
                  <th>Guest Name</th>
                  <th>Contact Details</th>
                  <th>Messages</th>
                  <th>Last Message</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((c) => (
                  <tr key={c.id || c.conversation_id}>
                    <td>
                      <span className="admin-booking-id">
                        {c.conversation_id}
                      </span>
                    </td>
                    <td className="admin-text-medium">{c.guest_name || 'Guest'}</td>
                    <td>
                      <div className="admin-cell-stack">
                        <span>{c.guest_email || '—'}</span>
                        <span className="admin-cell-muted" style={{ fontSize: '11px' }}>{c.guest_phone || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge badge-primary">{c.message_count || 0} msgs</span>
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.last_message}>
                      {c.last_message ? `${c.last_sender === 'user' ? 'Guest: ' : 'Bot: '}${c.last_message}` : '—'}
                    </td>
                    <td>
                      {c.updated_at ? (
                        <div className="admin-date-time-stack">
                          <span>{formatDateNumeric(c.updated_at)}</span>
                          <span className="admin-time-sub">{formatBookingTime(c.updated_at)}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td>
                      <button
                        className="admin-btn-view"
                        onClick={() => openShowChat(c.conversation_id)}
                      >
                        Show Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total conversations)
            </span>
            <div className="admin-pagination-actions">
              <button
                className="admin-btn-sm admin-btn-outline"
                disabled={page <= 1}
                onClick={() => fetchConversations(page - 1, searchTerm)}
              >
                Previous
              </button>
              <button
                className="admin-btn-sm admin-btn-outline"
                disabled={page >= totalPages}
                onClick={() => fetchConversations(page + 1, searchTerm)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complete Conversation "Show Chat" Modal */}
      {selectedConvId && (
        <div className="admin-modal-overlay admin-fade-in" style={{ zIndex: 9999 }}>
          <div className="admin-modal-content" style={{ maxWidth: '720px' }}>
            <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#373737', fontWeight: '700' }}>
                  Conversation Transcript
                </h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>ID: {selectedConvId}</span>
              </div>
              <button
                onClick={() => setSelectedConvId(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F', padding: '4px' }}
                aria-label="Close Modal"
              >
                <Cancel01Icon size={22} strokeWidth={1.5} />
              </button>
            </div>

            {chatLoading ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                <div className="cb-spinner" style={{ margin: '0 auto 12px' }}></div>
                <span>Retrieving complete chat history...</span>
              </div>
            ) : chatError ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#dc2626' }}>
                <p>{chatError}</p>
                <button className="admin-btn-sm admin-btn-outline" onClick={() => openShowChat(selectedConvId)} style={{ marginTop: '12px' }}>
                  Retry
                </button>
              </div>
            ) : chatData ? (
              <>
                {/* Guest Overview Strip */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '13px' }}>
                  <div><strong>Guest:</strong> {chatData.guest_name || 'Anonymous'}</div>
                  {chatData.guest_email && <div><strong>Email:</strong> {chatData.guest_email}</div>}
                  {chatData.guest_phone && <div><strong>Phone:</strong> {chatData.guest_phone}</div>}
                  <div><strong>Total Messages:</strong> {chatData.messages?.length || 0}</div>
                </div>

                {/* Chronological Chat Messages Area */}
                <div className="admin-chat-transcript-wrap">
                  {!chatData.messages || chatData.messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No messages recorded in this conversation.
                    </div>
                  ) : (
                    chatData.messages.map((m, idx) => {
                      const isUser = m.sender === 'user';
                      return (
                        <div key={idx} className={`admin-chat-msg-row ${isUser ? 'user' : 'bot'}`}>
                          <span className="admin-chat-sender-tag">
                            {isUser ? (chatData.guest_name || 'Guest') : 'Meraki Concierge'}
                          </span>
                          <div className={`admin-chat-bubble ${isUser ? 'user' : 'bot'}`}>
                            {m.text}
                          </div>
                          {m.timestamp && (
                            <span className="admin-chat-timestamp">
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : null}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="admin-btn-sm admin-btn-outline" onClick={() => setSelectedConvId(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AdminChatbotRefundsTab() {
  const [refunds, setRefunds] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Detail & Status Modal State
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState('Pending');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [statusSuccess, setStatusSuccess] = useState('');

  const fetchRefunds = useCallback(async (targetPage = 1, search = '', status = 'All') => {
    setLoading(true);
    setError('');
    try {
      const url = `${API_CONFIG_URL}/api_chatbot.php?action=admin_refunds&page=${targetPage}&limit=20&search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`;
      const res = await fetch(url, {
        headers: { 'Authorization': 'Bearer superadmin' }
      });
      const data = await res.json();
      if (data && data.status === 'success') {
        setRefunds(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total || 0);
        setPage(data.page || targetPage);
        setTotalPages(data.total_pages || 1);
      } else {
        setError(data?.message || 'Failed to fetch refund requests.');
      }
    } catch {
      setError('Unable to connect to the refunds service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRefunds(1, searchTerm, statusFilter);
  }, [fetchRefunds, searchTerm, statusFilter]);

  const handleStatusUpdate = async (refundId, newStatus) => {
    setUpdatingStatus(true);
    setStatusError('');
    setStatusSuccess('');
    try {
      const res = await fetch(`${API_CONFIG_URL}/api_chatbot.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer superadmin'
        },
        body: JSON.stringify({
          action: 'admin_update_refund_status',
          id: refundId,
          status: newStatus
        })
      });
      const data = await res.json();
      if (data && data.status === 'success' && data.data) {
        setSelectedRefund(data.data);
        setStatusSuccess(`Refund request status updated to "${newStatus}" successfully.`);
        fetchRefunds(page, searchTerm, statusFilter);
        window.dispatchEvent(new Event('meraki_booking_updated'));
        window.dispatchEvent(new Event('meraki_rooms_updated'));
      } else {
        setStatusError(data?.message || 'Failed to update refund status.');
      }
    } catch {
      setStatusError('Unable to update refund status. Please check your connection.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'processed':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      case 'pending':
      default:
        return 'badge-warning';
    }
  };

  return (
    <>
      <PageHeader
        title="Chatbot Refund Requests"
        subtitle="Manage and process cancellation refund inquiries submitted via Concierge assistant."
      />

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <div className="admin-filter-bar">
          {['All', 'Pending', 'Approved', 'Rejected', 'Processed'].map((st) => (
            <button
              key={st}
              className={`admin-filter-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="admin-chatbot-search-input"
            placeholder="Search by Booking ID, Guest Name, Email, Phone, or Reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="admin-btn-sm admin-btn-outline" onClick={() => setSearchTerm('')}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <div className="cb-spinner" style={{ margin: '0 auto 12px' }}></div>
            <span>Loading refund requests...</span>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>
            <p>{error}</p>
            <button className="admin-btn-sm admin-btn-primary" onClick={() => fetchRefunds(page, searchTerm, statusFilter)} style={{ marginTop: '12px' }}>
              Retry
            </button>
          </div>
        ) : refunds.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            <File02Icon size={36} color="#94a3b8" style={{ margin: '0 auto 12px', display: 'block' }} />
            <h4 style={{ margin: '0 0 6px', color: '#373737' }}>No Refund Requests Found</h4>
            <p style={{ margin: 0, fontSize: '13px' }}>
              {searchTerm || statusFilter !== 'All' ? 'No refund records match the specified filters.' : 'No refund requests have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-booking-table">
              <thead>
                <tr>
                  <th>Refund ID</th>
                  <th>Booking ID</th>
                  <th>Guest Name</th>
                  <th>Contact Details</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Submitted On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className="admin-booking-id">#RF-{String(r.id).padStart(3, '0')}</span>
                    </td>
                    <td className="admin-text-medium" style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                      {r.booking_id}
                    </td>
                    <td>{r.guest_name}</td>
                    <td>
                      <div className="admin-cell-stack">
                        <span>{r.guest_email}</span>
                        <span className="admin-cell-muted" style={{ fontSize: '11px' }}>{r.guest_phone}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.reason}>
                      {r.reason}
                    </td>
                    <td>
                      <span className={`admin-badge ${getStatusBadgeClass(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.created_at ? (
                        <div className="admin-date-time-stack">
                          <span>{formatDateNumeric(r.created_at)}</span>
                          <span className="admin-time-sub">{formatBookingTime(r.created_at)}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td>
                      <button
                        className="admin-btn-view"
                        onClick={() => {
                          setSelectedRefund(r);
                          setStatusToUpdate(r.status || 'Pending');
                          setStatusError('');
                          setStatusSuccess('');
                        }}
                      >
                        View / Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total requests)
            </span>
            <div className="admin-pagination-actions">
              <button
                className="admin-btn-sm admin-btn-outline"
                disabled={page <= 1}
                onClick={() => fetchRefunds(page - 1, searchTerm, statusFilter)}
              >
                Previous
              </button>
              <button
                className="admin-btn-sm admin-btn-outline"
                disabled={page >= totalPages}
                onClick={() => fetchRefunds(page + 1, searchTerm, statusFilter)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Refund Details & Status Management Modal */}
      {selectedRefund && (
        <div className="admin-modal-overlay admin-fade-in" style={{ zIndex: 9999 }}>
          <div className="admin-modal-content" style={{ maxWidth: '640px' }}>
            <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#373737', fontWeight: '700' }}>
                  Refund Request #{String(selectedRefund.id).padStart(3, '0')}
                </h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Booking ID: <strong>{selectedRefund.booking_id}</strong>
                </span>
              </div>
              <button
                onClick={() => setSelectedRefund(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F', padding: '4px' }}
                aria-label="Close Modal"
              >
                <Cancel01Icon size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Refund Info Grid */}
            <div className="admin-refund-details-grid">
              <div className="admin-refund-detail-item">
                <div className="admin-refund-detail-label">Guest Name</div>
                <div className="admin-refund-detail-val">{selectedRefund.guest_name}</div>
              </div>
              <div className="admin-refund-detail-item">
                <div className="admin-refund-detail-label">Current Status</div>
                <div className="admin-refund-detail-val">
                  <span className={`admin-badge ${getStatusBadgeClass(selectedRefund.status)}`}>
                    {selectedRefund.status}
                  </span>
                </div>
              </div>
              <div className="admin-refund-detail-item">
                <div className="admin-refund-detail-label">Email Address</div>
                <div className="admin-refund-detail-val">{selectedRefund.guest_email}</div>
              </div>
              <div className="admin-refund-detail-item">
                <div className="admin-refund-detail-label">Phone Number</div>
                <div className="admin-refund-detail-val">{selectedRefund.guest_phone}</div>
              </div>
              <div className="admin-refund-detail-item full-width">
                <div className="admin-refund-detail-label">Refund Reason</div>
                <div className="admin-refund-detail-val">{selectedRefund.reason}</div>
              </div>
              {selectedRefund.message && (
                <div className="admin-refund-detail-item full-width">
                  <div className="admin-refund-detail-label">Additional Message / Notes</div>
                  <div className="admin-refund-detail-val">{selectedRefund.message}</div>
                </div>
              )}
              <div className="admin-refund-detail-item full-width">
                <div className="admin-refund-detail-label">Submission Date</div>
                <div className="admin-refund-detail-val">
                  {selectedRefund.created_at ? new Date(selectedRefund.created_at).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            {/* Status Update Control */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#373737', marginBottom: '8px' }}>
                Update Refund Status
              </label>

              {statusSuccess && (
                <div style={{ padding: '8px 12px', background: '#ecfdf5', color: '#059669', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' }}>
                  {statusSuccess}
                </div>
              )}
              {statusError && (
                <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#dc2626', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' }}>
                  {statusError}
                </div>
              )}

              <div className="admin-status-select-wrap">
                <select
                  className="admin-select-input"
                  value={statusToUpdate}
                  onChange={(e) => setStatusToUpdate(e.target.value)}
                  disabled={updatingStatus}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Processed">Processed</option>
                </select>

                <button
                  className="admin-btn-sm admin-btn-primary"
                  disabled={updatingStatus || statusToUpdate === selectedRefund.status}
                  onClick={() => handleStatusUpdate(selectedRefund.id, statusToUpdate)}
                >
                  {updatingStatus ? 'Updating...' : 'Save New Status'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="admin-btn-sm admin-btn-outline" onClick={() => setSelectedRefund(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function OwnAVillaTab({ subTab }) {
  const enquiryFilter = subTab === 'contact-us' ? 'Contact Us' : 'Own A Villa';
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingEnquiry, setViewingEnquiry] = useState(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (enquiryFilter === 'Contact Us') {
        res = await fetch(`${API_CONFIG_URL}/api_contact.php`);
        if (res.status === 404) {
          res = await fetch(`${API_CONFIG_URL}/api_contactus.php`);
        }
      } else {
        res = await fetch(`${API_CONFIG_URL}/api_ownvilla.php`);
        if (res.status === 404) {
          res = await fetch(`${API_CONFIG_URL}/api_ownvilla_enquiries.php`);
        }
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      let rawList = [];
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        rawList = data.data;
      } else if (Array.isArray(data)) {
        rawList = data;
      } else if (data && data.status === 'error') {
        setError(data.message || `Failed to fetch ${enquiryFilter.toLowerCase()} enquiries.`);
        setEnquiries([]);
        return;
      } else {
        setEnquiries([]);
        return;
      }

      // Sort items chronologically ascending (oldest first) to assign separate 5-digit sequence IDs (00001..N)
      const sortedAsc = [...rawList].sort((a, b) => {
        const idA = Number(a.id) || 0;
        const idB = Number(b.id) || 0;
        if (idA !== idB) return idA - idB;
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      });

      const seqMap = new Map();
      sortedAsc.forEach((item, index) => {
        const seqStr = String(index + 1).padStart(5, '0');
        const key = item.id !== undefined && item.id !== null ? item.id : item;
        seqMap.set(key, seqStr);
      });

      const processed = rawList.map((item, index) => {
        const key = item.id !== undefined && item.id !== null ? item.id : item;
        const seqStr = seqMap.get(key) || String(rawList.length - index).padStart(5, '0');
        return {
          ...item,
          enquiry_seq_id: seqStr
        };
      });

      setEnquiries(processed);
    } catch (err) {
      setError(`Unable to load ${enquiryFilter.toLowerCase()} enquiries from server.`);
    } finally {
      setLoading(false);
    }
  }, [enquiryFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const filteredEnquiries = enquiries.filter(item => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const seqId = (item.enquiry_seq_id || '').toLowerCase();
    const name = (item.name || item.full_name || '').toLowerCase();
    const phone = (item.mobile_number || item.phone_number || '').toLowerCase();
    const email = (item.email || item.email_address || '').toLowerCase();
    const type = (item.enquiry_type || '').toLowerCase();
    const msg = (item.message || '').toLowerCase();
    return seqId.includes(term) || name.includes(term) || phone.includes(term) || email.includes(term) || type.includes(term) || msg.includes(term);
  });

  const sectionSubtitle = enquiryFilter === 'Own A Villa'
    ? 'Manage leads and consultation requests submitted through the Own A Villa page.'
    : 'Manage enquiries and messages submitted through the Contact Us page.';

  return (
    <div className="admin-fade-in" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <PageHeader
        title={enquiryFilter === 'Own A Villa' ? 'Own A Villa Enquiries' : 'Contact Us Enquiries'}
        subtitle={sectionSubtitle}
        action={
          <button
            className="admin-btn-outline"
            onClick={fetchEnquiries}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: loading ? 'cb-spin 1s linear infinite' : 'none' }}
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            Refresh
          </button>
        }
      />

      {/* Stat Card */}
      <div
        className="admin-card"
        style={{
          marginBottom: '24px',
          padding: '24px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div
          style={{
            background: '#fff',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}
        >
          {enquiryFilter === 'Own A Villa' ? (
            <Home01Icon size={24} color="#0f172a" />
          ) : (
            <Mail01Icon size={24} color="#0f172a" />
          )}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
            Total {enquiryFilter === 'Own A Villa' ? 'Villa' : 'Contact Us'} Enquiries
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
            {enquiries.length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-chatbot-search-card" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          className="admin-chatbot-search-input"
          placeholder="Search by enquiry ID (e.g. 00001), name, phone, email, enquiry topic, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="admin-btn-sm admin-btn-outline" onClick={() => setSearchTerm('')}>
            Clear
          </button>
        )}
      </div>

      {/* Main Table Card */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <div className="cb-spinner" style={{ margin: '0 auto 12px' }}></div>
            <span>Loading {enquiryFilter.toLowerCase()} enquiries...</span>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>
            <p>{error}</p>
            <button
              className="admin-btn-sm admin-btn-primary"
              onClick={fetchEnquiries}
              style={{ marginTop: '12px' }}
            >
              Retry
            </button>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            {enquiryFilter === 'Own A Villa' ? (
              <Home01Icon size={36} color="#94a3b8" style={{ margin: '0 auto 12px', display: 'block' }} />
            ) : (
              <Mail01Icon size={36} color="#94a3b8" style={{ margin: '0 auto 12px', display: 'block' }} />
            )}
            <h4 style={{ margin: '0 0 6px', color: '#373737' }}>No Enquiries Found</h4>
            <p style={{ margin: 0, fontSize: '13px' }}>
              {searchTerm
                ? 'No enquiries match your search query.'
                : `No ${enquiryFilter.toLowerCase()} enquiries have been submitted yet.`}
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-booking-table">
              <thead>
                <tr>
                  <th>Enquiry ID</th>
                  <th>Name</th>
                  <th>Contact Details</th>
                  <th>Enquiry Type</th>
                  <th>Message Preview</th>
                  <th>Date &amp; Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((item, idx) => {
                  const itemDate = formatDateNumeric(item.created_at);
                  const itemTime = formatBookingTime(item.created_at);
                  const itemName = item.name || item.full_name || '—';
                  const itemPhone = item.mobile_number || item.phone_number || '';
                  const itemEmail = item.email || item.email_address || '';
                  return (
                    <tr key={item.id || idx}>
                      <td>
                        <span className="admin-booking-id">
                          {item.enquiry_seq_id || String(idx + 1).padStart(5, '0')}
                        </span>
                      </td>
                      <td className="admin-text-medium">{itemName}</td>
                      <td>
                        <div className="admin-cell-stack">
                          {itemPhone ? (
                            <span style={{ fontWeight: '500' }}>{itemPhone}</span>
                          ) : (
                            <span className="admin-cell-muted">No phone</span>
                          )}
                          {itemEmail ? (
                            <span className="admin-cell-muted" style={{ fontSize: '11px' }}>
                              {itemEmail}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge badge-primary" style={{ whiteSpace: 'nowrap' }}>
                          {item.enquiry_type || 'General Enquiry'}
                        </span>
                      </td>
                      <td>
                        <div
                          style={{
                            maxWidth: '260px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#475569',
                            fontSize: '13px'
                          }}
                          title={item.message}
                        >
                          {item.message || <em style={{ color: '#94a3b8' }}>No message</em>}
                        </div>
                      </td>
                      <td>
                        <div className="admin-cell-stack">
                          <span>{itemDate}</span>
                          {itemTime && (
                            <span className="admin-cell-muted" style={{ fontSize: '11px' }}>
                              {itemTime}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn-sm admin-btn-outline"
                          onClick={() => setViewingEnquiry(item)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          title="View Full Enquiry Details"
                        >
                          <EyeIcon size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Enquiry Modal */}
      {viewingEnquiry && (
        <div
          className="admin-modal-overlay admin-fade-in"
          style={{ zIndex: 9999 }}
          onClick={() => setViewingEnquiry(null)}
        >
          <div
            className="admin-booking-modal-content"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="admin-modal-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '19px', color: '#373737', fontWeight: '700' }}>
                  {enquiryFilter === 'Own A Villa' ? 'Villa Enquiry Details' : 'Contact Us Enquiry Details'}
                </h2>
                <span className="admin-booking-id" style={{ fontSize: '12px' }}>
                  Enquiry ID: {viewingEnquiry.enquiry_seq_id || '00001'}
                </span>
                {viewingEnquiry.enquiry_type && (
                  <span className="admin-badge badge-info">
                    {viewingEnquiry.enquiry_type}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setViewingEnquiry(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Close"
              >
                <Cancel01Icon size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="admin-booking-modal-body">
              {/* Section 1: Lead Information */}
              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Lead Information</div>
                <div className="admin-modal-grid-2">
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Enquiry ID</span>
                    <span className="admin-modal-value admin-text-medium" style={{ color: '#8A158F', fontWeight: '600' }}>
                      {viewingEnquiry.enquiry_seq_id || '00001'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Name</span>
                    <span className="admin-modal-value admin-text-medium">
                      {viewingEnquiry.name || viewingEnquiry.full_name || '—'}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Mobile Number</span>
                    <span className="admin-modal-value">
                      {(viewingEnquiry.mobile_number || viewingEnquiry.phone_number) ? (
                        <a
                          href={`tel:${viewingEnquiry.mobile_number || viewingEnquiry.phone_number}`}
                          style={{ color: '#8A158F', textDecoration: 'none', fontWeight: '500' }}
                        >
                          {viewingEnquiry.mobile_number || viewingEnquiry.phone_number}
                        </a>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Email Address</span>
                    <span className="admin-modal-value">
                      {(viewingEnquiry.email || viewingEnquiry.email_address) ? (
                        <a
                          href={`mailto:${viewingEnquiry.email || viewingEnquiry.email_address}`}
                          style={{ color: '#8A158F', textDecoration: 'none', fontWeight: '500' }}
                        >
                          {viewingEnquiry.email || viewingEnquiry.email_address}
                        </a>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Enquiry Type</span>
                    <span className="admin-modal-value">
                      {viewingEnquiry.enquiry_type || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Timestamp */}
              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Submission Timestamp</div>
                <div className="admin-modal-grid-2">
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Enquiry Date</span>
                    <span className="admin-modal-value">
                      {formatDateNumeric(viewingEnquiry.created_at)}
                    </span>
                  </div>
                  <div className="admin-modal-field">
                    <span className="admin-modal-label">Enquiry Time</span>
                    <span className="admin-modal-value">
                      {formatBookingTime(viewingEnquiry.created_at) || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Message */}
              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Message / Query</div>
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {viewingEnquiry.message ? (
                    viewingEnquiry.message
                  ) : (
                    <em style={{ color: '#94a3b8' }}>No message provided</em>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}