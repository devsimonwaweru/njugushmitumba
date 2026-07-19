import { useState } from 'react'
import { Plus } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import SectionDivider from '../ui/SectionDivider'

const faqs = [
  { q: 'How do I place an order?', a: 'Simply browse our catalogue, find the bale you want, and click "Order on WhatsApp". This will open a WhatsApp chat with us pre-filled with the bale details. You can also call us directly or visit our warehouse.' },
    { q: 'Do you deliver countrywide?', a: 'Yes! We deliver to all 47 counties in Kenya. Delivery is usually within 24hrs.' },
  { q: 'Can I visit your warehouse?', a: 'Absolutely! You are welcome to visit our warehouse at nyahururu town mbariacomplex other branches are meru gakoromone,nanyuki bemwaki towers,kakamega fishmarket. We recommend calling ahead so we can prepare the bales you are interested in viewing.' },
  { q: 'What payment methods do you accept?', a: 'We accept M-Pesa (Paybill and Till Number), bank transfers, and cash payments at the warehouse. For large orders, we also accept installment arrangements.' },
  { q: 'How long does delivery take?', a: 'within 24 hours We use trusted courier services and provide tracking numbers.' },
  { q: 'What grades of mitumba do you offer?', a: 'We offer three grades: Grade A (Premium - like new, many with tags), Grade B (Standard - good condition, minimal wear), and Grade C (Economy - mixed quality, best value per piece).' },
  { q: 'Do you offer bulk discounts?', a: 'Yes! Orders of 5 or more bales get a 5% discount. Orders of 10+ bales get 10% off. We also have special seasonal promotions. Contact us for custom quotes on large orders.' },
]

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="text-navy-500 font-semibold text-sm pr-4">{faq.q}</span>
        <Plus
          className={`w-5 h-5 text-gold-500 flex-shrink-0 transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[300px] px-6 pb-5' : 'max-h-0 px-6'
        }`}
      >
        <p className="text-navy-300 text-sm leading-relaxed">{faq.a}</p>
      </div>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="text-gold-500 text-sm font-semibold uppercase tracking-[3px]">
            Support
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-500 mt-3">
            Frequently Asked Questions
          </h2>
          <div className="flex justify-center mt-5">
            <SectionDivider />
          </div>
        </ScrollReveal>

        <ScrollReveal className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} faq={faq} />
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}