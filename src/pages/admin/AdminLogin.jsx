import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin({ addToast }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      addToast('Logged in successfully')
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-8">
          <img src="/njugushmitumba.png" alt="Njugush Mitumba Bales" className="w-16 h-16 rounded-xl object-cover mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-navy-500">Admin Login</h2>
          <p className="text-navy-300 text-sm mt-1">Enter your credentials to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-3.5 rounded-xl border border-navy-100 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none mb-4" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3.5 rounded-xl border border-navy-100 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none mb-4" />
          {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-gold-500 hover:bg-gold-400 text-navy-700 font-bold py-3.5 rounded-xl transition-colors text-sm disabled:opacity-60">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <a href="/" className="block w-full text-navy-300 hover:text-navy-500 text-sm mt-4 py-2 text-center transition-colors">Back to Website</a>
      </div>
    </div>
  )
}