import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Upload, X, CheckCircle2, AlertCircle, ArrowLeft, Image as ImageIcon, Sparkles } from 'lucide-react';
import { submitWish } from '../lib/wishesService';
import { validateImageFile } from '../lib/imageCompressor';

export default function WishSubmissionPage() {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState(''); // 'validating' | 'compressing' | 'uploading'
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef(null);

  // Handle Photo File Selection & Client Validation
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const validation = validateImageFile(file);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Front-end trim validation
    const cleanName = name.trim();
    const cleanMsg = message.trim();

    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return;
    }

    if (!cleanMsg || cleanMsg.length < 5) {
      setError('Please write a birthday wish (at least 5 characters).');
      return;
    }

    setLoading(true);

    try {
      if (photoFile) {
        setStatusStep('Processing & compressing photo...');
      } else {
        setStatusStep('Sending your birthday wish...');
      }

      await submitWish({
        name: cleanName,
        relationship: relationship.trim(),
        message: cleanMsg,
        photoFile,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.message || 'Failed to submit your wish. Please try again.');
    } finally {
      setLoading(false);
      setStatusStep('');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#F5F1EA] flex flex-col justify-between selection:bg-[#B76E79]/30 selection:text-white px-4 py-8 md:py-12">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#B76E79]/15 to-[#D4AF37]/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 max-w-xl mx-auto w-full flex items-center justify-between mb-8">
        <Link
          to="/#birthday-wishes-section"
          className="inline-flex items-center gap-2 text-sm text-[#F5F1EA]/60 hover:text-[#B76E79] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Story</span>
        </Link>
        <Link
          to="/wishes"
          className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>View Public Wall</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-xl mx-auto w-full">
        {submitted ? (
          /* SUCCESS STATE */
          <div className="bg-[#121212]/90 border border-[#B76E79]/30 rounded-3xl p-8 md:p-12 text-center backdrop-blur-xl shadow-2xl animate-fade-in">
            <div className="w-16 h-16 bg-[#B76E79]/20 text-[#B76E79] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 fill-current" />
            </div>

            <h2 className="text-2xl md:text-3xl font-serif text-[#F5F1EA] mb-4">
              Your wish has been sent ❤️
            </h2>

            <p className="text-sm md:text-base text-[#F5F1EA]/70 mb-8 leading-relaxed">
              Thank you so much! Your message has been safely delivered and will appear on Miyaaaaww's birthday wall after approval.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/#birthday-wishes-section"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#B76E79] hover:bg-[#A35D68] text-white font-medium text-sm transition-all shadow-lg hover:shadow-[#B76E79]/30"
              >
                Return to Story
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setRelationship('');
                  setMessage('');
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 text-[#F5F1EA]/80 text-sm transition-all"
              >
                Send Another Wish
              </button>
            </div>
          </div>
        ) : (
          /* SUBMISSION FORM */
          <div className="bg-[#121212]/80 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl">
            {/* Header Banner */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/30 text-[#B76E79] text-xs font-mono uppercase tracking-widest mb-3">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>For Miyaaaaww</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-[#F5F1EA]">
                Leave Her A Birthday Wish
              </h1>
              <p className="text-xs md:text-sm text-[#F5F1EA]/60 mt-2">
                Share a memory, a note of love, or birthday wishes for Sowmiya ❤️
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs md:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/70 mb-2">
                  Your Name <span className="text-[#B76E79]">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="e.g. Rahul / Ananya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all text-sm"
                />
              </div>

              {/* Relationship Tag Field */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/70 mb-2">
                  Relationship / Group <span className="text-[#F5F1EA]/40">(Optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  placeholder="e.g. Friend / Cousin / SIH Teammate"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all text-sm"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/70 mb-2">
                  Your Message <span className="text-[#B76E79]">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  maxLength={1000}
                  placeholder="Write something special for her..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all text-sm leading-relaxed resize-none"
                />
                <div className="text-right text-[10px] font-mono text-[#F5F1EA]/40 mt-1">
                  {message.length} / 1000
                </div>
              </div>

              {/* Optional Photo Upload */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/70 mb-2">
                  Add a Photo <span className="text-[#F5F1EA]/40">(Optional, Max 5 MB)</span>
                </label>

                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-[#B76E79]/40 bg-black/40 group p-2">
                    <img
                      src={photoPreview}
                      alt="Photo preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-4 right-4 bg-black/70 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                      title="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="p-2 text-center text-xs font-mono text-[#F5F1EA]/60">
                      {photoFile?.name} (Ready for upload)
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/15 hover:border-[#B76E79]/60 rounded-2xl p-6 text-center bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#B76E79]/20 text-[#B76E79] flex items-center justify-center mx-auto mb-3 transition-colors">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-[#F5F1EA]/80 font-medium group-hover:text-white">
                      + Add a photo with your wish
                    </p>
                    <p className="text-xs text-[#F5F1EA]/40 mt-1">
                      JPG, PNG, or WebP up to 5 MB
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Explicit Privacy Notice */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-[#F5F1EA]/50 leading-normal">
                🔒 <strong className="text-[#F5F1EA]/70">Privacy Notice:</strong> Your message and optional photo may appear on Sowmiya's birthday website after admin approval.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] hover:opacity-95 text-white font-medium text-sm transition-all shadow-lg hover:shadow-[#B76E79]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{statusStep || 'Sending wish...'}</span>
                  </>
                ) : (
                  <>
                    <span>SEND WISH</span>
                    <Heart className="w-4 h-4 fill-current" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-[#F5F1EA]/40 mt-8">
        Sowmiyaa's Birthday Celebration ❤️
      </footer>
    </div>
  );
}
