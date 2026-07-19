/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, X, Upload, Loader2, Star } from 'lucide-react'
import { fetchTestimonials, createTestimonial, deleteTestimonial } from '../../services/testimonials'
import { uploadToCloudinary } from '../../lib/cloudinary'

export default function AdminTestimonials({ addToast }) {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({ customer_name: '', rating: 5, message: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchTestimonials().then(setTestimonials).catch(() => addToast('Failed to load', 'error')).finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.customer_name || !form.message) { addToast('Name and message are required', 'error'); return }

    const tempId = 'temp-' + Date.now()
    const newTest = {
      id: tempId,
      customer_name: form.customer_name,
      rating: form.rating,
      message: form.message,
      photo: imagePreview || null,
      created_at: new Date().toISOString(),
    }
    setTestimonials(prev => [newTest, ...prev])
    setSavingId(tempId)
    setShowForm(false)
    setForm({ customer_name: '', rating: 5, message: '' }); setImageFile(null); setImagePreview(null)

    try {
      let photoUrl = ''
      if (imageFile) {
        const { compressImage } = await import('../../lib/imageCompress')
        const compressed = await compressImage(imageFile, 400, 0.7)
        photoUrl = await uploadToCloudinary(compressed)
        setTestimonials(prev => prev.map(t => t.id === tempId ? { ...t, photo: photoUrl } : t))
      }
      const saved = await createTestimonial({ ...form, photo: photoUrl })
      setTestimonials(prev => prev.map(t => t.id === tempId ? { ...saved } : t))
      addToast('Testimonial saved')
    } catch (err) {
      setTestimonials(prev => prev.filter(t => t.id !== tempId))
      addToast(err.message || 'Failed to save', 'error')
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this testimonial?')) return
    setTestimonials(prev => prev.filter(t => t.id !== id))
    try { await deleteTestimonial(id); addToast('Testimonial deleted') }
    catch (err) {
      addToast('Failed to delete', 'error')
      fetchTestimonials().then(setTestimonials).catch(() => {})
    }
  }

  function handleImageSelect(e) {
    const file = e.target.files[0]
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }
  }

  function cancelForm() {
    setShowForm(false)
    setForm({ customer_name: '', rating: 5, message: '' }); setImageFile(null); setImagePreview(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-500">Manage Testimonials</h1>
        <button onClick={() => setShowForm(true)} className="bg-gold-500 hover:bg-gold-400 text-navy-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-30 flex items-start justify-center bg-black/50 p-4 pt-10 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl mb-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display font-bold text-navy-500">Add Testimonial</h2>
              <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-xs font-medium text-navy-500 mb-1">Customer Name *</label>
                <input value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))} required className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" placeholder="e.g. Mary Wanjiru" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-navy-500 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))} className="p-1">
                      <Star className={`w-6 h-6 ${n <= form.rating ? 'text-gold-400 fill-gold-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-navy-500 mb-1">Message *</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required rows="4" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400 resize-none" />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-medium text-navy-500 mb-2">Photo (optional)</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-gold-400 transition-colors">
                  {imagePreview ? <img src={imagePreview} alt="" className="w-20 h-20 rounded-full object-cover mx-auto" /> : <div className="py-3"><Upload className="w-6 h-6 text-gray-300 mx-auto mb-1" /><p className="text-gray-400 text-xs">Upload photo</p></div>}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={!form.customer_name || !form.message} className="bg-gold-500 hover:bg-gold-400 text-navy-700 font-bold text-sm px-8 py-3 rounded-xl transition-colors disabled:opacity-40">
                  Add Testimonial
                </button>
                <button type="button" onClick={cancelForm} className="px-6 py-3 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {savingId && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-20 bg-navy-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
        </div>
      )}

      <div className="flex flex-col gap-4">
        {loading ? <p className="text-gray-400 text-center py-12">Loading...</p> :
        testimonials.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Star className="w-6 h-6 text-gray-300" /></div>
            <p className="text-gray-400">No testimonials yet.</p>
          </div>
        ) : testimonials.map(t => (
          <div key={t.id} className={`bg-white rounded-xl border shadow-sm p-5 flex items-start gap-4 transition-all ${t.id === savingId ? 'border-gold-300 opacity-80' : 'border-gray-200'}`}>
            {t.photo ? <img src={t.photo} alt={t.customer_name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold">{t.customer_name.charAt(0)}</div>}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-navy-500 text-sm">{t.customer_name}</span>
                <div className="flex gap-0.5">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'text-gold-400 fill-gold-400' : 'text-gray-200'}`} />)}</div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{t.message}</p>
            </div>
            <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}