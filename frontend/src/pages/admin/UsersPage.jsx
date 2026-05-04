import { useState, useEffect } from 'react'
import { userService } from '../../services'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { Loader } from '../../components/ui/Loader'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { userService.getAll().then(r => setUsers(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)) }, [])

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Manage</p><h1 className="text-2xl font-bold text-slate-900">Users</h1></div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">
              {['Name','Email','Phone','Role','Joined'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">{u.name?.charAt(0)}</div><span className="text-sm font-medium text-slate-800">{u.name}</span></div></td>
                  <td className="px-4 py-3 text-sm text-slate-500">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{u.phone || '—'}</td>
                  <td className="px-4 py-3"><Badge color={u.role === 'ADMIN' ? 'purple' : 'blue'}>{u.role}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
