import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={locked ? onPremiumPress : onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isActive ? [sound.color + 'CC', sound.color + '66'] : [Colors.surface, Colors.surfaceElevated]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {isActive && <View style={[styles.activeBorder, { borderColor: sound.color }]} />}

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
          ) : isLoading && isActive ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <View style={[styles.playBtn, isActive && { backgroundColor: sound.color }]}>
              <Text style={styles.playIcon}>{isActive ? '■' : '▶'}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    position: 'relative',
  },
  activeBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  emoji: {
    fontSize: 32,
    marginRight: 14,
    width: 42,
    textAlign: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  right: {
    marginLeft: 12,
  },
  lockBadge: {
    backgroundColor: Colors.gold + '33',
    borderColor: Colors.gold,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lockText: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});
