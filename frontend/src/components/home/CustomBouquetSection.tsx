/**
 * Custom Bouquet Section
 * Two custom bouquet options: Sender's Choice and Recipient's Choice
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { CUSTOM_BOUQUET_CARDS } from '@/utils/constants'
import { SOCIAL_FLOWERS_HOMEPAGE } from '@/utils/socialflowersHomepage'
import Button from '@/components/ui/Button'
import { useSiteConfig } from '@/hooks/useSiteConfig'

const CustomBouquetSection: React.FC = () => {
  const { siteConfig } = useSiteConfig()
  const heading = siteConfig?.customBouquetsHeading || SOCIAL_FLOWERS_HOMEPAGE.headings.customBouquets

  const cards = [
    {
      ...CUSTOM_BOUQUET_CARDS[0],
      imageSrc: siteConfig?.recipientsChoiceImage || CUSTOM_BOUQUET_CARDS[0].imageSrc,
    },
    {
      ...CUSTOM_BOUQUET_CARDS[1],
      imageSrc: siteConfig?.sendersChoiceImage || CUSTOM_BOUQUET_CARDS[1].imageSrc,
    },
  ]

  return (
    <section id="custom-bouquets" className="py-14 md:py-16 px-4 md:px-8 bg-white">
      <div className="max-w-245 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-[22px] md:text-[26px] font-medium font-serif text-gray-900 mb-4">
            {heading}
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {cards.map((card) => (
            <div
              key={card.id}
              className="text-center"
            >
              {/* Card Image */}
              <div className="h-55 overflow-hidden flex items-center justify-center">
                <img
                  src={card.imageSrc}
                  alt={card.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Card Content */}
              <div className="pt-4">
                <h3 className="text-[18px] md:text-[20px] font-semibold text-gray-900 mb-3 leading-tight">
                  {card.title}
                </h3>
                <ul className="space-y-2 text-left max-w-[320px] mx-auto mb-7 text-[14px] text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{card.subtitle}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{card.description}</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Link to={card.ctaHref} className="inline-block">
                  <Button
                    label={card.ctaLabel}
                    variant="primary"
                    size="md"
                    className="min-w-30 rounded-none!"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

CustomBouquetSection.displayName = 'CustomBouquetSection'
export default CustomBouquetSection
