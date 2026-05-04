import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, Package, ShoppingBag, Tag, LogOut, ChevronLeft, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'

const NAV = [
  { to: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/users',      label: 'Users',       icon: Users },
  { to: '/admin/products',   label: 'Products',    icon: Package },
  { to: '/admin/orders',     label: 'Orders',      icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories',  icon: Tag },
]

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 pt-6 pb-4 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-glow flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
            <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          </svg>
        </div>
        {!collapsed && <span className="font-extrabold text-slate-900 text-lg tracking-tight">Nexus</span>}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + '/')
          return (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${active
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon size={18} className={active ? 'text-primary-600' : ''} />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className={`px-3 pb-4 border-t border-slate-100 pt-4 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <Badge color="purple" className="mt-0.5">Admin</Badge>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-slate-500
            hover:bg-red-50 hover:text-red-600 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col bg-white border-r border-slate-200/60 relative z-10 flex-shrink-0"
      >
        {sidebarContent}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm
            flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-20">
          <ChevronLeft size={12} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 lg:hidden">
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-10">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-sm font-semibold text-slate-800">
              {NAV.find(n => pathname.startsWith(n.to))?.label || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge color="blue">v1.0</Badge>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
