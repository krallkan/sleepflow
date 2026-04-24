import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withSequence,
  runOnJS, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const logoScale = useSharedValue(0.4);
  const logoOpacity = useSharedValue(0);
  const moonOpacity = useSharedValue(0);
  const moonY = useSharedValue(20);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(16);
  const star1 = useSharedValue(0);
  const star2 = useSharedValue(0);
  const star3 = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Stars twinkle in
    star1.value = withDelay(200, withTiming(1, { duration: 600 }));
    star2.value = withDelay(400, withTiming(1, { duration: 600 }));
    star3.value = withDelay(300, withTiming(1, { duration: 600 }));

    // Moon drops in
    moonOpacity.value = withDelay(300, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    moonY.value = withDelay(300, withTiming(0, { duration: 700, easing: Easing.out(Easing.back(1.2)) }));

    // Logo scales in
    logoOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(600, withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.3)) }));

    // Tagline fades in
    textOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
    textY.value = withDelay(1000, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));

    // Fade out and call onDone
    containerOpacity.value = withDelay(2400, withSequence(
      withTiming(0, { duration: 600, easing: Easing.in(Easing.cubic) }),
    ));

    const timer = setTimeout(() => { onDone(); }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const moonStyle = useAnimatedStyle(() => ({
    opacity: moonOpacity.value,
    transform: [{ translateY: moonY.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const starStyle1 = useAnimatedStyle(() => ({ opacity: star1.value }));
  const starStyle2 = useAnimatedStyle(() => ({ opacity: star2.value }));
  const starStyle3 = useAnimatedStyle(() => ({ opacity: star3.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, containerStyle]}>
      <LinearGradient
        colors={['#0A0820', '#0D1829', '#080C14']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Stars */}
      <Animated.Text style={[styles.star, { top: height * 0.12, left: width * 0.15 }, starStyle1]}>✦</Animated.Text>
      <Animated.Text style={[styles.star, { top: height * 0.08, right: width * 0.2 }, starStyle2]}>✦</Animated.Text>
      <Animated.Text style={[styles.star, { top: height * 0.18, right: width * 0.35 }, starStyle3]}>✦</Animated.Text>
      <Animated.Text style={[styles.starSm, { top: height * 0.22, left: width * 0.35 }, starStyle2]}>·</Animated.Text>
      <Animated.Text style={[styles.starSm, { top: height * 0.14, right: width * 0.12 }, starStyle1]}>·</Animated.Text>

      <View style={styles.center}>
        {/* Moon */}
        <Animated.View style={[styles.moonWrap, moonStyle]}>
          <LinearGradient
            colors={['#C8B8FF', '#7C6FFF', '#4A3DB5']}
            style={styles.moonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.moonEmoji}>🌙</Text>
          </LinearGradient>
        </Animated.View>

        {/* App name */}
        <Animated.View style={logoStyle}>
          <Text style={styles.appName}>SleepFlow</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={textStyle}>
          <Text style={styles.tagline}>Peaceful sounds for a restful night</Text>
        </Animated.View>
      </View>

      {/* Bottom glow */}
      <View style={styles.glowBottom} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  moonWrap: {
    marginBottom: 8,
    shadowColor: '#7C6FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 20,
  },
  moonGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonEmoji: { fontSize: 52 },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  star: {
    position: 'absolute',
    fontSize: 14,
    color: '#C8B8FF',
    opacity: 0.8,
  },
  starSm: {
    position: 'absolute',
    fontSize: 22,
    color: '#8896B3',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -60,
    left: width * 0.2,
    right: width * 0.2,
    height: 120,
    backgroundColor: '#7C6FFF',
    opacity: 0.08,
    borderRadius: 100,
  },
});
