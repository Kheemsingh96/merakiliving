const fs = require('fs');

let fileContent = fs.readFileSync('src/Pages/Booking/Booking.js', 'utf8');

if (!fileContent.includes('showBookedPopup')) {
  // 1. Add state
  fileContent = fileContent.replace(
    'const [roomAvailability, setRoomAvailability] = useState({});',
    'const [roomAvailability, setRoomAvailability] = useState({});\n  const [showBookedPopup, setShowBookedPopup] = useState(false);'
  );

  // 2. Update handleBookNow
  const oldHandleBookNowRegex = /const handleBookNow = useCallback\(\(e, room\) => \{[\s\S]*?\}, \[getNights, guests, checkInDate, checkOutDate, setCurrentPage\]\);/;
  const newHandleBookNow = `const handleBookNow = useCallback((e, room) => {
    e.stopPropagation();
    if (roomAvailability[room.id] === 'Booked') {
      setShowBookedPopup(true);
      return;
    }
    const nights = getNights();
    const price = parseInt(room.price.split(',').join(''), 10);
    const totalPrice = price * nights * guests.rooms;
    const bookingData = {
      roomId: room.id,
      roomTitle: room.title,
      roomPrice: room.price,
      roomOriginalPrice: room.originalPrice,
      roomDiscount: room.discount,
      nights: nights,
      rooms: guests.rooms,
      adults: guests.adults,
      children: guests.children,
      checkIn: checkInDate ? checkInDate.toISOString() : null,
      checkOut: checkOutDate ? checkOutDate.toISOString() : null,
      totalAmount: totalPrice
    };
    sessionStorage.setItem('meraki_booking', JSON.stringify(bookingData));
    if (setCurrentPage) {
      setCurrentPage('guest-details', room.id);
    }
  }, [getNights, guests, checkInDate, checkOutDate, setCurrentPage, roomAvailability]);`;
  
  fileContent = fileContent.replace(oldHandleBookNowRegex, newHandleBookNow);

  // 3. Add popup JSX
  const popupJsx = `
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
            <h3 style={{ margin: '0 0 16px', fontSize: '22px', color: '#373737', fontWeight: '600' }}>Room Unavailable</h3>
            <p style={{ margin: '0 0 24px', fontSize: '15px', color: '#817F7F', lineHeight: '1.6' }}>This room is already booked. Please try another date or select a different room.</p>
            <button onClick={() => setShowBookedPopup(false)} style={{
              background: '#870097', color: '#fff', border: 'none', padding: '12px 32px', 
              borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', width: '100%'
            }}>Okay, I understand</button>
          </div>
        </div>
      )}
    </section>
  );
};`;
  
  fileContent = fileContent.replace('    </section>\n  );\n};', popupJsx);
  
  fs.writeFileSync('src/Pages/Booking/Booking.js', fileContent);
  console.log('Booking.js updated successfully.');
} else {
  console.log('Booking.js already contains showBookedPopup.');
}
