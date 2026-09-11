const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const manageRoomsTabFull = `function ManageRoomsTab() {
  const [editingRoom, setEditingRoom] = React.useState(null);
  const [rooms, setRooms] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost/merakiliving_backend/api_rooms.php');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) setRooms(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchRooms();
  }, []);

  const handleSaveRoom = async () => {
    try {
      const res = await fetch('http://localhost/merakiliving_backend/api_rooms.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRoom)
      });
      if (res.ok) {
        fetchRooms();
      }
    } catch (error) {
      console.error("Failed to update room:", error);
    }
    setEditingRoom(null);
  };

  return (
    <div className="admin-fade-in">
      <PageHeader
        title="Manage Rooms"
        subtitle="Edit room details, descriptions, and availability status."
      />
      {isLoading && rooms.length === 0 ? (
        <div style={{padding: '24px', textAlign: 'center', color: '#555'}}>Loading...</div>
      ) : (
        <div className="admin-item-grid">
          {rooms.map(r => (
            <div key={r.id} className="admin-item-card hover-lift">
              <img src={r.image_url || room1} alt={r.name} className="admin-item-img" />
              <div className="admin-item-content">
                <div className="admin-item-header">
                  <h3 className="admin-item-title">{r.name}</h3>
                  <span className="admin-badge badge-success">{r.status}</span>
                </div>
                <p className="admin-item-desc" style={{color: '#555', fontWeight: '400'}}>{r.description || 'No description available.'}</p>
                <div className="admin-item-actions" style={{marginTop: '20px'}}>
                  <button className="admin-btn-outline admin-btn-full" onClick={() => setEditingRoom(r)}>
                    <Edit01Icon size={16} strokeWidth={1.5} /> Edit Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingRoom && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content admin-fade-in" style={{maxWidth: '500px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737'}}>Edit Room: {editingRoom.name}</h2>
              <button onClick={() => setEditingRoom(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}>
                <Cancel01Icon size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Room Title</label>
              <input type="text" className="admin-form-input" value={editingRoom.name || ''} onChange={e => setEditingRoom({...editingRoom, name: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select className="admin-form-input" value={editingRoom.status || 'Available'} onChange={e => setEditingRoom({...editingRoom, status: e.target.value})}>
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>
            </div>
            <button className="admin-btn-primary admin-btn-full" onClick={handleSaveRoom}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}`;

c = c.replace(/function ManageRoomsTab\(\) \{[\s\S]*?\}\s*function PricingTab\(\)/, `${manageRoomsTabFull}\n\nfunction PricingTab()`);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched ManageRoomsTab Full");
