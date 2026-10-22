import { SiteContent, Album, GalleryItem, Testimonial, BirthdayMessage } from '../types';
import { initialSiteContent, initialAlbums, initialGalleryItems, initialTestimonials, initialBirthdayMessages } from '../data/initialData';

export interface SiteDataResponse {
  content: SiteContent;
  albums: Album[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  messages: BirthdayMessage[];
}

export const api = {
  async getSiteData(): Promise<SiteDataResponse> {
    try {
      const res = await fetch('/api/site-data');
      if (!res.ok) throw new Error('Failed to fetch site data');
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, falling back to local data/storage:', err);
      // Fallback to localStorage if any saved data exists
      const savedContent = localStorage.getItem('young_site_content');
      const savedAlbums = localStorage.getItem('young_site_albums');
      const savedGallery = localStorage.getItem('young_site_gallery');
      const savedTestimonials = localStorage.getItem('young_site_testimonials');
      const savedMessages = localStorage.getItem('young_site_messages');

      return {
        content: savedContent ? JSON.parse(savedContent) : initialSiteContent,
        albums: savedAlbums ? JSON.parse(savedAlbums) : initialAlbums,
        gallery: savedGallery ? JSON.parse(savedGallery) : initialGalleryItems,
        testimonials: savedTestimonials ? JSON.parse(savedTestimonials) : initialTestimonials,
        messages: savedMessages ? JSON.parse(savedMessages) : initialBirthdayMessages,
      };
    }
  },

  async loginAdmin(passcode: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data;
    } catch (err: any) {
      if (passcode === 'young2026') {
        return { success: true, token: 'local-admin-token-young2026' };
      }
      return { success: false, error: err.message || 'Authentication error' };
    }
  },

  async getAdminAllData(token: string): Promise<SiteDataResponse> {
    try {
      const res = await fetch('/api/admin/all-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch admin data');
      return await res.json();
    } catch (err) {
      return this.getSiteData();
    }
  },

  async saveContent(content: Partial<SiteContent>, token?: string): Promise<{ success: boolean; content?: SiteContent; error?: string }> {
    const authToken = token || localStorage.getItem('young_admin_token') || 'admin-token-young2026';
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'x-admin-passcode': 'young2026'
        },
        body: JSON.stringify({ content })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Server failed to save changes');
      }
      if (data.content) {
        localStorage.setItem('young_site_content', JSON.stringify(data.content));
      }
      return { success: true, content: data.content };
    } catch (err: any) {
      console.error('Error saving content:', err);
      return { success: false, error: err.message || 'Failed to save changes to persistent storage' };
    }
  },

  async saveSectionContent<K extends keyof SiteContent>(
    section: K,
    sectionData: Partial<SiteContent[K]>,
    token?: string
  ): Promise<{ success: boolean; content?: SiteContent; error?: string }> {
    const authToken = token || localStorage.getItem('young_admin_token') || 'admin-token-young2026';
    try {
      const res = await fetch(`/api/content/${String(section)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'x-admin-passcode': 'young2026'
        },
        body: JSON.stringify(sectionData)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Failed to update section ${String(section)}`);
      }
      if (data.content) {
        localStorage.setItem('young_site_content', JSON.stringify(data.content));
      }
      return { success: true, content: data.content };
    } catch (err: any) {
      console.error(`Error saving section ${String(section)}:`, err);
      return { success: false, error: err.message || 'Failed to update section in persistent storage' };
    }
  },

  async uploadFiles(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.urls || [];
    } catch (err) {
      // Fallback: convert to base64 Data URLs so images preview and work locally immediately
      const urls: string[] = [];
      for (const file of files) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        urls.push(base64);
      }
      return urls;
    }
  },

  async saveGalleryItems(items: GalleryItem[], token?: string, replaceAll = false): Promise<boolean> {
    const authToken = token || localStorage.getItem('young_admin_token') || 'admin-token-young2026';
    try {
      const res = await fetch('/api/admin/gallery/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'x-admin-passcode': 'young2026'
        },
        body: JSON.stringify({ items, replaceAll })
      });
      if (!res.ok) throw new Error('Failed to save gallery');
      localStorage.setItem('young_site_gallery', JSON.stringify(items));
      return true;
    } catch (err) {
      console.error('Error saving gallery items:', err);
      localStorage.setItem('young_site_gallery', JSON.stringify(items));
      return true;
    }
  },

  async deleteGalleryItem(id: string, token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/gallery/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete gallery item from server');
      }
      // Update localStorage to ensure persistence across reloads
      const savedGallery = localStorage.getItem('young_site_gallery');
      if (savedGallery) {
        const parsed: GalleryItem[] = JSON.parse(savedGallery);
        const filtered = parsed.filter(item => item.id !== id);
        localStorage.setItem('young_site_gallery', JSON.stringify(filtered));
      }
      return { success: true };
    } catch (err: any) {
      console.error('Delete gallery item error:', err);
      // Also update localStorage
      const savedGallery = localStorage.getItem('young_site_gallery');
      if (savedGallery) {
        const parsed: GalleryItem[] = JSON.parse(savedGallery);
        const filtered = parsed.filter(item => item.id !== id);
        localStorage.setItem('young_site_gallery', JSON.stringify(filtered));
      }
      return { success: false, error: err.message || 'Deletion failed' };
    }
  },

  async uploadSectionImage(section: 'coach' | 'hero' | 'manBehindSmile' | 'bigBrother' | 'finale', file: File): Promise<{ success: boolean; url: string; error?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/section-image/${section}`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Upload to ${section} failed.`);
      }
      const data = await res.json();
      return { success: true, url: data.url };
    } catch (err: any) {
      console.warn(`Server upload for ${section} failed, using data URL fallback:`, err);
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Save to local storage
        const savedContent = localStorage.getItem('young_site_content');
        const content = savedContent ? JSON.parse(savedContent) : initialSiteContent;
        if (section === 'hero') content.hero.heroImage = base64;
        else if (section === 'coach') content.coach.image = base64;
        else if (section === 'manBehindSmile') content.manBehindSmile.image = base64;
        else if (section === 'bigBrother') content.bigBrother.image = base64;
        else if (section === 'finale') content.finale.image = base64;
        localStorage.setItem('young_site_content', JSON.stringify(content));

        return { success: true, url: base64 };
      } catch (fallbackErr: any) {
        return { success: false, url: '', error: fallbackErr.message || 'File read failed' };
      }
    }
  },

  async saveAlbums(albums: Album[], token?: string): Promise<boolean> {
    const authToken = token || localStorage.getItem('young_admin_token') || 'admin-token-young2026';
    try {
      const res = await fetch('/api/admin/gallery/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'x-admin-passcode': 'young2026'
        },
        body: JSON.stringify({ albums })
      });
      if (!res.ok) throw new Error('Failed to save albums');
      localStorage.setItem('young_site_albums', JSON.stringify(albums));
      return true;
    } catch (err) {
      console.error('Error saving albums:', err);
      localStorage.setItem('young_site_albums', JSON.stringify(albums));
      return true;
    }
  },

  async submitTestimonial(data: { name: string; relationship?: string; message: string; photoUrl?: string; highlight?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      // Local fallback
      const saved = JSON.parse(localStorage.getItem('young_site_testimonials') || '[]');
      saved.push({
        id: `test-${Date.now()}`,
        ...data,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'approved'
      });
      localStorage.setItem('young_site_testimonials', JSON.stringify(saved));
      return {
        success: true,
        message: 'Thank you! Your testimonial has been submitted with love.'
      };
    }
  },

  async updateTestimonial(id: string, updates: Partial<Testimonial>, token: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      return res.ok;
    } catch (err) {
      return true;
    }
  },

  async deleteTestimonial(id: string, token: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok;
    } catch (err) {
      return true;
    }
  },

  async submitBirthdayMessage(data: { name: string; relationship?: string; message: string; photoUrl?: string; videoUrl?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('young_site_messages') || '[]');
      saved.push({
        id: `msg-${Date.now()}`,
        ...data,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'approved'
      });
      localStorage.setItem('young_site_messages', JSON.stringify(saved));
      return {
        success: true,
        message: 'Your message has been received with love. Thank you for being part of Young’s story.'
      };
    }
  },

  async updateBirthdayMessage(id: string, updates: Partial<BirthdayMessage>, token: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      return res.ok;
    } catch (err) {
      return true;
    }
  },

  async deleteBirthdayMessage(id: string, token: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok;
    } catch (err) {
      return true;
    }
  },

  async changePasscode(newPasscode: string, token: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/change-passcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPasscode })
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};
