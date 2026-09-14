import React, { useState, useEffect, useRef } from 'react';
import './Preloader.css';
import logo from '../../assets/images/logo.webp';
import animationArt from '../../assets/images/animation.png';
import introWav from '../../assets/images/intro.wav';

function Preloader({ onComplete }) {
  const [phase, setPhase] = useState('initial');
  const [targetStyles, setTargetStyles] = useState({});
  const splashLogoRef = useRef(null);
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio(introWav) : null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (audio) {
      audio.volume = 0.75;
      audio.load();
    }

    const forcePlayAudio = () => {
      if (!audio || hasPlayedRef.current) return;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          hasPlayedRef.current = true;
          removeInteractionListeners();
        }).catch(() => {});
      }
    };

    const interactionEvents = ['mousemove', 'scroll', 'touchstart', 'click', 'keydown', 'wheel'];
    
    const handleUserInteraction = () => {
      forcePlayAudio();
    };

    const addInteractionListeners = () => {
      interactionEvents.forEach(event => {
        window.addEventListener(event, handleUserInteraction, { once: true, passive: true });
      });
    };

    const removeInteractionListeners = () => {
      interactionEvents.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };

    addInteractionListeners();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('preloader-running');

    const revealTimer = setTimeout(() => {
      setPhase('revealed');
      forcePlayAudio();
    }, 80);

    const travelTimer = setTimeout(() => {
      if (splashLogoRef.current) {
        const splashRect = splashLogoRef.current.getBoundingClientRect();
        const targetNavLogo =
          document.querySelector('.navbar-logo .logo-img') ||
          document.querySelector('.navbar-logo');

        if (targetNavLogo && splashRect.height > 0) {
          const targetRect = targetNavLogo.getBoundingClientRect();
          const targetWidth = targetRect.width || 150;
          const targetHeight =
            targetRect.height ||
            (window.innerWidth <= 380
              ? 32
              : window.innerWidth <= 640
              ? 36
              : window.innerWidth <= 950
              ? 40
              : 44);

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
    }, 2300);

    const handoverTimer = setTimeout(() => {
      document.body.classList.remove('preloader-running');
      document.body.classList.add('preloader-handover');
    }, 4100);

    const completeTimer = setTimeout(() => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('preloader-handover');
      removeInteractionListeners();
      if (onComplete) onComplete();
    }, 4500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(travelTimer);
      clearTimeout(handoverTimer);
      clearTimeout(completeTimer);
      removeInteractionListeners();
      
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('preloader-running');
      document.body.classList.remove('preloader-handover');
      
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [onComplete]);

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
          <img
            ref={splashLogoRef}
            src={logo}
            alt="Meraki Living"
            className={`preloader-logo ${phase}`}
            style={phase === 'traveling' ? targetStyles : undefined}
            loading="eager"
            fetchPriority="high"
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

          <img
            src={animationArt}
            alt="Meraki Living Mountain Villa"
            className="preloader-art-img"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className={`preloader-bottom-wrap ${phase}`}>
          <h1 className="preloader-welcome-text">Welcome</h1>
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