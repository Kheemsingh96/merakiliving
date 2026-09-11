import sys

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.css', 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace('.admin-filter-dropdown { display: flex;', '.admin-filter-dropdown { position: relative; display: flex;')

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re

c = re.sub(
    r'<div className="admin-filter-dropdown" onClick=\{[^}]+\}>.*?</div>',
    '''<div className="admin-filter-dropdown" onClick={() => setShowDateDropdown(!showDateDropdown)}>
              <span style={{fontWeight: '500', color: '#373737'}}>{dateRange}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
              {showDateDropdown && (
                <div className="admin-dropdown-menu" style={{top: '100%', right: '0', marginTop: '8px'}}>
                  <div className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange('Last 7 Days'); setShowDateDropdown(false)}}>Last 7 Days</div>
                  <div className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange('Last 30 Days'); setShowDateDropdown(false)}}>Last 30 Days</div>
                  <div className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange('This Month'); setShowDateDropdown(false)}}>This Month</div>
                </div>
              )}
            </div>''',
    c, flags=re.DOTALL
)

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('Fixed dropdown')
