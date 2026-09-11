const fs = require('fs');

let css = fs.readFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.css', 'utf8');

// Replace everything from @media (max-width: 1024px) to the end of the file except the utility classes at the bottom.
const mediaQueriesEnd = css.indexOf('/* Utility Classes for Tags and Truncation */');
const responsiveStart = css.indexOf('/* Responsive */');

if (responsiveStart !== -1 && mediaQueriesEnd !== -1) {
  const newResponsive = `/* Responsive */
@media (max-width: 1100px) {
  .admin-header {
    padding: 32px;
  }
  .admin-content {
    padding: 0 32px 32px;
  }
}
@media (max-width: 950px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }
  .admin-main {
    margin-left: 0;
    width: 100%;
  }
  .admin-header {
    padding: 24px;
  }
  .admin-content {
    padding: 0 24px 24px;
  }
  .admin-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .admin-middle-grid, .admin-bottom-grid {
    grid-template-columns: 1fr;
  }
  .management-item {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  .management-item-actions {
    flex-direction: column;
  }
  .management-item-actions .admin-input, .management-item-actions .admin-btn {
    width: 100%;
  }
  .report-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .admin-header {
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .admin-content {
    padding: 0 20px 20px;
  }
  .admin-stats-grid {
    grid-template-columns: 1fr;
  }
  .admin-date-picker-group {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
  .admin-header-right {
    width: 100%;
    justify-content: space-between;
  }
}
@media (max-width: 380px) {
  .admin-header {
    padding: 16px;
  }
  .admin-content {
    padding: 0 16px 16px;
  }
}

`;

  css = css.slice(0, responsiveStart) + newResponsive + css.slice(mediaQueriesEnd);
  fs.writeFileSync('src/Pages/Admin/AdminDashboard/AdminDashboard.css', css);
  console.log('Media queries updated');
} else {
  console.log('Could not find markers');
}
