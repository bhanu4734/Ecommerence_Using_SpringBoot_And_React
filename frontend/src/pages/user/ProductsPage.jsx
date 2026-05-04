import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, X, ShoppingCart, Package } from 'lucide-react'
import { productService, categoryService } from '../../services'
import { useCart } from '../../hooks/useCartContext'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Loader'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)

  const keyword = searchParams.get('keyword') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const page = parseInt(searchParams.get('page') || '0')
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const direction = searchParams.get('direction') || 'desc'

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, size: 12, sortBy, direction }
      if (keyword) params.keyword = keyword
      if (categoryId) params.categoryId = categoryId
      const res = await productService.getAll(params)
      const d = res.data.data
      setProducts(d?.content || [])
      setPagination({ page: d?.number || 0, totalPages: d?.totalPages || 0, totalElements: d?.totalElements || 0 })
    } catch {} finally { setLoading(false) }
  }, [page, keyword, categoryId, sortBy, direction])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { categoryService.getAll().then(r => setCategories(r.data.data || [])).catch(() => {}) }, [])

  const setParam = (k, v) => { const n = new URLSearchParams(searchParams); v ? n.set(k, v) : n.delete(k); if (k !== 'page') n.delete('page'); setSearchParams(n) }
  const selectedCat = categories.find(c => String(c.id) === String(categoryId))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Browse</p>
        <h1 className="text-2xl font-bold text-slate-900">{selectedCat?.name || 'All Products'}</h1>
      </div>
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search..." defaultValue={keyword} onKeyDown={e => e.key === 'Enter' && setParam('keyword', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
        </div>
        <select value={`${sortBy}-${direction}`} onChange={e => { const [s,d]=e.target.value.split('-'); const n=new URLSearchParams(searchParams); n.set('sortBy',s); n.set('direction',d); setSearchParams(n) }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary-400">
          <option value="createdAt-desc">Newest</option><option value="price-asc">Price ↑</option><option value="price-desc">Price ↓</option><option value="name-asc">A–Z</option>
        </select>
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setParam('categoryId','')} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${!categoryId ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-slate-500 border-slate-200'}`}>All</button>
        {categories.map(c => <button key={c.id} onClick={() => setParam('categoryId', String(c.id))} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${String(categoryId)===String(c.id) ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-slate-500 border-slate-200'}`}>{c.name}</button>)}
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array(12).fill(0).map((_,i)=><Card key={i} className="overflow-hidden"><Skeleton className="aspect-square" /><div className="p-4 space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-full" /><Skeleton className="h-5 w-20" /></div></Card>)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16"><div className="text-4xl mb-3">🔍</div><p className="font-semibold text-slate-800">No products found</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{products.map((p,i) => <motion.div key={p.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}><PCard product={p} /></motion.div>)}</div>
      )}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button onClick={() => setParam('page', String(page-1))} disabled={page===0} className="p-2 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-30"><ChevronLeft size={16} /></button>
          {Array.from({length:Math.min(pagination.totalPages,7)},(_,i)=><button key={i} onClick={() => setParam('page',String(i))} className={`w-9 h-9 rounded-lg text-xs font-semibold ${i===page ? 'bg-primary-600 text-white' : 'border border-slate-200 text-slate-500'}`}>{i+1}</button>)}
          <button onClick={() => setParam('page', String(page+1))} disabled={page>=pagination.totalPages-1} className="p-2 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-30"><ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  )
}

function PCard({ product: p }) {
  const { addToCart, loading } = useCart()
  const inStock = p.stockQuantity > 0
  return (
    <Card hover className="overflow-hidden group">
      <Link to={`/user/products/${p.id}`}>
        <div className="aspect-square bg-slate-50 overflow-hidden">{p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center"><Package size={32} className="text-slate-300" /></div>}</div>
      </Link>
      <div className="p-4">
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{p.categoryName}</p>
        <Link to={`/user/products/${p.id}`}><h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 hover:text-primary-600 transition-colors">{p.name}</h3></Link>
        <div className="flex items-center justify-between">
          <p className="font-bold text-primary-600">₹{Number(p.price).toLocaleString('en-IN')}</p>
          <button onClick={() => inStock && addToCart(p.id,1)} disabled={!inStock||loading} className={`p-2 rounded-lg transition-all ${inStock ? 'bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-600 hover:text-white' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}><ShoppingCart size={14} /></button>
        </div>
      </div>
    </Card>
  )
}
