import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Smartphone, Building, Truck, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { orderService, paymentService } from '../../services'
import { useCart } from '../../hooks/useCartContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const METHODS = [
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
  { value: 'UPI', label: 'UPI', icon: Smartphone },
  { value: 'NET_BANKING', label: 'Net Banking', icon: Building },
  { value: 'COD', label: 'Cash on Delivery', icon: Truck },
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
    if (!form.address.trim()) { toast.error('Enter a shipping address'); return }
    if (!items.length) { toast.error('Cart is empty'); return }
    setLoading(true)
    try {
      const o = await orderService.placeOrder({ userId, shippingAddress: form.address })
      await paymentService.process({ orderId: o.data.data.id, method: form.paymentMethod })
      setStep('success'); await clearCart()
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  if (step === 'success') return (
    <div className="max-w-md mx-auto text-center py-20 px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto"><CheckCircle size={32} className="text-emerald-500" /></div>
        <h1 className="text-2xl font-bold text-slate-900">Order Placed!</h1>
        <p className="text-slate-500">Your order has been confirmed.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/user/orders"><Button>View Orders</Button></Link>
          <Link to="/user/products"><Button variant="outline">Continue Shopping</Button></Link>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/user/cart" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 font-medium mb-6"><ArrowLeft size={15} /> Back to Cart</Link>
      <div className="mb-6"><p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Final Step</p><h1 className="text-2xl font-bold text-slate-900">Checkout</h1></div>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-3">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-primary-50 border border-primary-200 text-primary-600 text-xs font-bold flex items-center justify-center">1</span>Shipping Address</h2>
            <textarea value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} rows={3} required placeholder="Enter full delivery address..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
          </Card>
          <Card className="p-5 space-y-3">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-primary-50 border border-primary-200 text-primary-600 text-xs font-bold flex items-center justify-center">2</span>Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {METHODS.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" onClick={() => setForm(f => ({...f, paymentMethod: value}))}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm font-medium transition-all text-left ${form.paymentMethod === value ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </Card>
        </div>
        <Card className="p-5 sticky top-20 space-y-4">
          <h2 className="font-bold text-slate-900">Summary</h2>
          <div className="space-y-1 text-sm border-b border-slate-100 pb-3">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>₹{Number(total).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Tax</span><span>₹{(total*0.18).toLocaleString('en-IN',{maximumFractionDigits:0})}</span></div>
          </div>
          <div className="flex justify-between"><span className="font-bold">Total</span><span className="font-extrabold text-primary-600 text-lg">₹{(total*1.18).toLocaleString('en-IN',{maximumFractionDigits:0})}</span></div>
          <Button type="submit" loading={loading} className="w-full">{loading ? 'Processing...' : 'Place Order'}</Button>
        </Card>
      </form>
    </div>
  )
}
