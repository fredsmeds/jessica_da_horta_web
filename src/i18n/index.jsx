import { createContext, useContext, useState, useCallback } from 'react'
import pt from './pt'

const loaded = { pt }
const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('pt')
  const [translations, setTranslations] = useState({ pt })

  const setLang = useCallback(async (newLang) => {
    if (loaded[newLang]) {
      setLangState(newLang)
      return
    }
    const mod = await import(`./${newLang}.js`)
    loaded[newLang] = mod.default
    setTranslations(prev => ({ ...prev, [newLang]: mod.default }))
    setLangState(newLang)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
