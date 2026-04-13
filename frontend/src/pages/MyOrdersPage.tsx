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

  const accountMenuItems = [
    { label: 'Account Info', href: '/my-profile' },
    { label: 'FlowerMe Profile', href: '/flowerme/profile' },
    { label: 'Payment Methods', href: '/my-profile' },
    { label: 'Orders Placed', href: '/my-orders', isActive: true },
    { label: 'Orders Received', href: '/my-orders' },
    { label: 'My Subscriptions', href: '/my-orders' },
    { label: 'My Credits', href: '/my-profile' },
  ]

  const handleSignOut = () => {
    authService.clearSession()
    navigate('/sign-in')
  }

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
      <section className="border-t border-gray-200 bg-[#f4f4f4] px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-270">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
            <aside className="bg-transparent">
              <nav className="border-t border-gray-200 bg-transparent">
                {accountMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center justify-between border-b border-gray-200 px-0 py-4 text-[19px] font-normal ${
                      item.isActive ? 'text-[#1f2328]' : 'text-[#7b8491] hover:text-[#1f2328]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[20px] text-gray-500">›</span>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-between border-b border-gray-200 px-0 py-4 text-left text-[19px] font-normal text-[#7b8491] hover:text-[#1f2328]"
                >
                  <span>Sign Out</span>
                  <span className="text-[20px] text-gray-500">›</span>
                </button>
              </nav>
            </aside>

            <div className="pb-2">
              <h1 className="mb-6 text-center text-[36px] font-semibold text-[#2b2f36] md:text-[42px]">Orders Placed</h1>

              {isLoading ? (
                <div className="border border-gray-200 bg-white px-8 py-5 text-[16px] text-[#586274]">Loading orders...</div>
              ) : null}

              {!isLoading && errorMessage ? (
                <div className="border border-gray-200 bg-white px-8 py-5 text-[16px] text-[#c82a2f]">{errorMessage}</div>
              ) : null}

              {!isLoading && !errorMessage && orders.length === 0 ? (
                <div className="border border-gray-200 bg-white px-8 py-5 text-[16px] text-[#2f3743]">No orders placed.</div>
              ) : null}

              {!isLoading && !errorMessage && orders.length > 0 ? (
                <div className="space-y-3.5">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/my-orders/${order.id}`}
                      className="block border border-gray-200 bg-white px-6 py-4.5 transition hover:border-[#c82a2f]"
                    >
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-[1.1fr_1fr_1fr_0.9fr_1fr]">
                        <div>
                          <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Order ID</p>
                          <p className="mt-1 text-[16px] font-semibold text-[#2f3743]">#{order.id}</p>
                        </div>
                        <div>
                          <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Status</p>
                          <p className="mt-1 text-[16px] text-[#2f3743] wrap-break-word">{order.status}</p>
                        </div>
                        <div>
                          <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Payment</p>
                          <p className="mt-1 text-[16px] text-[#2f3743] wrap-break-word">{order.paymentStatus}</p>
                        </div>
                        <div>
                          <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Total</p>
                          <p className="mt-1 text-[16px] text-[#2f3743] whitespace-nowrap">
                            {order.currency} {Number(order.totalPrice).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Placed</p>
                          <p className="mt-1 text-[16px] text-[#2f3743] whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

MyOrdersPage.displayName = 'MyOrdersPage'
export default MyOrdersPage
