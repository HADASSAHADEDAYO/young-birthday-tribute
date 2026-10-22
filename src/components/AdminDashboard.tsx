import React, { useState, useEffect } from 'react';
import {
  X, Shield, Lock, Save, Upload, Trash2, Edit3, Plus, Eye, EyeOff,
  CheckCircle2, AlertCircle, RefreshCw, Layers, Image as ImageIcon,
  Video, Music, Heart, MessageSquare, Quote, Palette, Sparkles, BookOpen
} from 'lucide-react';
import { SiteContent, Album, GalleryItem, Testimonial, BirthdayMessage } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  siteContent: SiteContent;
  albums: Album[];
  galleryItems: GalleryItem[];
  testimonials: Testimonial[];
  birthdayMessages: BirthdayMessage[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  siteContent,
  albums: initialAlbumsList,
  galleryItems: initialGalleryList,
  testimonials: initialTestimonialsList,
  birthdayMessages: initialMessagesList,
  onRefreshData,
}) => {
  // Auth state
  const [passcode, setPasscode] = useState('');
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('young_admin_token'));
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab
  type TabType = 'gallery' | 'albums' | 'content' | 'messages' | 'testimonials' | 'music_video' | 'settings';
  const [activeTab, setActiveTab] = useState<TabType>('gallery');

  // Working data copies for editing
  const [content, setContent] = useState<SiteContent>(siteContent);
  const [albums, setAlbums] = useState<Album[]>(initialAlbumsList);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGalleryList);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonialsList);
  const [messages, setMessages] = useState<BirthdayMessage[]>(initialMessagesList);

  // Status banners
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // New item draft states
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumLayout, setNewAlbumLayout] = useState<'masonry' | 'grid' | 'polaroid' | 'collage'>('masonry');
  const [newPasscode, setNewPasscode] = useState('');

  // Sync props when opening or receiving fresh data
  useEffect(() => {
    setContent(siteContent);
    setAlbums(initialAlbumsList);
    setGallery(initialGalleryList);
    setTestimonials(initialTestimonialsList);
    setMessages(initialMessagesList);
  }, [siteContent, initialAlbumsList, initialGalleryList, initialTestimonialsList, initialMessagesList]);

  // Load all pending & hidden data when token is valid
  useEffect(() => {
    if (adminToken && isOpen) {
      api.getAdminAllData(adminToken).then((data) => {
        setContent(data.content);
        setAlbums(data.albums);
        setGallery(data.gallery);
        setTestimonials(data.testimonials);
        setMessages(data.messages);
      }).catch(console.error);
    }
  }, [adminToken, isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await api.loginAdmin(passcode);
    if (res.success && res.token) {
      setAdminToken(res.token);
      localStorage.setItem('young_admin_token', res.token);
      setPasscode('');
    } else {
      setAuthError(res.error || 'Incorrect passcode. Try "young2026"');
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('young_admin_token');
  };

  const showFeedback = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // 1. Save Content
  const handleSaveContent = async () => {
    setIsSaving(true);
    const res = await api.saveContent(content, adminToken || undefined);
    setIsSaving(false);
    if (res.success) {
      if (res.content) {
        setContent(res.content);
      }
      showFeedback('Site stories and content saved successfully to persistent storage!');
      onRefreshData();
    } else {
      alert('Error saving content: ' + (res.error || 'Server rejected changes'));
    }
  };

  // 2. Upload multiple photos/videos to gallery
  // Fix: Do NOT auto-populate title or caption with the original filename or extension
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetAlbumId?: string) => {
    if (!e.target.files || e.target.files.length === 0 || !adminToken) return;
    setUploadingFiles(true);
    const files = Array.from(e.target.files);

    try {
      const urls = await api.uploadFiles(files);
      const newItems: GalleryItem[] = urls.map((url, i) => {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');
        return {
          id: `item-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          albumId: targetAlbumId || (albums[0]?.id || 'album-1'),
          type: isVideo ? 'video' : 'image',
          url,
          title: '', // Leave blank: no auto-populated filenames/extensions
          caption: '', // Leave blank unless explicitly entered
          order: gallery.length + i,
          hidden: false,
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
      });

      const updatedGallery = [...gallery, ...newItems];
      setGallery(updatedGallery);
      await api.saveGalleryItems(updatedGallery, adminToken, true);
      showFeedback(`Successfully uploaded ${newItems.length} media item(s)!`);
      onRefreshData();
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingFiles(false);
    }
  };

  // 3. Upload single photo for a section (Hero, Story, BigBrother, Coach, Finale)
  const handleSectionPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    if (!e.target.files || !e.target.files[0] || !adminToken) return;
    const file = e.target.files[0];
    const urls = await api.uploadFiles([file]);
    if (urls.length > 0) {
      const url = urls[0];
      const updated = { ...content };
      if (targetField === 'hero') updated.hero.heroImage = url;
      if (targetField === 'manBehindSmile') updated.manBehindSmile.image = url;
      if (targetField === 'bigBrother') updated.bigBrother.image = url;
      if (targetField === 'coach') updated.coach.image = url;
      if (targetField === 'finale') updated.finale.image = url;
      if (targetField === 'music') updated.music.audioUrl = url;
      if (targetField === 'videoTribute') updated.videoTribute.videoUrl = url;

      setContent(updated);
      await api.saveContent(updated, adminToken);
      showFeedback('Photograph updated and saved!');
      onRefreshData();
    }
  };

  // 4. Gallery item actions
  const handleToggleHideGalleryItem = async (id: string) => {
    if (!adminToken) return;
    const updated = gallery.map(item => item.id === id ? { ...item, hidden: !item.hidden } : item);
    setGallery(updated);
    await api.saveGalleryItems(updated, adminToken, true);
    onRefreshData();
  };

  // Fix: Gallery Delete Button - deletes target item ID from server, local state and localStorage
  const handleDeleteGalleryItem = async (id: string) => {
    if (!adminToken) return;
    if (!confirm('Are you sure you want to permanently delete this photograph from the gallery?')) return;
    
    try {
      const updated = gallery.filter(item => item.id !== id);
      setGallery(updated);
      await api.deleteGalleryItem(id, adminToken);
      showFeedback('Photograph permanently deleted.');
      onRefreshData();
    } catch (err: any) {
      console.error('Delete gallery item error:', err);
      alert('Failed to delete item: ' + (err.message || 'Unknown error'));
      onRefreshData();
    }
  };

  const handleUpdateItemCaption = (id: string, caption: string) => {
    setGallery(prev => prev.map(item => item.id === id ? { ...item, caption } : item));
  };

  const handleUpdateItemAlbum = (id: string, albumId: string) => {
    setGallery(prev => prev.map(item => item.id === id ? { ...item, albumId } : item));
  };

  const handleSaveGalleryOrderAndCaptions = async () => {
    if (!adminToken) return;
    setIsSaving(true);
    await api.saveGalleryItems(gallery, adminToken, true);
    setIsSaving(false);
    showFeedback('Gallery captions and organization saved!');
    onRefreshData();
  };

  // 5. Albums management
  const handleAddAlbum = async () => {
    if (!newAlbumTitle.trim() || !adminToken) return;
    const newAlb: Album = {
      id: `album-${Date.now()}`,
      title: newAlbumTitle.trim(),
      description: '',
      order: albums.length + 1,
      layout: newAlbumLayout
    };
    const updated = [...albums, newAlb];
    setAlbums(updated);
    await api.saveAlbums(updated, adminToken);
    setNewAlbumTitle('');
    showFeedback('New album created!');
    onRefreshData();
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!adminToken) return;
    if (albums.length <= 1) {
      alert('You must have at least one album.');
      return;
    }
    if (!confirm('Delete this album? Photos inside will be reassigned to the first album.')) return;
    const updated = albums.filter(a => a.id !== id);
    setAlbums(updated);
    await api.saveAlbums(updated, adminToken);
    showFeedback('Album deleted.');
    onRefreshData();
  };

  // 6. Testimonial Moderation
  const handleTestimonialStatus = async (id: string, status: 'approved' | 'hidden') => {
    if (!adminToken) return;
    const updated = testimonials.map(t => t.id === id ? { ...t, status } : t);
    setTestimonials(updated);
    await api.updateTestimonial(id, { status }, adminToken);
    showFeedback(`Testimonial ${status}!`);
    onRefreshData();
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!adminToken) return;
    if (!confirm('Permanently delete this testimonial?')) return;
    setTestimonials(prev => prev.filter(t => t.id !== id));
    await api.deleteTestimonial(id, adminToken);
    showFeedback('Testimonial removed.');
    onRefreshData();
  };

  // 7. Birthday Message Moderation
  const handleMessageStatus = async (id: string, status: 'approved' | 'hidden') => {
    if (!adminToken) return;
    const updated = messages.map(m => m.id === id ? { ...m, status } : m);
    setMessages(updated);
    await api.updateBirthdayMessage(id, { status }, adminToken);
    showFeedback(`Message ${status}!`);
    onRefreshData();
  };

  const handleDeleteMessage = async (id: string) => {
    if (!adminToken) return;
    if (!confirm('Permanently delete this birthday message?')) return;
    setMessages(prev => prev.filter(m => m.id !== id));
    await api.deleteBirthdayMessage(id, adminToken);
    showFeedback('Message removed.');
    onRefreshData();
  };

  // 8. Change passcode
  const handleChangePasscode = async () => {
    if (!newPasscode.trim() || !adminToken) return;
    const res = await api.changePasscode(newPasscode.trim(), adminToken);
    if (res.success && res.token) {
      setAdminToken(res.token);
      localStorage.setItem('young_admin_token', res.token);
      setNewPasscode('');
      showFeedback('Passcode updated successfully!');
    } else {
      alert('Error updating passcode');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#FAF4EC] rounded-3xl shadow-2xl border-2 border-[#ECE0D1] flex flex-col overflow-hidden text-[#3B2923]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECE0D1] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3B2923] text-[#D5AA61] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#3B2923] leading-tight">
                Curator & Administrator Suite
              </h2>
              <span className="text-[11px] uppercase tracking-wider text-[#B85F43] font-semibold">
                Paul Olayemi Birthday Tribute
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> {saveStatus}
              </span>
            )}

            {adminToken && (
              <button
                onClick={handleLogout}
                className="text-xs text-stone-600 hover:text-stone-900 px-3 py-1 rounded-lg border border-[#ECE0D1] bg-stone-50 cursor-pointer"
              >
                Log Out
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-[#3B2923] transition-colors cursor-pointer"
              aria-label="Close Admin Suite"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!adminToken ? (
          /* Login Screen */
          <div className="flex-1 p-8 sm:p-16 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#ECE0D1] shadow-lg text-center">
              <div className="w-14 h-14 rounded-full bg-[#F6EBDD] border border-[#D5AA61] text-[#3B2923] flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#3B2923] mb-1">
                Administrator Access
              </h3>
              <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                Enter your curator passcode to manage photographs, moderate birthday wishes, edit stories, or change music.
              </p>

              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Enter passcode (default: young2026)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#ECE0D1] text-sm focus:outline-none focus:ring-2 focus:ring-[#B85F43]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow transition-all cursor-pointer"
                >
                  Unlock Admin Suite
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Admin Suite Tabs */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-stone-50 border-r border-[#ECE0D1] p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'gallery' ? 'bg-[#3B2923] text-white' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-[#D5AA61]" />
                <span>Photos & Vault</span>
              </button>

              <button
                onClick={() => setActiveTab('albums')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'albums' ? 'bg-[#3B2923] text-white' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Layers className="w-4 h-4 text-[#D5AA61]" />
                <span>Albums ({albums.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'content' ? 'bg-[#3B2923] text-white' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Edit3 className="w-4 h-4 text-[#D5AA61]" />
                <span>Stories & Copy</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'messages' ? 'bg-[#3B2923] text-white' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Heart className="w-4 h-4 text-[#B85F43]" />
                <span>Wishes ({messages.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'testimonials' ? 'bg-[#3B2923] text-white' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Quote className="w-4 h-4 text-[#D5AA61]" />
                <span>Testimonials ({testimonials.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('music_video')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'music_video' ? 'bg-[#3B2923] text-white' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Music className="w-4 h-4 text-[#D5AA61]" />
                <span>Music & Video</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings' ? 'bg-[#3B2923] text-white' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Shield className="w-4 h-4 text-[#D5AA61]" />
                <span>Passcode</span>
              </button>
            </div>

            {/* Tab Pane Container */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[calc(92vh-75px)]">
              
              {/* TAB 1: GALLERY & PHOTOS */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE0D1] gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#3B2923]">
                        Photo & Video Gallery Management
                      </h3>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Upload real photographs of Young and his circle. Stored permanently.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow">
                        <Upload className="w-4 h-4" />
                        <span>{uploadingFiles ? 'Uploading...' : 'Upload Photos / Videos'}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={(e) => handleGalleryUpload(e)}
                          className="hidden"
                          disabled={uploadingFiles}
                        />
                      </label>

                      <button
                        onClick={handleSaveGalleryOrderAndCaptions}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B2923] hover:bg-[#2A1D19] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-[#D5AA61]" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Photos Replacement Shortcuts */}
                  <div className="p-4 rounded-2xl bg-white border border-[#ECE0D1]">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#B85F43] block mb-3">
                      Quick Replace Feature Photographs
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      <label className="p-2.5 rounded-xl border border-dashed border-[#D5AA61] hover:bg-stone-50 cursor-pointer text-center block">
                        <span className="font-semibold block text-[#3B2923]">Hero Portrait</span>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {content.hero.heroImage ? 'Photo Attached' : 'Empty'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSectionPhotoUpload(e, 'hero')}
                          className="hidden"
                        />
                      </label>

                      <label className="p-2.5 rounded-xl border border-dashed border-[#D5AA61] hover:bg-stone-50 cursor-pointer text-center block">
                        <span className="font-semibold block text-[#3B2923]">Man Behind Smile</span>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {content.manBehindSmile.image ? 'Photo Attached' : 'Empty'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSectionPhotoUpload(e, 'manBehindSmile')}
                          className="hidden"
                        />
                      </label>

                      <label className="p-2.5 rounded-xl border border-dashed border-[#D5AA61] hover:bg-stone-50 cursor-pointer text-center block">
                        <span className="font-semibold block text-[#3B2923]">Big Brother</span>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {content.bigBrother.image ? 'Photo Attached' : 'Empty'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSectionPhotoUpload(e, 'bigBrother')}
                          className="hidden"
                        />
                      </label>

                      <label className="p-2.5 rounded-xl border border-dashed border-[#D5AA61] hover:bg-stone-50 cursor-pointer text-center block">
                        <span className="font-semibold block text-[#3B2923]">The Coach Dream</span>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {content.coach.image ? 'Photo Attached' : 'Empty'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSectionPhotoUpload(e, 'coach')}
                          className="hidden"
                        />
                      </label>

                      <label className="p-2.5 rounded-xl border border-dashed border-[#D5AA61] hover:bg-stone-50 cursor-pointer text-center block">
                        <span className="font-semibold block text-[#3B2923]">Grand Finale</span>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {content.finale.image ? 'Photo Attached' : 'Empty'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSectionPhotoUpload(e, 'finale')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Gallery Items Grid */}
                  {gallery.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {gallery.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-2xl bg-white border ${
                            item.hidden ? 'border-amber-300 opacity-60' : 'border-[#ECE0D1]'
                          } shadow-sm space-y-3`}
                        >
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100">
                            {item.type === 'video' ? (
                              <video src={item.url} className="w-full h-full object-cover" />
                            ) : (
                              <img src={item.url} alt="Young tribute memory" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button
                                onClick={() => handleToggleHideGalleryItem(item.id)}
                                className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black cursor-pointer"
                                title={item.hidden ? 'Restore photo' : 'Hide from public'}
                              >
                                {item.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleDeleteGalleryItem(item.id)}
                                className="p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-700 cursor-pointer"
                                title="Permanently delete from vault"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] uppercase font-bold text-stone-500 block">
                                Assigned Album
                              </label>
                              <select
                                value={item.albumId}
                                onChange={(e) => handleUpdateItemAlbum(item.id, e.target.value)}
                                className="w-full text-xs p-1.5 rounded-lg border border-[#ECE0D1] bg-stone-50 text-[#3B2923]"
                              >
                                {albums.map(a => (
                                  <option key={a.id} value={a.id}>{a.title}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-stone-500 block">
                                Caption (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="Add handwritten-style memory note..."
                                value={item.caption || ''}
                                onChange={(e) => handleUpdateItemCaption(item.id, e.target.value)}
                                className="w-full text-xs p-1.5 rounded-lg border border-[#ECE0D1] text-[#3B2923]"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center rounded-2xl bg-white border border-[#ECE0D1]">
                      <ImageIcon className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                      <p className="font-serif text-lg font-bold text-[#3B2923]">
                        No gallery photographs uploaded yet
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        Click "Upload Photos / Videos" above to add real photos of Young.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ALBUMS */}
              {activeTab === 'albums' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-[#ECE0D1]">
                    <h3 className="font-serif text-2xl font-bold text-[#3B2923]">
                      Albums & Categories
                    </h3>
                    <p className="text-xs text-stone-600">
                      Create, rename, and arrange custom memory collections.
                    </p>
                  </div>

                  {/* Add New Album */}
                  <div className="p-4 rounded-2xl bg-white border border-[#ECE0D1] flex flex-col sm:flex-row items-end gap-3">
                    <div className="flex-1 w-full">
                      <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
                        New Album Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Laugh Until It Hurts"
                        value={newAlbumTitle}
                        onChange={(e) => setNewAlbumTitle(e.target.value)}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-xs text-[#3B2923]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
                        Layout Style
                      </label>
                      <select
                        value={newAlbumLayout}
                        onChange={(e: any) => setNewAlbumLayout(e.target.value)}
                        className="p-2 rounded-xl border border-[#ECE0D1] text-xs bg-white text-[#3B2923]"
                      >
                        <option value="masonry">Masonry</option>
                        <option value="grid">Editorial Grid</option>
                        <option value="polaroid">Polaroid</option>
                        <option value="collage">Collage</option>
                      </select>
                    </div>

                    <button
                      onClick={handleAddAlbum}
                      className="px-4 py-2 bg-[#3B2923] hover:bg-[#2A1D19] text-white rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                    >
                      Add Album
                    </button>
                  </div>

                  {/* Current Albums List */}
                  <div className="space-y-3">
                    {albums.map((album, idx) => (
                      <div
                        key={album.id}
                        className="p-4 rounded-2xl bg-white border border-[#ECE0D1] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-[#3B2923]">
                            {idx + 1}
                          </span>
                          <div>
                            <input
                              type="text"
                              value={album.title}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                setAlbums(prev => prev.map(a => a.id === album.id ? { ...a, title: newTitle } : a));
                              }}
                              className="font-serif font-bold text-sm text-[#3B2923] border-b border-transparent hover:border-stone-300 focus:border-[#B85F43] focus:outline-none"
                            />
                            <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                              Layout: {album.layout || 'masonry'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteAlbum(album.id)}
                            className="p-2 text-stone-400 hover:text-red-600 cursor-pointer"
                            title="Delete Album"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={async () => {
                      if (!adminToken) return;
                      await api.saveAlbums(albums, adminToken);
                      showFeedback('Albums saved!');
                      onRefreshData();
                    }}
                    className="px-6 py-2.5 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
                  >
                    Save All Albums
                  </button>
                </div>
              )}

              {/* TAB 3: CONTENT & STORIES */}
              {activeTab === 'content' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-[#ECE0D1]">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#3B2923]">
                        Page Stories & Copywriting
                      </h3>
                      <p className="text-xs text-stone-600">
                        Edit headings, stories, personal letters, and finale statements.
                      </p>
                    </div>

                    <button
                      onClick={handleSaveContent}
                      disabled={isSaving}
                      className="px-5 py-2.5 bg-[#B85F43] hover:bg-[#9E4D34] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
                    >
                      Save All Content
                    </button>
                  </div>

                  {/* 1. Hero Section */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <span className="text-xs font-bold uppercase text-[#B85F43] block">
                      Opening Hero Section
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Headline</label>
                      <input
                        type="text"
                        value={content.hero.title}
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={content.hero.subtitle}
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Supporting Message</label>
                      <textarea
                        rows={2}
                        value={content.hero.supportingMessage}
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, supportingMessage: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                  </div>

                  {/* Section 1: Man Behind The Smile */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <span className="text-xs font-bold uppercase text-[#B85F43] block">
                      Section 1: The Man Behind The Smile
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Heading</label>
                      <input
                        type="text"
                        value={content.manBehindSmile.heading}
                        onChange={(e) => setContent({ ...content, manBehindSmile: { ...content.manBehindSmile, heading: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Subheading</label>
                      <input
                        type="text"
                        value={content.manBehindSmile.subheading}
                        onChange={(e) => setContent({ ...content, manBehindSmile: { ...content.manBehindSmile, subheading: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Featured Quote</label>
                      <textarea
                        rows={2}
                        value={content.manBehindSmile.quote}
                        onChange={(e) => setContent({ ...content, manBehindSmile: { ...content.manBehindSmile, quote: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Story Paragraphs (Separate with blank line)</label>
                      <textarea
                        rows={4}
                        value={content.manBehindSmile.paragraphs.join('\n\n')}
                        onChange={(e) => setContent({
                          ...content,
                          manBehindSmile: {
                            ...content.manBehindSmile,
                            paragraphs: e.target.value.split('\n\n').filter(p => p.trim().length > 0)
                          }
                        })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                  </div>

                  {/* Section 2: Big Brother */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <span className="text-xs font-bold uppercase text-[#B85F43] block">
                      Section 2: The Big Brother Everyone Needs
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Heading</label>
                      <input
                        type="text"
                        value={content.bigBrother.heading}
                        onChange={(e) => setContent({ ...content, bigBrother: { ...content.bigBrother, heading: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Featured Quote</label>
                      <textarea
                        rows={2}
                        value={content.bigBrother.quote}
                        onChange={(e) => setContent({ ...content, bigBrother: { ...content.bigBrother, quote: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Story Paragraphs (Separate with blank line)</label>
                      <textarea
                        rows={4}
                        value={content.bigBrother.paragraphs.join('\n\n')}
                        onChange={(e) => setContent({
                          ...content,
                          bigBrother: {
                            ...content.bigBrother,
                            paragraphs: e.target.value.split('\n\n').filter(p => p.trim().length > 0)
                          }
                        })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                  </div>

                  {/* Section 3: Values He Stands For */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <span className="text-xs font-bold uppercase text-[#B85F43] block">
                      Section 3: The Values He Stands For
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Heading</label>
                      <input
                        type="text"
                        value={content.values.heading}
                        onChange={(e) => setContent({ ...content, values: { ...content.values, heading: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Narrative Intro Paragraphs</label>
                      <textarea
                        rows={3}
                        value={content.values.intro.join('\n\n')}
                        onChange={(e) => setContent({
                          ...content,
                          values: {
                            ...content.values,
                            intro: e.target.value.split('\n\n').filter(p => p.trim().length > 0)
                          }
                        })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Closing Affirmation</label>
                      <textarea
                        rows={2}
                        value={content.values.closing}
                        onChange={(e) => setContent({ ...content, values: { ...content.values, closing: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                  </div>

                  {/* Section 4: The Coach Dream */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <span className="text-xs font-bold uppercase text-[#B85F43] block">
                      Section 4: The Coach He Is Becoming
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Heading</label>
                      <input
                        type="text"
                        value={content.coach.heading}
                        onChange={(e) => setContent({ ...content, coach: { ...content.coach, heading: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Story Paragraphs (Separate with blank line)</label>
                      <textarea
                        rows={6}
                        value={content.coach.paragraphs.join('\n\n')}
                        onChange={(e) => setContent({
                          ...content,
                          coach: {
                            ...content.coach,
                            paragraphs: e.target.value.split('\n\n').filter(p => p.trim().length > 0)
                          }
                        })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Closing Affirmation</label>
                      <textarea
                        rows={2}
                        value={content.coach.closing}
                        onChange={(e) => setContent({ ...content, coach: { ...content.coach, closing: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                  </div>

                  {/* Section 5: Dreams & Blessings */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <span className="text-xs font-bold uppercase text-[#B85F43] block">
                      Section 5: His Dreams For The Future
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Heading</label>
                      <input
                        type="text"
                        value={content.dreams.heading}
                        onChange={(e) => setContent({ ...content, dreams: { ...content.dreams, heading: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Paragraphs (Separate with blank line)</label>
                      <textarea
                        rows={3}
                        value={content.dreams.paragraphs.join('\n\n')}
                        onChange={(e) => setContent({
                          ...content,
                          dreams: {
                            ...content.dreams,
                            paragraphs: e.target.value.split('\n\n').filter(p => p.trim().length > 0)
                          }
                        })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Blessings (One per line)</label>
                      <textarea
                        rows={4}
                        value={content.dreams.blessings.join('\n')}
                        onChange={(e) => setContent({
                          ...content,
                          dreams: {
                            ...content.dreams,
                            blessings: e.target.value.split('\n').filter(b => b.trim().length > 0)
                          }
                        })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                  </div>

                  {/* 2. Personal Letter */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <span className="text-xs font-bold uppercase text-[#B85F43] block">
                      Section 10: My Personal Letter to Young
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Letter Heading</label>
                      <input
                        type="text"
                        value={content.letter.heading}
                        onChange={(e) => setContent({ ...content, letter: { ...content.letter, heading: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Salutation</label>
                      <input
                        type="text"
                        value={content.letter.salutation}
                        onChange={(e) => setContent({ ...content, letter: { ...content.letter, salutation: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Opening</label>
                      <textarea
                        rows={2}
                        value={content.letter.opening}
                        onChange={(e) => setContent({ ...content, letter: { ...content.letter, opening: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Letter Body</label>
                      <textarea
                        rows={6}
                        value={content.letter.body}
                        onChange={(e) => setContent({ ...content, letter: { ...content.letter, body: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm font-serif text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Signature</label>
                      <input
                        type="text"
                        value={content.letter.signature}
                        onChange={(e) => setContent({ ...content, letter: { ...content.letter, signature: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                  </div>

                  {/* 3. The Grand Finale */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <span className="text-xs font-bold uppercase text-[#B85F43] block">
                      Section 11: The Grand Finale
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Primary Message</label>
                      <input
                        type="text"
                        value={content.finale.messagePrimary}
                        onChange={(e) => setContent({ ...content, finale: { ...content.finale, messagePrimary: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Secondary Message</label>
                      <textarea
                        rows={3}
                        value={content.finale.messageSecondary}
                        onChange={(e) => setContent({ ...content, finale: { ...content.finale, messageSecondary: e.target.value } })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BIRTHDAY MESSAGES MODERATION */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-[#ECE0D1]">
                    <h3 className="font-serif text-2xl font-bold text-[#3B2923]">
                      Birthday Message Wall Moderation
                    </h3>
                    <p className="text-xs text-stone-600">
                      Review, approve, hide, or remove birthday wishes left by friends.
                    </p>
                  </div>

                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-2xl bg-white border ${
                            msg.status === 'approved'
                              ? 'border-emerald-200'
                              : msg.status === 'pending'
                              ? 'border-amber-300 bg-amber-50/30'
                              : 'border-stone-200 opacity-60'
                          } shadow-sm space-y-3`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-sm text-[#3B2923]">{msg.name}</span>
                              {msg.relationship && (
                                <span className="text-xs text-stone-500 ml-2">({msg.relationship})</span>
                              )}
                              <span className="text-[10px] text-stone-400 ml-3">{msg.date}</span>
                            </div>

                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                msg.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : msg.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-stone-200 text-stone-700'
                              }`}
                            >
                              {msg.status}
                            </span>
                          </div>

                          <p className="text-sm text-stone-800 whitespace-pre-line font-serif">
                            “{msg.message}”
                          </p>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                            {msg.status !== 'approved' && (
                              <button
                                onClick={() => handleMessageStatus(msg.id, 'approved')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Approve For Public Wall
                              </button>
                            )}

                            {msg.status !== 'hidden' && (
                              <button
                                onClick={() => handleMessageStatus(msg.id, 'hidden')}
                                className="px-3 py-1 bg-stone-200 text-stone-700 hover:bg-stone-300 rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Hide
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white rounded-2xl border border-[#ECE0D1]">
                      <p className="text-sm text-stone-500">No birthday messages submitted yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: TESTIMONIALS MODERATION */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-[#ECE0D1]">
                    <h3 className="font-serif text-2xl font-bold text-[#3B2923]">
                      Friend Testimonials Moderation
                    </h3>
                    <p className="text-xs text-stone-600">
                      Approve or edit long-form reflections submitted by friends.
                    </p>
                  </div>

                  {testimonials.length > 0 ? (
                    <div className="space-y-4">
                      {testimonials.map((t) => (
                        <div
                          key={t.id}
                          className={`p-4 rounded-2xl bg-white border ${
                            t.status === 'approved' ? 'border-emerald-200' : 'border-amber-300'
                          } shadow-sm space-y-3`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-sm text-[#3B2923]">{t.name}</span>
                              {t.relationship && (
                                <span className="text-xs text-stone-500 ml-2">({t.relationship})</span>
                              )}
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100">
                              {t.status}
                            </span>
                          </div>

                          <p className="text-sm text-stone-800 font-serif leading-relaxed">
                            “{t.message}”
                          </p>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                            {t.status !== 'approved' && (
                              <button
                                onClick={() => handleTestimonialStatus(t.id, 'approved')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Approve & Publish
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTestimonial(t.id)}
                              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white rounded-2xl border border-[#ECE0D1]">
                      <p className="text-sm text-stone-500">No testimonials submitted yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: MUSIC & VIDEO TRIBUTE */}
              {activeTab === 'music_video' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-[#ECE0D1]">
                    <h3 className="font-serif text-2xl font-bold text-[#3B2923]">
                      Soundtrack & Video Tribute Controls
                    </h3>
                    <p className="text-xs text-stone-600">
                      Configure background audio and video documentary link.
                    </p>
                  </div>

                  {/* Video Tribute Settings */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <span className="text-xs font-bold uppercase text-[#B85F43] block">
                      Video Tribute Section
                    </span>

                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Video URL or Hosted Link (YouTube, Vimeo, or MP4)
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={content.videoTribute.videoUrl || ''}
                        onChange={(e) => setContent({
                          ...content,
                          videoTribute: { ...content.videoTribute, videoUrl: e.target.value }
                        })}
                        className="w-full p-2.5 rounded-xl border border-[#ECE0D1] text-xs font-mono text-[#3B2923]"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer border border-stone-300">
                        <span>Upload MP4 Video File Directly</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleSectionPhotoUpload(e, 'videoTribute')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Background Music Settings */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#B85F43] block">
                        Background Music Controls
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={content.music.enabled}
                          onChange={(e) => setContent({
                            ...content,
                            music: { ...content.music, enabled: e.target.checked }
                          })}
                        />
                        <span>Enable Music Feature</span>
                      </label>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Track Title
                      </label>
                      <input
                        type="text"
                        value={content.music.title}
                        onChange={(e) => setContent({
                          ...content,
                          music: { ...content.music, title: e.target.value }
                        })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-xs text-[#3B2923]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Audio File Link / Custom MP3
                      </label>
                      <input
                        type="text"
                        placeholder="Leave blank for warm ambient acoustic synthesizer, or paste MP3 URL"
                        value={content.music.audioUrl}
                        onChange={(e) => setContent({
                          ...content,
                          music: { ...content.music, audioUrl: e.target.value }
                        })}
                        className="w-full p-2 rounded-xl border border-[#ECE0D1] text-xs font-mono text-[#3B2923]"
                      />
                    </div>

                    <div>
                      <label className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer border border-stone-300 inline-block">
                        <span>Upload Custom Celebration MP3</span>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleSectionPhotoUpload(e, 'music')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveContent}
                    className="px-6 py-2.5 bg-[#3B2923] hover:bg-[#2A1D19] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
                  >
                    Save Music & Video Settings
                  </button>
                </div>
              )}

              {/* TAB 7: SETTINGS & PASSCODE */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-md">
                  <div className="pb-4 border-b border-[#ECE0D1]">
                    <h3 className="font-serif text-2xl font-bold text-[#3B2923]">
                      Administrator Security
                    </h3>
                    <p className="text-xs text-stone-600">
                      Update the curator passcode used to unlock this panel.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#ECE0D1] space-y-4">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        New Passcode (Min 4 characters)
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new passcode..."
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#ECE0D1] text-sm text-[#3B2923]"
                      />
                    </div>

                    <button
                      onClick={handleChangePasscode}
                      className="px-4 py-2 bg-[#3B2923] hover:bg-[#2A1D19] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Update Passcode
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
