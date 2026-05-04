import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Tag, Users, ShoppingBag, TrendingUp, ArrowRight, DollarSign } from 'lucide-react'
import { productService, categoryService, userService, orderService } from '../../services'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const COLORS = { blue: 'bg-primary-50 border-primary-200 text-primary-600', green: 'bg-emerald-50 border-emerald-200 text-emerald-600', purple: 'bg-purple-50 border-purple-200 text-purple-600', amber: 'bg-amber-50 border-amber-200 text-amber-600' }

function StatCard({ icon: Icon, label, value, sub, color = 'blue', i = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${COLORS[color]}`}><Icon size={18} /></div>
          <TrendingUp size={13} className="text-slate-300" />
        </div>
        <p className="text-2xl font-extrabold text-slate-900 mb-0.5">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </Card>
    </motion.div>
  )
}

const dotColor = { PENDING: 'bg-amber-400', CONFIRMED: 'bg-emerald-400', PROCESSING: 'bg-primary-400', SHIPPED: 'bg-purple-400', DELIVERED: 'bg-emerald-400', CANCELLED: 'bg-red-400' }

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, users: 0, orders: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([productService.getAll({ page:0, size:1 }), categoryService.getAll(), userService.getAll(), orderService.getAll()])
      .then(([p, c, u, o]) => {
        const orders = o.value?.data?.data || []
        setStats({ products: p.value?.data?.data?.totalElements || 0, categories: (c.value?.data?.data || []).length, users: (u.value?.data?.data || []).length, orders: orders.length, revenue: orders.reduce((s, x) => s + Number(x.totalAmount || 0), 0) })
        setRecentOrders(orders.slice(0, 5))
      }).finally(() => setLoading(false))
  }, [])

  const v = loading ? '—' : undefined

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div><p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Overview</p><h1 className="text-2xl font-bold text-slate-900">Dashboard</h1></div>
        <div className="flex gap-2">
          <Link to="/admin/products"><Button variant="outline" size="sm"><Package size={14} /> Products</Button></Link>
          <Link to="/admin/categories"><Button size="sm"><Tag size={14} /> Categories</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Products" value={v ?? stats.products} sub="Active" color="blue" i={0} />
        <StatCard icon={Tag} label="Categories" value={v ?? stats.categories} sub="Groups" color="purple" i={1} />
        <StatCard icon={Users} label="Customers" value={v ?? stats.users} sub="Registered" color="green" i={2} />
        <StatCard icon={ShoppingBag} label="Orders" value={v ?? stats.orders} sub="All time" color="amber" i={3} />
      </div>

      <Card className="p-5 bg-gradient-to-r from-primary-50 to-white border-primary-200/50">
        <div className="flex items-center gap-2 mb-1"><DollarSign size={18} className="text-primary-600" /><span className="text-sm text-slate-500">Total Revenue</span></div>
        <p className="text-3xl font-extrabold text-primary-600">₹{loading ? '—' : Number(stats.revenue).toLocaleString('en-IN')}</p>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {[{ to: '/admin/products', icon: Package, title: 'Manage Products', desc: 'Add, edit, or remove products', color: 'blue' },
          { to: '/admin/categories', icon: Tag, title: 'Manage Categories', desc: 'Organize categories', color: 'purple' }
        ].map(({ to, icon: Icon, title, desc, color }) => (
          <Link key={to} to={to}><Card hover className="p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${COLORS[color]}`}><Icon size={20} /></div>
            <div className="flex-1"><p className="font-semibold text-slate-800 text-sm">{title}</p><p className="text-xs text-slate-500 mt-0.5">{desc}</p></div>
            <ArrowRight size={15} className="text-slate-300" />
          </Card></Link>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm">Recent Orders</h2>
          <Badge color="blue">{recentOrders.length} orders</Badge>
        </div>
        {recentOrders.length === 0 ? <div className="p-8 text-center text-sm text-slate-400">No orders yet</div>
         : recentOrders.map(o => (
          <div key={o.id} className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${dotColor[o.status] || 'bg-slate-300'}`} />
              <div><p className="text-sm font-medium text-slate-700">Order #{o.id}</p><p className="text-xs text-slate-400">{o.userName}</p></div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-400 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
              <span className="font-bold text-primary-600">₹{Number(o.totalAmount).toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-500">{o.status}</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
