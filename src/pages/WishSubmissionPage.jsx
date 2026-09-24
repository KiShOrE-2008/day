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
  ShieldCheck,
  ArrowLeft
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
  const [scanProgress, setScanProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef(null);
  const errorRef = useRef(null);

  const triggerError = (msg) => {
    setError(msg);
    setTimeout(() => {
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  // Handle Photo File Selection & Client Validation with Laser Scanner Animation
  const handleFileSelect = (file) => {
    if (!file) return;

    setError(null);
    const validation = validateImageFile(file);

    if (!validation.valid) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      if (file.size > 5 * 1024 * 1024) {
        triggerError(`Selected photo is too large (${fileSizeMB} MB). Maximum allowed size is 5 MB.`);
      } else {
        triggerError(validation.error || 'Invalid file type. Please upload a JPG, PNG, or WebP photo.');
      }
      return;
    }

    setIsScanningPhoto(true);
    setScanProgress(20);
    setPhotoFile(file);

    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setScanProgress(percent);
      }
    };

    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setScanProgress(100);
      setTimeout(() => {
        setIsScanningPhoto(false);
        setScanProgress(0);
      }, 700);
    };

    reader.onerror = () => {
      setIsScanningPhoto(false);
      triggerError('Failed to read image file. Please select another photo.');
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
    setScanProgress(0);
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
      triggerError('Please enter your name (must be at least 2 characters).');
      return;
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      triggerError('Please enter a valid email address (e.g. yourname@example.com).');
      return;
    }

    if (!cleanMsg || cleanMsg.length < 5) {
      triggerError('Please write a birthday message (must be at least 5 characters).');
      return;
    }

    setLoading(true);
    setUploadProgress(25);

    try {
      if (photoFile) {
        setStatusStep('Compressing & optimizing photo...');
        setUploadProgress(50);
        await new Promise(r => setTimeout(r, 400));
        setUploadProgress(80);
        setStatusStep('Uploading memory to cloud & sending email notification...');
      } else {
        setStatusStep('Sending your birthday wish & email notification...');
        setUploadProgress(70);
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
      triggerError(err.message || 'Failed to submit your wish due to a network connection error. Please try again.');
    } finally {
      setLoading(false);
      setStatusStep('');
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F1EA] px-4 py-8 sm:py-12 relative overflow-hidden selection:bg-[#B76E79]/30 selection:text-white">
      {/* Background Ambient Glowing Halos */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#B76E79]/15 via-[#E89CA7]/10 to-transparent rounded-full filter blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#D4AF37]/5 rounded-full filter blur-[140px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-xl mx-auto flex items-center justify-end mb-8">
        <Link
          to="/wishes"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel border border-white/15 text-xs text-[#E89CA7] hover:border-[#B76E79]/40 font-mono transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
          <span>View Public Wall</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-xl mx-auto w-full">
        {submitted ? (
          /* SUCCESS STATE CARD */
          <div className="glass-panel border border-[#B76E79]/40 rounded-3xl p-8 md:p-12 text-center backdrop-blur-2xl shadow-[0_0_80px_rgba(183,110,121,0.3)] animate-fade-in space-y-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#B76E79] to-[#E89CA7] text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(183,110,121,0.6)] animate-bounce">
              <Heart className="w-10 h-10 fill-current" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-4xl font-serif-cinematic text-white font-bold">
                Your Wish Has Been Sent! ❤️
              </h2>
              <p className="text-sm md:text-base text-[#F5F1EA]/75 font-light leading-relaxed max-w-md mx-auto italic">
                Thank you so much! Your message has been safely received and will appear on Miyaaaaww's birthday wall after admin review.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white font-mono text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(183,110,121,0.5)] hover:scale-105 transition-all"
              >
                RETURN TO STORY
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setRelationship('');
                  setMessage('');
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full glass-panel border border-white/20 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                SEND ANOTHER WISH
              </button>
            </div>
          </div>
        ) : (
          /* SUBMISSION FORM */
          <div className="glass-panel border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative group overflow-hidden">
            {/* Shimmering Top Glass Border Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B76E79]/60 to-transparent" />

            {/* Header Banner */}
            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/35 text-[#E89CA7] text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(183,110,121,0.2)]">
                <Heart className="w-3.5 h-3.5 fill-current text-[#B76E79]" />
                <span>For Miyaaaaww</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif-cinematic text-white font-bold drop-shadow-md">
                Leave Her A Birthday Wish
              </h1>
              <p className="text-xs sm:text-sm text-[#F5F1EA]/70 font-light italic">
                Share a memory, a note of love, or birthday wishes for Sowmiya ❤️
              </p>
            </div>

            {/* Prominent Error Notification Box */}
            {error && (
              <div
                ref={errorRef}
                className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start justify-between gap-3 animate-fade-in shadow-[0_0_30px_rgba(239,68,68,0.25)]"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1">
                    <span className="font-mono text-xs uppercase tracking-wider text-red-300 font-bold block">
                      Submission Error
                    </span>
                    <p className="leading-relaxed text-red-100">{error}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/80 mb-2 font-semibold">
                  Your Name <span className="text-[#B76E79]">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="e.g. Rahul / Ananya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all text-sm"
                />
              </div>

              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/80 mb-2 font-semibold">
                  Your Email Address <span className="text-[#F5F1EA]/40">(Optional - for thank you note)</span>
                </label>
                <input
                  type="email"
                  maxLength={100}
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all text-sm"
                />
              </div>

              {/* Relationship Tag Field */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/80 mb-2 font-semibold">
                  Relationship / Group <span className="text-[#F5F1EA]/40">(Optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  placeholder="e.g. Friend / Cousin / SIH Teammate"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all text-sm"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/80 mb-2 font-semibold">
                  Your Message <span className="text-[#B76E79]">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  maxLength={1000}
                  placeholder="Write something special for her..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all text-sm leading-relaxed resize-none"
                />
                <div className="text-right text-[10px] font-mono text-[#F5F1EA]/40 mt-1">
                  {message.length} / 1000
                </div>
              </div>

              {/* 📸 ANIMATED PHOTO UPLOAD CONTAINER */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/80 mb-2 font-semibold flex items-center justify-between">
                  <span>Add a Photo <span className="text-[#F5F1EA]/40">(Optional, Max 5 MB)</span></span>
                  <span className="text-[10px] text-[#E89CA7] font-mono">JPG, PNG, WebP</span>
                </label>

                {photoPreview ? (
                  /* 3D SCANNED ATTACHED PHOTO CARD */
                  <div className="relative rounded-2xl overflow-hidden border border-[#B76E79]/60 bg-black/80 group/photo p-3 transition-all duration-500 shadow-[0_0_40px_rgba(183,110,121,0.25)] animate-fade-in">
                    <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden">
                      <img
                        src={photoPreview}
                        alt="Photo preview"
                        className={`w-full h-full object-cover rounded-xl transition-transform duration-700 ${
                          isScanningPhoto ? 'scale-110 filter brightness-125' : 'group-hover/photo:scale-105'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

                      {/* Laser Scanner Beam Line Animation */}
                      {isScanningPhoto && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00ff66] to-transparent shadow-[0_0_20px_#00ff66] animate-pulse top-0 animate-bounce" />
                      )}

                      {/* Status & Processing Badge */}
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 border border-[#00ff66]/50 text-[#00ff66] text-xs font-mono backdrop-blur-md shadow-md">
                        {isScanningPhoto ? (
                          <>
                            <Scan className="w-3.5 h-3.5 animate-spin text-[#00ff66]" />
                            <span>Optimizing Image ({scanProgress}%)...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Photo Verified ✨</span>
                          </>
                        )}
                      </div>

                      {/* Remove Photo Button */}
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-3 right-3 bg-black/80 hover:bg-red-600/90 text-white p-2 rounded-full backdrop-blur-md transition-all transform hover:rotate-90 hover:scale-110 border border-white/20 cursor-pointer shadow-lg"
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
                  /* ANIMATED DRAG & DROP UPLOAD ZONE */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-300 cursor-pointer overflow-hidden group/zone ${
                      isDragging
                        ? 'border-[#00ff66] bg-[#00ff66]/10 scale-[1.02] shadow-[0_0_40px_rgba(0,255,106,0.35)]'
                        : 'border-white/20 hover:border-[#B76E79] bg-white/[0.02] hover:bg-[#B76E79]/10 shadow-inner'
                    }`}
                  >
                    {/* Glowing Shimmer Background Halo */}
                    <div className="absolute inset-0 bg-radial from-[#B76E79]/20 via-transparent to-transparent opacity-0 group-hover/zone:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Animated Upload Icon Badge */}
                    <div className="relative w-16 h-16 rounded-full bg-white/5 group-hover/zone:bg-[#B76E79]/25 border border-white/10 group-hover/zone:border-[#B76E79]/50 text-[#E89CA7] flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover/zone:scale-110 shadow-xl">
                      <Upload className={`w-7 h-7 transition-transform duration-300 ${isDragging ? 'animate-bounce text-[#00ff66]' : 'group-hover/zone:-translate-y-1'}`} />
                    </div>

                    <p className="text-sm sm:text-base text-[#F5F1EA] font-medium group-hover/zone:text-white transition-colors">
                      {isDragging ? '✨ Release to attach photo ✨' : '+ Click or drag photo to attach'}
                    </p>
                    <p className="text-xs text-[#F5F1EA]/50 mt-1.5 font-mono">
                      Supports JPG, PNG, or WebP (Maximum 5 MB)
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
                <div className="space-y-2 animate-fade-in pt-2">
                  <div className="flex justify-between text-xs font-mono text-[#E89CA7] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#B76E79]" />
                      {statusStep}
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/15">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#B76E79] via-[#E89CA7] to-[#00ff66] transition-all duration-300 relative shadow-[0_0_15px_#E89CA7]"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-[#F5F1EA]/60 leading-normal flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#B76E79] shrink-0" />
                <span><strong className="text-[#F5F1EA]">Privacy Note:</strong> Your message and photo will appear on Sowmiya's birthday wall after admin approval.</span>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#D4AF37] to-[#E89CA7] hover:brightness-110 text-white font-medium text-sm font-mono tracking-wider transition-all duration-300 shadow-[0_10px_35px_rgba(183,110,121,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{statusStep || 'Sending Wish...'}</span>
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
      <footer className="relative z-10 text-center text-xs text-[#F5F1EA]/40 mt-10 font-mono">
        Sowmiyaa's Birthday Celebration ❤️
      </footer>
    </div>
  );
}


