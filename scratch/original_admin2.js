Created At: 2026-08-31T11:31:13+05:30
Completed At: 2026-08-31T11:31:13+05:30
File Path: `file:///c:/Users/Kheem%20Singh/Desktop/merakiliving/merakiliving/src/Pages/Admin/AdminDashboard/AdminDashboard.js`
Total Lines: 1334
Total Bytes: 74168
Showing lines 800 to 1334
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
800:                   </td>
801:                   <td>
802:                     <div style={{fontWeight: '600'}}>₹{item.price}</div>
803:                     {item.original_price > item.price && <div style={{textDecoration: 'line-through', color: '#817F7F', fontSize: '12px'}}>₹{item.original_price}</div>}
804:                   </td>
805:                   <td>
806:                     <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
807:                        <span className={item.is_veg == 1 ? 'admin-text-veg' : 'admin-text-nonveg'} style={{fontSize: '12px'}}>{item.is_veg == 1 ? 'Veg' : 'Non-Veg'}</span>
808:                        <span className="admin-badge badge-success" style={{fontSize: '10px'}}>{item.status || 'Available'}</span>
809:                     </div>
810:                   </td>
811:                   <td>{item.is_featured == 1 ? <span className="admin-badge badge-primary">Yes</span> : 'No'}</td>
812:                   <td>
813:                     <div style={{display: 'flex', gap: '8px'}}>
814:                        <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingItem(item)}><Edit01Icon size={14} /></button>
815:                        <button className="admin-btn-sm admin-btn-outline" onClick={() => deleteItem(item.item_id)}><Delete01Icon size={14} /></button>
816:                     </div>
817:                   </td>
818:                 </tr>
819:               ))}
820:               {filteredItems.length === 0 && (
821:                 <tr><td colSpan="6" style={{textAlign: 'center', padding: '24px', color: '#817F7F'}}>No items in this category.</td></tr>
822:               )}
823:             </tbody>
824:           </table>
825:         </div>
826:       </div>
827:       
828:       {editingItem && (
829:         <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
830:           <div className="admin-modal-content" style={{maxWidth: '600px'}}>
831:             <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
832:               <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>{editingItem.item_id ? 'Edit Item' : 'Add Item'}</h2>
833:               <button onClick={() => setEditingItem(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
834:             </div>
835:             
836:             <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
837:                 <div className="admin-form-group" style={{flex: 2}}><label className="admin-form-label">Title</label><input type="text" className="admin-form-input" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /></div>
838:                 <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Category</label><select className="admin-form-input" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
839:             </div>
840:             
841:             <div className="admin-form-group"><label className="admin-form-label">Description</label><textarea className="admin-form-input" rows="2" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})}></textarea></div>
842:             
843:             <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
844:                 <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Original Price</label><input type="number" className="admin-form-input" value={editingItem.original_price || 0} onChange={e => setEditingItem({...editingItem, original_price: e.target.value})} /></div>
845:                 <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Selling Price</label><input type="number" className="admin-form-input" value={editingItem.price || 0} onChange={e => setEditingItem({...editingItem, price: e.target.value})} /></div>
846:                 <div className="admin-form-group" style={{flex: 1}}>
847:                   <label className="admin-form-label">Discount (%)</label>
848:                   <input type="number" className="admin-form-input" value={editingItem.original_price > 0 && editingItem.price > 0 ? (((editingItem.original_price - editingItem.price) / editingItem.original_price) * 100).toFixed(1) : 0} onChange={e => handleDiscountChange(e.target.value)} />
849:                 </div>
850:             </div>
851:             
852:   <div className="admin-form-group">
853:     <label className="admin-form-label">Item Image</label>
854:     <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
855:        {editingItem.image_url && <img src={editingItem.image_url} alt="Preview" style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} />}
856:        <input type="file" accept="image/*" className="admin-form-input" onChange={handleImageUpload} />
857:     </div>
858:   </div>
859:   
860:             <div className="admin-form-row" style={{display: 'flex', gap: '16px'}}>
861:                 <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Diet</label><select className="admin-form-input" value={editingItem.is_veg} onChange={e => setEditingItem({...editingItem, is_veg: parseInt(e.target.value)})}><option value={1}>Veg</option><option value={0}>Non-Veg</option></select></div>
862:                 <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Status</label><select className="admin-form-input" value={editingItem.status || 'Available'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}><option>Available</option><option>Out of Stock</option></select></div>
863:                 <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Featured</label><select className="admin-form-input" value={editingItem.is_featured} onChange={e => setEditingItem({...editingItem, is_featured: parseInt(e.target.value)})}><option value={1}>Yes</option><option value={0}>No</option></select></div>
864:                 <div className="admin-form-group" style={{flex: 1}}><label className="admin-form-label">Tag (e.g. New)</label><input type="text" className="admin-form-input" value={editingItem.tag || ''} onChange={e => setEditingItem({...editingItem, tag: e.target.value})} /></div>
865:             </div>
866:             
867:             <button className="admin-btn-primary admin-btn-full" onClick={saveItem}>Save Changes</button>
868:           </div>
869:         </div>
870:       )}
871:     </>
872:   );
873: }
874: 
875: function GuestsTab() {
876:   const [guests, setGuests] = useState([]);
877:   useEffect(() => {
878:     fetch(`${API_CONFIG_URL}/api_guest.php`)
879:       .then(res => res.json())
880:       .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setGuests(data.data); })
881:       .catch(e => console.error("JSON Error in Guests:", e));
882:   }, []);
883: 
884:   return (
885:     <>
886:       <PageHeader title="Guest Directory" subtitle="Manage guest information and stay history." />
887:       <div className="admin-card">
888:         <div className="admin-table-wrapper">
889:           <table className="admin-table">
890:             <thead><tr><th>Guest Name</th><th>Contact Info</th><th>Total Stays</th><th>Last Room</th><th>Actions</th></tr></thead>
891:             <tbody>
892:               {guests.map((g, idx) => (
893:                 <tr key={idx}>
894:                   <td className="admin-text-medium">{g.name}</td>
895:                   <td><div className="admin-cell-stack"><span>{g.email}</span><span className="admin-cell-muted">{g.phone}</span></div></td>
896:                   <td>{g.total_stays}</td>
897:                   <td>{g.last_room || 'N/A'}</td>
898:                   <td><button className="admin-btn-sm admin-btn-outline">History</button></td>
899:                 </tr>
900:               ))}
901:             </tbody>
902:           </table>
903:         </div>
904:       </div>
905:     </>
906:   );
907: }
908: 
909: function PaymentsTab() {
910:   const [payments, setPayments] = useState([]);
911:   const [filter, setFilter] = useState('All');
912:   
913:   useEffect(() => {
914:     Promise.all([
915:       fetch(`${API_CONFIG_URL}/api_payment.php`).then(res => res.json()),
916:       fetch(`${API_CONFIG_URL}/apibooking.php`).then(res => res.json())
917:     ]).then(([paymentsData, bookingsData]) => {
918:       let fetchedBookings = [];
919:       if (bookingsData && bookingsData.status === 'success') {
920:         fetchedBookings = bookingsData.data;
921:       }
922:       if (paymentsData && paymentsData.status === 'success') {
923:         const mergedPayments = paymentsData.data.map(p => {
924:           const booking = fetchedBookings.find(b => b.id === p.booking_id);
925:           return {
926:             ...p,
927:             guest_name: booking ? booking.guest_name : 'Unknown',
928:             room_id: booking ? booking.room_name : 'N/A' 
929:           };
930:         });
931:         setPayments(mergedPayments);
932:       }
933:     }).catch(e => console.error("JSON Error in Payments:", e));
934:   }, []);
935: 
936:   const filteredPayments = filter === 'All' ? payments : payments.filter(p => p.status === filter);
937: 
938:   return (
939:     <>
940:       <PageHeader title="Payment History" subtitle="Track all transactions, settlements, and refunds." />
941:       <div className="admin-card">
942:         <div className="admin-filter-bar">
943:           {['All', 'Success', 'Pending', 'Failed', 'Refunded'].map(f => (
944:              <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
945:           ))}
946:         </div>
947:         <div className="admin-table-wrapper">
948:           <table className="admin-table">
949:             <thead><tr><th>Payment ID</th><th>Guest Name</th><th>Room</th><th>Amount</th><th>Method</th><th>Status</th><th>Action</th></tr></thead>
950:             <tbody>
951:               {filteredPayments.map((p, i) => (
952:                 <tr key={i}>
953:                   <td className="admin-text-mono">{p.razorpay_payment_id || 'N/A'}</td>
954:                   <td className="admin-text-medium">{p.guest_name}</td>
955:                   <td>{p.room_id}</td>
956:                   <td className="admin-text-medium">₹{p.amount}</td>
957:                   <td><div className="admin-cell-stack"><span>Razorpay</span><span className="admin-cell-muted">{p.payment_method || 'Online / Card'}</span></div></td>
958:                   <td><span className={`admin-badge ${p.status === 'Success' ? 'badge-success' : p.status === 'Pending' ? 'badge-info' : 'badge-danger'}`}>{p.status}</span></td>
959:                   <td><button className="admin-btn-sm admin-btn-outline"><Download02Icon size={14} /> Receipt</button></td>
960:                 </tr>
961:               ))}
962:               {filteredPayments.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '24px'}}>No {filter.toLowerCase()} payments found.</td></tr>}
963:             </tbody>
964:           </table>
965:         </div>
966:       </div>
967:     </>
968:   );
969: }
970: 
971: function CouponsTab() {
972:   const [coupons, setCoupons] = useState([]);
973:   const [editingCoupon, setEditingCoupon] = useState(null);
974: 
975:   useEffect(() => {
976:     fetch(`${API_CONFIG_URL}/api coupons .php`)
977:       .then(res => res.json())
978:       .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setCoupons(data.data); })
979:       .catch(e => console.error("JSON Error in Coupons:", e));
980:   }, []);
981: 
982:   const saveCoupon = () => {
983:     const isNew = !editingCoupon.coupon_id;
984:     const method = isNew ? 'POST' : 'PUT';
985:     
986:     fetch(`${API_CONFIG_URL}/api coupons .php`, {
987:       method: method,
988:       headers: { 'Content-Type': 'application/json' },
989:       body: JSON.stringify({
990:          coupon_id: editingCoupon.coupon_id,
991:          code: editingCoupon.code || '',
992:          discount_percentage: editingCoupon.discount_percentage || 0,
993:          status: editingCoupon.status || 'Active'
994:       })
995:     })
996:     .then(res => res.json())
997:     .then(data => {
998:       if(data && data.status === 'success') {
999:         fetch(`${API_CONFIG_URL}/api coupons .php`)
1000:           .then(res => res.json())
1001:           .then(refetchData => {
1002:             if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data)) {
1003:               setCoupons(refetchData.data);
1004:             }
1005:             setEditingCoupon(null);
1006:           });
1007:       }
1008:     }).catch(e => console.error(e));
1009:   };
1010: 
1011:   const deleteCoupon = (id) => {
1012:     if(!window.confirm("Are you sure you want to delete this coupon?")) return;
1013:     fetch(`${API_CONFIG_URL}/api coupons .php`, {
1014:       method: 'DELETE',
1015:       headers: { 'Content-Type': 'application/json' },
1016:       body: JSON.stringify({ coupon_id: id })
1017:     })
1018:     .then(res => res.json())
1019:     .then(data => {
1020:       if(data && data.status === 'success') {
1021:         setCoupons(coupons.filter(c => c.coupon_id !== id));
1022:       }
1023:     }).catch(e => console.error(e));
1024:   };
1025: 
1026:   return (
1027:     <div className="admin-fade-in">
1028:       <PageHeader title="Coupons & Discounts" subtitle="Manage promotional codes." action={<button className="admin-btn-primary" onClick={() => setEditingCoupon({status: 'Active'})}><PlusSignIcon size={18} /> New Coupon</button>} />
1029:       <div className="admin-card">
1030:         <div className="admin-table-wrapper">
1031:           <table className="admin-table">
1032:             <thead><tr><th>Code</th><th>Discount</th><th>Status</th><th>Actions</th></tr></thead>
1033:             <tbody>
1034:               {coupons.map((c, idx) => (
1035:                 <tr key={idx}>
1036:                   <td className="admin-text-medium">{c.code}</td>
1037:                   <td>{c.discount_percentage}% Off</td>
1038:                   <td><span className="admin-badge badge-success">{c.status}</span></td>
1039:                   <td>
1040:                      <div style={{display: 'flex', gap: '8px'}}>
1041:                        <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingCoupon(c)}>Edit</button>
1042:                        <button className="admin-btn-sm admin-btn-outline" onClick={() => deleteCoupon(c.coupon_id)}>Delete</button>
1043:                      </div>
1044:                   </td>
1045:                 </tr>
1046:               ))}
1047:             </tbody>
1048:           </table>
1049:         </div>
1050:       </div>
1051:       
1052:       {editingCoupon && (
1053:         <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
1054:           <div className="admin-modal-content" style={{maxWidth: '400px'}}>
1055:             <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
1056:               <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>{editingCoupon.coupon_id ? 'Edit Coupon' : 'New Coupon'}</h2>
1057:               <button onClick={() => setEditingCoupon(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
1058:             </div>
1059:             
1060:             <div className="admin-form-group"><label className="admin-form-label">Coupon Code</label><input type="text" className="admin-form-input" value={editingCoupon.code || ''} onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})} /></div>
1061:             <div className="admin-form-group"><label className="admin-form-label">Discount Percentage (%)</label><input type="number" className="admin-form-input" value={editingCoupon.discount_percentage || 0} onChange={e => setEditingCoupon({...editingCoupon, discount_percentage: e.target.value})} /></div>
1062:             <div className="admin-form-group"><label className="admin-form-label">Status</label><select className="admin-form-input" value={editingCoupon.status || 'Active'} onChange={e => setEditingCoupon({...editingCoupon, status: e.target.value})}><option>Active</option><option>Inactive</option></select></div>
1063:             
1064:             <button className="admin-btn-primary admin-btn-full" onClick={saveCoupon}>Save Changes</button>
1065:           </div>
1066:         </div>
1067:       )}
1068:     </div>
1069:   );
1070: }
1071: 
1072: function GalleryTab() {
1073:   const [images, setImages] = useState([]);
1074:   const [activeCategory, setActiveCategory] = useState('Rooms Gallery');
1075:   
1076:   useEffect(() => {
1077:     fetch(`${API_CONFIG_URL}/api_gallery.php`)
1078:       .then(res => res.json())
1079:       .then(data => { if(data && data.status === 'success') setImages(data.data); })
1080:       .catch(e => console.error("JSON Error in Gallery:", e));
1081:   }, []);
1082: 
1083:   const handleUploadImage = (e) => {
1084:     const file = e.target.files[0];
1085:     if(!file) return;
1086:     const formData = new FormData();
1087:     formData.append('image', file);
1088:     formData.append('action', 'upload');
1089:     
1090:     fetch(`${API_CONFIG_URL}/api_rooms.php`, {
1091:       method: 'POST',
1092:       body: formData
1093:     })
1094:     .then(res => res.json())
1095:     .then(data => {
1096:       if(data.status === 'success') {
1097:          fetch(`${API_CONFIG_URL}/api_gallery.php`, {
1098:             method: 'POST',
1099:             headers: { 'Content-Type': 'application/json' },
1100:             body: JSON.stringify({ image_url: data.image_url, category: activeCategory })
1101:          }).then(res => res.json()).then(gData => {
1102:             if(gData.status === 'success') {
1103:                setImages([...images, { image_id: gData.data.id, image_url: data.image_url, category: activeCategory }]);
1104:             }
1105:          });
1106:       }
1107:     }).catch(e => console.error(e));
1108:   };
1109: 
1110:   const handleDeleteImage = (id) => {
1111:     fetch(`${API_CONFIG_URL}/api_gallery.php`, {
1112:       method: 'DELETE',
1113:       headers: { 'Content-Type': 'application/json' },
1114:       body: JSON.stringify({ image_id: id })
1115:     }).then(res => res.json()).then(data => {
1116:       if(data.status === 'success') setImages(images.filter(img => img.image_id !== id));
1117:     }).catch(e => console.error(e));
1118:   };
1119: 
1120:   return (
1121:     <>
1122:       <PageHeader title="Gallery Manager" subtitle="Manage images for rooms, cafe ambiance, and explore sections." action={<label className="admin-btn-primary" style={{cursor: 'pointer'}}><PlusSignIcon size={18} /> Upload Image<input type="file" style={{display: 'none'}} onChange={handleUploadImage} accept="image/*" /></label>} />
1123:       
1124:       <div className="admin-filter-bar" style={{marginBottom: '24px'}}>
1125:          {['Rooms Gallery', 'Cafe Ambiance', 'Main Explore Gallery'].map(cat => (
1126:            <button key={cat} className={`admin-filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
1127:          ))}
1128:       </div>
1129:       
1130:       <div className="admin-item-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'}}>
1131:          {images.filter(img => img.category === activeCategory).map(img => (
1132:             <div key={img.image_id} className="admin-card" style={{padding: '0', overflow: 'hidden'}}>
1133:                <img src={img.image_url} alt="Gallery" style={{width: '100%', height: '150px', objectFit: 'cover', display: 'block'}} />
1134:                <div style={{padding: '12px', display: 'flex', justifyContent: 'center'}}>
1135:                   <button className="admin-btn-outline" style={{color: '#d9534f', borderColor: '#d9534f'}} onClick={() => handleDeleteImage(img.image_id)}><Cancel01Icon size={16} /> Remove</button>
1136:                </div>
1137:             </div>
1138:          ))}
1139:          
1140:          {images.filter(img => img.category === activeCategory).length === 0 && (
1141:             <div style={{gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#888'}}>
1142:                <Image01Icon size={48} strokeWidth={1} style={{marginBottom: '16px'}} />
1143:                <p>No images found in {activeCategory}. Click "Upload Image" to add some.</p>
1144:             </div>
1145:          )}
1146:       </div>
1147:     </>
1148:   );
1149: }
1150: 
1151: function ReviewsTab() {
1152:   const [reviews, setReviews] = useState([]);
1153:   const [editingReview, setEditingReview] = useState(null);
1154: 
1155:   useEffect(() => {
1156:     fetch(`${API_CONFIG_URL}/api_review.php`)
1157:       .then(res => res.json())
1158:       .then(data => { if(data && data.status === 'success' && Array.isArray(data.data)) setReviews(data.data); })
1159:       .catch(e => console.error("JSON Error in Reviews:", e));
1160:   }, []);
1161: 
1162:   const saveReview = () => {
1163:     const isNew = !editingReview.review_id;
1164:     const method = isNew ? 'POST' : 'PUT';
1165:     
1166:     fetch(`${API_CONFIG_URL}/api_review.php`, {
1167:       method: method,
1168:       headers: { 'Content-Type': 'application/json' },
1169:       body: JSON.stringify({
1170:          review_id: editingReview.review_id,
1171:          guest_name: editingReview.guest_name || '',
1172:          rating: editingReview.rating || 5,
1173:          review_text: editingReview.review_text || '',
1174:          visibility: editingReview.visibility || 'Visible'
1175:       })
1176:     })
1177:     .then(res => res.json())
1178:     .then(data => {
1179:       if(data && data.status === 'success') {
1180:         fetch(`${API_CONFIG_URL}/api_review.php`)
1181:           .then(res => res.json())
1182:           .then(refetchData => {
1183:             if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data)) {
1184:               setReviews(refetchData.data);
1185:             }
1186:             setEditingReview(null);
1187:           });
1188:       }
1189:     }).catch(e => console.error(e));
1190:   };
1191: 
1192:   const deleteReview = (id) => {
1193:     if(!window.confirm("Are you sure you want to delete this review?")) return;
1194:     fetch(`${API_CONFIG_URL}/api_review.php`, {
1195:       method: 'DELETE',
1196:       headers: { 'Content-Type': 'application/json' },
1197:       body: JSON.stringify({ review_id: id })
1198:     })
1199:     .then(res => res.json())
1200:     .then(data => {
1201:       if(data && data.status === 'success') {
1202:         setReviews(reviews.filter(r => r.review_id !== id));
1203:       }
1204:     }).catch(e => console.error(e));
1205:   };
1206: 
1207:   return (
1208:     <div className="admin-fade-in">
1209:       <PageHeader title="Reviews & Testimonials" subtitle="Manage guest reviews appearing on the homepage." action={<button className="admin-btn-primary" onClick={() => setEditingReview({visibility: 'Visible', rating: 5})}><PlusSignIcon size={18} /> Add Review</button>} />
1210:       <div className="admin-card">
1211:         <div className="admin-table-wrapper">
1212:           <table className="admin-table">
1213:             <thead><tr><th>Guest Name</th><th>Rating</th><th>Review Snippet</th><th>Visibility</th><th>Actions</th></tr></thead>
1214:             <tbody>
1215:               {reviews.map((r, idx) => (
1216:                 <tr key={idx}>
1217:                   <td className="admin-text-medium">{r.guest_name}</td>
1218:                   <td>{r.rating} Stars</td>
1219:                   <td>{r.review_text.substring(0, 50)}...</td>
1220:                   <td><span className="admin-badge badge-success">{r.visibility}</span></td>
1221:                   <td>
1222:                      <div style={{display: 'flex', gap: '8px'}}>
1223:                        <button className="admin-btn-sm admin-btn-outline" onClick={() => setEditingReview(r)}>Edit</button>
1224:                        <button className="admin-btn-sm admin-btn-outline" onClick={() => deleteReview(r.review_id)}>Delete</button>
1225:                      </div>
1226:                   </td>
1227:                 </tr>
1228:               ))}
1229:             </tbody>
1230:           </table>
1231:         </div>
1232:       </div>
1233:       
1234:       {editingReview && (
1235:         <div className="admin-modal-overlay admin-fade-in" style={{zIndex: 9999}}>
1236:           <div className="admin-modal-content" style={{maxWidth: '500px'}}>
1237:             <div className="admin-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
1238:               <h2 style={{margin: 0, fontSize: '18px', color: '#373737', fontWeight: '600'}}>{editingReview.review_id ? 'Edit Review' : 'Add Review'}</h2>
1239:               <button onClick={() => setEditingReview(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#817F7F'}}><Cancel01Icon size={24} strokeWidth={1.5} /></button>
1240:             </div>
1241:             
1242:             <div className="admin-form-group"><label className="admin-form-label">Guest Name</label><input type="text" className="admin-form-input" value={editingReview.guest_name || ''} onChange={e => setEditingReview({...editingReview, guest_name: e.target.value})} /></div>
1243:             <div className="admin-form-group"><label className="admin-form-label">Rating (1-5)</label><input type="number" min="1" max="5" className="admin-form-input" value={editingReview.rating || 5} onChange={e => setEditingReview({...editingReview, rating: e.target.value})} /></div>
1244:             <div className="admin-form-group"><label className="admin-form-label">Review Text</label><textarea className="admin-form-input" rows="4" value={editingReview.review_text || ''} onChange={e => setEditingReview({...editingReview, review_text: e.target.value})}></textarea></div>
1245:             <div className="admin-form-group"><label className="admin-form-label">Visibility</label><select className="admin-form-input" value={editingReview.visibility || 'Visible'} onChange={e => setEditingReview({...editingReview, visibility: e.target.value})}><option>Visible</option><option>Hidden</option></select></div>
1246:             
1247:             <button className="admin-btn-primary admin-btn-full" onClick={saveReview}>Save Changes</button>
1248:           </div>
1249:         </div>
1250:       )}
1251:     </div>
1252:   );
1253: }
1254: 
1255: function PoliciesTab() {
1256:   const [contentData, setContentData] = useState([]);
1257:   const [editingPolicy, setEditingPolicy] = useState(null);
1258:   
1259:   useEffect(() => {
1260:     fetch(`${API_CONFIG_URL}/api_settings.php`)
1261:       .then(res => res.json())
1262:       .then(data => { if(data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) setContentData(data.data); })
1263:       .catch(e => console.error("JSON Error in Policies:", e));
1264:   }, []);
1265: 
1266:   return (
1267:     <>
1268:       <PageHeader title="Legal Policies & FAQ" subtitle="Update website content for legal pages and FAQs." />
1269:       <div className="admin-fade-in" style={{display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
1270:          <div className="admin-card" style={{flex: '1 1 300px', padding: '24px'}}>
1271:            <h3 style={{marginBottom: '16px', fontSize: '18px'}}>Policies Manager</h3>
1272:            <p style={{color: '#555', fontSize: '14px', marginBottom: '16px'}}>Settings API is mapped for this functionality. Proceed to edit details directly in Global Settings.</p>
1273:            <button className="admin-btn-outline"><Edit01Icon size={16} /> Edit via Settings</button>
1274:          </div>
1275:       </div>
1276:     </>
1277:   );
1278: }
1279: 
1280: function SettingsTab() {
1281:   const [settings, setSettings] = useState({});
1282:   useEffect(() => {
1283:     fetch(`${API_CONFIG_URL}/api_settings.php`)
1284:       .then(res => res.json())
1285:       .then(data => { if(data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) setSettings(data.data[0]); })
1286:       .catch(e => console.error("JSON Error in Settings:", e));
1287:   }, []);
1288: 
1289:   const handleSaveSettings = () => {
1290:     fetch(`${API_CONFIG_URL}/api_settings.php`, {
1291:       method: settings.setting_id ? 'PUT' : 'POST',
1292:       headers: { 'Content-Type': 'application/json' },
1293:       body: JSON.stringify(settings)
1294:     })
1295:     .then(res => res.json())
1296:     .then(data => {
1297:       if(data && data.status === 'success') {
1298:         alert('Settings Saved Successfully');
1299:         fetch(`${API_CONFIG_URL}/api_settings.php`)
1300:           .then(res => res.json())
1301:           .then(refetchData => {
1302:             if(refetchData && refetchData.status === 'success' && Array.isArray(refetchData.data) && refetchData.data.length > 0) {
1303:               setSettings(refetchData.data[0]);
1304:             }
1305:           });
1306:       } else {
1307:         alert('Error saving settings');
1308:       }
1309:     }).catch(e => console.error(e));
1310:   };
1311: 
1312:   return (
1313:     <>
1314:       <PageHeader title="Global Settings" subtitle="Configure contact information and admin accounts." action={<button className="admin-btn-primary" onClick={handleSaveSettings}>Save Configuration</button>} />
1315:       <div className="admin-grid-2">
1316:         <div className="admin-card">
1317:           <div className="admin-card-header"><h2 className="admin-card-title">Contact Information</h2></div>
1318:           <div className="admin-card-body">
1319:             <div className="admin-form-group"><label className="admin-form-label">Primary Phone / WhatsApp</label><input type="text" className="admin-form-input" value={settings.contact_phone || ""} onChange={e => setSettings({...settings, contact_phone: e.target.value})} /></div>
1320:             <div className="admin-form-group"><label className="admin-form-label">Email Address</label><input type="email" className="admin-form-input" value={settings.contact_email || ""} onChange={e => setSettings({...settings, contact_email: e.target.value})} /></div>
1321:             <div className="admin-form-group"><label className="admin-form-label">Physical Address</label><textarea className="admin-form-textarea" value={settings.physical_address || ""} onChange={e => setSettings({...settings, physical_address: e.target.value})} /></div>
1322:           </div>
1323:         </div>
1324:         <div className="admin-card">
1325:           <div className="admin-card-header"><h2 className="admin-card-title">Admin Accounts</h2></div>
1326:           <div className="admin-card-body">
1327:             <div className="admin-form-group"><label className="admin-form-label">Change Password</label><input type="password" className="admin-form-input" placeholder="Enter new password" /></div>
1328:             <button className="admin-btn-outline admin-btn-full"><PlusSignIcon size={16} /> Add Secondary Admin</button>
1329:           </div>
1330:         </div>
1331:       </div>
1332:     </>
1333:   );
1334: }
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
