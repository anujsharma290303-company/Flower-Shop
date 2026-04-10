import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { authService } from '@/api/auth'
import type { CustomerOrder } from '@/types'

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (!authService.isLoggedIn()) {
      navigate('/sign-in')
      return
    }

    const loadOrders = async () => {
      try {
        const response = await authService.getMyOrders({ page: 1, limit: 50 })
        if (isMounted) {
          setOrders(response.orders)
        }
      } catch (error: unknown) {
        const message =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
            ? (error as { response: { data: { message: string } } }).response.data.message
            : 'Unable to load orders right now.'

        if (isMounted) {
          setErrorMessage(message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [navigate])

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-210">
          <h1 className="mb-7 text-center font-serif text-[44px] text-[#262b33]">My Orders</h1>

          {isLoading ? <p className="text-center text-[18px] text-[#586274]">Loading orders...</p> : null}

          {!isLoading && errorMessage ? (
            <p className="text-center text-[16px] text-[#c82a2f]">{errorMessage}</p>
          ) : null}

          {!isLoading && !errorMessage && orders.length === 0 ? (
            <p className="text-center text-[16px] text-[#586274]">You do not have any orders yet.</p>
          ) : null}

          {!isLoading && !errorMessage && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/my-orders/${order.id}`}
                  className="block rounded border border-gray-200 bg-white p-4 transition hover:border-[#c82a2f]"
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Order ID</p>
                      <p className="text-[16px] font-semibold text-[#2f3743]">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Status</p>
                      <p className="text-[16px] text-[#2f3743]">{order.status}</p>
                    </div>
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Payment</p>
                      <p className="text-[16px] text-[#2f3743]">{order.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Total</p>
                      <p className="text-[16px] text-[#2f3743]">
                        {order.currency} {Number(order.totalPrice).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Placed</p>
                      <p className="text-[16px] text-[#2f3743]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}

          <div className="mt-8 text-center">
            <Link to="/my-profile" className="text-[18px] text-[#c82a2f] hover:underline">Back to Profile</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

MyOrdersPage.displayName = 'MyOrdersPage'
export default MyOrdersPage
