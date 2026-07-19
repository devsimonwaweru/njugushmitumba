import { supabase } from '../lib/supabase'

export async function submitMessage({ name, phone, email, message }) {
  const { data, error } = await supabase.from('messages').insert({ name, phone, email: email || null, message }).select().single()
  if (error) throw error
  return data
}

export async function fetchMessages() {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function markMessageAsRead(id) {
  const { data, error } = await supabase.from('messages').update({ read: true }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteMessage(id) {
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) throw error
}
