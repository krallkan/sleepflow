import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

interface Props {
  visible: boolean;
  onPurchase: () => void;
  onRestore: () => void;
  onClose: () => void;
}

const FEATURES = [
  { icon: '🎵', text: '8 premium sounds (Forest, Thunderstorm, Fan, Fireplace, Brown Noise)' },
  { icon: '⏱', text: 'Sleep timer up to 2 hours' },
  { icon: '🔇', text: 'No ads, ever' },
  { icon: '🌙', text: 'Background playback' },
  { icon: '🔄', text: 'Seamless looping' },
];

export default function PremiumModal({ visible, onPurchase, onRestore, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={['#6C63FF33', '#0d111700']}
              style={styles.header}
            >
              <Text style={styles.crown}>👑</Text>
              <Text style={styles.title}>SleepFlow Pro</Text>
              <Text style={styles.price}>$2.99 / month</Text>
              <Text style={styles.or}>or $19.99 / year (save 44%)</Text>
            </LinearGradient>

            <View style={styles.features}>
              {FEATURES.map((f, i) => (
                <View key={i} style={styles.feature}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.purchaseBtn} onPress={onPurchase} activeOpacity={0.8}>
              <LinearGradient
                colors={[Colors.primary, '#9B93FF']}
                style={styles.purchaseGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.purchaseText}>Start Free Trial</Text>
                <Text style={styles.purchaseSub}>3 days free, then $2.99/mo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.restoreBtn} onPress={onRestore}>
              <Text style={styles.restoreText}>Restore Purchase</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Cancel anytime. Payment charged to Google Play account.
            </Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  crown: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  or: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  features: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 14,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIcon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  purchaseBtn: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  purchaseGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  purchaseText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 3,
  },
  purchaseSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  restoreBtn: {
    alignItems: 'center',
    padding: 12,
  },
  restoreText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    marginHorizontal: 24,
    marginBottom: 32,
    lineHeight: 16,
  },
});
