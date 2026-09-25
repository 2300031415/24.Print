import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import te from '../locales/te.json';
import hi from '../locales/hi.json';

const dictionaries = {
  en,
  te,
  hi
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' }
];

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('easyxerox_lang') || 'en';
  });

  const changeLanguage = (langCode) => {
    if (dictionaries[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem('easyxerox_lang', langCode);
    }
  };

  /**
   * Helper function to fetch nested translation key: t('services.copy')
   */
  const t = (pathStr, fallback = '') => {
    try {
      const dict = dictionaries[currentLanguage] || dictionaries.en;
      const keys = pathStr.split('.');
      let result = dict;

      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          result = undefined;
          break;
        }
      }

      if (result !== undefined) return result;

      // Fallback to English dictionary if key is missing in active language
      let enFallback = dictionaries.en;
      for (const k of keys) {
        if (enFallback && typeof enFallback === 'object' && k in enFallback) {
          enFallback = enFallback[k];
        } else {
          return fallback || pathStr;
        }
      }
      return enFallback !== undefined ? enFallback : (fallback || pathStr);
    } catch (_) {
      return fallback || pathStr;
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
