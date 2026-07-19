import { supabase } from '../lib/supabase'

export async function fetchSettings() {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single()
  if (error) throw error
  return data
}

export async function updateSettings(updates) {
  const { data, error } = await supabase.from('settings').update(updates).eq('id', 1).select().single()
  if (error) throw error
  return data
}
