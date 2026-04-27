import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Alert } from 'react-native';

const PREMIUM_KEY = 'sleepflow_premium';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.sleepflow.white.noise';

const TEST_MODE = false;

export const IAP_SKUS = {
  monthly: 'sleepflow_pro_monthly',
  yearly: 'sleepflow_pro_yearly',
};

export function usePremium() {
  const [isPremium, setIsPremium] = useState(TEST_MODE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (TEST_MODE) return;
    AsyncStorage.getItem(PREMIUM_KEY).then(v => {
      if (v === 'true') setIsPremium(true);
    });
  }, []);

  // Opens Google Play subscription page — actual billing handled by Play Store
  const purchase = useCallback(async (_sku: string = IAP_SKUS.monthly) => {
    try {
      setIsLoading(true);
      await Linking.openURL(PLAY_STORE_URL);
    } catch {
      Alert.alert('Error', 'Could not open Google Play Store.');
    } finally {
      setIsLoading(false);
    }
    return true;
  }, []);

  const restore = useCallback(async () => {
    // Manual restore: user contacts support or re-installs
    Alert.alert(
      'Restore Purchase',
      'If you have an active subscription, please contact support@sleepflow.app',
      [{ text: 'OK' }]
    );
    return false;
  }, []);

  // Dev/test unlock (remove in production)
  const unlock = useCallback(async () => {
    await AsyncStorage.setItem(PREMIUM_KEY, 'true');
    setIsPremium(true);
  }, []);

  return { isPremium, isLoading, purchase, restore, unlock };
}
