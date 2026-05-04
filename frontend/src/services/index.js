import api from './api'

// ── Products ──────────────────────────────────────────────
export const productService = {
  getAll: (params = {}) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
}

// ── Categories ────────────────────────────────────────────
export const categoryService = {
  getAll: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
}

// ── Users ─────────────────────────────────────────────────
export const userService = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (data) => api.post('/api/users', data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
}

// ── Cart ──────────────────────────────────────────────────
export const cartService = {
  getCart: (userId) => api.get(`/api/cart/${userId}`),
  addItem: (userId, data) => api.post(`/api/cart/${userId}/items`, data),
  updateItem: (userId, itemId, data) => api.put(`/api/cart/${userId}/items/${itemId}`, data),
  removeItem: (userId, itemId) => api.delete(`/api/cart/${userId}/items/${itemId}`),
  clearCart: (userId) => api.delete(`/api/cart/${userId}`),
}

// ── Orders ────────────────────────────────────────────────
export const orderService = {
  placeOrder: (data) => api.post('/api/orders', data),
  getById: (id) => api.get(`/api/orders/${id}`),
  getByUser: (userId) => api.get(`/api/orders/user/${userId}`),
  getAll: () => api.get('/api/orders'),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, null, { params: { status } }),
}

// ── Payments ──────────────────────────────────────────────
export const paymentService = {
  process: (data) => api.post('/api/payments', data),
  getById: (id) => api.get(`/api/payments/${id}`),
  getByOrder: (orderId) => api.get(`/api/payments/order/${orderId}`),
  getAll: () => api.get('/api/payments'),
  updateStatus: (id, status) => api.put(`/api/payments/${id}/status`, null, { params: { status } }),
}
