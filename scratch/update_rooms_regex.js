const fs = require('fs');

let fileContent = fs.readFileSync('src/components/Rooms/Rooms.js', 'utf8');

const oldFuncRegex = /function Rooms\(\{ setCurrentPage \}\) \{[\s\S]*?return \(/;

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

fileContent = fileContent.replace(oldFuncRegex, newRoomsFunc);

fs.writeFileSync('src/components/Rooms/Rooms.js', fileContent);
console.log('Rooms.js regex updated.');
