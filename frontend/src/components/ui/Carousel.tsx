/**
 * Carousel Component
 * Swiper wrapper for product carousels and image galleries
 */

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export interface CarouselProps {
  items: React.ReactNode[]
  itemsPerView?: number | 'auto'
  spaceBetween?: number
  navigation?: boolean
  pagination?: boolean
  autoplay?: boolean | { delay: number }
  loop?: boolean
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween: number }>
  onSlideChange?: (index: number) => void
  className?: string
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  itemsPerView = 4,
  spaceBetween = 16,
  navigation = true,
  pagination = true,
  autoplay = false,
  loop = false,
  breakpoints,
  onSlideChange,
  className,
}) => {
  // Default responsive breakpoints
  const defaultBreakpoints = breakpoints || {
    0: { slidesPerView: 1, spaceBetween: 12 }, // Mobile
    640: { slidesPerView: 1, spaceBetween: 16 }, // Tablet small
    768: { slidesPerView: 2, spaceBetween: 16 }, // Tablet
    1024: { slidesPerView: 3, spaceBetween: 16 }, // Desktop small
    1280: { slidesPerView: 4, spaceBetween: 16 }, // Desktop
  }

  return (
    <div className={className}>
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={itemsPerView}
        spaceBetween={spaceBetween}
        navigation={navigation}
        pagination={pagination ? { clickable: true } : false}
        loop={loop}
        autoplay={autoplay ? (typeof autoplay === 'boolean' ? { delay: 5000 } : autoplay) : false}
        breakpoints={defaultBreakpoints}
        onSlideChange={(swiper) => onSlideChange?.(swiper.activeIndex)}
        className="w-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>{item}</SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Swiper styles for Social Flowers theme */}
      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #d63447;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #f0f0f0;
        }

        .swiper-pagination-bullet {
          background: #d63447;
        }

        .swiper-pagination-bullet-active {
          background: #d63447;
        }
      `}</style>
    </div>
  )
}

Carousel.displayName = 'Carousel'
export default Carousel
