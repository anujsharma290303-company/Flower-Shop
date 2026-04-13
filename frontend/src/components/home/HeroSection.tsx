/**
 * Hero Section Component
 * Large headline, subheading, CTA buttons, and hero image
 */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HERO_SECTION } from '@/utils/constants'
import { SOCIAL_FLOWERS_HOMEPAGE } from '@/utils/socialflowersHomepage'
import Button from '@/components/ui/Button'
import { useSiteConfig } from '@/hooks/useSiteConfig'

const HeroSection: React.FC = () => {
  const { siteConfig } = useSiteConfig()
  const rawHeroTitle = (siteConfig?.heroTitle || '').trim()
  const isPlaceholderHeroTitle = /^(pass\d*\s*hero\b|test\b)/i.test(rawHeroTitle)
  const heroTitle = rawHeroTitle && !isPlaceholderHeroTitle
    ? rawHeroTitle
    : SOCIAL_FLOWERS_HOMEPAGE.headings.hero
  const heroSubheadline = siteConfig?.heroSubTitle || SOCIAL_FLOWERS_HOMEPAGE.heroSubheadline
  const heroCtaPrimary = siteConfig?.heroCTA1 || HERO_SECTION.ctaPrimary
  const heroCtaSecondary = siteConfig?.heroCTA2 || HERO_SECTION.ctaSecondary
  const heroImage = siteConfig?.heroImage || HERO_SECTION.imageUrl
  const [heroImageSrc, setHeroImageSrc] = useState(heroImage)

  useEffect(() => {
    setHeroImageSrc(heroImage)
  }, [heroImage])

  const handleHeroImageError = () => {
    if (heroImageSrc !== SOCIAL_FLOWERS_HOMEPAGE.heroImage) {
      setHeroImageSrc(SOCIAL_FLOWERS_HOMEPAGE.heroImage)
      return
    }

    setHeroImageSrc('')
  }

  return (
    <section id="hero" className="px-0 bg-[#e8beb9]">
      <div className="max-w-340 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_540px] items-center min-h-75 md:min-h-85">
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
              <Link to="/best-sellers">
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
          <div className="relative h-80 md:h-110 lg:h-120 flex items-end justify-center overflow-hidden">
            {heroImageSrc ? (
              <img
                src={heroImageSrc}
                alt={HERO_SECTION.imageAlt}
                className="h-[96%] w-auto object-contain"
                loading="eager"
                onError={handleHeroImageError}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-b from-[#eac6c2] to-[#e2b3ad]" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

HeroSection.displayName = 'HeroSection'
export default HeroSection
