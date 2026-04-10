import React, { useMemo, useState } from 'react'
import Layout from '@/components/layout/Layout'

type ReviewMedia = {
  id: number
  kind: 'image' | 'video'
  src: string
  alt: string
  span?: 'short' | 'tall'
}

const REVIEW_MEDIA: ReviewMedia[] = [
  {
    id: 1,
    kind: 'video',
    src: '/videos/sf-how-it-works-hero-video-2024-final.mp4',
    alt: 'Customer flower reveal video',
    span: 'tall',
  },
  {
    id: 2,
    kind: 'image',
    src: 'https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/woman-receiving-flowers.jpg',
    alt: 'Woman holding sunflowers',
    span: 'tall',
  },
  {
    id: 3,
    kind: 'image',
    src: 'https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/taking-picture-of-flowers.jpg',
    alt: 'Customer taking bouquet photo',
  },
  {
    id: 4,
    kind: 'image',
    src: '/images/happy-birthday-bouquet.jpg',
    alt: 'Birthday bouquet arrangement',
  },
  {
    id: 5,
    kind: 'image',
    src: '/images/dozen-red-roses.jpg',
    alt: 'Dozen red roses arrangement',
    span: 'tall',
  },
  {
    id: 6,
    kind: 'image',
    src: '/images/birthday-sunflower-basket.jpg',
    alt: 'Sunflower basket gift',
  },
  {
    id: 7,
    kind: 'video',
    src: '/videos/sf-how-it-works-hero-video-2024-final.mp4',
    alt: 'Customer smiling with flower delivery',
  },
  {
    id: 8,
    kind: 'image',
    src: 'https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/florist-at-shop.jpg',
    alt: 'Florist with bouquet',
  },
  {
    id: 9,
    kind: 'image',
    src: '/images/mixed-rose-garden.jpg',
    alt: 'Mixed rose bouquet',
    span: 'tall',
  },
  {
    id: 10,
    kind: 'image',
    src: 'https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/Man%20receiving%20flowers%20in%20hospital3.jpg',
    alt: 'Recipient with flowers in hospital room',
  },
  {
    id: 11,
    kind: 'image',
    src: '/images/dozen-red-roses.jpg',
    alt: 'Roses close-up',
  },
  {
    id: 12,
    kind: 'video',
    src: '/videos/sf-how-it-works-hero-video-2024-final.mp4',
    alt: 'Video testimonial clip',
    span: 'tall',
  },
  {
    id: 13,
    kind: 'image',
    src: '/images/happy-birthday-bouquet.jpg',
    alt: 'Birthday flowers on table',
  },
  {
    id: 14,
    kind: 'image',
    src: '/images/mixed-rose-garden.jpg',
    alt: 'Fresh mixed roses in vase',
  },
  {
    id: 15,
    kind: 'image',
    src: '/images/birthday-sunflower-basket.jpg',
    alt: 'Sunflowers and mixed flowers',
    span: 'tall',
  },
]

const ReviewsPage: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null)

  const activeItem = useMemo(
    () => REVIEW_MEDIA.find((item) => item.id === activeId) ?? null,
    [activeId]
  )

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f3f3f3] px-4 pb-10 pt-7 md:pb-14 md:pt-9">
        <div className="mx-auto max-w-[760px]">
          <h1 className="text-center text-[33px] font-semibold tracking-[-0.02em] text-[#252a31]">
            What People Say - Reviews of Social Flowers
          </h1>

          <div className="mx-auto mt-7 max-w-[720px] space-y-5 text-[18px] leading-[1.45] text-[#4c5562]">
            <p>
              Click on a picture to see what people are saying about Social Flowers and how they are
              using our service to make connections.
            </p>
            <p>
              We love reviews with smiling faces and beautiful flowers! When pictures are shared, both
              the customer and the recipient{' '}
              <span className="font-semibold text-[#cf2f35]">earn up to $50 on a future order.</span>
            </p>
          </div>

          <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {REVIEW_MEDIA.map((item) => {
              const isVideo = item.kind === 'video'

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className="group relative mb-5 block w-full break-inside-avoid overflow-hidden bg-white text-left shadow-[0_4px_18px_rgba(17,24,39,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(17,24,39,0.18)]"
                >
                  {isVideo ? (
                    <video
                      src={item.src}
                      muted
                      playsInline
                      preload="metadata"
                      className={`w-full object-cover ${item.span === 'tall' ? 'h-[430px]' : 'h-[310px]'}`}
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      className={`w-full object-cover ${item.span === 'tall' ? 'h-[430px]' : 'h-[310px]'}`}
                    />
                  )}

                  {isVideo && (
                    <span className="absolute left-2 top-2 rounded bg-[#1f2937] px-2 py-1 text-[11px] font-bold tracking-[0.08em] text-white">
                      VIDEO
                    </span>
                  )}

                  <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/12" />
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {activeItem && (
        <div
          role="presentation"
          onClick={() => setActiveId(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Review media preview"
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded bg-black"
          >
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1.5 text-sm font-semibold text-white hover:bg-black/80"
            >
              Close
            </button>

            {activeItem.kind === 'video' ? (
              <video
                src={activeItem.src}
                controls
                autoPlay
                className="max-h-[90vh] w-full object-contain"
              />
            ) : (
              <img src={activeItem.src} alt={activeItem.alt} className="max-h-[90vh] w-full object-contain" />
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}

ReviewsPage.displayName = 'ReviewsPage'
export default ReviewsPage
