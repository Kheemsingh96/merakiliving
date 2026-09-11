const fs = require('fs');
const css = `

.availability-tag {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
}
.availability-tag.booked {
  color: #dc2626;
  background-color: #fef2f2;
}
.availability-tag.available {
  color: #16a34a;
  background-color: #f0fdf4;
}
.availability-mobile {
  display: none;
}
@media (max-width: 1024px) {
  .availability-desktop {
    display: none;
  }
  .availability-mobile {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .availability-tag {
    font-size: 12px;
  }
}
`;
fs.appendFileSync('src/Pages/Booking/Booking.css', css);
console.log('Appended to Booking.css');
