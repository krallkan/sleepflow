import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const REMINDER_KEY = 'sleepflow_reminder_hour';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

  const scheduleNightlyReminder = useCallback(async (hour: number, minute: number = 0) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.setItem(REMINDER_KEY, String(hour));

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Sleep time!',
        body: 'Time to relax. Open SleepFlow and drift off with calming sounds.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }, []);

  const cancelReminder = useCallback(async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(REMINDER_KEY);
  }, []);

  const getSavedHour = useCallback(async () => {
    const v = await AsyncStorage.getItem(REMINDER_KEY);
    return v ? parseInt(v, 10) : null;
  }, []);

  return { scheduleNightlyReminder, cancelReminder, getSavedHour };
}
