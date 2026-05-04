import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Package, CheckCircle, XCircle, Minus, Plus } from 'lucide-react'
import { productService } from '../services'
import { useCart } from '../hooks/useCartContext'
import { LoadingSpinner, ErrorState } from '../components/common/States'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const { addToCart, loading: cartLoading } = useCart()

  useEffect(() => {
    productService.getById(id)
      .then(r => setProduct(r.data.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Loading product…" />
  if (error) return <div className="page-container" style={{ padding: '2.5rem 0' }}><ErrorState message={error} /></div>
  if (!product) return null

  const inStock = product.stockQuantity > 0
  const maxQty = Math.min(product.stockQuantity, 10)

  return (
    <div className="page-container" style={{ padding: '2rem 0 4rem' }}>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14, fontWeight: 500, marginBottom: '1.5rem', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color='#2563eb'}
        onMouseLeave={e => e.currentTarget.style.color='#64748b'}
      ><ArrowLeft size={15} /> Back to Products</Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        {/* Image */}
        <div style={{ aspectRatio: '1/1', borderRadius: 16, overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={56} style={{ color: '#cbd5e1' }} /></div>
          }
        </div>

        {/* Details */}
        <div className="animate-fade-up">
          <div style={{ display: 'flex', gap: 6, marginBottom: '1rem' }}>
            <span className="badge badge-blue">{product.categoryName}</span>
            {product.brand && <span className="badge" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569' }}>{product.brand}</span>}
          </div>

          <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#0f172a', lineHeight: 1.15, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{product.name}</h1>
          {product.description && <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.description}</p>}

          <div style={{ padding: '1.25rem 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
            <p style={{ fontWeight: 800, fontSize: 28, color: '#2563eb' }}>₹{Number(product.price).toLocaleString('en-IN')}</p>
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 3 }}>Inclusive of all taxes</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.25rem' }}>
            {inStock
              ? <><CheckCircle size={15} style={{ color: '#22c55e' }} /><span style={{ color: '#22c55e', fontSize: 14, fontWeight: 500 }}>{product.stockQuantity} units available</span></>
              : <><XCircle size={15} style={{ color: '#ef4444' }} /><span style={{ color: '#ef4444', fontSize: 14, fontWeight: 500 }}>Out of Stock</span></>
            }
          </div>

          {inStock && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                <span style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Quantity</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '8px 12px', background: '#fff', border: 'none', color: '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#eff6ff'}
                    onMouseLeave={e => e.currentTarget.style.background='#fff'}
                  ><Minus size={14} /></button>
                  <span style={{ width: 40, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(maxQty, q + 1))} style={{ padding: '8px 12px', background: '#fff', border: 'none', color: '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#eff6ff'}
                    onMouseLeave={e => e.currentTarget.style.background='#fff'}
                  ><Plus size={14} /></button>
                </div>
              </div>
              <button onClick={() => addToCart(product.id, qty)} disabled={cartLoading}
                className="btn-primary" style={{ width: '100%' }}>
                <ShoppingCart size={17} /> {cartLoading ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>
          )}

          <div className="card" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
            <p style={{ fontWeight: 600, color: '#1e293b', fontSize: 14, marginBottom: '0.75rem' }}>Product Info</p>
            {[['SKU', `PROD-${String(product.id).padStart(4,'0')}`], ['Category', product.categoryName], ['Brand', product.brand||'N/A'], ['Added', product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN') : 'N/A']].map(([l,v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                <span style={{ color: '#94a3b8' }}>{l}</span>
                <span style={{ color: '#475569', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
