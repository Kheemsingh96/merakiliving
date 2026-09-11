import sys

with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# We will replace the <div style={{padding: '24px'... Booking Overview chart ... </div>
# Instead of regex which is messy, we'll replace the SVG entirely
old_svg_start = content.find('<svg width="100%" height="220"')
old_svg_end = content.find('</svg>', old_svg_start) + 6

new_chart = '''
            <div style={{position: 'relative', width: '100%', height: '240px'}}>
              {/* Y Axis */}
              <div style={{position: 'absolute', top: 0, bottom: '24px', left: 0, width: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#817F7F', fontSize: '11px', textAlign: 'right', fontWeight: '500'}}>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>
              
              {/* Grid Lines */}
              <div style={{position: 'absolute', top: '5px', bottom: '29px', left: '40px', right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
                <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
                <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
                <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
                <div style={{borderBottom: '1px solid #cbd5e1', width: '100%'}}></div>
              </div>

              {/* X Axis */}
              <div style={{position: 'absolute', bottom: 0, left: '40px', right: 0, display: 'flex', justifyContent: 'space-between', color: '#817F7F', fontSize: '11px', fontWeight: '500'}}>
                <span style={{width: '30px', textAlign: 'center', transform: 'translateX(-50%)'}}>24 May</span>
                <span style={{width: '30px', textAlign: 'center', transform: 'translateX(-50%)'}}>25 May</span>
                <span style={{width: '30px', textAlign: 'center', transform: 'translateX(-50%)'}}>26 May</span>
                <span style={{width: '30px', textAlign: 'center', transform: 'translateX(-50%)'}}>27 May</span>
                <span style={{width: '30px', textAlign: 'center', transform: 'translateX(-50%)'}}>28 May</span>
                <span style={{width: '30px', textAlign: 'center', transform: 'translateX(-50%)'}}>29 May</span>
                <span style={{width: '30px', textAlign: 'center', transform: 'translateX(-50%)'}}>30 May</span>
              </div>

              {/* Chart Overlay */}
              <div style={{position: 'absolute', top: '5px', bottom: '29px', left: '40px', right: 0}}>
                <svg width="100%" height="100%" style={{overflow: 'visible'}}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8A158F" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#8A158F" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* We use percentage for responsiveness without distortion */}
                  <path d="M 0 100 L 0 75 L 16.66 25 L 33.33 50 L 50 62.5 L 66.66 62.5 L 83.33 37.5 L 100 12.5 L 100 100 Z" fill="url(#lineGrad)" vectorEffect="non-scaling-stroke" />
                  
                  {/* The actual line */}
                  <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M 0 75 L 16.66 25 L 33.33 50 L 50 62.5 L 66.66 62.5 L 83.33 37.5 L 100 12.5" fill="none" stroke="#8A158F" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                  </svg>
                  
                  {/* The dots - rendered at exact % positions */}
                  <circle cx="0%" cy="75%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth="2" />
                  <circle cx="16.66%" cy="25%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth="2" />
                  <circle cx="33.33%" cy="50%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth="2" />
                  <circle cx="50%" cy="62.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth="2" />
                  <circle cx="66.66%" cy="62.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth="2" />
                  <circle cx="83.33%" cy="37.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth="2" />
                  <circle cx="100%" cy="12.5%" r="4.5" fill="#8A158F" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
            </div>
'''

if old_svg_start != -1:
    new_content = content[:old_svg_start] + new_chart.strip() + content[old_svg_end:]
    with open('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced chart successfully.")
else:
    print("Could not find SVG chart.")
