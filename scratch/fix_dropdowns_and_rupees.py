import sys
import re

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Fix Rupees (replace '?' with '?' where appropriate)
# Let's target specific known strings to avoid replacing real question marks in JS ternary operators.
c = c.replace("price: '?4,500'", "price: '?4,500'")
c = c.replace("price: '?3,800'", "price: '?3,800'")
c = c.replace("price: '?7,200'", "price: '?7,200'")
c = c.replace("price: '?18,000'", "price: '?18,000'")
c = c.replace(">?1,48,750<", ">?1,48,750<")

# 2. Fix Profile Dropdown logic
# Remove onClick from the main profile container
profile_match = re.search(r'<div className="admin-sidebar-footer-profile" onClick=\{.*?\}\>', c)
if profile_match:
    c = c.replace(profile_match.group(0), '<div className="admin-sidebar-footer-profile">')

# Add onClick to the arrow icon container
arrow_container = '''<div style={{color: '#817F7F', display: 'flex'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>'''
new_arrow_container = '''<div style={{color: '#817F7F', display: 'flex', cursor: 'pointer', padding: '4px'}} onClick={(e) => { e.stopPropagation(); setShowProfileMenu(prev => !prev); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>'''
c = c.replace(arrow_container, new_arrow_container)

# 3. Split date dropdown state into Top and Chart
c = c.replace("const [showDateDropdown, setShowDateDropdown] = React.useState(false);", 
              "const [showDateDropdownTop, setShowDateDropdownTop] = React.useState(false);\n  const [showDateDropdownChart, setShowDateDropdownChart] = React.useState(false);")

# In Header:
# Date Selector Top
c = c.replace("onClick={() => { setShowDateDropdown(true); setShowNotificationDropdown(false); }}", 
              "onClick={(e) => { e.stopPropagation(); setShowDateDropdownTop(prev => !prev); setShowNotificationDropdown(false); }}")
# The click away and menu for top
c = c.replace("{showDateDropdown && (", "{showDateDropdownTop && (", 1)
c = c.replace("onClick={() => setShowDateDropdown(false)}", "onClick={() => setShowDateDropdownTop(false)}", 1)
c = c.replace("setShowDateDropdown(false)", "setShowDateDropdownTop(false)", 3)

# Notification Toggle
c = c.replace("onClick={() => { setShowNotificationDropdown(true); setShowDateDropdown(false); }}", 
              "onClick={(e) => { e.stopPropagation(); setShowNotificationDropdown(prev => !prev); setShowDateDropdownTop(false); }}")

# In Chart:
# Date Selector Chart
c = c.replace("onClick={() => setShowDateDropdown(true)}", 
              "onClick={(e) => { e.stopPropagation(); setShowDateDropdownChart(prev => !prev); }}")
c = c.replace("{showDateDropdown && (", "{showDateDropdownChart && (", 1)
c = c.replace("onClick={(e) => {e.stopPropagation(); setShowDateDropdown(false);}}", "onClick={(e) => {e.stopPropagation(); setShowDateDropdownChart(false);}}", 1)
c = c.replace("setShowDateDropdown(false)", "setShowDateDropdownChart(false)", 3)

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'w', encoding='utf-8') as f:
    f.write(c)
print("JavaScript fixes applied.")
