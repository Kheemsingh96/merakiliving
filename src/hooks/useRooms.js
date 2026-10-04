import { useState, useEffect } from 'react';
import { API_CONFIG_URL } from '../config/api';
import { safeParseResponse, formatImageUrl } from '../utils/apiHelper';
import room1 from '../assets/images/room-1.avif';

let cachedBackendRooms = null;
let cachedBackendGallery = null;
let activeFetchPromise = null;

export function useRooms(localRoomsData) {
  const [rooms, setRooms] = useState(() => {
    return mergeRooms(localRoomsData, cachedBackendRooms, cachedBackendGallery);
  });
  const [loading, setLoading] = useState(!cachedBackendRooms);

  useEffect(() => {
    let isMounted = true;

    const fetchLatestData = (force = false) => {
      if (!activeFetchPromise || force) {
        activeFetchPromise = Promise.all([
          fetch(`${API_CONFIG_URL}/api_rooms.php`).then(res => safeParseResponse(res)).catch(() => null),
          fetch(`${API_CONFIG_URL}/api_gallery.php?t=${Date.now()}`).then(res => safeParseResponse(res)).catch(() => null)
        ])
          .then(([roomsRes, galleryRes]) => {
            const roomsData = roomsRes && roomsRes.ok ? roomsRes.data : null;
            const galleryData = galleryRes && galleryRes.ok ? galleryRes.data : null;
            return { roomsData, galleryData };
          })
          .finally(() => {
            activeFetchPromise = null;
          });
      }

      activeFetchPromise.then(({ roomsData, galleryData }) => {
        if (!isMounted) return;
        const bRooms = roomsData && roomsData.status === 'success' && Array.isArray(roomsData.data) ? roomsData.data : cachedBackendRooms;
        const bGallery = galleryData && galleryData.status === 'success' && Array.isArray(galleryData.data) ? galleryData.data : cachedBackendGallery;
        
        cachedBackendRooms = bRooms;
        cachedBackendGallery = bGallery;

        setRooms(mergeRooms(localRoomsData, bRooms, bGallery));
        setLoading(false);
      });
    };

    fetchLatestData(true);

    // Listen for room & gallery updates triggered by Admin Panel and storage changes
    const handleUpdates = () => {
      fetchLatestData(true);
    };

    const handleStorageChange = (e) => {
      if (!e || e.key === 'meraki_rooms_updated_ts' || e.key === 'meraki_gallery_updated_ts' || !e.key) {
        fetchLatestData(true);
      }
    };

    window.addEventListener('meraki_rooms_updated', handleUpdates);
    window.addEventListener('galleryUpdated', handleUpdates);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('meraki_rooms_updated', handleUpdates);
      window.removeEventListener('galleryUpdated', handleUpdates);
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localRoomsData]);

  return { rooms, loading, setRooms };
}

function mergeRooms(localData, backendData, galleryData) {
  const roomsSource = (backendData && Array.isArray(backendData) && backendData.length > 0)
    ? backendData.filter(r => {
        const s = (r.status || '').toLowerCase().trim();
        return s !== 'deleted' && s !== 'trash' && s !== 'removed';
      })
    : (localData || []);

  const merged = roomsSource.map(roomItem => {
    const isBackend = Boolean(roomItem.image_url !== undefined || roomItem.original_price !== undefined);
    const localMatch = (localData || []).find(l => Number(l.id) === Number(roomItem.id)) || {};
    
    let baseRoom;
    if (isBackend) {
      const originalPrice = parseFloat(String(roomItem.original_price || localMatch.originalPrice || '0').replace(/,/g, ''));
      const currentPrice = parseFloat(String(roomItem.price || localMatch.price || '0').replace(/,/g, ''));
      let calculatedDiscount = localMatch.discount || '0';
      
      if (originalPrice > 0 && originalPrice > currentPrice) {
        calculatedDiscount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100).toString();
      }
      
      const formattedImage = roomItem.image_url ? formatImageUrl(roomItem.image_url) : (localMatch.image || room1);

      baseRoom = {
        ...localMatch,
        id: Number(roomItem.id),
        title: roomItem.name || localMatch.title || `Room ${roomItem.id}`,
        desc: roomItem.description !== undefined && roomItem.description !== null && roomItem.description !== '' ? roomItem.description : (localMatch.desc || ''),
        price: roomItem.price !== undefined && roomItem.price !== null ? Number(roomItem.price).toLocaleString('en-IN') : (localMatch.price || '0'),
        originalPrice: roomItem.original_price !== undefined && roomItem.original_price !== null ? Number(roomItem.original_price).toLocaleString('en-IN') : (localMatch.originalPrice || '0'),
        discount: calculatedDiscount,
        image: formattedImage,
        gallery: formattedImage && localMatch.gallery ? [formattedImage, ...localMatch.gallery.slice(1)] : (localMatch.gallery || [formattedImage]),
        status: (roomItem.status && !['booked', 'active'].includes(roomItem.status.toLowerCase().trim())) ? roomItem.status : (localMatch.status || 'Available'),
        buttonText: localMatch.buttonText || 'View'
      };
    } else {
      baseRoom = { ...roomItem };
    }

    // First main room image remains unchanged at position 0
    const mainFirstImage = baseRoom.image || (localMatch.gallery && localMatch.gallery[0]) || localMatch.image;

    // Additional gallery images from Admin Panel for this room (in serial order)
    let uploadedRoomImages = [];
    if (galleryData && Array.isArray(galleryData)) {
      const roomIdStr = String(baseRoom.id);
      const roomTitleLower = (baseRoom.title || localMatch.title || '').toLowerCase().trim();
      
      const extraItems = galleryData.filter(g => {
        const cat = (g.category || '').toLowerCase().trim();
        return (
          cat === `room gallery - ${roomIdStr}` ||
          cat === `rooms gallery - ${roomIdStr}` ||
          cat === `room - ${roomIdStr}` ||
          cat === `room ${roomIdStr}` ||
          cat === roomTitleLower ||
          (cat.includes('room gallery') && cat.includes(roomIdStr)) ||
          (cat.includes('room') && cat.includes(roomIdStr)) ||
          (roomTitleLower && cat.includes(roomTitleLower))
        );
      }).sort((a, b) => Number(a.image_id || a.id || 0) - Number(b.image_id || b.id || 0));
      
      uploadedRoomImages = extraItems.map(g => formatImageUrl(g.image_url)).filter(Boolean);
    }

    // If newly added images exist from Admin Panel for this room,
    // they replace the existing additional gallery images in exact serial order:
    let finalGallery;
    if (uploadedRoomImages.length > 0) {
      finalGallery = [mainFirstImage, ...uploadedRoomImages];
    } else {
      finalGallery = baseRoom.gallery || [mainFirstImage];
    }

    return {
      ...baseRoom,
      image: mainFirstImage,
      gallery: finalGallery
    };
  });

  return merged;
}
