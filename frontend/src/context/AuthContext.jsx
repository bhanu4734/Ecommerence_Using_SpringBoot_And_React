import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { userService } from '../services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('nexus_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('nexus_user') }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await userService.getAll()
    const users = res.data.data || []
    const found = users.find(u => u.email === email)
    if (!found) throw new Error('No account found with this email')
    // Note: In production, password checking should happen server-side
    // This is a demo-only approach since the backend has no auth endpoint
    const userDetail = found
    localStorage.setItem('nexus_user', JSON.stringify(userDetail))
    setUser(userDetail)
    return userDetail
  }, [])

  const register = useCallback(async (data) => {
    const res = await userService.create(data)
    const newUser = res.data.data
    localStorage.setItem('nexus_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('nexus_user')
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
