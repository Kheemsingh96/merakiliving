import { API_CONFIG_URL } from '../config/api';

/**
 * API Helper Utility for Meraki Living
 * Provides robust and safe response parsing to prevent runtime crashes
 * from empty responses, invalid JSON, HTML error pages, PHP warnings, or network errors.
 */

/**
 * Safely parses a Fetch Response object into JSON.
 * Validates status code, checks for empty bodies, and catches syntax errors gracefully.
 *
 * @param {Response} response - The fetch Response object
 * @returns {Promise<{ ok: boolean, status: number, data: any, error: string|null }>}
 */
export async function safeParseResponse(response) {
  if (!response) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: 'No response received from the server. Please check your internet connection.'
    };
  }

  const status = response.status || 0;
  let text = '';

  try {
    text = await response.text();
  } catch (readErr) {
    return {
      ok: false,
      status,
      data: null,
      error: 'Failed to read response from server.'
    };
  }

  const trimmedText = typeof text === 'string' ? text.trim() : '';

  if (!trimmedText) {
    return {
      ok: false,
      status,
      data: null,
      error: response.ok
        ? 'Server returned an empty response. Please try again.'
        : `Server returned error (${status}). Please try again later.`
    };
  }

  let parsedData = null;
  try {
    parsedData = JSON.parse(trimmedText);
  } catch (parseErr) {
    return {
      ok: false,
      status,
      data: null,
      rawText: trimmedText,
      error: response.ok
        ? 'Invalid response format received from the server. Please try again later.'
        : `Server returned error (${status}). Please try again later.`
    };
  }

  if (!response.ok) {
    const serverMessage =
      (parsedData && typeof parsedData === 'object' && (parsedData.message || parsedData.error || parsedData.detail)) ||
      `Server returned error (${status}). Please try again later.`;

    return {
      ok: false,
      status,
      data: parsedData,
      error: serverMessage
    };
  }

  return {
    ok: true,
    status,
    data: parsedData,
    error: null
  };
}

/**
 * Performs a fetch request and safely parses the JSON response.
 *
 * @param {string} url - Request URL
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<{ ok: boolean, status: number, data: any, error: string|null }>}
 */
export async function safeFetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    return await safeParseResponse(response);
  } catch (netErr) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: netErr.message && !netErr.message.includes('Unexpected')
        ? netErr.message
        : 'Network error. Please check your internet connection and try again.'
    };
  }
}

/**
 * Formats an image URL to ensure relative backend upload paths or localhost paths
 * resolve correctly using the central API_CONFIG_URL across all devices.
 *
 * @param {string} url - Image path or URL
 * @returns {string} Fully resolved image URL or string as provided
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim().replace(/\\/g, '/');
  if (!trimmed) return '';

  // Data URIs, blob URIs, or static build asset paths
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/static/') ||
    trimmed.startsWith('static/')
  ) {
    return trimmed;
  }

  // Handle paths containing localhost or 127.0.0.1 from local dev DB entries
  if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
    const match = trimmed.match(/(?:merakiliving_backend|backend)\/(.*)$/i);
    if (match && match[1]) {
      return `${API_CONFIG_URL}/${match[1].replace(/^\/+/, '')}`;
    }
  }

  // Fully-qualified external HTTP/HTTPS URLs (e.g. unsplash, razorpay, etc.)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Relative backend upload paths (e.g. "uploads/rooms/room_1.jpg" or "/uploads/rooms/room_1.jpg")
  if (trimmed.includes('uploads/')) {
    const cleanPath = trimmed.replace(/^.*(?=uploads\/)/i, '').replace(/^\/+/, '');
    return `${API_CONFIG_URL}/${cleanPath}`;
  }

  return trimmed;
}
