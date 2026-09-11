const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const createBookingRegex = /const handleCreateBooking = async \(\) => \{[\s\S]*?console\.error\("Failed to create booking:", error\);\n\s*\}\n\s*\};/;
const newCreateBooking = `const handleCreateBooking = async () => {
    const guestName = prompt("Enter Guest Name:");
    if (!guestName) return;
    const phone = prompt("Enter Guest Phone:");
    const room = prompt("Enter Room ID (1-4):");
    const checkIn = prompt("Enter Check-in Date (YYYY-MM-DD):");
    const checkOut = prompt("Enter Check-out Date (YYYY-MM-DD):");
    
    try {
      const res = await fetch('http://localhost/merakiliving_backend/api_bookings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: guestName,
          guest_phone: phone,
          guest_email: guestName.replace(" ", "") + "@example.com",
          room_id: room,
          check_in: checkIn,
          check_out: checkOut,
          status: "Pending",
          amount: 5000
        })
      });
      if (res.ok) {
        alert("Booking created successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };`;

c = c.replace(createBookingRegex, newCreateBooking);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Patched BookingsTab Create Booking button.");
