import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  FileCheck,
  RefreshCw
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

  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef(null);

  // Handle Photo File Selection & Client Validation
  const handleFileSelect = (file) => {
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
    setUploadProgress(15);

    try {
      if (photoFile) {
        setStatusStep('Compressing & optimizing photo...');
        setUploadProgress(40);
        await new Promise(r => setTimeout(r, 400));
        setUploadProgress(75);
        setStatusStep('Uploading memory to cloud...');
      } else {
        setStatusStep('Sending your birthday wish...');
        setUploadProgress(60);
      }

      await submitWish({
        name: cleanName,
        email: cleanEmail,
        relationship: relationship.trim(),
        message: cleanMsg,
        photoFile,
      });

      setUploadProgress(100);
      await new Promise(r => setTimeout(r, 300));
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
    <div className="min-h-screen bg-[#080808] text-[#F5F1EA] px-4 py-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#B76E79]/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Top Header Links */}
      <header className="relative z-10 max-w-xl mx-auto flex items-center justify-between mb-8">
        <Link
          to="/#birthday-wishes-section"
          className="inline-flex items-center gap-1.5 text-xs text-[#F5F1EA]/70 hover:text-white font-mono transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Story</span>
        </Link>
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
          /* SUCCESS STATE */
          <div className="bg-[#121212]/90 border border-[#B76E79]/40 rounded-3xl p-8 md:p-12 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(183,110,121,0.2)] animate-fade-in">
            <div className="w-16 h-16 bg-[#B76E79]/20 text-[#E89CA7] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(183,110,121,0.4)] animate-bounce">
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
                  setEmail('');
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/30 text-[#E89CA7] text-xs font-mono uppercase tracking-widest mb-3">
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

              {/* Animated Drag & Drop Photo Upload */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/70 mb-2">
                  Add a Photo <span className="text-[#F5F1EA]/40">(Optional, Max 5 MB)</span>
                </label>

                {photoPreview ? (
                  /* Animated Selected Photo Card */
                  <div className="relative rounded-2xl overflow-hidden border border-[#B76E79]/50 bg-black/60 group p-3 transition-all duration-300 shadow-[0_0_30px_rgba(183,110,121,0.2)] animate-fade-in">
                    <div className="relative h-48 rounded-xl overflow-hidden">
                      <img
                        src={photoPreview}
                        alt="Photo preview"
                        className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* Success Badge */}
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-[#00ff66]/40 text-[#00ff66] text-xs font-mono backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Photo Attached</span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-3 right-3 bg-black/70 hover:bg-red-600/90 text-white p-2 rounded-full backdrop-blur-md transition-all transform hover:rotate-90 hover:scale-110"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 px-1 flex items-center justify-between text-xs font-mono text-[#F5F1EA]/70">
                      <span className="truncate max-w-[220px]">{photoFile?.name}</span>
                      <span className="text-[#E89CA7] shrink-0">
                        {photoFile ? `${(photoFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Animated Drag & Drop Upload Zone */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer overflow-hidden group ${
                      isDragging
                        ? 'border-[#00ff66] bg-[#00ff66]/10 scale-[1.02] shadow-[0_0_35px_rgba(0,255,106,0.3)]'
                        : 'border-white/20 hover:border-[#B76E79] bg-white/[0.02] hover:bg-[#B76E79]/5 shadow-inner'
                    }`}
                  >
                    {/* Floating Glow Radial */}
                    <div className="absolute inset-0 bg-radial from-[#B76E79]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Animated Upload Icon Badge */}
                    <div className="relative w-14 h-14 rounded-full bg-white/5 group-hover:bg-[#B76E79]/20 border border-white/10 group-hover:border-[#B76E79]/40 text-[#E89CA7] flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 shadow-lg">
                      <Upload className={`w-6 h-6 transition-transform duration-300 ${isDragging ? 'animate-bounce text-[#00ff66]' : 'group-hover:-translate-y-1'}`} />
                    </div>

                    <p className="text-sm text-[#F5F1EA] font-medium group-hover:text-white transition-colors">
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

              {/* Uploading Progress Bar (Active when loading) */}
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

              {/* Explicit Privacy Notice */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-[#F5F1EA]/50 leading-normal">
                🔒 <strong className="text-[#F5F1EA]/70">Privacy Notice:</strong> Your message and optional photo may appear on Sowmiya's birthday website after admin approval.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#E89CA7] hover:opacity-95 text-white font-medium text-sm transition-all shadow-lg hover:shadow-[#B76E79]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
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
      <footer className="relative z-10 text-center text-xs text-[#F5F1EA]/40 mt-8 font-mono">
        Sowmiyaa's Birthday Celebration ❤️
      </footer>
    </div>
  );
}
