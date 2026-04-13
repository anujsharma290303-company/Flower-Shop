/**
 * How It Works Section
 * Screenshot-style media block with heading and video panel.
 */

import React, { useRef, useState } from 'react'
import { HOW_IT_WORKS_STEPS } from '@/utils/constants'
import { useSiteConfig } from '@/hooks/useSiteConfig'

const HowItWorks: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const { siteConfig } = useSiteConfig()
  const steps = siteConfig?.howItWorks?.length
    ? siteConfig.howItWorks
    : HOW_IT_WORKS_STEPS

  const handleManualPlay = async () => {
    if (!videoRef.current) return
    try {
      await videoRef.current.play()
      setHasStarted(true)
    } catch {
      // Ignore play interruption if browser blocks the request.
    }
  }

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
            ref={videoRef}
            className="w-full h-75 md:h-125 object-cover bg-black"
            preload="metadata"
            playsInline
            controls
            onPlay={() => setHasStarted(true)}
            aria-label="How Social Flowers Works video"
          >
            <source src="/videos/sf-how-it-works-hero-video-2024-final.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {!hasStarted && (
            <>
              <div className="pointer-events-none absolute inset-x-0 bottom-14 bg-white/80 py-4 text-center">
                <p className="font-serif text-[26px] md:text-[48px] text-gray-900 leading-none px-3">
                  Make a connection to remember with Social Flowers
                </p>
              </div>
              <button
                type="button"
                onClick={handleManualPlay}
                aria-label="Play how it works video"
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="w-24 h-24 rounded-full bg-white text-gray-900 flex items-center justify-center text-[44px] pl-1 shadow-md transition-transform duration-150 hover:scale-105">
                  ▶
                </span>
              </button>
            </>
          )}
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
