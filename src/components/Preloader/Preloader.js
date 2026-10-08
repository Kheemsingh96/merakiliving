import React, { useState, useEffect, useRef } from 'react';
import './Preloader.css';
import logo from '../../assets/images/logo.avif';
import animationArt from '../../assets/images/animation.avif';
import OptimizedImage from '../Common/OptimizedImage';

function Preloader({ onComplete }) {
  const [phase, setPhase] = useState('initial');
  const [targetStyles, setTargetStyles] = useState({});
  const splashLogoRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // 1. Reset scroll to top and set manual scroll restoration during opening animation
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('preloader-running');
    document.documentElement.classList.add('preloader-running');

    const revealTimer = setTimeout(() => {
      setPhase('revealed');
    }, 40);

    const travelTimer = setTimeout(() => {
      if (splashLogoRef.current) {
        const splashRect = splashLogoRef.current.getBoundingClientRect();
        const targetNavLogo =
          document.querySelector('.navbar-logo .logo-img') ||
          document.querySelector('.navbar-logo');

        if (targetNavLogo && splashRect.height > 0) {
          const targetRect = targetNavLogo.getBoundingClientRect();
          const targetHeight =
            targetRect.height > 0
              ? targetRect.height
              : (window.innerWidth <= 480
                ? 32
                : window.innerWidth <= 768
                ? 36
                : window.innerWidth <= 1100
                ? 40
                : 50);
          const targetWidth =
            targetRect.width > 0
              ? targetRect.width
              : Math.round(targetHeight * (splashRect.width / splashRect.height));

          const targetCenterX = targetRect.left + targetWidth / 2;
          const targetCenterY = targetRect.top + targetHeight / 2;
          const splashCenterX = splashRect.left + splashRect.width / 2;
          const splashCenterY = splashRect.top + splashRect.height / 2;

          const deltaX = targetCenterX - splashCenterX;
          const deltaY = targetCenterY - splashCenterY;
          const scale = targetHeight / splashRect.height;

          setTargetStyles({
            transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`,
          });
        }
      }
      setPhase('traveling');
    }, 1350);

    const completeTimer = setTimeout(() => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.classList.remove('preloader-running');
      document.documentElement.classList.remove('preloader-running');

      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }

      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 2100);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(travelTimer);
      clearTimeout(completeTimer);

      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.classList.remove('preloader-running');
      document.documentElement.classList.remove('preloader-running');

      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <div
      className={`preloader-overlay ${
        phase === 'traveling' ? 'preloader-fadeout' : ''
      }`}
      aria-hidden="true"
    >
      <div className="preloader-backdrop-gradient" />

      <div className="preloader-scene-container">
        <div className="preloader-logo-wrap">
          <OptimizedImage
            imageRef={splashLogoRef}
            src={logo}
            alt="Meraki Living"
            className={`preloader-logo ${phase}`}
            style={{
              filter: 'none',
              ...(phase === 'traveling' ? targetStyles : {})
            }}
            width="280"
            height="93"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            noWrapper={true}
          />
        </div>

        <div className={`preloader-art-wrap ${phase}`}>
          <div className="preloader-birds-layer">
            <svg className="preloader-bird bird-1" viewBox="0 0 28 16" aria-hidden="true">
              <path
                d="M1 9 C6 3, 11 4, 14 9 C17 4, 22 3, 27 9 C22 6, 17 7, 14 10 C11 7, 6 6, 1 9 Z"
                fill="#87008B"
              />
            </svg>
            <svg className="preloader-bird bird-2" viewBox="0 0 28 16" aria-hidden="true">
              <path
                d="M1 9 C6 3, 11 4, 14 9 C17 4, 22 3, 27 9 C22 6, 17 7, 14 10 C11 7, 6 6, 1 9 Z"
                fill="#87008B"
              />
            </svg>
            <svg className="preloader-bird bird-3" viewBox="0 0 28 16" aria-hidden="true">
              <path
                d="M1 9 C6 3, 11 4, 14 9 C17 4, 22 3, 27 9 C22 6, 17 7, 14 10 C11 7, 6 6, 1 9 Z"
                fill="#87008B"
              />
            </svg>
          </div>

          <OptimizedImage
            src={animationArt}
            alt="Meraki Living Mountain Villa"
            className="preloader-art-img"
            width="600"
            height="400"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            noWrapper={true}
          />
        </div>

        <div className={`preloader-bottom-wrap ${phase}`}>
          <span className="preloader-welcome-text">Welcome</span>
          <div className="preloader-location-row">
            <svg
              className="preloader-pin-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="currentColor"
              />
            </svg>
            <span className="preloader-location-address">
              Peora Mukteshwer Uttarakhand
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preloader;