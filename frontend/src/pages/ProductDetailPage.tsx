import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { productService } from '@/api/products'
import type { Product } from '@/types'

type ProductTab = 'description' | 'billing' | 'delivery'

const BILLING_POINTS = [
  'We put a hold on your credit card for the order amount and only charge you when the recipient accepts the flowers.',
  'Orders to the United States are charged in $US, orders to Canada are charged in $CA.',
  'We accept credit cards and cryptocurrency as forms of payment.',
]

const DELIVERY_POINTS = [
  'Your flowers are hand-delivered by a local florist.',
  'Delivery is available in the United States and Canada.',
  'Orders can be delivered Monday to Saturday.',
  'Items featured may vary depending upon availability.',
]

const ProductDetailPage: React.FC = () => {
  const { itemCode = '' } = useParams<{ itemCode: string; slug?: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ProductTab>('description')

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      if (!itemCode) {
        setError('Product not found.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await productService.getByItemCode(itemCode)

        if (isMounted) {
          setProduct(response)
          setError(null)
        }
      } catch {
        if (isMounted) {
          setProduct(null)
          setError('We could not load this product.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [itemCode])

  const primaryImage = useMemo(() => {
    if (!product || !Array.isArray(product.image) || product.image.length === 0) {
      return ''
    }

    return product.image[0]
  }, [product])

  const sizeText = product?.size?.trim() || '11"w x 15"h'

  return (
    <Layout>
      <section className="py-10 md:py-12 px-4 md:px-8 bg-[#efefef] min-h-[70vh]">
        <div className="max-w-5xl mx-auto bg-transparent">
          {loading ? (
            <div className="py-20 text-center text-gray-600">Loading product...</div>
          ) : error || !product ? (
            <div className="py-20 text-center">
              <p className="text-gray-700 mb-6">{error || 'Product not found.'}</p>
              <Link
                to="/best-sellers"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Back to Best Sellers
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 md:gap-12">
              <div className="flex items-start justify-center">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full max-w-[280px] md:max-w-[320px] h-auto object-contain"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full max-w-[280px] md:max-w-[320px] h-[320px] border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
                    No image available
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-[36px] md:text-[42px] font-serif text-[#1f2328] leading-tight mb-3">
                  {product.name}
                </h1>
                <p className="text-[30px] md:text-[34px] text-[#1f2328] mb-6">${Number(product.price).toFixed(2)}</p>

                <div className="border-b border-gray-300 mb-4">
                  <div className="flex gap-6 text-[18px] md:text-[20px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveTab('description')}
                      className={`pb-3 border-b-2 transition-colors ${activeTab === 'description' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-700 hover:text-gray-900'}`}
                    >
                      Description
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('billing')}
                      className={`pb-3 border-b-2 transition-colors ${activeTab === 'billing' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-700 hover:text-gray-900'}`}
                    >
                      Billing
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('delivery')}
                      className={`pb-3 border-b-2 transition-colors ${activeTab === 'delivery' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-700 hover:text-gray-900'}`}
                    >
                      Delivery
                    </button>
                  </div>
                </div>

                {activeTab === 'description' && (
                  <div className="space-y-4 text-[17px] text-gray-700 leading-relaxed">
                    <p>{product.description || 'A beautiful bouquet for your special moments.'}</p>
                    <p>
                      <span className="font-semibold text-gray-900">Approximate Size:</span> {sizeText}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Item No.</span> {product.itemCode}
                    </p>
                    <ul className="space-y-2 pt-2">
                      <li className="flex gap-2"><span className="text-red-600">•</span><span>Price includes delivery and tax.</span></li>
                      <li className="flex gap-2"><span className="text-red-600">•</span><span>Send this item using email, text, or social media.</span></li>
                      <li className="flex gap-2"><span className="text-red-600">•</span><span>You only pay if the recipient accepts your flowers.</span></li>
                    </ul>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <ul className="space-y-2 text-[17px] text-gray-700 leading-relaxed">
                    {BILLING_POINTS.map((point) => (
                      <li key={point} className="flex gap-2"><span className="text-red-600">•</span><span>{point}</span></li>
                    ))}
                  </ul>
                )}

                {activeTab === 'delivery' && (
                  <ul className="space-y-2 text-[17px] text-gray-700 leading-relaxed">
                    {DELIVERY_POINTS.map((point) => (
                      <li key={point} className="flex gap-2"><span className="text-red-600">•</span><span>{point}</span></li>
                    ))}
                  </ul>
                )}

                <div className="mt-8">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white text-[16px] font-semibold hover:bg-red-700 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

ProductDetailPage.displayName = 'ProductDetailPage'
export default ProductDetailPage
