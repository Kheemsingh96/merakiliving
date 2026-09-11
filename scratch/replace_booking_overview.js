const fs = require('fs');
let c = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', 'utf8');
let lines = c.split('\n');

const newBlock = \        <div className="admin-card" style={{flex: '2'}}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Booking Overview</h2>
            <div className="admin-filter-dropdown">
              <span>Last 7 Days</span>
              <span style={{fontSize:'10px'}}>?</span>
            </div>
          </div>
          <div style={{padding: '24px', height: '320px', position: 'relative'}}>
            {/* Y Axis Labels */}
            <div style={{position: 'absolute', top: '24px', bottom: '50px', left: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#817F7F', fontSize: '12px', fontWeight: '500'}}>
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>
            
            {/* Grid Lines */}
            <div style={{position: 'absolute', top: '30px', bottom: '56px', left: '50px', right: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
              <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
              <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
              <div style={{borderBottom: '1px dashed #e2e8f0', width: '100%'}}></div>
              <div style={{borderBottom: '1px solid #cbd5e1', width: '100%'}}></div>
            </div>

            {/* X Axis Labels */}
            <div style={{position: 'absolute', bottom: '20px', left: '50px', right: '24px', display: 'flex', justifyContent: 'space-between', color: '#817F7F', fontSize: '11px', fontWeight: '500'}}>
              <span style={{width: '30px', textAlign: 'center'}}>24 May</span>
              <span style={{width: '30px', textAlign: 'center'}}>25 May</span>
              <span style={{width: '30px', textAlign: 'center'}}>26 May</span>
              <span style={{width: '30px', textAlign: 'center'}}>27 May</span>
              <span style={{width: '30px', textAlign: 'center'}}>28 May</span>
              <span style={{width: '30px', textAlign: 'center'}}>29 May</span>
              <span style={{width: '30px', textAlign: 'center'}}>30 May</span>
            </div>

            {/* SVG Line & Area */}
            <div style={{position: 'absolute', top: '30px', bottom: '56px', left: '65px', right: '39px'}}>
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8A158F" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#8A158F" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M 0 75 L 16.6 25 L 33.3 50 L 50 62.5 L 66.6 62.5 L 83.3 37.5 L 100 12.5 L 100 100 L 0 100 Z" fill="url(#lineGrad)" />
                <path d="M 0 75 L 16.6 25 L 33.3 50 L 50 62.5 L 66.6 62.5 L 83.3 37.5 L 100 12.5" fill="none" stroke="#8A158F" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            {/* SVG Dots */}
            <div style={{position: 'absolute', top: '30px', bottom: '56px', left: '65px', right: '39px'}}>
              <svg width="100%" height="100%" style={{overflow: 'visible'}}>
                <circle cx="0%" cy="75%" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
                <circle cx="16.6%" cy="25%" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
                <circle cx="33.3%" cy="50%" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
                <circle cx="50%" cy="62.5%" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
                <circle cx="66.6%" cy="62.5%" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
                <circle cx="83.3%" cy="37.5%" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
                <circle cx="100%" cy="12.5%" r="5" fill="#8A158F" stroke="#fff" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>\;

lines.splice(316, 370 - 316 + 1, newBlock);
fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.js', lines.join('\n'));
console.log('Replaced Booking Overview');
