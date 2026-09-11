const fs = require('fs');

let fileContent = fs.readFileSync('src/components/Rooms/Rooms.js', 'utf8');

// We need to add useState and useEffect to fetch backend data
fileContent = fileContent.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';");

const oldRoomsFunc = `function Rooms({ setCurrentPage }) {
  const handleViewRoom = (roomId) => {
    if (setCurrentPage) {
      setCurrentPage('room-details', roomId);
    }
  };

  return (`;

const newRoomsFunc = `function Rooms({ setCurrentPage }) {
  const [rooms, setRooms] = useState(ROOMS_DATA);

  useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_rooms.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          const merged = ROOMS_DATA.map(localRoom => {
            const backendRoom = data.data.find(r => r.id === localRoom.id);
            if (backendRoom) {
              return {
                ...localRoom,
                title: backendRoom.name || localRoom.title,
                desc: backendRoom.description || localRoom.desc,
                price: backendRoom.price?.toLocaleString() || localRoom.price,
                originalPrice: backendRoom.original_price?.toLocaleString() || localRoom.originalPrice,
                image: backendRoom.image_url || localRoom.image,
              };
            }
            return localRoom;
          });
          setRooms(merged);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleViewRoom = (roomId) => {
    if (setCurrentPage) {
      setCurrentPage('room-details', roomId);
    }
  };

  return (`;

fileContent = fileContent.replace(oldRoomsFunc, newRoomsFunc);
fileContent = fileContent.replace(/ROOMS_DATA\.map\(\(room\)/g, 'rooms.map((room)');

fs.writeFileSync('src/components/Rooms/Rooms.js', fileContent);
console.log('Rooms.js updated to fetch backend data.');
