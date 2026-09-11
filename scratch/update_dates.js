const fs = require('fs');

function replaceDate(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    "const checkOutDate = storedCheckOut ? new Date(storedCheckOut) : new Date(new Date().setDate(new Date().getDate() + 2));",
    "const checkOutDate = storedCheckOut ? new Date(storedCheckOut) : new Date(new Date().setDate(new Date().getDate() + 1));"
  );
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

replaceDate('src/Pages/GuestDetails/GuestDetails.js');
replaceDate('src/Pages/Payment/Payment.js');
