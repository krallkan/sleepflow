import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface Props { onDone: () => void; }

export default function SplashScreen({ onDone }: Props) {
  const moonOpacity = useRef(new Animated.Value(0)).current;
  const moonY = useRef(new Animated.Value(30)).current;
  const moonScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(12)).current;
  const star1 = useRef(new Animated.Value(0)).current;
  const star2 = useRef(new Animated.Value(0)).current;
  const star3 = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Stars twinkle in
      Animated.parallel([
        Animated.timing(star1, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(star2, { toValue: 1, duration: 500, delay: 250, useNativeDriver: true }),
        Animated.timing(star3, { toValue: 1, duration: 500, delay: 180, useNativeDriver: true }),
      ]),
      // Moon drops in
      Animated.parallel([
        Animated.timing(moonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(moonY, { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
        Animated.spring(moonScale, { toValue: 1, friction: 7, tension: 80, useNativeDriver: true }),
      ]),
      // Logo fades in
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 8, tension: 100, useNativeDriver: true }),
      ]),
      // Tagline
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(textY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      // Hold
      Animated.delay(800),
      // Fade out
      Animated.timing(containerOpacity, { toValue: 0, duration: 500, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(onDone, 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: containerOpacity }]}>
      <LinearGradient
        colors={['#0A0820', '#0D1829', Colors.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Stars */}
      <Animated.Text style={[styles.star, { top: height * 0.12, left: width * 0.15, opacity: star1 }]}>✦</Animated.Text>
      <Animated.Text style={[styles.star, { top: height * 0.08, right: width * 0.2, opacity: star2 }]}>✦</Animated.Text>
      <Animated.Text style={[styles.starSm, { top: height * 0.18, right: width * 0.35, opacity: star3 }]}>·</Animated.Text>
      <Animated.Text style={[styles.starSm, { top: height * 0.22, left: width * 0.35, opacity: star2 }]}>·</Animated.Text>
      <Animated.Text style={[styles.star, { top: height * 0.14, right: width * 0.12, opacity: star1 }]}>✦</Animated.Text>

      <View style={styles.center}>
        {/* Moon */}
        <Animated.View style={[styles.moonWrap, {
          opacity: moonOpacity,
          transform: [{ translateY: moonY }, { scale: moonScale }],
        }]}>
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
        <Animated.Text style={[styles.appName, {
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }]}>
          SleepFlow
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, {
          opacity: textOpacity,
          transform: [{ translateY: textY }],
        }]}>
          Peaceful sounds for a restful night
        </Animated.Text>
      </View>

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
