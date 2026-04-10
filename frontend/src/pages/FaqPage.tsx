import React, { useMemo, useState } from 'react'
import Layout from '@/components/layout/Layout'
import { useFaqs } from '@/hooks/useFaqs'

type FaqItem = {
  question: string
  answer: string
}

type FaqSection = {
  key: string
  title: string
  iconUrl: string
  sectionClass: string
  items: FaqItem[]
}

const FALLBACK_FAQ_SECTIONS: FaqSection[] = [
  {
    key: 'general',
    title: 'GENERAL',
    iconUrl: 'https://cdn.socialflowers.com/how-it-works/bouquet-flowers.svg',
    sectionClass: 'bg-[#f4efef]',
    items: [
      {
        question: 'What is Social Flowers?',
        answer:
          'Social Flowers is a flower delivery service that lets you send flowers even when you do not have the recipient address by sharing a private acceptance link.',
      },
      {
        question: 'Will my information be shared?',
        answer:
          'No. Sender and recipient details are kept private and are used only to complete the order and delivery process.',
      },
      {
        question: 'Where do you deliver flowers?',
        answer:
          'Deliveries are fulfilled through local florist partners across many U.S. cities, with coverage depending on recipient location and product availability.',
      },
      {
        question: 'What is a "You\'ve Got Flowers" link?',
        answer:
          'It is a private link used by the recipient to accept flowers and choose where and when they want delivery.',
      },
      {
        question: 'What makes Social Flowers different?',
        answer:
          'You can send real flowers with only an email, phone number, or social connection, while keeping address details private.',
      },
      {
        question: 'Does sending Social Flowers spoil the surprise?',
        answer:
          'No. The recipient is notified they have flowers waiting, but details remain minimal until they accept.',
      },
      {
        question: 'Can I send flowers and have my name appear as Anonymous or Secret Admirer?',
        answer:
          'Yes. You can choose how your sender name is shown when creating the order.',
      },
      {
        question: 'Do you offer custom bouquets?',
        answer:
          'Yes. Availability depends on florist inventory and delivery location.',
      },
      {
        question: 'How can Social Flowers be used?',
        answer:
          'People use Social Flowers for birthdays, romance, apologies, thank-you gifts, celebrations, and social media connections.',
      },
      {
        question: 'How do your prices compare to other florists?',
        answer:
          'Pricing is competitive and varies by bouquet style, size, and delivery destination.',
      },
    ],
  },
  {
    key: 'sender',
    title: 'SENDER',
    iconUrl: 'https://cdn.socialflowers.com/how-it-works/got-flowers.svg',
    sectionClass: 'bg-white',
    items: [
      {
        question: 'Will I be charged if the recipient does not accept the flowers?',
        answer: 'No. You are charged only when the recipient accepts the order.',
      },
      {
        question: 'Do I need to contact Social Flowers to get my refund if the recipient does not accept?',
        answer: 'No. If the order is not accepted, the charge is not finalized for the delivery.',
      },
      {
        question: 'Will my information be shared?',
        answer: 'No. Your personal information is kept private through the order flow.',
      },
      {
        question: 'How do I send flowers with an email address or mobile phone number?',
        answer:
          'Choose a bouquet, complete checkout, and provide the recipient email or phone number so they can receive the acceptance link.',
      },
      {
        question: 'How do I send flowers through social media?',
        answer:
          'After checkout, share your private "You\'ve Got Flowers" link through direct message on the platform you use.',
      },
      {
        question: 'Will I receive a You\'ve Got Flowers link so that I can also send this to the recipient?',
        answer: 'Yes. You receive a shareable link that you can send directly to the recipient.',
      },
      {
        question: 'Can I include a message to the recipient when they are asked to accept their Social Flowers?',
        answer: 'Yes. You can include a message during checkout.',
      },
      {
        question: 'How often do you contact the recipient and when does the order expire?',
        answer:
          'Reminder timing and expiration are managed automatically so recipients have a limited window to accept.',
      },
      {
        question: 'Can I change the recipient email address and or phone number I provided on an order?',
        answer: 'Yes, updates may be possible before the order is accepted and prepared for delivery.',
      },
      {
        question: 'I have the recipient delivery address, can I enter it at checkout and not have you contact the recipient?',
        answer: 'Yes. You can provide the delivery address directly when placing the order.',
      },
      {
        question: 'Can flowers be delivered on a specific date?',
        answer: 'Yes, date options depend on location and florist availability.',
      },
      {
        question: 'Can I see a picture of the flowers that were sent?',
        answer: 'In many cases, shared recipient photos or delivery images can be provided when available.',
      },
      {
        question: 'Why can\'t the You\'ve Got Flowers link be posted publicly on social media?',
        answer:
          'The link is private and intended for one recipient to protect account details, order integrity, and privacy.',
      },
      {
        question: 'How do I send flowers to Canada?',
        answer: 'Use checkout as normal and confirm destination support during the order process.',
      },
    ],
  },
  {
    key: 'recipient',
    title: 'RECIPIENT',
    iconUrl: 'https://cdn.socialflowers.com/how-it-works/women.svg',
    sectionClass: 'bg-[#f4efef]',
    items: [
      {
        question: 'Will my information be shared?',
        answer: 'No. Your personal information is kept private and used only for delivery.',
      },
      {
        question: 'How do I receive flowers that were sent to me?',
        answer: 'Open your private link and choose your delivery location and preferred date.',
      },
      {
        question: 'Is there a time limit to accepting the flowers?',
        answer: 'Yes. The acceptance link expires if not used in time.',
      },
      {
        question: 'What if I am out of town and cannot receive flowers?',
        answer: 'You can select a different delivery date or location when accepting, if options are available.',
      },
      {
        question: 'Can Social Flowers help me share a picture or video of the flowers with the sender?',
        answer: 'Yes. You can share media after delivery to thank the sender and document the bouquet received.',
      },
      {
        question: 'I work under an alias. If someone sends flowers using this name can I change it before they are delivered?',
        answer: 'Yes. You can provide preferred details while accepting, before final delivery is scheduled.',
      },
      {
        question: 'If I decline flowers, will the sender know?',
        answer: 'The sender is informed that the order was not accepted.',
      },
      {
        question: 'How can I request flowers through social media?',
        answer: 'Share your wishlist or request link privately with people on your social platforms.',
      },
    ],
  },
]

const sectionMeta = [
  {
    key: 'general',
    title: 'GENERAL',
    iconUrl: 'https://cdn.socialflowers.com/how-it-works/bouquet-flowers.svg',
    sectionClass: 'bg-[#f4efef]',
  },
  {
    key: 'sender',
    title: 'SENDER',
    iconUrl: 'https://cdn.socialflowers.com/how-it-works/got-flowers.svg',
    sectionClass: 'bg-white',
  },
  {
    key: 'recipient',
    title: 'RECIPIENT',
    iconUrl: 'https://cdn.socialflowers.com/how-it-works/women.svg',
    sectionClass: 'bg-[#f4efef]',
  },
] as const

const splitByLengths = <T,>(items: T[], lengths: number[]): T[][] => {
  const result: T[][] = []
  let start = 0

  for (const length of lengths) {
    result.push(items.slice(start, start + length))
    start += length
  }

  if (start < items.length) {
    result[result.length - 1] = [...result[result.length - 1], ...items.slice(start)]
  }

  return result
}

const FaqPage: React.FC = () => {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const { faqs, isLoading } = useFaqs()

  const dbFaqItems = useMemo(
    () => faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
    [faqs]
  )

  const sections = useMemo(() => {
    if (dbFaqItems.length === 0) {
      return FALLBACK_FAQ_SECTIONS
    }

    const exactTemplateTotal = 32
    const chunks = dbFaqItems.length >= exactTemplateTotal
      ? splitByLengths(dbFaqItems, [10, 14, 8])
      : splitByLengths(dbFaqItems, [
        Math.ceil(dbFaqItems.length / 3),
        Math.ceil((dbFaqItems.length * 2) / 3) - Math.ceil(dbFaqItems.length / 3),
        dbFaqItems.length - Math.ceil((dbFaqItems.length * 2) / 3),
      ])

    return sectionMeta.map((meta, index) => ({
      ...meta,
      items: chunks[index] ?? [],
    }))
  }, [dbFaqItems])

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f4efef] px-4 pb-8 pt-6 md:px-6 md:pt-8">
        <div className="mx-auto max-w-275">
          <h1 className="text-center text-[48px] font-semibold tracking-[-0.02em] text-[#252a31]">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      {isLoading && (
        <section className="bg-[#f4efef] px-4 py-4 md:px-6">
          <div className="mx-auto max-w-275 text-[18px] text-[#586274]">Loading FAQs...</div>
        </section>
      )}

      {sections.map((section) => (
        <section key={section.key} className={`${section.sectionClass} px-4 py-5 md:px-6 md:py-6`}>
          <div className="mx-auto max-w-275">
            <header className="mb-2 flex items-center gap-4 border-b border-[#dbd8d8] pb-3">
              <h2 className="text-[36px] font-semibold tracking-[-0.015em] text-[#2a2f37]">{section.title}</h2>
              <img src={section.iconUrl} alt="Section icon" className="h-12 w-12 object-contain" loading="lazy" />
            </header>

            <div>
              {section.items.map((item, index) => {
                const itemKey = `${section.key}-${index}`
                const isOpen = openKey === itemKey

                return (
                  <article key={item.question} className="border-b border-[#dbd8d8]">
                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : itemKey)}
                      className="flex w-full items-center justify-between gap-5 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[22px] font-medium leading-[1.45] text-[#3a4350]">{item.question}</span>
                      <svg
                        className={`h-5 w-5 shrink-0 text-[#4a5564] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="pb-5 pr-9">
                        <p className="text-[18px] leading-[1.65] text-[#586274]">{item.answer}</p>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ))}
    </Layout>
  )
}

FaqPage.displayName = 'FaqPage'
export default FaqPage
