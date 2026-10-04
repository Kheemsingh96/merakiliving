import { useEffect, useMemo } from 'react';

const DEFAULT_MERAKI_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BedAndBreakfast',
  'name': 'Meraki Living',
  'description': 'Experience a serene luxury homestay in Peora, Mukteshwar, Uttarakhand. Meraki Living offers boutique mountain cottages, farm-fresh cuisine, and panoramic Himalayan views.',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Village Peora, Near Mukteshwar',
    'addressLocality': 'Peora, Mukteshwar',
    'addressRegion': 'Uttarakhand',
    'postalCode': '263138',
    'addressCountry': 'IN'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 29.4750,
    'longitude': 79.6250
  },
  'telephone': '+91-94561-03445',
  'priceRange': '₹₹₹'
};

function useSEO({ title, description, url, ogImage, schema }) {
  const activeSchema = schema || DEFAULT_MERAKI_SCHEMA;
  const schemaString = useMemo(() => activeSchema ? JSON.stringify(activeSchema) : null, [activeSchema]);

  useEffect(() => {
    // 1. Update Document Title
    let finalTitle = 'Meraki Living | Luxury Homestay in Peora Mukteshwar';
    if (title) {
      if (title.includes('Meraki Living')) {
        finalTitle = title;
      } else {
        finalTitle = `${title} | Meraki Living`;
      }
    }
    document.title = finalTitle;

    // Helper to set meta tags
    const setMetaTag = (selector, attribute, value) => {
      let tag = document.querySelector(selector);
      if (value) {
        if (!tag) {
          tag = document.createElement('meta');
          if (selector.startsWith('meta[name=')) {
            const match = selector.match(/name="([^"]+)"/);
            if (match) tag.setAttribute('name', match[1]);
          } else if (selector.startsWith('meta[property=')) {
            const match = selector.match(/property="([^"]+)"/);
            if (match) tag.setAttribute('property', match[1]);
          }
          document.head.appendChild(tag);
        }
        tag.setAttribute(attribute, value);
      } else if (tag) {
        tag.remove();
      }
    };

    const defaultDesc = "Experience a serene luxury homestay in Peora, Mukteshwar, Uttarakhand. Meraki Living offers boutique mountain cottages, farm-fresh cuisine, and panoramic Himalayan views.";
    const activeDesc = description || defaultDesc;

    // 2. Meta Description
    setMetaTag('meta[name="description"]', 'content', activeDesc);

    // 3. Open Graph (OG) Tags
    setMetaTag('meta[property="og:site_name"]', 'content', 'Meraki Living');
    setMetaTag('meta[property="og:title"]', 'content', finalTitle);
    setMetaTag('meta[property="og:description"]', 'content', activeDesc);
    setMetaTag('meta[property="og:type"]', 'content', 'website');
    const activeUrl = url || window.location.href;
    setMetaTag('meta[property="og:url"]', 'content', activeUrl);
    if (ogImage) setMetaTag('meta[property="og:image"]', 'content', ogImage);

    // 4. Twitter Cards
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', activeDesc);
    if (ogImage) setMetaTag('meta[name="twitter:image"]', 'content', ogImage);

    // 5. Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', activeUrl);

    // 6. JSON-LD Schema
    let schemaScript = document.getElementById('seo-schema');
    if (schemaString) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'seo-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = schemaString;
    } else if (schemaScript) {
      schemaScript.remove();
    }

  }, [title, description, url, ogImage, schemaString]);
}

export default useSEO;
