import api from './axios'
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/utils/constants'
import type { ApiResponse, CustomerOrder, CustomerProfile } from '@/types'

type CustomerUser = {
  id: number
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  credits: number
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
}

type LoginResponseData = {
  token: string
  user: CustomerUser
}

type RegisterResponseData = {
  user: CustomerUser
}

type OrdersResponseData = {
  totalItems: number
  page: number
  limit: number
  totalPages: number
  orders: CustomerOrder[]
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponseData> {
    const response = await api.post<ApiResponse<LoginResponseData>>(API_ENDPOINTS.AUTH_LOGIN, payload)
    return response.data.data
  },

  async register(payload: RegisterPayload): Promise<RegisterResponseData> {
    const response = await api.post<ApiResponse<RegisterResponseData>>(API_ENDPOINTS.AUTH_REGISTER, payload)
    return response.data.data
  },

  async getMe(): Promise<CustomerProfile> {
    const response = await api.get<ApiResponse<CustomerProfile>>(API_ENDPOINTS.AUTH_ME)
    return response.data.data
  },

  async updateMe(payload: { firstName?: string; lastName?: string }): Promise<CustomerProfile> {
    const response = await api.put<ApiResponse<CustomerProfile>>(API_ENDPOINTS.AUTH_ME, payload)
    return response.data.data
  },

  async changePassword(payload: { oldPassword: string; newPassword: string }): Promise<void> {
    await api.put<ApiResponse<{ success: true }>>(API_ENDPOINTS.AUTH_ME_PASSWORD, payload)
  },

  async getMyOrders(options: { page?: number; limit?: number } = {}): Promise<OrdersResponseData> {
    const response = await api.get<ApiResponse<OrdersResponseData>>(API_ENDPOINTS.AUTH_ORDERS, {
      params: options,
    })
    return response.data.data
  },

  async getMyOrderById(id: number): Promise<CustomerOrder> {
    const response = await api.get<ApiResponse<CustomerOrder>>(API_ENDPOINTS.AUTH_ORDER_BY_ID(id))
    return response.data.data
  },

  saveSession(token: string, user: CustomerUser): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token)
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user))
  },

  clearSession(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
  },

  isLoggedIn(): boolean {
    return Boolean(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN))
  },
}

export default authService
