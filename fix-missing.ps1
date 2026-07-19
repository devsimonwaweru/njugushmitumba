# =============================================
# Creates all missing foundation files
# =============================================

# Ensure all directories exist
 $dirs = @(
    "src/lib",
    "src/services",
    "src/hooks",
    "src/utils",
    "src/components/layout"
)
foreach ($d in $dirs) {
    New-Item -ItemType Directory -Force -Path $d | Out-Null
}

# ===== src/lib/supabase.js =====
@"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
"@ | Set-Content -Encoding UTF8 "src/lib/supabase.js"

# ===== src/lib/cloudinary.js =====
@"
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Missing Cloudinary environment variables')
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'njugush-mitumba')
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Upload failed')
  }
  const data = await response.json()
  return data.secure_url
}

export async function uploadMultipleToCloudinary(files) {
  return Promise.all(files.map(uploadToCloudinary))
}
"@ | Set-Content -Encoding UTF8 "src/lib/cloudinary.js"

# ===== src/services/auth.js =====
@"
import { supabase } from '../lib/supabase'

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  if (user.user_metadata?.role !== 'admin') return null
  return user
}

export async function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user?.user_metadata?.role === 'admin') {
      callback(session.user)
    } else {
      callback(null)
    }
  })
}
"@ | Set-Content -Encoding UTF8 "src/services/auth.js"

# ===== src/services/settings.js =====
@"
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
"@ | Set-Content -Encoding UTF8 "src/services/settings.js"

# ===== src/services/messages.js =====
@"
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
"@ | Set-Content -Encoding UTF8 "src/services/messages.js"

# ===== src/services/testimonials.js =====
@"
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
"@ | Set-Content -Encoding UTF8 "src/services/testimonials.js"

# ===== src/services/catalogue.js =====
@"
import { supabase } from '../lib/supabase'

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true })
  if (error) throw error
  return data
}

export async function createCategory({ name, slug, image }) {
  const { data, error } = await supabase.from('categories').insert({ name, slug, image }).select().single()
  if (error) throw error
  return data
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

export async function fetchBales({ category, grade, available, search, sort, page = 1, perPage = 6 } = {}) {
  let query = supabase.from('bales').select('*, category:categories(id, name, slug), images:bale_images(id, image_url, sort_order)', { count: 'exact' })
  if (category) query = query.eq('category_id', category)
  if (grade) query = query.eq('grade', grade)
  if (available === true) query = query.eq('available', true)
  if (available === false) query = query.eq('available', false)
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  switch (sort) {
    case 'newest': query = query.order('created_at', { ascending: false }); break
    case 'oldest': query = query.order('created_at', { ascending: true }); break
    case 'price-low': query = query.order('price', { ascending: true }); break
    case 'price-high': query = query.order('price', { ascending: false }); break
    case 'featured': query = query.order('featured', { ascending: false }).order('created_at', { ascending: false }); break
    default: query = query.order('created_at', { ascending: false })
  }
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  query = query.range(from, to)
  const { data, error, count } = await query
  if (error) throw error
  return { bales: data, totalCount: count }
}

export async function fetchBaleBySlug(slug) {
  const { data, error } = await supabase.from('bales').select('*, category:categories(id, name, slug), images:bale_images(id, image_url, sort_order)').eq('slug', slug).single()
  if (error) throw error
  return data
}

export async function fetchRelatedBales(categoryId, excludeId) {
  const { data, error } = await supabase.from('bales').select('*, images:bale_images(id, image_url, sort_order)').eq('category_id', categoryId).neq('id', excludeId).eq('available', true).order('created_at', { ascending: false }).limit(4)
  if (error) throw error
  return data
}

export async function fetchFeaturedBales() {
  const { data, error } = await supabase.from('bales').select('*, category:categories(id, name, slug), images:bale_images(id, image_url, sort_order)').eq('featured', true).eq('available', true).order('created_at', { ascending: false }).limit(6)
  if (error) throw error
  return data
}

export async function createBale(baleData, imageUrls) {
  const { data: bale, error: baleError } = await supabase.from('bales').insert({
    category_id: baleData.category_id, name: baleData.name, slug: baleData.slug,
    description: baleData.description, price: Number(baleData.price), grade: baleData.grade,
    estimated_pieces: Number(baleData.estimated_pieces), country_of_origin: baleData.country_of_origin,
    featured: Boolean(baleData.featured), available: Boolean(baleData.available),
  }).select().single()
  if (baleError) throw baleError
  if (imageUrls && imageUrls.length > 0) {
    const images = imageUrls.map((url, index) => ({ bale_id: bale.id, image_url: url, sort_order: index }))
    const { error: imgError } = await supabase.from('bale_images').insert(images)
    if (imgError) throw imgError
  }
  return bale
}

export async function updateBale(id, baleData, newImageUrls, removedImageIds) {
  const { data, error } = await supabase.from('bales').update({
    category_id: baleData.category_id, name: baleData.name, slug: baleData.slug,
    description: baleData.description, price: Number(baleData.price), grade: baleData.grade,
    estimated_pieces: Number(baleData.estimated_pieces), country_of_origin: baleData.country_of_origin,
    featured: Boolean(baleData.featured), available: Boolean(baleData.available),
  }).eq('id', id).select().single()
  if (error) throw error
  if (removedImageIds && removedImageIds.length > 0) await supabase.from('bale_images').delete().in('id', removedImageIds)
  if (newImageUrls && newImageUrls.length > 0) {
    const existing = await supabase.from('bale_images').select('sort_order').eq('bale_id', id).order('sort_order', { ascending: false }).limit(1)
    const nextOrder = existing.data?.[0]?.sort_order + 1 || 0
    const images = newImageUrls.map((url, index) => ({ bale_id: id, image_url: url, sort_order: nextOrder + index }))
    await supabase.from('bale_images').insert(images)
  }
  return data
}

export async function deleteBale(id) {
  const { error } = await supabase.from('bales').delete().eq('id', id)
  if (error) throw error
}

export async function toggleBaleAvailability(id) {
  const { data: current, error: fetchError } = await supabase.from('bales').select('available').eq('id', id).single()
  if (fetchError) throw fetchError
  const { data, error } = await supabase.from('bales').update({ available: !current.available }).eq('id', id).select().single()
  if (error) throw error
  return data
}
"@ | Set-Content -Encoding UTF8 "src/services/catalogue.js"

# ===== src/utils/helpers.js =====
@"
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

export function generateSlug(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')
}

export function getWhatsAppLink(bale, phoneNumber) {
  const msg = encodeURIComponent(`Hello Njugush Mitumba Bales, I'm interested in:\n\n*${bale.name}*\nPrice: ${formatPrice(bale.price)}\nGrade: ${bale.grade}\nPieces: ~${bale.estimated_pieces}\n\nPlease share more details.`)
  return `https://wa.me/${phoneNumber}?text=${msg}`
}

export function getGeneralWhatsAppLink(phoneNumber) {
  const msg = encodeURIComponent('Hello Njugush Mitumba Bales, I would like to enquire about your mitumba bales.')
  return `https://wa.me/${phoneNumber}?text=${msg}`
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function getGradeLabel(grade) {
  const labels = { A: 'Premium', B: 'Standard', C: 'Economy' }
  return labels[grade] || grade
}
"@ | Set-Content -Encoding UTF8 "src/utils/helpers.js"

# ===== src/hooks/useScrollReveal.js =====
@"
import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || '0px 0px -50px 0px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return { ref, isVisible }
}
"@ | Set-Content -Encoding UTF8 "src/hooks/useScrollReveal.js"

# ===== src/hooks/useToast.js =====
@"
import { useState, useCallback } from 'react'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type, removing: false }])
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t))
      setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)) }, 300)
    }, 3500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t))
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)) }, 300)
  }, [])

  return { toasts, addToast, removeToast }
}
"@ | Set-Content -Encoding UTF8 "src/hooks/useToast.js"

# ===== src/components/layout/Navbar.jsx =====
@"
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Grid3X3 } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/#hero' },
  { label: 'Categories', href: '/#categories' },
  { label: 'Catalogue', href: '/#catalogue' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'Reviews', href: '/#testimonials' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    function handleScroll() { setScrolled(window.scrollY > 50) }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  function handleNavClick(e, href) {
    if (location.pathname === '/') {
      e.preventDefault()
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-navy-500/97 backdrop-blur-md shadow-[0_1px_0_rgba(212,160,23,0.3)]' : 'bg-transparent'}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <a href="/#hero" onClick={(e) => handleNavClick(e, '/#hero')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center">
                  <span className="text-navy-500 font-display font-bold text-lg">N</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-white font-display font-bold text-lg leading-tight">Njugush Mitumba</div>
                  <div className="text-gold-400 text-[10px] uppercase tracking-[3px] font-medium">Bales</div>
                </div>
              </div>
            </a>
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-white/80 hover:text-gold-400 text-sm font-medium transition-colors">{link.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href="/#catalogue" onClick={(e) => handleNavClick(e, '/#catalogue')} className="hidden sm:inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">Browse Catalogue</a>
              <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white p-2" aria-label="Open menu"><Menu className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </nav>
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-[150]" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
      <div className={`fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-navy-500 z-[160] overflow-y-auto transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-label="Mobile menu">
        <div className="flex items-center justify-between p-5 border-b border-navy-400">
          <span className="text-white font-display font-bold">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white p-1" aria-label="Close menu"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex flex-col p-5 gap-1">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-white/80 hover:text-gold-400 hover:bg-navy-400 px-4 py-3 rounded-lg text-sm font-medium transition-colors">{link.label}</a>
          ))}
          <div className="pt-4 mt-2 border-t border-navy-400">
            <a href="/#catalogue" onClick={(e) => handleNavClick(e, '/#catalogue')} className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-700 font-semibold text-sm px-5 py-3 rounded-lg transition-colors">Browse Catalogue</a>
          </div>
        </div>
      </div>
    </>
  )
}
"@ | Set-Content -Encoding UTF8 "src/components/layout/Navbar.jsx"

# ===== src/components/layout/Footer.jsx =====
@"
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Music2, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { fetchCategories } from '../../services/catalogue'
import { useEffect, useState } from 'react'

const socialLinks = [
  { icon: Facebook, key: 'facebook', label: 'Facebook' },
  { icon: Instagram, key: 'instagram', label: 'Instagram' },
  { icon: Twitter, key: 'twitter', label: 'Twitter' },
  { icon: Music2, key: 'tiktok', label: 'TikTok' },
]

export default function Footer() {
  const { settings } = useSettings()
  const [cats, setCats] = useState([])
  useEffect(() => { fetchCategories().then(setCats).catch(console.error) }, [])
  const s = settings || { business_name: 'Njugush Mitumba Bales', phone: '+254 712 345 678', email: 'info@njugushmitumba.co.ke', address: 'Warehouse 12, Gikomba Market, Nairobi, Kenya' }

  return (
    <footer className="bg-navy-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-600">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center"><span className="text-navy-500 font-display font-bold text-lg">N</span></div>
              <div><div className="text-white font-display font-bold text-lg leading-tight">Njugush Mitumba</div><div className="text-gold-400 text-[10px] uppercase tracking-[3px]">Bales</div></div>
            </div>
            <p className="text-navy-200 text-sm leading-relaxed mb-5">Quality. Affordable. Trusted. Your reliable partner for premium wholesale mitumba bales in Kenya.</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, key, label }) => (<a key={key} href={s[key] || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-navy-700 hover:bg-gold-500 text-navy-200 hover:text-navy-700 flex items-center justify-center transition-all" aria-label={label}><Icon className="w-4 h-4" /></a>))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-display font-bold mb-5">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {[['Home','hero'],['Catalogue','catalogue'],['Why Choose Us','why-us'],['Testimonials','testimonials'],['FAQ','faq'],['Contact','contact']].map(([item,id]) => (<li key={item}><a href={`/#${id}`} className="text-navy-200 hover:text-gold-400 text-sm transition-colors">{item}</a></li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-display font-bold mb-5">Categories</h4>
            <ul className="flex flex-col gap-3">{cats.slice(0, 6).map((cat) => (<li key={cat.id}><a href="/#catalogue" className="text-navy-200 hover:text-gold-400 text-sm transition-colors">{cat.name}</a></li>))}</ul>
          </div>
          <div>
            <h4 className="text-white font-display font-bold mb-5">Contact Info</h4>
            <ul className="flex flex-col gap-3 text-sm text-navy-200">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />{s.address}</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />{s.phone}</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />{s.email}</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold-500 flex-shrink-0" />Mon-Sat: 7am - 6pm</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-navy-300 text-sm">&copy; {new Date().getFullYear()} {s.business_name}. All rights reserved.</p>
          <Link to="/admin/login" className="text-navy-400 hover:text-gold-400 text-xs transition-colors">Admin Panel</Link>
        </div>
      </div>
    </footer>
  )
}
"@ | Set-Content -Encoding UTF8 "src/components/layout/Footer.jsx"

# ===== src/components/layout/WhatsAppFloat.jsx =====
@"
import { useSettings } from '../../context/SettingsContext'
import { getGeneralWhatsAppLink } from '../../utils/helpers'

export default function WhatsAppFloat() {
  const { settings } = useSettings()
  const phone = settings?.whatsapp || '254712345678'
  return (
    <a href={getGeneralWhatsAppLink(phone)} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg transition-colors" aria-label="Chat on WhatsApp" style={{ animation: 'waPulse 2s ease-in-out infinite' }}>
      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      <style>{`@keyframes waPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.4); } 50% { box-shadow: 0 0 0 14px rgba(37,211,102,0); } }`}</style>
    </a>
  )
}
"@ | Set-Content -Encoding UTF8 "src/components/layout/WhatsAppFloat.jsx"

# ===== src/components/layout/BackToTop.jsx =====
@"
import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    function handleScroll() { setVisible(window.scrollY > 600) }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-6 left-6 z-[90] w-12 h-12 bg-navy-500 hover:bg-navy-400 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} aria-label="Back to top">
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}
"@ | Set-Content -Encoding UTF8 "src/components/layout/BackToTop.jsx"

# ===== src/components/sections/TestimonialsSection.jsx =====
@"
import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { fetchVisibleTestimonials } from '../../services/testimonials'
import ScrollReveal from '../ui/ScrollReveal'
import SectionDivider from '../ui/SectionDivider'
import { SkeletonCard } from '../ui/Skeleton'

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetchVisibleTestimonials().then(setTestimonials).catch(console.error).finally(() => setLoading(false)) }, [])

  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="text-gold-500 text-sm font-semibold uppercase tracking-[3px]">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-500 mt-3">What Our Customers Say</h2>
          <div className="flex justify-center mt-5"><SectionDivider /></div>
        </ScrollReveal>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-navy-300 py-12">No testimonials yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-7 border border-navy-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="flex gap-1 mb-4">{Array.from({ length: 5 }, (_, si) => (<Star key={si} className={`w-4 h-4 ${si < t.rating ? 'text-gold-400 fill-gold-400' : 'text-gray-200'}`} />))}</div>
                  <p className="text-navy-400 text-sm leading-relaxed mb-6 flex-1">&ldquo;{t.message}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    {t.photo ? <img src={t.photo} alt={t.customer_name} className="w-11 h-11 rounded-full object-cover" loading="lazy" /> : <div className="w-11 h-11 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold text-sm">{t.customer_name.charAt(0)}</div>}
                    <div><div className="text-navy-500 font-semibold text-sm">{t.customer_name}</div><div className="text-navy-200 text-xs">Verified Customer</div></div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
"@ | Set-Content -Encoding UTF8 "src/components/sections/TestimonialsSection.jsx"

Write-Host ""
Write-Host "===== ALL FILES CREATED SUCCESSFULLY =====" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm run dev" -ForegroundColor Yellow