import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/layout/Layout'

type Section = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

type PageContent = {
  eyebrow?: string
  title: string
  intro: string
  heroImage?: {
    src: string
    alt: string
  }
  sections: Section[]
  cta?: {
    label: string
    to: string
  }
}

const PAGE_CONTENT: Record<string, PageContent> = {
  privacy: {
    eyebrow: 'Company',
    title: 'Privacy',
    intro: 'Your privacy is central to the way Social Flowers works. Recipient details are only used to complete delivery and keep the process private.',
    heroImage: {
      src: 'https://cdn.socialflowers.com/how-it-works/shield.svg',
      alt: 'Privacy shield icon',
    },
    sections: [
      {
        heading: 'How we use information',
        paragraphs: [
          'We collect the minimum information needed to process orders, deliver flowers, and let the recipient accept or decline the bouquet.',
          'Sender and recipient information is not sold and is only shared with partners involved in fulfilling the order.',
        ],
        bullets: [
          'Contact details are used for delivery and order communication only.',
          'Recipient choice data stays attached to the private acceptance flow.',
          'Support requests may reference order data so we can resolve issues quickly.',
        ],
      },
      {
        heading: 'Privacy by design',
        paragraphs: [
          'The Social Flowers model is built around privacy-first flower delivery. That means the sender can stay discreet and the recipient can decide where delivery should happen.',
        ],
        bullets: [
          'Email, text, and social links are used instead of public posting.',
          'Delivery information is revealed only when it is required for fulfillment.',
          'Recipient privacy choices can be updated from the acceptance link.',
        ],
      },
    ],
    cta: {
      label: 'How It Works',
      to: '/how-it-works',
    },
  },
  'customer-service': {
    eyebrow: 'Company',
    title: 'Customer Service Policy',
    intro: 'We keep support practical: orders should be simple to place, simple to update, and simple to track.',
    sections: [
      {
        heading: 'Order support',
        paragraphs: [
          'If a delivery detail needs to change before fulfillment, our team works to help as long as the order has not moved too far into processing.',
          'We use the order id, recipient link, and contact email to verify requests quickly.',
        ],
        bullets: [
          'Review the acceptance link if a recipient needs to update delivery details.',
          'Use the tracking page to confirm order status.',
          'Reach out early if you need to correct the delivery information.',
        ],
      },
      {
        heading: 'Delivery expectations',
        paragraphs: [
          'Flower delivery timing depends on florist availability, the destination, and the bouquet selected.',
          'When a product needs a substitution, we aim to preserve the color palette, value, and overall style as closely as possible.',
        ],
        bullets: [
          'Same-day or next-day timing depends on location.',
          'Local florist inventory can affect exact stem selection.',
          'We keep the customer informed when fulfillment details change.',
        ],
      },
    ],
    cta: {
      label: 'Track Order',
      to: '/track-order',
    },
  },
  'local-florist-delivery': {
    eyebrow: 'Company',
    title: 'Local Florist Delivery',
    intro: 'Social Flowers partners with local florists so arrangements are made fresh and delivered with care near the destination.',
    heroImage: {
      src: 'https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/florist-at-shop.jpg',
      alt: 'Florist preparing flowers',
    },
    sections: [
      {
        heading: 'Why local delivery matters',
        paragraphs: [
          'Working with nearby florists helps reduce transit time, keeps flowers fresher, and gives each order a more personal hand-delivery feel.',
        ],
        bullets: [
          'Bouquets are arranged by florist partners close to the recipient.',
          'Delivery windows depend on local availability and route planning.',
          'Freshness and presentation stay at the center of the experience.',
        ],
      },
      {
        heading: 'Nationwide reach',
        paragraphs: [
          'The network covers many U.S. destinations and continues to grow as new florist partners are added.',
          'If you already know the destination, you can provide it directly at checkout; otherwise the private recipient link can handle the rest.',
        ],
        bullets: [
          'Use the recipient flow when you do not know the exact address.',
          'Use checkout directly when you already have the delivery address.',
          'Local florists handle the final handoff to the recipient.',
        ],
      },
    ],
    cta: {
      label: 'Browse Flowers',
      to: '/shop',
    },
  },
  terms: {
    eyebrow: 'Company',
    title: 'Terms of Service',
    intro: 'These terms summarize the expectations for using the Social Flowers website and placing an order.',
    sections: [
      {
        heading: 'Using the site',
        paragraphs: [
          'By placing an order or using recipient links, you agree to provide accurate information and to follow the instructions shown during checkout.',
        ],
        bullets: [
          'Accounts should use accurate contact details.',
          'Orders are subject to product and delivery availability.',
          'Content and pricing may change without notice.',
        ],
      },
      {
        heading: 'Payments and delivery',
        paragraphs: [
          'Charges, authorizations, and final delivery timing depend on the order path you choose.',
          'We reserve the right to cancel or adjust orders when required by supply, availability, or fraud prevention rules.',
        ],
        bullets: [
          'Payment methods are shown during checkout.',
          'Recipient acceptance can be required before final delivery.',
          'Substitutions may be made when necessary to complete an order.',
        ],
      },
    ],
    cta: {
      label: 'Contact Us',
      to: '/contact',
    },
  },
  date: {
    eyebrow: 'Use Case',
    title: 'Dating',
    intro: 'Send flowers for a first date, anniversary, or romantic surprise without needing a full address up front.',
    sections: [
      {
        heading: 'Why it works for dating',
        paragraphs: [
          'The private recipient link lets you keep the surprise intact while still getting flowers delivered to the right place at the right time.',
        ],
        bullets: [
          'Use email, text, or social link delivery.',
          'Keep your address book out of the equation.',
          'Let the recipient choose the safest delivery option.',
        ],
      },
    ],
    cta: { label: 'Shop Romance Flowers', to: '/romance-flowers' },
  },
  'social-media': {
    eyebrow: 'Use Case',
    title: 'Social Media',
    intro: 'Turn social connections into real deliveries by sharing a private flower link through direct message.',
    sections: [
      {
        heading: 'Private sharing',
        paragraphs: [
          'The recipient receives a link they can use privately, which means you can send flowers through social platforms without posting publicly.',
        ],
        bullets: [
          'Best for direct messages and private chats.',
          'Keeps address details off the public timeline.',
          'Works with the same order flow as email and text.',
        ],
      },
    ],
    cta: { label: 'Browse Flowers', to: '/shop' },
  },
  'social-media-facebook': {
    eyebrow: 'Use Case',
    title: 'Facebook',
    intro: 'Send flowers through Facebook Messenger with the same private acceptance flow.',
    sections: [
      {
        heading: 'Messenger-friendly delivery',
        paragraphs: [
          'You can share the flower link directly in Messenger so the recipient can choose where and when to receive the bouquet.',
        ],
        bullets: ['Private link sharing', 'No public post required', 'Flexible delivery details'],
      },
    ],
    cta: { label: 'Start Shopping', to: '/shop' },
  },
  'social-media-instagram': {
    eyebrow: 'Use Case',
    title: 'Instagram',
    intro: 'Use Instagram direct messages when you want flowers to feel personal without asking for an address first.',
    sections: [
      {
        heading: 'Direct message gifting',
        paragraphs: ['Share the private acceptance link in DMs and let the recipient complete the delivery details on their own time.'],
      },
    ],
    cta: { label: 'Browse Best Sellers', to: '/best-sellers' },
  },
  'social-media-onlyfans': {
    eyebrow: 'Use Case',
    title: 'OnlyFans',
    intro: 'Use the same private flower workflow for creator communities and other subscription audiences.',
    sections: [
      {
        heading: 'Private gifting flow',
        paragraphs: ['Share a private link, keep the address hidden, and let the recipient control where delivery happens.'],
      },
    ],
    cta: { label: 'Create a Bouquet', to: '/create-a-bouquet' },
  },
  wishlist: {
    eyebrow: 'Use Case',
    title: 'Wishlists',
    intro: 'Let people know what kind of flowers you want and make it easy for supporters to send them.',
    sections: [
      {
        heading: 'Set expectations',
        paragraphs: ['A wishlist is a simple way to guide bouquet style, color, or occasion without sharing a public address.'],
      },
    ],
    cta: { label: 'Create a Bouquet', to: '/create-a-bouquet?type=recipient' },
  },
  work: {
    eyebrow: 'Use Case',
    title: 'In the Workplace',
    intro: 'Send flowers to an office, workplace lobby, or team member without needing to reveal private home details.',
    sections: [
      {
        heading: 'Office-friendly delivery',
        paragraphs: ['Use the recipient link or enter the office address directly if you already have it.'],
        bullets: ['Great for celebrations', 'Great for team recognition', 'Great for thank-you gifts'],
      },
    ],
    cta: { label: 'Shop Thank You Flowers', to: '/thank-you-flowers' },
  },
  hospital: {
    eyebrow: 'Use Case',
    title: 'To a Hospital',
    intro: 'Send a recovery bouquet while keeping the recipient\'s privacy and delivery preferences in mind.',
    sections: [
      {
        heading: 'Helpful for recovery',
        paragraphs: ['The recipient can choose the right delivery location and timing so the gift arrives when it can be received properly.'],
      },
    ],
    cta: { label: 'Shop Get Well Flowers', to: '/get-well-flowers' },
  },
  'funeral-home': {
    eyebrow: 'Use Case',
    title: 'To a Funeral Home',
    intro: 'Offer condolences with a private flower delivery that keeps the process respectful and thoughtful.',
    sections: [
      {
        heading: 'Respectful timing',
        paragraphs: ['Choose a sympathy arrangement and coordinate delivery in a way that matches the service schedule.'],
      },
    ],
    cta: { label: 'Shop Sympathy Flowers', to: '/sympathy-flowers' },
  },
  hotel: {
    eyebrow: 'Use Case',
    title: 'To a Hotel',
    intro: 'Deliver flowers to a hotel stay, celebration, or special visit without extra back-and-forth.',
    sections: [
      {
        heading: 'Guest-friendly delivery',
        paragraphs: ['Useful for trips, events, and surprise room deliveries when the recipient is staying away from home.'],
      },
    ],
    cta: { label: 'Shop Birthday Flowers', to: '/birthday-flowers' },
  },
  sorry: {
    eyebrow: 'Use Case',
    title: 'Saying Sorry',
    intro: 'When words are not enough, flowers can make the apology feel more personal and sincere.',
    sections: [
      {
        heading: 'Make the message clear',
        paragraphs: ['Choose a bouquet that matches the tone of the apology and include a note if needed.'],
      },
    ],
    cta: { label: 'Shop Apology Flowers', to: '/sorry-flowers' },
  },
  companion: {
    eyebrow: 'Use Case',
    title: 'To a Companion',
    intro: 'Send flowers to a partner, friend, or companion in a way that feels thoughtful and private.',
    sections: [
      {
        heading: 'Personal and private',
        paragraphs: ['Use the recipient link to keep delivery choices flexible and discreet.'],
      },
    ],
    cta: { label: 'Shop Romance Flowers', to: '/romance-flowers' },
  },
  overseas: {
    eyebrow: 'Use Case',
    title: 'From Overseas',
    intro: 'Send flowers from abroad to a recipient in the United States without needing to manage the delivery details yourself.',
    sections: [
      {
        heading: 'Cross-border convenience',
        paragraphs: ['The recipient link lets someone in another country initiate a delivery into the U.S. network without a local address book.'],
      },
    ],
    cta: { label: 'Browse Flowers', to: '/shop' },
  },
  crypto: {
    eyebrow: 'Use Case',
    title: 'Pay With Crypto',
    intro: 'Use a payment flow that supports cryptocurrency when that is your preferred checkout method.',
    sections: [
      {
        heading: 'Modern checkout option',
        paragraphs: ['Select the crypto option during billing, follow the payment instructions, and complete the order as shown.'],
      },
    ],
    cta: { label: 'Start Shopping', to: '/shop' },
  },
  anonymously: {
    eyebrow: 'Use Case',
    title: 'Anonymous Flower Delivery',
    intro: 'Keep the sender identity private while still making the gift feel intentional and warm.',
    sections: [
      {
        heading: 'Stay discreet',
        paragraphs: ['Choose a display name that fits the occasion and let the recipient accept the flowers privately.'],
      },
    ],
    cta: { label: 'Browse Flowers', to: '/shop' },
  },
  romance: {
    eyebrow: 'Shop',
    title: 'Love & Romance',
    intro: 'Romantic bouquets for anniversaries, dates, and just because moments.',
    sections: [
      {
        heading: 'Popular for romance',
        paragraphs: ['These bouquets focus on warm colors, classic stems, and gifts that feel personal.'],
        bullets: ['Red roses', 'Soft pink bouquets', 'Luxury arrangements'],
      },
    ],
    cta: { label: 'Shop Roses', to: '/shop/roses' },
  },
  roses: {
    eyebrow: 'Shop',
    title: 'Roses',
    intro: 'Classic rose arrangements for love, appreciation, and elegant gifting.',
    sections: [
      {
        heading: 'Rose favorites',
        paragraphs: ['From single-color bouquets to mixed arrangements, roses remain the most recognizable gift flower.'],
      },
    ],
    cta: { label: 'Shop Best Sellers', to: '/best-sellers' },
  },
  'high-end': {
    eyebrow: 'Shop',
    title: 'High End Flowers',
    intro: 'Premium arrangements with a polished look and a more elevated presentation.',
    sections: [
      {
        heading: 'Luxury presentation',
        paragraphs: ['These bouquets lean into fuller designs, premium stems, and a more sophisticated feel.'],
      },
    ],
    cta: { label: 'Shop the Catalog', to: '/shop' },
  },
  everyday: {
    eyebrow: 'Shop',
    title: 'Just Because',
    intro: 'Bright, everyday flowers for spontaneous moments and casual surprises.',
    sections: [
      {
        heading: 'Easy to send',
        paragraphs: ['These arrangements are designed for no-reason-needed gifting.'],
      },
    ],
    cta: { label: 'Browse Flowers', to: '/shop' },
  },
  'get-well': {
    eyebrow: 'Shop',
    title: 'Get Well Flowers',
    intro: 'Comforting bouquets that are well suited for recovery, encouragement, and care.',
    sections: [
      {
        heading: 'Supportive gifts',
        paragraphs: ['Choose softer tones and uplifting arrangements for a get-well message.'],
      },
    ],
    cta: { label: 'Shop Get Well Flowers', to: '/get-well-flowers' },
  },
  birthday: {
    eyebrow: 'Shop',
    title: 'Birthday Flowers',
    intro: 'Festive bouquets that feel celebratory and easy to personalize.',
    sections: [
      {
        heading: 'Celebrate the day',
        paragraphs: ['Birthday bouquets work well when you want a colorful, cheerful arrangement.'],
      },
    ],
    cta: { label: 'Shop Birthday Flowers', to: '/birthday-flowers' },
  },
  'new-baby': {
    eyebrow: 'Shop',
    title: 'New Baby Flowers',
    intro: 'Soft and welcoming arrangements for new parents and growing families.',
    sections: [
      {
        heading: 'Gentle and bright',
        paragraphs: ['These bouquets are well suited for hospital rooms, home visits, and celebration gifts.'],
      },
    ],
    cta: { label: 'Shop the Catalog', to: '/shop' },
  },
  'thank-you': {
    eyebrow: 'Shop',
    title: 'Thank You Flowers',
    intro: 'Show appreciation with a bouquet that feels thoughtful and polished.',
    sections: [
      {
        heading: 'A simple thank-you',
        paragraphs: ['Flowers are a straightforward way to say thanks after help, support, or a special gesture.'],
      },
    ],
    cta: { label: 'Shop Thank You Flowers', to: '/thank-you-flowers' },
  },
  'sorry-flowers': {
    eyebrow: 'Shop',
    title: 'I\'m Sorry Flowers',
    intro: 'Apology flowers with a softer tone and a more personal feel.',
    sections: [
      {
        heading: 'Make amends gracefully',
        paragraphs: ['Choose a bouquet that feels sincere and keeps the message direct.'],
      },
    ],
    cta: { label: 'Shop Apology Flowers', to: '/sorry-flowers' },
  },
  sympathy: {
    eyebrow: 'Shop',
    title: 'Sympathy Flowers',
    intro: 'Respectful floral arrangements for memorials, services, and condolences.',
    sections: [
      {
        heading: 'Thoughtful tributes',
        paragraphs: ['These arrangements help express support while keeping the tone dignified and calm.'],
      },
    ],
    cta: { label: 'Shop Sympathy Flowers', to: '/sympathy-flowers' },
  },
  plants: {
    eyebrow: 'Shop',
    title: 'Plants',
    intro: 'Longer-lasting plant gifts for desks, homes, and quieter celebrations.',
    sections: [
      {
        heading: 'Longer lasting gifts',
        paragraphs: ['Plants are a great alternative when you want something that stays around after the occasion.'],
      },
    ],
    cta: { label: 'Browse Flowers', to: '/shop' },
  },
}

interface StaticContentPageProps {
  pageId: string
}

const StaticContentPage: React.FC<StaticContentPageProps> = ({ pageId }) => {
  const content = PAGE_CONTENT[pageId]

  if (!content) {
    return (
      <Layout>
        <section className="border-t border-gray-200 px-4 py-16 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-semibold text-[#2f3743]">Page not found</h1>
            <p className="mt-4 text-lg text-[#586274]">This page has not been wired yet.</p>
            <Link to="/" className="mt-6 inline-flex items-center justify-center bg-[#c82a2f] px-6 py-3 text-white">
              Back to Home
            </Link>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f6f1f0] px-4 py-10 md:px-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          {content.eyebrow ? <p className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-[#c82a2f]">{content.eyebrow}</p> : null}
          <h1 className="mt-3 text-center font-serif text-[40px] font-semibold tracking-[-0.02em] text-[#252a31] md:text-[48px]">
            {content.title}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-center text-[18px] leading-[1.65] text-[#586274]">
            {content.intro}
          </p>

          {content.heroImage ? (
            <div className="mt-8 flex justify-center">
              <img
                src={content.heroImage.src}
                alt={content.heroImage.alt}
                className="h-20 w-20 object-contain md:h-24 md:w-24"
                loading="lazy"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-white px-4 py-10 md:px-8 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-8">
          {content.sections.map((section) => (
            <article key={section.heading} className="rounded border border-gray-200 bg-white p-6 shadow-[0_4px_16px_rgba(17,24,39,0.05)]">
              <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#2f3743]">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-[18px] leading-[1.7] text-[#586274]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {section.bullets ? (
                <ul className="mt-5 space-y-2 text-[17px] leading-[1.6] text-[#3e4856]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="text-[#c82a2f]">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {content.cta ? (
        <section className="bg-[#f6f1f0] px-4 py-10 md:px-8 md:py-12">
          <div className="mx-auto max-w-4xl text-center">
            <Link to={content.cta.to} className="inline-flex items-center justify-center bg-[#c82a2f] px-7 py-3 text-[16px] font-semibold text-white transition hover:bg-[#a81f24]">
              {content.cta.label}
            </Link>
          </div>
        </section>
      ) : null}
    </Layout>
  )
}

StaticContentPage.displayName = 'StaticContentPage'

export default StaticContentPage