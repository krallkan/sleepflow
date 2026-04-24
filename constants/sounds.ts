export interface Sound {
  id: string;
  name: string;
  emoji: string;
  description: string;
  isPremium: boolean;
  color: string;
  url: string;
}

// All URLs are public domain / CC0 audio from reliable CDNs
export const SOUNDS: Sound[] = [
  {
    id: 'white_noise',
    name: 'White Noise',
    emoji: '〰️',
    description: 'Classic static noise for deep sleep',
    isPremium: false,
    color: '#6C63FF',
    url: 'https://www.soundjay.com/misc/sounds/white-noise-1.mp3',
  },
  {
    id: 'rain',
    name: 'Rain',
    emoji: '🌧️',
    description: 'Gentle rainfall to calm your mind',
    isPremium: false,
    color: '#4A9EBF',
    url: 'https://www.soundjay.com/nature/sounds/rain-01.mp3',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    emoji: '🌊',
    description: 'Relaxing ocean waves on the shore',
    isPremium: false,
    color: '#0077B6',
    url: 'https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3',
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌲',
    description: 'Birds and wind through the trees',
    isPremium: true,
    color: '#2D6A4F',
    url: 'https://www.soundjay.com/nature/sounds/birds-1.mp3',
  },
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    emoji: '⛈️',
    description: 'Distant thunder and heavy rain',
    isPremium: true,
    color: '#4A4E69',
    url: 'https://www.soundjay.com/nature/sounds/thunder-1.mp3',
  },
  {
    id: 'fan',
    name: 'Fan',
    emoji: '💨',
    description: 'Steady fan hum for focus and sleep',
    isPremium: true,
    color: '#5C7A9E',
    url: 'https://www.soundjay.com/misc/sounds/fan-1.mp3',
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    emoji: '🔥',
    description: 'Crackling fire for cozy nights',
    isPremium: true,
    color: '#C1440E',
    url: 'https://www.soundjay.com/misc/sounds/fire-1.mp3',
  },
  {
    id: 'brown_noise',
    name: 'Brown Noise',
    emoji: '🟤',
    description: 'Deeper, warmer noise for relaxation',
    isPremium: true,
    color: '#8B5E3C',
    url: 'https://www.soundjay.com/misc/sounds/brown-noise-1.mp3',
  },
];

export const FREE_SOUND_COUNT = SOUNDS.filter(s => !s.isPremium).length;
