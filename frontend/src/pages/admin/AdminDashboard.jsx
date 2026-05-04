import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Tag, Users, ShoppingBag, TrendingUp, ArrowRight, DollarSign } from 'lucide-react'
import { productService, categoryService, userService, orderService } from '../../services'

const colorMap = {
  blue:   { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb' },
  green:  { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' },
  purple: { bg: '#faf5ff', border: '#e9d5ff', text: '#9333ea' },
  amber:  { bg: '#fffbeb', border: '#fde68a', text: '#d97706' },
}

function StatCard({ icon: Icon, label, value, sub, color = 'blue', index = 0 }) {
  const c = colorMap[color]
  return (
    <div className="card animate-fade-up" style={{ padding: '1.25rem', animationDelay: `${index * 0.06}s` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.text }}>
          <Icon size={19} />
        </div>
        <TrendingUp size={13} style={{ color: '#cbd5e1' }} />
      </div>
      <p style={{ fontWeight: 800, fontSize: 26, color: '#0f172a', marginBottom: 2 }}>{value}</p>
      <p style={{ fontSize: 13, color: '#64748b' }}>{label}</p>
      {sub && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, users: 0, orders: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      productService.getAll({ page: 0, size: 1 }),
      categoryService.getAll(),
      userService.getAll(),
      orderService.getAll(),
    ]).then(([prod, cat, usr, ord]) => {
      const orders = ord.value?.data?.data || []
      setStats({
        products: prod.value?.data?.data?.totalElements || 0,
        categories: (cat.value?.data?.data || []).length,
        users: (usr.value?.data?.data || []).length,
        orders: orders.length,
        revenue: orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0),
      })
      setRecentOrders(orders.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  const dotColor = { PENDING: '#eab308', CONFIRMED: '#22c55e', PROCESSING: '#3b82f6', SHIPPED: '#a855f7', DELIVERED: '#22c55e', CANCELLED: '#ef4444' }

  return (
    <div className="page-container" style={{ padding: '2rem 0 4rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="label" style={{ marginBottom: 6 }}>Welcome back</p>
          <h1 className="section-title">Admin Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/products" className="btn-ghost" style={{ fontSize: 13, padding: '7px 14px' }}><Package size={14} /> Products</Link>
          <Link to="/admin/categories" className="btn-primary" style={{ fontSize: 13, padding: '7px 14px' }}><Tag size={14} /> Categories</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: '2rem' }}>
        <StatCard icon={Package} label="Total Products" value={loading ? '—' : stats.products} sub="Active listings" color="blue" index={0} />
        <StatCard icon={Tag} label="Categories" value={loading ? '—' : stats.categories} sub="Product groups" color="purple" index={1} />
        <StatCard icon={Users} label="Customers" value={loading ? '—' : stats.users} sub="Registered users" color="green" index={2} />
        <StatCard icon={ShoppingBag} label="Orders" value={loading ? '—' : stats.orders} sub="All time" color="amber" index={3} />
      </div>

      {/* Revenue */}
      <div className="card animate-fade-up stagger-4" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #eff6ff, #fff)', borderColor: '#bfdbfe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <DollarSign size={18} style={{ color: '#2563eb' }} />
          <span style={{ color: '#64748b', fontSize: 14 }}>Total Revenue</span>
        </div>
        <p style={{ fontWeight: 800, fontSize: 32, color: '#2563eb' }}>₹{loading ? '—' : Number(stats.revenue).toLocaleString('en-IN')}</p>
        <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 3 }}>From all confirmed orders</p>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
        {[
          { to: '/admin/products', icon: Package, title: 'Manage Products', desc: 'Add, edit, or remove products', color: 'blue' },
          { to: '/admin/categories', icon: Tag, title: 'Manage Categories', desc: 'Organize product categories', color: 'purple' },
        ].map(({ to, icon: Icon, title, desc, color }) => {
          const c = colorMap[color]
          return (
            <Link key={to} to={to} className="card-hover" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '1.25rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: c.bg, border: `1px solid ${c.border}`, color: c.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{title}</p>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>{desc}</p>
              </div>
              <ArrowRight size={15} style={{ color: '#cbd5e1', flexShrink: 0 }} />
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>Recent Orders</h2>
          <span className="badge badge-blue">{recentOrders.length} orders</span>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No orders yet</div>
        ) : recentOrders.map(order => (
          <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor[order.status] || '#cbd5e1' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>Order #{order.id}</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>{order.userName}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13 }}>
              <span style={{ color: '#94a3b8' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              <span style={{ fontWeight: 700, color: '#2563eb' }}>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
              <span style={{ color: '#64748b', fontSize: 12 }}>{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
