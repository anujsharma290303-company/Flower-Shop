/**
 * How It Works Section
 * Screenshot-style media block with heading and video panel.
 */

import React from 'react'
import { HOW_IT_WORKS_STEPS } from '@/utils/constants'
import { useSiteConfig } from '@/hooks/useSiteConfig'

const HowItWorks: React.FC = () => {
  const { siteConfig } = useSiteConfig()
  const steps = siteConfig?.howItWorks?.length
    ? siteConfig.howItWorks
    : HOW_IT_WORKS_STEPS

  return (
    <section id="how-it-works" className="py-14 md:py-16 px-4 md:px-8 bg-[#efefef]">
      <div className="max-w-245 mx-auto">
        <div className="text-center mb-7 md:mb-8">
          <h2 className="text-[22px] md:text-[26px] font-medium font-serif text-gray-900 mb-3">
            How Social Flowers Works
          </h2>
        </div>

        <div className="relative overflow-hidden bg-black border border-[#d5d5d5] shadow-none max-w-235 mx-auto">
          <video
            className="w-full h-75 md:h-125 object-cover bg-black"
            preload="metadata"
            playsInline
            muted
            autoPlay
            loop
            aria-label="How Social Flowers Works video"
          >
            <source src="/videos/sf-how-it-works-hero-video-2024-final.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-white/75 py-4 text-center">
            <p className="font-serif text-[28px] md:text-[32px] text-gray-900 leading-none">www.SocialFlowers.com</p>
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/85 text-gray-900 flex items-center justify-center text-2xl shadow-sm">
              ►
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-235 mx-auto">
          {steps.slice(0, 3).map((step) => (
            <div key={step.step} className="bg-white border border-gray-200 p-4 text-center">
              <div className="text-[12px] uppercase tracking-[0.12em] text-red-600 font-semibold mb-2">
                Step {step.step}
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-[15px] leading-[1.55] text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

HowItWorks.displayName = 'HowItWorks'
export default HowItWorks
