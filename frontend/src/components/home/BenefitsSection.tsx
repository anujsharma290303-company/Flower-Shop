/**
 * Benefits Section
 * 3-column benefits showcase (For Everyone, For Senders, For Recipients)
 */

import React from 'react'
import { BENEFITS } from '@/utils/constants'
import { useSiteConfig } from '@/hooks/useSiteConfig'

const benefitIcons = {
  GiftIcon: 'https://cdn.socialflowers.com/benefits/for_everyone.svg',
  SendIcon: 'https://cdn.socialflowers.com/benefits/for_senders.svg',
  ReceiveIcon: 'https://cdn.socialflowers.com/benefits/for_recipients.svg',
}

const BenefitsSection: React.FC = () => {
  const { siteConfig } = useSiteConfig()
  const defaultBenefits = Object.values(BENEFITS)

  const benefitsArray = Array.isArray(siteConfig?.benefitsData)
    ? siteConfig.benefitsData
      .slice(0, 3)
      .map((benefit, index) => {
        const fallback = defaultBenefits[index]
        const points = Array.isArray(benefit.points) ? benefit.points.filter((point) => typeof point === 'string' && point.trim().length > 0) : []

        return {
          title: typeof benefit.title === 'string' && benefit.title.trim().length > 0 ? benefit.title : fallback.title,
          icon: typeof benefit.icon === 'string' && benefit.icon.trim().length > 0 ? benefit.icon : fallback.icon,
          points: points.length >= 4 ? points : fallback.points,
        }
      })
    : defaultBenefits

  const normalizedBenefits = benefitsArray.length === 3
    ? benefitsArray
    : defaultBenefits

  const renderPoint = (benefitTitle: string, pointIndex: number, point: string) => {
    const redTextClass = 'text-red-600 border-b border-red-300 pb-[1px]'

    if (benefitTitle === 'For Everyone') {
      if (pointIndex === 0) {
        return <><span className={redTextClass}>Make a meaningful connection</span> through flowers</>
      }

      if (pointIndex === 1) {
        return <>Your <span className={redTextClass}>privacy is our priority</span></>
      }

      if (pointIndex === 2) {
        return <><span className={redTextClass}>We deliver beautiful flowers</span> using the best florists</>
      }

      if (pointIndex === 3) {
        return <><span className={redTextClass}>Earn credits</span> when <span className={redTextClass}>pictures and videos are shared</span></>
      }
    }

    if (benefitTitle === 'For the Sender') {
      if (pointIndex === 0) {
        return <><span className={redTextClass}>Send flowers</span> with any type of <span className={redTextClass}>contact information</span></>
      }

      if (pointIndex === 1) {
        return <>The recipient helps by providing the delivery address and date</>
      }

      if (pointIndex === 2) {
        return <>Only pay if they accept</>
      }

      if (pointIndex === 3) {
        return <>See <span className={redTextClass}>pictures and videos of the recipient</span> with your flowers</>
      }
    }

    if (benefitTitle === 'For the Recipient') {
      if (pointIndex === 0) {
        return <><span className={redTextClass}>Receive and request</span> flowers from anyone safely</>
      }

      if (pointIndex === 1) {
        return <>Choose when and where to receive flowers</>
      }

      if (pointIndex === 2) {
        return <>Deepen your connections and beautify your home</>
      }

      if (pointIndex === 3) {
        return <>Thank the sender by <span className={redTextClass}>sharing photos and videos</span></>
      }
    }

    return point
  }

  return (
    <section id="benefits" className="bg-[#f2ecec] px-4 py-10 md:px-6 md:py-12">
      <div className="mx-auto max-w-245">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="font-serif text-[40px] font-medium leading-tight text-[#1f2328] md:text-[46px]">
            The Benefits of the Social Flowers Solution
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-10">
          {normalizedBenefits.map((benefit) => (
            <div
              key={benefit.title}
              className="mx-auto w-full max-w-82 text-center"
            >
              <h3 className="mb-5 text-[38px] font-normal leading-tight text-[#222831] md:mb-6 md:text-[43px]">
                {benefit.title}
              </h3>
              <div className="mb-6 flex justify-center md:mb-7">
                <img
                  src={benefitIcons[benefit.icon as keyof typeof benefitIcons] || benefitIcons.GiftIcon}
                  alt={benefit.title}
                  className="h-22 w-22 shrink-0 md:h-26 md:w-26"
                  loading="lazy"
                />
              </div>

              <ul className="space-y-3.5 text-left">
                {(Array.isArray(benefit.points) ? benefit.points : []).map((point, pointIndex) => (
                  <li key={pointIndex} className="flex gap-2.5 text-[16px] leading-[1.55] text-[#1f2328] md:text-[17px]">
                    <span className="mt-0.5 leading-none text-[#b40d16]">•</span>
                    <p className="max-w-69">
                      {renderPoint(benefit.title, pointIndex, point)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

BenefitsSection.displayName = 'BenefitsSection'
export default BenefitsSection
