import sys

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(r'className={\dropdown-item \}', 'className="dropdown-item"')
# Make them active manually based on state if needed, but for now just fix syntax so it compiles
c = c.replace('className="dropdown-item" onClick={(e) => {e.stopPropagation(); setDateRange(\'Last 7 Days\');', 'className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange(\'Last 7 Days\');')
c = c.replace('className="dropdown-item" onClick={(e) => {e.stopPropagation(); setDateRange(\'Last 30 Days\');', 'className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange(\'Last 30 Days\');')
c = c.replace('className="dropdown-item" onClick={(e) => {e.stopPropagation(); setDateRange(\'This Month\');', 'className={dropdown-item } onClick={(e) => {e.stopPropagation(); setDateRange(\'This Month\');')

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('Fixed JSX')
