import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SOUNDS } from '../constants/sounds';
import { Colors } from '../constants/colors';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTimer } from '../hooks/useTimer';
import { usePremium } from '../hooks/usePremium';
import SoundCard from '../components/SoundCard';
import PlayerBar from '../components/PlayerBar';
import TimerModal from '../components/TimerModal';
import PremiumModal from '../components/PremiumModal';
import StatsBar, { useSessionTracker } from '../components/StatsBar';

export default function HomeScreen() {
  const { currentSound, isPlaying, isLoading, volume, togglePlay, stop, changeVolume } = useAudioPlayer();
  const { isPremium, purchase, restore } = usePremium();
  const { timerMinutes, formatRemaining, startTimer, clearTimer } = useTimer(stop);
  useSessionTracker(isPlaying);

  const [timerVisible, setTimerVisible] = useState(false);
  const [premiumVisible, setPremiumVisible] = useState(false);

  const handlePurchase = useCallback(async () => {
    const success = await purchase();
    if (success) {
      setPremiumVisible(false);
      Alert.alert('Welcome to Pro! 🎉', 'All sounds are now unlocked.');
    }
  }, [purchase]);

  const handleRestore = useCallback(async () => {
    const restored = await restore();
    setPremiumVisible(false);
    Alert.alert(
      restored ? 'Restored! ✅' : 'No purchase found',
      restored ? 'Your Pro access is active.' : 'No previous purchase found.'
    );
  }, [restore]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#1a1040', Colors.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
      />

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>SleepFlow</Text>
            <Text style={styles.tagline}>Sleep better tonight 🌙</Text>
          </View>
          {!isPremium ? (
            <Text style={styles.proLink} onPress={() => setPremiumVisible(true)}>
              👑 Get Pro
            </Text>
          ) : (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO 👑</Text>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <StatsBar />

          <Text style={styles.sectionLabel}>Free Sounds</Text>
          {SOUNDS.filter(s => !s.isPremium).map(sound => (
            <SoundCard
              key={sound.id}
              sound={sound}
              isActive={currentSound?.id === sound.id && isPlaying}
              isLoading={isLoading && currentSound?.id === sound.id}
              isPremium={isPremium}
              onPress={() => togglePlay(sound)}
              onPremiumPress={() => setPremiumVisible(true)}
            />
          ))}

          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>
            Premium Sounds {!isPremium && '🔒'}
          </Text>
          {SOUNDS.filter(s => s.isPremium).map(sound => (
            <SoundCard
              key={sound.id}
              sound={sound}
              isActive={currentSound?.id === sound.id && isPlaying}
              isLoading={isLoading && currentSound?.id === sound.id}
              isPremium={isPremium}
              onPress={() => togglePlay(sound)}
              onPremiumPress={() => setPremiumVisible(true)}
            />
          ))}

          {!isPremium && (
            <View style={styles.upsell}>
              <LinearGradient
                colors={[Colors.primary + '22', Colors.primary + '08']}
                style={styles.upsellInner}
              >
                <Text style={styles.upsellTitle}>👑 Unlock All Sounds</Text>
                <Text style={styles.upsellSub}>
                  Get 5 more sounds + no ads for just $2.99/month
                </Text>
                <Text style={styles.upsellBtn} onPress={() => setPremiumVisible(true)}>
                  Start Free Trial →
                </Text>
              </LinearGradient>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {currentSound && isPlaying && (
          <PlayerBar
            sound={currentSound}
            volume={volume}
            timerLabel={timerMinutes ? formatRemaining() : null}
            onStop={stop}
            onTimerPress={() => setTimerVisible(true)}
            onVolumeChange={changeVolume}
          />
        )}
      </SafeAreaView>

      <TimerModal
        visible={timerVisible}
        activeMinutes={timerMinutes}
        onSelect={startTimer}
        onClear={clearTimer}
        onClose={() => setTimerVisible(false)}
      />

      <PremiumModal
        visible={premiumVisible}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        onClose={() => setPremiumVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  proLink: {
    fontSize: 14,
    color: Colors.gold,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.gold + '15',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
    overflow: 'hidden',
  },
  proBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.primary + '20',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  proBadgeText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  upsell: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  upsellInner: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
  },
  upsellTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  upsellSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  upsellBtn: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
