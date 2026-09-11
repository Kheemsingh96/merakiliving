import sys

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange(\'Last 7 Days\');', 'className={\dropdown-item \\} onClick={(e) => {e.stopPropagation(); setDateRange(\'Last 7 Days\');')
c = c.replace('className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange(\'Last 30 Days\');', 'className={\dropdown-item \\} onClick={(e) => {e.stopPropagation(); setDateRange(\'Last 30 Days\');')
c = c.replace('className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange(\'This Month\');', 'className={\dropdown-item \\} onClick={(e) => {e.stopPropagation(); setDateRange(\'This Month\');')

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('Fixed dropdown template strings')
