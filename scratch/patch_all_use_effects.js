const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const insertAfter = (str, target, insert) => {
  const index = str.indexOf(target);
  if (index === -1) return str;
  const insertIndex = index + target.length;
  return str.slice(0, insertIndex) + '\n' + insert + str.slice(insertIndex);
};

// BookingsTab
c = insertAfter(c, 'const [bookings, setBookings] = React.useState([]);', `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_bookings.php');
        if (res.ok) { const d = await res.json(); if(Array.isArray(d.data)) setBookings(d.data); }
      } catch (e) {}
    }; fetchData();
  }, []);
`);
c = c.replace(/<td>\{b\.guestName\}<\/td>/g, '<td>{b.guest_name}</td>');
c = c.replace(/<td>\{b\.room\}<\/td>/g, '<td>{b.room_name}</td>');
c = c.replace(/<span>\{b\.dates\}<\/span>/g, '<span>{b.check_in} to {b.check_out}</span>');
c = c.replace(/<td className="admin-text-medium">.*?\{b\.amount\}<\/td>/, '<td className="admin-text-medium">₹{b.room_price}</td>');

// CalendarTab
c = insertAfter(c, 'const [events, setEvents] = React.useState([]);', `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_bookings.php');
        if (res.ok) { 
          const d = await res.json(); 
          if(Array.isArray(d.data)) {
            setEvents(d.data.map(b => ({
               room: b.room_name, guest: b.guest_name,
               start: parseInt(b.check_in.split('-')[2]), end: parseInt(b.check_out.split('-')[2]),
               status: b.status
            })));
          }
        }
      } catch (e) {}
    }; fetchData();
  }, []);
`);
c = c.replace(/<span className="calendar-event-title">\{ev\.room\} \(\{ev\.guest\}\)<\/span>/, '<span className="calendar-event-title">{ev.room} ({ev.guest})</span>');

// PricingTab
c = insertAfter(c, 'const [rooms, setRooms] = React.useState([]);', `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_rooms.php');
        if (res.ok) { const d = await res.json(); if(Array.isArray(d.data)) setRooms(d.data); }
      } catch (e) {}
    }; fetchData();
  }, []);
`);
c = c.replace(/<h2 className="admin-card-title".*?>\{room\.title\}<\/h2>/, '<h2 className="admin-card-title" style={{marginBottom: "16px", fontSize: "16px"}}>{room.name}</h2>');

// CafeFeaturedTab
c = insertAfter(c, 'const [items, setItems] = React.useState([]);', `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_cafe.php');
        if (res.ok) { const d = await res.json(); if(Array.isArray(d.data)) setItems(d.data.filter(i => i.is_featured == 1)); }
      } catch (e) {}
    }; fetchData();
  }, []);
`);
c = c.replace(/<h3 className="admin-item-title">\{item\.title\}<\/h3>/, '<h3 className="admin-item-title">{item.title}</h3>');
c = c.replace(/<span className="admin-cell-muted">Original: .*?\{item\.origPrice\}<\/span>/, '<span className="admin-cell-muted">Original: ₹{item.original_price}</span>');
c = c.replace(/\{item\.veg \? 'Veg' : 'Non-Veg'\}/g, "{item.is_veg == 1 ? 'Veg' : 'Non-Veg'}");
c = c.replace(/className=\{item\.veg \? 'admin-text-veg' : 'admin-text-nonveg'\}/g, "className={item.is_veg == 1 ? 'admin-text-veg' : 'admin-text-nonveg'}");

// GuestsTab
c = insertAfter(c, 'const [guests, setGuests] = React.useState([]);', `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_guests.php');
        if (res.ok) { const d = await res.json(); if(Array.isArray(d.data)) setGuests(d.data); }
      } catch (e) {}
    }; fetchData();
  }, []);
`);
c = c.replace(/<td>\{g\.totalStays\}<\/td>/g, '<td>{g.total_stays || 0}</td>');
c = c.replace(/<td>\{g\.lastRoom\}<\/td>/g, '<td>{g.last_room || "N/A"}</td>');

// PaymentsTab
c = insertAfter(c, 'const [payments, setPayments] = React.useState([]);', `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_payments.php');
        if (res.ok) { const d = await res.json(); if(Array.isArray(d.data)) setPayments(d.data); }
      } catch (e) {}
    }; fetchData();
  }, []);
`);
c = c.replace(/<td className="admin-text-mono">\{p\.id\}<\/td>/, '<td className="admin-text-mono">{p.razorpay_payment_id || p.id}</td>');
c = c.replace(/<td className="admin-text-medium">\{p\.ref\}<\/td>/, '<td className="admin-text-medium">#BK-{p.booking_id || p.ref}</td>');

// CouponsTab
c = insertAfter(c, 'const [coupons, setCoupons] = React.useState([]);', `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_coupons.php');
        if (res.ok) { const d = await res.json(); if(Array.isArray(d.data)) setCoupons(d.data); }
      } catch (e) {}
    }; fetchData();
  }, []);
`);

// GalleryTab
c = insertAfter(c, 'const [images, setImages] = React.useState([]);', `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_gallery.php');
        if (res.ok) { const d = await res.json(); if(Array.isArray(d.data)) setImages(d.data); }
      } catch (e) {}
    }; fetchData();
  }, []);
`);

// ReviewsTab
c = insertAfter(c, 'const [reviews, setReviews] = React.useState([]);', `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_reviews.php');
        if (res.ok) { const d = await res.json(); if(Array.isArray(d.data)) setReviews(d.data); }
      } catch (e) {}
    }; fetchData();
  }, []);
`);

// PoliciesTab
// This one may just use settings endpoint or we can mock since we didn't create api_policies
c = insertAfter(c, "const [policies, setPolicies] = React.useState({ privacyPolicy: '', terms: '', cancellation: '' });", `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_settings.php');
        if (res.ok) { 
          const d = await res.json(); 
          if(d.data && d.data.length > 0) {
            const s = d.data[0];
            setPolicies({ privacyPolicy: s.privacy_policy_text || '', terms: s.terms_conditions_text || '', cancellation: s.cancellation_policy_text || '' });
          }
        }
      } catch (e) {}
    }; fetchData();
  }, []);
`);

// SettingsTab
c = insertAfter(c, "const [settings, setSettings] = React.useState({ gst: '', phone: '', email: '', address: '' });", `
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_settings.php');
        if (res.ok) { 
          const d = await res.json(); 
          if(d.data && d.data.length > 0) {
            const s = d.data[0];
            setSettings({ gst: s.global_gst_percentage || '', phone: s.contact_phone || '', email: s.contact_email || '', address: s.physical_address || '' });
          }
        }
      } catch (e) {}
    }; fetchData();
  }, []);
`);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched all useEffects and rendering maps.");
