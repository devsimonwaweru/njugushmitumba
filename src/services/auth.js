import { supabase } from '../lib/supabase'

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  if (data.user?.user_metadata?.role !== 'admin') {
    await supabase.auth.signOut()
    throw new Error('Access denied. Admin only.')
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error

  if (!user) return null

  if (user.user_metadata?.role !== 'admin') {
    return null
  }

  return user
}

// ❌ DO NOT make this async
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user?.user_metadata?.role === 'admin') {
      callback(session.user)
    } else {
      callback(null)
    }
  })
}