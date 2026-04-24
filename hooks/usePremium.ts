import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const PREMIUM_KEY = 'sleepflow_premium';

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PREMIUM_KEY).then(v => {
      if (v === 'true') setIsPremium(true);
    });
  }, []);

  // In production: integrate RevenueCat or Google Play Billing here
  const purchase = useCallback(async () => {
    // TODO: Implement real purchase flow with react-native-purchases
    await AsyncStorage.setItem(PREMIUM_KEY, 'true');
    setIsPremium(true);
    return true;
  }, []);

  const restore = useCallback(async () => {
    const v = await AsyncStorage.getItem(PREMIUM_KEY);
    const result = v === 'true';
    setIsPremium(result);
    return result;
  }, []);

  return { isPremium, purchase, restore };
}
