const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

c = c.replace(/const handleSave = \(\) => \{\s*setIsSaved\(true\);\s*setTimeout\(\(\) => setIsSaved\(false\), 2000\);\s*\};/,
`const handleSave = async () => {
    try {
      for (const room of rooms) {
        await fetch('http://localhost/merakiliving_backend/api_rooms.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: room.id, price: room.price })
        });
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error("Failed to update pricing:", error);
    }
  };`);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched PricingTab Save");
