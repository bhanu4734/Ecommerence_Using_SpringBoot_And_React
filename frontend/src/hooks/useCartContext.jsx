import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartService } from '../services'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const userId = user?.id

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setCart({ items: [], totalAmount: 0, itemCount: 0 })
      return
    }
    try {
      const res = await cartService.getCart(userId)
      setCart(res.data.data)
    } catch {
      setCart({ items: [], totalAmount: 0, itemCount: 0 })
    }
  }, [userId])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    if (!userId) return toast.error('Please login to add to cart')
    setLoading(true)
    try {
      const res = await cartService.addItem(userId, { productId, quantity })
      setCart(res.data.data)
      toast.success('Added to cart')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (itemId, quantity) => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await cartService.updateItem(userId, itemId, { productId: 0, quantity })
      setCart(res.data.data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (itemId) => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await cartService.removeItem(userId, itemId)
      setCart(res.data.data)
      toast.success('Item removed')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!userId) return
    try {
      await cartService.clearCart(userId)
      setCart({ items: [], totalAmount: 0, itemCount: 0 })
    } catch {}
  }

  return (
    <CartContext.Provider value={{ cart, loading, userId, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
