const fs = require('fs');

let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

let pricingUseEffect = `  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('http://localhost/merakiliving_backend/api_rooms.php');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setRooms(data);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    fetchRooms();
  }, []);`;

c = c.replace(/const \[isSaved, setIsSaved\] = React\.useState\(false\);/, `const [isSaved, setIsSaved] = React.useState(false);\n\n${pricingUseEffect}`);

// In PricingTab, room.title is mapped, but from API it is room.name. 
// Also room.img needs fallback.
c = c.replace(/<h2 className="admin-card-title" style={{marginBottom: '16px', fontSize: '16px'}}>{room\.title}<\/h2>/g, `<h2 className="admin-card-title" style={{marginBottom: '16px', fontSize: '16px'}}>{room.name}</h2>`);
c = c.replace(/<img src={room\.img} alt={room\.title}/g, `<img src={room.img || room1} alt={room.name}`);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched PricingTab");
