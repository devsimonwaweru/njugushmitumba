import { useState, useEffect, useCallback } from 'react'
import { fetchCategories } from '../../services/catalogue'
import CategoryCard from '../catalogue/CategoryCard'
import ScrollReveal from '../ui/ScrollReveal'
import SectionDivider from '../ui/SectionDivider'
import { SkeletonCategory } from '../ui/Skeleton'

export default function CategoriesSection({ onCategorySelect }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = useCallback((id) => {
    onCategorySelect?.(id)
    // Scroll to catalogue
    const el = document.getElementById('catalogue')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [onCategorySelect])

  return (
    <section id="categories" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="text-gold-500 text-sm font-semibold uppercase tracking-[3px]">
            Browse By
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-500 mt-3">
            Featured Categories
          </h2>
          <div className="flex justify-center mt-5">
            <SectionDivider />
          </div>
        </ScrollReveal>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-40 snap-start">
                  <SkeletonCategory />
                </div>
              ))
            : categories.map((cat, i) => (
                <div key={cat.id} className="flex-shrink-0 w-40 snap-start">
                  <CategoryCard category={cat} onClick={handleSelect} index={i} />
                </div>
              ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCategory key={i} />)
            : categories.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} onClick={handleSelect} index={i} />
              ))}
        </div>
      </div>
    </section>
  )
}