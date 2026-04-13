import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { useBouquetStore } from '../store/bouquetStore'
import { bouquetService } from '@/api/bouquet'
import { SOCIAL_FLOWERS_HOMEPAGE } from '@/utils/socialflowersHomepage'

const CustomBouquetBuilderPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [purchaseOption, setPurchaseOption] = useState<'one-time' | 'subscribe'>('one-time')
  const [showAccountBilling, setShowAccountBilling] = useState(false)
  const [showOrderPreview, setShowOrderPreview] = useState(false)
  const [recipientCardMessage, setRecipientCardMessage] = useState('')
  const [senderCardMessage, setSenderCardMessage] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [recipientCountry, setRecipientCountry] = useState('')
  const [senderSignatureName, setSenderSignatureName] = useState('')
  const [messageToRecipient, setMessageToRecipient] = useState('')
  const [deliveryAddressMode, setDeliveryAddressMode] = useState('Provided by Recipient')
  const [noEmailOrMobile, setNoEmailOrMobile] = useState(false)

  const {
    bouquetForm,
    resetBouquetForm,
    addToCart,
    setBouquetType,
    setBouquetPrice,
    setBouquetNote,
    setBouquetColors,
    setBouquetFlowerTypes,
    setBouquetContainer,
    setBouquetOccasion,
  } = useBouquetStore()

  // Determine bouquet type from URL path or query param
  const isRecipientPath = /let-recipient-choose-flowers|recipient-choice-bouquet/i.test(location.pathname)
  const typeParam = searchParams.get('type') || (isRecipientPath ? 'recipient' : 'sender')
  const bouquetType = typeParam === 'recipient' ? 'recipient' : 'sender'
  const isRecipientFlow = bouquetType === 'recipient'
  const recipientMinPrice = 120
  const recipientMaxPrice = 500
  const senderMinPrice = 120
  const senderMaxPrice = 500

  const effectiveRecipientPrice = bouquetForm.pricePoint && bouquetForm.pricePoint >= recipientMinPrice
    ? bouquetForm.pricePoint
    : recipientMinPrice
  const effectiveSenderPrice = bouquetForm.pricePoint && bouquetForm.pricePoint >= senderMinPrice
    ? bouquetForm.pricePoint
    : senderMinPrice

  const senderColorOptions = ['Red', 'Pink', 'Yellow', 'Blue', 'White', 'Orange / Peach', 'Purple', 'Green']
  const senderFlowerOptions = [
    'Alstroemeria',
    'Carnations',
    'Chrysanthemums - Spider Mums',
    'Hydrangea',
    'Peonies',
    'Spray Roses',
    'Calla Lilies',
    'Chrysanthemums - Pompons',
    'Gerbera Daisies',
    'Lilies',
    'Roses',
    'Sunflowers',
  ]
  const senderContainerOptions = ['Glass Vase', 'Ceramic Vase', 'Wooden Box', 'Metal Container', 'Wicker Basket']
  const senderOccasionOptions = ['Birthday', 'Anniversary', 'Love & Romance', 'Sympathy', 'Congratulations', 'Thank You', 'Get Well Soon', 'Just Because']

  useEffect(() => {
    if (bouquetForm.type !== bouquetType) {
      resetBouquetForm()
      setBouquetType(bouquetType)
    }
  }, [bouquetType, bouquetForm.type, resetBouquetForm, setBouquetType])

  useEffect(() => {
    if (isRecipientFlow) {
      if (!bouquetForm.pricePoint || bouquetForm.pricePoint < recipientMinPrice) {
        setBouquetPrice(recipientMinPrice)
      }
      setRecipientCardMessage(bouquetForm.note || '')
    }
  }, [bouquetForm.note, bouquetForm.pricePoint, isRecipientFlow, setBouquetPrice])

  useEffect(() => {
    if (!isRecipientFlow) {
      if (!bouquetForm.pricePoint || bouquetForm.pricePoint < senderMinPrice) {
        setBouquetPrice(senderMinPrice)
      }
      setSenderCardMessage(bouquetForm.note || '')
    }
  }, [bouquetForm.note, bouquetForm.pricePoint, isRecipientFlow, senderMinPrice, setBouquetPrice])

  const handleSubmit = async () => {
    const normalizedPrice = Number(bouquetForm.pricePoint || 0)

    // Final validation
    if (isRecipientFlow) {
      if (!normalizedPrice || normalizedPrice < recipientMinPrice || normalizedPrice > recipientMaxPrice) {
        setSubmitError(`Please enter a price between $${recipientMinPrice} and $${recipientMaxPrice}`)
        return
      }
    } else {
      if (!normalizedPrice || normalizedPrice < senderMinPrice || normalizedPrice > senderMaxPrice) {
        setSubmitError(`Please enter a price between $${senderMinPrice} and $${senderMaxPrice}`)
        return
      }
    }

    setSubmitLoading(true)
    setSubmitError(null)

    try {
      const trimmedMessage = isRecipientFlow ? recipientCardMessage.trim() : senderCardMessage.trim()
      const response = await bouquetService.create({
        type: bouquetForm.type!,
        pricePoint: normalizedPrice,
        colors: isRecipientFlow ? [] : bouquetForm.colors,
        flowerTypes: isRecipientFlow ? [] : bouquetForm.flowerTypes,
        containerStyle: isRecipientFlow ? null : bouquetForm.containerStyle,
        occasion: isRecipientFlow ? null : bouquetForm.occasion,
        extras: isRecipientFlow ? [] : bouquetForm.extras,
        note: trimmedMessage || bouquetForm.note,
        orderId: bouquetForm.orderId,
      })

      // Add to cart
      addToCart({
        id: `bouquet-${response.id}`,
        type: 'bouquet',
        bouquetData: bouquetForm,
        quantity: 1,
        price: normalizedPrice,
        name: isRecipientFlow ? "Recipient's Choice: Custom Bouquet" : "Sender's Choice: Custom Bouquet",
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

  if (isRecipientFlow) {
    const handleRecipientPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value)
      if (Number.isNaN(value)) {
        setBouquetPrice(recipientMinPrice)
        return
      }
      setBouquetPrice(value)
      setSubmitError(null)
    }

    const handleBuyNow = () => {
      const checkoutSection = document.getElementById('recipient-checkout')
      if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    return (
      <Layout>
        <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-8 md:px-6 md:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
              <div>
                <img
                  src={SOCIAL_FLOWERS_HOMEPAGE.customBouquets.recipientsChoiceImage}
                  alt="Recipient's Choice: Custom Bouquet"
                  className="h-auto w-full object-cover"
                  loading="eager"
                />
              </div>

              <div>
                <h1 className="text-[46px] font-semibold leading-tight text-[#262b33] md:text-[52px]">Recipient&apos;s Choice: Custom Bouquet</h1>
                <p className="mt-3 text-[30px] text-[#586274]">Starting at $120</p>

                <div className="mt-6 flex items-center gap-8 border-b border-gray-200 pb-2">
                  <span className="border-b-2 border-[#c82a2f] pb-2 text-[30px] font-semibold text-[#c82a2f]">Description</span>
                  <span className="pb-2 text-[30px] text-[#2f3743]">Billing</span>
                  <span className="pb-2 text-[30px] text-[#2f3743]">Delivery</span>
                </div>

                <div className="mt-4 space-y-2 text-[16px] leading-[1.45] text-[#586274] md:text-[30px] md:leading-[1.35]">
                  <p>They Create the Bouquet</p>
                  <ul className="space-y-1.5 pl-6 text-[#2f3743]">
                    <li className="list-disc marker:text-[#c82a2f]">Let them have flowers their way!</li>
                    <li className="list-disc marker:text-[#c82a2f]">Your recipient tells us what they want and we do the rest</li>
                    <li className="list-disc marker:text-[#c82a2f]">You set the price, your special someone selects colors, flower types, style of container</li>
                    <li className="list-disc marker:text-[#c82a2f]">Perfect for when you&apos;re not sure what to send</li>
                    <li className="list-disc marker:text-[#c82a2f]">Prices from $120 to $500 let you create the splash you want</li>
                    <li className="list-disc marker:text-[#c82a2f]">Set your price below and surprise them by letting them create the bouquet!</li>
                  </ul>
                </div>

                <div className="mt-10">
                  <h2 className="text-[40px] font-semibold text-[#2f3743] md:text-[48px]">Purchase Options</h2>
                  <div className="mt-4 space-y-2 text-[28px] text-[#2f3743] md:text-[34px]">
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={purchaseOption === 'one-time'}
                        onChange={() => setPurchaseOption('one-time')}
                        className="h-5 w-5 accent-[#c82a2f]"
                      />
                      <span>One-time purchase</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={purchaseOption === 'subscribe'}
                        onChange={() => setPurchaseOption('subscribe')}
                        className="h-5 w-5 accent-[#c82a2f]"
                      />
                      <span>Subscribe</span>
                    </label>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-[40px] font-semibold text-[#2f3743] md:text-[48px]">Your Price</h3>
                  <input
                    type="number"
                    min={recipientMinPrice}
                    max={recipientMaxPrice}
                    step={1}
                    value={effectiveRecipientPrice}
                    onChange={handleRecipientPriceChange}
                    className="mt-3 h-14 w-65 border border-gray-300 px-4 text-[26px] text-[#2f3743] outline-none focus:border-[#c82a2f]"
                  />
                  <p className="mt-3 text-[20px] text-[#828a97] md:text-[24px]">
                    This is the total price you want to pay which includes delivery and tax.
                  </p>
                  <p className="mt-4 text-[22px] text-[#586274] md:text-[28px]">
                    Recipient selects colors, flower types, container style.
                  </p>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="mt-6 inline-flex h-14 items-center justify-center bg-[#d40000] px-10 text-[26px] font-semibold text-white transition hover:bg-[#b70000]"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            <div id="recipient-checkout" className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="mb-6 text-[42px] font-semibold text-[#2f3743] md:text-[52px]">Checkout</h2>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                  <div className="rounded border border-gray-200 bg-white p-5">
                    <label htmlFor="recipient-card-message" className="mb-3 block text-[24px] font-medium text-[#2f3743] md:text-[30px]">
                      Card Message *
                    </label>
                    <textarea
                      id="recipient-card-message"
                      value={recipientCardMessage}
                      onChange={(event) => {
                        setRecipientCardMessage(event.target.value)
                        setBouquetNote(event.target.value.trim() || null)
                      }}
                      placeholder="This is the note that will appear on the card with your flowers."
                      rows={4}
                      maxLength={2000}
                      className="w-full border border-gray-300 p-4 text-[20px] text-[#2f3743] outline-none focus:border-[#c82a2f]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAccountBilling((open) => !open)}
                    className="flex w-full items-center justify-between border border-gray-200 bg-[#f8f1f0] px-4 py-4 text-left text-[30px] font-semibold text-[#2f3743]"
                  >
                    <span>Your Account &amp; Billing</span>
                    <span>{showAccountBilling ? '−' : '⌄'}</span>
                  </button>
                  {showAccountBilling ? (
                    <div className="rounded border border-gray-200 bg-white p-4 text-[20px] text-[#586274]">
                      You will complete account and billing details on the next step after placing this order.
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setShowOrderPreview((open) => !open)}
                    className="flex w-full items-center justify-between border border-gray-200 bg-[#f8f1f0] px-4 py-4 text-left text-[30px] font-semibold text-[#2f3743]"
                  >
                    <span>Order Preview</span>
                    <span>{showOrderPreview ? '−' : '⌄'}</span>
                  </button>
                  {showOrderPreview ? (
                    <div className="rounded border border-gray-200 bg-white p-4 text-[20px] text-[#586274]">
                      Recipient&apos;s Choice: Custom Bouquet - ${effectiveRecipientPrice}+
                    </div>
                  ) : null}

                  {submitError ? <p className="text-[18px] text-[#c82a2f]">{submitError}</p> : null}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitLoading}
                    className="inline-flex h-14 min-w-52 items-center justify-center bg-[#d40000] px-10 text-[26px] font-semibold text-white transition hover:bg-[#b70000] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitLoading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>

                <aside className="h-fit border border-gray-200 bg-white">
                  <div className="border-b border-gray-200 bg-[#f8f1f0] px-4 py-4">
                    <h3 className="text-[30px] font-semibold text-[#2f3743]">Item Information</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                      <img
                        src={SOCIAL_FLOWERS_HOMEPAGE.customBouquets.recipientsChoiceImage}
                        alt="Recipient's Choice bouquet"
                        className="h-22 w-22 object-cover"
                        loading="lazy"
                      />
                      <div>
                        <p className="text-[20px] font-semibold leading-tight text-[#2f3743]">Recipient&apos;s Choice: Custom Bouquet</p>
                        <p className="mt-2 text-[34px] font-semibold text-[#586274]">${effectiveRecipientPrice}+</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[34px] font-semibold text-[#2f3743]">Grand Total</span>
                        <span className="text-[40px] font-semibold text-[#586274]">${effectiveRecipientPrice}+</span>
                      </div>
                      <p className="mt-2 text-[20px] text-[#828a97]">Includes delivery and tax.</p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    )
  }

  const handleSenderPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    if (Number.isNaN(value)) {
      setBouquetPrice(senderMinPrice)
      return
    }
    setBouquetPrice(value)
    setSubmitError(null)
  }

  const toggleSenderColor = (label: string) => {
    const id = label.toLowerCase().replace(/\s+|\//g, '-')
    if (bouquetForm.colors.includes(id)) {
      setBouquetColors(bouquetForm.colors.filter((item) => item !== id))
      return
    }
    if (bouquetForm.colors.length >= 3) {
      setSubmitError('Select up to three colors.')
      return
    }
    setSubmitError(null)
    setBouquetColors([...bouquetForm.colors, id])
  }

  const toggleSenderFlower = (label: string) => {
    const id = label.toLowerCase().replace(/\s+|\//g, '-')
    if (bouquetForm.flowerTypes.includes(id)) {
      setBouquetFlowerTypes(bouquetForm.flowerTypes.filter((item) => item !== id))
      return
    }
    if (bouquetForm.flowerTypes.length >= 3) {
      setSubmitError('Select up to three flower types.')
      return
    }
    setSubmitError(null)
    setBouquetFlowerTypes([...bouquetForm.flowerTypes, id])
  }

  const handleSenderBuyNow = () => {
    const checkoutSection = document.getElementById('sender-checkout')
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
            <div>
              <img
                src={SOCIAL_FLOWERS_HOMEPAGE.customBouquets.sendersChoiceImage}
                alt="Sender's Choice: Custom Bouquet"
                className="h-auto w-full object-cover"
                loading="eager"
              />
            </div>

            <div>
              <h1 className="text-[46px] font-semibold leading-tight text-[#262b33] md:text-[52px]">Sender&apos;s Choice: Custom Bouquet</h1>
              <p className="mt-3 text-[30px] text-[#586274]">Starting at $120</p>

              <div className="mt-6 flex items-center gap-8 border-b border-gray-200 pb-2">
                <span className="border-b-2 border-[#c82a2f] pb-2 text-[30px] font-semibold text-[#c82a2f]">Description</span>
                <span className="pb-2 text-[30px] text-[#2f3743]">Billing</span>
                <span className="pb-2 text-[30px] text-[#2f3743]">Delivery</span>
              </div>

              <div className="mt-4 space-y-2 text-[16px] leading-[1.45] text-[#586274] md:text-[30px] md:leading-[1.35]">
                <p>Create Your Bouquet</p>
                <ul className="space-y-1.5 pl-6 text-[#2f3743]">
                  <li className="list-disc marker:text-[#c82a2f]">Have flowers your way!</li>
                  <li className="list-disc marker:text-[#c82a2f]">Tell us what you want and we do the rest</li>
                  <li className="list-disc marker:text-[#c82a2f]">Set your price and choose any of the following: colors, flower types, style of container, the occasion</li>
                  <li className="list-disc marker:text-[#c82a2f]">Our florist designer creates the bouquet to your specifications</li>
                  <li className="list-disc marker:text-[#c82a2f]">Prices from $120 to $500 let you create the splash you want</li>
                  <li className="list-disc marker:text-[#c82a2f]">Impress your special someone with your custom bouquet!</li>
                  <li className="list-disc marker:text-[#c82a2f]">Start now and tell us what you want below</li>
                </ul>
                <p className="pt-2 text-right text-[#2f3743]">
                  Not sure what to send?{' '}
                  <a href="/let-recipient-choose-flowers" className="text-[#c82a2f] hover:underline">Let your recipient decide!</a>
                </p>
              </div>

              <div className="mt-10">
                <h2 className="text-[40px] font-semibold text-[#2f3743] md:text-[48px]">Purchase Options</h2>
                <div className="mt-4 space-y-2 text-[28px] text-[#2f3743] md:text-[34px]">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={purchaseOption === 'one-time'}
                      onChange={() => setPurchaseOption('one-time')}
                      className="h-5 w-5 accent-[#c82a2f]"
                    />
                    <span>One-time purchase</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={purchaseOption === 'subscribe'}
                      onChange={() => setPurchaseOption('subscribe')}
                      className="h-5 w-5 accent-[#c82a2f]"
                    />
                    <span>Subscribe</span>
                  </label>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-[40px] font-semibold text-[#2f3743] md:text-[48px]">Your Price</h3>
                <input
                  type="number"
                  min={senderMinPrice}
                  max={senderMaxPrice}
                  step={1}
                  value={effectiveSenderPrice}
                  onChange={handleSenderPriceChange}
                  className="mt-3 h-14 w-65 border border-gray-300 px-4 text-[26px] text-[#2f3743] outline-none focus:border-[#c82a2f]"
                />
                <p className="mt-3 text-[20px] text-[#828a97] md:text-[24px]">This is the total price you want to pay which includes delivery and tax.</p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h4 className="text-[34px] font-semibold text-[#2f3743]">Colors (Optional)</h4>
                  <p className="text-[20px] text-[#828a97]">Choose up to three colors.</p>
                  <div className="mt-3 space-y-2 text-[26px] text-[#2f3743]">
                    {senderColorOptions.map((color) => {
                      const id = color.toLowerCase().replace(/\s+|\//g, '-')
                      return (
                        <label key={color} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={bouquetForm.colors.includes(id)}
                            onChange={() => toggleSenderColor(color)}
                            className="h-5 w-5 accent-[#c82a2f]"
                          />
                          <span>{color}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-[34px] font-semibold text-[#2f3743]">Flower Types (Optional)</h4>
                  <p className="text-[20px] text-[#828a97]">Choose up to three flower types.</p>
                  <div className="mt-3 space-y-2 text-[26px] text-[#2f3743]">
                    {senderFlowerOptions.map((flower) => {
                      const id = flower.toLowerCase().replace(/\s+|\//g, '-')
                      return (
                        <label key={flower} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={bouquetForm.flowerTypes.includes(id)}
                            onChange={() => toggleSenderFlower(flower)}
                            className="h-5 w-5 accent-[#c82a2f]"
                          />
                          <span>{flower}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-[34px] font-semibold text-[#2f3743]">Container Style (Optional)</h4>
                  <p className="text-[20px] text-[#828a97]">Choose your style of container.</p>
                  <select
                    value={bouquetForm.containerStyle || ''}
                    onChange={(event) => setBouquetContainer(event.target.value || null)}
                    className="mt-3 h-14 w-full border border-gray-300 px-3 text-[24px] text-[#2f3743] outline-none focus:border-[#c82a2f]"
                  >
                    <option value="">--Select Container Style--</option>
                    {senderContainerOptions.map((item) => (
                      <option key={item} value={item.toLowerCase().replace(/\s+/g, '-')}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h4 className="text-[34px] font-semibold text-[#2f3743]">Occasion (Optional)</h4>
                  <p className="text-[20px] text-[#828a97]">Choose the occasion you're sending flowers for.</p>
                  <select
                    value={bouquetForm.occasion || ''}
                    onChange={(event) => setBouquetOccasion(event.target.value || null)}
                    className="mt-3 h-14 w-full border border-gray-300 px-3 text-[24px] text-[#2f3743] outline-none focus:border-[#c82a2f]"
                  >
                    <option value="">--Select Occasion--</option>
                    {senderOccasionOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSenderBuyNow}
                className="mt-8 inline-flex h-14 items-center justify-center bg-[#d40000] px-10 text-[26px] font-semibold text-white transition hover:bg-[#b70000]"
              >
                Buy Now
              </button>
            </div>
          </div>

          <div id="sender-checkout" className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="mb-6 text-[42px] font-semibold text-[#2f3743] md:text-[52px]">Checkout</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <div className="rounded border border-gray-200 bg-white">
                  <div className="flex items-center justify-between border-b border-gray-200 bg-[#f8f1f0] px-4 py-4 text-[30px] font-semibold text-[#2f3743]">
                    <span>Recipient and Delivery Information</span>
                    <span>⌃</span>
                  </div>
                  <div className="space-y-4 p-4">
                    <label className="block text-[22px] text-[#2f3743]">
                      Recipient Name *
                      <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="mt-2 h-12 w-full border border-gray-300 px-3 text-[20px]" />
                    </label>
                    <label className="block text-[22px] text-[#2f3743]">
                      Flower Delivery Address *
                      <select value={deliveryAddressMode} onChange={(e) => setDeliveryAddressMode(e.target.value)} className="mt-2 h-12 w-full border border-gray-300 px-3 text-[20px]">
                        <option>Provided by Recipient</option>
                        <option>Provided by Me</option>
                      </select>
                    </label>
                    <p className="text-[20px] leading-[1.45] text-[#586274]">Enter the recipient info you have. We contact them and ask them to provide a delivery address and to choose a date to receive the flowers.</p>
                    <label className="block text-[22px] text-[#2f3743]">
                      Recipient Email Address
                      <input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="mt-2 h-12 w-full border border-gray-300 px-3 text-[20px]" />
                    </label>
                    <label className="block text-[22px] text-[#2f3743]">
                      Recipient Mobile Phone Number
                      <input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} className="mt-2 h-12 w-full border border-gray-300 px-3 text-[20px]" />
                    </label>
                    <label className="flex items-center gap-3 text-[22px] text-[#586274]">
                      <input type="checkbox" checked={noEmailOrMobile} onChange={(e) => setNoEmailOrMobile(e.target.checked)} className="h-5 w-5 accent-[#c82a2f]" />
                      <span>I don't have their email or mobile</span>
                    </label>
                    <label className="block text-[22px] text-[#2f3743]">
                      Message To Recipient
                      <textarea value={messageToRecipient} onChange={(e) => setMessageToRecipient(e.target.value)} rows={3} className="mt-2 w-full border border-gray-300 p-3 text-[20px]" />
                    </label>
                    <label className="block text-[22px] text-[#2f3743]">
                      Recipient Country *
                      <select value={recipientCountry} onChange={(e) => setRecipientCountry(e.target.value)} className="mt-2 h-12 w-full border border-gray-300 px-3 text-[20px]">
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                      </select>
                    </label>
                    <h4 className="pt-2 text-[30px] font-semibold text-[#2f3743]">Signature and Message</h4>
                    <label className="block text-[22px] text-[#2f3743]">
                      Your Name On This Order *
                      <input value={senderSignatureName} onChange={(e) => setSenderSignatureName(e.target.value)} className="mt-2 h-12 w-full border border-gray-300 px-3 text-[20px]" />
                    </label>
                    <label className="block text-[22px] text-[#2f3743]">
                      Card Message *
                      <textarea
                        value={senderCardMessage}
                        onChange={(event) => {
                          setSenderCardMessage(event.target.value)
                          setBouquetNote(event.target.value.trim() || null)
                        }}
                        rows={3}
                        placeholder="This is the note that will appear on the card with your flowers."
                        className="mt-2 w-full border border-gray-300 p-3 text-[20px]"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAccountBilling((open) => !open)}
                  className="flex w-full items-center justify-between border border-gray-200 bg-[#f8f1f0] px-4 py-4 text-left text-[30px] font-semibold text-[#2f3743]"
                >
                  <span>Your Account &amp; Billing</span>
                  <span>{showAccountBilling ? '−' : '⌄'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowOrderPreview((open) => !open)}
                  className="flex w-full items-center justify-between border border-gray-200 bg-[#f8f1f0] px-4 py-4 text-left text-[30px] font-semibold text-[#2f3743]"
                >
                  <span>Order Preview</span>
                  <span>{showOrderPreview ? '−' : '⌄'}</span>
                </button>

                {submitError ? <p className="text-[18px] text-[#c82a2f]">{submitError}</p> : null}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="inline-flex h-14 min-w-52 items-center justify-center bg-[#d40000] px-10 text-[26px] font-semibold text-white transition hover:bg-[#b70000] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>

              <aside className="h-fit border border-gray-200 bg-white">
                <div className="border-b border-gray-200 bg-[#f8f1f0] px-4 py-4">
                  <h3 className="text-[30px] font-semibold text-[#2f3743]">Item Information</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                    <img
                      src={SOCIAL_FLOWERS_HOMEPAGE.customBouquets.sendersChoiceImage}
                      alt="Sender's Choice bouquet"
                      className="h-22 w-22 object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-[20px] font-semibold leading-tight text-[#2f3743]">Sender&apos;s Choice: Custom Bouquet</p>
                      <p className="mt-2 text-[34px] font-semibold text-[#586274]">${effectiveSenderPrice}+</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[34px] font-semibold text-[#2f3743]">Grand Total</span>
                      <span className="text-[40px] font-semibold text-[#586274]">${effectiveSenderPrice}+</span>
                    </div>
                    <p className="mt-2 text-[20px] text-[#828a97]">Includes delivery and tax.</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

CustomBouquetBuilderPage.displayName = 'CustomBouquetBuilderPage'

export default CustomBouquetBuilderPage
