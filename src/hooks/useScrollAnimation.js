import { useEffect } from 'react';

const SELECTOR = [
  '.reveal-on-scroll',
  '.reveal-fade-up',
  '.reveal-fade-in',
  '.reveal-fade-left',
  '.reveal-fade-right',
  '.reveal-stagger',
  '.mcf-animate',
  '.mcf-stagger-children',
  '.srot-animate',
  '.srot-stagger-children',
  '.oav-animate',
  '.oav-stagger'
].join(', ');

export function initScrollObserver() {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null;
  }

  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('is-revealed', 'mcf-visible', 'srot-visible', 'oav-visible');
          observer.unobserve(target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    }
  );

  const observeElements = () => {
    const elements = document.querySelectorAll(SELECTOR);
    elements.forEach((el) => {
      // If prefers reduced motion or already revealed, mark revealed immediately
      if (
        prefersReducedMotion ||
        (typeof navigator !== 'undefined' && /ReactSnap/i.test(navigator.userAgent)) ||
        el.classList.contains('is-revealed') ||
        el.classList.contains('mcf-visible') ||
        el.classList.contains('srot-visible') ||
        el.classList.contains('oav-visible')
      ) {
        el.classList.add('is-revealed', 'mcf-visible', 'srot-visible', 'oav-visible');
      } else {
        observer.observe(el);
      }
    });
  };

  observeElements();

  return {
    observer,
    refresh: observeElements,
    disconnect: () => observer.disconnect()
  };
}

export function useScrollAnimation(deps = []) {
  useEffect(() => {
    const handle = initScrollObserver();
    // Re-check shortly after mount/render to catch lazy or dynamically loaded content
    const timer = setTimeout(() => {
      if (handle) handle.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (handle) handle.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useScrollAnimation;
