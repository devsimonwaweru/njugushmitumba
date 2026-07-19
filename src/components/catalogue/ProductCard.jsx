import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { formatPrice, getGradeLabel, getWhatsAppLink } from '../../utils/helpers'
import { useSettings } from '../../context/SettingsContext'

export default function ProductCard({ bale }) {
  const { settings } = useSettings()
  const phone = settings?.whatsapp || '254712345678'
  const cat = bale.category
  const mainImage = bale.images?.[0]?.image_url

  const gradeColor =
    bale.grade === 'A'
      ? 'bg-gold-500 text-navy-700'
      : bale.grade === 'B'
      ? 'bg-navy-500 text-white'
      : 'bg-gray-500 text-white'

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-navy-100/60 shadow-sm group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {mainImage && (
          <img
            src={mainImage}
            alt={bale.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        {bale.featured && (
          <span className="absolute top-3 left-3 bg-gold-500 text-navy-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
        <span
          className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
            bale.available ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {bale.available ? 'In Stock' : 'Sold Out'}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={`${gradeColor} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
            Grade {bale.grade} - {getGradeLabel(bale.grade)}
          </span>
          <span className="text-navy-200 text-xs">{cat?.name || ''}</span>
        </div>

        <h3 className="font-display font-bold text-navy-500 text-lg leading-tight mb-2 line-clamp-2">
          {bale.name}
        </h3>
        <p className="text-navy-300 text-sm leading-relaxed mb-4 line-clamp-2">
          {bale.description}
        </p>

        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-gold-500 font-display font-bold text-2xl">
              {formatPrice(bale.price)}
            </div>
            <div className="text-navy-200 text-xs mt-0.5">
              ~{bale.estimated_pieces} pieces
            </div>
          </div>
          <div className="text-navy-200 text-xs text-right">
            <div>Origin</div>
            <div className="text-navy-400 font-medium">{bale.country_of_origin}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/bale/${bale.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-navy-200 text-navy-500 rounded-xl text-sm font-semibold hover:border-navy-500 hover:bg-navy-500 hover:text-white transition-all"
          >
            <Eye className="w-4 h-4" />
            Details
          </Link>
          <a
            href={getWhatsAppLink(bale, phone)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-semibold transition-all ${
              !bale.available ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order
          </a>
        </div>
      </div>
    </article>
  )
}