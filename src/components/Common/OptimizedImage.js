import React, { forwardRef, memo, useState, useEffect, useRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './OptimizedImage.css';
import { formatImageUrl } from '../../utils/apiHelper';

const OptimizedImage = forwardRef(function OptimizedImage(
  {
    src,
    alt = '',
    className,
    style,
    width,
    height,
    loading = 'lazy',
    fetchPriority,
    decoding = 'async',
    objectFit,
    objectPosition,
    imageRef,
    noWrapper,
    useWrapper = false,
    aspectRatio,
    placeholderBg,
    containerClassName,
    containerStyle,
    ariaHidden,
    draggable,
    fallbackSrc,
    onError,
    onLoad,
    ...rest
  },
  ref
) {
  const actualRef = ref || imageRef;
  const isEager = loading === 'eager';
  const isPrerender = typeof navigator !== 'undefined' && /ReactSnap/i.test(navigator.userAgent);
  const isCritical = isEager || isPrerender;

  const internalRef = useRef(null);
  const resolvedSrc = formatImageUrl(src);

  const [prevSrcProp, setPrevSrcProp] = useState(src);
  const [hasFailed, setHasFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(() => isCritical);

  if (src !== prevSrcProp) {
    setPrevSrcProp(src);
    setHasFailed(false);
    setIsLoaded(isCritical);
  }

  const currentSrc = hasFailed && fallbackSrc ? fallbackSrc : resolvedSrc;

  useEffect(() => {
    if (internalRef.current && internalRef.current.complete) {
      if (internalRef.current.naturalWidth > 0 || internalRef.current.naturalHeight > 0) {
        setIsLoaded(true);
      } else {
        if (!hasFailed && fallbackSrc) {
          setHasFailed(true);
          setIsLoaded(false);
        } else {
          setIsLoaded(true);
        }
      }
    }
  }, [currentSrc, hasFailed, fallbackSrc]);

  const combinedStyle = {
    ...(objectFit ? { objectFit } : {}),
    ...(objectPosition ? { objectPosition } : {}),
    ...style
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (rest.onContextMenu) rest.onContextMenu(e);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    if (rest.onDragStart) rest.onDragStart(e);
  };

  const handleError = (e) => {
    if (!hasFailed && fallbackSrc && currentSrc !== fallbackSrc) {
      setHasFailed(true);
      setIsLoaded(false);
    } else {
      setIsLoaded(true);
    }
    if (onError) onError(e);
  };

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  if (isCritical) {
    const eagerImg = (
      <img
        ref={(node) => {
          internalRef.current = node;
          if (typeof actualRef === 'function') {
            actualRef(node);
          } else if (actualRef) {
            actualRef.current = node;
          }
        }}
        src={currentSrc}
        alt={alt}
        className={className}
        style={combinedStyle}
        width={width}
        height={height}
        loading="eager"
        fetchPriority={fetchPriority || 'high'}
        decoding={decoding}
        draggable={draggable !== undefined ? draggable : false}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onError={handleError}
        onLoad={handleLoad}
        aria-hidden={ariaHidden !== undefined ? ariaHidden : rest['aria-hidden']}
        {...rest}
      />
    );

    if (useWrapper) {
      const wrapperStyles = {
        ...(aspectRatio ? { aspectRatio } : {}),
        ...(placeholderBg ? { backgroundColor: placeholderBg } : {}),
        ...containerStyle
      };
      return (
        <div className={containerClassName} style={wrapperStyles}>
          {eagerImg}
        </div>
      );
    }

    return eagerImg;
  }

  const isContain =
    objectFit === 'contain' ||
    (className && (className.includes('contain') || className.includes('experience-icon') || className.includes('avatar')));

  const wrapperClasses = [
    'optimized-image-lazy-wrapper',
    className ? `${className}-lazy-wrapper` : '',
    className && className.includes('viewpoint-image') ? 'viewpoint-image-lazy-wrapper' : '',
    className && className.includes('cafe-bg-img') ? 'cafe-bg-img-lazy-wrapper' : '',
    className && className.includes('cta-bg-img') ? 'cta-bg-img-lazy-wrapper' : '',
    className && className.includes('hero-bg') ? 'hero-bg-lazy-wrapper' : '',
    className && className.includes('rd-modal-main-image') ? 'rd-modal-main-image-lazy-wrapper' : '',
    isContain ? 'contain-mode' : '',
    hasFailed ? 'lazy-image-failed' : '',
    isLoaded ? 'lazy-load-image-loaded' : ''
  ].filter(Boolean).join(' ');

  const lazyImg = (
    <LazyLoadImage
      src={currentSrc}
      placeholderSrc={currentSrc}
      alt={alt}
      className={className}
      style={combinedStyle}
      width={width}
      height={height}
      effect="blur"
      threshold={300}
      wrapperClassName={wrapperClasses}
      visibleByDefault={false}
      afterLoad={handleLoad}
      onError={handleError}
      draggable={draggable !== undefined ? draggable : false}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      aria-hidden={ariaHidden !== undefined ? ariaHidden : rest['aria-hidden']}
      {...rest}
    />
  );

  if (useWrapper) {
    const wrapperStyles = {
      ...(aspectRatio ? { aspectRatio } : {}),
      ...(placeholderBg ? { backgroundColor: placeholderBg } : {}),
      ...containerStyle
    };
    return (
      <div className={containerClassName} style={wrapperStyles}>
        {lazyImg}
      </div>
    );
  }

  return lazyImg;
});

export default memo(OptimizedImage);
