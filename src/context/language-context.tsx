
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { setCookie, parseCookies } from 'nookies';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

type Locale = 'en' | 'ar';
type Translations = typeof en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const translations: { [key in Locale]: Translations } = { en, ar };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const cookies = parseCookies();
    const savedLocale = cookies.locale as Locale;
    if (savedLocale && ['en', 'ar'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie(null, 'locale', newLocale, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    if (typeof window !== 'undefined') {
        document.documentElement.lang = newLocale;
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let text = keys.reduce((obj, k) => (obj as any)?.[k], translations[locale]) as string | undefined;

    if (text === undefined) {
      console.warn(`Translation key "${key}" not found for locale "${locale}"`);
      // Fallback to English
      text = keys.reduce((obj, k) => (obj as any)?.[k], translations['en']) as string | undefined;
      if (text === undefined) {
        return key;
      }
    }

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        text = text!.replace(new RegExp(`{{${placeholder}}}`, 'g'), String(replacements[placeholder]));
      });
    }

    return text;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
