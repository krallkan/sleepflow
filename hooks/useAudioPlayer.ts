import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Sound } from '../constants/sounds';

export interface ActiveTrack {
  sound: Sound;
  volume: number;
  isLoading: boolean;
}

export function useAudioPlayer() {
  const [tracks, setTracks] = useState<ActiveTrack[]>([]);
  const soundRefs = useRef<Record<string, Audio.Sound>>({});

  const isPlaying = tracks.length > 0;

  const setupAudio = useCallback(async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });
  }, []);

  const isActive = useCallback((soundId: string) => {
    return tracks.some(t => t.sound.id === soundId);
  }, [tracks]);

  const isLoading = useCallback((soundId: string) => {
    return tracks.find(t => t.sound.id === soundId)?.isLoading ?? false;
  }, [tracks]);

  const toggleSound = useCallback(async (sound: Sound, isPremium: boolean) => {
    // If already playing — stop it
    if (soundRefs.current[sound.id]) {
      await soundRefs.current[sound.id].stopAsync();
      await soundRefs.current[sound.id].unloadAsync();
      delete soundRefs.current[sound.id];
      setTracks(prev => prev.filter(t => t.sound.id !== sound.id));
      return;
    }

    // Free users: max 1 sound
    if (!isPremium && tracks.length >= 1) {
      const existing = tracks[0];
      if (soundRefs.current[existing.sound.id]) {
        await soundRefs.current[existing.sound.id].stopAsync();
        await soundRefs.current[existing.sound.id].unloadAsync();
        delete soundRefs.current[existing.sound.id];
      }
      setTracks([]);
    }

    // Premium: max 2 sounds
    if (isPremium && tracks.length >= 2) return;

    // Mark as loading
    setTracks(prev => [...prev, { sound, volume: 0.8, isLoading: true }]);

    try {
      await setupAudio();
      const { sound: audioSound } = await Audio.Sound.createAsync(
        sound.asset,
        { shouldPlay: true, isLooping: true, volume: 0.8 }
      );
      soundRefs.current[sound.id] = audioSound;
      setTracks(prev => prev.map(t =>
        t.sound.id === sound.id ? { ...t, isLoading: false } : t
      ));
    } catch (e) {
      console.error('Audio load error:', e);
      setTracks(prev => prev.filter(t => t.sound.id !== sound.id));
    }
  }, [tracks, setupAudio]);

  const stopAll = useCallback(async () => {
    for (const ref of Object.values(soundRefs.current)) {
      await ref.stopAsync().catch(() => {});
      await ref.unloadAsync().catch(() => {});
    }
    soundRefs.current = {};
    setTracks([]);
  }, []);

  const setTrackVolume = useCallback(async (soundId: string, volume: number) => {
    if (soundRefs.current[soundId]) {
      await soundRefs.current[soundId].setVolumeAsync(volume);
    }
    setTracks(prev => prev.map(t =>
      t.sound.id === soundId ? { ...t, volume } : t
    ));
  }, []);

  return {
    tracks,
    isPlaying,
    isActive,
    isLoading,
    toggleSound,
    stopAll,
    setTrackVolume,
  };
}
