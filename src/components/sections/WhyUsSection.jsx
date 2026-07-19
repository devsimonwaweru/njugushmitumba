import { Gem, Tag, Truck, ShieldCheck, Warehouse, Headphones } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import SectionDivider from '../ui/SectionDivider'

const items = [
  { icon: Gem, title: 'Premium Quality', desc: 'We source only the best bales from trusted suppliers in the US, UK, and Europe. Every bale is inspected before shipping.' },
  { icon: Tag, title: 'Affordable Prices', desc: 'Competitive wholesale pricing that leaves room for healthy profit margins. The best value-to-quality ratio in the market.' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Reliable delivery to all 47 counties. Fast, insured, and tracked shipping with trusted courier partners.' },
  { icon: ShieldCheck, title: 'Trusted Supplier', desc: 'Over 8 years in the mitumba business with 1,200+ satisfied customers. Our reputation speaks for itself.' },
  { icon: Warehouse, title: 'Large Stock', desc: 'Hundreds of bales always in stock across 12 categories. No waiting — what you see is what is available.' },
  { icon: Headphones, title: 'Excellent Support', desc: 'Responsive customer service via WhatsApp, phone, and email. We help you choose the right bales for your market.' },
]

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-20 sm:py-24 bg-navy-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-14">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-[3px]">
            Our Promise
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            Why Choose Njugush Mitumba
          </h2>
          <div className="flex justify-center mt-5">
            <SectionDivider />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.08}>
              <div className="bg-navy-400/50 backdrop-blur-sm border border-navy-300/30 rounded-2xl p-7 hover:border-gold-500/40 transition-colors group h-full">
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 group-hover:bg-gold-500/20 transition-colors">
                  <item.icon className="w-7 h-7 text-gold-400" />
                </div>
                <h3 className="text-white font-display font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-navy-200 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}