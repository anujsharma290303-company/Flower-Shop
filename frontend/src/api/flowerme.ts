import api from './axios'
import type { ApiResponse, FlowerMeProfile, FlowerMePublicProfile } from '@/types'
import { API_ENDPOINTS } from '@/utils/constants'

type UpsertFlowerMePayload = {
  displayName?: string
  tagline?: string | null
  photoUrl?: string | null
  socialLink?: string | null
  followersCount?: number
  tier?: 'society' | 'socialite' | 'royale'
  wishlistNotes?: string | null
  slug?: string
  isActive?: boolean
}

export const flowerMeService = {
  async getMine(): Promise<FlowerMeProfile> {
    const response = await api.get<ApiResponse<FlowerMeProfile>>(API_ENDPOINTS.FLOWERME_PROFILE)
    return response.data.data
  },

  async getBySlug(slug: string): Promise<FlowerMePublicProfile> {
    const response = await api.get<ApiResponse<FlowerMePublicProfile>>(API_ENDPOINTS.FLOWERME_PROFILE_BY_SLUG(slug))
    return response.data.data
  },

  async upsertMine(payload: UpsertFlowerMePayload): Promise<FlowerMeProfile> {
    const response = await api.put<ApiResponse<FlowerMeProfile>>(API_ENDPOINTS.FLOWERME_PROFILE, payload)
    return response.data.data
  },
}

export default flowerMeService
