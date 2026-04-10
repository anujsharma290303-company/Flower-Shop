import api from './axios'
import type { ApiResponse, BlogPost } from '@/types'
import { API_ENDPOINTS } from '@/utils/constants'

export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    const response = await api.get<ApiResponse<BlogPost[]>>(API_ENDPOINTS.BLOGS)
    return response.data.data
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    const response = await api.get<ApiResponse<BlogPost>>(API_ENDPOINTS.BLOG_BY_SLUG(slug))
    return response.data.data
  },
}

export default blogService
