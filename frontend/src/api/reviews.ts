import api from './axios'
import { ApiResponse, CustomerReview } from '@/types'
import { API_ENDPOINTS } from '@/utils/constants'

export const reviewService = {
  async getAll(): Promise<CustomerReview[]> {
    try {
      const response = await api.get<ApiResponse<CustomerReview[]>>(API_ENDPOINTS.REVIEWS)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      return []
    }
  },
}

export default reviewService
