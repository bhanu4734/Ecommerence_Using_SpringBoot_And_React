import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { orderService } from '../../services'
import { useCart } from '../../hooks/useCartContext'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Loader } from '../../components/ui/Loader'

const statusColor = { PENDING: 'yellow', CONFIRMED: 'green', PROCESSING: 'blue', SHIPPED: 'purple', DELIVERED: 'green', CANCELLED: 'red' }

export default function OrdersPage() {
  const { userId } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getByUser(userId).then(r => setOrders(r.data.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [userId])

  if (loading) return <Loader text="Loading orders..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6"><p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Your</p><h1 className="text-2xl font-bold text-slate-900">Orders</h1></div>
      {orders.length === 0 ? (
        <div className="text-center py-16"><div className="text-4xl mb-3">📦</div><p className="font-semibold text-slate-800 mb-1">No orders yet</p><p className="text-sm text-slate-500 mb-4">Place your first order!</p><Link to="/user/products"><Button>Start Shopping</Button></Link></div>
      ) : (
        <div className="space-y-3">
          {orders.map((o, i) => <OrderCard key={o.id} order={o} index={i} />)}
        </div>
      )}
    </div>
  )
}

function OrderCard({ order, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className="overflow-hidden">
        <div onClick={() => setOpen(e => !e)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center"><Package size={17} className="text-primary-600" /></div>
            <div><p className="text-sm font-semibold text-slate-800">Order #{order.id}</p><p className="text-xs text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' })}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Badge color={statusColor[order.status] || 'slate'}>{order.status}</Badge>
            <span className="font-bold text-primary-600 text-sm">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            {open ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100">
              <div className="p-4 space-y-3">
                <p className="text-sm text-slate-500"><span className="font-medium text-slate-400">Ship to:</span> {order.shippingAddress}</p>
                {order.items?.map(item => (
                  <div key={item.id} className="flex gap-3 items-center p-3 rounded-xl bg-slate-50">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">{item.productImage && <img src={item.productImage} alt="" className="w-full h-full object-cover" />}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm text-slate-700 truncate">{item.productName}</p><p className="text-xs text-slate-400">×{item.quantity} @ ₹{Number(item.unitPrice).toLocaleString('en-IN')}</p></div>
                    <span className="text-sm font-semibold text-slate-600">₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
