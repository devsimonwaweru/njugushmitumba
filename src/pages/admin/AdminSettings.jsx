/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { updateSettings } from '../../services/settings'

// UPDATE THIS PATH to point to where you created the supabase.js file
import { supabase } from '../../services/supabase' 

export default function AdminSettings({ addToast }) {
  const { settings, reload } = useSettings()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (settings) {
      setForm({
        business_name: settings.business_name || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        address: settings.address || '',
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        hero_image: settings.hero_image || '', 
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        twitter: settings.twitter || '',
        tiktok: settings.tiktok || '',
        years_experience: settings.years_experience || 8,
      })
    }
  }, [settings])

  function update(field, value) { 
    setForm(prev => ({ ...prev, [field]: value })) 
  }

  // Handle Image Upload to Supabase Storage
  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const fileName = `hero_${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('hero-images')
        .getPublicUrl(fileName)

      if (urlData && urlData.publicUrl) {
        update('hero_image', urlData.publicUrl)
        addToast('Image uploaded. Click Save Settings to apply.')
      }
    } catch (err) {
      console.error("Image Upload Error:", err)
      addToast('Failed to upload image. Check console.', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSettings({
        business_name: form.business_name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        address: form.address,
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        hero_image: form.hero_image,
        facebook: form.facebook,
        instagram: form.instagram,
        twitter: form.twitter,
        tiktok: form.tiktok,
        years_experience: Number(form.years_experience),
      })
      addToast('Settings saved successfully')
      reload()
    } catch (err) { 
      // Detailed error logging to see exactly what Supabase is complaining about
      console.error("Supabase Save Error Details:", err)
      addToast('Failed to save settings. Check console for details.', 'error') 
    } finally { 
      setSaving(false) 
    }
  }

  if (!settings) return <p className="text-gray-400">Loading...</p>

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-500 mb-6">Website Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
        
        {/* Hero Section Settings */}
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h2 className="text-lg font-semibold text-navy-500 mb-4">Hero Section</h2>
          
          <div className="mb-4">
            <label className="block text-xs font-medium text-navy-500 mb-1">Hero Title</label>
            <input value={form.hero_title || ''} onChange={e => update('hero_title', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" />
          </div>
          
          <div className="mb-4">
            <label className="block text-xs font-medium text-navy-500 mb-1">Hero Subtitle</label>
            <textarea value={form.hero_subtitle || ''} onChange={e => update('hero_subtitle', e.target.value)} rows="3" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400 resize-none" />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-navy-500 mb-1">Hero Background Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={uploadingImage}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold-100 file:text-gold-700 hover:file:bg-gold-200 cursor-pointer disabled:opacity-50" 
            />
            {uploadingImage && <p className="text-xs text-gray-400 mt-2">Uploading image...</p>}
            {form.hero_image && (
              <div className="mt-3 relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                <img src={form.hero_image} alt="Hero Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Business Info Settings */}
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h2 className="text-lg font-semibold text-navy-500 mb-4">Business Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-navy-500 mb-1">Business Name</label>
              <input value={form.business_name || ''} onChange={e => update('business_name', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-500 mb-1">Phone</label>
              <input value={form.phone || ''} onChange={e => update('phone', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-500 mb-1">WhatsApp Number</label>
              <input value={form.whatsapp || ''} onChange={e => update('whatsapp', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" placeholder="254712345678" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-500 mb-1">Email</label>
              <input value={form.email || ''} onChange={e => update('email', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-navy-500 mb-1">Address</label>
            <input value={form.address || ''} onChange={e => update('address', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-500 mb-1">Years of Experience</label>
            <input type="number" value={form.years_experience || ''} onChange={e => update('years_experience', e.target.value)} min="0" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400 max-w-[120px]" />
          </div>
        </div>

        {/* Social Media Settings */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-navy-500 mb-3">Social Media Links</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ key: 'facebook', label: 'Facebook' },{ key: 'instagram', label: 'Instagram' },{ key: 'twitter', label: 'Twitter' },{ key: 'tiktok', label: 'TikTok' }].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-navy-500 mb-1">{label}</label>
                <input value={form[key] || ''} onChange={e => update(key, e.target.value)} placeholder={`https://${key}.com/...`} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-gold-500 hover:bg-gold-400 text-navy-700 font-bold text-sm px-8 py-3 rounded-xl transition-colors disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}