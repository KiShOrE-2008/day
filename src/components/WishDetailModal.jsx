import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Quote, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPhotoUrl } from '../lib/wishesService';

export default function WishDetailModal({
  wish,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.key === 'ArrowLeft' || e.key === 'h') && onPrev) {
        onPrev();
      } else if ((e.key === 'ArrowRight' || e.key === 'l') && onNext) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onPrev, onNext]);

  if (!wish) return null;

  const photoUrl = getPhotoUrl(wish.photo_path);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(wish.created_at);

  return createPortal(
    <>
      {/* Backdrop Click Area */}
      <div
        className="fixed top-0 left-0 w-screen h-screen z-[99990] bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Outer Wrapper for Side Controls & Modal centered in screen viewport */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] w-[92vw] max-w-2xl">
        {/* Side Floating Left Chevron Button (Desktop) */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#B76E79]/80 border border-white/20 text-white transition-all shadow-2xl backdrop-blur-md focus:outline-none hover:scale-110 active:scale-95"
            title="Previous Wish (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Side Floating Right Chevron Button (Desktop) */}
        {onNext && (
          <button
            onClick={onNext}
            className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#B76E79]/80 border border-white/20 text-white transition-all shadow-2xl backdrop-blur-md focus:outline-none hover:scale-110 active:scale-95"
            title="Next Wish (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Frosted Glass Modal Container */}
        <div className="w-full bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden max-h-[85vh] flex flex-col justify-between relative">
          {/* Ambient Glowing Background Halos */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#B76E79]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar (Badge, Counter & Navigation / Close Actions) */}
          <div className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b border-white/15">
            <div className="flex items-center gap-2">
              {wish.featured && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Featured Wish</span>
                </div>
              )}
              {currentIndex && totalCount && (
                <span className="text-xs font-mono text-[#F5F1EA]/70 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                  {currentIndex} of {totalCount}
                </span>
              )}
            </div>

            {/* Top Bar Controls */}
            <div className="flex items-center gap-2">
              {/* Mobile Prev / Next Controls */}
              {onPrev && (
                <button
                  onClick={onPrev}
                  className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {onNext && (
                <button
                  onClick={onNext}
                  className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-white border border-white/15 hover:border-red-500/40 transition-all focus:outline-none ml-1"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="relative z-10 overflow-y-auto pr-1 space-y-5 custom-scrollbar my-2">
            {/* Photo if present */}
            {photoUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/20 bg-black/60 max-h-[340px] flex items-center justify-center shadow-xl">
                <img
                  src={photoUrl}
                  alt={`Photo shared by ${wish.name}`}
                  className="w-full h-full max-h-[340px] object-contain rounded-2xl"
                />
              </div>
            )}

            {/* Quote Icon & Detailed Message */}
            <div className="space-y-3 pt-1 bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-inner">
              <Quote className="w-8 h-8 text-[#B76E79]/80" />
              <p className="text-base sm:text-xl text-[#F5F1EA] font-light leading-relaxed whitespace-pre-wrap">
                "{wish.message}"
              </p>
            </div>
          </div>

          {/* Submitter & Date Info */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B76E79]/20 border border-[#B76E79]/40 flex items-center justify-center text-[#B76E79] shadow-md">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#F5F1EA] font-semibold">
                  — {wish.name}
                </h4>
                {wish.relationship && (
                  <span className="text-xs font-mono text-[#E89CA7] block">
                    {wish.relationship}
                  </span>
                )}
              </div>
            </div>

            {formattedDate && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#F5F1EA]/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          {/* Bottom Navigation Control Bar */}
          {totalCount > 1 && (
            <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={onPrev}
                disabled={!onPrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-[#F5F1EA] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREVIOUS</span>
              </button>

              <span className="text-[11px] font-mono text-[#F5F1EA]/50 hidden sm:inline">
                Use ← → keys to navigate
              </span>

              <button
                onClick={onNext}
                disabled={!onNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-[#F5F1EA] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <span>NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

