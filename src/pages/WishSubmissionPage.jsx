import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  FileCheck,
  RefreshCw,
  Scan,
  ShieldCheck
} from 'lucide-react';
import { submitWish } from '../lib/wishesService';
import { validateImageFile } from '../lib/imageCompressor';

export default function WishSubmissionPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef(null);

  // Handle Photo File Selection & Client Validation with Scanner Beam Animation
  const handleFileSelect = (file) => {
    if (!file) return;

    setError(null);
    const validation = validateImageFile(file);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setIsScanningPhoto(true);
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setTimeout(() => setIsScanningPhoto(false), 900);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsScanningPhoto(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMsg = message.trim();

    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return;
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!cleanMsg || cleanMsg.length < 5) {
      setError('Please write a birthday wish (at least 5 characters).');
      return;
    }

    setLoading(true);
    setUploadProgress(30);

    try {
      if (photoFile) {
        setStatusStep('Compressing & optimizing photo...');
        setUploadProgress(60);
        await new Promise(r => setTimeout(r, 300));
        setUploadProgress(85);
        setStatusStep('Uploading memory...');
      } else {
        setStatusStep('Sending your birthday wish...');
        setUploadProgress(75);
      }

      await submitWish({
        name: cleanName,
        email: cleanEmail,
        relationship: relationship.trim(),
        message: cleanMsg,
        photoFile,
      });

      setUploadProgress(100);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.message || 'Failed to submit your wish. Please try again.');
    } finally {
      setLoading(false);
      setStatusStep('');
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F1EA] px-4 py-8 relative overflow-hidden selection:bg-[#B76E79]/30 selection:text-white">
      {/* Background Ambient Glowing Halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#B76E79]/15 via-[#D4AF37]/10 to-transparent rounded-full filter blur-[150px] pointer-events-none" />

      {/* Top Header Links */}
      <header className="relative z-10 max-w-xl mx-auto flex items-center justify-end mb-8">
        <Link
          to="/wishes"
          className="inline-flex items-center gap-1.5 text-xs text-[#E89CA7] hover:underline font-mono"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>View Public Wall</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-xl mx-auto w-full">
        {submitted ? (
          /* SUCCESS STATE CARD (3D Entrance) */
          <div className="bg-[#121212]/90 border border-[#B76E79]/40 rounded-3xl p-8 md:p-12 text-center backdrop-blur-xl shadow-[0_0_80px_rgba(183,110,121,0.3)] animate-fade-in [transform:perspective(1000px)_rotateY(0deg)] transition-all">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#B76E79] to-[#E89CA7] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(183,110,121,0.6)] animate-bounce">
              <Heart className="w-8 h-8 fill-current" />
            </div>

            <h2 className="text-2xl md:text-3xl font-serif text-[#F5F1EA] mb-4">
              Your wish has been sent ❤️
            </h2>

            <p className="text-sm md:text-base text-[#F5F1EA]/70 mb-8 leading-relaxed font-light">
              Thank you so much! Your message has been safely delivered and will appear on Miyaaaaww's birthday wall after approval.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/#birthday-wishes-section"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] to-[#D4AF37] hover:brightness-110 text-white font-medium text-xs font-mono transition-all shadow-lg hover:shadow-[#B76E79]/30"
              >
                RETURN TO STORY
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setShow3DSendAnim(false);
                  setName('');
                  setEmail('');
                  setRelationship('');
                  setMessage('');
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-white/20 hover:bg-white/10 text-[#F5F1EA] text-xs font-mono transition-all"
              >
                SEND ANOTHER WISH
              </button>
            </div>
          </div>
        ) : (
          /* SUBMISSION FORM */
          <div className="bg-[#121212]/80 border border-white/15 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative group overflow-hidden">
            {/* Shimmering Top Glass Border Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B76E79]/50 to-transparent" />

            {/* Header Banner */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/35 text-[#E89CA7] text-xs font-mono uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(183,110,121,0.2)]">
                <Heart className="w-3.5 h-3.5 fill-current text-[#B76E79]" />
                <span>For Miyaaaaww</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-[#F5F1EA] drop-shadow-md">
                Leave Her A Birthday Wish
              </h1>
              <p className="text-xs md:text-sm text-[#F5F1EA]/60 mt-2 font-light">
                Share a memory, a note of love, or birthday wishes for Sowmiya ❤️
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs md:text-sm flex items-start gap-3 animate-fade-in">
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

              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/70 mb-2">
                  Your Email Address <span className="text-[#F5F1EA]/40">(Optional - for thank you note)</span>
                </label>
                <input
                  type="email"
                  maxLength={100}
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              {/* 📸 ANIMATED 3D PHOTO UPLOAD CONTAINER */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/70 mb-2">
                  Add a Photo <span className="text-[#F5F1EA]/40">(Optional, Max 5 MB)</span>
                </label>

                {photoPreview ? (
                  /* 3D SCANNED ATTACHED PHOTO CARD */
                  <div className="relative rounded-2xl overflow-hidden border border-[#B76E79]/60 bg-black/80 group/photo p-3 transition-all duration-500 shadow-[0_0_40px_rgba(183,110,121,0.25)] animate-fade-in [perspective:1000px]">
                    <div className="relative h-52 rounded-xl overflow-hidden">
                      <img
                        src={photoPreview}
                        alt="Photo preview"
                        className={`w-full h-full object-cover rounded-xl transition-transform duration-700 ${
                          isScanningPhoto ? 'scale-110 filter brightness-125' : 'group-hover/photo:scale-105'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

                      {/* 3D Laser Scanner Beam Animation Line */}
                      {isScanningPhoto && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00ff66] to-transparent shadow-[0_0_20px_#00ff66] animate-pulse top-0 animate-bounce" />
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-[#00ff66]/50 text-[#00ff66] text-xs font-mono backdrop-blur-md shadow-md">
                        {isScanningPhoto ? (
                          <>
                            <Scan className="w-3.5 h-3.5 animate-spin text-[#00ff66]" />
                            <span>Scanning & Optimizing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Photo Verified ✨</span>
                          </>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-3 right-3 bg-black/80 hover:bg-red-600/90 text-white p-2 rounded-full backdrop-blur-md transition-all transform hover:rotate-90 hover:scale-110 border border-white/20"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-3 px-1 flex items-center justify-between text-xs font-mono text-[#F5F1EA]/80">
                      <span className="truncate max-w-[220px] font-medium">{photoFile?.name}</span>
                      <span className="text-[#E89CA7] shrink-0 font-semibold">
                        {photoFile ? `${(photoFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* 3D TILT DRAG & DROP UPLOAD ZONE */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer overflow-hidden group/zone [transform-style:preserve-3d] ${
                      isDragging
                        ? 'border-[#00ff66] bg-[#00ff66]/10 scale-[1.02] shadow-[0_0_40px_rgba(0,255,106,0.35)]'
                        : 'border-white/20 hover:border-[#B76E79] bg-white/[0.02] hover:bg-[#B76E79]/5 shadow-inner'
                    }`}
                  >
                    {/* Glowing Shimmer Arc */}
                    <div className="absolute inset-0 bg-radial from-[#B76E79]/15 via-transparent to-transparent opacity-0 group-hover/zone:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Animated Upload Icon Badge */}
                    <div className="relative w-14 h-14 rounded-full bg-white/5 group-hover/zone:bg-[#B76E79]/20 border border-white/10 group-hover/zone:border-[#B76E79]/40 text-[#E89CA7] flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover/zone:scale-110 shadow-lg">
                      <Upload className={`w-6 h-6 transition-transform duration-300 ${isDragging ? 'animate-bounce text-[#00ff66]' : 'group-hover/zone:-translate-y-1'}`} />
                    </div>

                    <p className="text-sm text-[#F5F1EA] font-medium group-hover/zone:text-white transition-colors">
                      {isDragging ? '✨ Drop photo here to attach ✨' : '+ Click or drag photo to attach with wish'}
                    </p>
                    <p className="text-xs text-[#F5F1EA]/40 mt-1 font-mono">
                      Supports JPG, PNG, or WebP (up to 5 MB)
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

              {/* Uploading Progress Bar */}
              {loading && (
                <div className="space-y-2 animate-fade-in pt-1">
                  <div className="flex justify-between text-xs font-mono text-[#E89CA7]">
                    <span>{statusStep}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#B76E79] via-[#E89CA7] to-[#00ff66] transition-all duration-300 relative shadow-[0_0_12px_#E89CA7]"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-ping" />
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-[#F5F1EA]/50 leading-normal flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B76E79] shrink-0" />
                <span><strong className="text-[#F5F1EA]/70">Privacy Notice:</strong> Your message and optional photo will appear on Sowmiya's birthday wall after admin approval.</span>
              </div>

              {/* 🚀 3D PERSPECTIVE SEND BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#D4AF37] to-[#E89CA7] hover:brightness-110 text-white font-medium text-sm font-mono tracking-wider transition-all duration-300 shadow-[0_10px_30px_rgba(183,110,121,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-95 [transform:perspective(600px)] hover:[transform:perspective(600px)_translateZ(8px)]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{statusStep || 'Sending wish...'}</span>
                  </>
                ) : (
                  <>
                    <span>SEND WISH</span>
                    <Heart className="w-4.5 h-4.5 fill-current text-white animate-pulse" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-[#F5F1EA]/40 mt-8 font-mono">
        Sowmiyaa's Birthday Celebration ❤️
      </footer>
    </div>
  );
}

