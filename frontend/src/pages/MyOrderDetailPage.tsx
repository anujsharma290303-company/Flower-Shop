import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { authService } from '@/api/auth'
import type { CustomerOrder } from '@/types'

const MyOrderDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<CustomerOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (!authService.isLoggedIn()) {
      navigate('/sign-in')
      return
    }

    const orderId = Number(id)
    if (!Number.isInteger(orderId) || orderId <= 0) {
      setErrorMessage('Invalid order id.')
      setIsLoading(false)
      return
    }

    const loadOrder = async () => {
      try {
        const result = await authService.getMyOrderById(orderId)
        if (isMounted) {
          setOrder(result)
        }
      } catch (error: unknown) {
        const message =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
            ? (error as { response: { data: { message: string } } }).response.data.message
            : 'Unable to load this order.'

        if (isMounted) {
          setErrorMessage(message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadOrder()

    return () => {
      isMounted = false
    }
  }, [id, navigate])

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-210">
          <h1 className="mb-7 text-center font-serif text-[44px] text-[#262b33]">Order Details</h1>

          {isLoading ? <p className="text-center text-[18px] text-[#586274]">Loading order...</p> : null}

          {!isLoading && errorMessage ? (
            <p className="text-center text-[16px] text-[#c82a2f]">{errorMessage}</p>
          ) : null}

          {!isLoading && order ? (
            <>
              <div className="rounded border border-gray-200 bg-white p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Order ID</p>
                    <p className="text-[17px] font-semibold text-[#2f3743]">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Status</p>
                    <p className="text-[17px] text-[#2f3743]">{order.status}</p>
                  </div>
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Payment</p>
                    <p className="text-[17px] text-[#2f3743]">{order.paymentStatus}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Recipient</p>
                    <p className="text-[17px] text-[#2f3743]">{order.recipientName}</p>
                    <p className="text-[15px] text-[#586274]">{order.recipientEmail || 'No recipient email provided'}</p>
                    <p className="text-[15px] text-[#586274]">{order.recipientPhone}</p>
                  </div>
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Delivery</p>
                    <p className="text-[17px] text-[#2f3743]">{order.deliveryAddress}</p>
                    <p className="text-[15px] text-[#586274]">
                      {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Delivery date not set'}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Total</p>
                  <p className="text-[20px] font-semibold text-[#2f3743]">
                    {order.currency} {Number(order.totalPrice).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded border border-gray-200 bg-white p-5">
                <h2 className="mb-4 text-[28px] font-semibold text-[#2f3743]">Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="h-18 w-18 object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-18 w-18 items-center justify-center border border-dashed border-gray-300 text-xs text-gray-500">
                          No image
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="text-[17px] font-semibold text-[#2f3743]">{item.productName}</p>
                        <p className="text-[15px] text-[#586274]">Quantity: {item.quantity}</p>
                      </div>

                      <p className="text-[16px] font-semibold text-[#2f3743]">
                        {order.currency} {Number(item.priceAtPurchase).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {order.statusLogs && order.statusLogs.length > 0 ? (
                <div className="mt-6 rounded border border-gray-200 bg-white p-5">
                  <h2 className="mb-4 text-[28px] font-semibold text-[#2f3743]">Status Timeline</h2>
                  <div className="space-y-3">
                    {order.statusLogs.map((statusLog) => (
                      <div key={statusLog.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-[16px] font-semibold text-[#2f3743]">{statusLog.toStatus}</p>
                        <p className="text-[14px] text-[#586274]">{statusLog.source}</p>
                        <p className="text-[14px] text-[#586274]">{new Date(statusLog.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          <div className="mt-8 text-center">
            <Link to="/my-orders" className="text-[18px] text-[#c82a2f] hover:underline">Back to Orders</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

MyOrderDetailPage.displayName = 'MyOrderDetailPage'
export default MyOrderDetailPage
