const fs = require('fs');
let content = fs.readFileSync('src/Pages/Booking/Booking.js', 'utf8');

// Add the states right after const Booking = ({ setCurrentPage }) => {
content = content.replace(
  "const Booking = ({ setCurrentPage }) => {\n  const [selectedThumb, setSelectedThumb] = useState({});",
  "const Booking = ({ setCurrentPage }) => {\n  const [roomAvailability, setRoomAvailability] = useState({});\n  const [displayRooms, setDisplayRooms] = useState(roomsData);\n  const [showBookedPopup, setShowBookedPopup] = useState(false);\n  const [selectedThumb, setSelectedThumb] = useState({});"
);

// Add the useEffect fetch
const useEffectHook = `

  useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_rooms.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          const availability = {};
          data.data.forEach(room => {
            availability[room.id] = room.status;
          });
          setRoomAvailability(availability);

          const merged = roomsData.map(localRoom => {
            const backendRoom = data.data.find(r => r.id === localRoom.id);
            if (backendRoom) {
              return {
                ...localRoom,
                title: backendRoom.name || localRoom.title,
                desc: backendRoom.description || localRoom.desc,
                price: backendRoom.price?.toLocaleString() || localRoom.price,
                originalPrice: backendRoom.original_price?.toLocaleString() || localRoom.originalPrice,
                discount: backendRoom.off_percentage || localRoom.discount,
                image: backendRoom.image_url || localRoom.image,
              };
            }
            return localRoom;
          });
          setDisplayRooms(merged);
        }
      })
      .catch(err => console.error(err));
  }, []);
`;

// Insert useEffect before `const storedCheckIn = sessionStorage.getItem('meraki_checkIn');`
content = content.replace(
  "  const storedCheckIn = sessionStorage.getItem('meraki_checkIn');",
  useEffectHook + "\n  const storedCheckIn = sessionStorage.getItem('meraki_checkIn');"
);

// We need to change `roomsData.map((room)` to `displayRooms.map((room)`
content = content.replace(/roomsData\.map\(\(room\)/g, 'displayRooms.map((room)');

// We need to add `roomAvailability` and `displayRooms` to the dependencies of `roomCards` useMemo
// First find where the dependency array is for `roomCards` useMemo
content = content.replace(
  "}, [selectedThumb, expandedDesc, handleThumbClick, toggleDesc, handleViewDetails, handleBookNow]);",
  "}, [selectedThumb, expandedDesc, handleThumbClick, toggleDesc, handleViewDetails, handleBookNow, roomAvailability, displayRooms]);"
);

// Change `handleBookNow`
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
content = content.replace(oldHandleBookNowRegex, newHandleBookNow);

// Add the Room Size / Availability tag
const availabilityTagJsx = `
                {roomAvailability[room.id] === 'Booked' ? (
                  <span className="availability-tag booked">Booked</span>
                ) : (
                  <span className="availability-tag available">Available</span>
                )}
`;

const oldSizeDivRegex = /<div className="booking-room-size">[\s\S]*?<\/div>/;
const newSizeDiv = `<div className="booking-room-size availability-desktop">
${availabilityTagJsx}
              </div>`;
content = content.replace(oldSizeDivRegex, newSizeDiv);

// Add the Mobile availability tag to Footer
const oldFooterRegex = /<div className="booking-room-footer">\s*<div className="booking-room-price">[\s\S]*?<\/div>\s*<div className="booking-footer-actions">/;
const newFooter = `<div className="booking-room-footer">
              <div className="booking-room-price-wrapper" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1}}>
                <div className="booking-room-price">
                  <span className="booking-price-amount">&#8377;{room.price}</span>
                  <span className="booking-price-original">&#8377;{room.originalPrice}</span>
                  <span className="booking-price-discount">{room.discount}% OFF</span>
                </div>
                <div className="availability-mobile">
${availabilityTagJsx}
                </div>
              </div>
              <div className="booking-footer-actions">`;
content = content.replace(oldFooterRegex, newFooter);

// Append the popup JSX at the end, replacing the exact final lines:
//         </div>
//       </div>
//     </section>
//   );
// };
// 
// export default Booking;

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
content = content.replace(searchReg, popupJsx);

fs.writeFileSync('src/Pages/Booking/Booking.js', content);
console.log('Successfully wrote comprehensive Booking.js fix.');
