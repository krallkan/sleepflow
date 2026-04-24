import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lang, translations, Strings } from '../constants/i18n';

const LANG_KEY = 'sleepflow_lang';

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then(v => {
      if (v === 'en' || v === 'tr') setLangState(v);
    });
  }, []);

  const setLang = useCallback(async (l: Lang) => {
    setLangState(l);
    await AsyncStorage.setItem(LANG_KEY, l);
  }, []);

  const t: Strings = translations[lang];

  return { lang, setLang, t };
}
