const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

// CafeMenuTab needs its own tbody back!
// But wait, CafeMenuTab was completely replaced by patch_cafemenutab_full.js!
// Let's just re-run patch_cafemenutab_full.js content!
const cafeMenuTabFull = `function CafeMenuTab() {
  const [activeCategory, setActiveCategory] = React.useState('Breakfast');
  const [allItems, setAllItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingItem, setEditingItem] = React.useState(null);

  const categories = [
    'Breakfast', 'Pahadi Khana', 'All Day Snacks', 'Rice & Roti', 'Add Ons', 'Teas', 'Beverages & Soups'
  ];

  const fetchCafeMenu = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost/merakiliving_backend/api_cafe.php');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setAllItems(data.data);
        }
      }
    } catch (error) {}
    setIsLoading(false);
  };

  React.useEffect(() => { fetchCafeMenu(); }, []);

  const handleSaveItem = async () => {
    try {
      const method = editingItem.item_id ? 'PUT' : 'POST';
      const res = await fetch('http://localhost/merakiliving_backend/api_cafe.php', {
        method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingItem)
      });
      if (res.ok) fetchCafeMenu();
    } catch (error) {}
    setEditingItem(null);
  };

  const filteredItems = allItems.filter(i => i.category === activeCategory);

  return (
    <>
      <PageHeader title="Full Menu Categories" subtitle="Manage all menu items." action={<button className="admin-btn-primary" onClick={() => setEditingItem({ title: '', price: '', category: activeCategory, is_veg: 1, description: '' })}>Add Menu Item</button>} />
      <div className="admin-card">
        <div className="admin-filter-bar">
          {categories.map(cat => (
            <button key={cat} className={\`admin-filter-btn \${activeCategory === cat ? 'active' : ''}\`} onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>
        <div className="admin-table-wrapper">
          {isLoading && allItems.length === 0 ? ( <div style={{padding: '24px'}}>Loading...</div> ) : (
            <table className="admin-table">
              <thead><tr><th>Item Name</th><th>Price (₹)</th><th>Diet</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="admin-text-medium">{item.title}</td><td>₹{item.price}</td>
                    <td><span className={item.is_veg == 1 ? 'admin-text-veg' : 'admin-text-nonveg'}>{item.is_veg == 1 ? 'Veg' : 'Non-Veg'}</span></td>
                    <td className="admin-cell-muted">{item.description || '-'}</td>
                    <td><span className="admin-badge badge-success">{item.status || 'Available'}</span></td>
                    <td><button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingItem(item)}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content admin-fade-in" style={{maxWidth: '500px'}}>
            <div className="admin-form-group"><label>Title</label><input type="text" className="admin-form-input" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /></div>
            <div className="admin-form-group"><label>Price</label><input type="number" className="admin-form-input" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: e.target.value})} /></div>
            <div className="admin-form-group"><label>Description</label><input type="text" className="admin-form-input" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} /></div>
            <div className="admin-form-group"><label>Veg/Non-Veg</label><select className="admin-form-input" value={editingItem.is_veg} onChange={e => setEditingItem({...editingItem, is_veg: parseInt(e.target.value)})}><option value={1}>Veg</option><option value={0}>Non-Veg</option></select></div>
            <button className="admin-btn-primary admin-btn-full" onClick={handleSaveItem}>Save Changes</button>
            <button className="admin-btn-outline admin-btn-full" style={{marginTop: '10px'}} onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
`;

// Replace CafeMenuTab completely
c = c.replace(/function CafeMenuTab\(\) \{[\s\S]*?\}\s*function GuestsTab\(\)/, cafeMenuTabFull + '\n\nfunction GuestsTab()');

// GuestsTab
const guestsTabRegex = /function GuestsTab\(\) \{[\s\S]*?\}\s*function PaymentsTab\(\)/;
const guestsTabFixed = `function GuestsTab() {
  const [guests, setGuests] = React.useState([]);
  React.useEffect(() => { fetch('http://localhost/merakiliving_backend/api_guests.php').then(r => r.json()).then(d => { if(Array.isArray(d.data)) setGuests(d.data); }); }, []);
  return (
    <>
      <PageHeader title="Guest Directory" subtitle="Manage guest information and stay history." />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Guest Name</th><th>Contact Info</th><th>Total Stays</th><th>Last Room</th><th>Actions</th></tr></thead>
            <tbody>
              {guests.map(g => (
                <tr key={g.id}>
                  <td className="admin-text-medium">{g.name}</td>
                  <td><div className="admin-cell-stack"><span>{g.email}</span><span className="admin-cell-muted">{g.phone}</span></div></td>
                  <td>{g.total_stays || 0}</td>
                  <td>{g.last_room || 'N/A'}</td>
                  <td><button className="admin-btn-sm admin-btn-outline" onClick={() => alert(g.name + " has " + (g.total_stays||0) + " stays.")}>History</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PaymentsTab()`;
c = c.replace(guestsTabRegex, guestsTabFixed);

// PaymentsTab
const paymentsTabRegex = /function PaymentsTab\(\) \{[\s\S]*?\}\s*function CouponsTab\(\)/;
const paymentsTabFixed = `function PaymentsTab() {
  const [payments, setPayments] = React.useState([]);
  React.useEffect(() => { fetch('http://localhost/merakiliving_backend/api_payments.php').then(r => r.json()).then(d => { if(Array.isArray(d.data)) setPayments(d.data); }); }, []);
  return (
    <>
      <PageHeader title="Payment Transactions" subtitle="Track all payments." />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Transaction ID</th><th>Booking Ref</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td className="admin-text-mono">{p.razorpay_payment_id || p.id}</td>
                  <td className="admin-text-medium">#BK-{p.booking_id || p.ref}</td>
                  <td className="admin-text-medium">₹{p.amount}</td>
                  <td>Credit Card</td>
                  <td>{new Date().toLocaleDateString()}</td>
                  <td><span className={"admin-badge badge-" + (p.status === "Success" ? "success" : "warning")}>{p.status}</span></td>
                  <td><button className="admin-btn-sm admin-btn-outline">Receipt</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CouponsTab()`;
c = c.replace(paymentsTabRegex, paymentsTabFixed);

// CouponsTab
const couponsTabRegex = /function CouponsTab\(\) \{[\s\S]*?\}\s*function GalleryTab\(\)/;
const couponsTabFixed = `function CouponsTab() {
  const [coupons, setCoupons] = React.useState([]);
  React.useEffect(() => { fetch('http://localhost/merakiliving_backend/api_coupons.php').then(r => r.json()).then(d => { if(Array.isArray(d.data)) setCoupons(d.data); }); }, []);
  return (
    <>
      <PageHeader title="Coupons & Discounts" subtitle="Manage promotional codes." action={<button className="admin-btn-primary">New Coupon</button>} />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Coupon Code</th><th>Discount (%)</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.coupon_id}>
                  <td className="admin-text-mono">{c.code}</td>
                  <td>{c.discount_percentage}%</td>
                  <td><span className={"admin-badge badge-" + (c.status === "Active" ? "success" : "danger")}>{c.status}</span></td>
                  <td><button className="admin-btn-sm admin-btn-outline" onClick={() => {
                     fetch('http://localhost/merakiliving_backend/api_coupons.php', { method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({coupon_id: c.coupon_id}) }).then(()=>window.location.reload());
                  }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function GalleryTab()`;
c = c.replace(couponsTabRegex, couponsTabFixed);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Completely fixed tabs.");
