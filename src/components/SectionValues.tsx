import React from 'react';
import { Award, Compass, Shield, Sparkles } from 'lucide-react';
import { ValuesSection } from '../types';

interface SectionProps {
  content: ValuesSection;
}

export const SectionValues: React.FC<SectionProps> = ({ content }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Honour: <Award className="w-6 h-6 text-[#D5AA61]" />,
    Respect: <Compass className="w-6 h-6 text-[#85846A]" />,
    Integrity: <Shield className="w-6 h-6 text-[#B85F43]" />
  };

  return (
    <section id="values" className="py-24 bg-[#F6EBDD] relative overflow-hidden border-b border-[#ECE0D1]">
      
      {/* Decorative background watermark */}
      <div className="absolute top-10 right-10 text-[180px] font-serif font-black text-[#3B2923]/[0.03] select-none pointer-events-none leading-none">
        03
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#B85F43] mb-3">
            <Compass className="w-4 h-4 text-[#B85F43]" />
            <span>Section Three • Character & Principles</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#3B2923] tracking-tight leading-[1.15] uppercase">
            {content.heading}
          </h2>

          <p className="mt-4 text-xl font-serif italic text-[#3B2923]/80">
            “Because who you become matters just as much as what you achieve.”
          </p>

          <div className="w-20 h-1 bg-[#D5AA61] mt-6"></div>
        </div>

        {/* Narrative Reflections - Concise, warm, and meaningful */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14 text-[#3B2923]/90 text-lg leading-relaxed font-normal">
          <div className="space-y-4">
            {content.intro.slice(0, 2).map((text, idx) => (
              <p key={idx}>{text}</p>
            ))}
          </div>
          <div className="space-y-4">
            {content.intro.slice(2).map((text, idx) => (
              <p key={idx}>{text}</p>
            ))}
          </div>
        </div>

        {/* The Core Pillars: Honour, Respect, Integrity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {content.coreValues.map((val, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-[#ECE0D1] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#FBF6EF] border border-[#ECE0D1] flex items-center justify-center mb-6 group-hover:bg-[#3B2923] transition-colors">
                  {iconMap[val.title] || <Sparkles className="w-6 h-6 text-[#D5AA61]" />}
                </div>

                <span className="text-[11px] uppercase tracking-widest font-bold text-[#B85F43] block mb-1">
                  {val.tag}
                </span>

                <h3 className="font-serif text-2xl font-bold text-[#3B2923] mb-3">
                  {val.title}
                </h3>

                <p className="text-sm text-[#3B2923]/75 leading-relaxed">
                  {val.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#ECE0D1]/60 flex items-center justify-between text-xs text-[#85846A]">
                <span>A Pillar of Young</span>
                <span className="text-[#D5AA61]">★</span>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Thought */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#3B2923] text-white shadow-lg border border-[#D5AA61]/30 text-center max-w-3xl mx-auto">
          <p className="font-serif italic text-lg sm:text-xl text-[#F6EBDD] leading-relaxed">
            “{content.closing}”
          </p>
        </div>

      </div>
    </section>
  );
};
