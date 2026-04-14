/**
 * Product API Service
 * Handles all product-related API calls
 */

import api from './axios'
import type { Product, PaginatedResponse, ApiResponse } from '@/types'
import { API_ENDPOINTS } from '@/utils/constants'

export const productService = {
  /**
   * Get all products with optional filters
   */
  async getAll(options: {
    category?: string
    limit?: number
    page?: number
    search?: string
    isBestSeller?: boolean
  } = {}): Promise<PaginatedResponse<Product>> {
    try {
      const response = await api.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS, {
        params: options,
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch products:', error)
      throw error
    }
  },

  /**
   * Get single product by ID
   */
  async getById(id: number): Promise<Product> {
    try {
      const response = await api.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT_BY_ID(id))
      return response.data.data
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error)
      throw error
    }
  },

  /**
   * Get single product by item code
   */
  async getByItemCode(itemCode: string): Promise<Product> {
    try {
      const response = await api.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT_BY_ITEM_CODE(itemCode))
      return response.data.data
    } catch (error) {
      console.error(`Failed to fetch product itemCode ${itemCode}:`, error)
      throw error
    }
  },

  /**
   * Get best seller products
   */
  async getBestSellers(limit: number = 12): Promise<PaginatedResponse<Product>> {
    try {
      const response = await api.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS, {
        params: { isBestSeller: true, limit },
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch best seller products:', error)
      throw error
    }
  },

  /**
   * Search products by query
   */
  async search(query: string): Promise<PaginatedResponse<Product>> {
    try {
      const response = await api.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS, {
        params: { search: query },
      })
      return response.data
    } catch (error) {
      console.error('Failed to search products:', error)
      throw error
    }
  },
}

export default productService
