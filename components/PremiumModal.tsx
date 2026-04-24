import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { IAP_SKUS } from '../hooks/usePremium';
import { Strings } from '../constants/i18n';

interface Props {
  visible: boolean;
  isLoading: boolean;
  onPurchase: (sku: string) => void;
  onRestore: () => void;
  onClose: () => void;
  t: Strings;
}

export default function PremiumModal({ visible, isLoading, onPurchase, onRestore, onClose, t }: Props) {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 8) }]}
          onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Header */}
            <LinearGradient
              colors={[Colors.primary + '30', Colors.background + '00']}
              style={styles.header}
            >
              <View style={styles.crownWrap}>
                <LinearGradient colors={[Colors.gold, '#FF8C00']} style={styles.crownCircle}>
                  <Text style={styles.crown}>👑</Text>
                </LinearGradient>
              </View>
              <Text style={styles.title}>{t.proTitle}</Text>
              <Text style={styles.sub}>{t.proSub}</Text>
            </LinearGradient>

            {/* Features */}
            <View style={styles.features}>
              {t.proFeatures.map((f, i) => (
                <View key={i} style={styles.feature}>
                  <View style={styles.featureIconWrap}>
                    <Text style={styles.featureIcon}>{f.icon}</Text>
                  </View>
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
                <Text style={styles.planLabel}>{t.monthly}</Text>
                <Text style={[styles.planPrice, plan === 'monthly' && styles.planPriceActive]}>$2.99</Text>
                <Text style={styles.planSub}>{t.perMonth}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.planCard, plan === 'yearly' && styles.planCardActive]}
                onPress={() => setPlan('yearly')}
              >
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>{t.savePercent}</Text>
                </View>
                <Text style={styles.planLabel}>{t.yearly}</Text>
                <Text style={[styles.planPrice, plan === 'yearly' && styles.planPriceActive]}>$19.99</Text>
                <Text style={styles.planSub}>$1.67/{t.perMonth}</Text>
              </TouchableOpacity>
            </View>

            {/* Purchase button */}
            <TouchableOpacity
              style={styles.purchaseBtn}
              onPress={() => onPurchase(plan === 'monthly' ? IAP_SKUS.monthly : IAP_SKUS.yearly)}
              disabled={isLoading}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                style={styles.purchaseGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.purchaseText}>{t.startTrial}</Text>
                    <Text style={styles.purchaseSub}>
                      {t.thenPrice} {plan === 'monthly' ? '$2.99/mo' : '$19.99/yr'} {t.cancelAnytime}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.restoreBtn} onPress={onRestore}>
              <Text style={styles.restoreText}>{t.restorePurchase}</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>{t.disclaimer}</Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '92%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
  },
  handle: {
    width: 36, height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12, marginBottom: 4,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  crownWrap: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 12,
  },
  crownCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crown: { fontSize: 36 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  sub: { fontSize: 14, color: Colors.textSecondary },
  features: { paddingHorizontal: 20, paddingBottom: 16, gap: 10 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIconWrap: {
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: { fontSize: 18 },
  featureText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  planRow: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 16 },
  planCard: {
    flex: 1, padding: 14, borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', position: 'relative',
  },
  planCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDim,
  },
  saveBadge: {
    position: 'absolute', top: -11,
    backgroundColor: Colors.accent,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2,
  },
  saveBadgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  planLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4, marginTop: 6 },
  planPrice: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  planPriceActive: { color: Colors.primary },
  planSub: { fontSize: 11, color: Colors.textMuted },
  purchaseBtn: { marginHorizontal: 20, marginBottom: 10, borderRadius: 18, overflow: 'hidden' },
  purchaseGradient: { paddingVertical: 18, alignItems: 'center', gap: 4 },
  purchaseText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  purchaseSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  restoreBtn: { alignItems: 'center', padding: 12 },
  restoreText: { color: Colors.textSecondary, fontSize: 14 },
  disclaimer: {
    textAlign: 'center', fontSize: 11,
    color: Colors.textMuted,
    marginHorizontal: 24, marginBottom: 20,
    lineHeight: 16,
  },
});
