const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

c = c.replace(/maxWidth: '2\r?\n\s*<td>\r?\n/g, 
  "maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.description}</div>\n                  </td>\n                  <td>\n"
);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log('Fixed line 799');
