import { supabase } from '../lib/supabase'

export async function fetchTestimonials() {
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchVisibleTestimonials() {
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(6)
  if (error) throw error
  return data
}

export async function createTestimonial({ customer_name, photo, rating, message }) {
  const { data, error } = await supabase.from('testimonials').insert({ customer_name, photo: photo || null, rating: Number(rating), message }).select().single()
  if (error) throw error
  return data
}

export async function deleteTestimonial(id) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw error
}
