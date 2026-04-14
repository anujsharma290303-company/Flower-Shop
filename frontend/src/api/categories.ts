/**
 * Category API Service
 * Handles all category-related API calls
 */

import api from './axios'
import type { Category, ApiResponse } from '@/types'
import { API_ENDPOINTS } from '@/utils/constants'

export const categoryService = {
  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    try {
      const response = await api.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },

  /**
   * Get single category by ID
   */
  async getById(id: number): Promise<Category> {
    try {
      const response = await api.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORY_BY_ID(id))
      return response.data.data
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error)
      throw error
    }
  },

  /**
   * Get category by slug
   */
  async getBySlug(slug: string): Promise<Category> {
    try {
      const response = await api.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORY_BY_SLUG(slug))
      return response.data.data
    } catch (error) {
      console.error(`Failed to fetch category ${slug}:`, error)
      throw error
    }
  },

  /**
   * Get top-level categories only
   */
  async getTopLevel(): Promise<Category[]> {
    try {
      const response = await api.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES, {
        params: { parentId: null },
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch top-level categories:', error)
      throw error
    }
  },
}

export default categoryService
