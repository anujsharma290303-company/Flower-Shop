import { useEffect, useState } from 'react'
import { authService } from '@/api/auth'
import { LOCAL_STORAGE_KEYS } from '@/utils/constants'
import type { CustomerProfile } from '@/types'

let cachedProfile: CustomerProfile | null = null
let inFlightProfileRequest: Promise<CustomerProfile | null> | null = null

const readStoredProfile = (): CustomerProfile | null => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.USER)
  if (!raw) return null

  try {
    return JSON.parse(raw) as CustomerProfile
  } catch {
    return null
  }
}

const loadProfile = async (): Promise<CustomerProfile | null> => {
  if (!authService.isLoggedIn()) {
    cachedProfile = null
    return null
  }

  if (!inFlightProfileRequest) {
    inFlightProfileRequest = authService
      .getMe()
      .then((profile) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(profile))
        cachedProfile = profile
        return profile
      })
      .catch(() => {
        authService.clearSession()
        cachedProfile = null
        return null
      })
      .finally(() => {
        inFlightProfileRequest = null
      })
  }

  return inFlightProfileRequest
}

export const useCustomerAuth = () => {
  const [profile, setProfile] = useState<CustomerProfile | null>(cachedProfile ?? readStoredProfile())
  const [isLoading, setIsLoading] = useState(authService.isLoggedIn())

  useEffect(() => {
    let isMounted = true

    if (!authService.isLoggedIn()) {
      return
    }

    loadProfile()
      .then((nextProfile) => {
        if (isMounted) {
          setProfile(nextProfile)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    profile,
    isLoading,
    isAuthenticated: Boolean(profile) && authService.isLoggedIn(),
    refreshProfile: async () => {
      const nextProfile = await loadProfile()
      setProfile(nextProfile)
      return nextProfile
    },
  }
}

export default useCustomerAuth
