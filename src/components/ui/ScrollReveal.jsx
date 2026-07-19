import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function ScrollReveal({ children, className = '', delay = 0 }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}