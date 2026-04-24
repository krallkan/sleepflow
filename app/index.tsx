import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { SOUNDS } from '../constants/sounds';
import { Colors } from '../constants/colors';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTimer } from '../hooks/useTimer';
import { usePremium } from '../hooks/usePremium';
import { useNotifications } from '../hooks/useNotifications';
import { useInterstitialAd, BANNER_AD_ID } from '../hooks/useAdMob';
import { useLanguage } from '../hooks/useLanguage';
import { Lang } from '../constants/i18n';

import SoundCard from '../components/SoundCard';
import PlayerBar from '../components/PlayerBar';
import TimerModal from '../components/TimerModal';
import PremiumModal from '../components/PremiumModal';
import ReminderModal from '../components/ReminderModal';
import StatsBar, { useSessionTracker } from '../components/StatsBar';
import SplashScreen from '../components/SplashScreen';

const { height: SCREEN_H } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { lang, setLang, t } = useLanguage();
  const { tracks, isPlaying, isActive, isLoading, toggleSound, stopAll, setTrackVolume } = useAudioPlayer();
  const { isPremium, isLoading: purchaseLoading, purchase, restore } = usePremium();
  const { timerMinutes, formatRemaining, startTimer, clearTimer } = useTimer(stopAll);
  const { scheduleNightlyReminder, cancelReminder, getSavedHour } = useNotifications();
  const { maybeShowAd } = useInterstitialAd(isPremium);
  useSessionTracker(isPlaying);

  const [showSplash, setShowSplash] = useState(true);
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
      restored ? t.restored : t.noRestore,
      restored ? t.restoredMsg : t.noRestoreMsg
    );
  }, [restore, t]);

  const handleSaveReminder = useCallback(async (hour: number) => {
    await scheduleNightlyReminder(hour);
    setSavedReminderHour(hour);
    Alert.alert(t.reminderSet, `${t.reminderSetMsg} ${hour}:00 ${t.everyNight}`);
  }, [scheduleNightlyReminder, t]);

  const handleCancelReminder = useCallback(async () => {
    await cancelReminder();
    setSavedReminderHour(null);
  }, [cancelReminder]);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'tr' : 'en');
  }, [lang, setLang]);

  const freeSounds = SOUNDS.filter(s => !s.isPremium);
  const proSounds = SOUNDS.filter(s => s.isPremium);

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  const playerBarH = isPlaying ? (tracks.length > 1 ? 130 : 100) : 0;

  return (
    <View style={styles.root}>
      {/* Background gradient */}
      <LinearGradient
        colors={[Colors.gradientTop, Colors.gradientMid, Colors.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 0.5 }}
      />

      {/* Ambient glow orbs */}
      <View style={[styles.glowOrb, styles.glowOrb1]} />
      <View style={[styles.glowOrb, styles.glowOrb2]} />

      <View style={[styles.safe, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>{t.appName}</Text>
            <Text style={styles.tagline}>{t.tagline}</Text>
          </View>

          <View style={styles.headerRight}>
            {/* Language toggle */}
            <TouchableOpacity style={styles.langBtn} onPress={toggleLang}>
              <Text style={styles.langText}>{lang === 'en' ? '🇹🇷' : '🇬🇧'}</Text>
            </TouchableOpacity>

            {/* Reminder */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => setReminderVisible(true)}>
              <Text style={styles.iconBtnText}>
                {savedReminderHour !== null ? '🔔' : '🔕'}
              </Text>
            </TouchableOpacity>

            {/* Pro badge / upgrade */}
            {!isPremium ? (
              <TouchableOpacity style={styles.proBtn} onPress={() => setPremiumVisible(true)}>
                <Text style={styles.proBtnText}>👑 Pro</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO 👑</Text>
              </View>
            )}
          </View>
        </View>

        {/* Banner Ad — free users only */}
        {!isPremium && (
          <BannerAd
            unitId={BANNER_AD_ID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        )}

        {/* Sound list */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: playerBarH + insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <StatsBar t={t} />

          {isPremium && tracks.length === 1 && (
            <View style={styles.mixHint}>
              <Text style={styles.mixHintText}>{t.mixHint}</Text>
            </View>
          )}

          {/* Free sounds */}
          <Text style={styles.sectionLabel}>{t.freeSounds}</Text>
          {freeSounds.map(sound => (
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

          {/* Pro sounds */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
            {t.premiumSounds} {!isPremium && '🔒'}
          </Text>
          {proSounds.map(sound => (
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

          {/* Upsell banner */}
          {!isPremium && (
            <TouchableOpacity
              style={styles.upsell}
              onPress={() => setPremiumVisible(true)}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={[Colors.primary + '28', Colors.primary + '0A']}
                style={styles.upsellInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.upsellTitle}>{t.unlockTitle}</Text>
                <Text style={styles.upsellSub}>{t.unlockSub}</Text>
                <View style={styles.upsellBtnWrap}>
                  <Text style={styles.upsellBtn}>{t.unlockBtn}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* PlayerBar — slides up from bottom */}
      <PlayerBar
        tracks={tracks}
        timerLabel={timerMinutes ? formatRemaining() : null}
        onStop={stopAll}
        onTimerPress={() => setTimerVisible(true)}
        onVolumeChange={setTrackVolume}
        visible={isPlaying}
      />

      <TimerModal
        visible={timerVisible}
        activeMinutes={timerMinutes}
        onSelect={startTimer}
        onClear={clearTimer}
        onClose={() => setTimerVisible(false)}
        t={t}
      />

      <PremiumModal
        visible={premiumVisible}
        isLoading={purchaseLoading}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        onClose={() => setPremiumVisible(false)}
        t={t}
      />

      <ReminderModal
        visible={reminderVisible}
        savedHour={savedReminderHour}
        onSave={handleSaveReminder}
        onCancel={handleCancelReminder}
        onClose={() => setReminderVisible(false)}
        t={t}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },

  // Ambient glow orbs
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.07,
  },
  glowOrb1: {
    width: 300,
    height: 300,
    backgroundColor: Colors.primary,
    top: -80,
    left: -60,
  },
  glowOrb2: {
    width: 200,
    height: 200,
    backgroundColor: Colors.accent,
    top: SCREEN_H * 0.3,
    right: -80,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langText: { fontSize: 18 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBtnText: { fontSize: 17 },
  proBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.goldDim,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gold + '50',
  },
  proBtnText: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: '700',
  },
  proBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.primaryDim,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  proBadgeText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  // List
  list: { flex: 1 },
  listContent: { paddingTop: 4 },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },

  mixHint: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: Colors.accentDim,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  mixHintText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },

  // Upsell
  upsell: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  upsellInner: {
    padding: 20,
    borderRadius: 20,
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
  upsellBtnWrap: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryDim,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  upsellBtn: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
