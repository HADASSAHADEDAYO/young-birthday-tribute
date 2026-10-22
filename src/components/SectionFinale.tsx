import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Star, Camera } from 'lucide-react';
import { FinaleSection } from '../types';

interface SectionProps {
  content: FinaleSection;
  onOpenAdmin: () => void;
}

export const SectionFinale: React.FC<SectionProps> = ({ content, onOpenAdmin }) => {
  const triggerConfetti = () => {
    // Elegant, warm earthy celebratory confetti in gold, terracotta, olive and rose
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#D5AA61', '#B85F43', '#85846A', '#D8A092', '#F6EBDD', '#FFFFFF']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  return (
    <section className="py-28 bg-gradient-to-b from-[#F6EBDD] via-[#F4E4D3] to-[#3B2923] relative overflow-hidden text-center">
      
      {/* Decorative ambient glows in terracotta and gold */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#D5AA61]/15 via-[#B85F43]/15 to-[#85846A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Tagline */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 border border-[#D5AA61]/50 shadow-sm mb-6">
          <Sparkles className="w-4 h-4 text-[#B85F43]" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#3B2923]">
            {content.tagline}
          </span>
          <Sparkles className="w-4 h-4 text-[#D5AA61]" />
        </div>

        {/* Main Title */}
        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black text-[#3B2923] uppercase tracking-tight mb-6">
          {content.title}
        </h2>

        {/* Primary Message */}
        <p className="font-serif italic text-xl sm:text-3xl text-[#B85F43] font-semibold max-w-2xl mx-auto mb-10 leading-snug">
          “{content.messagePrimary}”
        </p>

        {/* Closing Portrait */}
        <div className="relative max-w-sm mx-auto my-10 group">
          <div className="p-3 bg-white rounded-3xl shadow-2xl border-2 border-[#D5AA61]/50 transition-transform duration-500 group-hover:scale-105">
            {content.image ? (
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F6EBDD]">
                <img
                  src={content.image}
                  alt="Young finale portrait"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/5] rounded-2xl bg-[#3B2923] flex flex-col items-center justify-center p-6 text-[#F6EBDD] border border-[#D5AA61]/40">
                <div className="w-20 h-20 rounded-full bg-white/10 border border-[#D5AA61] flex items-center justify-center text-2xl font-serif font-bold text-[#D5AA61] mb-3">
                  PO
                </div>
                <h4 className="font-serif text-xl font-bold text-white">Paul Olayemi</h4>
                <p className="text-xs text-[#D5AA61] uppercase tracking-widest mt-1">One Of One</p>

                <button
                  onClick={onOpenAdmin}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs text-[#F6EBDD]/80 hover:text-white underline cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#D5AA61]" />
                  <span>Attach Finale Portrait</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Story Message */}
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-sm border border-[#ECE0D1] shadow-md mb-10 text-[#3B2923]/90 text-base sm:text-lg leading-relaxed font-normal">
          {content.messageSecondary}
        </div>

        {/* Celebrate Young Confetti Button */}
        <div className="mb-14">
          <button
            onClick={triggerConfetti}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full font-serif text-lg sm:text-xl font-bold tracking-wider uppercase shadow-2xl hover:shadow-[0_20px_50px_rgba(184,95,67,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-[#D5AA61] cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[#D5AA61] animate-spin" />
            <span>{content.buttonText}</span>
            <span className="text-[#D5AA61]">🎉</span>
          </button>
          <p className="text-xs text-[#F6EBDD]/80 mt-2 font-medium">
            (Click to release celebratory fireworks)
          </p>
        </div>

        {/* Footer Credit & Signature */}
        <div className="pt-12 border-t border-[#D5AA61]/30 text-[#F6EBDD]">
          <div className="flex items-center justify-center gap-2 mb-2 text-[#D5AA61]">
            <Heart className="w-4 h-4 fill-current text-[#B85F43]" />
            <Star className="w-4 h-4 fill-current" />
            <Heart className="w-4 h-4 fill-current text-[#B85F43]" />
          </div>

          <p className="font-serif italic text-lg sm:text-xl text-[#F6EBDD]">
            {content.footerCredit}
          </p>

          <p className="text-xs uppercase tracking-[0.2em] text-[#D8A092] mt-3">
            Paul Olayemi • Happy Birthday Tribute • All Rights Reserved
          </p>
        </div>

      </div>
    </section>
  );
};
