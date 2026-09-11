const fs = require('fs');
let c = fs.readFileSync('src/Pages/Booking/Booking.js', 'utf8');
const searchReg = / {8}<\/div>\s*<\/div>\s*<\/section>\s*\);\s*\};\s*export default Booking;/;
const popupJsx = `        </div>
      {showBookedPopup && (
        <div className="dropdown-popup-overlay" onClick={() => setShowBookedPopup(false)} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', 
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="booked-popup-content" style={{
            background: '#fff', padding: '32px 40px', borderRadius: '16px', 
            textAlign: 'center', maxWidth: '400px', width: '90%', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', fontSize: '22px', color: '#373737', fontWeight: '600' }}>This room is already booked.</h3>
            <p style={{ margin: '0 0 24px', fontSize: '15px', color: '#817F7F', lineHeight: '1.6' }}>Please try another date or select a different room.</p>
            <button onClick={() => setShowBookedPopup(false)} style={{
              background: '#870097', color: '#fff', border: 'none', padding: '12px 32px', 
              borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', width: '100%'
            }}>Okay, got it</button>
          </div>
        </div>
      )}
      </div>
    </section>
  );
};

export default Booking;`;

c = c.replace(searchReg, popupJsx);
fs.writeFileSync('src/Pages/Booking/Booking.js', c);
console.log('Popup appended!');
