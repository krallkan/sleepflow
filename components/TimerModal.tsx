import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Strings } from '../constants/i18n';

const TIMER_OPTIONS = [15, 30, 45, 60, 90, 120];

interface Props {
  visible: boolean;
  activeMinutes: number | null;
  onSelect: (minutes: number) => void;
  onClear: () => void;
  onClose: () => void;
  t: Strings;
}

export default function TimerModal({ visible, activeMinutes, onSelect, onClear, onClose, t }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}
          onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t.timerTitle}</Text>
          <Text style={styles.subtitle}>{t.timerSub}</Text>

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
              <Text style={styles.clearText}>{t.cancelTimer}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
  },
  handle: {
    width: 36,
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
    gap: 10,
    marginBottom: 20,
  },
  option: {
    width: '30%',
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionActive: {
    backgroundColor: Colors.primaryDim,
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
    backgroundColor: Colors.error + '18',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error + '40',
  },
  clearText: {
    color: Colors.error,
    fontSize: 15,
    fontWeight: '700',
  },
});
