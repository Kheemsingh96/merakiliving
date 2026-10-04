/**
 * API Base URL Configuration for Meraki Living Frontend
 *
 * Supports BOTH:
 * 1. Current local XAMPP development environment (https://merakiliving.inmerakiliving_backend)
 * 2. Future real hosting production deployment (simply set DEFAULT_PRODUCTION_API_URL or REACT_APP_API_URL)
 */

// SINGLE PLACE TO PASTE YOUR REAL PRODUCTION BACKEND HOSTING URL WHEN DEPLOYING:
// Example: const DEFAULT_PRODUCTION_API_URL = 'https://your-main-domain.com/merakiliving_backend';
const DEFAULT_PRODUCTION_API_URL = '';

export const getApiBaseUrl = () => {
  // 1. Check environment variable (e.g. set in Vercel, Netlify, cPanel, or .env)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/+$/, '');
  }

  // 2. Check if a custom production API base URL is specified in DEFAULT_PRODUCTION_API_URL
  if (DEFAULT_PRODUCTION_API_URL && DEFAULT_PRODUCTION_API_URL.trim() !== '') {
    return DEFAULT_PRODUCTION_API_URL.replace(/\/+$/, '');
  }

  // 3. Dynamic origin resolution when deployed on a live domain
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return `${origin}/merakiliving_backend`;
    }
  }

  // 4. Fallback for XAMPP local development environment
  return 'https://merakiliving.in/merakiliving_backend';
};

export const API_CONFIG_URL = getApiBaseUrl();
