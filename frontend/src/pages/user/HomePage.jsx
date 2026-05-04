import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Truck, RotateCcw } from 'lucide-react'
import { productService, categoryService } from '../../services'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Loader'

const FEATURES = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Sub-second loads with edge optimization' },
  { icon: Shield, title: 'Secure Payments', desc: 'End-to-end encrypted transactions' },
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
]

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productService.getAll({ page: 0, size: 8, sortBy: 'createdAt', direction: 'desc' }),
      categoryService.getAll(),
    ]).then(([p, c]) => {
      setProducts(p.data.data?.content || [])
      setCategories(c.data.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-primary-700 text-xs font-semibold">New arrivals every week</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] mb-4">
            Shop the <span className="text-primary-600">Future</span>
            <br />of Retail
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="text-slate-500 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            Curated collections of premium electronics, fashion, and lifestyle products.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap gap-3 justify-center">
            <Link to="/user/products"><Button size="lg">Explore Collection <ArrowRight size={16} /></Button></Link>
            <Link to="/user/products"><Button variant="outline" size="lg">View Categories</Button></Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
            className="flex gap-10 justify-center mt-12 pt-8 border-t border-slate-200">
            {[['12+', 'Products'], ['4', 'Categories'], ['100%', 'Secure']].map(([n, l]) => (
              <div key={l}>
                <p className="text-2xl font-extrabold text-primary-600">{n}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Browse by</p>
              <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
            </div>
            <Link to="/user/products"><Button variant="ghost" size="sm">View All <ArrowRight size={14} /></Button></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link key={cat.id} to={`/user/products?categoryId=${cat.id}`}>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                  <Card hover className="p-5 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 mx-auto mb-3 overflow-hidden">
                      {cat.imageUrl
                        ? <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>}
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">{cat.name}</p>
                    <p className="text-xs text-slate-400 mt-1">{cat.productCount} items</p>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Handpicked</p>
              <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
            </div>
            <Link to="/user/products"><Button variant="ghost" size="sm">View All <ArrowRight size={14} /></Button></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array(8).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </Card>
              ))
              : products.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                  <ProductCardSmall product={p} />
                </motion.div>
              ))
            }
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}>
              <Card className="p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-primary-600" />
                </div>
                <p className="font-semibold text-slate-800 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProductCardSmall({ product }) {
  const inStock = product.stockQuantity > 0
  return (
    <Link to={`/user/products/${product.id}`}>
      <Card hover className="overflow-hidden">
        <div className="aspect-square bg-slate-50 overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={32} /></div>
          )}
        </div>
        <div className="p-4">
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{product.categoryName}</p>
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-2">{product.name}</h3>
          <div className="flex items-center justify-between">
            <p className="font-bold text-primary-600">₹{Number(product.price).toLocaleString('en-IN')}</p>
            <span className={`text-[11px] font-medium ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>
              {inStock ? `${product.stockQuantity} left` : 'Sold out'}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

import { Package } from 'lucide-react'
