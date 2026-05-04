import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { productService, categoryService } from '../services'
import ProductCard from '../components/common/ProductCard'
import { ErrorState, EmptyState, SkeletonCard } from '../components/common/States'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const keyword    = searchParams.get('keyword')    || ''
  const categoryId = searchParams.get('categoryId') || ''
  const page       = parseInt(searchParams.get('page') || '0')
  const sortBy     = searchParams.get('sortBy')     || 'createdAt'
  const direction  = searchParams.get('direction')  || 'desc'

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = { page, size: 12, sortBy, direction }
      if (keyword)    params.keyword    = keyword
      if (categoryId) params.categoryId = categoryId
      const res = await productService.getAll(params)
      const data = res.data.data
      setProducts(data?.content || [])
      setPagination({ page: data?.number || 0, totalPages: data?.totalPages || 0, totalElements: data?.totalElements || 0 })
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [page, keyword, categoryId, sortBy, direction])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { categoryService.getAll().then(r => setCategories(r.data.data || [])).catch(() => {}) }, [])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const selectedCategory = categories.find(c => String(c.id) === String(categoryId))

  const pill = (active) => ({
    padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
    border: `1px solid ${active ? '#bfdbfe' : '#e2e8f0'}`,
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#2563eb' : '#64748b',
    cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
  })

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="label" style={{ marginBottom: 6 }}>Browse</p>
        <h1 className="section-title">{selectedCategory ? selectedCategory.name : 'All Products'}</h1>
        {pagination.totalElements > 0 && <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{pagination.totalElements} products found</p>}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '1.25rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input type="text" placeholder="Search products…" defaultValue={keyword}
            onKeyDown={e => e.key === 'Enter' && setParam('keyword', e.target.value)}
            className="input" style={{ paddingLeft: 36 }}
          />
        </div>
        <select value={`${sortBy}-${direction}`}
          onChange={e => { const [s,d] = e.target.value.split('-'); const n = new URLSearchParams(searchParams); n.set('sortBy',s); n.set('direction',d); setSearchParams(n) }}
          className="input" style={{ width: 'auto', minWidth: 160, flex: '0 0 auto' }}>
          <option value="createdAt-desc">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name A–Z</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <button onClick={() => setParam('categoryId', '')} style={pill(!categoryId)}>All</button>
        {categories.map(c => <button key={c.id} onClick={() => setParam('categoryId', String(c.id))} style={pill(String(categoryId) === String(c.id))}>{c.name}</button>)}
      </div>

      {(keyword || categoryId) && (
        <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
          {keyword && <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>"{keyword}" <button onClick={() => setParam('keyword', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}><X size={11} /></button></span>}
          {selectedCategory && <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{selectedCategory.name} <button onClick={() => setParam('categoryId', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}><X size={11} /></button></span>}
        </div>
      )}

      {error ? <ErrorState message={error} onRetry={fetchProducts} />
       : loading ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.85rem' }}>{Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
       : products.length === 0 ? <EmptyState title="No products found" description="Try adjusting your filters or search." icon="🔍" />
       : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.85rem' }}>{products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
      }

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: '2.5rem' }}>
          <button onClick={() => setParam('page', String(page - 1))} disabled={page === 0} style={{ ...pill(false), padding: '8px 10px', opacity: page === 0 ? 0.35 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer' }}><ChevronLeft size={17} /></button>
          {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => (
            <button key={i} onClick={() => setParam('page', String(i))} style={{
              width: 34, height: 34, borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: i === page ? 'none' : '1px solid #e2e8f0',
              background: i === page ? '#2563eb' : '#fff',
              color: i === page ? '#fff' : '#64748b',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{i + 1}</button>
          ))}
          <button onClick={() => setParam('page', String(page + 1))} disabled={page >= pagination.totalPages - 1} style={{ ...pill(false), padding: '8px 10px', opacity: page >= pagination.totalPages-1 ? 0.35 : 1, cursor: page >= pagination.totalPages-1 ? 'not-allowed' : 'pointer' }}><ChevronRight size={17} /></button>
        </div>
      )}
    </div>
  )
}
