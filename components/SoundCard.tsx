import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, Animated, Easing } from 'react-native';
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
  const scale = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  // Waveform bars
  const wA = useRef(new Animated.Value(0.3)).current;
  const wB = useRef(new Animated.Value(0.3)).current;
  const wC = useRef(new Animated.Value(0.3)).current;

  const waveLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isActive) {
      Animated.spring(scale, { toValue: 1.02, friction: 8, tension: 100, useNativeDriver: true }).start();

      const makeWave = (val: Animated.Value, lo: number, hi: number, dur: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(val, { toValue: hi, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
            Animated.timing(val, { toValue: lo, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
          ])
        );

      waveLoopRef.current = Animated.parallel([
        makeWave(wA, 0.2, 1.0, 480),
        makeWave(wB, 0.3, 1.0, 360),
        makeWave(wC, 0.2, 0.8, 560),
      ]);
      waveLoopRef.current.start();
    } else {
      waveLoopRef.current?.stop();
      Animated.spring(scale, { toValue: 1, friction: 8, useNativeDriver: true }).start();
      Animated.timing(wA, { toValue: 0.3, duration: 250, useNativeDriver: false }).start();
      Animated.timing(wB, { toValue: 0.3, duration: 250, useNativeDriver: false }).start();
      Animated.timing(wC, { toValue: 0.3, duration: 250, useNativeDriver: false }).start();
    }
    return () => { waveLoopRef.current?.stop(); };
  }, [isActive]);

  const onPressIn = () => Animated.spring(pressScale, { toValue: 0.96, friction: 10, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(pressScale, { toValue: 1, friction: 10, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: Animated.multiply(scale, pressScale) }] }]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={locked ? onPremiumPress : onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={isActive
            ? [sound.color + 'CC', sound.color + '44', Colors.surfaceElevated]
            : [Colors.surfaceElevated, Colors.surface]}
          style={[styles.card, isActive && { borderColor: sound.color + '80' }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.emoji}>{sound.emoji}</Text>

          <View style={styles.info}>
            <Text style={styles.name}>{sound.name}</Text>
            <Text style={styles.description} numberOfLines={1}>{sound.description}</Text>
          </View>

          <View style={styles.right}>
            {locked ? (
              <View style={styles.lockBadge}>
                <Text style={styles.lockText}>PRO</Text>
              </View>
            ) : isLoading ? (
              <ActivityIndicator size="small" color={sound.color} />
            ) : isActive ? (
              <View style={styles.waveform}>
                {[wA, wB, wC, wB, wA].map((w, i) => (
                  <Animated.View
                    key={i}
                    style={[styles.waveBar, {
                      backgroundColor: sound.color,
                      transform: [{ scaleY: w }],
                    }]}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.playBtn}>
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
    backgroundColor: Colors.goldDim,
    borderWidth: 1,
    borderColor: Colors.gold + '60',
  },
  lockText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 0.5,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDim,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    height: 24,
    borderRadius: 2,
  },
});
