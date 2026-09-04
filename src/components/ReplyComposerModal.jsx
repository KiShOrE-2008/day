import React, { useState, useEffect } from 'react';
import { X, Send, Heart, Sparkles, MessageSquare, Quote, CheckCircle2 } from 'lucide-react';

const QUICK_REPLIES = [
  'Thank you so much for the birthday wishes! ❤️ You made my day extra special!',
  'Aww thank you darling! 🥰 Means so much to me!',
  'Thank you for the sweet note! So grateful for your love and support! ✨',
  'Thank you so much! Wishing you lots of love and happiness too! 💖',
];

export default function ReplyComposerModal({ wish, onClose, onSendReply }) {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (wish?.thank_you_message) {
      setReplyText(wish.thank_you_message);
    } else {
      setReplyText(QUICK_REPLIES[0]);
    }
  }, [wish]);

  if (!wish) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSending(true);
    try {
      await onSendReply(wish.id, replyText.trim());
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1400);
    } catch (err) {
      alert(err.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg bg-[#121212] border border-[#B76E79]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto">
        {/* Top Glow Accent */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#B76E79]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#B76E79]/20 text-[#B76E79] flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#F5F1EA]">Send Thank-You Reply</h3>
              <p className="text-xs font-mono text-[#E89CA7]">To: {wish.name} &lt;{wish.email || 'No Email'}&gt;</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="py-12 text-center space-y-3 animate-fade-in">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl text-[#F5F1EA]">Thank You Sent ❤️</h4>
            <p className="text-xs text-[#F5F1EA]/60 font-mono">
              Your reply has been delivered to {wish.name}!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Original Wish Preview Box */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#F5F1EA]/50">
                <Quote className="w-3 h-3 text-[#B76E79]" />
                <span>Original Wish from {wish.name}:</span>
              </div>
              <p className="text-xs text-[#F5F1EA]/80 italic line-clamp-3 leading-relaxed">
                "{wish.message}"
              </p>
            </div>

            {/* Quick Reply Preset Chips */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/60 mb-2">
                Quick Reply Templates
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans text-left transition-all border ${
                      replyText === preset
                        ? 'bg-[#B76E79]/20 border-[#B76E79] text-[#E89CA7] font-medium'
                        : 'bg-white/5 border-white/10 text-[#F5F1EA]/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    "{preset.slice(0, 32)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Reply Textarea */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/70 mb-2">
                Your Personal Reply Message
              </label>
              <textarea
                required
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your thank-you message..."
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-sm text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] leading-relaxed resize-none transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-mono border border-white/10 text-[#F5F1EA]/70 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={sending || !replyText.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] hover:opacity-95 text-white font-medium text-xs font-mono flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {sending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reply ❤️</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
