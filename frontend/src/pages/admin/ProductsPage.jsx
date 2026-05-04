import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { productService, categoryService } from '../../services'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { Loader } from '../../components/ui/Loader'

const EMPTY = { name:'', description:'', price:'', stockQuantity:'', imageUrl:'', brand:'', categoryId:'', active:true }

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try { const [p,c] = await Promise.all([productService.getAll({page:0,size:100}), categoryService.getAll()]); setProducts(p.data.data?.content||[]); setCategories(c.data.data||[]) }
    catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { fetchData() }, [])
  const handleDelete = async id => { if (!confirm('Delete?')) return; try { await productService.delete(id); toast.success('Deleted'); fetchData() } catch (e) { toast.error(e.message) } }
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      {modal !== null && <ProductModal product={modal === 'create' ? null : modal} categories={categories} onClose={() => setModal(null)} onSave={fetchData} />}
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Manage</p><h1 className="text-2xl font-bold text-slate-900">Products</h1></div>
        <Button onClick={() => setModal('create')}><Plus size={15} /> New Product</Button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
      {loading ? <Loader /> : filtered.length === 0 ? <div className="text-center py-16 text-slate-500">No products found</div> : (
        <Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full">
          <thead><tr className="border-b border-slate-100">{['Product','Category','Price','Stock','Status',''].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>{filtered.map(p=>(
            <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">{p.imageUrl?<img src={p.imageUrl} alt="" className="w-full h-full object-cover" />:<div className="w-full h-full flex items-center justify-center"><Package size={14} className="text-slate-400" /></div>}</div><div><p className="text-sm font-medium text-slate-800 max-w-[180px] truncate">{p.name}</p>{p.brand && <p className="text-xs text-slate-400">{p.brand}</p>}</div></div></td>
              <td className="px-4 py-3"><Badge color="blue">{p.categoryName}</Badge></td>
              <td className="px-4 py-3 text-sm font-semibold text-primary-600">₹{Number(p.price).toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 text-sm font-medium" style={{color:p.stockQuantity>0?'#16a34a':'#ef4444'}}>{p.stockQuantity}</td>
              <td className="px-4 py-3"><Badge color={p.active?'green':'red'}>{p.active?'Active':'Inactive'}</Badge></td>
              <td className="px-4 py-3"><div className="flex gap-1">
                <button onClick={()=>setModal(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all"><Pencil size={14} /></button>
                <button onClick={()=>handleDelete(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={14} /></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table></div></Card>
      )}
    </div>
  )
}

function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(product ? {...product, price:String(product.price), stockQuantity:String(product.stockQuantity), categoryId:product.categoryId||''} : EMPTY)
  const [saving, setSaving] = useState(false)
  const h = (k,v) => setForm(f=>({...f,[k]:v}))
  const submit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = {...form, price:parseFloat(form.price), stockQuantity:parseInt(form.stockQuantity||'0'), categoryId:parseInt(form.categoryId)}
      if (product) { await productService.update(product.id, payload); toast.success('Updated') } else { await productService.create(payload); toast.success('Created') }
      onSave(); onClose()
    } catch (e) { toast.error(e.message) } finally { setSaving(false) }
  }
  return (
    <Modal open={true} onClose={onClose} title={product ? 'Edit Product' : 'New Product'} maxWidth="max-w-2xl">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Name *" value={form.name} onChange={e=>h('name',e.target.value)} required placeholder="iPhone 15 Pro" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Price (₹) *" type="number" min="0.01" step="0.01" value={form.price} onChange={e=>h('price',e.target.value)} required />
          <Input label="Stock" type="number" min="0" value={form.stockQuantity} onChange={e=>h('stockQuantity',e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Brand" value={form.brand} onChange={e=>h('brand',e.target.value)} />
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category *</label>
            <select value={form.categoryId} onChange={e=>h('categoryId',e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100">
              <option value="">Select</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <Input label="Image URL" value={form.imageUrl} onChange={e=>h('imageUrl',e.target.value)} placeholder="https://..." />
        <Input label="Description" value={form.description} onChange={e=>h('description',e.target.value)} rows={3} placeholder="Description..." />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={saving} className="flex-1">{product ? 'Save' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  )
}
