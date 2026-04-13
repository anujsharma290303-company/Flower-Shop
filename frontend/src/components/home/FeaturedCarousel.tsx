/**
 * Featured Products Carousel Section
 * Displays best sellers from the backend
 */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '@/api/products'
import type { Product } from '@/types'
import { SOCIAL_FLOWERS_HOMEPAGE } from '@/utils/socialflowersHomepage'

type DisplayProduct = {
  name: string
  price: string
  href: string
  image: string | null
}

const toDisplayProduct = (product: Product): DisplayProduct => {
  const image = Array.isArray(product.image) && product.image.length > 0
    ? product.image[0]
    : null

  return {
    name: product.name,
    price: Number(product.price).toFixed(2),
    href: `/item/${product.itemCode}/${product.slug}/`,
    image,
  }
}

const FeaturedCarousel: React.FC = () => {
  const [displayProducts, setDisplayProducts] = useState<DisplayProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadBestSellers = async () => {
      try {
        const response = await productService.getBestSellers(4)
        const items = response.items?.slice(0, 4) ?? []

        if (isMounted && items.length > 0) {
          setDisplayProducts(items.map(toDisplayProduct))
        }
      } catch {
        if (isMounted) {
          setDisplayProducts([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadBestSellers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section id="bestsellers" className="py-14 md:py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold font-serif text-gray-900 mb-4">
            {SOCIAL_FLOWERS_HOMEPAGE.headings.bestSellers}
          </h2>
        </div>

        <div className="max-w-245 mx-auto">
          {isLoading ? (
            <div className="py-12 text-center text-gray-600">Loading products...</div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-9">
              {displayProducts.map((product) => (
                <a
                  key={product.href}
                  href={product.href}
                  className="text-center group"
                >
                  <div className="h-57.5 mb-4 flex items-end justify-center bg-white">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-55 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-55 w-full max-w-55 rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                  <p className="text-[18px] md:text-[20px] font-semibold text-[#1f2328] leading-tight min-h-13">
                    {product.name}
                  </p>
                  <p className="text-[18px] text-gray-600 mt-1">${Number(product.price).toFixed(2)}</p>
                </a>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-600">No best sellers found.</div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/best-sellers"
              className="inline-flex items-center justify-center px-7 py-3 bg-red-600 text-white text-[16px] font-semibold hover:bg-red-700 transition-colors"
            >
              {SOCIAL_FLOWERS_HOMEPAGE.headings.bestsellersCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

FeaturedCarousel.displayName = 'FeaturedCarousel'
export default FeaturedCarousel