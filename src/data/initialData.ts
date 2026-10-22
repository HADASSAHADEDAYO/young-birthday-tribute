import { SiteContent, Album, GalleryItem, Testimonial, BirthdayMessage } from '../types';

export const initialSiteContent: SiteContent = {
  hero: {
    eyebrow: 'A SPECIAL CELEBRATION OF A REMARKABLE PERSON',
    title: 'HAPPY BIRTHDAY, PAUL OLAYEMI!',
    subtitle: 'Big energy. Bigger heart. Unforgettable memories.',
    supportingMessage: 'Today, we celebrate the person you are, the memories you’ve given us, the lives you touch, and the beautiful future you are working towards.',
    buttonText: 'ENTER THE CELEBRATION',
    heroImage: '', // Can be uploaded via Admin or Inline Editor
    badgeText: 'Affectionately known as “Young”'
  },
  manBehindSmile: {
    heading: 'A ROOM IS NEVER QUITE THE SAME WHEN YOUNG IS THERE.',
    subheading: 'Energy. Warmth. Unfiltered Joy.',
    quote: '“He is vibrant, lively, energetic, and almost impossible to be around without catching a little of his happiness.”',
    paragraphs: [
      'If there is one thing you should know about Young, it is that he brings an energy of his own wherever he goes.',
      'He is vibrant, lively, energetic, and almost impossible to be around without catching a little of his happiness. Put Young in a room, and chances are, laughter will soon follow. He has that special way of making people feel comfortable, turning ordinary moments into memorable ones, and reminding everyone that life can be a little lighter when you have the right people around you.',
      'But beyond the laughter and lively personality is a genuinely lovable person. Young brings warmth into friendships and has a presence that makes people glad to have him around.',
      'He is fun, but he is also dependable. He knows how to make people laugh, but he also knows when to stand beside them. There is a beautiful balance in him: the vibrant friend who brings the fun and the protective big brother who makes sure his people are okay.',
      'Young is not just someone you have fun with. He is someone you feel you have in your corner.'
    ],
    image: '',
    caption: 'Vibrant energy, genuine warmth.'
  },
  bigBrother: {
    heading: 'A BIG HEART. A STRONG BACKBONE. A BROTHER IN EVERY SENSE.',
    subheading: 'Loyalty. Honesty. Unwavering Support.',
    quote: '“A friend by choice. A brother by heart. A protector by nature.”',
    paragraphs: [
      'Some people become friends. Others become family without even trying.',
      'Young has that big-brother energy that makes people feel they are not entirely alone in whatever life brings. He is protective of the people he cares about, looks out for his friends, and carries a kind of loyalty that goes beyond convenience.',
      'When he cares about you, he shows up. His loyalty is not the sort that disappears when things become uncomfortable. He stands by his people, and he takes friendship seriously.',
      'But one of the things that makes Young special is that his loyalty does not mean he will agree with everything you do.',
      'If you are making a mistake or heading in the wrong direction, he is the kind of person who will tell you to your face. He would rather correct you honestly than watch you continue doing something foolish just to keep the peace.',
      'That honesty may not always be the easiest thing to hear, but it comes with something valuable: the willingness to be real with the people he cares about.',
      'Young is the friend who laughs with you, stands up for you, checks on you, protects you, and tells you the truth when you need to hear it.',
      'He reminds us that real brotherhood is not only about being present for the good times. It is also about caring enough to speak up, staying loyal when things get difficult, and wanting the people around you to become better.'
    ],
    image: '',
    caption: 'Standing tall with the people he calls family.'
  },
  values: {
    heading: 'A MAN WHO KNOWS WHAT HE STANDS FOR.',
    intro: [
      'For Young, character matters.',
      'He values honour, respect, and integrity. He believes that the way a person lives, treats others, and keeps their word says something important about who they are.',
      'Respect is important to him, not simply as a matter of words, but as a principle that should be reflected in how people relate to one another.',
      'Integrity matters because character should not disappear when nobody is watching. To Young, being a person of principle means making choices that align with what you believe, even when those choices are not necessarily the easiest or most popular.'
    ],
    closing: 'Young’s values are part of his story. They remind us that a person’s character is shaped not only by their ambitions, but also by the principles they choose to uphold along the way. Because who you become matters just as much as what you achieve.',
    coreValues: [
      {
        title: 'Honour',
        description: 'Upholding word, dignity, and treating every encounter with genuine regard.',
        tag: 'Principle'
      },
      {
        title: 'Respect',
        description: 'Not merely polite words, but an active principle reflected in how he relates to everyone.',
        tag: 'Foundation'
      },
      {
        title: 'Integrity',
        description: 'Character that remains constant even when nobody is looking or checking.',
        tag: 'Pillar'
      }
    ]
  },
  coach: {
    heading: 'There’s Something Special About the Dream You’re Chasing.',
    paragraphs: [
      'Young, one of the things I admire about you is that you have a vision for yourself. You want to become a coach, and I hope you never lose sight of that dream.',
      'When I think about you, I think about the energy you bring wherever you go, the way you show up for your friends, and that big-brother side of you that makes people feel like they have someone in their corner.',
      'You are the kind of person who can make people laugh and still tell them the truth when they need to hear it. You care about the people around you, and you are not afraid to correct someone when you believe they are getting things wrong.',
      'Those are parts of you that make this dream worth celebrating.',
      'I know that becoming the coach you want to be will take learning, patience, experience, and plenty of work. There will be things to figure out along the way, and there will be moments when you have to remind yourself why you started.',
      'But I hope that, as you grow, you keep the qualities that make you Young. Keep your heart for people. Keep your honesty. Keep showing up. Keep learning, even when it is uncomfortable, and give yourself the chance to become everything you see for yourself.',
      'I hope one day you will look back at where you started and feel proud that you kept going.',
      'And when that dream begins to take shape, I hope you remember that there were people who believed in you before the journey was complete.',
      'For now, this is a celebration of the dream, the person chasing it, and everything that still lies ahead.'
    ],
    closing: 'Young, I am rooting for you. I hope you become the kind of coach you would be proud to call yourself.',
    qualities: [
      'Heart for People',
      'Honesty & Truth',
      'Presence & Energy',
      'Big-Brother Loyalty'
    ],
    image: ''
  },
  dreams: {
    heading: 'MAY THE MAN YOU DREAM OF BECOMING MAKE YOU PROUD.',
    paragraphs: [
      'Young, your story is still being written, and the best part is that you hold the pen.',
      'As the years go by, I hope you never lose that spark—the genuine warmth, the easy laughter, and the way you always look out for your people.',
      'I hope you grow into the man you’ve always envisioned: someone who stands firm in who he is, leads with kindness, and touches lives simply by being himself.',
      'Whatever comes next, keep showing up as Young. We’re proud of the man you are today, and we can’t wait to see the man you’ll become tomorrow.'
    ],
    blessings: [
      'May your journey be filled with good friends who value your loyalty and stand beside you.',
      'May you find opportunities that challenge you to grow and sharpen your natural gifts.',
      'May you have moments of quiet satisfaction where you look around and know you’re right where you belong.',
      'May your faith in your dreams stay stronger than any doubt along the way.'
    ],
    image: ''
  },
  letter: {
    heading: 'THERE ARE THINGS A SIMPLE BIRTHDAY TEXT CANNOT SAY.',
    salutation: 'Dear Young,',
    opening: 'Today, I wanted to give you something a little different — something that holds memories, celebrates the person you are, and reminds you that your story matters.',
    body: 'This is a little collection of love, laughter, gratitude, and good wishes from the people who are happy to be part of your journey.\n\nYou have an uncommon knack for brightening every space you enter, reminding us of the goodness in genuine loyalty and brotherhood. In a world where people often take the easiest route, you choose character, honesty, and depth.\n\nThank you for every moment you made us laugh until our ribs ached, for every word of truth spoken in love, and for being the kind of friend who feels like family.',
    closing: 'With love and respect on your special day,',
    signature: 'From someone who celebrates you, today and always.',
    letterDate: 'Birthday Edition'
  },
  videoTribute: {
    heading: 'LAUGHTER. LOVE. MEMORIES. PRESS PLAY.',
    subheading: 'A cinematic tribute to the moments, the smiles, and the journey.',
    title: 'The Young Story: A Birthday Celebration Montage',
    description: 'A special visual compilation celebrating Paul Olayemi — the smiles, the camaraderie, and the brotherhood.',
    videoUrl: '', // Add MP4 link or YouTube/Vimeo embed
    thumbnailUrl: ''
  },
  finale: {
    tagline: 'ONE OF ONE. NEVER TWO.',
    title: 'HAPPY BIRTHDAY, YOUNG!',
    messagePrimary: 'Keep laughing. Keep growing. Keep showing up for your people. And keep becoming everything you dream of being.',
    messageSecondary: 'He is the laughter in the room, the brother in your corner, the voice that tells you the truth, and a man with a vision still unfolding. Today, we celebrate who Young is, appreciate what he brings into our lives, and look forward to all he is yet to become.',
    buttonText: 'CELEBRATE YOUNG',
    footerCredit: 'Made with love, laughter, and memories for Paul Olayemi.',
    image: ''
  },
  theme: {
    palette: 'warm-earth',
    accentColor: '#B85F43'
  },
  music: {
    enabled: true,
    audioUrl: 'https://res.cloudinary.com/vm4pzdfp/video/upload/v1792632538/Fireboy-DML-Champ-ft-D-Smoke-_JustNaija.com.mp3',
    title: 'Champ (feat. D Smoke)',
    artist: 'Fireboy DML',
    volume: 0.7
  }
};

export const initialAlbums: Album[] = [
  { id: 'album-1', title: 'Young Through the Years', description: 'Portraits and milestones through time.', order: 1, layout: 'masonry' },
  { id: 'album-2', title: 'The Boys and the Memories', description: 'Brotherhood, shared laughter, and road trips.', order: 2, layout: 'grid' },
  { id: 'album-3', title: 'Laugh Until It Hurts', description: 'Unfiltered joy and pure belly laughter.', order: 3, layout: 'polaroid' },
  { id: 'album-4', title: 'Unforgettable Moments', description: 'Milestones and epic adventures.', order: 4, layout: 'collage' },
  { id: 'album-5', title: 'Behind the Scenes', description: 'Candid realness and quiet moments.', order: 5, layout: 'masonry' },
  { id: 'album-6', title: 'Celebrations and Adventures', description: 'Special days, good food, and good times.', order: 6, layout: 'grid' },
  { id: 'album-7', title: 'The People Who Love Young', description: 'Family, friends, and everyone in his corner.', order: 7, layout: 'polaroid' },
  { id: 'album-8', title: 'Random Moments That Became Memories', description: 'The impromptu snapshots that mean the most.', order: 8, layout: 'masonry' }
];

export const initialGalleryItems: GalleryItem[] = [];

export const initialTestimonials: Testimonial[] = [];

export const initialBirthdayMessages: BirthdayMessage[] = [];
