import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { ActiveTrack } from '../hooks/useAudioPlayer';
import { Colors } from '../constants/colors';

interface Props {
  tracks: ActiveTrack[];
  timerLabel: string | null;
  onStop: () => void;
  onTimerPress: () => void;
  onVolumeChange: (soundId: string, volume: number) => void;
}

export default function PlayerBar({ tracks, timerLabel, onStop, onTimerPress, onVolumeChange }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.topRow}>
        <View style={styles.nowPlayingCol}>
          <Text style={styles.nowPlaying}>Now Playing</Text>
          <Text style={styles.soundNames} numberOfLines={1}>
            {tracks.map(t => `${t.sound.emoji} ${t.sound.name}`).join('  +  ')}
          </Text>
        </View>
        <TouchableOpacity style={styles.timerBtn} onPress={onTimerPress}>
          <Text style={styles.timerIcon}>⏱</Text>
          {timerLabel && <Text style={styles.timerLabel}>{timerLabel}</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopBtn} onPress={onStop}>
          <Text style={styles.stopIcon}>■</Text>
        </TouchableOpacity>
      </View>

      {tracks.map(track => (
        <View key={track.sound.id} style={styles.volumeRow}>
          <Text style={styles.trackEmoji}>{track.sound.emoji}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={track.volume}
            onValueChange={v => onVolumeChange(track.sound.id, v)}
            minimumTrackTintColor={track.sound.color}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={track.sound.color}
          />
          <Text style={styles.volPct}>{Math.round(track.volume * 100)}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nowPlayingCol: {
    flex: 1,
  },
  nowPlaying: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  soundNames: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    gap: 4,
  },
  timerIcon: { fontSize: 16 },
  timerLabel: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  stopBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.error + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopIcon: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackEmoji: { fontSize: 16, width: 24, textAlign: 'center' },
  slider: { flex: 1, height: 32 },
  volPct: {
    fontSize: 11,
    color: Colors.textMuted,
    width: 32,
    textAlign: 'right',
  },
});
