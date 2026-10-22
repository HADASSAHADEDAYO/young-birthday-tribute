import React from 'react';
import { ShieldCheck, HeartHandshake, CheckCircle2, Camera } from 'lucide-react';
import { StorySection } from '../types';

interface SectionProps {
  content: StorySection;
  onOpenAdmin: () => void;
}

export const SectionBigBrother: React.FC<SectionProps> = ({ content, onOpenAdmin }) => {
  return (
    <section id="brotherhood" className="py-24 bg-[#FBF6EF] relative overflow-hidden border-b border-[#ECE0D1]">
      
      {/* Decorative background watermark */}
      <div className="absolute top-10 left-10 text-[180px] font-serif font-black text-[#3B2923]/[0.03] select-none pointer-events-none leading-none">
        02
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#85846A] mb-3">
            <ShieldCheck className="w-4 h-4 text-[#B85F43]" />
            <span>Section Two • Brotherhood & Loyalty</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#3B2923] tracking-tight leading-[1.15] uppercase">
            {content.heading}
          </h2>

          <p className="mt-4 font-serif italic text-lg sm:text-xl text-[#B85F43] font-semibold">
            “A friend by choice. A brother by heart. A protector by nature.”
          </p>

          <div className="w-24 h-1 bg-[#D5AA61] mx-auto mt-6"></div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Photo & Highlight Card */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-xl border border-[#ECE0D1] group">
              {content.image ? (
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F6EBDD]">
                  <img
                    src={content.image}
                    alt="Young with friends"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 right-4 text-xs font-medium text-white/95">
                    {content.caption || 'Standing beside the people he calls family.'}
                  </p>
                </div>
              ) : (
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-b from-[#3B2923] via-[#2A1D19] to-[#3B2923] p-8 flex flex-col justify-between text-white border border-[#D5AA61]/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-[#D5AA61] font-bold px-3 py-1 rounded-full bg-white/10">
                      THE BIG BROTHER PILLAR
                    </span>
                    <HeartHandshake className="w-6 h-6 text-[#D5AA61]" />
                  </div>

                  <div className="space-y-4 my-auto py-6">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-snug text-white">
                      “He would rather correct you honestly than watch you continue doing something foolish just to keep the peace.”
                    </h3>
                    <p className="text-sm text-stone-300">
                      The rare, invaluable gift of truth wrapped in protective loyalty.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                    <button
                      onClick={onOpenAdmin}
                      className="inline-flex items-center gap-1.5 text-xs text-[#D5AA61] hover:text-white underline cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Attach Brotherhood Photo</span>
                    </button>
                    <span className="text-[11px] text-stone-400">Section 02</span>
                  </div>
                </div>
              )}
            </div>

            {/* Loyalty Pillars */}
            <div className="p-6 rounded-3xl bg-[#3B2923] text-white space-y-3 shadow-lg">
              <span className="text-xs uppercase tracking-widest text-[#D5AA61] font-bold block">
                Brotherhood Code
              </span>
              <ul className="space-y-2 text-sm text-[#F6EBDD]/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D5AA61] shrink-0" />
                  <span>Shows up when it counts — not just when convenient</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D5AA61] shrink-0" />
                  <span>Cares enough to tell you the raw, loving truth</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D5AA61] shrink-0" />
                  <span>Protective backbone for every friend in his circle</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-7 space-y-5 text-[#3B2923]/90 order-1 lg:order-2">
            
            {content.paragraphs.map((p, idx) => {
              // Highlight the paragraph about honesty
              if (idx === 4) {
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-white border-l-4 border-[#B85F43] my-4 shadow-sm">
                    <p className="text-lg font-serif font-bold text-[#3B2923] leading-snug">
                      {p}
                    </p>
                  </div>
                );
              }

              return (
                <p key={idx} className="text-base sm:text-lg leading-relaxed text-[#3B2923]/85">
                  {p}
                </p>
              );
            })}

            {/* Closing Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-white border border-[#ECE0D1] text-xs font-bold uppercase tracking-wider text-[#3B2923] shadow-sm">
                Protector
              </span>
              <span className="px-4 py-2 rounded-full bg-white border border-[#ECE0D1] text-xs font-bold uppercase tracking-wider text-[#3B2923] shadow-sm">
                Truth-Teller
              </span>
              <span className="px-4 py-2 rounded-full bg-white border border-[#ECE0D1] text-xs font-bold uppercase tracking-wider text-[#3B2923] shadow-sm">
                Loyal Brother
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
