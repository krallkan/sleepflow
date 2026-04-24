import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { Sound } from '../constants/sounds';
import { Colors } from '../constants/colors';

interface Props {
  sound: Sound;
  volume: number;
  timerLabel: string | null;
  onStop: () => void;
  onTimerPress: () => void;
  onVolumeChange: (v: number) => void;
}

export default function PlayerBar({ sound, volume, timerLabel, onStop, onTimerPress, onVolumeChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.soundInfo}>
          <Text style={styles.nowPlaying}>Now Playing</Text>
          <Text style={styles.soundName}>{sound.emoji} {sound.name}</Text>
        </View>
        <TouchableOpacity style={styles.timerBtn} onPress={onTimerPress}>
          <Text style={styles.timerIcon}>⏱</Text>
          {timerLabel && <Text style={styles.timerLabel}>{timerLabel}</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopBtn} onPress={onStop}>
          <Text style={styles.stopIcon}>■</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.volumeRow}>
        <Text style={styles.volIcon}>🔈</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={onVolumeChange}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.primaryLight}
        />
        <Text style={styles.volIcon}>🔊</Text>
      </View>
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
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  soundInfo: {
    flex: 1,
  },
  nowPlaying: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  soundName: {
    fontSize: 16,
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
  timerIcon: {
    fontSize: 16,
  },
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
  volIcon: {
    fontSize: 16,
  },
  slider: {
    flex: 1,
    height: 32,
  },
});
