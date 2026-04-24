import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { IAP_SKUS } from '../hooks/usePremium';

interface Props {
  visible: boolean;
  isLoading: boolean;
  onPurchase: (sku: string) => void;
  onRestore: () => void;
  onClose: () => void;
}

const FEATURES = [
  { icon: '🎵', text: '8 premium sounds — Forest, Storm, Fan, Fireplace, Brown Noise' },
  { icon: '🎛️', text: 'Mix 2 sounds simultaneously with individual volume control' },
  { icon: '⏱', text: 'Sleep timer up to 2 hours' },
  { icon: '🔇', text: 'No ads, ever' },
  { icon: '🔔', text: 'Custom sleep reminders' },
  { icon: '🌙', text: 'Background playback' },
];

export default function PremiumModal({ visible, isLoading, onPurchase, onRestore, onClose }: Props) {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient colors={['#6C63FF33', '#0d111700']} style={styles.header}>
              <Text style={styles.crown}>👑</Text>
              <Text style={styles.title}>SleepFlow Pro</Text>
              <Text style={styles.sub}>Unlock everything. Sleep better.</Text>
            </LinearGradient>

            <View style={styles.features}>
              {FEATURES.map((f, i) => (
                <View key={i} style={styles.feature}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>

            {/* Plan picker */}
            <View style={styles.planRow}>
              <TouchableOpacity
                style={[styles.planCard, plan === 'monthly' && styles.planCardActive]}
                onPress={() => setPlan('monthly')}
              >
                <Text style={styles.planLabel}>Monthly</Text>
                <Text style={[styles.planPrice, plan === 'monthly' && styles.planPriceActive]}>$2.99</Text>
                <Text style={styles.planSub}>per month</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.planCard, plan === 'yearly' && styles.planCardActive]}
                onPress={() => setPlan('yearly')}
              >
                <View style={styles.saveBadge}><Text style={styles.saveBadgeText}>SAVE 44%</Text></View>
                <Text style={styles.planLabel}>Yearly</Text>
                <Text style={[styles.planPrice, plan === 'yearly' && styles.planPriceActive]}>$19.99</Text>
                <Text style={styles.planSub}>$1.67/month</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.purchaseBtn}
              onPress={() => onPurchase(plan === 'monthly' ? IAP_SKUS.monthly : IAP_SKUS.yearly)}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.primary, '#9B93FF']}
                style={styles.purchaseGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                {isLoading
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Text style={styles.purchaseText}>Start 3-Day Free Trial</Text>
                      <Text style={styles.purchaseSub}>
                        Then {plan === 'monthly' ? '$2.99/mo' : '$19.99/yr'} · Cancel anytime
                      </Text>
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.restoreBtn} onPress={onRestore}>
              <Text style={styles.restoreText}>Restore Purchase</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Subscription auto-renews. Cancel anytime in Google Play.{'\n'}
              Payment charged to your Google Play account.
            </Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '92%' },
  handle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { alignItems: 'center', padding: 20, paddingBottom: 12 },
  crown: { fontSize: 44, marginBottom: 6 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  sub: { fontSize: 14, color: Colors.textSecondary },
  features: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  feature: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  featureIcon: { fontSize: 20, width: 28, textAlign: 'center', marginTop: 1 },
  featureText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  planRow: { flexDirection: 'row', gap: 12, marginHorizontal: 20, marginBottom: 16 },
  planCard: {
    flex: 1, padding: 14, borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', position: 'relative',
  },
  planCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  saveBadge: {
    position: 'absolute', top: -10,
    backgroundColor: Colors.gold,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2,
  },
  saveBadgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  planLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4, marginTop: 6 },
  planPrice: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  planPriceActive: { color: Colors.primary },
  planSub: { fontSize: 11, color: Colors.textMuted },
  purchaseBtn: { marginHorizontal: 20, marginBottom: 10, borderRadius: 16, overflow: 'hidden' },
  purchaseGradient: { paddingVertical: 18, alignItems: 'center' },
  purchaseText: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 3 },
  purchaseSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  restoreBtn: { alignItems: 'center', padding: 12 },
  restoreText: { color: Colors.textSecondary, fontSize: 14 },
  disclaimer: { textAlign: 'center', fontSize: 11, color: Colors.textMuted, marginHorizontal: 24, marginBottom: 32, lineHeight: 16 },
});
