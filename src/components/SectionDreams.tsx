import React from 'react';
import { Sparkles, Star, Heart } from 'lucide-react';
import { DreamsSection } from '../types';

interface SectionProps {
  content: DreamsSection;
}

export const SectionDreams: React.FC<SectionProps> = ({ content }) => {
  return (
    <section className="py-28 bg-[#F6EBDD] relative overflow-hidden border-b border-[#ECE0D1]">
      
      {/* Decorative background watermark */}
      <div className="absolute top-10 right-10 text-[180px] font-serif font-black text-[#3B2923]/[0.03] select-none pointer-events-none leading-none">
        05
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#D5AA61] mb-4">
          <Star className="w-4 h-4 text-[#D5AA61] fill-current" />
          <span>Section Five • Future & Vision</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#3B2923] tracking-tight leading-[1.15] uppercase max-w-4xl mx-auto">
          {content.heading}
        </h2>

        <div className="w-24 h-1 bg-[#D5AA61] mx-auto mt-6 mb-12"></div>

        {/* Lead Reflection */}
        <p className="font-serif italic text-2xl sm:text-3xl text-[#B85F43] font-semibold max-w-2xl mx-auto mb-14 leading-relaxed">
          “Young, your story is still being written, and the best part is that you hold the pen.”
        </p>

        {/* Story Paragraphs */}
        <div className="max-w-3xl mx-auto mb-12 text-[#3B2923]/90 text-lg leading-relaxed text-left space-y-4">
          {content.paragraphs.slice(1).map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Blessings Editorial Stack */}
        <div className="space-y-4 text-left max-w-3xl mx-auto mb-16">
          {content.blessings.map((blessing, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ECE0D1] shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#FBF6EF] border border-[#D5AA61]/50 flex items-center justify-center shrink-0 group-hover:bg-[#3B2923] transition-colors">
                <Sparkles className="w-4 h-4 text-[#D5AA61]" />
              </div>
              <p className="text-base sm:text-lg text-[#3B2923]/90 leading-relaxed font-serif">
                {blessing}
              </p>
            </div>
          ))}
        </div>

        {/* Closing Affirmation Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#3B2923] text-white shadow-xl border border-[#D5AA61]/40 max-w-3xl mx-auto text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D5AA61]/15 rounded-full blur-2xl pointer-events-none" />
          
          <p className="font-serif text-xl sm:text-2xl font-bold leading-relaxed text-[#F6EBDD] relative z-10">
            “Here’s to the coach you are working towards becoming, the brother your friends know and love, and the man whose next chapters are still waiting to be written.”
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#D5AA61] font-bold">
            <Heart className="w-4 h-4 fill-current text-[#B85F43]" />
            <span>Always In Your Corner</span>
          </div>
        </div>

      </div>
    </section>
  );
};
