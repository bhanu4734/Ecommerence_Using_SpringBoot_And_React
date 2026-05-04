import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { categoryService } from '../../services'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { Loader } from '../../components/ui/Loader'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const fetch = () => { setLoading(true); categoryService.getAll().then(r => setCategories(r.data.data||[])).catch(e => toast.error(e.message)).finally(() => setLoading(false)) }
  useEffect(fetch, [])
  const handleDelete = async id => { if (!confirm('Delete this category?')) return; try { await categoryService.delete(id); toast.success('Deleted'); fetch() } catch (e) { toast.error(e.message) } }

  return (
    <div className="space-y-6">
      {modal !== null && <CatModal category={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSave={fetch} />}
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Manage</p><h1 className="text-2xl font-bold text-slate-900">Categories</h1></div>
        <Button onClick={() => setModal('create')}><Plus size={15} /> New Category</Button>
      </div>
      {loading ? <Loader /> : categories.length === 0 ? <div className="text-center py-16 text-slate-500">No categories yet</div> : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover className="overflow-hidden group">
                <div className="aspect-video bg-slate-50 overflow-hidden">
                  {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center"><Tag size={24} className="text-slate-300" /></div>}
                </div>
                <div className="p-4 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{cat.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{cat.productCount} products</p>
                    {cat.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setModal(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={13} /></button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function CatModal({ category, onClose, onSave }) {
  const [form, setForm] = useState(category ? { ...category } : { name:'', description:'', imageUrl:'' })
  const [saving, setSaving] = useState(false)
  const submit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      if (category) { await categoryService.update(category.id, form); toast.success('Updated') } else { await categoryService.create(form); toast.success('Created') }
      onSave(); onClose()
    } catch (e) { toast.error(e.message) } finally { setSaving(false) }
  }
  return (
    <Modal open={true} onClose={onClose} title={category ? 'Edit Category' : 'New Category'}>
      <form onSubmit={submit} className="space-y-4">
        <Input label="Name *" value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))} required placeholder="e.g. Electronics" />
        <Input label="Description" value={form.description} onChange={e => setForm(f=>({...f, description:e.target.value}))} rows={3} placeholder="Brief description..." />
        <Input label="Image URL" value={form.imageUrl} onChange={e => setForm(f=>({...f, imageUrl:e.target.value}))} placeholder="https://..." />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={saving} className="flex-1">{category ? 'Save' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  )
}
