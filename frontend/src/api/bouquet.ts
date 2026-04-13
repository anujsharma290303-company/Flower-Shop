import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'
import type { ApiResponse } from '@/types'

export interface CustomBouquetPayload {
  type: 'sender' | 'recipient'
  pricePoint: number
  colors: string[]
  flowerTypes: string[]
  containerStyle?: string | null
  occasion?: string | null
  extras: string[]
  note?: string | null
  orderId?: number | null
}

export interface CustomBouquetResponse {
  id: number
  type: string
  pricePoint: number
  colors: string[]
  flowerTypes: string[]
  containerStyle: string | null
  occasion: string | null
  extras: string[]
  note: string | null
  orderId: number | null
  createdAt: string
  updatedAt: string
}

export const bouquetService = {
  async create(payload: CustomBouquetPayload): Promise<CustomBouquetResponse> {
    const response = await api.post<ApiResponse<CustomBouquetResponse>>(API_ENDPOINTS.BOUQUET_CREATE, payload)
    return response.data.data
  },
}

export default bouquetService
