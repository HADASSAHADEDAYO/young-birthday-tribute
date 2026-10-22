import React, { useState } from 'react';
import { Menu, X, Heart, Share2, Shield, Music } from 'lucide-react';

interface NavbarProps {
  onOpenMessageModal: () => void;
  onOpenShareModal: () => void;
  onOpenAdmin: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMessageModal,
  onOpenShareModal,
  onOpenAdmin,
  isMusicPlaying,
  onToggleMusic,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'The Story', href: '#the-story' },
    { label: 'Brotherhood', href: '#brotherhood' },
    { label: 'Values', href: '#values' },
    { label: 'The Dream', href: '#coach' },
    { label: 'Memories', href: '#memories' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Messages', href: '#wishes' },
    { label: 'Letter', href: '#letter' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6EBDD]/95 backdrop-blur-md border-b border-[#ECE0D1] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Monogram */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Paul Olayemi Tribute Home"
          >
            <div className="w-10 h-10 rounded-full bg-[#3B2923] text-[#D5AA61] flex items-center justify-center font-bold tracking-wider text-sm shadow-sm group-hover:scale-105 transition-transform border border-[#D5AA61]/30">
              PO
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-tight text-[#3B2923] group-hover:text-[#B85F43] transition-colors">
                PAUL OLAYEMI
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#B85F43] font-semibold -mt-1">
                “Young” • Tribute
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#3B2923]/80 hover:text-[#B85F43] hover:bg-[#FBF6EF] rounded-md transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Quick Music Toggle */}
            <button
              onClick={onToggleMusic}
              className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                isMusicPlaying
                  ? 'bg-[#B85F43] text-white border-[#D5AA61] shadow-sm'
                  : 'bg-[#FBF6EF] text-[#3B2923] border-[#ECE0D1] hover:border-[#B85F43]'
              }`}
              title={isMusicPlaying ? 'Pause celebratory soundtrack (Fireboy DML - Champ)' : 'Play celebratory soundtrack (Fireboy DML - Champ)'}
              aria-label={isMusicPlaying ? 'Pause background music' : 'Play background music'}
            >
              <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-bounce text-[#D5AA61]' : 'text-[#B85F43]'}`} />
              <span className="text-[11px]">{isMusicPlaying ? 'Champ Playing' : 'Play Music'}</span>
            </button>

            {/* Share */}
            <button
              onClick={onOpenShareModal}
              className="p-2 rounded-full bg-[#FBF6EF] border border-[#ECE0D1] text-[#3B2923] hover:bg-white hover:text-[#B85F43] transition-colors cursor-pointer"
              title="Share tribute with friends"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Leave Message CTA */}
            <button
              onClick={onOpenMessageModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Leave a Message</span>
            </button>

            {/* Admin discrete entry */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#85846A] hover:text-[#3B2923] transition-colors rounded-full hover:bg-[#ECE0D1]"
              title="Administrator Suite"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              onClick={onToggleMusic}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isMusicPlaying
                  ? 'bg-[#B85F43] text-white border-[#D5AA61]'
                  : 'text-[#3B2923] bg-[#FBF6EF] border-[#ECE0D1]'
              }`}
              title={isMusicPlaying ? 'Pause celebratory music' : 'Play celebratory music'}
              aria-label={isMusicPlaying ? 'Pause celebratory music' : 'Play celebratory music'}
            >
              <Music className={`w-4 h-4 ${isMusicPlaying ? 'text-[#D5AA61] animate-bounce' : 'text-[#B85F43]'}`} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#3B2923] hover:bg-[#FBF6EF] rounded-md transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#ECE0D1] bg-[#F6EBDD] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#3B2923] hover:bg-[#FBF6EF] hover:text-[#B85F43] rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#ECE0D1] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMessageModal();
              }}
              className="w-full py-2.5 px-4 bg-[#B85F43] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Leave Young a Birthday Message</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenShareModal();
                }}
                className="flex-1 py-2 px-3 bg-[#FBF6EF] border border-[#ECE0D1] text-[#3B2923] rounded-xl text-xs font-medium flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Tribute</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="py-2 px-3 bg-[#ECE0D1] text-[#3B2923] rounded-xl text-xs font-medium flex items-center justify-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
