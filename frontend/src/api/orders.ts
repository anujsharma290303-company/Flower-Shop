import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'
import type { ApiResponse, CustomerOrder, CustomerOrderStatusLog } from '@/types'

type OrderTrackResponse = {
  orderId: number
  status: string
  paymentStatus: string
  timeline: CustomerOrderStatusLog[]
}

type CreateOrderItemPayload = {
  productId: number
  quantity: number
}

type CreateOrderPayload = {
  customerName: string
  customerEmail: string
  customerPhone: string
  recipientName: string
  recipientEmail?: string | null
  recipientPhone: string
  deliveryMode?: 'recipient-provides' | 'sender-provides' | 'social-media'
  deliveryAddress?: string | null
  deliveryDate?: string | null
  country?: 'US' | 'CA'
  currency?: 'USD' | 'CAD'
  message?: string | null
  cardMessage?: string | null
  isRecipientChoice?: boolean
  items: CreateOrderItemPayload[]
  customBouquetIds?: number[]
}

type CreateOrderResponse = {
  order: CustomerOrder
  recipientToken: string | null
  recipientLink: string | null
}

type UploadOrderMediaPayload = {
  media: File
  mediaType?: 'photo' | 'video'
  sharedWith?: 'sender' | 'public'
}

export const orderService = {
  async trackOrder(orderId: number, email: string): Promise<OrderTrackResponse> {
    const response = await api.get<ApiResponse<OrderTrackResponse>>(API_ENDPOINTS.ORDER_TRACK, {
      params: {
        orderId,
        email,
      },
    })

    return response.data.data
  },

  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const response = await api.post<ApiResponse<CreateOrderResponse>>(API_ENDPOINTS.ORDERS, payload)
    return response.data.data
  },

  async uploadOrderMedia(orderId: number, payload: UploadOrderMediaPayload): Promise<unknown> {
    const formData = new FormData()
    formData.append('media', payload.media)

    if (payload.mediaType) {
      formData.append('mediaType', payload.mediaType)
    }

    if (payload.sharedWith) {
      formData.append('sharedWith', payload.sharedWith)
    }

    const response = await api.post<ApiResponse<unknown>>(API_ENDPOINTS.ORDER_MEDIA_BY_ID(orderId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.data
  },
}

export type { CreateOrderPayload, UploadOrderMediaPayload, OrderTrackResponse, CreateOrderResponse }

export default orderService
