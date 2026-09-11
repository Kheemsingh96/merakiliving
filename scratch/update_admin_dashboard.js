const fs = require('fs');

let fileContent = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const bookingsTabOld = `function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    Promise.all([
      fetch(\`\${API_CONFIG_URL}/api_bookings.php\`).then(res => res.json()),
      fetch(\`\${API_CONFIG_URL}/api_payments.php\`).then(res => res.json())
    ]).then(([bookingsData, paymentsData]) => {
      let fetchedPayments = [];
      if (paymentsData && paymentsData.status === 'success') {
        fetchedPayments = paymentsData.data;
      }
      if (bookingsData && bookingsData.status === 'success') {
        const mergedBookings = bookingsData.data.map(b => {
          const payment = fetchedPayments.find(p => p.booking_id === b.id && (p.status === 'Success' || p.status === 'Completed'));
          return {
            ...b,
            paid_amount: payment ? payment.amount : b.room_price
          };
        });
        setBookings(mergedBookings);
      }
    }).catch(e => console.error("JSON Error in Bookings:", e));
  }, []);

  const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <>
      <PageHeader title="Booking Management" subtitle="View and manage all homestay reservations." action={<button className="admin-btn-primary" onClick={() => alert('Booking creation is managed via frontend guest flow.')}><PlusSignIcon size={18} /> Create Booking</button>} />
      <div className="admin-card">
        <div className="admin-filter-bar">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
            <button key={f} className={\`admin-filter-btn \${filter === f ? 'active' : ''}\`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Guest Name</th><th>Room</th><th>Dates</th><th>Amount Paid</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredBookings.map((b, i) => (
                <tr key={i}>
                  <td className="admin-text-mono">#BK-{b.id}</td>
                  <td><div className="admin-cell-stack"><span>{b.guest_name}</span><span className="admin-cell-muted">{b.guest_phone}</span></div></td>
                  <td>{b.room_name}</td>
                  <td><div className="admin-cell-stack"><span>{b.check_in} to {b.check_out}</span><span className="admin-cell-muted">Nights</span></div></td>
                  <td className="admin-text-medium">₹{b.paid_amount}</td>
                  <td><span className={\`admin-badge \${b.status === 'Confirmed' ? 'badge-success' : b.status === 'Pending' ? 'badge-info' : 'badge-danger'}\`}>{b.status}</span></td>
                  <td>
                    <div className="admin-action-group"><button className="admin-btn-sm admin-btn-outline" onClick={() => alert('View booking details for BK-' + b.id)}><Edit01Icon size={14} /> View</button><a href={\`https://wa.me/\${b.guest_phone}\`} target="_blank" rel="noreferrer" className="admin-btn-sm admin-btn-whatsapp"><WhatsappIcon size={14} /></a></div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '24px'}}>No {filter.toLowerCase()} bookings found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}`;

const bookingsTabNew = `function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [editingBooking, setEditingBooking] = useState(null);

  const fetchBookings = () => {
    Promise.all([
      fetch(\`\${API_CONFIG_URL}/api_bookings.php\`).then(res => res.json()),
      fetch(\`\${API_CONFIG_URL}/api_payments.php\`).then(res => res.json())
    ]).then(([bookingsData, paymentsData]) => {
      let fetchedPayments = [];
      if (paymentsData && paymentsData.status === 'success') {
        fetchedPayments = paymentsData.data;
      }
      if (bookingsData && bookingsData.status === 'success') {
        const mergedBookings = bookingsData.data.map(b => {
          const payment = fetchedPayments.find(p => p.booking_id === b.id && (p.status === 'Success' || p.status === 'Completed'));
          return {
            ...b,
            paid_amount: payment ? payment.amount : (b.room_price || 0)
          };
        });
        setBookings(mergedBookings);
      }
    }).catch(e => console.error("JSON Error in Bookings:", e));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const saveBooking = () => {
    const isNew = !editingBooking.id;
    const method = isNew ? 'POST' : 'PUT';
    
    fetch(\`\${API_CONFIG_URL}/api_bookings.php\`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         id: editingBooking.id,
         guest_name: editingBooking.guest_name || '',
         guest_email: editingBooking.guest_email || '',
         guest_phone: editingBooking.guest_phone || '',
         room_id: editingBooking.room_id || 1,
         check_in: editingBooking.check_in || '',
         check_out: editingBooking.check_out || '',
         status: editingBooking.status || 'Pending'
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        fetchBookings();
        setEditingBooking(null);
      } else {
        alert(data.message || 'Error saving booking');
      }
    }).catch(e => console.error(e));
  };

  const deleteBooking = (id) => {
    if(!window.confirm("Are you sure you want to delete this booking?")) return;
    fetch(\`\${API_CONFIG_URL}/api_bookings.php\`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        setBookings(bookings.filter(b => b.id !== id));
      } else {
        alert(data.message || 'Error deleting booking');
      }
    }).catch(e => console.error(e));
  };

  const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <>
      <PageHeader title="Booking Management" subtitle="View and manage all homestay reservations." action={<button className="admin-btn-primary" onClick={() => setEditingBooking({status: 'Pending'})}><PlusSignIcon size={18} /> Create Booking</button>} />
      <div className="admin-card">
        <div className="admin-filter-bar">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
            <button key={f} className={\`admin-filter-btn \${filter === f ? 'active' : ''}\`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Guest Name</th><th>Room</th><th>Dates</th><th>Amount Paid</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredBookings.map((b, i) => (
                <tr key={i}>
                  <td className="admin-text-mono">#BK-{b.id}</td>
                  <td><div className="admin-cell-stack"><span>{b.guest_name}</span><span className="admin-cell-muted">{b.guest_phone}</span></div></td>
                  <td>{b.room_name || b.room_id}</td>
                  <td><div className="admin-cell-stack"><span>{b.check_in} to {b.check_out}</span></div></td>
                  <td className="admin-text-medium">₹{b.paid_amount}</td>
                  <td><span className={\`admin-badge \${b.status === 'Confirmed' || b.status === 'Completed' ? 'badge-success' : b.status === 'Pending' ? 'badge-info' : 'badge-danger'}\`}>{b.status}</span></td>
                  <td>
                    <div className="admin-action-group">
                      <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingBooking(b)}><Edit01Icon size={14} /> Edit</button>
                      <button className="admin-btn-sm admin-btn-outline admin-btn-danger" onClick={() => deleteBooking(b.id)}><Delete01Icon size={14} /></button>
                      <a href={\`https://wa.me/\${b.guest_phone}\`} target="_blank" rel="noreferrer" className="admin-btn-sm admin-btn-whatsapp"><WhatsappIcon size={14} /></a>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '24px'}}>No {filter.toLowerCase()} bookings found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      
      {editingBooking && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '500px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>{editingBooking.id ? 'Edit Booking' : 'Add Booking'}</h2>
              <button onClick={() => setEditingBooking(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            {!editingBooking.id && (
              <>
                <div className="admin-form-group"><label className="admin-form-label">Guest Name</label><input type="text" className="admin-form-input" value={editingBooking.guest_name || ''} onChange={e => setEditingBooking({...editingBooking, guest_name: e.target.value})} /></div>
                <div className="admin-form-group"><label className="admin-form-label">Guest Email</label><input type="email" className="admin-form-input" value={editingBooking.guest_email || ''} onChange={e => setEditingBooking({...editingBooking, guest_email: e.target.value})} /></div>
                <div className="admin-form-group"><label className="admin-form-label">Guest Phone</label><input type="text" className="admin-form-input" value={editingBooking.guest_phone || ''} onChange={e => setEditingBooking({...editingBooking, guest_phone: e.target.value})} /></div>
              </>
            )}
            
            <div className="admin-form-group"><label className="admin-form-label">Room ID</label><input type="number" className="admin-form-input" value={editingBooking.room_id || ''} onChange={e => setEditingBooking({...editingBooking, room_id: parseInt(e.target.value)})} /></div>
            
            <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
              <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Check In</label><input type="date" className="admin-form-input" value={editingBooking.check_in || ''} onChange={e => setEditingBooking({...editingBooking, check_in: e.target.value})} /></div>
              <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Check Out</label><input type="date" className="admin-form-input" value={editingBooking.check_out || ''} onChange={e => setEditingBooking({...editingBooking, check_out: e.target.value})} /></div>
            </div>
            
            <div className="admin-form-group"><label className="admin-form-label">Status</label><select className="admin-form-input" value={editingBooking.status || 'Pending'} onChange={e => setEditingBooking({...editingBooking, status: e.target.value})}><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></div>
            
            <button className="admin-btn-primary admin-btn-full" onClick={saveBooking}>Save Changes</button>
          </div>
        </div>
      )}
    </>
  );
}`;

const paymentsTabOld = `function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('All');
  
  useEffect(() => {
    Promise.all([
      fetch(\`\${API_CONFIG_URL}/api_payments.php\`).then(res => res.json()),
      fetch(\`\${API_CONFIG_URL}/api_bookings.php\`).then(res => res.json())
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
             <button key={f} className={\`admin-filter-btn \${filter === f ? 'active' : ''}\`} onClick={() => setFilter(f)}>{f}</button>
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
                  <td><span className={\`admin-badge \${p.status === 'Success' ? 'badge-success' : p.status === 'Pending' ? 'badge-info' : 'badge-danger'}\`}>{p.status}</span></td>
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
}`;

const paymentsTabNew = `function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [editingPayment, setEditingPayment] = useState(null);
  const [bookings, setBookings] = useState([]);
  
  const fetchPayments = () => {
    Promise.all([
      fetch(\`\${API_CONFIG_URL}/api_payments.php\`).then(res => res.json()),
      fetch(\`\${API_CONFIG_URL}/api_bookings.php\`).then(res => res.json())
    ]).then(([paymentsData, bookingsData]) => {
      let fetchedBookings = [];
      if (bookingsData && bookingsData.status === 'success') {
        fetchedBookings = bookingsData.data;
        setBookings(fetchedBookings);
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
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const savePayment = () => {
    const isNew = !editingPayment.id;
    const method = isNew ? 'POST' : 'PUT';
    
    fetch(\`\${API_CONFIG_URL}/api_payments.php\`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         id: editingPayment.id,
         booking_id: editingPayment.booking_id || 1,
         razorpay_order_id: editingPayment.razorpay_order_id || '',
         razorpay_payment_id: editingPayment.razorpay_payment_id || '',
         amount: editingPayment.amount || 0,
         payment_method: editingPayment.payment_method || 'Online / Card',
         status: editingPayment.status || 'Success'
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        fetchPayments();
        setEditingPayment(null);
      } else {
        alert(data.message || 'Error saving payment');
      }
    }).catch(e => console.error(e));
  };

  const deletePayment = (id) => {
    if(!window.confirm("Are you sure you want to delete this payment?")) return;
    fetch(\`\${API_CONFIG_URL}/api_payments.php\`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {
      if(data && data.status === 'success') {
        setPayments(payments.filter(p => p.id !== id));
      } else {
        alert(data.message || 'Error deleting payment');
      }
    }).catch(e => console.error(e));
  };

  const filteredPayments = filter === 'All' ? payments : payments.filter(p => p.status === filter);

  return (
    <>
      <PageHeader title="Payment History" subtitle="Track all transactions, settlements, and refunds." action={<button className="admin-btn-primary" onClick={() => setEditingPayment({status: 'Success', payment_method: 'Online / Card'})}><PlusSignIcon size={18} /> Add Payment</button>} />
      <div className="admin-card">
        <div className="admin-filter-bar">
          {['All', 'Success', 'Pending', 'Failed', 'Refunded'].map(f => (
             <button key={f} className={\`admin-filter-btn \${filter === f ? 'active' : ''}\`} onClick={() => setFilter(f)}>{f}</button>
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
                  <td><span className={\`admin-badge \${p.status === 'Success' ? 'badge-success' : p.status === 'Pending' ? 'badge-info' : 'badge-danger'}\`}>{p.status}</span></td>
                  <td>
                    <div className="admin-action-group">
                      <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingPayment(p)}><Edit01Icon size={14} /> Edit</button>
                      <button className="admin-btn-sm admin-btn-outline admin-btn-danger" onClick={() => deletePayment(p.id)}><Delete01Icon size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '24px'}}>No {filter.toLowerCase()} payments found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      
      {editingPayment && (
        <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
          <div className="admin-modal-content" style={{maxWidth: '500px'}}>
            <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>{editingPayment.id ? 'Edit Payment' : 'Add Payment'}</h2>
              <button onClick={() => setEditingPayment(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Booking ID</label>
              <select className="admin-form-input" value={editingPayment.booking_id || ''} onChange={e => setEditingPayment({...editingPayment, booking_id: parseInt(e.target.value)})}>
                <option value="">Select Booking</option>
                {bookings.map(b => (
                  <option key={b.id} value={b.id}>BK-{b.id} ({b.guest_name})</option>
                ))}
              </select>
            </div>
            
            <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
              <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Order ID (Optional)</label><input type="text" className="admin-form-input" value={editingPayment.razorpay_order_id || ''} onChange={e => setEditingPayment({...editingPayment, razorpay_order_id: e.target.value})} /></div>
              <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Payment ID (Optional)</label><input type="text" className="admin-form-input" value={editingPayment.razorpay_payment_id || ''} onChange={e => setEditingPayment({...editingPayment, razorpay_payment_id: e.target.value})} /></div>
            </div>
            
            <div className="admin-form-group"><label className="admin-form-label">Amount</label><input type="number" className="admin-form-input" value={editingPayment.amount || ''} onChange={e => setEditingPayment({...editingPayment, amount: e.target.value})} /></div>
            
            <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
              <div className="admin-form-group" style={{flex: 1}}>
                 <label className="admin-form-label">Payment Method</label>
                 <select className="admin-form-input" value={editingPayment.payment_method || 'Online / Card'} onChange={e => setEditingPayment({...editingPayment, payment_method: e.target.value})}>
                   <option>Online / Card</option>
                   <option>Cash</option>
                   <option>UPI</option>
                 </select>
              </div>
              <div className="admin-form-group" style={{flex: 1}}>
                 <label className="admin-form-label">Status</label>
                 <select className="admin-form-input" value={editingPayment.status || 'Success'} onChange={e => setEditingPayment({...editingPayment, status: e.target.value})}>
                   <option>Success</option>
                   <option>Pending</option>
                   <option>Failed</option>
                   <option>Refunded</option>
                 </select>
              </div>
            </div>
            
            <button className="admin-btn-primary admin-btn-full" onClick={savePayment}>Save Changes</button>
          </div>
        </div>
      )}
    </>
  );
}`;

let newFileContent = fileContent.replace(bookingsTabOld, bookingsTabNew);
newFileContent = newFileContent.replace(paymentsTabOld, paymentsTabNew);

if (newFileContent !== fileContent) {
    fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', newFileContent);
    console.log('AdminDashboard.js updated successfully.');
} else {
    console.log('No replacements made. String mismatch.');
}
