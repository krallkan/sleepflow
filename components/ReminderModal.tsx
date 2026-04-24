import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Strings } from '../constants/i18n';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function fmt(h: number) {
  const period = h < 12 ? 'AM' : 'PM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:00 ${period}`;
}

interface Props {
  visible: boolean;
  savedHour: number | null;
  onSave: (hour: number) => void;
  onCancel: () => void;
  onClose: () => void;
  t: Strings;
}

export default function ReminderModal({ visible, savedHour, onSave, onCancel, onClose, t }: Props) {
  const [selected, setSelected] = useState(savedHour ?? 22);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (savedHour !== null) setSelected(savedHour);
  }, [savedHour]);

  const commonTimes = [20, 21, 22, 23, 0];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}
          onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <Text style={styles.title}>{t.reminderTitle}</Text>
            <Text style={styles.subtitle}>{t.reminderSub}</Text>

            <Text style={styles.sectionLabel}>{t.quickSelect}</Text>
            <View style={styles.quick}>
              {commonTimes.map(h => (
                <TouchableOpacity
                  key={h}
                  style={[styles.chip, selected === h && styles.chipActive]}
                  onPress={() => setSelected(h)}
                >
                  <Text style={[styles.chipText, selected === h && styles.chipTextActive]}>
                    {fmt(h)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>{t.chooseTime}</Text>
            <View style={styles.hourGrid}>
              {HOURS.map(h => (
                <TouchableOpacity
                  key={h}
                  style={[styles.hourBtn, selected === h && styles.hourBtnActive]}
                  onPress={() => setSelected(h)}
                >
                  <Text style={[styles.hourText, selected === h && styles.hourTextActive]}>
                    {fmt(h)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => { onSave(selected); onClose(); }}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                style={styles.saveGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveBtnText}>{t.setReminder} {fmt(selected)}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {savedHour !== null && (
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { onCancel(); onClose(); }}>
                <Text style={styles.cancelText}>{t.removeReminder}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '88%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
  },
  handle: {
    width: 36, height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 20 },
  sectionLabel: {
    fontSize: 10, fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  quick: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primaryDim, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary },
  chipTextActive: { color: Colors.primary, fontWeight: '700' },
  hourGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  hourBtn: {
    width: '22%', paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  hourBtnActive: { backgroundColor: Colors.primaryDim, borderColor: Colors.primary },
  hourText: { fontSize: 11, color: Colors.textSecondary },
  hourTextActive: { color: Colors.primary, fontWeight: '700' },
  saveBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 10 },
  saveGradient: { paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  cancelBtn: { alignItems: 'center', padding: 12 },
  cancelText: { color: Colors.error, fontSize: 14, fontWeight: '600' },
});
