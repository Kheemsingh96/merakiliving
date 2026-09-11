import re
with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix strokes for consistency with Hugeicons (1.5)
c = re.sub(r'strokeWidth=[\"\'\{]2(\.5)?[\"\'\}]', 'strokeWidth={1.5}', c)

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'w', encoding='utf-8') as f:
    f.write(c)
