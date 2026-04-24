import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withSpring,
  interpolate, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Sound } from '../constants/sounds';
import { Colors } from '../constants/colors';

interface Props {
  sound: Sound;
  isActive: boolean;
  isLoading: boolean;
  isPremium: boolean;
  onPress: () => void;
  onPremiumPress: () => void;
}

export default function SoundCard({ sound, isActive, isLoading, isPremium, onPress, onPremiumPress }: Props) {
  const locked = sound.isPremium && !isPremium;
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const waveA = useSharedValue(0);
  const waveB = useSharedValue(0);
  const waveC = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.02, { damping: 12, stiffness: 120 });
      glow.value = withTiming(1, { duration: 400 });
      waveA.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.3, { duration: 500, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      );
      waveB.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 400, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      );
      waveC.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 700, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.2, { duration: 500, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      );
    } else {
      scale.value = withSpring(1, { damping: 15 });
      glow.value = withTiming(0, { duration: 300 });
      waveA.value = withTiming(0, { duration: 300 });
      waveB.value = withTiming(0, { duration: 300 });
      waveC.value = withTiming(0, { duration: 300 });
    }
  }, [isActive]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pressScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0, 0.6]),
  }));

  const waveStyleA = useAnimatedStyle(() => ({
    height: interpolate(waveA.value, [0, 1], [4, 18]),
    opacity: interpolate(waveA.value, [0, 1], [0.3, 1]),
  }));
  const waveStyleB = useAnimatedStyle(() => ({
    height: interpolate(waveB.value, [0, 1], [4, 26]),
    opacity: interpolate(waveB.value, [0, 1], [0.3, 1]),
  }));
  const waveStyleC = useAnimatedStyle(() => ({
    height: interpolate(waveC.value, [0, 1], [4, 14]),
    opacity: interpolate(waveC.value, [0, 1], [0.3, 1]),
  }));

  const onPressIn = () => { pressScale.value = withSpring(0.96, { damping: 15 }); };
  const onPressOut = () => { pressScale.value = withSpring(1, { damping: 15 }); };

  return (
    <Animated.View style={[styles.wrapper, containerStyle]}>
      {/* Glow halo behind active card */}
      <Animated.View style={[styles.glowHalo, { backgroundColor: sound.color }, glowStyle]} />

      <TouchableOpacity
        style={styles.touchable}
        onPress={locked ? onPremiumPress : onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={isActive
            ? [sound.color + 'DD', sound.color + '55', Colors.surfaceElevated]
            : [Colors.surfaceElevated, Colors.surface]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {isActive && (
            <View style={[styles.activeBorder, { borderColor: sound.color + '99' }]} />
          )}

          <Text style={styles.emoji}>{sound.emoji}</Text>

          <View style={styles.info}>
            <Text style={styles.name}>{sound.name}</Text>
            <Text style={styles.description} numberOfLines={1}>{sound.description}</Text>
          </View>

          <View style={styles.right}>
            {locked ? (
              <View style={[styles.lockBadge, { backgroundColor: Colors.goldDim, borderColor: Colors.gold + '60' }]}>
                <Text style={[styles.lockText, { color: Colors.gold }]}>PRO</Text>
              </View>
            ) : isLoading ? (
              <ActivityIndicator size="small" color={sound.color} />
            ) : isActive ? (
              <View style={styles.waveform}>
                <Animated.View style={[styles.waveBar, { backgroundColor: sound.color }, waveStyleA]} />
                <Animated.View style={[styles.waveBar, { backgroundColor: sound.color }, waveStyleB]} />
                <Animated.View style={[styles.waveBar, { backgroundColor: sound.color }, waveStyleC]} />
                <Animated.View style={[styles.waveBar, { backgroundColor: sound.color }, waveStyleB]} />
                <Animated.View style={[styles.waveBar, { backgroundColor: sound.color }, waveStyleA]} />
              </View>
            ) : (
              <View style={[styles.playBtn, { backgroundColor: Colors.primaryDim, borderColor: Colors.borderLight }]}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 18,
  },
  glowHalo: {
    position: 'absolute',
    top: 4, left: 4, right: 4, bottom: -6,
    borderRadius: 18,
    opacity: 0,
    filter: 'blur(12px)',
  },
  touchable: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  activeBorder: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  emoji: {
    fontSize: 30,
    marginRight: 12,
    width: 40,
    textAlign: 'center',
  },
  info: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  right: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  lockBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  lockText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  playIcon: {
    color: Colors.primaryLight,
    fontSize: 11,
    marginLeft: 2,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 30,
    paddingHorizontal: 4,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
  },
});
