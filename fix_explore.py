import re

with open('src/components/Explore/Explore.css', 'r') as f:
    css = f.read()

# 1. Update Grid to 6 columns
css = re.sub(r'\.explore-grid \{[^}]+\}', '.explore-grid {\n  display: grid;\n  grid-template-columns: repeat(6, minmax(0, 1fr));\n  grid-auto-rows: 200px;\n  gap: 16px;\n  width: 100%;\n  max-width: 1280px;\n  margin: 0 auto;\n}', css, count=1)

# 2. Update explore-card layout
grid_items_css = '''
.explore-card:nth-child(1) { grid-column: 1 / 3; grid-row: 1 / 3; }
.explore-card:nth-child(2) { grid-column: 3 / 5; grid-row: 1 / 2; }
.explore-card:nth-child(3) { grid-column: 3 / 4; grid-row: 2 / 3; }
.explore-card:nth-child(4) { grid-column: 4 / 5; grid-row: 2 / 3; }
.explore-card:nth-child(5) { grid-column: 5 / 7; grid-row: 1 / 3; }
'''
css = re.sub(r'\.explore-card:nth-child\(1\).*?\.explore-card:hover \{', grid_items_css + '\n.explore-card:hover {', css, flags=re.DOTALL)

# 3. Add explore-footer
css += '''\n/* --- Explore Footer --- */
.explore-footer { max-width: 800px; margin: 60px auto 0; text-align: center; }
.explore-footer-text { font-size: 16px; color: #555555; line-height: 1.8; font-weight: 400; letter-spacing: 0.2px; }
'''

# 4. Remove gallery card content
css = re.sub(r'\.gallery-card-content \{[^}]+\}', '', css)
css = re.sub(r'\.gallery-card-name \{[^}]+\}', '', css)
css = re.sub(r'\.gallery-card-desc \{[^}]+\}', '', css)

# 5. Fix gallery card image box min/max heights
css = re.sub(r'min-height:\s*\d+px;', '', css)
css = re.sub(r'max-height:\s*\d+px;', '', css)
css = re.sub(r'height:\s*220px;', 'height: 100%;', css)
css = re.sub(r'height:\s*200px;', 'height: 100%;', css)
css = re.sub(r'height:\s*180px;', 'height: 100%;', css)

# 6. Fix .gallery-card
css = re.sub(r'\.gallery-card \{\s*(.*?)\s*\}', lambda m: '.gallery-card {\n' + re.sub(r'border: 1px solid #f0f0f0;', 'border: none;', m.group(1)) + '\n}', css, count=1)

with open('src/components/Explore/Explore.css', 'w') as f:
    f.write(css)
