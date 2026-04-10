import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/layout/Layout'

type DetailSection = {
  title: string
  icons: string[]
  bullets: string[]
}

const DETAIL_SECTIONS: DetailSection[] = [
  {
    title: 'Send Flowers by Email or Text',
    icons: [
      'https://cdn.socialflowers.com/how-it-works/email.svg',
      'https://cdn.socialflowers.com/how-it-works/contact-details.svg',
    ],
    bullets: [
      "Select and pay for your flowers. Provide the recipient's email address and/or mobile number",
      'We email and/or text the recipient to let them know you sent flowers',
      'You also receive a "You\'ve Got Flowers" link that you can send',
      'The recipient chooses where and when to receive the flowers',
      'You are only charged if they accept',
      'We hand-deliver beautiful flowers from our preferred, local florist',
      'All information is kept private',
    ],
  },
  {
    title: 'Send Flowers Through Social Media',
    icons: ['https://cdn.socialflowers.com/how-it-works/chat.svg'],
    bullets: [
      'Select and pay for your flowers. You receive a "You\'ve Got Flowers" link',
      'You send the recipient the link through any social media direct message',
      'They choose where and when to receive the flowers',
      'You are only charged if they accept',
      'We hand-deliver beautiful flowers from our preferred, local florist',
      'All information is kept private',
    ],
  },
  {
    title: 'Send Flowers by Providing the Delivery Address',
    icons: [
      'https://cdn.socialflowers.com/how-it-works/location.svg',
      'https://cdn.socialflowers.com/how-it-works/choose-date.svg',
    ],
    bullets: [
      'Select and pay for your flowers',
      "Use the 'Flower Delivery Address' dropdown to select 'Provided by Me'",
      'Enter the delivery address and choose a date for the flowers to be delivered',
      'We hand-deliver beautiful flowers from our preferred, local florist',
    ],
  },
  {
    title: 'Paying with Cryptocurrency',
    icons: [
      'https://cdn.socialflowers.com/how-it-works/bt_fill.svg',
      'https://cdn.socialflowers.com/how-it-works/bt_phone_fill.svg',
    ],
    bullets: [
      'Select your flowers',
      "Under Billing Information select 'Pay with Cryptocurrency'",
      "Click the 'Pay by Crypto' button",
      'Select your wallet connection or scan your wallet address',
      'Pay with your favorite cryptocurrency',
      'Learn more about paying with crypto',
    ],
  },
  {
    title: 'Receive Flowers That Were Sent to You',
    icons: [
      'https://cdn.socialflowers.com/how-it-works/women.svg',
      'https://cdn.socialflowers.com/how-it-works/location.svg',
      'https://cdn.socialflowers.com/how-it-works/choose-date.svg',
    ],
    bullets: [
      "Click the 'You've Got Flowers' link you received",
      'Choose where and when to receive the flowers',
      'All information is kept private',
      'We hand-deliver beautiful flowers from our preferred, local florist',
    ],
  },
  {
    title: 'Request Flowers Through Social Media',
    icons: [
      'https://cdn.socialflowers.com/how-it-works/bouquet-flowers.svg',
      'https://cdn.socialflowers.com/how-it-works/got-flowers.svg',
    ],
    bullets: [
      'Tell your followers you want to receive flowers and link to our website',
      'They visit Social Flowers and select a bouquet',
      "They receive a 'You've Got Flowers' link and send it to you through a social media direct message",
      'Click the link and choose where and when to receive the flowers',
      'All information is kept private',
      'We hand-deliver beautiful flowers from our preferred, local florist',
    ],
  },
]

const HowItWorksPage: React.FC = () => {
  return (
    <Layout>
      <section className="py-10 md:py-12 px-4 md:px-8 bg-[#f4eceb] border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center text-[34px] md:text-[42px] font-medium font-serif text-[#2b2f36] mb-10 md:mb-12">
            How Social Flowers Works
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_90px_1fr] gap-4 md:gap-0 items-center">
            <div className="text-center space-y-8">
              <div>
                <p className="text-[22px] leading-snug text-[#2f3440]">
                  <span className="text-[#c42126]">Choose a fresh bouquet</span> at SocialFlowers.com
                </p>
                <img src="https://cdn.socialflowers.com/how-it-works/bouquet-flowers.svg" alt="Bouquet" className="h-22 w-22 mx-auto mt-4" loading="lazy" />
              </div>

              <div>
                <p className="text-[22px] leading-snug text-[#2f3440]">
                  Recipient uses the link to choose where and when to <span className="text-[#c42126]">receive flowers</span>
                </p>
                <div className="flex justify-center items-center gap-3 mt-4">
                  <img src="https://cdn.socialflowers.com/how-it-works/location.svg" alt="Location" className="h-18 w-18" loading="lazy" />
                  <img src="https://cdn.socialflowers.com/how-it-works/choose-date.svg" alt="Date" className="h-18 w-18" loading="lazy" />
                </div>
              </div>

              <div>
                <p className="text-[22px] leading-snug text-[#2f3440]">All information is kept <span className="text-[#c42126]">private and secure</span></p>
                <div className="flex justify-center items-center gap-3 mt-4">
                  <img src="https://cdn.socialflowers.com/how-it-works/shield.svg" alt="Private" className="h-18 w-18" loading="lazy" />
                  <img src="https://cdn.socialflowers.com/how-it-works/secure.svg" alt="Secure" className="h-18 w-18" loading="lazy" />
                </div>
              </div>

              <div>
                <p className="text-[22px] leading-snug text-[#2f3440]">
                  Recipient <span className="text-[#c42126]">shares a photo or video</span> and <span className="text-[#c42126]">earns credits</span> for both of you
                </p>
                <div className="flex justify-center items-center gap-3 mt-4">
                  <img src="https://cdn.socialflowers.com/how-it-works/women.svg" alt="Recipient" className="h-16 w-16" loading="lazy" />
                  <img src="https://cdn.socialflowers.com/how-it-works/share-experience.svg" alt="Photo" className="h-16 w-16" loading="lazy" />
                  <img src="https://cdn.socialflowers.com/how-it-works/video.svg" alt="Video" className="h-16 w-16" loading="lazy" />
                  <img src="https://cdn.socialflowers.com/how-it-works/hands_coin.svg" alt="Credits" className="h-16 w-16" loading="lazy" />
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center justify-between h-full text-[#ff7f87] text-5xl font-bold">
              <span>→</span>
              <span>←</span>
              <span>→</span>
              <span>←</span>
            </div>

            <div className="text-center space-y-8">
              <div>
                <p className="text-[22px] leading-snug text-[#2f3440]">
                  Provide the recipient's <span className="text-[#c42126]">email</span>, <span className="text-[#c42126]">mobile</span> or use a <span className="text-[#c42126]">social media</span> connection *
                </p>
                <div className="flex justify-center items-center gap-3 mt-4">
                  <img src="https://cdn.socialflowers.com/how-it-works/email.svg" alt="Email" className="h-16 w-16" loading="lazy" />
                  <img src="https://cdn.socialflowers.com/how-it-works/contact-details.svg" alt="Mobile" className="h-16 w-16" loading="lazy" />
                  <img src="https://cdn.socialflowers.com/how-it-works/chat.svg" alt="Social" className="h-16 w-16" loading="lazy" />
                </div>
              </div>

              <div>
                <p className="text-[22px] leading-snug text-[#2f3440]">We email or text them a "You've Got Flowers!" link OR you send it via social media</p>
                <div className="flex justify-center items-center gap-3 mt-4">
                  <img src="https://cdn.socialflowers.com/how-it-works/got-flowers.svg" alt="Send" className="h-16 w-16" loading="lazy" />
                  <img src="https://cdn.socialflowers.com/how-it-works/link.svg" alt="Link" className="h-16 w-16" loading="lazy" />
                </div>
              </div>

              <div>
                <p className="text-[22px] leading-snug text-[#2f3440]">You are only charged when the recipient accepts your flowers</p>
                <img src="https://cdn.socialflowers.com/how-it-works/charged-card.svg" alt="Charged" className="h-18 w-18 mx-auto mt-4" loading="lazy" />
              </div>

              <div>
                <p className="text-[22px] leading-snug text-[#2f3440]">Your flowers are hand-delivered by our <span className="text-[#c42126]">local florist partner</span></p>
                <div className="flex justify-center items-center gap-3 mt-4">
                  <img src="https://cdn.socialflowers.com/how-it-works/local-florist.svg" alt="Florist" className="h-16 w-16" loading="lazy" />
                  <img src="https://cdn.socialflowers.com/how-it-works/truck.svg" alt="Truck" className="h-16 w-16" loading="lazy" />
                  <img src="https://cdn.socialflowers.com/how-it-works/man.svg" alt="Delivery" className="h-16 w-16" loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e6b7ba] mt-10 pt-6 text-center text-[34px] text-[#2f3440]">
            <p className="text-[28px] md:text-[30px]">* You can <span className="text-[#c42126]">provide the delivery address</span> if you have it</p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto border-t border-gray-200 pt-8">
          <h2 className="text-center text-[40px] md:text-[44px] font-serif text-[#2f3440] mb-4">Flower Delivery With Privacy and Safety</h2>
          <p className="text-center text-[22px] text-gray-600 mb-7">Both sender and recipient information is always kept private, letting you send and receive flowers safely and securely.</p>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_140px] items-center gap-5">
            <div className="flex justify-center"><img src="https://cdn.socialflowers.com/how-it-works/shield.svg" alt="Private" className="h-20 w-20" loading="lazy" /></div>
            <ul className="space-y-2 text-[18px] text-gray-700">
              <li className="flex gap-2"><span className="text-[#c42126]">•</span><span>Your address and personal details are not shared</span></li>
              <li className="flex gap-2"><span className="text-[#c42126]">•</span><span>Sender and recipient choose their name on the order</span></li>
              <li className="flex gap-2"><span className="text-[#c42126]">•</span><span>Your address is only used to deliver flowers</span></li>
              <li className="flex gap-2"><span className="text-[#c42126]">•</span><span>More about <span className="text-[#c42126]">anonymous flower delivery</span></span></li>
            </ul>
            <div className="flex justify-center"><img src="https://cdn.socialflowers.com/how-it-works/secure.svg" alt="Secure" className="h-20 w-20" loading="lazy" /></div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-14 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto border-t border-gray-200 pt-8">
          <h2 className="text-center text-[42px] md:text-[46px] font-serif text-[#2f3440] mb-6">HOW TO:</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[22px] text-[#424a57]">
            <div>
              <h3 className="font-semibold mb-3">Send Flowers By:</h3>
              <ul className="space-y-1.5">
                <li className="text-[#c42126]">• Email, Text</li>
                <li className="text-[#c42126]">• Social Media</li>
                <li className="text-[#c42126]">• Providing the Delivery Address</li>
                <li className="text-[#c42126]">• Paying with Cryptocurrency</li>
              </ul>
            </div>
            <div className="space-y-4 md:pl-8">
              <p><span className="text-[#c42126] font-semibold">Receive flowers</span> that were sent to you</p>
              <p><span className="text-[#c42126] font-semibold">Request flowers</span> through social media</p>
              <p><span className="text-[#c42126] font-semibold">Share a photo or video</span> of your flowers, earn credits</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          {DETAIL_SECTIONS.map((section) => (
            <article key={section.title} className="border-t border-gray-200 pt-8">
              <h3 className="text-center text-[42px] md:text-[44px] font-serif text-[#424a57] mb-4">{section.title}</h3>
              <div className="flex justify-center items-center gap-4 mb-4">
                {section.icons.map((icon) => (
                  <img key={icon} src={icon} alt="Section icon" className="h-18 w-18" loading="lazy" />
                ))}
              </div>
              <ul className="max-w-4xl mx-auto space-y-1.5 text-[18px] text-gray-700 leading-relaxed">
                {section.bullets.map((point) => (
                  <li key={point} className="flex gap-2"><span className="text-[#c42126]">•</span><span>{point}</span></li>
                ))}
              </ul>
            </article>
          ))}

          <article className="border-t border-gray-200 pt-8">
            <h3 className="text-center text-[42px] md:text-[44px] font-serif text-[#424a57] mb-3">Share Your Flowers and Earn Credits</h3>
            <p className="text-center text-[20px] text-gray-700 max-w-4xl mx-auto mb-4">
              Share a photo or video of your bouquet and we will give you and the sender credits towards your next order. Choose the way you want to share:
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <img src="https://cdn.socialflowers.com/how-it-works/share-experience.svg" alt="Photo" className="h-16 w-16" loading="lazy" />
              <img src="https://cdn.socialflowers.com/how-it-works/video.svg" alt="Video" className="h-16 w-16" loading="lazy" />
              <img src="https://cdn.socialflowers.com/how-it-works/hands_coin.svg" alt="Credits" className="h-16 w-16" loading="lazy" />
            </div>

            <h4 className="text-[34px] font-serif text-[#424a57] mb-2">Share on Social Media</h4>
            <ul className="space-y-1.5 text-[18px] text-gray-700 mb-4">
              <li className="flex gap-2"><span className="text-[#c42126]">•</span><span>Show everyone your flowers by sharing online</span></li>
              <li className="flex gap-2"><span className="text-[#c42126]">•</span><span>Earn up to $50 in credits</span></li>
              <li className="flex gap-2"><span className="text-[#c42126]">•</span><span>Please tag us so we can apply credits and share your post</span></li>
            </ul>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border border-gray-300 text-[18px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3">Credits Earned for Both Sender and Recipient</th>
                    <th className="border border-gray-300 p-3">What is Shared on Social Media</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center">$30</td>
                    <td className="border border-gray-300 p-3">A picture or video of your flowers</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center">$40</td>
                    <td className="border border-gray-300 p-3">A picture of you and your flowers</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center">$50</td>
                    <td className="border border-gray-300 p-3">A video of you and your flowers</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-[34px] font-serif text-[#424a57] mb-2">Share With Sender</h4>
            <ul className="space-y-1.5 text-[18px] text-gray-700 mb-4">
              <li className="flex gap-2"><span className="text-[#c42126]">•</span><span>Recipient shares photos and videos with the sender and optionally, with Social Flowers</span></li>
              <li className="flex gap-2"><span className="text-[#c42126]">•</span><span>Earn up to $20 in credits</span></li>
              <li className="flex gap-2"><span className="text-[#c42126]">•</span><span>Recipient receives a link to share photos and videos</span></li>
            </ul>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-[18px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3">Credits Earned for Both Sender and Recipient</th>
                    <th className="border border-gray-300 p-3">What is Shared</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center">$10</td>
                    <td className="border border-gray-300 p-3">A picture or video of the flowers with the sender</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center">$20</td>
                    <td className="border border-gray-300 p-3">A picture or video of the flowers with sender and Social Flowers for promotional use</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <div className="text-center py-6">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white text-[16px] font-semibold hover:bg-red-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

HowItWorksPage.displayName = 'HowItWorksPage'
export default HowItWorksPage
