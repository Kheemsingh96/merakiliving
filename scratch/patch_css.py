import sys

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make sidebar profile name single line
if '.admin-sidebar-footer-profile-name { font-size: 14px; font-weight: 600; color: #373737; }' in css:
    css = css.replace('.admin-sidebar-footer-profile-name { font-size: 14px; font-weight: 600; color: #373737; }', '.admin-sidebar-footer-profile-name { font-size: 14px; font-weight: 600; color: #373737; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }')
    css = css.replace('.admin-sidebar-footer-profile-role { font-size: 12px; color: #817F7F; }', '.admin-sidebar-footer-profile-role { font-size: 12px; color: #817F7F; white-space: nowrap; display: block; }')

# Append new CSS
new_css = '''
/* --- NEW PREMIUM FIXES --- */

.admin-fade-in {
  animation: adminFadeIn 0.3s ease-out forwards;
}

@keyframes adminFadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.hover-lift {
  transition: all 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(138, 21, 143, 0.15);
}

.hover-lift-subtle {
  transition: all 0.2s ease;
}
.hover-lift-subtle:hover {
  transform: translateX(4px);
}

.admin-room-status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.admin-room-premium-card {
  display: flex;
  background: #fff;
  border: 1px solid rgba(138,21,143,0.08);
  border-radius: 12px;
  overflow: hidden;
  align-items: center;
}
.admin-room-card-img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  flex-shrink: 0;
  border-right: 1px solid rgba(138,21,143,0.04);
}
.admin-room-card-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.admin-pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.admin-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.admin-modal-content {
  background: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2);
}

/* Responsiveness Fixes */
.admin-table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 1024px) {
  .admin-pricing-grid { grid-template-columns: 1fr; }
  .admin-room-status-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .admin-pricing-img-wrapper { display: none; }
  .admin-room-premium-card { flex-direction: column; align-items: flex-start; }
  .admin-room-card-img { width: 100%; height: 160px; border-right: none; border-bottom: 1px solid rgba(138,21,143,0.04); }
}

/* Typography Overrides */
.admin-page-subtitle, .admin-item-desc, .admin-stat-subtext, p {
  font-weight: 500 !important;
  color: #555 !important;
}
.admin-form-label {
  font-weight: 600 !important;
  color: #373737 !important;
}
.admin-card-title {
  font-weight: 700 !important;
}

'''
with open('src/Pages/Admin/AdminDashboard/AdminDashboard.css', 'w', encoding='utf-8') as f:
    f.write(css + new_css)
print("CSS patched")
