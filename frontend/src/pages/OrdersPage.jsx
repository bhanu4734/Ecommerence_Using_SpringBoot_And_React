import { useState, useEffect } from 'react'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import { orderService } from '../services'
import { useCart } from '../hooks/useCartContext'
import { LoadingSpinner, ErrorState, EmptyState } from '../components/common/States'
import { Link } from 'react-router-dom'

const statusStyle = {
  PENDING:    { bg: '#fefce8', color: '#a16207', border: '#fef08a' },
  CONFIRMED:  { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  PROCESSING: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  SHIPPED:    { bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff' },
  DELIVERED:  { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  CANCELLED:  { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
}

function OrderCard({ order, index }) {
  const [open, setOpen] = useState(false)
  const ss = statusStyle[order.status] || { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' }

  return (
    <div className="card animate-fade-up" style={{ overflow: 'hidden', animationDelay: `${index * 0.06}s` }}>
      <div onClick={() => setOpen(e => !e)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
        onMouseLeave={e => e.currentTarget.style.background='transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={17} style={{ color: '#2563eb' }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>Order #{order.id}</p>
            <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 6, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{order.status}</span>
          <p style={{ fontWeight: 700, color: '#2563eb', fontSize: 14 }}>₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
          {open ? <ChevronUp size={15} style={{ color: '#94a3b8' }} /> : <ChevronDown size={15} style={{ color: '#94a3b8' }} />}
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid #e2e8f0', padding: '1rem 1.25rem' }}>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: '0.75rem' }}><span style={{ fontWeight: 500, color: '#94a3b8' }}>Ship to: </span>{order.shippingAddress}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {order.items?.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 10, borderRadius: 10, background: '#f8fafc' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: '#e2e8f0', flexShrink: 0 }}>
                  {item.productImage && <img src={item.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#1e293b', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName}</p>
                  <p style={{ color: '#94a3b8', fontSize: 12 }}>×{item.quantity} @ ₹{Number(item.unitPrice).toLocaleString('en-IN')}</p>
                </div>
                <span style={{ color: '#475569', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  const { userId } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    orderService.getByUser(userId)
      .then(r => setOrders(r.data.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <LoadingSpinner text="Loading orders…" />

  return (
    <div className="page-container" style={{ padding: '2rem 0 4rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="label" style={{ marginBottom: 6 }}>Your</p>
        <h1 className="section-title">Orders</h1>
        {orders.length > 0 && <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{orders.length} orders total</p>}
      </div>

      {error ? <ErrorState message={error} />
       : orders.length === 0 ? <EmptyState title="No orders yet" description="Once you place an order, it will appear here." icon="📦" action={<Link to="/products" className="btn-primary">Start Shopping</Link>} />
       : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{orders.map((o, i) => <OrderCard key={o.id} order={o} index={i} />)}</div>
      }
    </div>
  )
}
