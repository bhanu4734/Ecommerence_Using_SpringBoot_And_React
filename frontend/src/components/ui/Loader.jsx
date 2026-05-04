import { Loader2 } from 'lucide-react'

export function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Loader2 size={28} className="animate-spin text-primary-600" />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100 bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-glow animate-pulse">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
            <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          </svg>
        </div>
        <p className="text-sm text-slate-500 font-medium">Loading...</p>
      </div>
    </div>
  )
}
