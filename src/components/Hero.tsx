import React from 'react';
import { Sparkles, ArrowDown, Camera, Heart, Star, Compass } from 'lucide-react';
import { HeroSection } from '../types';

interface HeroProps {
  content: HeroSection;
  onEnter: () => void;
  onOpenAdmin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ content, onEnter, onOpenAdmin }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#F6EBDD] via-[#FBF6EF] to-[#F6EBDD] pt-8 pb-20 border-b border-[#ECE0D1]">
      
      {/* Decorative warm ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#D5AA61]/15 via-[#B85F43]/10 to-[#85846A]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-12 left-10 w-28 h-28 rounded-full border border-[#D5AA61]/25 pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-44 h-44 rounded-full border border-[#B85F43]/20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#D5AA61]/40 shadow-sm mb-6 backdrop-blur-sm animate-in fade-in duration-700">
          <Sparkles className="w-3.5 h-3.5 text-[#B85F43]" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#3B2923]">
            {content.eyebrow}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#D5AA61]" />
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#3B2923] mb-4 uppercase drop-shadow-sm">
          {content.title}
        </h1>

        {/* Subtitle */}
        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#B85F43] font-semibold max-w-3xl mx-auto mb-6">
          “{content.subtitle}”
        </p>

        {/* Portrait / Photo Feature */}
        <div className="relative max-w-md mx-auto my-8 group">
          <div className="relative p-2 sm:p-3 bg-white rounded-3xl shadow-xl border-2 border-[#ECE0D1] transition-transform duration-500 group-hover:scale-[1.01]">
            
            {content.heroImage ? (
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FBF6EF]">
                <img
                  src={content.heroImage}
                  alt="Paul Olayemi (Young)"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D5AA61] block">
                    Birthday Edition
                  </span>
                  <p className="text-lg font-serif font-bold">Paul Olayemi</p>
                </div>
              </div>
            ) : (
              /* Editorial Placeholder Card when custom photo is not yet uploaded */
              <div className="relative aspect-[4/5] rounded-2xl bg-gradient-to-b from-[#3B2923] via-[#2A1D19] to-[#3B2923] flex flex-col items-center justify-center p-6 text-white border border-[#D5AA61]/30">
                <div className="w-24 h-24 rounded-full bg-[#B85F43]/20 border-2 border-[#D5AA61] flex items-center justify-center text-3xl font-serif font-bold text-[#D5AA61] mb-4 shadow-inner">
                  PO
                </div>
                <h3 className="font-serif text-2xl font-bold tracking-wide uppercase text-white mb-1">
                  Paul Olayemi
                </h3>
                <p className="text-xs uppercase tracking-widest text-[#D5AA61] font-semibold mb-4">
                  The Man • The Brother • The Future Coach
                </p>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-stone-200 text-xs mb-6 border border-white/10">
                  <Star className="w-3.5 h-3.5 text-[#D5AA61] fill-current" />
                  <span>One of one. Never two.</span>
                </div>

                {/* Direct quick action for organizer to replace photo */}
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-semibold shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Young's Photograph</span>
                </button>
                <p className="text-[11px] text-stone-300 mt-2">
                  (Or edit anytime via Admin)
                </p>
              </div>
            )}

            {/* Corner floating badge */}
            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-[#3B2923] text-[#D5AA61] px-4 py-2 rounded-2xl shadow-xl border border-[#D5AA61]/40 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#B85F43]" />
              <span>{content.badgeText}</span>
            </div>

            {/* Top gold accent seal */}
            <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-[#D5AA61] text-[#3B2923] w-10 h-10 rounded-full shadow-lg flex items-center justify-center font-bold text-xs border-2 border-white">
              ★
            </div>
          </div>
        </div>

        {/* Supporting Message */}
        <p className="text-base sm:text-lg md:text-xl text-[#3B2923]/90 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          {content.supportingMessage}
        </p>

        {/* Enter Celebration Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full font-serif text-base sm:text-lg font-bold tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-98 border border-[#D5AA61]/40 cursor-pointer"
          >
            <span className="text-[#D5AA61]">✦</span>
            <span>{content.buttonText}</span>
            <ArrowDown className="w-4 h-4 text-[#D5AA61] group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Small detail info */}
        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-[#3B2923]/60 tracking-wider uppercase font-medium">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#B85F43] fill-current" />
            Curated with love
          </span>
          <span>•</span>
          <span>A Living Digital Tribute</span>
          <span>•</span>
          <span>Celebration Edition</span>
        </div>

      </div>
    </section>
  );
};
