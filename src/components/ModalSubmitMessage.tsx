import React, { useState } from 'react';
import { X, Heart, Send, CheckCircle2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalSubmitMessage: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMessage('Please provide your name and birthday message.');
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

      const res = await api.submitBirthdayMessage({
        name: name.trim(),
        relationship: relationship.trim(),
        message: message.trim(),
        photoUrl: uploadedPhotoUrl || photoPreview,
        videoUrl: videoUrl.trim()
      });

      if (res.success) {
        setSuccessMessage('Your message has been received with love. Thank you for being part of Young’s story.');
        onSuccess();
      } else {
        setErrorMessage('Could not save your message. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setRelationship('');
    setMessage('');
    setVideoUrl('');
    setPhotoFile(null);
    setPhotoPreview('');
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
              Message Received
            </h3>

            <p className="font-serif italic text-lg text-[#B85F43] leading-relaxed max-w-md mx-auto">
              “{successMessage}”
            </p>

            <button
              onClick={handleResetAndClose}
              className="mt-6 px-6 py-2.5 bg-[#3B2923] hover:bg-[#2A1D19] text-[#F6EBDD] rounded-full text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
            >
              Back to Celebration
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#B85F43] mb-1">
              <Heart className="w-4 h-4 fill-current" />
              <span>Birthday Message Wall</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B2923] mb-1">
              Leave Young a Message
            </h3>
            <p className="text-xs text-stone-600 mb-6">
              Write your congratulations, jokes, heartfelt prayers, or memories for Paul Olayemi.
            </p>

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
                  placeholder="e.g. Tunde Balogun"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B85F43]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Relationship to Young <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Day-One Brother, Childhood Friend, Gym Partner"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B85F43]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Birthday Message <span className="text-[#B85F43]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your heartfelt birthday wishes, blessings, or tribute here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B85F43]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Your Photo <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#D5AA61] rounded-xl bg-white cursor-pointer hover:bg-stone-50 text-xs text-stone-600">
                    <ImageIcon className="w-4 h-4 text-[#B85F43]" />
                    <span className="truncate">{photoFile ? photoFile.name : 'Choose photo...'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Video link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Video Link <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="YouTube / Video URL"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#ECE0D1] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#B85F43]"
                    />
                  </div>
                </div>
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
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Send Birthday Message'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
