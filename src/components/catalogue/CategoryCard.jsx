import { motion } from 'framer-motion'

export default function CategoryCard({ category, onClick, index = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      onClick={() => onClick?.(category.id)}
      className="relative rounded-2xl overflow-hidden group cursor-pointer text-left"
      aria-label={`View ${category.name}`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-display font-bold text-base">{category.name}</h3>
        <p className="text-white/60 text-xs mt-1">{category.count} bales available</p>
      </div>
      {/* Gold border on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold-500 transition-colors duration-300 pointer-events-none" />
    </motion.button>
  )
}