import { useEffect, useRef, useCallback } from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Replace with real Ad Unit IDs after AdMob approval
const INTERSTITIAL_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';

export function useInterstitialAd(isPremium: boolean) {
  const adRef = useRef<InterstitialAd | null>(null);
  const loadedRef = useRef(false);
  const showCountRef = useRef(0);

  const loadAd = useCallback(() => {
    if (isPremium) return;
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
      requestNonPersonalizedAdsOnly: false,
    });
    ad.addAdEventListener(AdEventType.LOADED, () => { loadedRef.current = true; });
    ad.addAdEventListener(AdEventType.CLOSED, () => {
      loadedRef.current = false;
      loadAd();
    });
    ad.load();
    adRef.current = ad;
  }, [isPremium]);

  useEffect(() => {
    loadAd();
  }, [loadAd]);

  // Show interstitial every 3 sound changes (not spammy)
  const maybeShowAd = useCallback(() => {
    if (isPremium) return;
    showCountRef.current += 1;
    if (showCountRef.current % 3 === 0 && loadedRef.current && adRef.current) {
      adRef.current.show();
    }
  }, [isPremium]);

  return { maybeShowAd };
}

// Banner Ad Unit ID export — used directly in component
export const BANNER_AD_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
