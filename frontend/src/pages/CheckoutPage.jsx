import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, Smartphone, Building, Truck, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { orderService, paymentService } from '../services'
import { useCart } from '../hooks/useCartContext'

const METHODS = [
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
  { value: 'UPI',         label: 'UPI',          icon: Smartphone },
  { value: 'NET_BANKING', label: 'Net Banking',  icon: Building },
  { value: 'COD',         label: 'Cash on Delivery', icon: Truck },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, userId, clearCart } = useCart()
  const [form, setForm] = useState({ address: '', paymentMethod: 'UPI' })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('form')

  const items = cart?.items || []
  const total = cart?.totalAmount || 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.address.trim()) { toast.error('Please enter a shipping address'); return }
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    setLoading(true)
    try {
      const orderRes = await orderService.placeOrder({ userId, shippingAddress: form.address })
      await paymentService.process({ orderId: orderRes.data.data.id, method: form.paymentMethod })
      setStep('success')
      await clearCart()
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  if (step === 'success') {
    return (
      <div className="page-container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="animate-fade-up" style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={36} style={{ color: '#22c55e' }} />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 24, color: '#0f172a', marginBottom: 8 }}>Order Placed!</h1>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your order has been confirmed and payment processed.</p>
          <div className="card" style={{ padding: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
              <span style={{ color: '#94a3b8' }}>Payment</span><span style={{ color: '#475569', fontWeight: 500 }}>{form.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
              <span style={{ color: '#94a3b8' }}>Paid</span><span style={{ color: '#2563eb', fontWeight: 700 }}>₹{(Number(total) * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link to="/orders" className="btn-primary">View Orders</Link>
            <Link to="/products" className="btn-ghost">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ padding: '2rem 0 4rem' }}>
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14, fontWeight: 500, marginBottom: '1.5rem', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color='#2563eb'}
        onMouseLeave={e => e.currentTarget.style.color='#64748b'}
      ><ArrowLeft size={15} /> Back to Cart</Link>

      <div style={{ marginBottom: '1.5rem' }}>
        <p className="label" style={{ marginBottom: 6 }}>Final Step</p>
        <h1 className="section-title">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 2' }}>
          {/* Address */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
              Shipping Address
            </h2>
            <textarea value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))}
              placeholder="Enter full delivery address…" rows={3} required className="input" style={{ resize: 'none' }} />
          </div>

          {/* Payment */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
              Payment Method
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {METHODS.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" onClick={() => setForm(f => ({...f, paymentMethod: value}))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '0.8rem', borderRadius: 10,
                    border: `1px solid ${form.paymentMethod === value ? '#bfdbfe' : '#e2e8f0'}`,
                    background: form.paymentMethod === value ? '#eff6ff' : '#fff',
                    color: form.paymentMethod === value ? '#2563eb' : '#64748b',
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                  }}>
                  <Icon size={17} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card" style={{ padding: '1.25rem', position: 'sticky', top: 76 }}>
          <h2 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', fontSize: 16 }}>Order Summary</h2>
          <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: '0.75rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0' }}>
                <div style={{ width: 38, height: 38, borderRadius: 7, overflow: 'hidden', background: '#f8fafc', flexShrink: 0 }}>
                  {item.productImage && <img src={item.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#475569', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName}</p>
                  <p style={{ color: '#94a3b8', fontSize: 12 }}>×{item.quantity}</p>
                </div>
                <span style={{ color: '#1e293b', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem', fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#64748b' }}><span>Subtotal</span><span style={{ color: '#1e293b', fontWeight: 500 }}>₹{Number(total).toLocaleString('en-IN')}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#64748b' }}><span>GST (18%)</span><span style={{ color: '#1e293b', fontWeight: 500 }}>₹{(total * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', borderTop: '1px solid #e2e8f0', marginTop: 6 }}>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>Total</span>
              <span style={{ fontWeight: 800, color: '#2563eb', fontSize: 18 }}>₹{(total * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
          <button type="submit" disabled={loading || items.length === 0} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Processing…' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  )
}
