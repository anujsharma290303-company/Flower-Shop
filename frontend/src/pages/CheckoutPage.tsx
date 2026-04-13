import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { productService } from '@/api/products'
import { orderService } from '@/api/orders'
import { paymentService } from '@/api/payments'
import type { Product } from '@/types'
import type { PaymentMethod, PaymentRecord } from '@/api/payments'
import { useBouquetStore } from '../store/bouquetStore'

const CheckoutPage: React.FC = () => {
  const { itemCode = '' } = useParams<{ itemCode?: string }>()
  const { cartItems, addToCart, updateCartItemQuantity } = useBouquetStore()

  const [loadingProduct, setLoadingProduct] = useState(Boolean(itemCode))
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null)
  const [recipientLink, setRecipientLink] = useState<string | null>(null)
  const [payment, setPayment] = useState<PaymentRecord | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mock-card')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')

  const productCartItems = useMemo(
    () => cartItems.filter((item) => item.type === 'product' && typeof item.productId === 'number'),
    [cartItems]
  )

  const bouquetCartItems = useMemo(
    () => cartItems.filter((item) => item.type === 'bouquet'),
    [cartItems]
  )

  const customBouquetIds = useMemo(
    () => bouquetCartItems
      .map((item) => {
        const parsedId = Number(String(item.id).replace('bouquet-', ''))
        return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null
      })
      .filter((id): id is number => id !== null),
    [bouquetCartItems]
  )

  const cartSubtotal = useMemo(
    () => productCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [productCartItems]
  )

  const bouquetSubtotal = useMemo(
    () => bouquetCartItems.reduce((sum, item) => sum + item.price, 0),
    [bouquetCartItems]
  )

  const getValidationError = () => {
    if (customerName.trim().length < 2 || customerName.trim().length > 120) {
      return 'Your name must be between 2 and 120 characters.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      return 'Please enter a valid email address.'
    }

    if (customerPhone.trim().length < 7 || customerPhone.trim().length > 30) {
      return 'Your phone must be between 7 and 30 characters.'
    }

    if (recipientName.trim().length < 2 || recipientName.trim().length > 120) {
      return 'Recipient name must be between 2 and 120 characters.'
    }

    if (recipientEmail.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
      return 'Recipient email must be valid.'
    }

    if (recipientPhone.trim().length < 7 || recipientPhone.trim().length > 30) {
      return 'Recipient phone must be between 7 and 30 characters.'
    }

    if (productCartItems.length === 0 && customBouquetIds.length === 0) {
      return 'Your cart is empty. Add at least one product or bouquet to continue checkout.'
    }

    return null
  }

  useEffect(() => {
    let mounted = true

    const ensureLegacyItemIsInCart = async () => {
      if (!itemCode) {
        setLoadingProduct(false)
        return
      }

      if (cartItems.some((item) => item.id.startsWith('product-'))) {
        setLoadingProduct(false)
        return
      }

      try {
        const legacyProduct: Product = await productService.getByItemCode(itemCode)
        if (mounted) {
          addToCart({
            id: `product-${legacyProduct.id}`,
            type: 'product',
            productId: legacyProduct.id,
            quantity: 1,
            price: Number(legacyProduct.price),
            name: legacyProduct.name,
          })
        }
      } catch {
        // Ignore legacy lookup failures and let the normal empty-cart UI handle messaging.
      } finally {
        if (mounted) {
          setLoadingProduct(false)
        }
      }
    }

    void ensureLegacyItemIsInCart()

    return () => {
      mounted = false
    }
  }, [addToCart, cartItems, itemCode])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = getValidationError()
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    setSubmitLoading(true)
    setSubmitError(null)
    setPaymentMessage(null)
    setPaymentError(null)
    setPayment(null)
    setCreatedOrderId(null)
    setRecipientLink(null)

    try {
      const response = await orderService.createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail.trim() || null,
        recipientPhone: recipientPhone.trim(),
        deliveryMode: 'recipient-provides',
        isRecipientChoice: productCartItems.length > 0 || bouquetCartItems.some((item) => item.bouquetData?.type === 'recipient'),
        items: productCartItems.map((item) => ({
          productId: item.productId as number,
          quantity: item.quantity,
        })),
        customBouquetIds,
      })

      setCreatedOrderId(response.order.id)
      setRecipientLink(response.recipientLink)
    } catch (error: unknown) {
      const validationMessage =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        Array.isArray((error as { response?: { data?: { errors?: Array<{ field?: string; message?: string }> } } }).response?.data?.errors) &&
        (error as { response: { data: { errors: Array<{ field?: string; message?: string }> } } }).response.data.errors.length > 0
          ? (() => {
            const firstError = (error as { response: { data: { errors: Array<{ field?: string; message?: string }> } } }).response.data.errors[0]
            return firstError.field ? `${firstError.field}: ${firstError.message}` : (firstError.message || null)
          })()
          : null

      const message =
        validationMessage ||
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

  const handleAuthorizePayment = async () => {
    if (!createdOrderId) {
      setPaymentError('Create the order first.')
      return
    }

    setPaymentLoading(true)
    setPaymentError(null)
    setPaymentMessage(null)

    try {
      const response = await paymentService.authorize({
        orderId: createdOrderId,
        method: paymentMethod,
      })

      setPayment(response.payment)
      setPaymentMessage('Payment authorized successfully. Your order is confirmed.')

      const consumedCartItems = [...productCartItems, ...bouquetCartItems]
      consumedCartItems.forEach((item) => {
        updateCartItemQuantity(item.id, 0)
      })
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Failed to authorize payment.'

      setPaymentError(message)
    } finally {
      setPaymentLoading(false)
    }
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-center font-serif text-[42px] text-[#262b33]">Checkout</h1>

          {loadingProduct ? <p className="mb-4 text-center text-[#586274]">Loading cart details...</p> : null}

          {productCartItems.length > 0 ? (
            <div className="mb-6 rounded border border-gray-200 bg-white p-4">
              <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">Checkout Items</p>
              <div className="mt-3 space-y-3">
                {productCartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-[18px] font-semibold text-[#2f3743]">{item.name}</p>
                      <p className="text-[14px] text-[#586274]">Qty {item.quantity}</p>
                    </div>
                    <p className="text-[18px] text-[#2f3743]">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-3 flex items-center justify-between">
                <p className="text-[16px] font-semibold text-[#2f3743]">Products Subtotal</p>
                <p className="text-[22px] text-[#2f3743]">${cartSubtotal.toFixed(2)}</p>
              </div>

              {bouquetCartItems.length > 0 ? (
                <div className="mt-4 rounded bg-[#fafafa] p-3">
                  <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">Custom Bouquet Requests in Cart</p>
                  <div className="mt-2 space-y-1">
                    {bouquetCartItems.map((item) => (
                      <p key={item.id} className="text-[14px] text-[#586274]">
                        {item.name} x 1
                      </p>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-2">
                    <p className="text-[14px] font-semibold text-[#2f3743]">Bouquet Subtotal</p>
                    <p className="text-[16px] text-[#2f3743]">${bouquetSubtotal.toFixed(2)}</p>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 border-t border-gray-200 pt-3 flex items-center justify-between">
                <p className="text-[18px] font-semibold text-[#2f3743]">Order Total</p>
                <p className="text-[24px] text-[#2f3743]">${(cartSubtotal + bouquetSubtotal).toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded border border-gray-200 bg-white p-5 text-center">
              <p className="text-[16px] text-[#586274]">No checkout items in cart.</p>
              <Link to="/cart" className="mt-3 inline-flex h-10 items-center justify-center text-[#c82a2f] hover:underline">
                Go to cart
              </Link>
            </div>
          )}

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
            </div>

            <button
              type="submit"
              disabled={submitLoading || (productCartItems.length === 0 && customBouquetIds.length === 0)}
              className="mt-5 inline-flex h-11 items-center justify-center bg-[#c82a2f] px-6 text-white transition hover:bg-[#a81f24] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitLoading ? 'Creating order...' : 'Place Order'}
            </button>
          </form>

          {submitError ? <p className="mt-4 text-[15px] text-[#c82a2f]">{submitError}</p> : null}

          {createdOrderId ? (
            <div className="mt-6 rounded border border-gray-200 bg-white p-5 md:p-6">
              <h2 className="text-[26px] font-semibold text-[#2f3743]">Payment Flow</h2>
              <p className="mt-2 text-[15px] text-[#586274]">Order #{createdOrderId} is ready for payment authorization.</p>

              {recipientLink ? <p className="mt-2 text-[14px] text-[#586274] break-all">Recipient link: {recipientLink}</p> : null}

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Payment Method</span>
                  <select
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                    className="h-11 border border-gray-300 px-3"
                  >
                    <option value="mock-card">mock-card</option>
                    <option value="mock-upi">mock-upi</option>
                    <option value="crypto">crypto</option>
                  </select>
                </label>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => void handleAuthorizePayment()}
                    disabled={paymentLoading}
                    className="inline-flex h-11 items-center justify-center bg-[#262b33] px-5 text-white transition hover:bg-[#11151b] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {paymentLoading ? 'Authorizing...' : 'Authorize Payment'}
                  </button>
                </div>
              </div>

              {payment ? (
                <div className="mt-5 rounded border border-gray-200 bg-[#fafafa] p-4">
                  <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">Payment #{payment.id}</p>
                  <p className="mt-2 text-[15px] text-[#2f3743]">Status: {payment.status}</p>
                  <p className="text-[15px] text-[#2f3743]">Transaction: {payment.transactionId}</p>
                  <p className="text-[15px] text-[#2f3743]">Amount: {payment.currency} {payment.amount}</p>
                  <p className="mt-3 text-[14px] text-[#586274]">Refund and void are managed by admin in the dashboard.</p>
                </div>
              ) : null}

              {paymentMessage ? <p className="mt-4 text-[15px] text-green-700">{paymentMessage}</p> : null}
              {paymentError ? <p className="mt-4 text-[15px] text-[#c82a2f]">{paymentError}</p> : null}
            </div>
          ) : null}

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
