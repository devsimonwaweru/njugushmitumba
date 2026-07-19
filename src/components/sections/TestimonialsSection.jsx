import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { fetchVisibleTestimonials } from '../../services/testimonials'
import ScrollReveal from '../ui/ScrollReveal'
import SectionDivider from '../ui/SectionDivider'
import { SkeletonCard } from '../ui/Skeleton'

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVisibleTestimonials()
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="text-gold-500 text-sm font-semibold uppercase tracking-[3px]">
            Testimonials
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-500 mt-3">
            What Our Customers Say
          </h2>

          <div className="flex justify-center mt-5">
            <SectionDivider />
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-navy-300 py-12">
            No testimonials yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-7 border border-navy-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }, (_, si) => (
                      <Star
                        key={si}
                        className="w-4 h-4 text-gold-500 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-navy-400 text-sm leading-relaxed mb-6 flex-1">
                    &ldquo;{t.message}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt={t.customer_name}
                        className="w-11 h-11 rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold text-sm">
                        {t.customer_name.charAt(0)}
                      </div>
                    )}

                    <div>
                      <div className="text-navy-500 font-semibold text-sm">
                        {t.customer_name}
                      </div>

                      <div className="text-navy-200 text-xs">
                        Verified Customer
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}