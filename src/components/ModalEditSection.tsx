import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, CheckCircle2, AlertCircle, Edit3, Plus, Trash2, BookOpen } from 'lucide-react';
import { SiteContent } from '../types';
import { api } from '../services/api';

interface ModalEditSectionProps {
  isOpen: boolean;
  sectionKey: keyof SiteContent | null;
  siteContent: SiteContent;
  onClose: () => void;
  onSaveSuccess: (updatedContent: SiteContent) => void;
}

export const ModalEditSection: React.FC<ModalEditSectionProps> = ({
  isOpen,
  sectionKey,
  siteContent,
  onClose,
  onSaveSuccess,
}) => {
  const [draft, setDraft] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync draft whenever modal opens with a section
  useEffect(() => {
    if (sectionKey && siteContent[sectionKey]) {
      // Deep clone section data for editing
      setDraft(JSON.parse(JSON.stringify(siteContent[sectionKey])));
      setSaveStatus(null);
      setErrorMessage(null);
    }
  }, [sectionKey, siteContent, isOpen]);

  if (!isOpen || !sectionKey || !draft) return null;

  const getSectionTitle = (key: keyof SiteContent) => {
    switch (key) {
      case 'hero': return 'Opening Screen & Hero Section';
      case 'manBehindSmile': return 'Section 1: The Man Behind The Smile';
      case 'bigBrother': return 'Section 2: The Big Brother Everyone Needs';
      case 'values': return 'Section 3: The Values He Stands For';
      case 'coach': return 'Section 4: The Coach He Is Becoming';
      case 'dreams': return 'Section 5: His Dreams For The Future';
      case 'videoTribute': return 'Section 9: The Birthday Video Tribute';
      case 'letter': return 'Section 10: My Personal Letter to Young';
      case 'finale': return 'Section 11: The Grand Finale';
      default: return `Edit ${String(key)}`;
    }
  };

  const handleParagraphChange = (index: number, value: string) => {
    if (!draft.paragraphs) return;
    const updated = [...draft.paragraphs];
    updated[index] = value;
    setDraft({ ...draft, paragraphs: updated });
  };

  const handleAddParagraph = () => {
    const updated = [...(draft.paragraphs || []), ''];
    setDraft({ ...draft, paragraphs: updated });
  };

  const handleRemoveParagraph = (index: number) => {
    if (!draft.paragraphs || draft.paragraphs.length <= 1) return;
    const updated = draft.paragraphs.filter((_: any, i: number) => i !== index);
    setDraft({ ...draft, paragraphs: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSaveStatus(null);

    try {
      const res = await api.saveSectionContent(sectionKey, draft);
      if (res.success && res.content) {
        setSaveStatus('Changes saved permanently to persistent storage!');
        onSaveSuccess(res.content);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(res.error || 'Server could not save section');
      }
    } catch (err: any) {
      console.error('Save failed:', err);
      setErrorMessage(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF4EC] rounded-3xl shadow-2xl border-2 border-[#ECE0D1] p-6 sm:p-8 my-8 text-[#3B2923] max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ECE0D1] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3B2923] text-[#D5AA61] flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3B2923] leading-tight">
                {getSectionTitle(sectionKey)}
              </h3>
              <span className="text-[11px] text-[#B85F43] uppercase tracking-wider font-semibold">
                Live Content Editor • Changes persist across refreshes
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EFE5D8] text-stone-500 hover:text-[#3B2923] transition-colors cursor-pointer"
            aria-label="Cancel and close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status / Feedback Alerts */}
        {saveStatus && (
          <div className="mt-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          
          {/* 1. HERO SECTION SPECIFIC FIELDS */}
          {sectionKey === 'hero' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Eyebrow Tagline
                </label>
                <input
                  type="text"
                  value={draft.eyebrow || ''}
                  onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={draft.title || ''}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm font-serif font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={draft.subtitle || ''}
                  onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm italic text-[#B85F43]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Supporting Paragraph
                </label>
                <textarea
                  rows={3}
                  value={draft.supportingMessage || ''}
                  onChange={(e) => setDraft({ ...draft, supportingMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={draft.buttonText || ''}
                  onChange={(e) => setDraft({ ...draft, buttonText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm uppercase"
                />
              </div>
            </>
          )}

          {/* 2. SECTION 10: PERSONAL LETTER SPECIFIC FIELDS */}
          {sectionKey === 'letter' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Letter Heading
                </label>
                <input
                  type="text"
                  value={draft.heading || ''}
                  onChange={(e) => setDraft({ ...draft, heading: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm font-serif font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Salutation
                  </label>
                  <input
                    type="text"
                    value={draft.salutation || ''}
                    onChange={(e) => setDraft({ ...draft, salutation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Letter Date / Badge
                  </label>
                  <input
                    type="text"
                    value={draft.letterDate || ''}
                    onChange={(e) => setDraft({ ...draft, letterDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm uppercase text-[#B85F43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Opening Note (Italicized)
                </label>
                <textarea
                  rows={2}
                  value={draft.opening || ''}
                  onChange={(e) => setDraft({ ...draft, opening: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm italic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                  Letter Body (Full message, memories & reflections)
                </label>
                <textarea
                  rows={8}
                  value={draft.body || ''}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm leading-relaxed font-serif"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Closing Signoff
                  </label>
                  <input
                    type="text"
                    value={draft.closing || ''}
                    onChange={(e) => setDraft({ ...draft, closing: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Handwritten Signature
                  </label>
                  <input
                    type="text"
                    value={draft.signature || ''}
                    onChange={(e) => setDraft({ ...draft, signature: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm text-[#B85F43] font-bold"
                  />
                </div>
              </div>
            </>
          )}

          {/* 3. TRIBUTE STORY SECTIONS (Man Behind Smile, Big Brother, Values, Coach, Dreams, Finale, Video) */}
          {sectionKey !== 'hero' && sectionKey !== 'letter' && (
            <>
              {draft.heading !== undefined && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={draft.heading || ''}
                    onChange={(e) => setDraft({ ...draft, heading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm font-serif font-bold"
                  />
                </div>
              )}

              {draft.title !== undefined && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={draft.title || ''}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm font-serif font-bold"
                  />
                </div>
              )}

              {draft.subheading !== undefined && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Subheading / Eyebrow
                  </label>
                  <input
                    type="text"
                    value={draft.subheading || ''}
                    onChange={(e) => setDraft({ ...draft, subheading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm text-[#B85F43]"
                  />
                </div>
              )}

              {draft.quote !== undefined && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Featured Quote / Highlight
                  </label>
                  <textarea
                    rows={2}
                    value={draft.quote || ''}
                    onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm italic font-serif"
                  />
                </div>
              )}

              {/* Editable Paragraphs List */}
              {Array.isArray(draft.paragraphs) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923]">
                      Story Paragraphs ({draft.paragraphs.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddParagraph}
                      className="text-xs text-[#B85F43] hover:text-[#9E4D34] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {draft.paragraphs.map((p: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <span className="text-[11px] font-bold text-stone-500 w-5 pt-2 text-right">
                          {idx + 1}.
                        </span>
                        <textarea
                          rows={3}
                          value={p}
                          onChange={(e) => handleParagraphChange(idx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-[#ECE0D1] bg-white text-sm leading-relaxed"
                          placeholder={`Paragraph ${idx + 1}...`}
                        />
                        {draft.paragraphs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveParagraph(idx)}
                            className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Remove paragraph"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Core Values (Honour, Respect, Integrity) */}
              {Array.isArray(draft.coreValues) && (
                <div className="pt-2 border-t border-[#ECE0D1]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-2">
                    Core Values Cards
                  </label>
                  <div className="space-y-3">
                    {draft.coreValues.map((cv: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-white border border-[#ECE0D1] space-y-1.5">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Value Title (e.g. Honour)"
                            value={cv.title || ''}
                            onChange={(e) => {
                              const updated = [...draft.coreValues];
                              updated[i] = { ...updated[i], title: e.target.value };
                              setDraft({ ...draft, coreValues: updated });
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-[#ECE0D1] text-xs font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Tag (e.g. Principle)"
                            value={cv.tag || ''}
                            onChange={(e) => {
                              const updated = [...draft.coreValues];
                              updated[i] = { ...updated[i], tag: e.target.value };
                              setDraft({ ...draft, coreValues: updated });
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-[#ECE0D1] text-xs"
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Description of value..."
                          value={cv.description || ''}
                          onChange={(e) => {
                            const updated = [...draft.coreValues];
                            updated[i] = { ...updated[i], description: e.target.value };
                            setDraft({ ...draft, coreValues: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#ECE0D1] text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 4: Coaching Qualities */}
              {Array.isArray(draft.qualities) && (
                <div className="pt-2 border-t border-[#ECE0D1]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1.5">
                    Natural Coaching Qualities
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {draft.qualities.map((q: string, i: number) => (
                      <input
                        key={i}
                        type="text"
                        value={q}
                        onChange={(e) => {
                          const updated = [...draft.qualities];
                          updated[i] = e.target.value;
                          setDraft({ ...draft, qualities: updated });
                        }}
                        className="px-3 py-1.5 rounded-xl border border-[#ECE0D1] bg-white text-xs font-semibold"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Section 5: Future Blessings */}
              {Array.isArray(draft.blessings) && (
                <div className="pt-2 border-t border-[#ECE0D1]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1.5">
                    Future Wishes & Blessings
                  </label>
                  <div className="space-y-2">
                    {draft.blessings.map((b: string, i: number) => (
                      <textarea
                        key={i}
                        rows={2}
                        value={b}
                        onChange={(e) => {
                          const updated = [...draft.blessings];
                          updated[i] = e.target.value;
                          setDraft({ ...draft, blessings: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-[#ECE0D1] bg-white text-xs"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Closing Affirmation (Sections 3, 4, etc.) */}
              {draft.closing !== undefined && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Closing Affirmation
                  </label>
                  <textarea
                    rows={2}
                    value={draft.closing || ''}
                    onChange={(e) => setDraft({ ...draft, closing: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm font-serif italic"
                  />
                </div>
              )}

              {/* Finale Messages (Section 11) */}
              {draft.messagePrimary !== undefined && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Primary Finale Message
                  </label>
                  <textarea
                    rows={2}
                    value={draft.messagePrimary || ''}
                    onChange={(e) => setDraft({ ...draft, messagePrimary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm font-serif italic text-[#B85F43]"
                  />
                </div>
              )}

              {draft.messageSecondary !== undefined && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Secondary Finale Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={draft.messageSecondary || ''}
                    onChange={(e) => setDraft({ ...draft, messageSecondary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm"
                  />
                </div>
              )}

              {draft.footerCredit !== undefined && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Footer Credit Line
                  </label>
                  <input
                    type="text"
                    value={draft.footerCredit || ''}
                    onChange={(e) => setDraft({ ...draft, footerCredit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-sm font-serif"
                  />
                </div>
              )}

              {draft.videoUrl !== undefined && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2923] mb-1">
                    Video Tribute URL (YouTube, Vimeo, or MP4)
                  </label>
                  <input
                    type="text"
                    value={draft.videoUrl || ''}
                    onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE0D1] bg-white text-xs font-mono"
                    placeholder="https://..."
                  />
                </div>
              )}
            </>
          )}

          {/* Action Buttons: Cancel and Save */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ECE0D1] shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-200/50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#D5AA61]" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
