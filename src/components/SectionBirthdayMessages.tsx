import React from 'react';
import { Heart, MessageCircle, Star, Video } from 'lucide-react';
import { BirthdayMessage } from '../types';

interface SectionProps {
  messages: BirthdayMessage[];
  onOpenLeaveMessageModal: () => void;
}

export const SectionBirthdayMessages: React.FC<SectionProps> = ({
  messages,
  onOpenLeaveMessageModal,
}) => {
  return (
    <section id="wishes" className="py-24 bg-[#FBF6EF] relative overflow-hidden border-b border-[#ECE0D1]">
      
      {/* Decorative watermark */}
      <div className="absolute top-10 left-10 text-[180px] font-serif font-black text-[#3B2923]/[0.03] select-none pointer-events-none leading-none">
        08
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#B85F43] mb-3">
              <Heart className="w-4 h-4 text-[#B85F43] fill-current" />
              <span>Section Eight • The Birthday Wall</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#3B2923] tracking-tight leading-[1.15] uppercase">
              A LITTLE LOVE FOR THE BIRTHDAY BOY.
            </h2>

            <p className="mt-2 text-[#5C453D] text-sm sm:text-base font-normal max-w-2xl">
              Shower Paul with birthday blessings, jokes, prayers, and celebratory cheer.
            </p>
          </div>

          <button
            onClick={onOpenLeaveMessageModal}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>LEAVE YOUNG A MESSAGE</span>
          </button>
        </div>

        {/* Messages Wall */}
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-6 rounded-3xl bg-white border border-[#ECE0D1] shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative flex flex-col justify-between group"
              >
                {/* Note Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#ECE0D1] mb-4">
                  <div className="flex items-center gap-3">
                    {msg.photoUrl ? (
                      <img
                        src={msg.photoUrl}
                        alt={msg.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#D5AA61]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#3B2923] text-[#D5AA61] flex items-center justify-center font-bold text-xs">
                        {msg.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-[#3B2923]">{msg.name}</h4>
                      {msg.relationship && (
                        <span className="text-[11px] text-[#B85F43] font-medium block">
                          {msg.relationship}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                    {msg.date}
                  </span>
                </div>

                {/* Message Text */}
                <p className="text-[#3B2923] text-sm sm:text-base leading-relaxed mb-6 font-normal whitespace-pre-line">
                  {msg.message}
                </p>

                {/* Optional Media Preview if user attached video greeting */}
                {msg.videoUrl && (
                  <div className="mb-4 p-2 bg-[#FBF6EF] rounded-xl border border-[#ECE0D1] flex items-center gap-2 text-xs text-[#5C453D]">
                    <Video className="w-4 h-4 text-[#85846A]" />
                    <span className="truncate">Attached Video Greeting</span>
                  </div>
                )}

                {/* Footer seal */}
                <div className="pt-3 border-t border-[#FBF6EF] flex items-center justify-between text-xs text-[#D5AA61]">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[10px] uppercase tracking-wider text-[#85846A] font-semibold">Birthday Wish</span>
                  </span>
                  <Heart className="w-3.5 h-3.5 text-[#B85F43] fill-current" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Wall Prompt */
          <div className="p-12 text-center rounded-3xl bg-white border border-[#ECE0D1] max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FBF6EF] text-[#B85F43] flex items-center justify-center mx-auto mb-4 border border-[#ECE0D1]">
              <MessageCircle className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#3B2923] mb-2 uppercase">
              The Wall Awaits Your Blessings
            </h3>

            <p className="text-[#5C453D] text-sm mb-6 leading-relaxed">
              Be among the very first friends to post a birthday wish for Young! Send your message, prayer, or favorite memory.
            </p>

            <button
              onClick={onOpenLeaveMessageModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>LEAVE YOUNG A MESSAGE</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
