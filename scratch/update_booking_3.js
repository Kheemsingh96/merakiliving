const fs = require('fs');

let fileContent = fs.readFileSync('src/Pages/Booking/Booking.js', 'utf8');

// Replace date range
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

const oldSizeDivRegex = /<div className="booking-room-size">[\s\S]*?<\/div>/;
const newSizeDiv = `<div className="booking-room-size availability-desktop">
${availabilityTagJsx}
              </div>`;

fileContent = fileContent.replace(oldSizeDivRegex, newSizeDiv);

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

fileContent = fileContent.replace(oldFooterRegex, newFooter);

fs.writeFileSync('src/Pages/Booking/Booking.js', fileContent);
console.log('Booking.js updated successfully with Regex.');
