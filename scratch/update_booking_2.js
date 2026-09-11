const fs = require('fs');

let fileContent = fs.readFileSync('src/Pages/Booking/Booking.js', 'utf8');

// Replace date range from + 2 to + 1
fileContent = fileContent.replace(
  "const defaultCheckOut = storedCheckOut ? new Date(storedCheckOut) : new Date(new Date().setDate(new Date().getDate() + 2));",
  "const defaultCheckOut = storedCheckOut ? new Date(storedCheckOut) : new Date(new Date().setDate(new Date().getDate() + 1));"
);

// We want to extract the availability span to a variable that we can reuse in JSX
const availabilityTagJsx = `
                {roomAvailability[room.id] === 'Booked' ? (
                  <span className="availability-tag booked">Booked</span>
                ) : (
                  <span className="availability-tag available">Available</span>
                )}
`;

const oldSizeDiv = `<div className="booking-room-size">
                {roomAvailability[room.id] === 'Booked' ? (
                  <span style={{color: '#dc2626', backgroundColor: '#fef2f2', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'inline-block'}}>Booked</span>
                ) : (
                  <span style={{color: '#16a34a', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'inline-block'}}>Available</span>
                )}
              </div>`;

const newSizeDiv = `<div className="booking-room-size availability-desktop">
${availabilityTagJsx}
              </div>`;

fileContent = fileContent.replace(oldSizeDiv, newSizeDiv);

const oldFooter = `<div className="booking-room-footer">
              <div className="booking-room-price">
                <span className="booking-price-amount">&#8377;{room.price}</span>
                <span className="booking-price-original">&#8377;{room.originalPrice}</span>
                <span className="booking-price-discount">{room.discount}% OFF</span>
              </div>
              <div className="booking-footer-actions">`;

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

fileContent = fileContent.replace(oldFooter, newFooter);

fs.writeFileSync('src/Pages/Booking/Booking.js', fileContent);
console.log('Booking.js updated.');
