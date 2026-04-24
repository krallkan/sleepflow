import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Sound } from '../constants/sounds';

export function useAudioPlayer() {
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const soundRef = useRef<Audio.Sound | null>(null);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setCurrentSound(null);
  }, []);

  const play = useCallback(async (sound: Sound) => {
    try {
      setIsLoading(true);

      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: sound.url },
        { shouldPlay: true, isLooping: true, volume }
      );

      soundRef.current = newSound;
      setCurrentSound(sound);
      setIsPlaying(true);
    } catch (e) {
      console.error('Audio error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [volume]);

  const togglePlay = useCallback(async (sound: Sound) => {
    if (currentSound?.id === sound.id && isPlaying) {
      await stop();
    } else {
      await play(sound);
    }
  }, [currentSound, isPlaying, play, stop]);

  const changeVolume = useCallback(async (val: number) => {
    setVolume(val);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(val);
    }
  }, []);

  return {
    currentSound,
    isPlaying,
    isLoading,
    volume,
    togglePlay,
    stop,
    changeVolume,
  };
}
