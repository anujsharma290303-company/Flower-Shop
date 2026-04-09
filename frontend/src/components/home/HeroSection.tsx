/**
 * Hero Section Component
 * Large headline, subheading, CTA buttons, and hero image
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { HERO_SECTION } from '@/utils/constants'
import { SOCIAL_FLOWERS_HOMEPAGE } from '@/utils/socialflowersHomepage'
import Button from '@/components/ui/Button'

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="px-0 bg-[#e8beb9]">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_540px] items-center min-h-[340px]">
          {/* Left Column: Text & CTAs */}
          <div className="text-center px-6 py-10 md:py-12">
            <h1 className="text-[40px] md:text-[50px] font-semibold font-serif text-[#1f2328] leading-tight mb-4">
              {SOCIAL_FLOWERS_HOMEPAGE.headings.hero}
            </h1>

            <p className="text-[20px] md:text-[24px] text-[#1f2328] leading-relaxed mb-7 max-w-[520px] mx-auto">
              {SOCIAL_FLOWERS_HOMEPAGE.heroSubheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/shop">
                <Button
                  label={HERO_SECTION.ctaPrimary}
                  variant="primary"
                  size="md"
                  className="!rounded-none min-w-[132px]"
                />
              </Link>

              <Link to="/how-it-works">
                <Button
                  label={HERO_SECTION.ctaSecondary}
                  variant="primary"
                  size="md"
                  className="!rounded-none min-w-[132px]"
                />
              </Link>
            </div>

          </div>

          {/* Right Column: Image */}
          <div className="relative h-[360px] md:h-[460px] lg:h-[520px] flex items-end justify-center overflow-hidden">
            <img
              src={HERO_SECTION.imageUrl}
              alt={HERO_SECTION.imageAlt}
              className="h-[96%] w-auto object-contain"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

HeroSection.displayName = 'HeroSection'
export default HeroSection
