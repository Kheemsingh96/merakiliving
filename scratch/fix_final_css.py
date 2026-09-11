import sys

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Typography Fixes
new_css = '''
/* --- FINAL TYPOGRAPHY & BUTTON FIXES --- */

h1, h2, h3, h4, h5, h6, .admin-card-title, .admin-item-title, .admin-page-title {
  font-weight: 600 !important;
}

.admin-stat-value {
  font-weight: 700 !important;
}

p, span, .admin-item-desc, .admin-page-subtitle, .admin-stat-subtext, label, .admin-form-label, td, th {
  font-weight: 500 !important;
}

/* Fix buttons to be filled */
.admin-btn-outline {
  background: #8A158F !important;
  color: white !important;
  border: none !important;
}
.admin-btn-outline:hover {
  background: #6c1070 !important;
}
.admin-btn-outline svg {
  color: white !important;
}

/* Sidebar Profile Integration */
.admin-sidebar-footer-profile {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  padding: 12px 16px !important;
  background: transparent !important;
  border: none !important;
  margin: 0 !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  border-radius: 8px !important;
}
.admin-sidebar-footer-profile:hover {
  background: rgba(138, 21, 143, 0.05) !important;
}

/* Click Away Overlay */
.admin-click-away {
  position: fixed;
  inset: 0;
  z-index: 99;
}
.admin-dropdown-menu {
  z-index: 100 !important;
}

/* Room Status List Item */
.admin-room-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(138,21,143,0.05);
  margin-bottom: 20px;
}
.admin-room-list-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
  margin-bottom: 0;
}
.admin-room-list-item img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}
.admin-room-list-info {
  flex: 1;
}
.admin-room-list-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600 !important;
  color: #373737;
}
.admin-room-list-info p {
  margin: 0;
  font-size: 13px;
  color: #555;
  font-weight: 500 !important;
}
.admin-status-toggle {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}
.admin-status-toggle:hover {
  transform: scale(1.05);
}
'''

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.css', 'w', encoding='utf-8') as f:
    f.write(css + new_css)

print("CSS Fixed")
