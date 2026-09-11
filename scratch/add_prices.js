const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');
const searchStr = `<div className="admin-form-group">\n              <label className="admin-form-label">Room Image</label>`;
const replaceStr = `<div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
              <div className="admin-form-group" style={{flex: 1}}>
                <label className="admin-form-label">Original Price</label>
                <input type="number" className="admin-form-input" value={editingRoom.original_price || 0} onChange={e => setEditingRoom({...editingRoom, original_price: parseInt(e.target.value, 10)})} />
              </div>
              <div className="admin-form-group" style={{flex: 1}}>
                <label className="admin-form-label">Discount Price</label>
                <input type="number" className="admin-form-input" value={editingRoom.price || 0} onChange={e => setEditingRoom({...editingRoom, price: parseInt(e.target.value, 10)})} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Room Image</label>`;
c = c.replace(searchStr, replaceStr);
fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log('Prices added.');
