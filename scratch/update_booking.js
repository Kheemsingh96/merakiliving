const fs = require('fs');

let fileContent = fs.readFileSync('src/Pages/Booking/Booking.js', 'utf8');

const importStatement = "import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';";

if (!fileContent.includes("const [roomAvailability, setRoomAvailability] = useState({});")) {
    const bookingFuncStart = "const Booking = ({ setCurrentPage }) => {";
    const stateInjections = `const Booking = ({ setCurrentPage }) => {
  const [roomAvailability, setRoomAvailability] = useState({});

  useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_rooms.php')
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && Array.isArray(data.data)) {
           const availability = {};
           data.data.forEach(r => {
              availability[r.id] = r.status;
           });
           setRoomAvailability(availability);
        }
      })
      .catch(e => console.error("Error fetching room status:", e));
  }, []);
`;
    fileContent = fileContent.replace(bookingFuncStart, stateInjections);
}

const oldSizeDiv = `<div className="booking-room-size">
              <HugeiconsIcon icon={MapPinIcon} size={14} />
              <span>{room.size}</span>
            </div>`;

const newSizeDiv = `<div className="booking-room-size">
              {roomAvailability[room.id] === 'Booked' ? (
                <span style={{color: '#dc2626', backgroundColor: '#fef2f2', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'inline-block'}}>Booked</span>
              ) : (
                <span style={{color: '#16a34a', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'inline-block'}}>Available</span>
              )}
            </div>`;

fileContent = fileContent.replace(oldSizeDiv, newSizeDiv);

const oldDeps = `}, [selectedThumb, expandedDesc, handleThumbClick, toggleDesc, handleViewDetails, handleBookNow, mergedRoomsData]);`;
const newDeps = `}, [selectedThumb, expandedDesc, handleThumbClick, toggleDesc, handleViewDetails, handleBookNow, roomAvailability]);`;

// Since mergedRoomsData might be what was there, or maybe it was just a typo. Let's just do a regex replace for the useMemo deps of roomCards
fileContent = fileContent.replace(/}, \[selectedThumb, expandedDesc, handleThumbClick, toggleDesc, handleViewDetails, handleBookNow.*?\]\);/, 
  `}, [selectedThumb, expandedDesc, handleThumbClick, toggleDesc, handleViewDetails, handleBookNow, roomAvailability]);`);

fs.writeFileSync('src/Pages/Booking/Booking.js', fileContent);
console.log('Booking.js updated successfully.');
