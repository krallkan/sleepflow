export interface Sound {
  id: string;
  name: string;
  emoji: string;
  description: string;
  isPremium: boolean;
  color: string;
  url: string;
}

export const SOUNDS: Sound[] = [
  {
    id: 'white_noise',
    name: 'White Noise',
    emoji: '〰️',
    description: 'Classic static noise for deep sleep',
    isPremium: false,
    color: '#6C63FF',
    url: 'https://freesound.org/data/previews/521/521276_5765493-lq.mp3',
  },
  {
    id: 'rain',
    name: 'Rain',
    emoji: '🌧️',
    description: 'Gentle rainfall to calm your mind',
    isPremium: false,
    color: '#4A9EBF',
    url: 'https://freesound.org/data/previews/531/531953_5865517-lq.mp3',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    emoji: '🌊',
    description: 'Relaxing ocean waves on the shore',
    isPremium: false,
    color: '#0077B6',
    url: 'https://freesound.org/data/previews/372/372375_6852400-lq.mp3',
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌲',
    description: 'Birds and wind through the trees',
    isPremium: true,
    color: '#2D6A4F',
    url: 'https://freesound.org/data/previews/210/210028_3928734-lq.mp3',
  },
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    emoji: '⛈️',
    description: 'Distant thunder and heavy rain',
    isPremium: true,
    color: '#4A4E69',
    url: 'https://freesound.org/data/previews/240/240786_2437358-lq.mp3',
  },
  {
    id: 'fan',
    name: 'Fan',
    emoji: '💨',
    description: 'Steady fan hum for focus and sleep',
    isPremium: true,
    color: '#5C7A9E',
    url: 'https://freesound.org/data/previews/264/264593_4946871-lq.mp3',
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    emoji: '🔥',
    description: 'Crackling fire for cozy nights',
    isPremium: true,
    color: '#C1440E',
    url: 'https://freesound.org/data/previews/476/476178_9337561-lq.mp3',
  },
  {
    id: 'brown_noise',
    name: 'Brown Noise',
    emoji: '🟤',
    description: 'Deeper, warmer noise for relaxation',
    isPremium: true,
    color: '#8B5E3C',
    url: 'https://freesound.org/data/previews/561/561363_1648170-lq.mp3',
  },
];

export const FREE_SOUND_COUNT = SOUNDS.filter(s => !s.isPremium).length;
