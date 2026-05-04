import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loader } from '../ui/Loader'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/user/home'} replace />
  }

  return children
}
