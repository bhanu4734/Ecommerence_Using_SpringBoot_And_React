import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../../hooks/useCartContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Loader } from '../../components/ui/Loader'

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart()
  if (loading && !cart) return <Loader text="Loading cart..." />
  const items = cart?.items || []
  const total = cart?.totalAmount || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Your</p>
        <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-16"><div className="text-4xl mb-3">🛒</div><p className="font-semibold text-slate-800 mb-1">Your cart is empty</p><p className="text-sm text-slate-500 mb-4">Start adding some products!</p><Link to="/user/products"><Button>Start Shopping <ArrowRight size={15} /></Button></Link></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <Card key={item.id} className="flex gap-4 p-4">
                <Link to={`/user/products/${item.productId}`} className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                    {item.productImage ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={18} className="text-slate-300" /></div>}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/user/products/${item.productId}`} className="text-sm font-semibold text-slate-800 hover:text-primary-600 transition-colors line-clamp-1">{item.productName}</Link>
                  <p className="text-sm font-bold text-primary-600 mt-1">₹{Number(item.unitPrice).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={14} /></button>
                  <div>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden mb-1">
                      <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity-1) : removeItem(item.id)} className="px-2 py-1 text-slate-500 hover:bg-slate-50"><Minus size={11} /></button>
                      <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                      <button onClick={() => updateItem(item.id, item.quantity+1)} className="px-2 py-1 text-slate-500 hover:bg-slate-50"><Plus size={11} /></button>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 text-right">₹{Number(item.subtotal).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-5 sticky top-20 space-y-4">
            <h2 className="font-bold text-slate-900">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-medium">₹{Number(total).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className="text-emerald-600 font-medium">Free</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tax (18%)</span><span className="font-medium">₹{(total*0.18).toLocaleString('en-IN',{maximumFractionDigits:0})}</span></div>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <div className="flex justify-between mb-1"><span className="font-bold text-slate-900">Total</span><span className="font-extrabold text-primary-600 text-xl">₹{(total*1.18).toLocaleString('en-IN',{maximumFractionDigits:0})}</span></div>
              <p className="text-[11px] text-slate-400">Inclusive of all taxes</p>
            </div>
            <Link to="/user/checkout"><Button className="w-full">Checkout <ArrowRight size={15} /></Button></Link>
            <Link to="/user/products" className="block text-center text-xs text-slate-400 hover:text-primary-600 transition-colors">← Continue Shopping</Link>
          </Card>
        </div>
      )}
    </div>
  )
}
