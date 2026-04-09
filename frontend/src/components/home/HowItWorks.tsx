/**
 * How It Works Section
 * Screenshot-style media block with heading and video panel.
 */

import React from 'react'

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-14 md:py-16 px-4 md:px-8 bg-[#efefef]">
      <div className="max-w-[980px] mx-auto">
        <div className="text-center mb-7 md:mb-8">
          <h2 className="text-[22px] md:text-[26px] font-medium font-serif text-gray-900 mb-3">
            How Social Flowers Works
          </h2>
        </div>

        <div className="relative overflow-hidden bg-black border border-[#d5d5d5] shadow-none max-w-[940px] mx-auto">
          <video
            className="w-full h-[300px] md:h-[500px] object-cover bg-black"
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
      </div>
    </section>
  )
}

HowItWorks.displayName = 'HowItWorks'
export default HowItWorks
