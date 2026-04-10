/**
 * FlowerMe Society Section
 * Matches the live site block with headline, short description, video, and CTA.
 */

import React from 'react'
import { FLOWERME_SECTION } from '@/utils/constants'
import { SOCIAL_FLOWERS_HOMEPAGE } from '@/utils/socialflowersHomepage'
import { useSiteConfig } from '@/hooks/useSiteConfig'

const FlowerMeSection: React.FC = () => {
  const { siteConfig } = useSiteConfig()
  const flowerMeTitle = siteConfig?.flowerMeTitle || SOCIAL_FLOWERS_HOMEPAGE.headings.flowerMe
  const flowerMeDescription = siteConfig?.flowerMeDescription || SOCIAL_FLOWERS_HOMEPAGE.flowerMe.description
  const flowerMeVideoUrl = siteConfig?.flowerMeVideoUrl || FLOWERME_SECTION.videoSrc
  const flowerMeThumbnailUrl = siteConfig?.flowerMeThumbnailUrl || SOCIAL_FLOWERS_HOMEPAGE.flowerMe.thumbnailUrl

  return (
    <section id="flowerme" className="py-14 md:py-16 px-4 md:px-8 bg-[#ececec]">
      <div className="max-w-225 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold font-serif text-gray-900 mb-6">
          {flowerMeTitle}
        </h2>

        <p className="text-[17px] md:text-[18px] text-gray-700 max-w-3xl mx-auto mb-6">
          {flowerMeDescription.replace('learn more.', '')}{' '}
          <a href={FLOWERME_SECTION.ctaHref} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
            {SOCIAL_FLOWERS_HOMEPAGE.headings.flowerMeLearnMore}
          </a>
        </p>

        <a
          href={flowerMeVideoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-107.5 mx-auto"
        >
          <div className="relative overflow-hidden border border-gray-300 bg-black">
            <span className="absolute top-2 left-2 z-10 px-2 py-1 text-[11px] tracking-wide bg-black text-white">
              VIDEO
            </span>
            <img
              src={flowerMeThumbnailUrl}
              alt="FlowerMe Society video thumbnail"
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
        </a>
      </div>
    </section>
  )
}

FlowerMeSection.displayName = 'FlowerMeSection'
export default FlowerMeSection
