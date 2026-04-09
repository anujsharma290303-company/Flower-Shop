import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { productService } from '@/api/products'
import { categoryService } from '@/api/categories'
import type { Product } from '@/types'

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

const ShopPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>()
  const [products, setProducts] = useState<DisplayProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [heading, setHeading] = useState('Shop Flowers')

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      try {
        setIsLoading(true)

        if (slug) {
          const category = await categoryService.getBySlug(slug)
          const response = await productService.getAll({ category: String(category.id), limit: 24 })
          const items = response.items ?? []

          if (isMounted) {
            setHeading(category.name)
            setProducts(items.map(toDisplayProduct))
          }
          return
        }

        const response = await productService.getAll({ limit: 24 })
        const items = response.items ?? []

        if (isMounted) {
          setHeading('Shop Flowers')
          setProducts(items.map(toDisplayProduct))
        }
      } catch {
        if (isMounted) {
          setProducts([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [slug])

  return (
    <Layout>
      <section className="py-14 md:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-semibold font-serif text-gray-900 mb-4">
              {heading}
            </h1>
            <p className="text-[16px] md:text-[18px] text-gray-600 max-w-2xl mx-auto">
              Catalog data is loaded directly from the backend products API.
            </p>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-gray-600">Loading products...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-9">
              {products.map((product) => (
                <Link key={product.href} to={product.href} className="text-center group">
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
                  <p className="text-[18px] text-gray-600 mt-1">${product.price}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-600">No products found.</div>
          )}
        </div>
      </section>
    </Layout>
  )
}

ShopPage.displayName = 'ShopPage'
export default ShopPage
