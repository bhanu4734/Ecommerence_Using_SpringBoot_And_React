import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Truck, RotateCcw } from 'lucide-react'
import { productService, categoryService } from '../services'
import ProductCard from '../components/common/ProductCard'
import { SkeletonCard } from '../components/common/States'

const FEATURES = [
  { icon: Zap,       title: 'Lightning Fast',  desc: 'Sub-second loads with edge optimization' },
  { icon: Shield,    title: 'Secure Payments', desc: 'End-to-end encrypted transactions' },
  { icon: Truck,     title: 'Free Shipping',   desc: 'On all orders above ₹999' },
  { icon: RotateCcw, title: 'Easy Returns',    desc: '30-day hassle-free return policy' },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productService.getAll({ page: 0, size: 8, sortBy: 'createdAt', direction: 'desc' }),
      categoryService.getAll(),
    ]).then(([p, c]) => {
      setFeaturedProducts(p.data.data?.content || [])
      setCategories(c.data.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '5rem 0 4rem', background: 'linear-gradient(180deg, #eff6ff 0%, #fff 100%)' }}>
        <div className="page-container" style={{ textAlign: 'center', position: 'relative' }}>
          <div className="animate-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 999,
            border: '1px solid #bfdbfe', background: '#fff',
            marginBottom: '1.75rem',
          }}>
            <span className="pulse-dot" />
            <span style={{ color: '#2563eb', fontSize: 13, fontWeight: 500 }}>New arrivals every week</span>
          </div>

          <h1 className="animate-fade-up stagger-1" style={{
            fontWeight: 900, fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            color: '#0f172a', lineHeight: 1.05, letterSpacing: '-0.04em',
            marginBottom: '1.25rem',
          }}>
            Shop the
            <span style={{ display: 'block', color: '#2563eb' }}>Future of Retail</span>
          </h1>

          <p className="animate-fade-up stagger-2" style={{
            color: '#64748b', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.7,
          }}>
            Curated collections of premium electronics, fashion, and lifestyle products. Delivered with excellence.
          </p>

          <div className="animate-fade-up stagger-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            <Link to="/products" className="btn-primary">Explore Collection <ArrowRight size={16} /></Link>
            <Link to="/products?categoryId=" className="btn-ghost">View Categories</Link>
          </div>

          <div className="animate-fade-up stagger-4" style={{
            display: 'flex', gap: '2.5rem', justifyContent: 'center',
            marginTop: '2.5rem', paddingTop: '2rem',
            borderTop: '1px solid #e2e8f0',
          }}>
            {[['12+', 'Products'], ['4', 'Categories'], ['100%', 'Secure']].map(([n, l]) => (
              <div key={l}>
                <p style={{ fontWeight: 800, fontSize: 24, color: '#2563eb' }}>{n}</p>
                <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section style={{ padding: '3.5rem 0' }}>
          <div className="page-container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p className="label" style={{ marginBottom: 6 }}>Browse by</p>
                <h2 className="section-title">Categories</h2>
              </div>
              <Link to="/products" className="btn-ghost" style={{ fontSize: 13, padding: '7px 14px' }}>All <ArrowRight size={14} /></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
              {categories.map((cat, i) => (
                <Link key={cat.id} to={`/products?categoryId=${cat.id}`}
                  className="card-hover animate-fade-up"
                  style={{ padding: '1.25rem', textAlign: 'center', animationDelay: `${i * 0.06}s`, display: 'block' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', margin: '0 auto 0.75rem', overflow: 'hidden' }}>
                    {cat.imageUrl
                      ? <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛍️</div>
                    }
                  </div>
                  <p style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{cat.name}</p>
                  <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 3 }}>{cat.productCount} items</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      <section style={{ padding: '3.5rem 0', background: '#f8fafc' }}>
        <div className="page-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p className="label" style={{ marginBottom: 6 }}>Handpicked for you</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products" className="btn-ghost" style={{ fontSize: 13, padding: '7px 14px' }}>View All <ArrowRight size={14} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.85rem' }}>
            {loading
              ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : featuredProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            }
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="card animate-fade-up" style={{ padding: '1.25rem', textAlign: 'center', animationDelay: `${i * 0.06}s` }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <Icon size={19} style={{ color: '#2563eb' }} />
                </div>
                <p style={{ fontWeight: 600, color: '#1e293b', fontSize: 14, marginBottom: 4 }}>{title}</p>
                <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
