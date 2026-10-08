/**
 * Date Availability Utility for Meraki Living
 * Handles date normalization, booking overlap calculations, and room availability state.
 */

/**
 * Normalizes a date input to local midnight timestamp (00:00:00.000)
 * Safely parses YYYY-MM-DD strings without UTC timezone shifting.
 */
export function normalizeDateToMidnight(val) {
  if (!val) return null;
  if (typeof val === 'number') {
    const timestamp = val > 1e11 ? val : val * 1000;
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    return new Date(val.getFullYear(), val.getMonth(), val.getDate()).getTime();
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed || trimmed === 'N/A' || trimmed === '—' || trimmed === 'null' || trimmed === 'undefined') return null;

    // Numeric timestamp string
    if (/^\d{10,13}$/.test(trimmed)) {
      const num = Number(trimmed);
      const timestamp = num > 1e11 ? num : num * 1000;
      const d = new Date(timestamp);
      if (!isNaN(d.getTime())) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      }
    }

    // Match YYYY-MM-DD or YYYY/MM/DD pattern
    const matchYmd = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (matchYmd) {
      const year = parseInt(matchYmd[1], 10);
      const month = parseInt(matchYmd[2], 10) - 1;
      const day = parseInt(matchYmd[3], 10);
      return new Date(year, month, day).getTime();
    }
    // Match DD/MM/YYYY or DD-MM-YYYY pattern
    const matchDmy = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (matchDmy) {
      const day = parseInt(matchDmy[1], 10);
      const month = parseInt(matchDmy[2], 10) - 1;
      const year = parseInt(matchDmy[3], 10);
      return new Date(year, month, day).getTime();
    }
  }
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Checks if two date intervals [start1, end1) and [start2, end2) overlap.
 * Hotel stays are half-open intervals: check-in at afternoon, check-out in morning.
 * Therefore, a check-out on Day X does NOT conflict with a check-in on Day X.
 */
export function areDateRangesOverlapping(start1, end1, start2, end2) {
  const s1 = normalizeDateToMidnight(start1);
  const e1 = normalizeDateToMidnight(end1);
  const s2 = normalizeDateToMidnight(start2);
  const e2 = normalizeDateToMidnight(end2);

  if (s1 === null || e1 === null || s2 === null || e2 === null) return false;
  if (s1 >= e1 || s2 >= e2) return false;

  return s1 < e2 && e1 > s2;
}

/**
 * Helper to identify and filter out temporary or test offline bookings (such as Pankaj Gupta offline data).
 */
export function isRemovedOfflineGuest(item) {
  if (!item) return false;
  if (typeof item === 'string') {
    const s = item.toLowerCase();
    return (s.includes('pankaj') && s.includes('gupta')) || s.includes('offline');
  }
  const name = String(item.guest_name || item.name || item.guestName || '').toLowerCase();
  if (name.includes('pankaj') && name.includes('gupta')) return true;
  if (item.source === 'offline' || item.is_offline === true || item.booking_type === 'offline') return true;
  return false;
}

/**
 * Distinguishes Admin block bookings (created through Room Status Overview / Admin block booking)
 * from genuine guest bookings using existing booking data, source, and type fields.
 */
export function isAdminBlockBooking(item) {
  if (!item) return false;
  if (typeof item === 'string') {
    const s = item.toLowerCase().trim();
    return s === 'admin block' || s.includes('admin block') || s === 'direct / admin';
  }

  // 1. Check booking source
  const source = String(item.source || item.booking_source || item.bookingSource || '').toLowerCase().trim();
  if (
    source === 'direct / admin' ||
    source.includes('direct / admin') ||
    source === 'admin block' ||
    source === 'admin_block' ||
    source === 'admin-block'
  ) {
    return true;
  }

  // 2. Check booking type or category
  const type = String(item.booking_type || item.type || item.category || '').toLowerCase().trim();
  if (
    type === 'block' ||
    type === 'admin_block' ||
    type === 'admin block' ||
    type === 'admin-block' ||
    type === 'blocked'
  ) {
    return true;
  }

  // 3. Check guest name
  const name = String(item.guest_name || item.name || item.guestName || '').toLowerCase().trim();
  if (
    name === 'admin block' ||
    name.includes('admin block') ||
    name === 'admin blocked' ||
    name === 'room block' ||
    name === 'blocked by admin'
  ) {
    return true;
  }

  // 4. Check guest email
  const email = String(item.guest_email || item.email || item.guestEmail || '').toLowerCase().trim();
  if (email === 'admin@merakiliving.com') {
    return true;
  }

  // 5. Check boolean flags
  if (item.is_admin_block === true || item.is_block === true || item.is_blocked === true) {
    return true;
  }

  return false;
}

/**
 * Retrieves set of cancelled booking IDs tracked in session/local storage.
 */
export function getCancelledBookingIds() {
  const ids = new Set();
  if (typeof window === 'undefined') return ids;
  
  [window.sessionStorage, window.localStorage].forEach(store => {
    try {
      if (!store) return;
      const raw = store.getItem('meraki_cancelled_booking_ids');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(id => {
            if (id !== undefined && id !== null && String(id).trim()) {
              ids.add(String(id).trim().toUpperCase());
              ids.add(String(id).trim());
            }
          });
        }
      }
    } catch (e) {}
  });
  return ids;
}

/**
 * Retrieves set of deleted booking IDs tracked in session/local storage.
 */
export function getDeletedBookingIds() {
  const ids = new Set();
  if (typeof window === 'undefined') return ids;
  
  [window.sessionStorage, window.localStorage].forEach(store => {
    try {
      if (!store) return;
      const raw = store.getItem('meraki_deleted_booking_ids');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(id => {
            if (id !== undefined && id !== null && String(id).trim()) {
              ids.add(String(id).trim().toUpperCase());
              ids.add(String(id).trim());
            }
          });
        }
      }
    } catch (e) {}
  });
  return ids;
}

/**
 * Permanently tracks a booking as deleted locally so it is removed from UI and storage.
 */
export function markBookingAsDeleted(bookingOrId) {
  if (!bookingOrId || typeof window === 'undefined') return;
  
  const toAdd = new Set();
  if (typeof bookingOrId === 'object') {
    if (bookingOrId.id) toAdd.add(String(bookingOrId.id));
    if (bookingOrId.db_id) toAdd.add(String(bookingOrId.db_id));
    if (bookingOrId.booking_reference) toAdd.add(String(bookingOrId.booking_reference));
    if (bookingOrId.formattedId) toAdd.add(String(bookingOrId.formattedId));
  } else {
    toAdd.add(String(bookingOrId));
  }

  const currentSet = getDeletedBookingIds();
  toAdd.forEach(id => {
    currentSet.add(String(id).trim().toUpperCase());
    currentSet.add(String(id).trim());
  });

  const arrayToStore = Array.from(currentSet);
  [window.sessionStorage, window.localStorage].forEach(store => {
    try {
      if (!store) return;
      store.setItem('meraki_deleted_booking_ids', JSON.stringify(arrayToStore));
    } catch (e) {}
  });

  // Remove matching booking objects from local/session storage arrays
  ['meraki_admin_created_bookings', 'meraki_pending_bookings'].forEach(key => {
    [window.sessionStorage, window.localStorage].forEach(store => {
      try {
        if (!store) return;
        const raw = store.getItem(key);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const filtered = list.filter(item => {
              const matches = Array.from(toAdd).some(id => 
                String(item.id || '').toUpperCase() === String(id).toUpperCase() ||
                String(item.booking_reference || '').toUpperCase() === String(id).toUpperCase() ||
                String(item.db_id || '').toUpperCase() === String(id).toUpperCase() ||
                String(item.formattedId || '').toUpperCase() === String(id).toUpperCase()
              );
              return !matches;
            });
            store.setItem(key, JSON.stringify(filtered));
          }
        }
      } catch (e) {}
    });
  });

  try {
    const pRef = window.sessionStorage.getItem('meraki_pending_booking_ref');
    if (pRef && Array.from(toAdd).map(x => x.toUpperCase()).includes(String(pRef).toUpperCase())) {
      window.sessionStorage.removeItem('meraki_pending_booking_ref');
    }
  } catch (e) {}

  window.dispatchEvent(new Event('meraki_booking_updated'));
  window.dispatchEvent(new Event('meraki_rooms_updated'));
}

/**
 * Tracks a booking as cancelled locally so room availability and UI update instantly.
 */
export function markBookingAsCancelled(bookingOrId) {
  if (!bookingOrId || typeof window === 'undefined') return;
  
  const toAdd = new Set();
  if (typeof bookingOrId === 'object') {
    if (bookingOrId.id) toAdd.add(String(bookingOrId.id));
    if (bookingOrId.db_id) toAdd.add(String(bookingOrId.db_id));
    if (bookingOrId.booking_reference) toAdd.add(String(bookingOrId.booking_reference));
    if (bookingOrId.formattedId) toAdd.add(String(bookingOrId.formattedId));
  } else {
    toAdd.add(String(bookingOrId));
  }

  const currentSet = getCancelledBookingIds();
  toAdd.forEach(id => {
    currentSet.add(String(id).trim().toUpperCase());
    currentSet.add(String(id).trim());
  });

  const arrayToStore = Array.from(currentSet);
  [window.sessionStorage, window.localStorage].forEach(store => {
    try {
      if (!store) return;
      store.setItem('meraki_cancelled_booking_ids', JSON.stringify(arrayToStore));
    } catch (e) {}
  });

  // Update or clean any stored booking object
  try {
    const rawLatest = window.sessionStorage.getItem('meraki_latest_booking');
    if (rawLatest) {
      const parsed = JSON.parse(rawLatest);
      const isMatch = Array.from(toAdd).some(id => 
        String(parsed.id) === String(id) ||
        String(parsed.formattedId) === String(id) ||
        String(parsed.db_id) === String(id) ||
        String(parsed.booking_reference) === String(id)
      );
      if (isMatch) {
        window.sessionStorage.setItem('meraki_latest_booking', JSON.stringify({ ...parsed, status: 'Cancelled' }));
      }
    }
  } catch (e) {}

  // Clean out temporary booking cart draft so old search dates don't linger
  try {
    window.sessionStorage.removeItem('meraki_booking');
  } catch (e) {}

  window.dispatchEvent(new Event('meraki_booking_updated'));
  window.dispatchEvent(new Event('meraki_rooms_updated'));
}

/**
 * Checks whether a booking record is considered active (occupying the room).
 * Excludes cancelled, refunded, rejected, failed, or trashed bookings.
 */
export function isBookingActive(booking) {
  if (!booking) return false;
  if (isRemovedOfflineGuest(booking)) return false;

  // Check locally tracked deleted IDs
  const deletedIds = getDeletedBookingIds();
  if (deletedIds.size > 0) {
    const idList = [
      booking.id,
      booking.db_id,
      booking.booking_reference,
      booking.formattedId
    ].filter(Boolean).map(x => String(x).trim());

    for (const id of idList) {
      if (deletedIds.has(id) || deletedIds.has(id.toUpperCase())) {
        return false;
      }
    }
  }

  // Check locally tracked cancelled IDs
  const cancelledIds = getCancelledBookingIds();
  if (cancelledIds.size > 0) {
    const idList = [
      booking.id,
      booking.db_id,
      booking.booking_reference,
      booking.formattedId
    ].filter(Boolean).map(x => String(x).trim());

    for (const id of idList) {
      if (cancelledIds.has(id) || cancelledIds.has(id.toUpperCase())) {
        return false;
      }
    }
  }

  const status = String(booking.status || booking.booking_status || '').toLowerCase().trim();
  const paymentStatus = String(booking.payment_status || '').toLowerCase().trim();

  // Any pending, cancelled, refunded, rejected, deleted, or failed status is NOT active
  if (
    status === 'pending' ||
    status.includes('pending') ||
    status.includes('cancel') ||
    status.includes('refund') ||
    status.includes('reject') ||
    status.includes('decline') ||
    status.includes('fail') ||
    status.includes('trash') ||
    status.includes('delet') ||
    status.includes('remove') ||
    status === 'inactive' ||
    paymentStatus.includes('refund') ||
    paymentStatus.includes('cancel') ||
    paymentStatus.includes('fail') ||
    paymentStatus === 'pending' ||
    paymentStatus.includes('pending')
  ) {
    return false;
  }

  return true;
}

/**
 * Resolves normalized numeric roomId (1, 2, 3, 4) from a booking record or room descriptor.
 */
export function extractBookingRoomId(booking) {
  if (!booking) return null;
  if (booking.room_id !== undefined && booking.room_id !== null && booking.room_id !== '') {
    const num = Number(booking.room_id);
    if (!isNaN(num) && num > 0) return num;
  }
  if (booking.roomId !== undefined && booking.roomId !== null && booking.roomId !== '') {
    const parsed = Number(String(booking.roomId).replace(/\D/g, ''));
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  const name = String(booking.room_name || booking.room || booking.title || booking.name || '').toLowerCase();
  if (name.includes('entire')) return 4;
  if (name.includes('luxury') || name.includes('suite')) return 3;
  if (name.includes('valley')) return 2;
  if (name.includes('himalayan')) return 1;
  return null;
}

/**
 * Resolves normalized numeric roomId (1, 2, 3, 4) from any room or id input.
 */
export function normalizeRoomId(roomOrId) {
  if (roomOrId === undefined || roomOrId === null || roomOrId === '') return null;
  if (typeof roomOrId === 'object') {
    return extractBookingRoomId(roomOrId);
  }
  const num = Number(roomOrId);
  if (!isNaN(num) && num > 0) return num;
  const str = String(roomOrId).toLowerCase();
  if (str.includes('entire')) return 4;
  if (str.includes('luxury') || str.includes('suite')) return 3;
  if (str.includes('valley')) return 2;
  if (str.includes('himalayan')) return 1;
  const digits = str.replace(/\D/g, '');
  if (digits) {
    const parsed = Number(digits);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return null;
}

/**
 * Retrieves Admin-created bookings tracked across session/local storage.
 */
export function getAdminCreatedBookings() {
  const adminBookings = [];
  if (typeof window === 'undefined') return adminBookings;
  
  [window.sessionStorage, window.localStorage].forEach(store => {
    try {
      if (!store) return;
      const raw = store.getItem('meraki_admin_created_bookings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(b => {
            if (b && !adminBookings.some(existing => (existing.id && existing.id === b.id) || (existing.booking_reference && existing.booking_reference === b.booking_reference))) {
              adminBookings.push(b);
            }
          });
        }
      }
    } catch (e) {}
  });
  return adminBookings;
}

/**
 * Retrieves incomplete / Pending bookings tracked across session/local storage.
 */
export function getPendingBookings() {
  const pendingBookings = [];
  if (typeof window === 'undefined') return pendingBookings;
  
  [window.sessionStorage, window.localStorage].forEach(store => {
    try {
      if (!store) return;
      const raw = store.getItem('meraki_pending_bookings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(b => {
            if (b && !pendingBookings.some(existing => 
              (existing.id && String(existing.id) === String(b.id)) || 
              (existing.booking_reference && String(existing.booking_reference).toUpperCase() === String(b.booking_reference).toUpperCase())
            )) {
              pendingBookings.push(b);
            }
          });
        }
      }
    } catch (e) {}
  });
  return pendingBookings;
}

/**
 * Returns genuine bookings with cancelled status synchronized.
 * Merges backend bookings with locally synchronized admin-created and pending bookings.
 */
export function getAllMergedBookings(backendBookings = []) {
  const cancelledIds = getCancelledBookingIds();
  const deletedIds = getDeletedBookingIds();
  const rawList = Array.isArray(backendBookings) ? [...backendBookings] : [];

  const localAdminBookings = getAdminCreatedBookings();
  localAdminBookings.forEach(ab => {
    const exists = rawList.some(b => 
      (b.id && String(b.id) === String(ab.id)) ||
      (b.booking_reference && String(b.booking_reference).trim().toUpperCase() === String(ab.booking_reference).trim().toUpperCase())
    );
    if (!exists) {
      rawList.push(ab);
    }
  });

  const localPendingBookings = getPendingBookings();
  localPendingBookings.forEach(pb => {
    const exists = rawList.some(b => 
      (b.id && String(b.id) === String(pb.id)) ||
      (b.booking_reference && String(b.booking_reference).trim().toUpperCase() === String(pb.booking_reference).trim().toUpperCase())
    );
    if (!exists) {
      rawList.push(pb);
    }
  });

  if (typeof window !== 'undefined') {
    [window.sessionStorage, window.localStorage].forEach(store => {
      try {
        if (!store) return;
        ['meraki_latest_booking', 'meraki_confirmed_booking'].forEach(key => {
          const raw = store.getItem(key);
          if (raw) {
            const cb = JSON.parse(raw);
            if (cb && !isRemovedOfflineGuest(cb)) {
              const exists = rawList.some(b => 
                (b.id && String(b.id).trim().toUpperCase() === String(cb.id || '').trim().toUpperCase()) ||
                (b.booking_reference && cb.booking_reference && String(b.booking_reference).trim().toUpperCase() === String(cb.booking_reference).trim().toUpperCase()) ||
                (b.db_id && cb.db_id && String(b.db_id) === String(cb.db_id))
              );
              if (!exists) {
                rawList.push(cb);
              }
            }
          }
        });
      } catch (e) {}
    });
  }

  const list = rawList
    .filter(b => {
      if (!b || isRemovedOfflineGuest(b)) return false;
      const isDeletedLocally = [
        b.id,
        b.db_id,
        b.booking_reference,
        b.formattedId
      ].filter(Boolean).some(id => deletedIds.has(String(id).trim()) || deletedIds.has(String(id).trim().toUpperCase()));
      return !isDeletedLocally;
    })
    .map(b => {
      const isCancelledLocally = [
        b.id,
        b.db_id,
        b.booking_reference,
        b.formattedId
      ].filter(Boolean).some(id => cancelledIds.has(String(id).trim()) || cancelledIds.has(String(id).trim().toUpperCase()));

      if (isCancelledLocally && isBookingActive(b)) {
        return { ...b, status: 'Cancelled' };
      }
      return b;
    });

  return list;
}

/**
 * Checks for booking conflicts on a specific room across requested dates.
 */
export function checkRoomConflict(roomId, checkIn, checkOut, allBookings) {
  const rId = normalizeRoomId(roomId);
  const activeBookings = (Array.isArray(allBookings) ? allBookings : []).filter(b => isBookingActive(b));
  
  const conflicting = activeBookings.filter(b => {
    const bIn = b.check_in || b.checkIn || b.start_date || b.check_in_date;
    const bOut = b.check_out || b.checkOut || b.end_date || b.check_out_date;
    if (!bIn || !bOut) return false;
    return areDateRangesOverlapping(checkIn, checkOut, bIn, bOut);
  });

  let matchedBookings = [];
  if (rId === 4) {
    // Entire homestay conflicts if Room 1, 2, 3, or 4 is booked
    matchedBookings = conflicting.filter(b => [1, 2, 3, 4].includes(extractBookingRoomId(b)));
  } else if (rId === 1) {
    matchedBookings = conflicting.filter(b => [1, 4].includes(extractBookingRoomId(b)));
  } else if (rId === 2) {
    matchedBookings = conflicting.filter(b => [2, 4].includes(extractBookingRoomId(b)));
  } else if (rId === 3) {
    matchedBookings = conflicting.filter(b => [3, 4].includes(extractBookingRoomId(b)));
  } else if (rId) {
    matchedBookings = conflicting.filter(b => extractBookingRoomId(b) === rId);
  } else {
    matchedBookings = conflicting;
  }

  return {
    hasConflict: matchedBookings.length > 0,
    conflictingBookings: matchedBookings
  };
}

/**
 * Calculates date-based availability for each room given selected dates and all active bookings.
 * 
 * @param {Array} rooms - Array of room objects
 * @param {Array} bookings - Array of booking objects from backend / session / local storage
 * @param {Date|string} checkIn - Selected check-in date
 * @param {Date|string} checkOut - Selected check-out date
 * @returns {Array} Updated rooms array with date-specific status ('Available', 'Booked', 'Not Available')
 */
export function computeRoomAvailability(rooms, bookings, checkIn, checkOut) {
  if (!Array.isArray(rooms) || rooms.length === 0) return [];

  // Filter active bookings with valid date ranges
  const activeBookings = (Array.isArray(bookings) ? bookings : []).filter(b => {
    if (!isBookingActive(b)) return false;
    const bCheckIn = b.check_in || b.checkIn || b.start_date || b.check_in_date;
    const bCheckOut = b.check_out || b.checkOut || b.end_date || b.check_out_date;
    return bCheckIn && bCheckOut;
  });

  // Find bookings that genuinely overlap the requested stay
  const conflictingBookings = activeBookings.filter(b => {
    const bCheckIn = b.check_in || b.checkIn || b.start_date || b.check_in_date;
    const bCheckOut = b.check_out || b.checkOut || b.end_date || b.check_out_date;
    return areDateRangesOverlapping(checkIn, checkOut, bCheckIn, bCheckOut);
  });

  const isRoom1Booked = conflictingBookings.some(b => extractBookingRoomId(b) === 1);
  const isRoom2Booked = conflictingBookings.some(b => extractBookingRoomId(b) === 2);
  const isRoom3Booked = conflictingBookings.some(b => extractBookingRoomId(b) === 3);
  const isRoom4Booked = conflictingBookings.some(b => extractBookingRoomId(b) === 4);

  return rooms.map(room => {
    const rId = Number(room.id);
    let computedStatus = 'Available';

    // Admin maintenance/disabled status override (if explicitly set)
    const rawStatus = (room.status || '').toLowerCase().trim();
    if (['maintenance', 'disabled', 'inactive', 'closed'].includes(rawStatus)) {
      return { ...room, status: 'Not Available' };
    }

    if (rId === 4) {
      if (isRoom4Booked) {
        computedStatus = 'Booked';
      } else if (isRoom1Booked || isRoom2Booked || isRoom3Booked) {
        computedStatus = 'Not Available';
      } else {
        computedStatus = 'Available';
      }
    } else if (rId === 1) {
      if (isRoom1Booked) {
        computedStatus = 'Booked';
      } else if (isRoom4Booked) {
        computedStatus = 'Not Available';
      } else {
        computedStatus = 'Available';
      }
    } else if (rId === 2) {
      if (isRoom2Booked) {
        computedStatus = 'Booked';
      } else if (isRoom4Booked) {
        computedStatus = 'Not Available';
      } else {
        computedStatus = 'Available';
      }
    } else if (rId === 3) {
      if (isRoom3Booked) {
        computedStatus = 'Booked';
      } else if (isRoom4Booked) {
        computedStatus = 'Not Available';
      } else {
        computedStatus = 'Available';
      }
    } else {
      const isThisBooked = conflictingBookings.some(b => extractBookingRoomId(b) === rId);
      computedStatus = isThisBooked ? 'Booked' : 'Available';
    }

    return {
      ...room,
      status: computedStatus
    };
  });
}
