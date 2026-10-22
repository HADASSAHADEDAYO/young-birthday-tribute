import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://young-tribute.app';
  const shareText = `🎉 Join in celebrating Paul Olayemi (Young)! Read the stories, memories, and leave him a heartfelt birthday message: ${siteUrl}`;

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF4EC] rounded-3xl shadow-2xl border-2 border-[#ECE0D1] p-6 sm:p-8 text-[#3B2923]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#EFE5D8] text-stone-500 hover:text-[#3B2923] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#B85F43] mb-1">
          <Share2 className="w-4 h-4" />
          <span>Share With Friends</span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#3B2923] mb-1">
          Share the Young Tribute
        </h3>
        <p className="text-xs text-stone-600 mb-6">
          Send this link to friends, family, and teammates so they can sign the birthday wall and contribute memories.
        </p>

        {/* Preview Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#ECE0D1] shadow-sm mb-6 flex gap-3 items-center">
          <div className="w-12 h-12 rounded-xl bg-[#3B2923] text-[#D5AA61] flex items-center justify-center font-serif font-bold text-lg shrink-0">
            PO
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-xs text-[#3B2923] truncate">
              Happy Birthday, Paul Olayemi | The Young Tribute
            </h4>
            <p className="text-[11px] text-stone-500 truncate mt-0.5">
              Big energy. Bigger heart. Unforgettable memories.
            </p>
            <span className="text-[10px] text-[#B85F43] font-semibold block mt-1 truncate">
              {siteUrl}
            </span>
          </div>
        </div>

        {/* WhatsApp One-Click Action */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all mb-3 active:scale-98 cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span>Share Directly on WhatsApp</span>
        </button>

        {/* Copy Link Input */}
        <div className="relative flex items-center mb-6">
          <input
            type="text"
            readOnly
            value={siteUrl}
            className="w-full px-4 py-2.5 pr-24 rounded-2xl border border-[#ECE0D1] bg-white text-xs text-[#3B2923] font-mono select-all focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="absolute right-1 px-4 py-1.5 bg-[#3B2923] hover:bg-[#2A1D19] text-[#F6EBDD] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#D5AA61]" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Tips Box */}
        <div className="p-3.5 rounded-xl bg-[#F6EBDD] border border-[#ECE0D1] text-[11px] text-stone-700 space-y-1">
          <p className="font-bold text-[#3B2923]">Curator Note:</p>
          <p>
            Visitors see only the celebration sections and public submission forms. The administrator dashboard is protected and completely hidden from public guests.
          </p>
        </div>

      </div>
    </div>
  );
};
