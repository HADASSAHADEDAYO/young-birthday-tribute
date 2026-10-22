import React, { useState } from 'react';
import { X, Quote, Send, CheckCircle2, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalSubmitTestimonial: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [highlight, setHighlight] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickStarters = [
    'What I admire most about Young is...',
    'My favourite memory with Young was when...',
    'Young has that true big-brother energy because...',
    'I believe he will make a great coach because...'
  ];

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleInsertStarter = (starter: string) => {
    setMessage((prev) => (prev ? `${prev} ${starter}` : starter));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMessage('Please provide your name and your testimonial.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let uploadedPhotoUrl = '';
      if (photoFile) {
        const urls = await api.uploadFiles([photoFile]);
        if (urls.length > 0) uploadedPhotoUrl = urls[0];
      }

      const res = await api.submitTestimonial({
        name: name.trim(),
        relationship: relationship.trim(),
        message: message.trim(),
        highlight: highlight.trim(),
        photoUrl: uploadedPhotoUrl
      });

      if (res.success) {
        setSuccessMessage(res.message);
        onSuccess();
      } else {
        setErrorMessage('Failed to submit testimonial. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting testimonial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setRelationship('');
    setMessage('');
    setHighlight('');
    setPhotoFile(null);
    setSuccessMessage(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF4EC] rounded-3xl shadow-2xl border-2 border-[#ECE0D1] p-6 sm:p-8 my-8 text-[#3B2923]">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#EFE5D8] text-stone-500 hover:text-[#3B2923] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {successMessage ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#3B2923]">
              Testimonial Submitted
            </h3>

            <p className="font-serif italic text-base text-[#3B2923]/80 leading-relaxed max-w-md mx-auto">
              “{successMessage}”
            </p>

            <button
              onClick={handleResetAndClose}
              className="mt-6 px-6 py-2.5 bg-[#3B2923] hover:bg-[#2A1D19] text-[#F6EBDD] rounded-full text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#B85F43] mb-1">
              <Quote className="w-4 h-4" />
              <span>Voices of Appreciation</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B2923] mb-1">
              Share Your Story of Young
            </h3>
            <p className="text-xs text-stone-600 mb-5">
              What do you value most about his character, loyalty, or coaching potential?
            </p>

            {/* Quick Starters */}
            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D5AA61]" />
                Tap to start with a prompt:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickStarters.map((starter, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleInsertStarter(starter)}
                    className="text-[11px] bg-white border border-[#ECE0D1] hover:border-[#B85F43] text-stone-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Your Full Name <span className="text-[#B85F43]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Ade"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B85F43]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Your Connection to Young <span className="text-stone-400 font-normal">(e.g. Close Friend, Brother, Teammate)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Long-time Friend & Confidant"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B85F43]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Your Testimonial <span className="text-[#B85F43]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe his loyalty, honesty, laughter, or what makes him one of a kind..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B85F43]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Your Photo <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#D5AA61] rounded-xl bg-white cursor-pointer hover:bg-stone-50 text-xs text-stone-600">
                  <ImageIcon className="w-4 h-4 text-[#B85F43]" />
                  <span className="truncate">{photoFile ? photoFile.name : 'Attach a photo of yourself...'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ECE0D1]">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#D5AA61]" />
                  <span>{isSubmitting ? 'Submitting...' : 'Post Testimonial'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
