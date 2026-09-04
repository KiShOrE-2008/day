import React, { useEffect } from 'react';
import { X, Heart, Star, Quote, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Backdrop Click Area */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Outer Wrapper for Side Controls & Modal */}
      <div className="relative z-10 w-full max-w-2xl my-auto">
        {/* Side Floating Left Chevron Button (Desktop) */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#B76E79]/80 border border-white/20 text-white transition-all shadow-2xl backdrop-blur-md focus:outline-none hover:scale-110"
            title="Previous Wish (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Side Floating Right Chevron Button (Desktop) */}
        {onNext && (
          <button
            onClick={onNext}
            className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#B76E79]/80 border border-white/20 text-white transition-all shadow-2xl backdrop-blur-md focus:outline-none hover:scale-110"
            title="Next Wish (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Modal Main Container */}
        <div className="w-full bg-[#121212] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col justify-between relative">
          {/* Ambient Top Glow */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#B76E79]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar (Badge, Counter & Close Button) */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              {wish.featured && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Featured Wish</span>
                </div>
              )}
              {currentIndex && totalCount && (
                <span className="text-xs font-mono text-[#F5F1EA]/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  {currentIndex} of {totalCount}
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-all focus:outline-none ml-auto"
              title="Close message (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto pr-1 space-y-6 custom-scrollbar my-2">
            {/* Photo if present */}
            {photoUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/60 max-h-[350px] flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt={`Photo shared by ${wish.name}`}
                  className="w-full h-full max-h-[350px] object-contain rounded-2xl"
                />
              </div>
            )}

            {/* Quote Icon & Detailed Message */}
            <div className="space-y-4 pt-1">
              <Quote className="w-8 h-8 text-[#B76E79]/60" />
              <p className="text-base sm:text-xl text-[#F5F1EA] font-light leading-relaxed whitespace-pre-wrap">
                "{wish.message}"
              </p>
            </div>
          </div>

          {/* Submitter & Date Info */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B76E79]/20 border border-[#B76E79]/40 flex items-center justify-center text-[#B76E79]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#F5F1EA] font-semibold">
                  — {wish.name}
                </h4>
                {wish.relationship && (
                  <span className="text-xs font-mono text-[#B76E79] block">
                    {wish.relationship}
                  </span>
                )}
              </div>
            </div>

            {formattedDate && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#F5F1EA]/40">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          {/* Bottom Navigation Control Bar */}
          {totalCount > 1 && (
            <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={onPrev}
                disabled={!onPrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-[#F5F1EA] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREVIOUS</span>
              </button>

              <span className="text-[11px] font-mono text-[#F5F1EA]/40 hidden sm:inline">
                Use ← → keys to navigate
              </span>

              <button
                onClick={onNext}
                disabled={!onNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-[#F5F1EA] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <span>NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
