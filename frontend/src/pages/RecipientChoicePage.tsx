import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { recipientService } from '@/api/recipient'
import type { RecipientTokenDetails } from '@/api/recipient'

const RecipientChoicePage: React.FC = () => {
  const { token = '' } = useParams<{ token: string }>()

  const [details, setDetails] = useState<RecipientTokenDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')

  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const minDate = useMemo(() => {
    const now = new Date()
    return now.toISOString().slice(0, 10)
  }, [])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      if (!token.trim()) {
        setErrorMessage('Invalid recipient link.')
        setLoading(false)
        return
      }

      setLoading(true)
      setErrorMessage(null)

      try {
        const result = await recipientService.getByToken(token)
        if (!mounted) return

        setDetails(result)
        const firstWithinBudget = result.products.find((product) => product.withinBudget)
        setSelectedProductId(firstWithinBudget ? firstWithinBudget.id : (result.products[0]?.id ?? null))
      } catch (error: unknown) {
        if (!mounted) return
        const message =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
            ? (error as { response: { data: { message: string } } }).response.data.message
            : 'Unable to load recipient choice details.'

        setErrorMessage(message)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      mounted = false
    }
  }, [token])

  const handleAccept = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedProductId) {
      setSubmitError('Please select a bouquet.')
      return
    }

    if (deliveryAddress.trim().length < 5) {
      setSubmitError('Please enter a valid delivery address.')
      return
    }

    if (!deliveryDate) {
      setSubmitError('Please choose a delivery date.')
      return
    }

    setSubmitLoading(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const response = await recipientService.accept({
        token,
        chosenProductId: selectedProductId,
        deliveryAddress: deliveryAddress.trim(),
        deliveryDate,
      })

      setSubmitSuccess(`Flowers accepted successfully. Order #${response.orderId} is confirmed.`)
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Could not accept flowers right now.'

      setSubmitError(message)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleReject = async () => {
    setSubmitLoading(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const response = await recipientService.reject({ token })
      setSubmitSuccess(`Flowers declined. Order #${response.orderId} has been cancelled.`)
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Could not decline flowers right now.'

      setSubmitError(message)
    } finally {
      setSubmitLoading(false)
    }
  }

  const selectedProduct = details?.products.find((product) => product.id === selectedProductId) ?? null

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-center font-serif text-[42px] text-[#262b33]">You've Got Flowers</h1>

          {loading ? <p className="text-center text-[#586274]">Loading recipient options...</p> : null}

          {errorMessage ? <p className="text-center text-[15px] text-[#c82a2f]">{errorMessage}</p> : null}

          {details && !loading ? (
            <>
              <p className="mx-auto mb-6 max-w-2xl text-center text-[16px] text-[#586274]">
                Hi {details.recipientName}, choose your bouquet and delivery details.
              </p>

              <div className="mb-6 rounded border border-gray-200 bg-white p-5 md:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Budget</p>
                    <p className="text-[20px] font-semibold text-[#2f3743]">${Number(details.budget).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Link expires</p>
                    <p className="text-[16px] text-[#2f3743]">{new Date(details.expiresAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Available bouquets</p>
                    <p className="text-[16px] text-[#2f3743]">{details.products.length}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAccept} className="rounded border border-gray-200 bg-white p-5 md:p-6">
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Choose bouquet</span>
                  <select
                    value={selectedProductId ?? ''}
                    onChange={(event) => setSelectedProductId(Number(event.target.value))}
                    className="h-11 border border-gray-300 px-3 text-[16px]"
                    required
                  >
                    {details.products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.itemCode}) - ${Number(product.price).toFixed(2)}
                        {product.withinBudget ? '' : ' (above budget)'}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedProduct ? (
                  <p className="mt-2 text-[14px] text-[#586274]">
                    Selected: {selectedProduct.name} for ${Number(selectedProduct.price).toFixed(2)}
                  </p>
                ) : null}

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Delivery address</span>
                    <input
                      value={deliveryAddress}
                      onChange={(event) => setDeliveryAddress(event.target.value)}
                      className="h-11 border border-gray-300 px-3 text-[16px]"
                      required
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">Delivery date</span>
                    <input
                      type="date"
                      min={minDate}
                      value={deliveryDate}
                      onChange={(event) => setDeliveryDate(event.target.value)}
                      className="h-11 border border-gray-300 px-3 text-[16px]"
                      required
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="inline-flex h-11 items-center justify-center bg-[#c82a2f] px-6 text-white transition hover:bg-[#a81f24] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitLoading ? 'Submitting...' : 'Accept Flowers'}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleReject()}
                    disabled={submitLoading}
                    className="inline-flex h-11 items-center justify-center border border-gray-300 bg-white px-6 text-[#2f3743] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Decline Flowers
                  </button>
                </div>
              </form>

              {submitError ? <p className="mt-4 text-[15px] text-[#c82a2f]">{submitError}</p> : null}
              {submitSuccess ? <p className="mt-4 text-[15px] text-green-700">{submitSuccess}</p> : null}
            </>
          ) : null}
        </div>
      </section>
    </Layout>
  )
}

RecipientChoicePage.displayName = 'RecipientChoicePage'

export default RecipientChoicePage
