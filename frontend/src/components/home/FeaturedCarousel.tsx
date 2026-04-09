/**
 * Featured Products Carousel Section
 * Displays best-selling products in a horizontal carousel
 */

import React, { useState, useEffect } from 'react'
import { productService } from '@/api/products'
import { Product } from '@/types'
import Spinner from '@/components/ui/Spinner'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { SOCIAL_FLOWERS_HOMEPAGE } from '@/utils/socialflowersHomepage'

const imageByItemCode: Record<string, string> = {
  'C15-4794': SOCIAL_FLOWERS_HOMEPAGE.bestSellerImages.mixedRoseGarden,
  'C15-4797': SOCIAL_FLOWERS_HOMEPAGE.bestSellerImages.dozenRedRoses,
  'C15-4800': SOCIAL_FLOWERS_HOMEPAGE.bestSellerImages.happyBirthdayBouquet,
  'C15-4803': SOCIAL_FLOWERS_HOMEPAGE.bestSellerImages.birthdaySunflowerBasket,
}

const fallbackProducts = [
  {
    id: 101,
    name: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[0].name,
    price: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[0].price,
    image: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[0].image,
    href: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[0].href,
  },
  {
    id: 102,
    name: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[1].name,
    price: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[1].price,
    image: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[1].image,
    href: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[1].href,
  },
  {
    id: 103,
    name: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[2].name,
    price: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[2].price,
    image: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[2].image,
    href: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[2].href,
  },
  {
    id: 104,
    name: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[3].name,
    price: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[3].price,
    image: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[3].image,
    href: SOCIAL_FLOWERS_HOMEPAGE.bestsellers[3].href,
  },
]

const FeaturedCarousel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productService.getBestSellers(12)
        setProducts(response.items)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch featured products:', err)
        setError('Failed to load products. Please try again.')
        toast.error('Failed to load featured products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const displayProducts = products.length > 0
    ? products.slice(0, 4).map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageByItemCode[product.itemCode] || product.image?.[0] || fallbackProducts[0].image,
      href: `/item/${product.itemCode}/${product.slug}/`,
    }))
    : fallbackProducts

  return (
    <section id="bestsellers" className="py-14 md:py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold font-serif text-gray-900 mb-4">
            {SOCIAL_FLOWERS_HOMEPAGE.headings.bestSellers}
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-96">
            <Spinner size="lg" label="Loading bestsellers..." />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Carousel */}
        {!loading && !error && (
          <div className="max-w-[980px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-9">
              {displayProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.href}
                  className="text-center group"
                >
                  <div className="h-[230px] mb-4 flex items-end justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-[220px] w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[18px] md:text-[20px] font-semibold text-[#1f2328] leading-tight min-h-[52px]">{product.name}</p>
                  <p className="text-[18px] text-gray-600 mt-1">${Number(product.price).toFixed(2)}</p>
                </a>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/best-sellers"
                className="inline-flex items-center justify-center px-7 py-3 bg-red-600 text-white text-[16px] font-semibold hover:bg-red-700 transition-colors"
              >
                {SOCIAL_FLOWERS_HOMEPAGE.headings.bestsellersCta}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

FeaturedCarousel.displayName = 'FeaturedCarousel'
export default FeaturedCarousel
