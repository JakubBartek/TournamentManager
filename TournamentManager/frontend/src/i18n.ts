import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enTranslation from './locales/en/translation.json'
import skTranslation from './locales/sk/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'sk',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      sk: {
        translation: skTranslation,
      },
    },
  })

export default i18n
