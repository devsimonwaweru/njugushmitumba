/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, ToggleLeft, Eye, X, Upload, Loader2, Package } from 'lucide-react'
import { fetchBales, createBale, deleteBale, toggleBaleAvailability, fetchCategories } from '../../services/catalogue'
import { uploadMultipleToCloudinary } from '../../lib/cloudinary'
import { formatPrice, generateSlug } from '../../utils/helpers'
import { Link } from 'react-router-dom'

export default function AdminBales({ addToast }) {
  const [bales, setBales] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [savingIds, setSavingIds] = useState([])
  const fileInputRef = useRef(null)

  const emptyForm = { name: '', category_id: '', description: '', price: '', grade: 'A', estimated_pieces: '', country_of_origin: 'Mixed', featured: false, available: true }
  const [form, setForm] = useState({ ...emptyForm })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  useEffect(() => {
    Promise.all([fetchBales({ perPage: 100 }), fetchCategories()])
      .then(([balesRes, cats]) => { setBales(balesRes.bales); setCategories(cats) })
      .catch(() => addToast('Failed to load', 'error'))
      .finally(() => setLoading(false))
  }, [])

  function updateForm(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  function resetForm() {
    setForm({ ...emptyForm })
    setImageFiles([])
    setImagePreviews([])
  }

  function handleImageSelect(e) { addImageFiles(Array.from(e.target.files)) }

  function handleDrop(e) {
    e.preventDefault()
    addImageFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')))
  }

  function addImageFiles(files) {
    const imgs = files.filter(f => f.type.startsWith('image/'))
    setImageFiles(prev => [...prev, ...imgs])
    setImagePreviews(prev => [...prev, ...imgs.map(f => URL.createObjectURL(f))])
  }

  function removeImage(index) {
    URL.revokeObjectURL(imagePreviews[index])
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.category_id || !form.price || !form.estimated_pieces) {
      addToast('Fill in all required fields', 'error'); return
    }

    const tempId = 'temp-' + Date.now()
    const newBale = {
      id: tempId,
      name: form.name,
      slug: generateSlug(form.name),
      description: form.description,
      price: Number(form.price),
      grade: form.grade,
      estimated_pieces: Number(form.estimated_pieces),
      country_of_origin: form.country_of_origin,
      featured: form.featured,
      available: form.available,
      category: categories.find(c => c.id === form.category_id) || null,
      images: imagePreviews.map(url => ({ id: 'tmp', image_url: url, sort_order: 0 })),
      created_at: new Date().toISOString(),
    }
    setBales(prev => [newBale, ...prev])
    setSavingIds(prev => [...prev, tempId])
    setShowForm(false)
    resetForm()

    try {
      let imageUrls = []
      if (imageFiles.length > 0) {
        imageUrls = await uploadMultipleToCloudinary(imageFiles, 1200, 0.8)
        setBales(prev => prev.map(b => b.id === tempId ? {
          ...b,
          images: imageUrls.map((url, i) => ({ id: 'tmp-' + i, image_url: url, sort_order: i }))
        } : b))
      }
      const slug = generateSlug(form.name) + '-' + Date.now()
      const saved = await createBale({ ...form, slug }, imageUrls)
      setBales(prev => prev.map(b => b.id === tempId ? { ...saved } : b))
      addToast('Bale saved successfully')
    } catch (err) {
      setBales(prev => prev.filter(b => b.id !== tempId))
      addToast(err.message || 'Failed to save bale', 'error')
    } finally {
      setSavingIds(prev => prev.filter(id => id !== tempId))
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this bale? This cannot be undone.')) return
    const name = bales.find(b => b.id === id)?.name || 'Bale'
    setBales(prev => prev.filter(b => b.id !== id))
    try { await deleteBale(id); addToast(name + ' deleted') }
    catch (err) {
      addToast('Failed to delete', 'error')
      fetchBales({ perPage: 100 }).then(r => setBales(r.bales)).catch(() => {})
    }
  }

  async function handleToggle(id) {
    setBales(prev => prev.map(b => b.id === id ? { ...b, available: !b.available } : b))
    try { await toggleBaleAvailability(id) }
    catch (err) {
      addToast('Failed to toggle', 'error')
      fetchBales({ perPage: 100 }).then(r => setBales(r.bales)).catch(() => {})
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-500">Manage Bales</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="bg-gold-500 hover:bg-gold-400 text-navy-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />Add Bale
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-30 flex items-start justify-center bg-black/50 p-4 pt-10 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl mb-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display font-bold text-navy-500 text-lg">Add New Bale</h2>
              <button onClick={() => { setShowForm(false); resetForm() }} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-navy-500 mb-1">Name *</label>
                  <input value={form.name} onChange={e => updateForm('name', e.target.value)} required className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" placeholder="e.g. Premium Ladies Dresses" autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-500 mb-1">Category *</label>
                  <select value={form.category_id} onChange={e => updateForm('category_id', e.target.value)} required className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-500 mb-1">Price (KES) *</label>
                  <input type="number" value={form.price} onChange={e => updateForm('price', e.target.value)} required min="0" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" placeholder="35000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-500 mb-1">Estimated Pieces *</label>
                  <input type="number" value={form.estimated_pieces} onChange={e => updateForm('estimated_pieces', e.target.value)} required min="1" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" placeholder="80" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-500 mb-1">Grade</label>
                  <select value={form.grade} onChange={e => updateForm('grade', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400">
                    <option value="A">Grade A (Premium)</option>
                    <option value="B">Grade B (Standard)</option>
                    <option value="C">Grade C (Economy)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-500 mb-1">Country of Origin</label>
                  <input value={form.country_of_origin} onChange={e => updateForm('country_of_origin', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400" placeholder="United Kingdom" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-navy-500 mb-1">Description</label>
                <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} rows="3" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold-400 resize-none" placeholder="Describe the bale contents..." />
              </div>

              <div className="flex items-center gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-navy-500">
                  <input type="checkbox" checked={form.featured} onChange={e => updateForm('featured', e.target.checked)} className="accent-gold-500 w-4 h-4" /> Featured
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-navy-500">
                  <input type="checkbox" checked={form.available} onChange={e => updateForm('available', e.target.checked)} className="accent-gold-500 w-4 h-4" /> Available
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-navy-500 mb-2">Images (optional)</label>
                <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gold-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Click or drag images here</p>
                  <p className="text-gray-300 text-xs mt-1">JPG, PNG, WebP</p>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                </div>
                {imagePreviews.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={!form.name || !form.category_id || !form.price} className="w-full bg-gold-500 hover:bg-gold-400 text-navy-700 font-bold text-sm px-8 py-3.5 rounded-xl transition-colors disabled:opacity-40">
                Add Bale
              </button>
            </form>
          </div>
        </div>
      )}

      {savingIds.length > 0 && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-20 bg-navy-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Saving {savingIds.length} bale{savingIds.length > 1 ? 's' : ''}...
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4">Bale</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-400">Loading...</td></tr>
              ) : bales.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-400">No bales yet. Click "Add Bale" above.</td></tr>
              ) : bales.map(bale => {
                const mainImg = bale.images?.[0]?.image_url || ''
                const isSaving = savingIds.includes(bale.id)
                return (
                  <tr key={bale.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${isSaving ? 'opacity-70' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {mainImg
                          ? <img src={mainImg} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" loading="lazy" />
                          : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>
                        }
                        <div className="min-w-0">
                          <span className="font-medium text-navy-500 text-xs block truncate max-w-[180px]">{bale.name}</span>
                          {isSaving && <span className="text-gold-500 text-[10px] font-semibold">Saving...</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-xs">{bale.category?.name || '-'}</td>
                    <td className="p-4 text-gold-600 font-semibold text-xs">{formatPrice(bale.price)}</td>
                    <td className="p-4"><span className="bg-gray-100 text-navy-500 text-[10px] font-bold px-2 py-0.5 rounded">Grade {bale.grade}</span></td>
                    <td className="p-4">{bale.featured ? <span className="text-gold-500 text-xs font-bold">Yes</span> : <span className="text-gray-300 text-xs">No</span>}</td>
                    <td className="p-4">
                      {bale.available
                        ? <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">Available</span>
                        : <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">Sold Out</span>
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link to={`/bale/${bale.slug}`} className="text-gray-400 hover:text-navy-500 p-1"><Eye className="w-4 h-4" /></Link>
                        <button onClick={() => handleToggle(bale.id)} disabled={isSaving} className="text-gray-400 hover:text-navy-500 p-1 disabled:opacity-30"><ToggleLeft className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(bale.id)} disabled={isSaving} className="text-gray-400 hover:text-red-500 p-1 disabled:opacity-30"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}