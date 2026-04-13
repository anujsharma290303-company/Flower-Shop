import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { useBouquetStore } from '../store/bouquetStore'
import { bouquetService } from '@/api/bouquet'
import BouquetStepOne from '../components/bouquet/BouquetStepOne'
import BouquetStepTwo from '../components/bouquet/BouquetStepTwo'
import BouquetStepThree from '../components/bouquet/BouquetStepThree'

const CustomBouquetBuilderPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    bouquetForm,
    currentStep,
    nextStep,
    prevStep,
    resetBouquetForm,
    addToCart,
    setBouquetType,
  } = useBouquetStore()

  // Determine bouquet type from URL or query param
  const typeParam = searchParams.get('type') || 'sender'
  const bouquetType = typeParam === 'recipient' ? 'recipient' : 'sender'

  useEffect(() => {
    if (bouquetForm.type !== bouquetType) {
      resetBouquetForm()
      setBouquetType(bouquetType)
    }
  }, [bouquetType, bouquetForm.type, resetBouquetForm, setBouquetType])

  const handleNext = async () => {
    // Validate current step before proceeding
    if (currentStep === 0) {
      // Step 1: Validate flowers and colors
      if (!bouquetForm.flowerTypes || bouquetForm.flowerTypes.length === 0) {
        setSubmitError('Please select at least one flower type')
        return
      }
      if (!bouquetForm.colors || bouquetForm.colors.length === 0) {
        setSubmitError('Please select at least one color')
        return
      }
    } else if (currentStep === 1) {
      // Step 2: Validate price and container
      if (!bouquetForm.pricePoint || bouquetForm.pricePoint < 25) {
        setSubmitError('Please select a valid price point (minimum $25)')
        return
      }
      if (!bouquetForm.containerStyle) {
        setSubmitError('Please select a container style')
        return
      }
    }

    setSubmitError(null)
    nextStep()
  }

  const handlePrevious = () => {
    setSubmitError(null)
    prevStep()
  }

  const handleSubmit = async () => {
    // Final validation
    if (!bouquetForm.pricePoint || bouquetForm.pricePoint < 25) {
      setSubmitError('Please select a valid price point')
      return
    }

    if (!bouquetForm.flowerTypes || bouquetForm.flowerTypes.length === 0) {
      setSubmitError('Please select at least one flower type')
      return
    }

    if (!bouquetForm.containerStyle) {
      setSubmitError('Please select a container style')
      return
    }

    setSubmitLoading(true)
    setSubmitError(null)

    try {
      const response = await bouquetService.create({
        type: bouquetForm.type!,
        pricePoint: bouquetForm.pricePoint,
        colors: bouquetForm.colors,
        flowerTypes: bouquetForm.flowerTypes,
        containerStyle: bouquetForm.containerStyle,
        occasion: bouquetForm.occasion,
        extras: bouquetForm.extras,
        note: bouquetForm.note,
        orderId: bouquetForm.orderId,
      })

      // Add to cart
      addToCart({
        id: `bouquet-${response.id}`,
        type: 'bouquet',
        bouquetData: bouquetForm,
        quantity: 1,
        price: bouquetForm.pricePoint,
        name: `Custom ${bouquetType.charAt(0).toUpperCase() + bouquetType.slice(1)} Bouquet`,
      })

      // Reset and redirect to cart-first flow
      resetBouquetForm()
      navigate('/cart')
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Failed to create custom bouquet. Please try again.'

      setSubmitError(message)
    } finally {
      setSubmitLoading(false)
    }
  }

  const stepTitle = {
    0: 'Choose Your Flowers & Colors',
    1: 'Select Container & Occasion',
    2: 'Review & Add to Cart',
  }

  const stepDescription = {
    0: 'Select the flowers and colors for your custom bouquet',
    1: 'Choose your container style and occasion (optional)',
    2: 'Review your custom bouquet and add it to your cart',
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-center font-serif text-[42px] text-[#262b33]">
            {bouquetType === 'sender' ? "Create Your Own Bouquet" : 'Choose Your Recipient Bouquet'}
          </h1>
          <p className="mb-8 text-center text-[16px] text-[#586274]">
            {bouquetType === 'sender'
              ? 'Build a custom bouquet and send flowers your way'
              : 'Let the recipient choose their perfect bouquet'}
          </p>

          {/* Step Indicator */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {[0, 1, 2].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                    step === currentStep
                      ? 'bg-[#c82a2f] text-white'
                      : step < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {step < currentStep ? '✓' : step + 1}
                </div>
                {step < 2 && <div className="h-1 w-8 bg-gray-300" />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8 rounded border border-gray-200 bg-white p-6">
            <h2 className="mb-2 text-[20px] font-semibold text-[#2f3743]">{stepTitle[currentStep as 0 | 1 | 2]}</h2>
            <p className="mb-6 text-[14px] text-[#586274]">{stepDescription[currentStep as 0 | 1 | 2]}</p>

            {currentStep === 0 && <BouquetStepOne />}
            {currentStep === 1 && <BouquetStepTwo />}
            {currentStep === 2 && <BouquetStepThree bouquetType={bouquetType} />}

            {submitError && <p className="mb-4 text-[14px] text-[#c82a2f]">{submitError}</p>}

            {/* Navigation Buttons */}
            <div className="mt-6 flex gap-3">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={submitLoading}
                  className="inline-flex h-11 items-center justify-center border border-gray-300 bg-white px-6 text-[#2f3743] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Previous
                </button>
              )}

              {currentStep < 2 && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={submitLoading}
                  className="ml-auto inline-flex h-11 items-center justify-center bg-[#c82a2f] px-6 text-white transition hover:bg-[#a81f24] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitLoading ? 'Loading...' : 'Next'}
                </button>
              )}

              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="ml-auto inline-flex h-11 items-center justify-center bg-[#c82a2f] px-6 text-white transition hover:bg-[#a81f24] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitLoading ? 'Creating Bouquet...' : 'Add to Cart'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

CustomBouquetBuilderPage.displayName = 'CustomBouquetBuilderPage'

export default CustomBouquetBuilderPage
