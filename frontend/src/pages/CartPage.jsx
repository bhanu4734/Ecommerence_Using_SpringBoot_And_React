import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../hooks/useCartContext'
import { LoadingSpinner, EmptyState } from '../components/common/States'

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart()
  if (loading && !cart) return <LoadingSpinner text="Loading cart…" />

  const items = cart?.items || []
  const total = cart?.totalAmount || 0

  return (
    <div className="page-container" style={{ padding: '2rem 0 4rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="label" style={{ marginBottom: 6 }}>Your</p>
        <h1 className="section-title">Shopping Cart</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState title="Your cart is empty" description="Looks like you haven't added anything yet." icon="🛒"
          action={<Link to="/products" className="btn-primary"><ArrowRight size={15} /> Start Shopping</Link>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, gridColumn: 'span 2' }}>
              {items.map((item, i) => (
                <div key={item.id} className="card animate-fade-up" style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', animationDelay: `${i * 0.05}s` }}>
                  <Link to={`/products/${item.productId}`} style={{ flexShrink: 0 }}>
                    <div style={{ width: 68, height: 68, borderRadius: 10, overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      {item.productImage
                        ? <img src={item.productImage} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={18} style={{ color: '#cbd5e1' }} /></div>}
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/products/${item.productId}`} style={{ fontWeight: 600, color: '#1e293b', fontSize: 14, lineHeight: 1.35 }}>{item.productName}</Link>
                    <p style={{ color: '#2563eb', fontSize: 14, fontWeight: 600, marginTop: 3 }}>₹{Number(item.unitPrice).toLocaleString('en-IN')}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0 }}>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, borderRadius: 6, transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color='#ef4444'; e.currentTarget.style.background='#fef2f2' }}
                      onMouseLeave={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='none' }}
                    ><Trash2 size={14} /></button>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', marginBottom: 4 }}>
                        <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)} style={{ padding: '5px 8px', background: '#fff', border: 'none', color: '#64748b', cursor: 'pointer' }}><Minus size={11} /></button>
                        <span style={{ width: 28, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{item.quantity}</span>
                        <button onClick={() => updateItem(item.id, item.quantity + 1)} style={{ padding: '5px 8px', background: '#fff', border: 'none', color: '#64748b', cursor: 'pointer' }}><Plus size={11} /></button>
                      </div>
                      <p style={{ color: '#475569', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>₹{Number(item.subtotal).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="card animate-fade-up stagger-2" style={{ padding: '1.25rem', position: 'sticky', top: 76 }}>
              <h2 style={{ fontWeight: 700, color: '#0f172a', fontSize: 16, marginBottom: '1rem' }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Subtotal ({items.length})</span><span style={{ color: '#1e293b', fontWeight: 500 }}>₹{Number(total).toLocaleString('en-IN')}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Shipping</span><span style={{ color: '#22c55e', fontWeight: 500 }}>Free</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Tax (18%)</span><span style={{ color: '#1e293b', fontWeight: 500 }}>₹{(Number(total) * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>Total</span>
                  <span style={{ fontWeight: 800, color: '#2563eb', fontSize: 20 }}>₹{(Number(total) * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 3 }}>Inclusive of all taxes</p>
              </div>
              <Link to="/checkout" className="btn-primary" style={{ width: '100%', marginBottom: 8 }}>Proceed to Checkout <ArrowRight size={15} /></Link>
              <Link to="/products" style={{ display: 'block', textAlign: 'center', fontSize: 13, color: '#94a3b8', transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color='#2563eb'}
                onMouseLeave={e => e.target.style.color='#94a3b8'}
              >← Continue Shopping</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
