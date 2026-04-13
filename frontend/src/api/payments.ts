import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'
import type { ApiResponse, CustomerOrder } from '@/types'

type PaymentMethod = 'mock-card' | 'mock-upi' | 'crypto'

type PaymentRecord = {
  id: number
  orderId: number
  amount: string
  currency: 'USD' | 'CAD'
  status: 'pending' | 'authorized' | 'captured' | 'voided' | 'success' | 'failed' | 'refunded'
  method: PaymentMethod
  transactionId: string
  authorizedAt: string | null
  capturedAt: string | null
  voidedAt: string | null
  refundedAt: string | null
  createdAt: string
  updatedAt: string
}

type PaymentResponse = {
  payment: PaymentRecord
  order?: CustomerOrder
}

type PaymentActionResponse = {
  payment: PaymentRecord
  order: CustomerOrder
}

type AuthorizePaymentPayload = {
  orderId: number
  method: PaymentMethod
  simulateSuccess?: boolean
  processingDelayMs?: number
}

export const paymentService = {
  async pay(payload: AuthorizePaymentPayload): Promise<PaymentResponse> {
    const response = await api.post<ApiResponse<PaymentResponse>>(API_ENDPOINTS.PAYMENT_PAY, payload)
    return response.data.data
  },

  async authorize(payload: AuthorizePaymentPayload): Promise<PaymentResponse> {
    const response = await api.post<ApiResponse<PaymentResponse>>(API_ENDPOINTS.PAYMENT_AUTHORIZE, payload)
    return response.data.data
  },

  async capture(paymentId: number): Promise<PaymentActionResponse> {
    const response = await api.post<ApiResponse<PaymentActionResponse>>(API_ENDPOINTS.PAYMENT_CAPTURE(paymentId))
    return response.data.data
  },

  async void(paymentId: number): Promise<PaymentActionResponse> {
    const response = await api.post<ApiResponse<PaymentActionResponse>>(API_ENDPOINTS.PAYMENT_VOID(paymentId))
    return response.data.data
  },

  async refund(paymentId: number): Promise<PaymentActionResponse> {
    const response = await api.post<ApiResponse<PaymentActionResponse>>(API_ENDPOINTS.PAYMENT_REFUND(paymentId))
    return response.data.data
  },
}

export type { PaymentMethod, PaymentRecord, PaymentResponse, PaymentActionResponse, AuthorizePaymentPayload }

export default paymentService
