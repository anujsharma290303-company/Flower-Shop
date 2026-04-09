/**
 * FlowerMe Society Section
 * Matches the live site block with headline, short description, video, and CTA.
 */

import React from 'react'
import { FLOWERME_SECTION } from '@/utils/constants'
import { SOCIAL_FLOWERS_HOMEPAGE } from '@/utils/socialflowersHomepage'

const FlowerMeSection: React.FC = () => {
  return (
    <section id="flowerme" className="py-14 md:py-16 px-4 md:px-8 bg-[#ececec]">
      <div className="max-w-[900px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold font-serif text-gray-900 mb-6">
          {SOCIAL_FLOWERS_HOMEPAGE.headings.flowerMe}
        </h2>

        <p className="text-[17px] md:text-[18px] text-gray-700 max-w-3xl mx-auto mb-6">
          {SOCIAL_FLOWERS_HOMEPAGE.flowerMe.description.replace('learn more.', '')}{' '}
          <a href={FLOWERME_SECTION.ctaHref} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
            {SOCIAL_FLOWERS_HOMEPAGE.headings.flowerMeLearnMore}
          </a>
        </p>

        <a
          href={FLOWERME_SECTION.videoSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-[430px] mx-auto"
        >
          <div className="relative overflow-hidden border border-gray-300 bg-black">
            <span className="absolute top-2 left-2 z-10 px-2 py-1 text-[11px] tracking-wide bg-black text-white">
              VIDEO
            </span>
            <img
              src={SOCIAL_FLOWERS_HOMEPAGE.flowerMe.thumbnailUrl}
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
