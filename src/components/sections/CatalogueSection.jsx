import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import { fetchBales } from '../../services/catalogue'
import ProductCard from '../catalogue/ProductCard'
import FilterSidebar from '../catalogue/FilterSidebar'
import ScrollReveal from '../ui/ScrollReveal'
import SectionDivider from '../ui/SectionDivider'
import EmptyState from '../ui/EmptyState'
import { SkeletonCard } from '../ui/Skeleton'

const PER_PAGE = 6

const defaultFilters = {
  search: '',
  category: 'all',
  grade: 'all',
  priceMin: '',
  priceMax: '',
  availability: 'all',
  sort: 'newest',
}

export default function CatalogueSection({ addToast, initialCategory }) {
  const [filters, setFilters] = useState({ ...defaultFilters })
  const [bales, setBales] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // If initialCategory is passed (from category click), set it
  useEffect(() => {
    if (initialCategory) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters((prev) => ({ ...prev, category: String(initialCategory) }))
      setPage(1)
    }
  }, [initialCategory])

  // Fetch bales whenever filters or page change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    const params = {
      search: filters.search || undefined,
      category: filters.category !== 'all' ? filters.category : undefined,
      grade: filters.grade !== 'all' ? filters.grade : undefined,
      available:
        filters.availability === 'true'
          ? true
          : filters.availability === 'false'
          ? false
          : undefined,
      sort: filters.sort,
      page,
      perPage: PER_PAGE,
    }

    fetchBales(params)
      .then(({ bales: data, totalCount: count }) => {
        setBales(data)
        setTotalCount(count)
      })
      .catch((err) => {
        console.error(err)
        addToast('Failed to load bales', 'error')
      })
      .finally(() => setLoading(false))
  }, [filters, page, addToast])

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({ ...defaultFilters })
    setPage(1)
  }, [])

  const totalPages = Math.ceil(totalCount / PER_PAGE)
  const hasMore = page < totalPages

  return (
    <section id="catalogue" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="text-gold-500 text-sm font-semibold uppercase tracking-[3px]">
            Our Stock
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-500 mt-3">
            Mitumba Bales Catalogue
          </h2>
          <div className="flex justify-center mt-5">
            <SectionDivider />
          </div>
          <p className="text-navy-300 mt-5 max-w-2xl mx-auto">
            Browse our full range of quality imported bales. Click any bale for details or order
            directly via WhatsApp.
          </p>
        </ScrollReveal>

        {/* Search & Sort Bar */}
        <ScrollReveal className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-300" />
              <input
                type="text"
                placeholder="Search bales by name, category..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-navy-100 bg-white focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none text-sm transition-all"
                aria-label="Search bales"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Trigger Button - Only shows on large phones/tablets and smaller */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-navy-100 bg-white text-sm font-medium text-navy-500 hover:border-gold-400 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-3.5 rounded-xl border border-navy-100 bg-white text-sm text-navy-500 focus:border-gold-400 outline-none cursor-pointer min-w-[180px]"
              aria-label="Sort bales"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </ScrollReveal>

        {/* CHANGED: flex-col forces stacking on mobile, lg:flex-row puts them side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Filter Sidebar - Hidden on anything smaller than large screens */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClear={clearFilters}
            />
          </aside>

          {/* Mobile Filter Panel (Bottom Sheet) - Hidden on large screens */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-[140] lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-navy-500 text-lg">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-navy-300 hover:text-navy-500 p-1"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  onClear={clearFilters}
                />
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full mt-4 bg-gold-500 hover:bg-gold-400 text-navy-700 font-semibold py-3.5 rounded-xl transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          {/* CHANGED: w-full ensures it takes all space on mobile, lg:flex-1 lets it share space on desktop */}
          <div className="w-full lg:flex-1 lg:min-w-0">
            <p className="text-sm text-navy-300 mb-5">
              Showing {loading ? '...' : `${bales.length} of ${totalCount}`} bales
            </p>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: PER_PAGE }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : bales.length === 0 ? (
              <EmptyState
                title="No bales found"
                description="Try adjusting your search or filters to find what you're looking for."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {bales.map((bale) => (
                    <ProductCard key={bale.id} bale={bale} />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-navy-500 text-navy-500 font-semibold rounded-xl hover:bg-navy-500 hover:text-white transition-all text-sm"
                    >
                      <ChevronDown className="w-4 h-4" />
                      Load More Bales
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}