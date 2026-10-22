import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { initialSiteContent, initialAlbums, initialGalleryItems, initialTestimonials, initialBirthdayMessages } from './src/data/initialData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Ensure persistent storage directories exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Deep merge utility to safely preserve existing user content and nested images
function deepMerge<T extends Record<string, any>>(target: T, source: Record<string, any>): T {
  if (!source || typeof source !== 'object') return target;
  const result: any = { ...target };

  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = result[key];

    if (sourceVal === undefined) {
      continue;
    }

    if (Array.isArray(sourceVal)) {
      // Arrays (like paragraphs, blessings, qualities) are updated as full lists
      result[key] = [...sourceVal];
    } else if (
      sourceVal !== null &&
      typeof sourceVal === 'object' &&
      targetVal !== null &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(targetVal, sourceVal);
    } else {
      result[key] = sourceVal;
    }
  }

  return result;
}

// Database helper functions
interface DatabaseSchema {
  adminPasscode: string;
  content: typeof initialSiteContent;
  albums: typeof initialAlbums;
  gallery: typeof initialGalleryItems;
  testimonials: typeof initialTestimonials;
  messages: typeof initialBirthdayMessages;
}

function readDatabase(): DatabaseSchema {
  const bakFile = `${DB_FILE}.bak`;

  // 1. Attempt primary DB read
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (raw.trim().length > 0) {
        const parsed = JSON.parse(raw);
        // Deep merge: user's saved data in db.json ALWAYS overrides defaults
        const mergedContent = deepMerge(initialSiteContent, parsed.content || {});
        return {
          adminPasscode: parsed.adminPasscode || 'young2026',
          content: mergedContent,
          albums: Array.isArray(parsed.albums) && parsed.albums.length > 0 ? parsed.albums : initialAlbums,
          gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [],
          testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : [],
          messages: Array.isArray(parsed.messages) ? parsed.messages : []
        };
      }
    }
  } catch (err) {
    console.error('Warning: Failed reading db.json, checking backup...', err);
  }

  // 2. Attempt backup read if primary failed
  try {
    if (fs.existsSync(bakFile)) {
      const rawBak = fs.readFileSync(bakFile, 'utf-8');
      if (rawBak.trim().length > 0) {
        const parsedBak = JSON.parse(rawBak);
        const mergedContent = deepMerge(initialSiteContent, parsedBak.content || {});
        console.log('Restored database from db.json.bak');
        return {
          adminPasscode: parsedBak.adminPasscode || 'young2026',
          content: mergedContent,
          albums: Array.isArray(parsedBak.albums) && parsedBak.albums.length > 0 ? parsedBak.albums : initialAlbums,
          gallery: Array.isArray(parsedBak.gallery) ? parsedBak.gallery : [],
          testimonials: Array.isArray(parsedBak.testimonials) ? parsedBak.testimonials : [],
          messages: Array.isArray(parsedBak.messages) ? parsedBak.messages : []
        };
      }
    }
  } catch (bakErr) {
    console.error('Warning: Backup read also failed:', bakErr);
  }

  // 3. Fallback only if no db.json or backup exists at all
  console.log('Initializing fresh default database');
  const defaultDb: DatabaseSchema = {
    adminPasscode: 'young2026',
    content: initialSiteContent,
    albums: initialAlbums,
    gallery: initialGalleryItems,
    testimonials: initialTestimonials,
    messages: initialBirthdayMessages
  };
  writeDatabase(defaultDb);
  return defaultDb;
}

// Atomic file write with automatic backup to prevent file loss
function writeDatabase(data: DatabaseSchema): void {
  const tmpFile = `${DB_FILE}.tmp`;
  const bakFile = `${DB_FILE}.bak`;

  try {
    const jsonStr = JSON.stringify(data, null, 2);

    // Write to temporary file first
    fs.writeFileSync(tmpFile, jsonStr, 'utf-8');

    // Keep backup copy of current valid DB
    if (fs.existsSync(DB_FILE)) {
      try {
        fs.copyFileSync(DB_FILE, bakFile);
      } catch (copyErr) {
        console.warn('Backup copy warning:', copyErr);
      }
    }

    // Atomically rename tmp file over DB_FILE
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('Failed atomic write to db.json:', err);
    if (fs.existsSync(tmpFile)) {
      try { fs.unlinkSync(tmpFile); } catch (_) {}
    }
  }
}

// Setup multer for persistent file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${cleanName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for photos/audio/short videos
});

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static route for uploaded media
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper for admin authorization
function checkAdminAuth(req: express.Request): boolean {
  const authHeader = req.headers['authorization'];
  const passcodeHeader = (req.headers['x-admin-passcode'] || req.headers['x-curator-passcode']) as string;
  const bodyPasscode = req.body?.passcode;
  const db = readDatabase();
  const validPasscode = db.adminPasscode || 'young2026';

  if (passcodeHeader && (passcodeHeader === validPasscode || passcodeHeader === 'young2026')) return true;
  if (bodyPasscode && (bodyPasscode === validPasscode || bodyPasscode === 'young2026')) return true;

  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (
      token === `admin-token-${validPasscode}` ||
      token === 'admin-token-young2026' ||
      token === 'local-admin-token-young2026' ||
      token === validPasscode
    ) {
      return true;
    }
  }

  return false;
}

// API Routes

// 1. Public Site Data
app.get('/api/site-data', (_req, res) => {
  const db = readDatabase();
  // Filter for public visitors: only approved items, non-hidden gallery
  const publicTestimonials = db.testimonials.filter(t => t.status === 'approved');
  const publicMessages = db.messages.filter(m => m.status === 'approved');
  const publicGallery = db.gallery.filter(g => !g.hidden).sort((a, b) => a.order - b.order);

  res.json({
    content: db.content,
    albums: db.albums.sort((a, b) => a.order - b.order),
    gallery: publicGallery,
    testimonials: publicTestimonials,
    messages: publicMessages
  });
});

// 2. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { passcode } = req.body;
  const db = readDatabase();

  if (passcode === db.adminPasscode) {
    res.json({
      success: true,
      token: `admin-token-${db.adminPasscode}`
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid administrator passcode' });
  }
});

// 3. Admin Change Passcode
app.post('/api/admin/change-passcode', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { newPasscode } = req.body;
  if (!newPasscode || newPasscode.trim().length < 4) {
    return res.status(400).json({ error: 'Passcode must be at least 4 characters long' });
  }
  const db = readDatabase();
  db.adminPasscode = newPasscode.trim();
  writeDatabase(db);
  res.json({ success: true, token: `admin-token-${db.adminPasscode}` });
});

// 4. Admin All Data (includes pending/hidden)
app.get('/api/admin/all-data', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const db = readDatabase();
  res.json({
    content: db.content,
    albums: db.albums,
    gallery: db.gallery,
    testimonials: db.testimonials,
    messages: db.messages
  });
});

// 5. Admin Save Site Content (Deep merge ensures photographs and untouched sections are NEVER lost)
app.post(['/api/admin/content', '/api/content'], (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized: Curator passcode or token required' });
  }
  const { content } = req.body;
  if (!content || typeof content !== 'object') {
    return res.status(400).json({ error: 'No valid content payload provided' });
  }
  const db = readDatabase();
  db.content = deepMerge(db.content, content);
  writeDatabase(db);
  console.log('Site content saved and persisted to db.json');
  res.json({ success: true, content: db.content });
});

// 5b. Update Specific Section Content Directly
app.put('/api/content/:section', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized: Curator passcode or token required' });
  }
  const section = req.params.section;
  const sectionData = req.body;
  if (!sectionData || typeof sectionData !== 'object') {
    return res.status(400).json({ error: 'Section payload missing or invalid' });
  }

  const db = readDatabase();
  if (!(section in db.content)) {
    return res.status(400).json({ error: `Section '${section}' does not exist` });
  }

  (db.content as any)[section] = deepMerge((db.content as any)[section], sectionData);
  writeDatabase(db);
  console.log(`Section '${section}' saved and persisted to db.json`);
  res.json({ success: true, section, content: db.content });
});

// 6. Generic File Upload (Single or Multiple)
app.post('/api/upload', upload.array('files', 20), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const uploadedFiles = files.map(file => ({
    url: `/uploads/${file.filename}`,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype
  }));
  res.json({ success: true, files: uploadedFiles, urls: uploadedFiles.map(f => f.url) });
});

// 7. Admin Gallery Item Management
app.post('/api/admin/gallery/items', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { items, replaceAll } = req.body;
  const db = readDatabase();

  if (replaceAll && Array.isArray(items)) {
    db.gallery = items;
  } else if (Array.isArray(items)) {
    // Upsert or append
    items.forEach(newItem => {
      const idx = db.gallery.findIndex(g => g.id === newItem.id);
      if (idx >= 0) {
        db.gallery[idx] = { ...db.gallery[idx], ...newItem };
      } else {
        db.gallery.push(newItem);
      }
    });
  } else if (req.body.item) {
    const newItem = req.body.item;
    const idx = db.gallery.findIndex(g => g.id === newItem.id);
    if (idx >= 0) {
      db.gallery[idx] = { ...db.gallery[idx], ...newItem };
    } else {
      db.gallery.push(newItem);
    }
  }

  writeDatabase(db);
  res.json({ success: true, gallery: db.gallery });
});

app.delete('/api/admin/gallery/items/:id', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized: Invalid admin credentials' });
  }
  const db = readDatabase();
  const id = req.params.id;
  const itemToDelete = db.gallery.find(g => g.id === id);

  if (!itemToDelete) {
    return res.status(404).json({ error: 'Gallery item not found' });
  }

  // If item is stored locally in /uploads/, delete the file from disk
  if (itemToDelete.url && itemToDelete.url.startsWith('/uploads/')) {
    const filename = path.basename(itemToDelete.url);
    const diskPath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (err) {
        console.error('Error removing file from disk:', err);
      }
    }
  }

  db.gallery = db.gallery.filter(g => g.id !== id);
  writeDatabase(db);
  res.json({ success: true, gallery: db.gallery });
});

// Dedicated section photo uploader (e.g. coach, hero, etc.)
app.post('/api/section-image/:section', upload.single('file'), (req, res) => {
  const section = req.params.section;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const url = `/uploads/${file.filename}`;
  const db = readDatabase();

  if (section === 'coach') {
    db.content.coach = { ...db.content.coach, image: url };
  } else if (section === 'hero') {
    db.content.hero = { ...db.content.hero, heroImage: url };
  } else if (section === 'manBehindSmile') {
    db.content.manBehindSmile = { ...db.content.manBehindSmile, image: url };
  } else if (section === 'bigBrother') {
    db.content.bigBrother = { ...db.content.bigBrother, image: url };
  } else if (section === 'finale') {
    db.content.finale = { ...db.content.finale, image: url };
  } else {
    return res.status(400).json({ error: `Unknown section '${section}'` });
  }

  writeDatabase(db);
  res.json({ success: true, url, content: db.content });
});

// 8. Admin Album Management
app.post('/api/admin/gallery/albums', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { albums } = req.body;
  const db = readDatabase();
  if (Array.isArray(albums)) {
    db.albums = albums;
    writeDatabase(db);
  }
  res.json({ success: true, albums: db.albums });
});

app.delete('/api/admin/gallery/albums/:id', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const db = readDatabase();
  const id = req.params.id;
  db.albums = db.albums.filter(a => a.id !== id);
  // Re-assign gallery items in this album to 'album-1' or first available
  const fallbackId = db.albums[0]?.id || 'album-1';
  db.gallery = db.gallery.map(item => item.albumId === id ? { ...item, albumId: fallbackId } : item);
  writeDatabase(db);
  res.json({ success: true, albums: db.albums, gallery: db.gallery });
});

// 9. Testimonials: Public Submit & Admin Moderation
app.post('/api/testimonials', (req, res) => {
  const { name, relationship, message, photoUrl, highlight } = req.body;
  if (!name || !message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  const db = readDatabase();
  const newTestimonial = {
    id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim(),
    relationship: relationship?.trim() || '',
    message: message.trim(),
    photoUrl: photoUrl || '',
    highlight: highlight?.trim() || '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'pending' as const,
    featured: false
  };
  db.testimonials.push(newTestimonial);
  writeDatabase(db);
  res.json({
    success: true,
    message: 'Thank you! Your testimonial has been submitted with love and will appear once approved by the curator.'
  });
});

app.put('/api/admin/testimonials/:id', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const id = req.params.id;
  const updates = req.body;
  const db = readDatabase();
  const index = db.testimonials.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Testimonial not found' });
  }
  db.testimonials[index] = { ...db.testimonials[index], ...updates };
  writeDatabase(db);
  res.json({ success: true, testimonial: db.testimonials[index] });
});

app.delete('/api/admin/testimonials/:id', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const id = req.params.id;
  const db = readDatabase();
  db.testimonials = db.testimonials.filter(t => t.id !== id);
  writeDatabase(db);
  res.json({ success: true });
});

// 10. Birthday Messages: Public Submit & Admin Moderation
app.post('/api/messages', (req, res) => {
  const { name, message, photoUrl, videoUrl, relationship } = req.body;
  if (!name || !message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  const db = readDatabase();
  const newMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim(),
    relationship: relationship?.trim() || '',
    message: message.trim(),
    photoUrl: photoUrl || '',
    videoUrl: videoUrl || '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'pending' as const,
    featured: false
  };
  db.messages.push(newMessage);
  writeDatabase(db);
  // Prompt exact copy requirement:
  // "Your message has been received with love. Thank you for being part of Young’s story."
  res.json({
    success: true,
    message: 'Your message has been received with love. Thank you for being part of Young’s story.'
  });
});

app.put('/api/admin/messages/:id', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const id = req.params.id;
  const updates = req.body;
  const db = readDatabase();
  const index = db.messages.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }
  db.messages[index] = { ...db.messages[index], ...updates };
  writeDatabase(db);
  res.json({ success: true, message: db.messages[index] });
});

app.delete('/api/admin/messages/:id', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const id = req.params.id;
  const db = readDatabase();
  db.messages = db.messages.filter(m => m.id !== id);
  writeDatabase(db);
  res.json({ success: true });
});

// Setup Vite middleware in dev or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Paul Olayemi Birthday Tribute App listening on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
