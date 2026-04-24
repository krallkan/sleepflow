import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import {
  initConnection,
  endConnection,
  requestPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  getAvailablePurchases,
  type Purchase,
} from 'react-native-iap';

const PREMIUM_KEY = 'sleepflow_premium';

export const IAP_SKUS = {
  monthly: 'sleepflow_pro_monthly',
  yearly: 'sleepflow_pro_yearly',
};

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PREMIUM_KEY).then(v => {
      if (v === 'true') setIsPremium(true);
    });

    if (Platform.OS !== 'android') return;

    initConnection()
      .then(() => setConnected(true))
      .catch(() => {});

    const purchaseListener = purchaseUpdatedListener(async (purchase: Purchase) => {
      if (purchase.transactionId) {
        await finishTransaction({ purchase, isConsumable: false });
        await AsyncStorage.setItem(PREMIUM_KEY, 'true');
        setIsPremium(true);
      }
    });

    const errorListener = purchaseErrorListener(err => {
      if ((err as any).code !== 'E_USER_CANCELLED') {
        Alert.alert('Purchase failed', err.message);
      }
    });

    return () => {
      purchaseListener.remove();
      errorListener.remove();
      endConnection().catch(() => {});
    };
  }, []);

  const purchase = useCallback(async (sku: string = IAP_SKUS.monthly) => {
    if (!connected) {
      Alert.alert('Store not available', 'Please check your internet connection.');
      return false;
    }
    try {
      setIsLoading(true);
      await requestPurchase({
        type: 'subs',
        request: {
          google: { skus: [sku] },
        },
      });
      return true;
    } catch (e: any) {
      if (e.code !== 'E_USER_CANCELLED') {
        Alert.alert('Purchase error', e.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [connected]);

  const restore = useCallback(async () => {
    try {
      setIsLoading(true);
      const purchases = await getAvailablePurchases();
      const hasPro = purchases.some(p =>
        Object.values(IAP_SKUS).includes(p.productId)
      );
      if (hasPro) {
        await AsyncStorage.setItem(PREMIUM_KEY, 'true');
        setIsPremium(true);
      }
      return hasPro;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isPremium, isLoading, purchase, restore };
}
