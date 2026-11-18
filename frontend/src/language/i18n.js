import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import bn from './bn.json'

const savedLanguage = localStorage.getItem('i18nextLng') || 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bn: { translation: bn },
    },
    lng: savedLanguage.startsWith('bn') ? 'bn' : 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
