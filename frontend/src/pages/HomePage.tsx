/**
 * Home Page
 * Main landing page with all homepage sections
 */

import React from 'react'
import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/home/HeroSection'
import FeaturedCarousel from '@/components/home/FeaturedCarousel'
import HowItWorks from '@/components/home/HowItWorks'
import BenefitsSection from '@/components/home/BenefitsSection'
import CustomBouquetSection from '@/components/home/CustomBouquetSection'
import FlowerMeSection from '@/components/home/FlowerMeSection'

const HomePage: React.FC = () => {
  return (
    <div data-testid="homepage">
      <Layout>
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Products Carousel */}
        <FeaturedCarousel />

        {/* FlowerMe Society Section */}
        <FlowerMeSection />

        {/* Custom Bouquet Section */}
        <CustomBouquetSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Benefits Section */}
        <BenefitsSection />
      </Layout>
    </div>
  )
}

HomePage.displayName = 'HomePage'
export default HomePage