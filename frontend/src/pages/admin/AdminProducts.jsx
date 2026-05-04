import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ArrowLeft, X, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { productService, categoryService } from '../../services'
import { LoadingSpinner, EmptyState } from '../../components/common/States'

const EMPTY_FORM = { name: '', description: '', price: '', stockQuantity: '', imageUrl: '', brand: '', categoryId: '', active: true }

function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(product
    ? { ...product, categoryId: product.categoryId || '', price: String(product.price), stockQuantity: String(product.stockQuantity) }
    : EMPTY_FORM
  )
  const [loading, setLoading] = useState(false)
  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const payload = { ...form, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity || '0'), categoryId: parseInt(form.categoryId) }
      if (product) { await productService.update(product.id, payload); toast.success('Product updated') }
      else { await productService.create(payload); toast.success('Product created') }
      onSave(); onClose()
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="card animate-fade-up" style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontWeight: 700, color: '#0f172a', fontSize: 18 }}>{product ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 6, borderRadius: 8, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color='#1e293b'; e.currentTarget.style.background='#f1f5f9' }}
            onMouseLeave={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='none' }}
          ><X size={17} /></button>
        </div>
        <form onSubmit={submit} style={{ padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Product Name *</label><input value={form.name} onChange={e => handle('name', e.target.value)} required className="input" placeholder="e.g. iPhone 15 Pro" /></div>
            <div><label style={labelStyle}>Price (₹) *</label><input type="number" min="0.01" step="0.01" value={form.price} onChange={e => handle('price', e.target.value)} required className="input" placeholder="0.00" /></div>
            <div><label style={labelStyle}>Stock Quantity</label><input type="number" min="0" value={form.stockQuantity} onChange={e => handle('stockQuantity', e.target.value)} className="input" placeholder="0" /></div>
            <div><label style={labelStyle}>Brand</label><input value={form.brand} onChange={e => handle('brand', e.target.value)} className="input" placeholder="e.g. Apple" /></div>
            <div><label style={labelStyle}>Category *</label><select value={form.categoryId} onChange={e => handle('categoryId', e.target.value)} required className="input"><option value="">Select category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Image URL</label><input value={form.imageUrl} onChange={e => handle('imageUrl', e.target.value)} className="input" placeholder="https://…" /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e => handle('description', e.target.value)} rows={3} className="input" style={{ resize: 'none' }} placeholder="Product description…" /></div>
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 10 }}>
              <button type="button" onClick={() => handle('active', !form.active)} style={{
                width: 40, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative',
                background: form.active ? '#2563eb' : '#e2e8f0', transition: 'background 0.2s',
              }}>
                <span style={{ position: 'absolute', top: 2, left: form.active ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', transition: 'left 0.2s' }} />
              </button>
              <span style={{ fontSize: 13, color: '#64748b' }}>Active (visible to customers)</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>{loading ? 'Saving…' : product ? 'Save Changes' : 'Create Product'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [p, c] = await Promise.all([productService.getAll({ page: 0, size: 100 }), categoryService.getAll()])
      setProducts(p.data.data?.content || [])
      setCategories(c.data.data || [])
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try { await productService.delete(id); toast.success('Product deleted'); fetchData() }
    catch (err) { toast.error(err.message) }
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-container" style={{ padding: '2rem 0 4rem' }}>
      {modal && <ProductModal product={modal === 'create' ? null : modal} categories={categories} onClose={() => setModal(null)} onSave={fetchData} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
        <Link to="/admin" className="btn-ghost" style={{ padding: '8px 10px' }}><ArrowLeft size={17} /></Link>
        <div style={{ flex: 1 }}>
          <p className="label" style={{ marginBottom: 4 }}>Admin</p>
          <h1 className="section-title">Manage Products</h1>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary"><Plus size={15} /> New Product</button>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="input" style={{ maxWidth: 320 }} />
      </div>

      {loading ? <LoadingSpinner />
       : filtered.length === 0 ? <EmptyState title="No products found" icon="📦" />
       : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                          {p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={14} style={{ color: '#cbd5e1' }} /></div>}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                          {p.brand && <p style={{ fontSize: 12, color: '#94a3b8' }}>{p.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px' }}><span className="badge badge-blue">{p.categoryName}</span></td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#2563eb', fontSize: 13 }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: p.stockQuantity > 0 ? '#22c55e' : '#ef4444', fontSize: 13 }}>{p.stockQuantity}</td>
                    <td style={{ padding: '10px 14px' }}><span className={p.active ? 'badge badge-green' : 'badge badge-red'}>{p.active ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => setModal(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 5, borderRadius: 6, color: '#94a3b8', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.color='#2563eb'; e.currentTarget.style.background='#eff6ff' }}
                          onMouseLeave={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='none' }}
                        ><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 5, borderRadius: 6, color: '#94a3b8', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.color='#ef4444'; e.currentTarget.style.background='#fef2f2' }}
                          onMouseLeave={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='none' }}
                        ><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
