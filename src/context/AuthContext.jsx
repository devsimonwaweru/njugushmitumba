import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, signIn, signOut, onAuthStateChange } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then(user => { setAdmin(user); setLoading(false) })
    const { data: { subscription } } = onAuthStateChange((user) => { setAdmin(user); setLoading(false) })
    return () => subscription.unsubscribe()
  }, [])

  async function login(email, password) {
    const data = await signIn(email, password)
    setAdmin(data.user)
    return data
  }

  async function logout() {
    await signOut()
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
