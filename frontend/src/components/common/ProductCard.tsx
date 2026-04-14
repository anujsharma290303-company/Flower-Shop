/**
 * Product Card Component
 * Used in product carousels, grids, and listings
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import type { ProductCardProps } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  showRating = true,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  // Parse price to number if string
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price

  // Get main product image
  const mainImage = product.image?.[0] || 'https://via.placeholder.com/280x340?text=No+Image'

  return (
    <Link to={`/product/${product.id}`}>
      <div
        className={cn(
          'group flex flex-col h-full bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300',
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative w-full bg-gray-100 overflow-hidden shrink-0" style={{ aspectRatio: '280/340' }}>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isBestSeller && <Badge label="Best Seller" variant="error" size="sm" />}
            {!product.inStock && <Badge label="Out of Stock" variant="warning" size="sm" />}
          </div>

          {/* Quick View Button (on hover) */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault()
                  onQuickView?.(product)
                }}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Quick View
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          {/* Product Name */}
          <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating (if showRating) */}
          {showRating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">(124 reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="text-lg font-bold text-red-600 mb-4">
            ${price.toFixed(2)}
          </div>

          {/* Add to Cart Button (Always visible on mobile, on hover on desktop) */}
          <Button
            label="Add to Cart"
            variant="primary"
            size="sm"
            fullWidth
            disabled={!product.inStock}
            onClick={() => {
              onAddToCart?.(product)
            }}
            className={cn(
              'mt-auto',
              // Show immediately on mobile, on hover on desktop
              'block md:hidden group-hover:md:block',
            )}
          />

          {/* Hidden button for desktop (shown on hover) */}
          <div className="hidden md:block cursor-pointer">
            <Button
              label="Add to Cart"
              variant="primary"
              size="sm"
              fullWidth
              disabled={!product.inStock}
              onClick={() => {
                onAddToCart?.(product)
              }}
              className={cn(
                'mt-auto',
                isHovered ? 'block' : 'hidden',
              )}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

ProductCard.displayName = 'ProductCard'
export default ProductCard
