import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 mt-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.55"/>
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-sm">Nexus</span>
          </div>

          <p className="text-slate-400 text-xs">© {new Date().getFullYear()} Nexus Commerce · Built with Spring Boot & React</p>

          <nav className="flex gap-4">
            {[
              { to: '/user/products', label: 'Shop' },
              { to: '/user/orders', label: 'Orders' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="text-slate-400 hover:text-primary-600 text-xs font-medium transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
