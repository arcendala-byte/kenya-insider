'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { locales, type Locale } from '@/lib/i18n';

type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('kenya-insider-locale');
      if (saved && locales.includes(saved as Locale)) {
        setLocaleState(saved as Locale);
        return;
      }
      const match = document.cookie.match(/(?:^|;\s*)kenya-insider-locale=([^;]+)/);
      if (match && locales.includes(match[1] as Locale)) {
        setLocaleState(match[1] as Locale);
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  const setLocale = (next: Locale) => {
    if (!locales.includes(next)) return;
    try {
      window.localStorage.setItem('kenya-insider-locale', next);
      document.cookie = `kenya-insider-locale=${next}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = next;
    } catch {
      // ignore storage access errors
    }
    setLocaleState(next);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}
