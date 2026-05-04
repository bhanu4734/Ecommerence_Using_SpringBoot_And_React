import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Package, CheckCircle, XCircle, Minus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { productService } from '../../services'
import { useCart } from '../../hooks/useCartContext'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Loader } from '../../components/ui/Loader'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const { addToCart, loading: cartLoading } = useCart()

  useEffect(() => {
    productService.getById(id).then(r => setProduct(r.data.data)).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader text="Loading product..." />
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>
  if (!product) return null

  const inStock = product.stockQuantity > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/user/products" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 font-medium mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to Products
      </Link>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
            {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package size={56} className="text-slate-300" /></div>}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-5">
          <div className="flex gap-2">
            <Badge color="blue">{product.categoryName}</Badge>
            {product.brand && <Badge color="slate">{product.brand}</Badge>}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">{product.name}</h1>
          {product.description && <p className="text-slate-500 leading-relaxed">{product.description}</p>}
          <div className="py-5 border-y border-slate-200">
            <p className="text-3xl font-extrabold text-primary-600">₹{Number(product.price).toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 mt-1">Inclusive of all taxes</p>
          </div>
          <div className="flex items-center gap-2">
            {inStock ? <><CheckCircle size={15} className="text-emerald-500" /><span className="text-sm font-medium text-emerald-600">{product.stockQuantity} units available</span></> : <><XCircle size={15} className="text-red-500" /><span className="text-sm font-medium text-red-600">Out of Stock</span></>}
          </div>
          {inStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 font-medium">Qty</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-3 py-2 text-slate-500 hover:bg-slate-50 transition-colors"><Minus size={14} /></button>
                  <span className="w-10 text-center text-sm font-semibold text-slate-800">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(10, q+1))} className="px-3 py-2 text-slate-500 hover:bg-slate-50 transition-colors"><Plus size={14} /></button>
                </div>
              </div>
              <Button onClick={() => addToCart(product.id, qty)} loading={cartLoading} className="w-full" size="lg">
                <ShoppingCart size={17} /> Add to Cart
              </Button>
            </div>
          )}
          <Card className="p-5 space-y-2.5">
            <p className="font-semibold text-slate-800 text-sm mb-3">Product Info</p>
            {[['SKU', `PROD-${String(product.id).padStart(4,'0')}`], ['Category', product.categoryName], ['Brand', product.brand||'N/A']].map(([l,v]) => (
              <div key={l} className="flex justify-between text-sm"><span className="text-slate-400">{l}</span><span className="text-slate-600 font-medium">{v}</span></div>
            ))}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
