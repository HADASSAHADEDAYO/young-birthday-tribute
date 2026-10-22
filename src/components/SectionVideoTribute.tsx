import React, { useState } from 'react';
import { Play, Film, Upload } from 'lucide-react';
import { VideoTributeSection } from '../types';

interface SectionProps {
  content: VideoTributeSection;
  onOpenAdmin: () => void;
}

export const SectionVideoTribute: React.FC<SectionProps> = ({ content, onOpenAdmin }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartPlay = () => {
    setIsPlaying(true);
    // Broadcast event so background music pauses automatically without interruption
    window.dispatchEvent(new CustomEvent('tribute-video-playing'));
  };

  // Helper to parse video embed vs direct video file
  const isEmbed = content.videoUrl && (
    content.videoUrl.includes('youtube.com') ||
    content.videoUrl.includes('youtu.be') ||
    content.videoUrl.includes('vimeo.com')
  );

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <section id="video-tribute" className="py-24 bg-[#3B2923] text-white relative overflow-hidden border-b border-[#D5AA61]/25">
      
      {/* Cinematic ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-gradient-to-r from-[#D5AA61]/15 via-[#B85F43]/15 to-[#85846A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#D5AA61] mb-3">
            <Film className="w-4 h-4 text-[#D5AA61]" />
            <span>Section Nine • The Motion Documentary</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.15] uppercase">
            {content.heading}
          </h2>

          <p className="mt-4 text-[#F6EBDD]/90 text-base sm:text-lg max-w-xl mx-auto font-normal">
            {content.subheading}
          </p>

          <div className="w-20 h-1 bg-[#D5AA61] mx-auto mt-6"></div>
        </div>

        {/* Cinematic Player Window */}
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black/70 backdrop-blur-xl group">
          
          {content.videoUrl ? (
            isPlaying ? (
              <div className="relative aspect-video w-full bg-black">
                {isEmbed ? (
                  <iframe
                    src={getEmbedUrl(content.videoUrl)}
                    title="Paul Olayemi Video Tribute"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={content.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ) : (
              /* Video Poster with Prominent Play Button */
              <div className="relative aspect-video w-full bg-stone-900 flex items-center justify-center overflow-hidden">
                {content.thumbnailUrl ? (
                  <img
                    src={content.thumbnailUrl}
                    alt={content.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2A1D19] via-[#3B2923] to-[#2A1D19] flex items-center justify-center" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Big Center Play Button */}
                <button
                  onClick={handleStartPlay}
                  className="relative z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#B85F43] hover:bg-[#9E4D34] text-white flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 border-4 border-white/20 cursor-pointer"
                  aria-label="Play Video Tribute"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                </button>

                {/* Video Title bar */}
                <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#D5AA61] block mb-1">
                      Birthday Premiere
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      {content.title}
                    </h3>
                    {content.description && (
                      <p className="text-xs text-stone-300 mt-1 max-w-lg">
                        {content.description}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-stone-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 shrink-0">
                    High Definition • Stereo
                  </span>
                </div>
              </div>
            )
          ) : (
            /* Elegant Placeholder when video is not added yet */
            <div className="aspect-video w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-gradient-to-br from-[#2A1D19] via-[#3B2923] to-[#2A1D19]">
              <div className="w-16 h-16 rounded-full bg-[#B85F43]/20 border border-[#D5AA61] flex items-center justify-center mb-4 text-[#D5AA61]">
                <Film className="w-8 h-8" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-white mb-2 uppercase">
                {content.title}
              </h3>

              <p className="text-[#F6EBDD]/85 text-sm max-w-lg mb-6 leading-relaxed">
                {content.description || 'Feature a special video montage, reels, or video greetings from friends and family.'}
              </p>

              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D5AA61] hover:bg-[#C2964C] text-[#2A1D19] rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload or Link Video Tribute</span>
              </button>

              <p className="text-[11px] text-stone-300 mt-3">
                Supports MP4 video files, YouTube links, and Vimeo links
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
