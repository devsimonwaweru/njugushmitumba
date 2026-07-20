import { fetchCategories } from '../../services/catalogue'
import { useEffect, useState } from 'react'

export default function FilterSidebar({ filters, onChange, onClear }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-navy-500">Filters</h3>
        <button onClick={onClear} className="text-gold-500 text-xs font-semibold hover:underline">
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-navy-500 mb-3 block">Category</label>
        <select
          value={filters.category}
          onChange={(e) => onChange('category', e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-navy-100 text-sm text-navy-400 focus:border-gold-400 outline-none cursor-pointer"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grade */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-navy-500 mb-3 block">Grade</label>
        <div className="flex flex-col gap-2">
          {[
            { value: 'all', label: 'All Grades' },
            { value: 'A', label: 'Grade A ' },
            { value: 'B', label: 'Grade B ' },
            
          ].map((g) => (
            <label
              key={g.value}
              className="flex items-center gap-2.5 cursor-pointer text-sm text-navy-400 hover:text-navy-500"
            >
              <input
                type="radio"
                name="grade"
                value={g.value}
                checked={filters.grade === g.value}
                onChange={(e) => onChange('grade', e.target.value)}
                className="accent-gold-500 w-4 h-4"
              />
              {g.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-navy-500 mb-3 block">Price Range</label>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-navy-300">KES</span>
          <input
            type="number"
            placeholder="Min"
            min="0"
            value={filters.priceMin || ''}
            onChange={(e) => onChange('priceMin', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-navy-100 text-sm text-navy-500 focus:border-gold-400 outline-none"
            aria-label="Minimum price"
          />
          <span className="text-navy-300">-</span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            value={filters.priceMax || ''}
            onChange={(e) => onChange('priceMax', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-navy-100 text-sm text-navy-500 focus:border-gold-400 outline-none"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="text-sm font-semibold text-navy-500 mb-3 block">Availability</label>
        <div className="flex flex-col gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'true', label: 'In Stock' },
            { value: 'false', label: 'Out of Stock' },
          ].map((a) => (
            <label
              key={a.value}
              className="flex items-center gap-2.5 cursor-pointer text-sm text-navy-400 hover:text-navy-500"
            >
              <input
                type="radio"
                name="availability"
                value={a.value}
                checked={filters.availability === a.value}
                onChange={(e) => onChange('availability', e.target.value)}
                className="accent-gold-500 w-4 h-4"
              />
              {a.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}