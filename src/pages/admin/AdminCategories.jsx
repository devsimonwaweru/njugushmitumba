/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, X, Upload, Loader2 } from 'lucide-react'
import { fetchCategories, createCategory, deleteCategory } from '../../services/catalogue'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { generateSlug } from '../../utils/helpers'

export default function AdminCategories({ addToast }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({ name: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => addToast('Failed to load', 'error')).finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { addToast('Name is required', 'error'); return }

    const tempId = 'temp-' + Date.now()
    const newCat = { id: tempId, name: form.name, slug: generateSlug(form.name), image: imagePreview || '' }
    setCategories(prev => [newCat, ...prev])
    setSavingId(tempId)
    setShowForm(false)
    setForm({ name: '' }); setImageFile(null); setImagePreview(null)

    try {
      let imageUrl = ''
      if (imageFile) {
        const { compressImage } = await import('../../lib/imageCompress')
        const compressed = await compressImage(imageFile, 800, 0.75)
        imageUrl = await uploadToCloudinary(compressed)
        setCategories(prev => prev.map(c => c.id === tempId ? { ...c, image: imageUrl } : c))
      }
      const saved = await createCategory({ name: newCat.name, slug: newCat.slug, image: imageUrl })
      setCategories(prev => prev.map(c => c.id === tempId ? { ...saved } : c))
      addToast('Category saved')
    } catch (err) {
      setCategories(prev => prev.filter(c => c.id !== tempId))
      addToast(err.message || 'Failed to save', 'error')
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category? All its bales will also be deleted.')) return
    setCategories(prev => prev.filter(c => c.id !== id))
    try { await deleteCategory(id); addToast('Category deleted') }
    catch (err) {
      addToast('Failed to delete', 'error')
      fetchCategories().then(setCategories).catch(() => {})
    }
  }

  function handleImageSelect(e) {
    const file = e.target.files[0]
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }
  }

  function cancelForm() {
    setShowForm(false)
    setForm({ name: '' }); setImageFile(null); setImagePreview(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-500">Manage Categories</h1>
        <button onClick={() => setShowForm(true)} className="bg-gold-500 hover:bg-gold-400 text-navy-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-30 flex items-start justify-center bg-black/50 p-4 pt-10 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl mb-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display font-bold text-navy-500">Add Category</h2>
              <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-xs font-medium text-navy-500 mb-1">Category Name *</label>
                <input value={form.name} onChange={e => setForm({ name: e.target.value })} required className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" placeholder="e.g. Ladies Wear" autoFocus />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-medium text-navy-500 mb-2">Image (optional)</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-gold-400 transition-colors">
                  {imagePreview ? <img src={imagePreview} alt="" className="w-32 h-24 object-cover rounded-lg mx-auto" /> : <div className="py-4"><Upload className="w-6 h-6 text-gray-300 mx-auto mb-1" /><p className="text-gray-400 text-xs">Click to upload</p></div>}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={!form.name.trim()} className="bg-gold-500 hover:bg-gold-400 text-navy-700 font-bold text-sm px-8 py-3 rounded-xl transition-colors disabled:opacity-40">
                  Add Category
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-400 col-span-full text-center py-12">Loading...</p> :
        categories.length === 0 ? <p className="text-gray-400 col-span-full text-center py-12">No categories yet.</p> :
        categories.map(cat => (
          <div key={cat.id} className={`bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4 transition-all ${cat.id === savingId ? 'border-gold-400 opacity-80' : 'border-gray-200'}`}>
            {cat.image ? <img src={cat.image} alt={cat.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" /> : <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300"><Upload className="w-5 h-5" /></div>}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-navy-500 text-sm truncate">{cat.name}</div>
              <div className="text-gray-400 text-xs truncate">{cat.slug}</div>
              {cat.id === savingId && <div className="text-gold-500 text-[10px] font-semibold mt-1">Saving...</div>}
            </div>
            <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}