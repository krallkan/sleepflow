import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { ActiveTrack } from '../hooks/useAudioPlayer';
import { Colors } from '../constants/colors';

interface Props {
  tracks: ActiveTrack[];
  timerLabel: string | null;
  onStop: () => void;
  onTimerPress: () => void;
  onVolumeChange: (soundId: string, volume: number) => void;
  visible: boolean;
}

export default function PlayerBar({ tracks, timerLabel, onStop, onTimerPress, onVolumeChange, visible }: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, friction: 10, tension: 120, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 120, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateY }], opacity, paddingBottom: Math.max(insets.bottom, 12) }]}>
      <LinearGradient
        colors={['rgba(8,12,20,0)', 'rgba(8,12,20,0.97)', Colors.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nowPlayingCol}>
            <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 24,
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nowPlayingCol: { flex: 1 },
  nowPlayingLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  soundNames: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timerIcon: { fontSize: 14 },
  timerLabel: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  stopBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error + '22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.error + '44',
  },
  stopIcon: { color: Colors.error, fontSize: 12, fontWeight: '700' },
  volumeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  trackEmoji: { fontSize: 14, width: 22, textAlign: 'center' },
  slider: { flex: 1, height: 32 },
  volPct: { fontSize: 11, color: Colors.textMuted, width: 30, textAlign: 'right' },
});
