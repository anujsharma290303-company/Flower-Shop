import axios from 'axios'
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from '@/utils/constants'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const requestUrl = String(config.url ?? '')
  const isAdminRequest = requestUrl.includes('/admin')
  const adminToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_TOKEN)
  const customerToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
  const token = isAdminRequest ? adminToken : customerToken

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error?.config?.url ?? '')
    const isAdminRequest = requestUrl.includes('/admin')

    if (error.response?.status === 401) {
      if (isAdminRequest) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_TOKEN)
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_USER)
        window.location.href = '/admin/login'
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
      }
    }

    return Promise.reject(error)
  }
)

export default api