
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function AnimatedCard({ children, delay = 0, className = '' }: AnimatedCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
