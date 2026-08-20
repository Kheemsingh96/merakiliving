import re

with open('src/components/Explore/Explore.css', 'r') as f:
    css = f.read()

# Fix 600px media query
css = re.sub(r'@media \(max-width: 600px\) \{\s*\.explore-grid \{\s*grid-template-columns: 1fr;\s*grid-auto-rows: auto;\s*\}', '@media (max-width: 600px) {\n  .explore-grid {\n    grid-template-columns: 1fr;\n    grid-auto-rows: 240px;\n  }', css)

css = re.sub(r'\.explore-card \{\s*grid-column: auto;\s*grid-row: auto;\s*height: 300px;\s*\}.*?\.explore-card:nth-child\(5\) \{\s*grid-column: auto;\s*grid-row: auto;\s*\}', '.explore-card {\n    grid-column: 1 / -1 !important;\n    grid-row: auto !important;\n    height: 100% !important;\n  }\n  .explore-card:nth-child(n) { grid-column: 1 / -1 !important; grid-row: auto !important; height: 100% !important; }', css, flags=re.DOTALL)

with open('src/components/Explore/Explore.css', 'w') as f:
    f.write(css)
