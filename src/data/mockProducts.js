// Mock product data for the Guerrilla Music store
export const mockProducts = [
  // Sample Packs
  {
    id: 'sp001',
    type: 'sample-pack',
    title: 'Psychedelic Horizons',
    artist: 'Guerrilla',
    description: 'A journey through progressive psytrance with deep basslines, ethereal pads, and hypnotic arpeggios. Perfect for creating atmospheric progressive tracks.',
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
    bpm: '132-138',
    key: 'Various',
    genre: 'Progressive Psytrance',
    tags: ['Progressive', 'Atmospheric', 'Deep', 'Psychedelic'],
    samples: 45,
    duration: '2:34:12',
    format: ['WAV', '24-bit'],
    size: '1.2 GB',
    releaseDate: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    preview: '/audio/previews/psychedelic-horizons.mp3',
    featured: true,
    bestseller: true,
    new: false,
    stems: true,
    contents: [
      'Full Construction Kits',
      'Individual Stems',
      'One-Shot Samples',
      'MIDI Files',
      'Bonus Loops'
    ]
  },
  {
    id: 'sp002',
    type: 'sample-pack',
    title: 'Neon Dreams',
    artist: 'Guerrilla',
    description: 'Futuristic sounds meet classic psytrance elements. Featuring punchy kicks, rolling basslines, and cosmic leads.',
    price: 19.99,
    originalPrice: null,
    discount: 0,
    bpm: '140-145',
    key: 'Various',
    genre: 'Full-On Psytrance',
    tags: ['Full-On', 'Energetic', 'Cosmic', 'Futuristic'],
    samples: 38,
    duration: '2:12:45',
    format: ['WAV', '24-bit'],
    size: '980 MB',
    releaseDate: '2024-02-01',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop&crop=center',
    preview: '/audio/previews/neon-dreams.mp3',
    featured: false,
    bestseller: false,
    new: true,
    stems: true,
    contents: [
      'Construction Kits',
      'Drum Loops',
      'Bass Loops',
      'Lead Synth Loops',
      'FX Samples'
    ]
  },
  {
    id: 'sp003',
    type: 'sample-pack',
    title: 'Forest Frequencies',
    artist: 'Guerrilla',
    description: 'Organic psytrance with natural elements and forest atmospheres. Deep, groovy, and mystical.',
    price: 22.99,
    originalPrice: 29.99,
    discount: 23,
    bpm: '134-140',
    key: 'Various',
    genre: 'Forest Psytrance',
    tags: ['Forest', 'Organic', 'Mystical', 'Groovy'],
    samples: 52,
    duration: '2:45:30',
    format: ['WAV', '24-bit'],
    size: '1.4 GB',
    releaseDate: '2024-01-28',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&crop=center',
    preview: '/audio/previews/forest-frequencies.mp3',
    featured: true,
    bestseller: true,
    new: false,
    stems: true,
    contents: [
      'Full Arrangements',
      'Layered Stems',
      'Percussion Loops',
      'Atmospheric Pads',
      'Organic FX'
    ]
  },

  // MIDI Packs
  {
    id: 'mp001',
    type: 'midi-pack',
    title: 'Progressive Patterns',
    artist: 'Guerrilla',
    description: 'Essential MIDI patterns for progressive psytrance production. Includes basslines, leads, arps, and percussion.',
    price: 14.99,
    originalPrice: null,
    discount: 0,
    bpm: '132-138',
    key: 'Various',
    genre: 'Progressive Psytrance',
    tags: ['MIDI', 'Progressive', 'Patterns', 'Basslines'],
    samples: 65,
    duration: 'N/A',
    format: ['MIDI'],
    size: '2.5 MB',
    releaseDate: '2024-02-05',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&crop=center',
    preview: '/audio/previews/progressive-patterns.mp3',
    featured: false,
    bestseller: true,
    new: true,
    stems: false,
    contents: [
      'Bassline MIDI',
      'Lead Melodies',
      'Arpeggio Patterns',
      'Percussion MIDI',
      'Chord Progressions'
    ]
  },
  {
    id: 'mp002',
    type: 'midi-pack',
    title: 'Cosmic Sequences',
    artist: 'Guerrilla',
    description: 'Space-inspired MIDI sequences perfect for creating otherworldly psytrance tracks.',
    price: 12.99,
    originalPrice: 17.99,
    discount: 28,
    bpm: '138-145',
    key: 'Various',
    genre: 'Full-On Psytrance',
    tags: ['MIDI', 'Cosmic', 'Sequences', 'Space'],
    samples: 48,
    duration: 'N/A',
    format: ['MIDI'],
    size: '1.8 MB',
    releaseDate: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=center',
    preview: '/audio/previews/cosmic-sequences.mp3',
    featured: false,
    bestseller: false,
    new: false,
    stems: false,
    contents: [
      'Sequence Patterns',
      'Melodic MIDI',
      'Rhythm Patterns',
      'Modulation Ideas',
      'Template Projects'
    ]
  },

  // Acapellas
  {
    id: 'ac001',
    type: 'acapella',
    title: 'Ethereal Voices',
    artist: 'Luna Sage',
    description: 'Haunting and beautiful vocal performances perfect for progressive psytrance. Multiple takes and harmonies included.',
    price: 18.99,
    originalPrice: null,
    discount: 0,
    bpm: 'Various',
    key: 'C Major, A Minor',
    genre: 'Progressive Psytrance',
    tags: ['Vocals', 'Ethereal', 'Haunting', 'Progressive'],
    samples: 12,
    duration: '45:22',
    format: ['WAV', '24-bit'],
    size: '340 MB',
    releaseDate: '2024-02-10',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&crop=center',
    preview: '/audio/previews/ethereal-voices.mp3',
    featured: true,
    bestseller: false,
    new: true,
    stems: true,
    contents: [
      'Lead Vocals',
      'Harmony Layers',
      'Vocal Chops',
      'Whispers & Breaths',
      'Processed Versions'
    ]
  },
  {
    id: 'ac002',
    type: 'acapella',
    title: 'Tribal Chants',
    artist: 'Shaman Voices',
    description: 'Authentic tribal chants and ceremonial vocals. Perfect for adding organic elements to your psytrance productions.',
    price: 21.99,
    originalPrice: 26.99,
    discount: 19,
    bpm: 'Various',
    key: 'Various',
    genre: 'Forest Psytrance',
    tags: ['Tribal', 'Chants', 'Ceremonial', 'Organic'],
    samples: 18,
    duration: '1:12:15',
    format: ['WAV', '24-bit'],
    size: '520 MB',
    releaseDate: '2024-01-25',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    preview: '/audio/previews/tribal-chants.mp3',
    featured: false,
    bestseller: true,
    new: false,
    stems: false,
    contents: [
      'Ceremonial Chants',
      'Rhythmic Vocals',
      'Ambient Voices',
      'Call & Response',
      'Layered Harmonies'
    ]
  },

  // More Sample Packs
  {
    id: 'sp004',
    type: 'sample-pack',
    title: 'Digital Rebellion',
    artist: 'Guerrilla',
    description: 'Hard-hitting psytrance with digital glitches and aggressive synths. For producers who like it intense.',
    price: 26.99,
    originalPrice: null,
    discount: 0,
    bpm: '145-150',
    key: 'Various',
    genre: 'Dark Psytrance',
    tags: ['Dark', 'Aggressive', 'Digital', 'Intense'],
    samples: 41,
    duration: '2:28:45',
    format: ['WAV', '24-bit'],
    size: '1.1 GB',
    releaseDate: '2024-02-12',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop&crop=center',
    preview: '/audio/previews/digital-rebellion.mp3',
    featured: false,
    bestseller: false,
    new: true,
    stems: true,
    contents: [
      'Dark Construction Kits',
      'Aggressive Leads',
      'Distorted Bass',
      'Glitch Elements',
      'Industrial FX'
    ]
  }
];

// Helper functions
export const getProductsByType = (type) => {
  return mockProducts.filter(product => product.type === type);
};

export const getFeaturedProducts = () => {
  return mockProducts.filter(product => product.featured);
};

export const getBestsellers = () => {
  return mockProducts.filter(product => product.bestseller);
};

export const getNewProducts = () => {
  return mockProducts.filter(product => product.new);
};

export const getProductById = (id) => {
  return mockProducts.find(product => product.id === id);
};

export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.title.toLowerCase().includes(lowercaseQuery) ||
    product.artist.toLowerCase().includes(lowercaseQuery) ||
    product.genre.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export default mockProducts;
