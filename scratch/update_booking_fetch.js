const fs = require('fs');

let fileContent = fs.readFileSync('src/Pages/Booking/Booking.js', 'utf8');

fileContent = fileContent.replace('const [roomAvailability, setRoomAvailability] = useState({});', 'const [roomAvailability, setRoomAvailability] = useState({});\n  const [displayRooms, setDisplayRooms] = useState(roomsData);');

const oldFetch = `  useEffect(() => {
    fetch('http://localhost/merakiliving_backend/api_rooms.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const availability = {};
          data.data.forEach(room => {
            availability[room.id] = room.status;
          });
          setRoomAvailability(availability);
        }
      })
      .catch(err => console.error(err));
  }, []);`;

const newFetch = `  useEffect(() => {
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
  }, []);`;

fileContent = fileContent.replace(oldFetch, newFetch);
fileContent = fileContent.replace(/roomsData\.map\(\(room\)/g, 'displayRooms.map((room)');

fs.writeFileSync('src/Pages/Booking/Booking.js', fileContent);
console.log('Booking.js updated to fetch full backend data.');
