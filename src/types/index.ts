export interface HeroSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  supportingMessage: string;
  buttonText: string;
  heroImage: string;
  badgeText: string;
}

export interface StorySection {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  quote?: string;
  image?: string;
  caption?: string;
}

export interface ValuesSection {
  heading: string;
  intro: string[];
  closing: string;
  coreValues: {
    title: string;
    description: string;
    tag: string;
  }[];
}

export interface CoachSection {
  heading: string;
  paragraphs: string[];
  image?: string;
  closing?: string;
  qualities?: string[];
}

export interface DreamsSection {
  heading: string;
  paragraphs: string[];
  blessings: string[];
  image?: string;
}

export interface LetterSection {
  heading: string;
  salutation: string;
  opening: string;
  body: string;
  closing: string;
  signature: string;
  letterDate?: string;
}

export interface VideoTributeSection {
  heading: string;
  subheading: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  title: string;
  description: string;
}

export interface FinaleSection {
  tagline: string;
  title: string;
  messagePrimary: string;
  messageSecondary: string;
  buttonText: string;
  footerCredit: string;
  image?: string;
}

export interface ThemeSettings {
  palette: 'warm-earth' | 'terracotta';
  accentColor: string;
}

export interface MusicSettings {
  enabled: boolean;
  audioUrl: string;
  title: string;
  artist: string;
  volume: number;
}

export interface GalleryItem {
  id: string;
  albumId: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
  caption?: string;
  date?: string;
  featured?: boolean;
  hidden?: boolean;
  order: number;
  tags?: string[];
}

export interface Album {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  order: number;
  layout?: 'grid' | 'masonry' | 'polaroid' | 'collage';
}

export interface Testimonial {
  id: string;
  name: string;
  relationship?: string;
  photoUrl?: string;
  message: string;
  highlight?: string;
  date: string;
  status: 'approved' | 'pending' | 'hidden';
  featured?: boolean;
}

export interface BirthdayMessage {
  id: string;
  name: string;
  relationship?: string;
  message: string;
  photoUrl?: string;
  videoUrl?: string;
  date: string;
  status: 'approved' | 'pending' | 'hidden';
  featured?: boolean;
}

export interface SiteContent {
  hero: HeroSection;
  manBehindSmile: StorySection;
  bigBrother: StorySection;
  values: ValuesSection;
  coach: CoachSection;
  dreams: DreamsSection;
  letter: LetterSection;
  videoTribute: VideoTributeSection;
  finale: FinaleSection;
  theme: ThemeSettings;
  music: MusicSettings;
}
