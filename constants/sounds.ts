export interface Sound {
  id: string;
  name: string;
  emoji: string;
  description: string;
  isPremium: boolean;
  color: string;
  asset: any;
}

export const SOUNDS: Sound[] = [
  {
    id: 'white_noise',
    name: 'White Noise',
    emoji: '〰️',
    description: 'Classic static noise for deep sleep',
    isPremium: false,
    color: '#6C63FF',
    asset: require('../assets/sounds/white_noise.wav'),
  },
  {
    id: 'rain',
    name: 'Rain',
    emoji: '🌧️',
    description: 'Gentle rainfall to calm your mind',
    isPremium: false,
    color: '#4A9EBF',
    asset: require('../assets/sounds/rain.wav'),
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    emoji: '🌊',
    description: 'Relaxing ocean waves on the shore',
    isPremium: false,
    color: '#0077B6',
    asset: require('../assets/sounds/ocean.wav'),
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌲',
    description: 'Birds and wind through the trees',
    isPremium: true,
    color: '#2D6A4F',
    asset: require('../assets/sounds/forest.wav'),
  },
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    emoji: '⛈️',
    description: 'Distant thunder and heavy rain',
    isPremium: true,
    color: '#4A4E69',
    asset: require('../assets/sounds/thunderstorm.wav'),
  },
  {
    id: 'fan',
    name: 'Fan',
    emoji: '💨',
    description: 'Steady fan hum for focus and sleep',
    isPremium: true,
    color: '#5C7A9E',
    asset: require('../assets/sounds/fan.wav'),
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    emoji: '🔥',
    description: 'Crackling fire for cozy nights',
    isPremium: true,
    color: '#C1440E',
    asset: require('../assets/sounds/fireplace.wav'),
  },
  {
    id: 'brown_noise',
    name: 'Brown Noise',
    emoji: '🟤',
    description: 'Deeper, warmer noise for relaxation',
    isPremium: true,
    color: '#8B5E3C',
    asset: require('../assets/sounds/brown_noise.wav'),
  },
];

export const FREE_SOUND_COUNT = SOUNDS.filter(s => !s.isPremium).length;
