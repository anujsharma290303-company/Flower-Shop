import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'
import type { ApiResponse } from '@/types'

type RecipientChoiceProduct = {
  id: number
  name: string
  itemCode: string
  price: string
  image?: string[] | string | null
  withinBudget: boolean
}

type RecipientTokenDetails = {
  token: string
  recipientName: string
  budget: number
  expiresAt: string
  products: RecipientChoiceProduct[]
}

type RecipientAcceptPayload = {
  token: string
  chosenProductId: number
  deliveryAddress: string
  deliveryDate: string
}

type RecipientRejectPayload = {
  token: string
}

type RecipientActionResponse = {
  orderId: number
  chosenProductId?: number
}

export const recipientService = {
  async getByToken(token: string): Promise<RecipientTokenDetails> {
    const response = await api.get<ApiResponse<RecipientTokenDetails>>(API_ENDPOINTS.RECIPIENT_BY_TOKEN(token))
    return response.data.data
  },

  async accept(payload: RecipientAcceptPayload): Promise<RecipientActionResponse> {
    const response = await api.post<ApiResponse<RecipientActionResponse>>(API_ENDPOINTS.RECIPIENT_ACCEPT, payload)
    return response.data.data
  },

  async reject(payload: RecipientRejectPayload): Promise<RecipientActionResponse> {
    const response = await api.post<ApiResponse<RecipientActionResponse>>(API_ENDPOINTS.RECIPIENT_REJECT, payload)
    return response.data.data
  },
}

export type {
  RecipientChoiceProduct,
  RecipientTokenDetails,
  RecipientAcceptPayload,
  RecipientRejectPayload,
  RecipientActionResponse,
}

export default recipientService
