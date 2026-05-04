import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Home, Package, ClipboardList, LogOut, Menu, X, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../hooks/useCartContext'

const NAV = [
  { to: '/user/home',     label: 'Home',    icon: Home },
  { to: '/user/products', label: 'Shop',    icon: Package },
  { to: '/user/orders',   label: 'Orders',  icon: ClipboardList },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = cart?.itemCount || 0

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/user/home" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-glow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">Nexus</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label }) => {
              const active = pathname === to || pathname.startsWith(to + '/')
              return (
                <Link key={to} to={to}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${active ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link to="/user/cart"
              className="relative p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all">
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shadow-glow">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            <div className="hidden md:flex items-center gap-2 ml-1">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{user?.name}</span>
              <button onClick={handleLogout} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <LogOut size={16} />
              </button>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV.map(({ to, label, icon: Icon }) => {
                const active = pathname === to
                return (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${active ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <Icon size={16} /> {label}
                  </Link>
                )
              })}
              <div className="border-t border-slate-100 pt-2 mt-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <User size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{user?.name}</span>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
