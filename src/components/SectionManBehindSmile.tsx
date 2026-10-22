import React from 'react';
import { Sparkles, Sun, Smile, Heart, Camera } from 'lucide-react';
import { StorySection } from '../types';

interface SectionProps {
  content: StorySection;
  onOpenAdmin: () => void;
}

export const SectionManBehindSmile: React.FC<SectionProps> = ({ content, onOpenAdmin }) => {
  return (
    <section id="the-story" className="py-24 bg-[#F6EBDD] relative overflow-hidden border-b border-[#ECE0D1]">
      
      {/* Decorative background numbers */}
      <div className="absolute top-10 right-10 text-[180px] font-serif font-black text-[#3B2923]/[0.03] select-none pointer-events-none leading-none">
        01
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#B85F43] mb-3">
            <Sun className="w-4 h-4 text-[#B85F43]" />
            <span>Section One • Personality & Presence</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#3B2923] tracking-tight leading-[1.15] uppercase">
            {content.heading}
          </h2>

          <div className="w-20 h-1 bg-[#D5AA61] mt-6 mb-2"></div>
        </div>

        {/* Editorial Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Storytelling text */}
          <div className="lg:col-span-7 space-y-6 text-[#3B2923]/90 text-lg leading-relaxed font-normal">
            
            {/* Lead paragraph */}
            {content.paragraphs[0] && (
              <p className="text-xl sm:text-2xl font-serif text-[#3B2923] leading-relaxed font-medium">
                {content.paragraphs[0]}
              </p>
            )}

            {/* Remaining paragraphs */}
            {content.paragraphs.slice(1).map((p, idx) => (
              <p key={idx} className="text-base sm:text-lg leading-relaxed text-[#3B2923]/85">
                {p}
              </p>
            ))}

            {/* Editorial Highlight Quote Card */}
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#FBF6EF] border-l-4 border-[#B85F43] shadow-sm relative">
              <Sparkles className="w-6 h-6 text-[#D5AA61] mb-2" />
              <blockquote className="font-serif text-xl sm:text-2xl italic text-[#3B2923] leading-snug">
                “Young is not just someone you have fun with. He is someone you feel you have in your corner.”
              </blockquote>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wider text-[#B85F43] font-bold">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>The Young Experience</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Visual Collage */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Feature Frame */}
            <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-xl border border-[#ECE0D1] group">
              {content.image ? (
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FBF6EF]">
                  <img
                    src={content.image}
                    alt="Young smiling"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 right-4 text-xs font-medium text-white/95">
                    {content.caption || 'Laughter follows wherever he goes.'}
                  </p>
                </div>
              ) : (
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#3B2923] to-[#2A1D19] p-8 flex flex-col justify-between text-white border border-[#D5AA61]/30">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider text-[#D5AA61]">
                      EDITORIAL ESSAY
                    </span>
                    <Smile className="w-6 h-6 text-[#D5AA61]" />
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-widest text-[#D5AA61] block font-bold">
                      ENERGY & LAUGHTER
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                      “Lively, vibrant, and almost impossible not to catch his happiness.”
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                    <button
                      onClick={onOpenAdmin}
                      className="inline-flex items-center gap-1.5 text-xs text-[#D5AA61] hover:text-white underline cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Attach Photo to Story</span>
                    </button>
                    <span className="text-[11px] text-stone-300">Section 01</span>
                  </div>
                </div>
              )}

              {/* Decorative mini badge */}
              <div className="absolute top-6 right-6 bg-[#B85F43] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                Vibrant Spirit
              </div>
            </div>

            {/* Trait Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#3B2923] text-white">
                <span className="text-2xl font-serif font-bold text-[#D5AA61] block mb-1">100%</span>
                <span className="text-xs uppercase tracking-wider text-[#F6EBDD] font-semibold block">
                  Positive Energy
                </span>
                <p className="text-xs text-stone-300 mt-2">
                  Turns ordinary gatherings into core memories.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FBF6EF] border border-[#ECE0D1] text-[#3B2923]">
                <span className="text-2xl font-serif font-bold text-[#B85F43] block mb-1">True</span>
                <span className="text-xs uppercase tracking-wider text-[#3B2923] font-semibold block">
                  In Your Corner
                </span>
                <p className="text-xs text-[#5C453D] mt-2">
                  Laughter when you want it, presence when you need it.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
