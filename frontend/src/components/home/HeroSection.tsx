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
  const heroTitle = SOCIAL_FLOWERS_HOMEPAGE.headings.hero
  const heroSubheadline = SOCIAL_FLOWERS_HOMEPAGE.heroSubheadline
  const heroCtaPrimary = HERO_SECTION.ctaPrimary
  const heroCtaSecondary = HERO_SECTION.ctaSecondary
  const heroImage = HERO_SECTION.imageUrl

  return (
    <section id="hero" className="px-0 bg-[#e8beb9]">
      <div className="max-w-340 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_540px] items-center min-h-85">
          {/* Left Column: Text & CTAs */}
          <div className="text-center px-6 py-10 md:py-12">
            <h1 className="text-[40px] md:text-[50px] font-semibold font-serif text-[#1f2328] leading-tight mb-4">
              {heroTitle}
            </h1>

            <p className="text-[20px] md:text-[24px] text-[#1f2328] leading-relaxed mb-7 max-w-130 mx-auto">
              {heroSubheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/shop">
                <Button
                  label={heroCtaPrimary}
                  variant="primary"
                  size="md"
                  className="rounded-none! min-w-33"
                />
              </Link>

              <Link to="/how-it-works">
                <Button
                  label={heroCtaSecondary}
                  variant="primary"
                  size="md"
                  className="rounded-none! min-w-33"
                />
              </Link>
            </div>

          </div>

          {/* Right Column: Image */}
          <div className="relative h-90 md:h-115 lg:h-130 flex items-end justify-center overflow-hidden">
            <img
              src={heroImage}
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
