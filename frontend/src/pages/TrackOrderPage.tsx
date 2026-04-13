import React, { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { orderService } from '@/api/orders'
import type { CustomerOrderStatusLog } from '@/types'

type TrackResult = {
  orderId: number
  status: string
  paymentStatus: string
  timeline: CustomerOrderStatusLog[]
}

const TrackOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [result, setResult] = useState<TrackResult | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedOrderId = Number(orderId)
    if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
      setErrorMessage('Please enter a valid order id.')
      setResult(null)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const trackedOrder = await orderService.trackOrder(parsedOrderId, email.trim())
      setResult(trackedOrder)
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Unable to track order right now.'

      setErrorMessage(message)
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-center font-serif text-[42px] text-[#262b33]">Track Your Order</h1>
          <p className="mx-auto mb-8 max-w-2xl text-center text-[16px] text-[#586274]">
            Enter the order id and the customer email used at checkout.
          </p>

          <form onSubmit={handleSubmit} className="rounded border border-gray-200 bg-white p-5 md:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Order ID</span>
                <input
                  type="number"
                  min={1}
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value)}
                  className="h-11 border border-gray-300 px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                  required
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Customer Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 border border-gray-300 px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-5 inline-flex h-11 items-center justify-center bg-[#c82a2f] px-6 text-white transition hover:bg-[#a81f24] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>

          {errorMessage ? <p className="mt-4 text-[15px] text-[#c82a2f]">{errorMessage}</p> : null}

          {result ? (
            <div className="mt-6 rounded border border-gray-200 bg-white p-5 md:p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Order ID</p>
                  <p className="text-[18px] text-[#2f3743]">#{result.orderId}</p>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Status</p>
                  <p className="text-[18px] text-[#2f3743]">{result.status}</p>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Payment</p>
                  <p className="text-[18px] text-[#2f3743]">{result.paymentStatus}</p>
                </div>
              </div>

              <div className="mt-5">
                <h2 className="mb-3 text-[24px] font-semibold text-[#2f3743]">Timeline</h2>
                {result.timeline.length === 0 ? (
                  <p className="text-[15px] text-[#586274]">No status updates yet.</p>
                ) : (
                  <div className="space-y-3">
                    {result.timeline.map((entry) => (
                      <div key={entry.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-[16px] font-semibold text-[#2f3743]">{entry.toStatus}</p>
                        <p className="text-[14px] text-[#586274]">{entry.note || 'Status updated'}</p>
                        <p className="text-[14px] text-[#586274]">{new Date(entry.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </Layout>
  )
}

TrackOrderPage.displayName = 'TrackOrderPage'

export default TrackOrderPage
