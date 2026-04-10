import React, { useMemo, useState } from 'react'
import Layout from '@/components/layout/Layout'
import { useReviews } from '@/hooks/useReviews'
import type { CustomerReview } from '@/types'

type ReviewMedia = {
  id: string
  kind: 'image' | 'video'
  src: string
  alt: string
  span?: 'short' | 'tall'
}

const REVIEW_MEDIA: Omit<ReviewMedia, 'id'>[] = [
  {
    kind: 'video',
    src: '/videos/sf-how-it-works-hero-video-2024-final.mp4',
    alt: 'Customer flower reveal video',
    span: 'tall',
  },
  {
    kind: 'image',
    src: 'https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/woman-receiving-flowers.jpg',
    alt: 'Woman holding sunflowers',
    span: 'tall',
  },
  {
    kind: 'image',
    src: 'https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/taking-picture-of-flowers.jpg',
    alt: 'Customer taking bouquet photo',
  },
  {
    kind: 'image',
    src: '/images/happy-birthday-bouquet.jpg',
    alt: 'Birthday bouquet arrangement',
  },
  {
    kind: 'image',
    src: '/images/dozen-red-roses.jpg',
    alt: 'Dozen red roses arrangement',
    span: 'tall',
  },
  {
    kind: 'image',
    src: '/images/birthday-sunflower-basket.jpg',
    alt: 'Sunflower basket gift',
  },
  {
    kind: 'video',
    src: '/videos/sf-how-it-works-hero-video-2024-final.mp4',
    alt: 'Customer smiling with flower delivery',
  },
  {
    kind: 'image',
    src: 'https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/florist-at-shop.jpg',
    alt: 'Florist with bouquet',
  },
  {
    kind: 'image',
    src: '/images/mixed-rose-garden.jpg',
    alt: 'Mixed rose bouquet',
    span: 'tall',
  },
  {
    kind: 'image',
    src: 'https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/Man%20receiving%20flowers%20in%20hospital3.jpg',
    alt: 'Recipient with flowers in hospital room',
  },
  {
    kind: 'image',
    src: '/images/dozen-red-roses.jpg',
    alt: 'Roses close-up',
  },
  {
    kind: 'video',
    src: '/videos/sf-how-it-works-hero-video-2024-final.mp4',
    alt: 'Video testimonial clip',
    span: 'tall',
  },
  {
    kind: 'image',
    src: '/images/happy-birthday-bouquet.jpg',
    alt: 'Birthday flowers on table',
  },
  {
    kind: 'image',
    src: '/images/mixed-rose-garden.jpg',
    alt: 'Fresh mixed roses in vase',
  },
  {
    kind: 'image',
    src: '/images/birthday-sunflower-basket.jpg',
    alt: 'Sunflowers and mixed flowers',
    span: 'tall',
  },
]

const FALLBACK_REVIEWS: CustomerReview[] = [
  {
    id: 1,
    name: 'Happy Customer',
    location: 'New York, NY',
    message: 'Beautiful flowers and easy delivery. The recipient loved everything.',
    rating: 5,
    isApproved: true,
    orderId: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Satisfied Sender',
    location: 'Austin, TX',
    message: 'Great experience, simple process, and fast support.',
    rating: 5,
    isApproved: true,
    orderId: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Loyal Customer',
    location: 'Miami, FL',
    message: 'The flowers looked fresh and the delivery timing was perfect.',
    rating: 4,
    isApproved: true,
    orderId: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]

type GalleryItem = {
  id: string
  media: ReviewMedia
  review: CustomerReview
}

const ReviewsPage: React.FC = () => {
  const { reviews, isLoading } = useReviews()
  const [activeId, setActiveId] = useState<string | null>(null)

  const galleryItems = useMemo<GalleryItem[]>(() => {
    const reviewSource = reviews.length > 0 ? reviews : FALLBACK_REVIEWS

    return reviewSource.map((review, index) => {
      const media = REVIEW_MEDIA[index % REVIEW_MEDIA.length]
      return {
        id: `${review.id}-${index}`,
        media: { ...media, id: `${review.id}-${index}` },
        review,
      }
    })
  }, [reviews])

  const activeItem = useMemo(
    () => galleryItems.find((item) => item.id === activeId) ?? null,
    [activeId, galleryItems]
  )

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f3f3f3] px-4 pb-10 pt-7 md:pb-14 md:pt-9">
        <div className="mx-auto max-w-190">
          <h1 className="text-center text-[33px] font-semibold tracking-[-0.02em] text-[#252a31]">
            What People Say - Reviews of Social Flowers
          </h1>

          <div className="mx-auto mt-7 max-w-180 space-y-5 text-[18px] leading-[1.45] text-[#4c5562]">
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

          {isLoading && <p className="mt-4 text-[16px] text-[#687386]">Loading customer reviews...</p>}

          <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {galleryItems.map((item) => {
              const isVideo = item.media.kind === 'video'

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className="group relative mb-5 block w-full break-inside-avoid overflow-hidden bg-white text-left shadow-[0_4px_18px_rgba(17,24,39,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(17,24,39,0.18)]"
                >
                  {isVideo ? (
                    <video
                      src={item.media.src}
                      muted
                      playsInline
                      preload="metadata"
                      className={`w-full object-cover ${item.media.span === 'tall' ? 'h-107.5' : 'h-77.5'}`}
                    />
                  ) : (
                    <img
                      src={item.media.src}
                      alt={item.media.alt}
                      loading="lazy"
                      className={`w-full object-cover ${item.media.span === 'tall' ? 'h-107.5' : 'h-77.5'}`}
                    />
                  )}

                  {isVideo && (
                    <span className="absolute left-2 top-2 rounded bg-[#1f2937] px-2 py-1 text-[11px] font-bold tracking-[0.08em] text-white">
                      VIDEO
                    </span>
                  )}

                  <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/12" />

                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent px-3 pb-3 pt-8 text-white">
                    <p className="line-clamp-2 text-[13px] leading-[1.35]">{item.review.message}</p>
                    <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.08em]">
                      {item.review.name}{item.review.location ? ` - ${item.review.location}` : ''}
                    </p>
                  </div>
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
          className="fixed inset-0 z-90 flex items-center justify-center bg-black/80 p-4"
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

            {activeItem.media.kind === 'video' ? (
              <video
                src={activeItem.media.src}
                controls
                autoPlay
                className="max-h-[90vh] w-full object-contain"
              />
            ) : (
              <img src={activeItem.media.src} alt={activeItem.media.alt} className="max-h-[90vh] w-full object-contain" />
            )}

            <div className="border-t border-white/20 bg-black/90 px-4 py-3 text-white">
              <p className="text-[14px] leading-relaxed">{activeItem.review.message}</p>
              <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.08em]">
                {activeItem.review.name}{activeItem.review.location ? ` - ${activeItem.review.location}` : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

ReviewsPage.displayName = 'ReviewsPage'
export default ReviewsPage
