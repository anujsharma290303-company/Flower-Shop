import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { productService } from '@/api/products'
import { orderService } from '@/api/orders'
import type { Product } from '@/types'

const CheckoutPage: React.FC = () => {
  const { itemCode = '' } = useParams<{ itemCode?: string }>()

  const [product, setProduct] = useState<Product | null>(null)
  const [loadingProduct, setLoadingProduct] = useState(Boolean(itemCode))
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let mounted = true

    const loadProduct = async () => {
      if (!itemCode) {
        setLoadingProduct(false)
        return
      }

      try {
        const nextProduct = await productService.getByItemCode(itemCode)
        if (mounted) {
          setProduct(nextProduct)
        }
      } catch {
        if (mounted) {
          setProduct(null)
        }
      } finally {
        if (mounted) {
          setLoadingProduct(false)
        }
      }
    }

    loadProduct()

    return () => {
      mounted = false
    }
  }, [itemCode])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!product) {
      setSubmitError('Choose a product first from a product detail page.')
      return
    }

    setSubmitLoading(true)
    setSubmitMessage(null)
    setSubmitError(null)

    try {
      const response = await orderService.createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail.trim() || null,
        recipientPhone: recipientPhone.trim(),
        deliveryMode: 'recipient-provides',
        isRecipientChoice: true,
        items: [{
          productId: product.id,
          quantity,
        }],
      })

      setSubmitMessage(
        response.recipientLink
          ? `Order created. Recipient link: ${response.recipientLink}`
          : 'Order created successfully.',
      )
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Failed to create order.'

      setSubmitError(message)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-center font-serif text-[42px] text-[#262b33]">Checkout</h1>

          {loadingProduct ? <p className="mb-4 text-center text-[#586274]">Loading selected product...</p> : null}

          {!loadingProduct && !product ? (
            <p className="mb-6 text-center text-[#586274]">
              No product selected. Open a product and click Buy Now.
            </p>
          ) : null}

          {product ? (
            <div className="mb-6 rounded border border-gray-200 bg-white p-4">
              <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">Selected Product</p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[20px] font-semibold text-[#2f3743]">{product.name}</p>
                  <p className="text-[15px] text-[#586274]">Item {product.itemCode}</p>
                </div>
                <p className="text-[22px] text-[#2f3743]">${Number(product.price).toFixed(2)}</p>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="rounded border border-gray-200 bg-white p-5 md:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Your Name</span>
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="h-11 border border-gray-300 px-3" required />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Your Email</span>
                <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="h-11 border border-gray-300 px-3" required />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Your Phone</span>
                <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="h-11 border border-gray-300 px-3" required />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Recipient Name</span>
                <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="h-11 border border-gray-300 px-3" required />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Recipient Email (optional)</span>
                <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="h-11 border border-gray-300 px-3" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Recipient Phone</span>
                <input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} className="h-11 border border-gray-300 px-3" required />
              </label>
              <label className="flex flex-col gap-2 md:max-w-36">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Quantity</span>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="h-11 border border-gray-300 px-3"
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitLoading || !product}
              className="mt-5 inline-flex h-11 items-center justify-center bg-[#c82a2f] px-6 text-white transition hover:bg-[#a81f24] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitLoading ? 'Creating order...' : 'Place Order'}
            </button>
          </form>

          {submitMessage ? <p className="mt-4 text-[15px] text-green-700">{submitMessage}</p> : null}
          {submitError ? <p className="mt-4 text-[15px] text-[#c82a2f]">{submitError}</p> : null}

          <div className="mt-6 text-center">
            <Link to="/track-order" className="text-[16px] text-[#c82a2f] hover:underline">Track an order</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

CheckoutPage.displayName = 'CheckoutPage'

export default CheckoutPage
