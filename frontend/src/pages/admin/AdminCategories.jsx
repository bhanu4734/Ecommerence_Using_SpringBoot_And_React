import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ArrowLeft, X, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { categoryService } from '../../services'
import { LoadingSpinner, EmptyState } from '../../components/common/States'

const EMPTY_FORM = { name: '', description: '', imageUrl: '' }

function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState(category ? { ...category } : EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      if (category) { await categoryService.update(category.id, form); toast.success('Category updated') }
      else { await categoryService.create(form); toast.success('Category created') }
      onSave(); onClose()
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="card animate-fade-up" style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontWeight: 700, color: '#0f172a', fontSize: 18 }}>{category ? 'Edit Category' : 'New Category'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 6, borderRadius: 8, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color='#1e293b'; e.currentTarget.style.background='#f1f5f9' }}
            onMouseLeave={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='none' }}
          ><X size={17} /></button>
        </div>
        <form onSubmit={submit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><label style={labelStyle}>Name *</label><input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required className="input" placeholder="e.g. Electronics" /></div>
          <div><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} className="input" style={{ resize: 'none' }} placeholder="Brief category description…" /></div>
          <div>
            <label style={labelStyle}>Image URL</label>
            <input value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))} className="input" placeholder="https://…" />
            {form.imageUrl && (
              <div style={{ marginTop: 8, width: 56, height: 56, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img src={form.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>{loading ? 'Saving…' : category ? 'Save Changes' : 'Create Category'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const fetchCategories = async () => {
    setLoading(true)
    try { setCategories((await categoryService.getAll()).data.data || []) }
    catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? This may affect products.')) return
    try { await categoryService.delete(id); toast.success('Category deleted'); fetchCategories() }
    catch (err) { toast.error(err.message) }
  }

  return (
    <div className="page-container" style={{ padding: '2rem 0 4rem' }}>
      {modal && <CategoryModal category={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSave={fetchCategories} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
        <Link to="/admin" className="btn-ghost" style={{ padding: '8px 10px' }}><ArrowLeft size={17} /></Link>
        <div style={{ flex: 1 }}>
          <p className="label" style={{ marginBottom: 4 }}>Admin</p>
          <h1 className="section-title">Manage Categories</h1>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary"><Plus size={15} /> New Category</button>
      </div>

      {loading ? <LoadingSpinner />
       : categories.length === 0 ? <EmptyState title="No categories yet" icon="🏷️" />
       : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {categories.map((cat, i) => (
            <div key={cat.id} className="card-hover animate-fade-up" style={{ padding: '1.25rem', animationDelay: `${i * 0.06}s` }}>
              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                {cat.imageUrl
                  ? <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.target.style.transform='scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform='scale(1)'} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tag size={22} style={{ color: '#cbd5e1' }} /></div>
                }
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{cat.productCount} products</p>
                  {cat.description && <p style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{cat.description}</p>}
                </div>
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  <button onClick={() => setModal(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 5, borderRadius: 6, color: '#94a3b8', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color='#2563eb'; e.currentTarget.style.background='#eff6ff' }}
                    onMouseLeave={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='none' }}
                  ><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 5, borderRadius: 6, color: '#94a3b8', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color='#ef4444'; e.currentTarget.style.background='#fef2f2' }}
                    onMouseLeave={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='none' }}
                  ><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
