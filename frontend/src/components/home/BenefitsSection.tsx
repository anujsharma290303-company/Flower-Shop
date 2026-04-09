/**
 * Benefits Section
 * 3-column benefits showcase (For Everyone, For Senders, For Recipients)
 */

import React from 'react'
import { BENEFITS } from '@/utils/constants'

const benefitIcons = {
  GiftIcon: 'https://cdn.socialflowers.com/benefits/for_everyone.svg',
  SendIcon: 'https://cdn.socialflowers.com/benefits/for_senders.svg',
  ReceiveIcon: 'https://cdn.socialflowers.com/benefits/for_recipients.svg',
}

const BenefitsSection: React.FC = () => {
  const benefitsArray = Object.values(BENEFITS)

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
    <section id="benefits" className="py-12 md:py-16 px-4 md:px-8 bg-[#f8e8e6]">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-[26px] md:text-[34px] font-medium font-serif text-gray-900">
            The Benefits of the Social Flowers Solution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
          {benefitsArray.map((benefit) => (
            <div
              key={benefit.title}
              className="max-w-[330px] mx-auto text-center"
            >
              <h3 className="text-[20px] md:text-[22px] font-normal text-gray-900 mb-5 md:mb-6">
                {benefit.title}
              </h3>
              <div className="flex justify-center mb-5">
                <img
                  src={benefitIcons[benefit.icon as keyof typeof benefitIcons]}
                  alt={benefit.title}
                  className="w-[120px] h-[120px] md:w-[132px] md:h-[132px] shrink-0"
                  loading="lazy"
                />
              </div>

              <ul className="space-y-4 text-left">
                {benefit.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex gap-2 text-[15px] md:text-[16px] leading-[1.55] text-gray-800">
                    <span className="text-red-600 leading-none mt-[2px]">•</span>
                    <p className="max-w-[275px]">
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
