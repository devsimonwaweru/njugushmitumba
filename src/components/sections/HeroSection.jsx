import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Grid3X3 } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { getGeneralWhatsAppLink } from '../../utils/helpers'

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          function tick(now) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress)
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

const stats = [
  { value: 500, label: 'Bales Sold Monthly' },
  { value: 1200, label: 'Happy Customers' },
  { value: 8, label: 'Years Experience' },
  { value: 47, label: 'Counties Served' },
]

export default function HeroSection() {
  const { settings } = useSettings()
  const phone = settings?.whatsapp || '254712345678'

  const title = settings?.hero_title || 'Premium Wholesale Mitumba Bales in Kenya'
  const subtitle = settings?.hero_subtitle || 'We supply high-quality imported mitumba bales at competitive wholesale prices with nationwide delivery.'
  const years = settings?.years_experience || 8

  // Update the years stat dynamically
  const displayStats = stats.map((s) =>
    s.label === 'Years Experience' ? { ...s, value: years } : s
  )

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        /* LOWERED OPACITY HERE: Changed from 0.93/0.88 to 0.65/0.60 so the image shows through */
        background: `linear-gradient(135deg, rgba(15,45,82,0.65) 0%, rgba(10,30,58,0.60) 50%, rgba(15,45,82,0.65) 100%), url('/bales.jpeg') center/cover no-repeat`,
      }}
    >
      {/* Decorative blurs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm font-medium">New stock just arrived</span>
          </motion.div>

          {/* Heading - Added a subtle text shadow to ensure text stays readable now that the background is lighter */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {title.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="text-gold-400 block">
              {title.split(' ').slice(-2).join(' ')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/90 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
          >
            {subtitle}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="/#catalogue"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-700 font-bold text-base px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-gold-500/20"
            >
              <Grid3X3 className="w-5 h-5" />
              Browse Catalogue
            </a>
            <a
              href={getGeneralWhatsAppLink(phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold text-base px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-8 sm:gap-12 mt-14 pt-10 border-t border-white/20"
          >
            {displayStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-gold-400 font-display text-3xl sm:text-4xl font-bold">
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="text-white/70 text-sm mt-1" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
        <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}