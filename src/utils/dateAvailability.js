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

  // Any cancelled, refunded, rejected, deleted, or failed status is NOT active
  if (
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
    paymentStatus.includes('fail')
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
 * Returns genuine bookings with cancelled status synchronized.
 * API response is the single source of truth.
 */
export function getAllMergedBookings(backendBookings = []) {
  const cancelledIds = getCancelledBookingIds();
  const list = (Array.isArray(backendBookings) ? backendBookings : [])
    .filter(b => b && !isRemovedOfflineGuest(b))
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
