import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/colors';

const TIMER_OPTIONS = [15, 30, 45, 60, 90, 120];

interface Props {
  visible: boolean;
  activeMinutes: number | null;
  onSelect: (minutes: number) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function TimerModal({ visible, activeMinutes, onSelect, onClear, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Sleep Timer</Text>
          <Text style={styles.subtitle}>Stop playing after...</Text>

          <View style={styles.grid}>
            {TIMER_OPTIONS.map(min => (
              <TouchableOpacity
                key={min}
                style={[styles.option, activeMinutes === min && styles.optionActive]}
                onPress={() => { onSelect(min); onClose(); }}
              >
                <Text style={[styles.optionText, activeMinutes === min && styles.optionTextActive]}>
                  {min >= 60 ? `${min / 60}h` : `${min}m`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeMinutes && (
            <TouchableOpacity style={styles.clearBtn} onPress={() => { onClear(); onClose(); }}>
              <Text style={styles.clearText}>Cancel Timer</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  option: {
    width: '30%',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionActive: {
    backgroundColor: Colors.primary + '33',
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: Colors.primary,
  },
  clearBtn: {
    padding: 16,
    backgroundColor: Colors.error + '22',
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error + '44',
  },
  clearText: {
    color: Colors.error,
    fontSize: 15,
    fontWeight: '600',
  },
});
