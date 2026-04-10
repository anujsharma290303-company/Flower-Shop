import api from './axios'
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/utils/constants'
import type { Admin, AdminDashboardStats, ApiResponse, PaginatedResponse, Product, SiteConfig } from '@/types'

type AdminLoginPayload = {
  email: string
  password: string
}

type AdminLoginData = {
  token: string
  admin: {
    id: number
    email: string
    role: 'superadmin' | 'editor'
  }
}

type AdminRequestPayload = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  body?: unknown
  query?: Record<string, unknown>
}

type AdminProductUpdatePayload = {
  name?: string
  itemCode?: string
  price?: string
  description?: string | null
  size?: string | null
  categoryId?: number
  isBestSeller?: boolean
  inStock?: boolean
  subscriptionAvailable?: boolean
}

export const ADMIN_ENDPOINT_CATALOG = [
  'GET /admin/dashboard/stats',
  'GET /admin/users',
  'GET /admin/users/:id',
  'PATCH /admin/users/:id/toggle',
  'GET /admin/credits',
  'POST /admin/orders/expire-recipient-tokens',
  'GET /admin/products',
  'POST /admin/products',
  'PUT /admin/products/:id',
  'DELETE /admin/products/:id',
  'PATCH /admin/products/:id/toggle',
  'GET /admin/categories',
  'POST /admin/categories',
  'PUT /admin/categories/:id',
  'DELETE /admin/categories/:id',
  'PATCH /admin/categories/:id/toggle',
  'GET /admin/orders',
  'GET /admin/orders/:id',
  'PUT /admin/orders/:id',
  'GET /admin/orders/:id/recipient-link',
  'GET /admin/orders/:id/timeline',
  'PATCH /admin/orders/:id/status',
  'PATCH /admin/orders/:id/payment',
  'GET /admin/faqs',
  'POST /admin/faqs',
  'PUT /admin/faqs/:id',
  'DELETE /admin/faqs/:id',
  'PATCH /admin/faqs/:id/toggle',
  'GET /admin/site-config',
  'PUT /admin/site-config',
  'GET /admin/reviews',
  'PATCH /admin/reviews/:id/approve',
  'PATCH /admin/reviews/:id/reject',
  'DELETE /admin/reviews/:id',
  'GET /admin/blogs',
  'POST /admin/blogs',
  'PUT /admin/blogs/:id',
  'PATCH /admin/blogs/:id/publish',
  'DELETE /admin/blogs/:id',
  'GET /admin/bouquets',
  'GET /admin/bouquets/:id',
  'DELETE /admin/bouquets/:id',
  'GET /admin/payments',
  'GET /admin/payments/:id',
  'GET /admin/subscriptions',
  'GET /admin/subscriptions/:id',
  'PATCH /admin/subscriptions/:id',
  'DELETE /admin/subscriptions/:id',
  'GET /admin/delivery/blackout-dates',
  'POST /admin/delivery/blackout-dates',
  'PATCH /admin/delivery/blackout-dates/:id',
  'DELETE /admin/delivery/blackout-dates/:id',
  'GET /admin/notifications/stats',
  'GET /admin/notifications',
  'GET /admin/notifications/:id',
  'GET /admin/media',
  'PATCH /admin/media/:id/approve',
] as const

export const adminService = {
  async login(payload: AdminLoginPayload): Promise<AdminLoginData> {
    const response = await api.post<ApiResponse<AdminLoginData>>(API_ENDPOINTS.ADMIN_LOGIN, payload)
    return response.data.data
  },

  async me(): Promise<Admin> {
    const response = await api.get<ApiResponse<Admin>>(API_ENDPOINTS.ADMIN_ME)
    return response.data.data
  },

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await api.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard/stats')
    return response.data.data
  },

  async getProducts(): Promise<Product[]> {
    const response = await api.get<PaginatedResponse<Product> & { data?: { products?: Product[] } }>('/admin/products', {
      params: { page: 1, limit: 200 },
    })

    if (Array.isArray(response.data.items)) {
      return response.data.items
    }

    if (response.data.data && Array.isArray(response.data.data.products)) {
      return response.data.data.products
    }

    return []
  },

  async updateProduct(id: number, payload: AdminProductUpdatePayload): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/admin/products/${id}`, payload)
    return response.data.data
  },

  async getSiteConfig(): Promise<SiteConfig> {
    const response = await api.get<ApiResponse<SiteConfig>>('/admin/site-config')
    return response.data.data
  },

  async updateSiteConfig(payload: Partial<SiteConfig>): Promise<SiteConfig> {
    const response = await api.put<ApiResponse<SiteConfig>>('/admin/site-config', payload)
    return response.data.data
  },

  async request(payload: AdminRequestPayload): Promise<unknown> {
    const normalizedPath = payload.path.startsWith('/admin') ? payload.path : `/admin/${payload.path.replace(/^\/+/, '')}`

    const response = await api.request<ApiResponse<unknown>>({
      method: payload.method,
      url: normalizedPath,
      params: payload.query,
      data: payload.body,
    })

    return response.data
  },

  saveSession(token: string, admin: AdminLoginData['admin']): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_TOKEN, token)
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_USER, JSON.stringify(admin))
  },

  clearSession(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_USER)
  },

  isLoggedIn(): boolean {
    return Boolean(localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_TOKEN))
  },
}

export default adminService
