import api from './axios'
import { ApiResponse, FAQItem } from '@/types'
import { API_ENDPOINTS } from '@/utils/constants'

export const faqService = {
  async getAll(options: { isActive?: boolean } = {}): Promise<FAQItem[]> {
    try {
      const response = await api.get<ApiResponse<FAQItem[]>>(API_ENDPOINTS.FAQS, {
        params: options,
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch FAQs:', error)
      return []
    }
  },
}

export default faqService
