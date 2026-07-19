/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Star } from 'lucide-react'
import { fetchBaleBySlug, fetchRelatedBales } from '../services/catalogue'
import { useSettings } from '../context/SettingsContext'
import { formatPrice, getGradeLabel, getWhatsAppLink } from '../utils/helpers'
import Loader from '../components/ui/Loader'
import EmptyState from '../components/ui/EmptyState'
import { PackageX } from 'lucide-react'

export default function BaleDetailPage({ addToast }) {
  const { slug } = useParams()
  const { settings } = useSettings()
  const phone = settings?.whatsapp || '254712345678'

  const [bale, setBale] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(false)
    fetchBaleBySlug(slug)
      .then((data) => {
        setBale(data)
        setActiveImage(0)
        // Fetch related
        if (data.category_id) {
          fetchRelatedBales(data.category_id, data.id).then(setRelated).catch(console.error)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Loader />
  if (error || !bale) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <EmptyState
          icon={PackageX}
          title="Bale not found"
          description="The bale you're looking for doesn't exist or has been removed."
        />
        <div className="text-center mt-4">
          <Link to="/" className="text-gold-500 hover:text-gold-400 font-semibold text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const images = bale.images?.sort((a, b) => a.sort_order - b.sort_order) || []
  const gradeColor =
    bale.grade === 'A'
      ? 'bg-gold-500 text-navy-700'
      : bale.grade === 'B'
      ? 'bg-navy-500 text-white'
      : 'bg-gray-500 text-white'

  return (
    <>
      <Helmet>
        <title>{bale.name} | Njugush Mitumba Bales</title>
        <meta name="description" content={bale.description} />
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-300 mb-8">
            <Link to="/" className="hover:text-gold-500 transition-colors">Home</Link>
            <span>/</span>
            <a href="/#catalogue" className="hover:text-gold-500 transition-colors">Catalogue</a>
            <span>/</span>
            <span className="text-navy-500 font-medium truncate max-w-[200px]">{bale.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Gallery */}
            <div>
              <div className="bg-white rounded-2xl overflow-hidden border border-navy-100">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]?.image_url}
                    alt={bale.name}
                    className="w-full aspect-[4/3] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-navy-50 flex items-center justify-center text-navy-200">
                    No image
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImage
                          ? 'border-gold-500 opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image_url} alt={`View ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`${gradeColor} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
                  Grade {bale.grade} - {getGradeLabel(bale.grade)}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${bale.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {bale.available ? 'In Stock' : 'Sold Out'}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-navy-500 mb-2">
                {bale.name}
              </h1>
              <p className="text-navy-300 text-sm mb-6">{bale.category?.name || ''}</p>

              <div className="text-gold-500 font-display font-bold text-4xl mb-6">
                {formatPrice(bale.price)}
              </div>

              <p className="text-navy-400 text-sm leading-relaxed mb-8">{bale.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-navy-100">
                  <div className="text-navy-200 text-[10px] uppercase tracking-wider font-semibold mb-1">Pieces</div>
                  <div className="text-navy-500 font-bold text-xl">~{bale.estimated_pieces}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-navy-100">
                  <div className="text-navy-200 text-[10px] uppercase tracking-wider font-semibold mb-1">Origin</div>
                  <div className="text-navy-500 font-bold text-sm">{bale.country_of_origin}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-navy-100">
                  <div className="text-navy-200 text-[10px] uppercase tracking-wider font-semibold mb-1">Per Piece</div>
                  <div className="text-navy-500 font-bold text-xl">
                    {formatPrice(Math.round(bale.price / bale.estimated_pieces))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-navy-100">
                  <div className="text-navy-200 text-[10px] uppercase tracking-wider font-semibold mb-1">Delivery</div>
                  <div className="text-navy-500 font-bold text-sm">Nationwide</div>
                </div>
              </div>

              <a
                href={getWhatsAppLink(bale, phone)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all text-lg ${
                  !bale.available ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order on WhatsApp
              </a>

              {/* Related Bales */}
              {related.length > 0 && (
                <div className="mt-10 pt-8 border-t border-navy-100">
                  <h3 className="font-display font-bold text-navy-500 mb-4">Related Bales</h3>
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                    {related.map((rb) => (
                      <Link
                        key={rb.id}
                        to={`/bale/${rb.slug}`}
                        className="flex-shrink-0 w-44 rounded-xl overflow-hidden border border-navy-100 hover:border-gold-400 transition-colors group bg-white"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={rb.images?.[0]?.image_url}
                            alt={rb.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3">
                          <div className="text-navy-500 text-xs font-semibold line-clamp-1">{rb.name}</div>
                          <div className="text-gold-500 text-xs font-bold mt-1">{formatPrice(rb.price)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}