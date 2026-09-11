                  <td>
                    <div style={{fontWeight: '600'}}>₹{item.price}</div>
                    {item.original_price > item.price && <div style={{textDecoration: 'line-through', color: '#817F7F', fontSize: '12px'}}>₹{item.original_price}</div>}
                  </td>
                  <td>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                       <span className={item.is_veg == 1 ? 'admin-text-veg' : 'admin-text-nonveg'} style={{fontSize: '12px'}}>{item.is_veg == 1 ? 'Veg' : 'Non-Veg'}</span>
                       <span className="admin-badge badge-success" style={{fontSize: '10px'}}>{item.status || 'Available'}</span>
                    </div>
                  </td>
                  <td>{item.is_featured == 1 ? <span className="admin-badge badge-primary">Yes</span> : 'No'}</td>
                  <td>
                    <div style={{display: 'flex', gap: '8px'}}>
                       <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingItem(item)}><Edit01Icon size={14} /></button>
                       <button className="admin-btn-sm admin-btn-outline" onClick={() => deleteItem(item.item_id)}><Delete01Icon size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '24px', color: '#817F7F'}}>No items in this category.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {editingItem && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '600px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>{editingItem.item_id ? 'Edit Item' : 'Add Item'}</h2>
              <button onClick={() => setEditingItem(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
                <div className="admin-form-group" style={{flex: 2}}><label className="admin-form-label">Title</label><input type="text" className="admin-form-input" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /></div>
                <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Category</label><select className="admin-form-input" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            
            <div className="admin-form-group"><label className="admin-form-label">Description</label><textarea className="admin-form-input" rows="2" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})}></textarea></div>
            
            <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
                <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Original Price</label><input type="number" className="admin-form-input" value={editingItem.original_price || 0} onChange={e => setEditingItem({...editingItem, original_price: e.target.value})} /></div>
                <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Selling Price</label><input type="number" className="admin-form-input" value={editingItem.price || 0} onChange={e => setEditingItem({...editingItem, price: e.target.value})} /></div>
                <div className="admin-form-group" style={{flex: 1}}>
                  <label className="admin-form-label">Discount (%)</label>
                  <input type="number" className="admin-form-input" value={editingItem.original_price > 0 && editingItem.price > 0 ? (((editingItem.original_price - editingItem.price) / editingItem.original_price) * 100).toFixed(1) : 0} onChange={e => handleDiscountChange(e.target.value)} />
                </div>
            </div>
            
  <div className="admin-form-group">
    <label className="admin-form-label">Item Image</label>
    <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
       {editingItem.image_url && <img src={editingItem.image_url} alt="Preview" style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} />}
       <input type="file" accept="image/*" className="admin-form-input" onChange={handleImageUpload} />
    </div>
  </div>
  
            <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
                <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Diet</label><select className="admin-form-input" value={editingItem.is_veg} onChange={e => setEditingItem({...editingItem, is_veg: parseInt(e.target.value)})}><option value={1}>Veg</option><option value={0}>Non-Veg</option></select></div>
                <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Status</label><select className="admin-form-input" value={editingItem.status || 'Available'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}><option>Available</option><option>Out of Stock</option></select></div>
                <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Featured</label><select className="admin-form-input" value={editingItem.is_featured} onChange={e => setEditingItem({...editingItem, is_featured: parseInt(e.target.value)})}><option value={1}>Yes</option><option value={0}>No</option></select></div>
                <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Tag (e.g. New)</label><input type="text" className="admin-form-input" value={editingItem.tag || ''} onChange={e => setEditingItem({...editingItem, tag: e.target.value})} /></div>
            </div>
            
            <button className="admin-btn-primary admin-btn-full" onClick={saveItem}>Save Changes</button>
          </div>
        </div>
      )}
    </>
  );
}

function GuestsTab() {
  const [guests, setGuests] = useState([]);
  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_guest.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setGuests(data.data); })
      .catch(e => console.error("JSON Error in Guests:", e));
  }, []);

  return (
    <>
      <PageHeader title="Guest Directory" subtitle="Manage guest information and stay history." />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Guest Name</th><th>Contact Info</th><th>Total Stays</th><th>Last Room</th><th>Actions</th></tr></thead>
            <tbody>
              {guests.map((g, idx) => (
                <tr key={idx}>
                  <td className="admin-text-medium">{g.name}</td>
                  <td><div className="admin-cell-stack"><span>{g.email}</span><span className="admin-cell-muted">{g.phone}</span></div></td>
                  <td>{g.total_stays}</td>
                  <td>{g.last_room || 'N/A'}</td>
                  <td><button className="admin-btn-sm admin-btn-outline">History</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('All');
  
  useEffect(() => {
    Promise.all([
      fetch(`${API_CONFIG_URL}/api_payment.php`).then(res => res.json()),
      fetch(`${API_CONFIG_URL}/apibooking.php`).then(res => res.json())
    ]).then(([paymentsData, bookingsData]) => {
      let fetchedBookings = [];
      if (bookingsData && bookingsData.status === 'success') {
        fetchedBookings = bookingsData.data;
      }
      if (paymentsData && paymentsData.status === 'success') {
        const mergedPayments = paymentsData.data.map(p => {
          const booking = fetchedBookings.find(b => b.id === p.booking_id);
          return {
            ...p,
            guest_name: booking ? booking.guest_name : 'Unknown',
            room_id: booking ? booking.room_name : 'N/A' 
          };
        });
        setPayments(mergedPayments);
      }
    }).catch(e => console.error("JSON Error in Payments:", e));
  }, []);

  const filteredPayments = filter === 'All' ? payments : payments.filter(p => p.status === filter);

  return (
    <>
      <PageHeader title="Payment History" subtitle="Track all transactions, settlements, and refunds." />
      <div className="admin-card">
        <div className="admin-filter-bar">
          {['All', 'Success', 'Pending', 'Failed', 'Refunded'].map(f => (
             <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Payment ID</th><th>Guest Name</th><th>Room</th><th>Amount</th><th>Method</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filteredPayments.map((p, i) => (
                <tr key={i}>
                  <td className="admin-text-mono">{p.razorpay_payment_id || 'N/A'}</td>
                  <td className="admin-text-medium">{p.guest_name}</td>
                  <td>{p.room_id}</td>
                  <td className="admin-text-medium">₹{p.amount}</td>
                  <td><div className="admin-cell-stack"><span>Razorpay</span><span className="admin-cell-muted">{p.payment_method || 'Online / Card'}</span></div></td>
                  <td><span className={`admin-badge ${p.status === 'Success' ? 'badge-success' : p.status === 'Pending' ? 'badge-info' : 'badge-danger'}`}>{p.status}</span></td>
                  <td><button className="admin-btn-sm admin-btn-outline"><Download02Icon size={14} /> Receipt</button></td>
                </tr>
              ))}
              {filteredPayments.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '24px'}}>No {filter.toLowerCase()} payments found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CouponsTab() {
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api coupons .php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setCoupons(data.data); })
      .catch(e => console.error("JSON Error in Coupons:", e));
  }, []);

  const saveCoupon = () => {
    const isNew = !editingCoupon.coupon_id;
    const method = isNew ? 'POST' : 'PUT';
    
    fetch(`${API_CONFIG_URL}/api coupons .php`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         coupon_id: editingCoupon.coupon_id,
         code: editingCoupon.code || '',
         discount_percentage: editingCoupon.discount_percentage || 0,
         status: editingCoupon.status || 'Active'
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        fetch(`${API_CONFIG_URL}/api coupons .php`)
          .then(res => res.json())
          .then(refetchData => {
            if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data)) {
              setCoupons(refetchData.data);
            }
            setEditingCoupon(null);
          });
      }
    }).catch(e => console.error(e));
  };

  const deleteCoupon = (id) => {
    if(!window.confirm("Are you sure you want to delete this coupon?")) return;
    fetch(`${API_CONFIG_URL}/api coupons .php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coupon_id: id })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        setCoupons(coupons.filter(c => c.coupon_id !== id));
      }
    }).catch(e => console.error(e));
  };

  return (
    <div className="admin-fade-in">
      <PageHeader title="Coupons & Discounts" subtitle="Manage promotional codes." action={<button className="admin-btn-primary" onClick={() => setEditingCoupon({status: 'Active'})}><PlusSignIcon size={18} /> New Coupon</button>} />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Code</th><th>Discount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {coupons.map((c, idx) => (
                <tr key={idx}>
                  <td className="admin-text-medium">{c.code}</td>
                  <td>{c.discount_percentage}% Off</td>
                  <td><span className="admin-badge badge-success">{c.status}</span></td>
                  <td>
                     <div style={{display: 'flex', gap: '8px'}}>
                       <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingCoupon(c)}>Edit</button>
                       <button className="admin-btn-sm admin-btn-outline" onClick={() => deleteCoupon(c.coupon_id)}>Delete</button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {editingCoupon && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '400px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>{editingCoupon.coupon_id ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button onClick={() => setEditingCoupon(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div className="admin-form-group"><label className="admin-form-label">Coupon Code</label><input type="text" className="admin-form-input" value={editingCoupon.code || ''} onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Discount Percentage (%)</label><input type="number" className="admin-form-input" value={editingCoupon.discount_percentage || 0} onChange={e => setEditingCoupon({...editingCoupon, discount_percentage: e.target.value})} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Status</label><select className="admin-form-input" value={editingCoupon.status || 'Active'} onChange={e => setEditingCoupon({...editingCoupon, status: e.target.value})}><option>Active</option><option>Inactive</option></select></div>
            
            <button className="admin-btn-primary admin-btn-full" onClick={saveCoupon}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryTab() {
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Rooms Gallery');
  
  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_gallery.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success') setImages(data.data); })
      .catch(e => console.error("JSON Error in Gallery:", e));
  }, []);

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('action', 'upload');
    
    fetch(`${API_CONFIG_URL}/api_rooms.php`, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if(data.status === 'success') {
         fetch(`${API_CONFIG_URL}/api_gallery.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: data.image_url, category: activeCategory })
         }).then(res => res.json()).then(gData => {
            if(gData.status === 'success') {
               setImages([...images, { image_id: gData.data.id, image_url: data.image_url, category: activeCategory }]);
            }
         });
      }
    }).catch(e => console.error(e));
  };

  const handleDeleteImage = (id) => {
    fetch(`${API_CONFIG_URL}/api_gallery.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_id: id })
    }).then(res => res.json()).then(data => {
      if(data.status === 'success') setImages(images.filter(img => img.image_id !== id));
    }).catch(e => console.error(e));
  };

  return (
    <>
      <PageHeader title="Gallery Manager" subtitle="Manage images for rooms, cafe ambiance, and explore sections." action={<label className="admin-btn-primary" style={{cursor: 'pointer'}}><PlusSignIcon size={18} /> Upload Image<input type="file" style={{display: 'none'}} onChange={handleUploadImage} accept="image/*" /></label>} />
      
      <div className="admin-filter-bar" style={{marginBottom: '24px'}}>
         {['Rooms Gallery', 'Cafe Ambiance', 'Main Explore Gallery'].map(cat => (
           <button key={cat} className={`admin-filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
         ))}
      </div>
      
      <div className="admin-item-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'}}>
         {images.filter(img => img.category === activeCategory).map(img => (
            <div key={img.image_id} className="admin-card" style={{padding: '0', overflow: 'hidden'}}>
               <img src={img.image_url} alt="Gallery" style={{width: '100%', height: '150px', objectFit: 'cover', display: 'block'}} />
               <div style={{padding: '12px', display: 'flex', justifyContent: 'center'}}>
                  <button className="admin-btn-outline" style={{color: '#d9534f', borderColor: '#d9534f'}} onClick={() => handleDeleteImage(img.image_id)}><Cancel01Icon size={16} /> Remove</button>
               </div>
            </div>
         ))}
         
         {images.filter(img => img.category === activeCategory).length === 0 && (
            <div style={{gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#888'}}>
               <Image01Icon size={48} strokeWidth={1} style={{marginBottom: '16px'}} />
               <p>No images found in {activeCategory}. Click "Upload Image" to add some.</p>
            </div>
         )}
      </div>
    </>
  );
}

function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_review.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setReviews(data.data); })
      .catch(e => console.error("JSON Error in Reviews:", e));
  }, []);

  const saveReview = () => {
    const isNew = !editingReview.review_id;
    const method = isNew ? 'POST' : 'PUT';
    
    fetch(`${API_CONFIG_URL}/api_review.php`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         review_id: editingReview.review_id,
         guest_name: editingReview.guest_name || '',
         rating: editingReview.rating || 5,
         review_text: editingReview.review_text || '',
         visibility: editingReview.visibility || 'Visible'
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        fetch(`${API_CONFIG_URL}/api_review.php`)
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
    fetch(`${API_CONFIG_URL}/api_review.php`, {
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
    <div className="admin-fade-in">
      <PageHeader title="Reviews & Testimonials" subtitle="Manage guest reviews appearing on the homepage." action={<button className="admin-btn-primary" onClick={() => setEditingReview({visibility: 'Visible', rating: 5})}><PlusSignIcon size={18} /> Add Review</button>} />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Guest Name</th><th>Rating</th><th>Review Snippet</th><th>Visibility</th><th>Actions</th></tr></thead>
            <tbody>
              {reviews.map((r, idx) => (
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
            </tbody>
          </table>
        </div>
      </div>
      
      {editingReview && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '500px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>{editingReview.review_id ? 'Edit Review' : 'Add Review'}</h2>
              <button onClick={() => setEditingReview(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div className="admin-form-group"><label className="admin-form-label">Guest Name</label><input type="text" className="admin-form-input" value={editingReview.guest_name || ''} onChange={e => setEditingReview({...editingReview, guest_name: e.target.value})} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Rating (1-5)</label><input type="number" min="1" max="5" className="admin-form-input" value={editingReview.rating || 5} onChange={e => setEditingReview({...editingReview, rating: e.target.value})} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Review Text</label><textarea className="admin-form-input" rows="4" value={editingReview.review_text || ''} onChange={e => setEditingReview({...editingReview, review_text: e.target.value})}></textarea></div>
            <div className="admin-form-group"><label className="admin-form-label">Visibility</label><select className="admin-form-input" value={editingReview.visibility || 'Visible'} onChange={e => setEditingReview({...editingReview, visibility: e.target.value})}><option>Visible</option><option>Hidden</option></select></div>
            
            <button className="admin-btn-primary admin-btn-full" onClick={saveReview}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PoliciesTab() {
  const [contentData, setContentData] = useState([]);
  const [editingPolicy, setEditingPolicy] = useState(null);
  
  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_settings.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) setContentData(data.data); })
      .catch(e => console.error("JSON Error in Policies:", e));
  }, []);

  return (
    <>
      <PageHeader title="Legal Policies & FAQ" subtitle="Update website content for legal pages and FAQs." />
      <div className="admin-fade-in" style={{display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
         <div className="admin-card" style={{flex: '1 1 300px', padding: '24px'}}>
           <h3 style={{marginBottom: '16px', fontSize: '18px'}}>Policies Manager</h3>
           <p style={{color: '#555', fontSize: '14px', marginBottom: '16px'}}>Settings API is mapped for this functionality. Proceed to edit details directly in Global Settings.</p>
           <button className="admin-btn-outline"><Edit01Icon size={16} /> Edit via Settings</button>
         </div>
      </div>
    </>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    fetch(`${API_CONFIG_URL}/api_settings.php`)
      .then(res => res.json())
      .then(data => { if(data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) setSettings(data.data[0]); })
      .catch(e => console.error("JSON Error in Settings:", e));
  }, []);

  const handleSaveSettings = () => {
    fetch(`${API_CONFIG_URL}/api_settings.php`, {
      method: settings.setting_id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        alert('Settings Saved Successfully');
        fetch(`${API_CONFIG_URL}/api_settings.php`)
          .then(res => res.json())
          .then(refetchData => {
            if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data) && refetchData.data.length > 0) {
              setSettings(refetchData.data[0]);
            }
          });
      } else {
        alert('Error saving settings');
      }
    }).catch(e => console.error(e));
  };

  return (
    <>
      <PageHeader title="Global Settings" subtitle="Configure contact information and admin accounts." action={<button className="admin-btn-primary" onClick={handleSaveSettings}>Save Configuration</button>} />
      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header"><h2 className="admin-card-title">Contact Information</h2></div>
          <div className="admin-card-body">
            <div className="admin-form-group"><label className="admin-form-label">Primary Phone / WhatsApp</label><input type="text" className="admin-form-input" value={settings.contact_phone || ""} onChange={e => setSettings({...settings, contact_phone: e.target.value})} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Email Address</label><input type="email" className="admin-form-input" value={settings.contact_email || ""} onChange={e => setSettings({...settings, contact_email: e.target.value})} /></div>
            <div className="admin-form-group"><label className="admin-form-label">Physical Address</label><textarea className="admin-form-textarea" value={settings.physical_address || ""} onChange={e => setSettings({...settings, physical_address: e.target.value})} /></div>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-header"><h2 className="admin-card-title">Admin Accounts</h2></div>
          <div className="admin-card-body">
            <div className="admin-form-group"><label className="admin-form-label">Change Password</label><input type="password" className="admin-form-input" placeholder="Enter new password" /></div>
            <button className="admin-btn-outline admin-btn-full"><PlusSignIcon size={16} /> Add Secondary Admin</button>
          </div>
        </div>
      </div>
    </>
  );
}