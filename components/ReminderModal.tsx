import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/colors';

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
}

export default function ReminderModal({ visible, savedHour, onSave, onCancel, onClose }: Props) {
  const [selected, setSelected] = useState(savedHour ?? 22);

  useEffect(() => {
    if (savedHour !== null) setSelected(savedHour);
  }, [savedHour]);

  const commonTimes = [20, 21, 22, 23, 0];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>🔔 Sleep Reminder</Text>
          <Text style={styles.subtitle}>We'll remind you to start your sleep sounds</Text>

          <Text style={styles.sectionLabel}>Quick select</Text>
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

          <Text style={styles.sectionLabel}>Or choose a time</Text>
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
            <Text style={styles.saveBtnText}>Set Reminder for {fmt(selected)}</Text>
          </TouchableOpacity>

          {savedHour !== null && (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { onCancel(); onClose(); }}>
              <Text style={styles.cancelText}>Remove Reminder</Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 20 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  quick: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary + '33', borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary },
  chipTextActive: { color: Colors.primary, fontWeight: '700' },
  hourGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  hourBtn: {
    width: '22%', paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  hourBtnActive: { backgroundColor: Colors.primary + '33', borderColor: Colors.primary },
  hourText: { fontSize: 11, color: Colors.textSecondary },
  hourTextActive: { color: Colors.primary, fontWeight: '700' },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  cancelBtn: { alignItems: 'center', padding: 12 },
  cancelText: { color: Colors.error, fontSize: 14 },
});
