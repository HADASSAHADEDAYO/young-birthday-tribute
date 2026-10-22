import React, { useState, useRef } from 'react';
import { Target, TrendingUp, Zap, Camera, Upload, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { CoachSection } from '../types';
import { api } from '../services/api';

interface SectionProps {
  content: CoachSection;
  onOpenAdmin: () => void;
  onImageUpdated?: (newUrl: string) => void;
}

export const SectionCoach: React.FC<SectionProps> = ({ content, onOpenAdmin, onImageUpdated }) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const displayImage = localPreview || content.image;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Validate size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('The selected image is too large. Please select a photo under 20MB.');
      return;
    }

    // Set immediate preview
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const res = await api.uploadSectionImage('coach', file);
      if (res.success && res.url) {
        setUploadSuccess(true);
        if (onImageUpdated) {
          onImageUpdated(res.url);
        }
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        throw new Error(res.error || 'Server could not save image.');
      }
    } catch (err: any) {
      console.error('Coach portrait upload failed:', err);
      setUploadError(err.message || 'Upload failed. Please check connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <section id="coach" className="py-24 bg-[#FBF6EF] relative overflow-hidden border-b border-[#ECE0D1]">
      
      {/* Decorative watermark */}
      <div className="absolute top-10 left-10 text-[180px] font-serif font-black text-[#3B2923]/[0.03] select-none pointer-events-none leading-none">
        04
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#85846A] mb-3">
            <Target className="w-4 h-4 text-[#B85F43]" />
            <span>Section Four • Calling & Vision</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#3B2923] tracking-tight leading-[1.15]">
            {content.heading}
          </h2>

          <div className="w-20 h-1 bg-[#B85F43] mt-6"></div>
        </div>

        {/* Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-5 text-[#3B2923]/90 text-lg leading-relaxed font-normal">
            {content.paragraphs.map((p, idx) => {
              if (idx === 0) {
                return (
                  <p key={idx} className="text-xl sm:text-2xl font-serif text-[#3B2923] leading-snug font-medium">
                    {p}
                  </p>
                );
              }
              if (idx === 3) {
                return (
                  <p key={idx} className="font-serif italic text-lg text-[#B85F43] font-semibold">
                    {p}
                  </p>
                );
              }
              return (
                <p key={idx} className="text-base sm:text-lg leading-relaxed text-[#3B2923]/85">
                  {p}
                </p>
              );
            })}

            {/* Closing Affirmation Card */}
            {content.closing && (
              <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white border-l-4 border-[#B85F43] shadow-sm">
                <p className="font-serif italic text-xl font-bold text-[#B85F43] leading-relaxed">
                  “{content.closing}”
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Visual Portrait & Coaching Foundation */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Coach Portrait Frame with Direct Working Upload */}
            <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-xl border border-[#ECE0D1] group">
              
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="coach-portrait-upload"
              />

              {displayImage ? (
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F6EBDD]">
                  <img
                    src={displayImage}
                    alt="Young future coach"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <p className="text-xs font-medium text-white/95">
                      Turning potential into meaningful impact.
                    </p>
                    <button
                      type="button"
                      onClick={triggerSelect}
                      className="px-3 py-1.5 bg-black/60 hover:bg-black text-white rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm cursor-pointer"
                      title="Replace Coach Portrait"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-[#3B2923] via-[#2A1D19] to-[#3B2923] p-8 flex flex-col justify-between text-white border border-[#D5AA61]/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-[#D5AA61] font-bold px-3 py-1 rounded-full bg-white/10">
                      THE COACH’S HEART
                    </span>
                    <TrendingUp className="w-6 h-6 text-[#D5AA61]" />
                  </div>

                  <div className="space-y-4 my-auto py-4">
                    <span className="text-xs uppercase tracking-widest text-[#D5AA61] block font-bold">
                      THE CALLING
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                      “Helping others recognise their potential and supporting them as they become better versions of themselves.”
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={triggerSelect}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Coach Portrait</span>
                    </button>
                    <span className="text-[11px] text-stone-300">Section 04</span>
                  </div>
                </div>
              )}

              {/* Upload Status / Feedback */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center rounded-3xl text-white flex-col gap-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-[#D5AA61]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Saving Portrait...</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="absolute top-6 left-6 right-6 p-2.5 bg-emerald-700/90 text-white rounded-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-sm animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Coach portrait saved persistently!</span>
                </div>
              )}

              {uploadError && (
                <div className="absolute top-6 left-6 right-6 p-2.5 bg-red-700/90 text-white rounded-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-sm animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-200" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Inherent Qualities Box */}
            <div className="p-6 rounded-3xl bg-white border border-[#ECE0D1] shadow-sm space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#B85F43] font-bold block">
                Natural Foundations For Coaching
              </span>
              <div className="grid grid-cols-2 gap-3">
                {(content.qualities || [
                  'Heart for People',
                  'Honesty & Truth',
                  'Presence & Energy',
                  'Big-Brother Loyalty'
                ]).map((q, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FBF6EF] border border-[#ECE0D1] text-xs font-semibold text-[#3B2923] flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#D5AA61] shrink-0" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
