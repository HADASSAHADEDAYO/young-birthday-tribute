import React from 'react';
import { PenTool, Edit3 } from 'lucide-react';
import { LetterSection } from '../types';

interface SectionProps {
  content: LetterSection;
  onOpenAdmin: () => void;
  onEditLetter?: () => void;
}

export const SectionPersonalLetter: React.FC<SectionProps> = ({ content, onOpenAdmin, onEditLetter }) => {
  return (
    <section id="letter" className="py-24 bg-[#F6EBDD] relative overflow-hidden border-b border-[#ECE0D1]">
      
      {/* Decorative watermark */}
      <div className="absolute top-10 right-10 text-[180px] font-serif font-black text-[#3B2923]/[0.03] select-none pointer-events-none leading-none">
        10
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#B85F43] mb-3">
            <PenTool className="w-4 h-4 text-[#B85F43]" />
            <span>Section Ten • A Personal Note</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#3B2923] tracking-tight leading-[1.15] uppercase">
            {content.heading}
          </h2>

          <div className="w-20 h-1 bg-[#D5AA61] mx-auto mt-6"></div>
        </div>

        {/* Letter Paper Container */}
        <div className="relative paper-texture p-8 sm:p-14 md:p-16 rounded-3xl shadow-xl border-2 border-[#ECE0D1] bg-[#FBF6EF] text-[#3B2923]">
          
          {/* Subtle wax seal stamp */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-14 h-14 rounded-full bg-[#B85F43] text-white flex items-center justify-center shadow-lg border-2 border-[#D5AA61]/50 select-none">
            <div className="text-center">
              <span className="font-serif font-bold text-xs block leading-none">YOUNG</span>
              <span className="text-[9px] tracking-wider uppercase block opacity-90">B-DAY</span>
            </div>
          </div>

          {/* Letter Meta Date */}
          {content.letterDate && (
            <p className="text-xs uppercase tracking-widest text-[#B85F43] font-semibold mb-6">
              {content.letterDate}
            </p>
          )}

          {/* Salutation */}
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B2923] mb-6">
            {content.salutation}
          </h3>

          {/* Opening Paragraph */}
          <p className="font-serif text-lg sm:text-xl text-[#3B2923] font-medium leading-relaxed mb-6 italic">
            {content.opening}
          </p>

          {/* Main Body */}
          <div className="text-base sm:text-lg text-[#3B2923]/90 leading-relaxed space-y-4 font-normal whitespace-pre-line mb-10">
            {content.body}
          </div>

          {/* Signoff & Signature */}
          <div className="pt-6 border-t border-[#ECE0D1] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#85846A] font-semibold mb-1">
                {content.closing}
              </p>
              <p className="font-handwriting text-3xl sm:text-4xl text-[#B85F43] font-bold">
                {content.signature}
              </p>
            </div>

            <button
              onClick={onEditLetter || onOpenAdmin}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#ECE0D1] hover:border-[#B85F43] text-xs font-bold uppercase tracking-wider text-[#3B2923] hover:text-[#B85F43] shadow-sm hover:shadow transition-all cursor-pointer self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#B85F43]" />
              <span>Edit Letter</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
