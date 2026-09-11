const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const target = "{showDateDropdown && (\n                <div className=\"admin-dropdown-menu\" style={{top: '100%', right: '0', marginTop: '8px'}}>\n                  <div className={\\dropdown-item \\} onClick={(e) => {e.stopPropagation(); setDateRange('Last 7 Days'); setShowDateDropdown(false)}}>Last 7 Days</div>\n                  <div className={\\dropdown-item \\} onClick={(e) => {e.stopPropagation(); setDateRange('Last 30 Days'); setShowDateDropdown(false)}}>Last 30 Days</div>\n                  <div className={\\dropdown-item \\} onClick={(e) => {e.stopPropagation(); setDateRange('This Month'); setShowDateDropdown(false)}}>This Month</div>\n                </div>\n              )}";

const replacement = "{showDateDropdown && (\n                <div className=\"admin-dropdown-menu\" style={{top: '100%', right: '0', marginTop: '8px'}}>\n                  <div className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange('Last 7 Days'); setShowDateDropdown(false)}}>Last 7 Days</div>\n                  <div className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange('Last 30 Days'); setShowDateDropdown(false)}}>Last 30 Days</div>\n                  <div className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange('This Month'); setShowDateDropdown(false)}}>This Month</div>\n                </div>\n              )}";

c = c.replace(target, replacement);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log('Fixed JSX syntax error');
