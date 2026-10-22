import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SectionManBehindSmile } from './components/SectionManBehindSmile';
import { SectionBigBrother } from './components/SectionBigBrother';
import { SectionValues } from './components/SectionValues';
import { SectionCoach } from './components/SectionCoach';
import { SectionDreams } from './components/SectionDreams';
import { SectionGallery } from './components/SectionGallery';
import { SectionTestimonials } from './components/SectionTestimonials';
import { SectionBirthdayMessages } from './components/SectionBirthdayMessages';
import { SectionVideoTribute } from './components/SectionVideoTribute';
import { SectionPersonalLetter } from './components/SectionPersonalLetter';
import { SectionFinale } from './components/SectionFinale';
import { MusicPlayer } from './components/MusicPlayer';
import { ModalSubmitMessage } from './components/ModalSubmitMessage';
import { ModalSubmitTestimonial } from './components/ModalSubmitTestimonial';
import { ShareModal } from './components/ShareModal';
import { AdminDashboard } from './components/AdminDashboard';

import { SiteContent, Album, GalleryItem, Testimonial, BirthdayMessage } from './types';
import { initialSiteContent, initialAlbums, initialGalleryItems, initialTestimonials, initialBirthdayMessages } from './data/initialData';
import { api } from './services/api';

export function App() {
  const [content, setContent] = useState<SiteContent>(initialSiteContent);
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGalleryItems);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [messages, setMessages] = useState<BirthdayMessage[]>(initialBirthdayMessages);
  const [isLoading, setIsLoading] = useState(true);

  // Music state: safe browser policy (no autoplay without user gesture)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Modals state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch initial data
  const loadData = async () => {
    try {
      const data = await api.getSiteData();
      if (data.content) setContent(data.content);
      if (data.albums && data.albums.length > 0) setAlbums(data.albums);
      if (data.gallery) setGallery(data.gallery);
      if (data.testimonials) setTestimonials(data.testimonials);
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.warn('Using default tribute content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnterCelebration = () => {
    const el = document.getElementById('the-story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleMusic = () => {
    setIsMusicPlaying((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6EBDD] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#3B2923] text-[#D5AA61] flex items-center justify-center text-xl font-serif font-bold animate-pulse mx-auto shadow-lg">
            PO
          </div>
          <p className="font-serif italic text-lg text-[#B85F43]">
            Preparing the celebration for Paul Olayemi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EBDD] text-[#3B2923] selection:bg-[#B85F43] selection:text-white">
      
      {/* Sticky Navigation Bar */}
      <Navbar
        onOpenMessageModal={() => setIsMessageModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
      />

      {/* Main Tribute Flow */}
      <main className="flex-1">
        {/* Section 0: Hero / Opening Screen */}
        <Hero
          content={content.hero}
          onEnter={handleEnterCelebration}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Section 1: The Man Behind The Smile */}
        <SectionManBehindSmile
          content={content.manBehindSmile}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Section 2: The Big Brother Everyone Needs */}
        <SectionBigBrother
          content={content.bigBrother}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Section 3: The Values He Stands For */}
        <SectionValues
          content={content.values}
        />

        {/* Section 4: The Coach He Is Becoming */}
        <SectionCoach
          content={content.coach}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onImageUpdated={loadData}
        />

        {/* Section 5: His Dreams For The Future */}
        <SectionDreams
          content={content.dreams}
        />

        {/* Section 6: The Memory Gallery */}
        <SectionGallery
          albums={albums}
          galleryItems={gallery}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Section 7: Testimonials From Friends */}
        <SectionTestimonials
          testimonials={testimonials}
          onOpenSubmitModal={() => setIsTestimonialModalOpen(true)}
        />

        {/* Section 8: Birthday Wishes and Messages Wall */}
        <SectionBirthdayMessages
          messages={messages}
          onOpenLeaveMessageModal={() => setIsMessageModalOpen(true)}
        />

        {/* Section 9: The Birthday Video Tribute */}
        <SectionVideoTribute
          content={content.videoTribute}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Section 10: My Personal Letter to Young */}
        <SectionPersonalLetter
          content={content.letter}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Section 11: The Grand Finale */}
        <SectionFinale
          content={content.finale}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </main>

      {/* Persistent Floating Background Music Control */}
      <MusicPlayer
        settings={content.music}
        isPlaying={isMusicPlaying}
        onTogglePlay={handleToggleMusic}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals & Portals */}
      <ModalSubmitMessage
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        onSuccess={loadData}
      />

      <ModalSubmitTestimonial
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        onSuccess={loadData}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        siteContent={content}
        albums={albums}
        galleryItems={gallery}
        testimonials={testimonials}
        birthdayMessages={messages}
        onRefreshData={loadData}
      />

    </div>
  );
}

export default App;
