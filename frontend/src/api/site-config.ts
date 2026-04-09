/**
 * Site Configuration API Service
 * Handles site-wide configuration and settings
 */

import api from './axios'
import { SiteConfig, ApiResponse } from '@/types'
import { API_ENDPOINTS } from '@/utils/constants'

export const siteConfigService = {
  /**
   * Get all site configurations
   */
  async getAll(): Promise<SiteConfig[]> {
    try {
      const response = await api.get<ApiResponse<SiteConfig[]>>(API_ENDPOINTS.SITE_CONFIG)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch site config:', error)
      throw error
    }
  },

  /**
   * Get configuration by key
   */
  async getByKey(key: string): Promise<SiteConfig | null> {
    try {
      const configs = await this.getAll()
      return configs.find((config) => config.key === key) || null
    } catch (error) {
      console.error(`Failed to fetch config for key ${key}:`, error)
      return null
    }
  },

  /**
   * Get configuration value as string
   */
  async getValue(key: string, defaultValue: string = ''): Promise<string> {
    try {
      const config = await this.getByKey(key)
      return config?.value || defaultValue
    } catch (error) {
      console.error(`Failed to get config value for ${key}:`, error)
      return defaultValue
    }
  },

  /**
   * Get configuration value as number
   */
  async getNumberValue(key: string, defaultValue: number = 0): Promise<number> {
    try {
      const value = await this.getValue(key)
      return value ? parseInt(value, 10) : defaultValue
    } catch (error) {
      console.error(`Failed to get numeric config for ${key}:`, error)
      return defaultValue
    }
  },

  /**
   * Get configuration value as boolean
   */
  async getBooleanValue(key: string, defaultValue: boolean = false): Promise<boolean> {
    try {
      const value = await this.getValue(key)
      return value === 'true' || defaultValue
    } catch (error) {
      console.error(`Failed to get boolean config for ${key}:`, error)
      return defaultValue
    }
  },
}

export default siteConfigService
