import re

with open('src/components/Explore/Explore.css', 'r') as f:
    css = f.read()

# Fix 1024px media query
css = re.sub(r'\.explore-grid \{\s*grid-template-columns: repeat\(8, minmax\(0, 1fr\)\);\s*grid-auto-rows: 120px;\s*\}', '.explore-grid {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n    grid-auto-rows: 200px;\n  }', css)

grid_items_css = '''
  .explore-card:nth-child(1) { grid-column: 1 / 3; grid-row: 1 / 3; }
  .explore-card:nth-child(2) { grid-column: 3 / 5; grid-row: 1 / 2; }
  .explore-card:nth-child(3) { grid-column: 3 / 4; grid-row: 2 / 3; }
  .explore-card:nth-child(4) { grid-column: 4 / 5; grid-row: 2 / 3; }
  .explore-card:nth-child(5) { grid-column: 1 / -1; grid-row: 3 / 4; }
'''
css = re.sub(r'\.explore-card:nth-child\(1\) \{\s*grid-column: span 8;\s*grid-row: span 4;\s*\}.*?\.explore-card:nth-child\(5\) \{\s*grid-column: span 4;\s*grid-row: span 3;\s*\}', grid_items_css.strip(), css, flags=re.DOTALL)

with open('src/components/Explore/Explore.css', 'w') as f:
    f.write(css)
