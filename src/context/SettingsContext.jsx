import { createContext, useContext, useState, useEffect } from 'react'
import { fetchSettings } from '../services/settings'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadSettings() }, [])

  async function loadSettings() {
    try {
      const data = await fetchSettings()
      setSettings(data)
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, reload: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within SettingsProvider')
  return context
}
