const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const cafeMenuTabFull = `function CafeMenuTab() {
  const [activeCategory, setActiveCategory] = useState('Breakfast');
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
    } catch (error) {
      console.error("Failed to fetch cafe menu:", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchCafeMenu();
  }, []);

  const handleSaveItem = async () => {
    try {
      const method = editingItem.item_id ? 'PUT' : 'POST';
      const res = await fetch('http://localhost/merakiliving_backend/api_cafe.php', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (res.ok) {
        fetchCafeMenu();
      }
    } catch (error) {
      console.error("Failed to save cafe item:", error);
    }
    setEditingItem(null);
  };

  const filteredItems = allItems.filter(i => i.category === activeCategory);

  return (
    <>
      <PageHeader
        title="Full Menu Categories"
        subtitle="Manage all menu items across Breakfast, Pahadi Khana, Snacks, etc."
        action={
          <button className="admin-btn-primary" onClick={() => setEditingItem({ title: '', price: '', category: activeCategory, is_veg: 1, description: '' })}>
            <PlusSignIcon size={18} /> Add Menu Item
          </button>
        }
      />
      <div className="admin-card">
        <div className="admin-filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={\`admin-filter-btn \${activeCategory === cat ? 'active' : ''}\`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="admin-table-wrapper">
          {isLoading && allItems.length === 0 ? (
            <div style={{padding: '24px', textAlign: 'center', color: '#555'}}>Loading...</div>
          ) : (
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
                    <td className="admin-text-medium">{item.title}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <span className={item.is_veg == 1 ? 'admin-text-veg' : 'admin-text-nonveg'}>
                        {item.is_veg == 1 ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td className="admin-cell-muted">{item.description || '-'}</td>
                    <td><span className="admin-badge badge-success">{item.status || 'Available'}</span></td>
                    <td>
                      <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingItem(item)}>Edit</button>
                    </td>
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
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737'}}>{editingItem.item_id ? 'Edit Item' : 'Add Item'}</h2>
              <button onClick={() => setEditingItem(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}>
                <Cancel01Icon size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Title</label>
              <input type="text" className="admin-form-input" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Price</label>
              <input type="number" className="admin-form-input" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Description</label>
              <input type="text" className="admin-form-input" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Veg / Non-Veg</label>
              <select className="admin-form-input" value={editingItem.is_veg} onChange={e => setEditingItem({...editingItem, is_veg: parseInt(e.target.value)})}>
                <option value={1}>Veg</option>
                <option value={0}>Non-Veg</option>
              </select>
            </div>
            <button className="admin-btn-primary admin-btn-full" onClick={handleSaveItem}>Save Changes</button>
          </div>
        </div>
      )}
    </>
  );
}`;

c = c.replace(/function CafeMenuTab\(\) \{[\s\S]*?\}\s*function GuestsTab\(\)/, `${cafeMenuTabFull}\n\nfunction GuestsTab()`);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched CafeMenuTab Full");
