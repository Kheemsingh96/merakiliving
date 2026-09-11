const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const reviewsTabCode = `function ReviewsTab() {
  const [reviews, setReviews] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_reviews.php')
      .then(r => r.json()).then(d => { if(Array.isArray(d.data)) setReviews(d.data); });
  }, []);

  const handleAdd = () => {
    const name = prompt("Guest Name:");
    if (!name) return;
    const rating = prompt("Rating (1-5):", "5");
    const text = prompt("Review Text:");
    fetch('http://localhost/merakiliving_backend/api_reviews.php', {
      method: 'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ guest_name: name, rating, review_text: text, visibility: 1 })
    }).then(() => window.location.reload());
  };

  const handleToggle = (r) => {
    fetch('http://localhost/merakiliving_backend/api_reviews.php', {
      method: 'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ review_id: r.review_id, visibility: parseInt(r.visibility) === 1 ? 0 : 1 })
    }).then(() => window.location.reload());
  };

  return (
    <>
      <PageHeader title="Reviews & Testimonials" subtitle="Manage guest reviews appearing on the homepage." action={<button className="admin-btn-primary" onClick={handleAdd}><PlusSignIcon size={18} /> Add Review</button>} />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Guest Name</th><th>Rating</th><th>Review Snippet</th><th>Visibility</th><th>Actions</th></tr></thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.review_id}>
                  <td className="admin-text-medium">{r.guest_name}</td>
                  <td>{r.rating} Stars</td>
                  <td>{r.review_text}</td>
                  <td><span className={"admin-badge badge-" + (parseInt(r.visibility) === 1 ? "success" : "warning")}>{parseInt(r.visibility) === 1 ? "Visible" : "Hidden"}</span></td>
                  <td><button className="admin-btn-sm admin-btn-outline" onClick={() => handleToggle(r)}>Toggle Visibility</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}`;

const galleryTabCode = `function GalleryTab() {
  const [images, setImages] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_gallery.php')
      .then(r => r.json()).then(d => { if(Array.isArray(d.data)) setImages(d.data); });
  }, []);

  const handleAdd = () => {
    const url = prompt("Image URL (e.g. /img/rooms/room1.jpg):");
    if (!url) return;
    const cat = prompt("Category (Rooms, Cafe Ambiance, Explore):", "Rooms");
    fetch('http://localhost/merakiliving_backend/api_gallery.php', {
      method: 'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ image_url: url, category: cat })
    }).then(() => window.location.reload());
  };

  const handleDelete = (id) => {
    if(confirm("Delete image?")) {
      fetch('http://localhost/merakiliving_backend/api_gallery.php', {
        method: 'DELETE', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ image_id: id })
      }).then(() => window.location.reload());
    }
  };

  return (
    <>
      <PageHeader title="Gallery Manager" subtitle="Manage images for rooms, cafe ambiance, and explore sections." action={<button className="admin-btn-primary" onClick={handleAdd}><PlusSignIcon size={18} /> Upload Image</button>} />
      <div className="admin-item-grid" style={{marginTop: '20px'}}>
         {images.map(img => (
           <div key={img.image_id} className="admin-item-card">
             <img src={img.image_url} alt="Gallery" className="admin-item-img" />
             <div style={{padding:'10px'}}>
               <h4>{img.category}</h4>
               <button className="admin-btn-sm admin-btn-outline" onClick={() => handleDelete(img.image_id)}>Delete</button>
             </div>
           </div>
         ))}
      </div>
    </>
  );
}`;

const settingsTabCode = `function SettingsTab() {
  const [settings, setSettings] = React.useState({ gst: '', phone: '', email: '', address: '' });
  React.useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_settings.php')
      .then(r => r.json()).then(d => { 
        if(d.data && d.data.length > 0) {
          const s = d.data[0];
          setSettings({ gst: s.global_gst_percentage || '', phone: s.contact_phone || '', email: s.contact_email || '', address: s.physical_address || '', id: s.setting_id });
        }
      });
  }, []);

  const handleSave = () => {
    fetch('http://localhost/merakiliving_backend/api_settings.php', {
      method: settings.id ? 'PUT' : 'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ setting_id: settings.id || 1, global_gst_percentage: settings.gst, contact_phone: settings.phone, contact_email: settings.email, physical_address: settings.address })
    }).then(() => alert("Saved!"));
  };

  return (
    <>
      <PageHeader title="Global Settings" subtitle="Configure core platform settings and operational rules." />
      <div className="admin-card">
        <h3 style={{marginBottom: '20px', color: '#373737'}}>Basic Settings</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px'}}>
          <div className="admin-form-group">
            <label className="admin-form-label">Global GST %</label>
            <input type="number" className="admin-form-input" value={settings.gst} onChange={e => setSettings({...settings, gst: e.target.value})} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Contact Phone</label>
            <input type="text" className="admin-form-input" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Contact Email</label>
            <input type="email" className="admin-form-input" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Physical Address</label>
            <textarea className="admin-form-input" style={{height: '100px'}} value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})}></textarea>
          </div>
          <button className="admin-btn-primary" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </>
  );
}`;

const policiesTabCode = `function PoliciesTab() {
  const [policies, setPolicies] = React.useState({ privacyPolicy: '', terms: '', cancellation: '' });
  const [activePolicy, setActivePolicy] = React.useState('');

  React.useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_settings.php')
      .then(r => r.json()).then(d => { 
        if(d.data && d.data.length > 0) {
          const s = d.data[0];
          setPolicies({ privacyPolicy: s.privacy_policy_text || '', terms: s.terms_conditions_text || '', cancellation: s.cancellation_policy_text || '', id: s.setting_id });
        }
      });
  }, []);

  const handleSave = () => {
    const payload = { setting_id: policies.id || 1 };
    if (activePolicy === 'privacyPolicy') payload.privacy_policy_text = policies.privacyPolicy;
    if (activePolicy === 'terms') payload.terms_conditions_text = policies.terms;
    if (activePolicy === 'cancellation') payload.cancellation_policy_text = policies.cancellation;

    fetch('http://localhost/merakiliving_backend/api_settings.php', {
      method: policies.id ? 'PUT' : 'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).then(() => alert("Saved!"));
  };

  return (
    <>
      <PageHeader title="Legal Policies & FAQ" subtitle="Update website content for legal pages." />
      <div className="admin-empty-actions" style={{marginBottom: '20px'}}>
        <button className={\`admin-btn-outline \${activePolicy === 'privacyPolicy' ? 'active' : ''}\`} onClick={() => setActivePolicy('privacyPolicy')}>Privacy Policy</button>
        <button className={\`admin-btn-outline \${activePolicy === 'terms' ? 'active' : ''}\`} onClick={() => setActivePolicy('terms')}>Terms & Conditions</button>
        <button className={\`admin-btn-outline \${activePolicy === 'cancellation' ? 'active' : ''}\`} onClick={() => setActivePolicy('cancellation')}>Cancellation Policy</button>
      </div>
      {activePolicy ? (
        <div className="admin-card">
          <textarea className="admin-form-input" style={{height: '300px', marginBottom: '20px'}} value={policies[activePolicy]} onChange={e => setPolicies({...policies, [activePolicy]: e.target.value})}></textarea>
          <button className="admin-btn-primary" onClick={handleSave}>Save Policy</button>
        </div>
      ) : (
        <div className="admin-empty-state"><Doc01Icon className="admin-empty-icon" /><h3>Select content to edit</h3></div>
      )}
    </>
  );
}`;

c = c.replace(/function ReviewsTab\(\) \{[\s\S]*?\}\n\n\s*function PoliciesTab\(\) \{[\s\S]*?\}\n\n\s*function SettingsTab\(\) \{[\s\S]*?\}/, reviewsTabCode + '\n\n' + policiesTabCode + '\n\n' + settingsTabCode);
c = c.replace(/function GalleryTab\(\) \{[\s\S]*?\}\n\n\s*(?=function ReviewsTab)/, galleryTabCode + '\n\n');

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched Gallery, Reviews, Policies, Settings tabs.");
