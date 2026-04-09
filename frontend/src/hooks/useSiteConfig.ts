import { useEffect, useState } from 'react'
import { siteConfigService } from '@/api/site-config'
import { SOCIAL_FLOWERS_HOMEPAGE } from '@/utils/socialflowersHomepage'
import type { SiteConfig } from '@/types'

type SocialLink = {
  platform: string
  href: string
}

const defaultSocialLinks = SOCIAL_FLOWERS_HOMEPAGE.footer.socialLinks
let cachedSiteConfig: SiteConfig | null = null
let inFlightRequest: Promise<SiteConfig | null> | null = null

const normalizeSocialLinks = (siteConfig: SiteConfig | null): SocialLink[] => {
  const mergedLinks = new Map<string, SocialLink>()

  defaultSocialLinks.forEach((link) => {
    mergedLinks.set(link.platform, { platform: link.platform, href: link.href })
  })

  const siteLinks = siteConfig?.socialLinks
  if (siteLinks && typeof siteLinks === 'object') {
    Object.entries(siteLinks).forEach(([platform, href]) => {
      if (typeof href === 'string' && href.trim()) {
        mergedLinks.set(platform, { platform, href })
      }
    })
  }

  return Array.from(mergedLinks.values())
}

const loadSiteConfig = async (): Promise<SiteConfig | null> => {
  if (!inFlightRequest) {
    inFlightRequest = siteConfigService.get().finally(() => {
      inFlightRequest = null
    })
  }

  cachedSiteConfig = await inFlightRequest
  return cachedSiteConfig
}

export const useSiteConfig = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(cachedSiteConfig)

  useEffect(() => {
    let isMounted = true

    const fetchSiteConfig = async () => {
      const nextConfig = await loadSiteConfig()

      if (isMounted) {
        setSiteConfig(nextConfig)
      }
    }

    fetchSiteConfig().catch(() => {
      if (isMounted) {
        setSiteConfig(null)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    siteConfig,
    socialLinks: normalizeSocialLinks(siteConfig),
  }
}

export default useSiteConfig