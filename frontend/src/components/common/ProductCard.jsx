import { Link } from 'react-router-dom'
import { ShoppingCart, Package } from 'lucide-react'
import { useCart } from '../../hooks/useCartContext'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, loading } = useCart()
  const inStock = product.stockQuantity > 0

  return (
    <div className="card-hover animate-fade-up" style={{ animationDelay: `${index * 0.06}s`, overflow: 'hidden', cursor: 'pointer' }}>
      {/* Image */}
      <Link to={`/products/${product.id}`} style={{ display: 'block' }}>
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1', background: '#f8fafc' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
              onMouseEnter={e => e.target.style.transform='scale(1.06)'}
              onMouseLeave={e => e.target.style.transform='scale(1)'}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
            />
          ) : null}
          <div style={{ width: '100%', height: '100%', display: product.imageUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={36} style={{ color: '#cbd5e1' }} />
          </div>

          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 5 }}>
            {!inStock && <span className="badge badge-red" style={{ fontSize: 11 }}>Out of Stock</span>}
            {product.brand && <span className="badge" style={{ fontSize: 11, background: 'rgba(255,255,255,0.9)', color: '#475569', border: '1px solid #e2e8f0', backdropFilter: 'blur(4px)' }}>{product.brand}</span>}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '14px' }}>
        <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{product.categoryName}</p>
        <Link to={`/products/${product.id}`}>
          <h3 style={{
            fontWeight: 600, color: '#1e293b', fontSize: 14, lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            transition: 'color 0.15s', marginBottom: 10,
          }}
            onMouseEnter={e => e.target.style.color='#2563eb'}
            onMouseLeave={e => e.target.style.color='#1e293b'}
          >{product.name}</h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 700, color: '#2563eb', fontSize: 16 }}>₹{Number(product.price).toLocaleString('en-IN')}</p>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{inStock ? `${product.stockQuantity} in stock` : 'Unavailable'}</p>
          </div>
          <button
            onClick={() => inStock && addToCart(product.id, 1)}
            disabled={!inStock || loading}
            style={{
              padding: 9, borderRadius: 9, cursor: inStock ? 'pointer' : 'not-allowed',
              background: inStock ? '#eff6ff' : '#f8fafc',
              border: inStock ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              color: inStock ? '#2563eb' : '#cbd5e1',
              transition: 'all 0.2s', display: 'flex',
            }}
            onMouseEnter={e => { if (inStock) { e.currentTarget.style.background='#2563eb'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#2563eb' }}}
            onMouseLeave={e => { if (inStock) { e.currentTarget.style.background='#eff6ff'; e.currentTarget.style.color='#2563eb'; e.currentTarget.style.borderColor='#bfdbfe' }}}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
