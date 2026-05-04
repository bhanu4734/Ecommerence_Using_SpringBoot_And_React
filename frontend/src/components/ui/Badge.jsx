const colorMap = {
  blue: 'bg-primary-50 text-primary-700 border border-primary-200',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
  yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  slate: 'bg-slate-100 text-slate-600 border border-slate-200',
}

export default function Badge({ children, color = 'blue', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${colorMap[color]} ${className}`}>
      {children}
    </span>
  )
}
