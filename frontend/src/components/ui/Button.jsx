import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-glow hover:shadow-glow-lg',
  outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
  danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-sm rounded-xl gap-2',
}

export default function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : children}
    </motion.button>
  )
}
