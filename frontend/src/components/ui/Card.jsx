import { motion } from 'framer-motion'

export default function Card({ children, hover = false, className = '', onClick, ...props }) {
  const Comp = hover ? motion.div : 'div'
  const hoverProps = hover ? {
    whileHover: { y: -4, transition: { duration: 0.2 } },
  } : {}

  return (
    <Comp
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/60 shadow-glass transition-all duration-200
        ${hover ? 'cursor-pointer hover:shadow-glass-lg hover:border-slate-300/80' : ''}
        ${className}`}
      {...hoverProps}
      {...props}
    >
      {children}
    </Comp>
  )
}
