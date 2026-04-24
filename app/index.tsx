import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { SOUNDS } from '../constants/sounds';
import { Colors } from '../constants/colors';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTimer } from '../hooks/useTimer';
import { usePremium } from '../hooks/usePremium';
import { useNotifications } from '../hooks/useNotifications';
import { useInterstitialAd, BANNER_AD_ID } from '../hooks/useAdMob';
import SoundCard from '../components/SoundCard';
import PlayerBar from '../components/PlayerBar';
import TimerModal from '../components/TimerModal';
import PremiumModal from '../components/PremiumModal';
import ReminderModal from '../components/ReminderModal';
import StatsBar, { useSessionTracker } from '../components/StatsBar';

export default function HomeScreen() {
  const { tracks, isPlaying, isActive, isLoading, toggleSound, stopAll, setTrackVolume } = useAudioPlayer();
  const { isPremium, isLoading: purchaseLoading, purchase, restore } = usePremium();
  const { timerMinutes, formatRemaining, startTimer, clearTimer } = useTimer(stopAll);
  const { scheduleNightlyReminder, cancelReminder, getSavedHour } = useNotifications();
  const { maybeShowAd } = useInterstitialAd(isPremium);
  useSessionTracker(isPlaying);

  const [timerVisible, setTimerVisible] = useState(false);
  const [premiumVisible, setPremiumVisible] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [savedReminderHour, setSavedReminderHour] = useState<number | null>(null);

  useEffect(() => {
    getSavedHour().then(setSavedReminderHour);
  }, [getSavedHour]);

  const handleToggleSound = useCallback(async (sound: typeof SOUNDS[0]) => {
    await toggleSound(sound, isPremium);
    maybeShowAd();
  }, [toggleSound, isPremium, maybeShowAd]);

  const handlePurchase = useCallback(async (sku: string) => {
    await purchase(sku);
  }, [purchase]);

  const handleRestore = useCallback(async () => {
    const restored = await restore();
    setPremiumVisible(false);
    Alert.alert(
      restored ? 'Restored! ✅' : 'No purchase found',
      restored ? 'Your Pro access is active.' : 'No previous purchase found on this account.'
    );
  }, [restore]);

  const handleSaveReminder = useCallback(async (hour: number) => {
    await scheduleNightlyReminder(hour);
    setSavedReminderHour(hour);
    Alert.alert('Reminder set! 🔔', `We'll remind you at ${hour}:00 every night.`);
  }, [scheduleNightlyReminder]);

  const handleCancelReminder = useCallback(async () => {
    await cancelReminder();
    setSavedReminderHour(null);
  }, [cancelReminder]);

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
          <View style={styles.headerButtons}>
            <Text
              style={styles.reminderBtn}
              onPress={() => setReminderVisible(true)}
            >
              {savedReminderHour !== null ? '🔔' : '🔕'}
            </Text>
            {!isPremium ? (
              <Text style={styles.proLink} onPress={() => setPremiumVisible(true)}>
                👑 Pro
              </Text>
            ) : (
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO 👑</Text>
              </View>
            )}
          </View>
        </View>

        {/* AdMob Banner — free users only */}
        {!isPremium && (
          <BannerAd
            unitId={BANNER_AD_ID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        )}

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <StatsBar />

          {isPremium && tracks.length === 1 && (
            <View style={styles.mixHint}>
              <Text style={styles.mixHintText}>🎛️ Tap another sound to mix</Text>
            </View>
          )}

          <Text style={styles.sectionLabel}>Free Sounds</Text>
          {SOUNDS.filter(s => !s.isPremium).map(sound => (
            <SoundCard
              key={sound.id}
              sound={sound}
              isActive={isActive(sound.id)}
              isLoading={isLoading(sound.id)}
              isPremium={isPremium}
              onPress={() => handleToggleSound(sound)}
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
              isActive={isActive(sound.id)}
              isLoading={isLoading(sound.id)}
              isPremium={isPremium}
              onPress={() => handleToggleSound(sound)}
              onPremiumPress={() => setPremiumVisible(true)}
            />
          ))}

          {!isPremium && (
            <View style={styles.upsell}>
              <LinearGradient
                colors={[Colors.primary + '22', Colors.primary + '08']}
                style={styles.upsellInner}
              >
                <Text style={styles.upsellTitle}>👑 Unlock Everything</Text>
                <Text style={styles.upsellSub}>
                  Mix sounds · 8 sounds · No ads · Sleep reminders
                </Text>
                <Text style={styles.upsellBtn} onPress={() => setPremiumVisible(true)}>
                  Start Free Trial →
                </Text>
              </LinearGradient>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {isPlaying && (
          <PlayerBar
            tracks={tracks}
            timerLabel={timerMinutes ? formatRemaining() : null}
            onStop={stopAll}
            onTimerPress={() => setTimerVisible(true)}
            onVolumeChange={setTrackVolume}
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
        isLoading={purchaseLoading}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        onClose={() => setPremiumVisible(false)}
      />

      <ReminderModal
        visible={reminderVisible}
        savedHour={savedReminderHour}
        onSave={handleSaveReminder}
        onCancel={handleCancelReminder}
        onClose={() => setReminderVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  appName: { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reminderBtn: {
    fontSize: 22,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  proLink: {
    fontSize: 13,
    color: Colors.gold,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.gold + '15',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
    overflow: 'hidden',
  },
  proBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.primary + '20',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  proBadgeText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  mixHint: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: Colors.primary + '18',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  mixHintText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  list: { flex: 1 },
  listContent: { paddingBottom: 8 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  upsell: { marginHorizontal: 16, marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  upsellInner: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
  },
  upsellTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  upsellSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 14, lineHeight: 18 },
  upsellBtn: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});
