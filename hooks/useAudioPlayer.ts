import { useState, useRef, useCallback, useEffect } from 'react';
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
  const audioReady = useRef(false);

  const isPlaying = tracks.length > 0;

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    }).then(() => {
      audioReady.current = true;
    }).catch(console.error);
  }, []);

  const isActive = useCallback((soundId: string) => {
    return tracks.some(t => t.sound.id === soundId);
  }, [tracks]);

  const isLoading = useCallback((soundId: string) => {
    return tracks.find(t => t.sound.id === soundId)?.isLoading ?? false;
  }, [tracks]);

  const stopSound = useCallback(async (soundId: string) => {
    if (soundRefs.current[soundId]) {
      await soundRefs.current[soundId].stopAsync().catch(() => {});
      await soundRefs.current[soundId].unloadAsync().catch(() => {});
      delete soundRefs.current[soundId];
    }
  }, []);

  const toggleSound = useCallback(async (sound: Sound, isPremium: boolean) => {
    // If already playing — stop it
    if (soundRefs.current[sound.id]) {
      await stopSound(sound.id);
      setTracks(prev => prev.filter(t => t.sound.id !== sound.id));
      return;
    }

    // Free users: max 1 sound — stop the existing one first
    if (!isPremium && tracks.length >= 1) {
      const existingId = tracks[0].sound.id;
      await stopSound(existingId);
      setTracks([]);
    }

    // Premium: max 2 sounds
    if (isPremium && tracks.length >= 2) return;

    // Mark as loading
    setTracks(prev => [...prev, { sound, volume: 0.8, isLoading: true }]);

    try {
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
  }, [tracks, stopSound]);

  const stopAll = useCallback(async () => {
    for (const id of Object.keys(soundRefs.current)) {
      await stopSound(id);
    }
    setTracks([]);
  }, [stopSound]);

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
