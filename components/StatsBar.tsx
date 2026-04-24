import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import { Strings } from '../constants/i18n';

const TODAY_KEY = () => `sleep_minutes_${new Date().toISOString().slice(0, 10)}`;

export function useSessionTracker(isPlaying: boolean) {
  const startRef = React.useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      startRef.current = Date.now();
    } else if (startRef.current) {
      const mins = Math.floor((Date.now() - startRef.current) / 60000);
      startRef.current = null;
      if (mins > 0) {
        AsyncStorage.getItem(TODAY_KEY()).then(v => {
          const prev = parseInt(v || '0', 10);
          AsyncStorage.setItem(TODAY_KEY(), String(prev + mins));
        });
      }
    }
  }, [isPlaying]);
}

interface Props { t: Strings; }

export default function StatsBar({ t }: Props) {
  const [mins, setMins] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(TODAY_KEY()).then(v => setMins(parseInt(v || '0', 10)));
    const id = setInterval(() => {
      AsyncStorage.getItem(TODAY_KEY()).then(v => setMins(parseInt(v || '0', 10)));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  if (mins === 0) return null;

  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  const label = hours > 0 ? `${hours}h ${rem}m` : `${rem}m`;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🌙</Text>
      <Text style={styles.text}>
        {t.todaySession} <Text style={styles.value}>{label}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: { fontSize: 14 },
  text: { fontSize: 13, color: Colors.textSecondary },
  value: { color: Colors.accent, fontWeight: '700' },
});
