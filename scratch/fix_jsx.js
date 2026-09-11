const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');

const brokenRegex = /\{showNotificationDropdown && \([\s\S]*?<div className="admin-grid-4">/;

const fixedChunk = `{showNotificationDropdown && (
              <>
                <div className="admin-click-away" onClick={() => setShowNotificationDropdown(false)}></div>
                <div className="admin-dropdown-menu notification-menu admin-fade-in">
                  <div className="dropdown-header">Notifications ({notifications.length})</div>
                  {notifications.map(n => (
                    <div className="dropdown-item" key={n.id}>
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="admin-icon-btn logout-top-btn" onClick={() => { sessionStorage.removeItem('meraki_admin_auth'); window.location.reload(); }}>
            <Logout01Icon size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="admin-grid-4">`;

c = c.replace(brokenRegex, fixedChunk);

fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', c);
console.log("Fixed JSX syntax error");
