/**
 * Site Configuration API Service
 * Handles site-wide configuration and settings
 */

import api from './axios'
import { SiteConfig, ApiResponse } from '@/types'
import { API_ENDPOINTS } from '@/utils/constants'

export const siteConfigService = {
  /**
   * Get the homepage site configuration
   */
  async get(): Promise<SiteConfig | null> {
    try {
      const response = await api.get<ApiResponse<SiteConfig>>(API_ENDPOINTS.SITE_CONFIG)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch site config:', error)
      return null
    }
  },

  /**
   * Backwards-compatible alias for the single homepage config payload.
   */
  async getAll(): Promise<SiteConfig | null> {
    try {
      const response = await api.get<ApiResponse<SiteConfig>>(API_ENDPOINTS.SITE_CONFIG)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch site config:', error)
      return null
    }
  },

  /**
   * Get configuration by key
   */
  async getByKey(key: keyof SiteConfig): Promise<SiteConfig[keyof SiteConfig] | null> {
    try {
      const config = await this.get()
      return config ? config[key] ?? null : null
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
      const config = await this.get()
      const value = config ? (config[key as keyof SiteConfig] as unknown) : undefined

      if (typeof value === 'string') {
        return value
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value)
      }

      return defaultValue
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
      if (value === '') {
        return defaultValue
      }

      return value === 'true'
    } catch (error) {
      console.error(`Failed to get boolean config for ${key}:`, error)
      return defaultValue
    }
  },
}

export default siteConfigService
