import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AuthPage({ mode: initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)
  const { login, register, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/user/home'} replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50/40 to-slate-100 px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-600/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Nexus</span>
          </div>
          <p className="text-slate-500 text-sm">Premium E-Commerce Platform</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-glass-xl p-8 relative overflow-hidden">
          {/* Subtle top gradient */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-t-3xl" />

          {/* Tab Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
            {['login', 'register'].map(tab => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <LoginForm key="login" onLogin={login} navigate={navigate} />
            ) : (
              <RegisterForm key="register" onRegister={register} navigate={navigate} setMode={setMode} />
            )}
          </AnimatePresence>
        </div>

        {/* Demo credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-white/60 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-sm"
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Demo Credentials</p>
          <div className="space-y-1.5 text-xs font-mono text-slate-600">
            <p><span className="text-primary-600 font-semibold">Admin:</span> admin@ecommerce.com</p>
            <p><span className="text-emerald-600 font-semibold">User:</span> john@example.com</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function LoginForm({ onLogin, navigate }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await onLogin(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/user/home')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      <FormField icon={Mail} label="Email" type="email" value={form.email}
        onChange={v => setForm(f => ({ ...f, email: v }))} error={errors.email}
        placeholder="you@example.com" />
      <FormField icon={Lock} label="Password" type={showPw ? 'text' : 'password'}
        value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))}
        error={errors.password} placeholder="••••••••"
        suffix={<button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-slate-600 transition-colors">
          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>} />

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl
          transition-all duration-200 shadow-glow hover:shadow-glow-lg disabled:opacity-60
          flex items-center justify-center gap-2 text-sm"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
      </motion.button>
    </motion.form>
  )
}

function RegisterForm({ onRegister, navigate, setMode }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', role: 'CUSTOMER' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 4) e.password = 'At least 4 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await onRegister(form)
      toast.success('Account created!')
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/user/home')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      <FormField icon={User} label="Full Name" value={form.name}
        onChange={v => setForm(f => ({ ...f, name: v }))} error={errors.name} placeholder="John Doe" />
      <FormField icon={Mail} label="Email" type="email" value={form.email}
        onChange={v => setForm(f => ({ ...f, email: v }))} error={errors.email} placeholder="you@example.com" />
      <FormField icon={Lock} label="Password" type="password" value={form.password}
        onChange={v => setForm(f => ({ ...f, password: v }))} error={errors.password} placeholder="••••••••" />
      <div className="grid grid-cols-2 gap-3">
        <FormField icon={Phone} label="Phone" value={form.phone}
          onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="Optional" />
        <FormField icon={MapPin} label="City" value={form.address}
          onChange={v => setForm(f => ({ ...f, address: v }))} placeholder="Optional" />
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl
          transition-all duration-200 shadow-glow hover:shadow-glow-lg disabled:opacity-60
          flex items-center justify-center gap-2 text-sm"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
      </motion.button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button type="button" onClick={() => setMode('login')} className="text-primary-600 font-semibold hover:underline">Sign in</button>
      </p>
    </motion.form>
  )
}

function FormField({ icon: Icon, label, type = 'text', value, onChange, error, placeholder, suffix }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200
        ${error ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50/50 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-100'}`}>
        <Icon size={16} className={error ? 'text-red-400' : 'text-slate-400'} />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
        />
        {suffix}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
