import { useState, useEffect } from 'react'
import { orderService } from '../../services'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Loader } from '../../components/ui/Loader'
import toast from 'react-hot-toast'

const statusColor = { PENDING:'yellow', CONFIRMED:'green', PROCESSING:'blue', SHIPPED:'purple', DELIVERED:'green', CANCELLED:'red' }
const STATUSES = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED']

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => { setLoading(true); orderService.getAll().then(r => setOrders(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(fetchOrders, [])

  const updateStatus = async (id, status) => {
    try { await orderService.updateStatus(id, status); toast.success('Status updated'); fetchOrders() }
    catch (e) { toast.error(e.message) }
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Manage</p><h1 className="text-2xl font-bold text-slate-900">Orders</h1></div>
      {orders.length === 0 ? <div className="text-center py-16 text-slate-500">No orders yet</div> : (
        <Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full">
          <thead><tr className="border-b border-slate-100">{['Order','Customer','Amount','Status','Date','Action'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>{orders.map(o=>(
            <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 text-sm font-semibold text-slate-800">#{o.id}</td>
              <td className="px-4 py-3"><div><p className="text-sm text-slate-700">{o.userName}</p><p className="text-xs text-slate-400 truncate max-w-[200px]">{o.shippingAddress}</p></div></td>
              <td className="px-4 py-3 text-sm font-bold text-primary-600">₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
              <td className="px-4 py-3"><Badge color={statusColor[o.status]||'slate'}>{o.status}</Badge></td>
              <td className="px-4 py-3 text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
              <td className="px-4 py-3">
                <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}</tbody>
        </table></div></Card>
      )}
    </div>
  )
}
