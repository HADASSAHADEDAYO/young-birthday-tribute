import React, { useState } from 'react';
import { Quote, MessageSquarePlus, Heart, Sparkles, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../types';

interface SectionProps {
  testimonials: Testimonial[];
  onOpenSubmitModal: () => void;
}

export const SectionTestimonials: React.FC<SectionProps> = ({
  testimonials,
  onOpenSubmitModal,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const guidedQuestions = [
    'What do you admire most about Young?',
    'What is your favourite memory with him?',
    'What makes him a good friend?',
    'What does his big-brother energy mean to you?',
    'What do you wish for his future?',
    'Why do you believe he has the potential to become a great coach?'
  ];

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="testimonials" className="py-24 bg-[#F6EBDD] relative overflow-hidden border-b border-[#ECE0D1]">
      
      {/* Decorative watermark */}
      <div className="absolute top-10 right-10 text-[180px] font-serif font-black text-[#3B2923]/[0.03] select-none pointer-events-none leading-none">
        07
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#85846A] mb-3">
              <Quote className="w-4 h-4 text-[#B85F43]" />
              <span>Section Seven • Voices of Appreciation</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#3B2923] tracking-tight leading-[1.15] uppercase">
              DON’T JUST TAKE OUR WORD FOR IT.
            </h2>

            <p className="mt-2 text-[#5C453D] text-sm sm:text-base font-normal max-w-2xl">
              Heartfelt words, reflections, and stories from the people whose lives Young has touched.
            </p>
          </div>

          <button
            onClick={onOpenSubmitModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Add Your Testimonial</span>
          </button>
        </div>

        {/* Guided Prompts Banner */}
        <div className="mb-12 p-6 rounded-3xl bg-[#FBF6EF] border border-[#ECE0D1]">
          <span className="text-xs uppercase tracking-widest text-[#B85F43] font-bold block mb-3">
            Inspiration for Contributors
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {guidedQuestions.map((q, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#3B2923]/80">
                <Sparkles className="w-3.5 h-3.5 text-[#D5AA61] shrink-0 mt-0.5" />
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Display */}
        {testimonials.length > 0 ? (
          <div>
            {/* Featured Carousel if more than 1 */}
            {testimonials.length >= 2 && (
              <div className="mb-12 relative p-8 sm:p-12 rounded-3xl bg-[#3B2923] text-white shadow-xl overflow-hidden">
                <Quote className="w-16 h-16 text-[#D5AA61]/20 absolute top-6 right-6" />
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                  <span className="text-xs uppercase tracking-widest text-[#D5AA61] font-bold block mb-4">
                    Featured Reflection
                  </span>

                  <blockquote className="font-serif italic text-xl sm:text-2xl text-[#F6EBDD] leading-relaxed mb-6">
                    “{testimonials[carouselIndex].message}”
                  </blockquote>

                  <div className="flex items-center justify-center gap-3">
                    {testimonials[carouselIndex].photoUrl ? (
                      <img
                        src={testimonials[carouselIndex].photoUrl}
                        alt={testimonials[carouselIndex].name}
                        className="w-10 h-10 rounded-full object-cover border border-[#D5AA61]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-[#D5AA61]">
                        {testimonials[carouselIndex].name.charAt(0)}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-bold text-sm text-white">{testimonials[carouselIndex].name}</p>
                      {testimonials[carouselIndex].relationship && (
                        <p className="text-xs text-[#D8A092]">{testimonials[carouselIndex].relationship}</p>
                      )}
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-[#D5AA61]">
                      {carouselIndex + 1} of {testimonials.length}
                    </span>
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of all testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((test) => (
                <div
                  key={test.id}
                  className="p-6 rounded-3xl bg-white border border-[#ECE0D1] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <Quote className="w-8 h-8 text-[#D5AA61] mb-3 opacity-60" />
                    <p className="font-serif text-base text-[#3B2923] leading-relaxed mb-6">
                      “{test.message}”
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#ECE0D1] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {test.photoUrl ? (
                        <img
                          src={test.photoUrl}
                          alt={test.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#ECE0D1]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#FBF6EF] border border-[#ECE0D1] flex items-center justify-center text-xs font-bold text-[#3B2923]">
                          {test.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-[#3B2923]">{test.name}</p>
                        {test.relationship && (
                          <p className="text-[11px] text-[#85846A]">{test.relationship}</p>
                        )}
                      </div>
                    </div>
                    {test.date && (
                      <span className="text-[10px] text-stone-400">{test.date}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="p-12 text-center rounded-3xl bg-white border border-[#ECE0D1] max-w-xl mx-auto shadow-sm">
            <Quote className="w-12 h-12 text-[#D5AA61] mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#3B2923] mb-2 uppercase">
              Be The First To Share
            </h3>
            <p className="text-[#5C453D] text-sm mb-6 leading-relaxed">
              Every friend has a story with Young. Share what you admire most or what his friendship means to you!
            </p>
            <button
              onClick={onOpenSubmitModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#D5AA61]" />
              <span>Write a Testimonial</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
