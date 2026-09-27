import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X, ZoomIn } from 'lucide-react';

export default function DynamicImagePlacer({
  src,
  alt = 'Wish memory photo',
  className = '',
  imgClassName = '',
  maxHeight = 'max-h-[360px]',
  allowFullscreen = true,
  rounded = 'rounded-2xl',
  showZoomBadge = true,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!src) return null;

  return (
    <>
      {/* Dynamic Photo Container */}
      <div
        className={`relative overflow-hidden ${rounded} bg-black/60 border border-white/15 flex items-center justify-center group/placer ${className}`}
        style={{ width: '100%' }}
      >
        {/* Ambient Blurred Background Fill (Extracts colors of photo to fill letterboxes gracefully) */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-125 pointer-events-none transition-opacity duration-700"
          style={{ backgroundImage: `url("${src}")` }}
        />

        {/* Ambient Overlay for contrast */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Uncropped Main Photo */}
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`relative z-10 w-full ${maxHeight} object-contain transition-all duration-500 group-hover/placer:scale-[1.015] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />

        {/* Image Loading Skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/5 backdrop-blur-md">
            <div className="w-7 h-7 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Zoom Hint & Fullscreen Action */}
        {allowFullscreen && isLoaded && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(true);
            }}
            className="absolute bottom-3 right-3 z-20 opacity-0 group-hover/placer:opacity-100 transition-all duration-300 px-3 py-1.5 rounded-full bg-black/70 hover:bg-[#B76E79] border border-white/20 text-white text-xs font-mono backdrop-blur-md shadow-xl flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
            title="Click to view full photo in original ratio"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            {showZoomBadge && <span className="hidden sm:inline text-[11px]">Full Photo</span>}
          </button>
        )}
      </div>

      {/* Fullscreen High-Res Modal Lightbox */}
      {isFullscreen &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in select-none"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Top Lightbox Bar */}
            <div className="absolute top-5 right-5 z-30 flex items-center gap-3">
              <span className="text-xs font-mono text-white/70 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-md">
                Original Aspect Ratio View
              </span>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-red-500/80 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-110"
                title="Close fullscreen view (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Ambient Backdrop */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-3xl opacity-25 scale-150 pointer-events-none"
              style={{ backgroundImage: `url("${src}")` }}
            />

            {/* Lightbox Uncropped Image Frame */}
            <div
              className="relative z-20 max-w-[95vw] max-h-[88vh] flex items-center justify-center p-2 rounded-2xl bg-black/40 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.95)]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="max-w-[92vw] max-h-[84vh] object-contain rounded-xl"
              />
            </div>

            <p className="relative z-20 text-xs font-mono text-white/50 mt-4">
              Click anywhere outside or press ESC to close
            </p>
          </div>,
          document.body
        )}
    </>
  );
}
