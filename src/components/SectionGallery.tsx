import React, { useState, useMemo } from 'react';
import { Camera, Layers, Grid, Sparkles, X, ChevronLeft, ChevronRight, Eye, Play, Plus } from 'lucide-react';
import { Album, GalleryItem } from '../types';

interface SectionProps {
  albums: Album[];
  galleryItems: GalleryItem[];
  onOpenAdmin: () => void;
}

export const SectionGallery: React.FC<SectionProps> = ({
  albums,
  galleryItems,
  onOpenAdmin,
}) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry' | 'polaroid' | 'collage'>('masonry');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Filter items (only non-hidden)
  const filteredItems = useMemo(() => {
    let items = galleryItems.filter(item => !item.hidden);
    if (selectedAlbumId !== 'all') {
      items = items.filter(item => item.albumId === selectedAlbumId);
    }
    return items.sort((a, b) => a.order - b.order);
  }, [galleryItems, selectedAlbumId]);

  const activeLightboxItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null && activeLightboxIndex > 0) {
      setActiveLightboxIndex(activeLightboxIndex - 1);
    } else if (filteredItems.length > 0) {
      setActiveLightboxIndex(filteredItems.length - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null && activeLightboxIndex < filteredItems.length - 1) {
      setActiveLightboxIndex(activeLightboxIndex + 1);
    } else if (filteredItems.length > 0) {
      setActiveLightboxIndex(0);
    }
  };

  return (
    <section id="memories" className="py-24 bg-[#FBF6EF] relative overflow-hidden border-b border-[#ECE0D1]">
      
      {/* Decorative watermark */}
      <div className="absolute top-10 left-10 text-[180px] font-serif font-black text-[#3B2923]/[0.03] select-none pointer-events-none leading-none">
        06
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#B85F43] mb-3">
              <Camera className="w-4 h-4 text-[#B85F43]" />
              <span>Section Six • Living Digital Archive</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#3B2923] tracking-tight leading-[1.15] uppercase">
              LITTLE MOMENTS. LIFETIME MEMORIES.
            </h2>

            <p className="mt-2 text-[#5C453D] text-sm sm:text-base font-normal">
              A curated tapestry of laughs, brotherhood, and milestones.
            </p>
          </div>

          {/* Quick upload CTA for curator */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D5AA61]" />
              <span>Manage & Upload Photos</span>
            </button>
          </div>
        </div>

        {/* Album filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedAlbumId('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedAlbumId === 'all'
                ? 'bg-[#B85F43] text-white shadow-sm'
                : 'bg-white text-[#3B2923] border border-[#ECE0D1] hover:border-[#3B2923]'
            }`}
          >
            All Memories ({galleryItems.filter(i => !i.hidden).length})
          </button>

          {albums.map((album) => {
            const count = galleryItems.filter(i => i.albumId === album.id && !i.hidden).length;
            return (
              <button
                key={album.id}
                onClick={() => setSelectedAlbumId(album.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedAlbumId === album.id
                    ? 'bg-[#3B2923] text-[#D5AA61] shadow-sm'
                    : 'bg-white text-[#3B2923] border border-[#ECE0D1] hover:border-[#3B2923]'
                }`}
              >
                {album.title} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {/* Layout Mode Switcher */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#ECE0D1]">
          <p className="text-xs uppercase tracking-widest text-[#3B2923]/70 font-semibold">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'memory' : 'memories'}
          </p>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#ECE0D1]">
            <button
              onClick={() => setLayoutMode('masonry')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                layoutMode === 'masonry' ? 'bg-[#3B2923] text-white' : 'text-[#85846A] hover:text-[#3B2923]'
              }`}
              title="Masonry View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Masonry</span>
            </button>

            <button
              onClick={() => setLayoutMode('grid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                layoutMode === 'grid' ? 'bg-[#3B2923] text-white' : 'text-[#85846A] hover:text-[#3B2923]'
              }`}
              title="Editorial Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              onClick={() => setLayoutMode('polaroid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                layoutMode === 'polaroid' ? 'bg-[#3B2923] text-white' : 'text-[#85846A] hover:text-[#3B2923]'
              }`}
              title="Polaroid Style"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Polaroids</span>
            </button>
          </div>
        </div>

        {/* Gallery Content */}
        {filteredItems.length > 0 ? (
          <div
            className={
              layoutMode === 'masonry'
                ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
                : layoutMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                : layoutMode === 'polaroid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
            }
          >
            {filteredItems.map((item, idx) => {
              const hasExplicitCaption = Boolean(item.caption && item.caption.trim().length > 0);

              if (layoutMode === 'polaroid') {
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveLightboxIndex(idx)}
                    className="p-4 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-rotate-1 hover:scale-105 cursor-pointer border border-[#ECE0D1] group flex flex-col"
                  >
                    <div className="relative aspect-square w-full rounded-md overflow-hidden bg-[#F6EBDD] mb-3">
                      {item.type === 'video' ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-black">
                          <video src={item.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-current" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt="Young Memory"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* Only show caption if explicitly entered by the user */}
                    {hasExplicitCaption ? (
                      <p className="font-handwriting text-lg text-[#3B2923] leading-tight">
                        {item.caption}
                      </p>
                    ) : (
                      <div className="h-5" />
                    )}

                    {item.date && (
                      <span className="text-[10px] text-[#85846A] mt-1 uppercase tracking-wider">
                        {item.date}
                      </span>
                    )}
                  </div>
                );
              }

              // Standard Masonry / Grid Item
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxIndex(idx)}
                  className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-[#ECE0D1] break-inside-avoid"
                >
                  <div className={`relative ${layoutMode === 'grid' ? 'aspect-square' : ''} bg-[#F6EBDD] overflow-hidden`}>
                    {item.type === 'video' ? (
                      <div className="relative aspect-video flex items-center justify-center bg-black">
                        <video src={item.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 text-[#3B2923] fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt="Memory"
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}

                    {/* Hover Overlay - Only display user-entered caption, never raw filenames */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                      {hasExplicitCaption && (
                        <p className="text-xs text-[#F6EBDD] line-clamp-2 mt-1">
                          {item.caption}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#D5AA61]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Tap to view
                        </span>
                        {item.date && <span>{item.date}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Caption beneath if in grid mode and explicitly entered */}
                  {layoutMode === 'grid' && hasExplicitCaption && (
                    <div className="p-3 bg-white border-t border-[#ECE0D1]">
                      <p className="text-xs font-semibold text-[#3B2923] truncate">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Gallery State */
          <div className="p-12 text-center rounded-3xl bg-white border border-[#ECE0D1] max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FBF6EF] border-2 border-[#D5AA61]/50 flex items-center justify-center mx-auto mb-4 text-[#B85F43]">
              <Camera className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#3B2923] mb-2 uppercase">
              The Vault Is Ready For Memories
            </h3>

            <p className="text-[#5C453D] text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Upload real photographs and videos of Young and his friends! They will be stored persistently and organized beautifully across albums.
            </p>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Photographs Now</span>
            </button>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Nav previous */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 hidden sm:block cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Nav next */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 hidden sm:block cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Media Container */}
          <div
            className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeLightboxItem.type === 'video' ? (
              <video
                src={activeLightboxItem.url}
                controls
                autoPlay
                className="max-h-[70vh] max-w-full rounded-xl shadow-2xl"
              />
            ) : (
              <img
                src={activeLightboxItem.url}
                alt="Young memory"
                className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            )}

            {/* Lightbox Caption & Info (Only show if explicitly entered) */}
            <div className="mt-4 text-center text-white max-w-2xl px-4">
              {activeLightboxItem.caption && activeLightboxItem.caption.trim().length > 0 && (
                <p className="font-serif text-base text-[#D5AA61]">
                  {activeLightboxItem.caption}
                </p>
              )}
              <div className="mt-2 text-[11px] text-stone-400 uppercase tracking-widest">
                {activeLightboxIndex! + 1} of {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
