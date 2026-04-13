import React, { useState } from 'react'
import { useBouquetStore } from '../../store/bouquetStore'

interface BouquetStepThreeProps {
  bouquetType: 'sender' | 'recipient'
}

const BouquetStepThree: React.FC<BouquetStepThreeProps> = ({ bouquetType }) => {
  const { bouquetForm, setBouquetNote } = useBouquetStore()
  const [noteValue, setNoteValue] = useState(bouquetForm.note || '')

  const handleNoteChange = (value: string) => {
    setNoteValue(value)
    setBouquetNote(value.trim() || null)
  }

  const FLOWER_TYPES = [
    { id: 'roses', label: 'Roses' },
    { id: 'lilies', label: 'Lilies' },
    { id: 'sunflowers', label: 'Sunflowers' },
    { id: 'tulips', label: 'Tulips' },
    { id: 'carnations', label: 'Carnations' },
    { id: 'hydrangeas', label: 'Hydrangeas' },
    { id: 'orchids', label: 'Orchids' },
    { id: 'peonies', label: 'Peonies' },
  ]

  const COLORS = [
    { id: 'red', label: 'Red' },
    { id: 'pink', label: 'Pink' },
    { id: 'white', label: 'White' },
    { id: 'yellow', label: 'Yellow' },
    { id: 'orange', label: 'Orange' },
    { id: 'purple', label: 'Purple' },
    { id: 'peach', label: 'Peach' },
    { id: 'cream', label: 'Cream' },
  ]

  const CONTAINER_STYLES = [
    { id: 'glass-vase', label: 'Glass Vase', price: 0 },
    { id: 'ceramic-vase', label: 'Ceramic Vase', price: 5 },
    { id: 'wooden-box', label: 'Wooden Box', price: 8 },
    { id: 'metal-container', label: 'Metal Container', price: 10 },
    { id: 'wicker-basket', label: 'Wicker Basket', price: 12 },
  ]

  const EXTRAS = [
    { id: 'chocolate', label: 'Chocolate Box', price: 15 },
    { id: 'wine', label: 'Wine Bottle', price: 20 },
    { id: 'teddy-bear', label: 'Teddy Bear', price: 25 },
    { id: 'greeting-card', label: 'Premium Greeting Card', price: 5 },
    { id: 'candle', label: 'Scented Candle', price: 10 },
  ]

  const getFlowerLabel = (id: string) => FLOWER_TYPES.find((f) => f.id === id)?.label || id
  const getColorLabel = (id: string) => COLORS.find((c) => c.id === id)?.label || id
  const getContainerLabel = (id: string) => CONTAINER_STYLES.find((c) => c.id === id)?.label || id
  const getExtraLabel = (id: string) => EXTRAS.find((e) => e.id === id)?.label || id
  const getExtraPrice = (id: string) => EXTRAS.find((e) => e.id === id)?.price || 0
  const getContainerPrice = (id: string) => CONTAINER_STYLES.find((c) => c.id === id)?.price || 0

  const extrasTotal = bouquetForm.extras.reduce((sum, extra) => sum + getExtraPrice(extra), 0)
  const containerPrice = bouquetForm.containerStyle ? getContainerPrice(bouquetForm.containerStyle) : 0
  const totalPrice = (bouquetForm.pricePoint || 0) + extrasTotal + containerPrice

  return (
    <div className="space-y-6">
      {/* Bouquet Summary */}
      <div className="space-y-4 rounded bg-gray-50 p-4">
        <div>
          <h4 className="mb-2 font-semibold text-[#2f3743]">Your Custom Bouquet</h4>
          <div className="mb-3 text-[14px] text-[#586274]">
            <p>
              <strong>Type:</strong> {bouquetType === 'sender' ? "Sender's Choice" : "Recipient's Choice"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <h5 className="mb-2 font-semibold text-[#2f3743]">Flowers & Colors</h5>
          <p className="text-[14px] text-[#586274]">
            <strong>Flowers:</strong> {bouquetForm.flowerTypes.map(getFlowerLabel).join(', ')}
          </p>
          <p className="text-[14px] text-[#586274]">
            <strong>Colors:</strong> {bouquetForm.colors.map(getColorLabel).join(', ')}
          </p>
        </div>

        {bouquetForm.containerStyle && (
          <div className="border-t border-gray-200 pt-3">
            <p className="text-[14px] text-[#586274]">
              <strong>Container:</strong> {getContainerLabel(bouquetForm.containerStyle)}
            </p>
          </div>
        )}

        {bouquetForm.occasion && (
          <div className="border-t border-gray-200 pt-3">
            <p className="text-[14px] text-[#586274]">
              <strong>Occasion:</strong> {bouquetForm.occasion}
            </p>
          </div>
        )}

        {bouquetForm.extras.length > 0 && (
          <div className="border-t border-gray-200 pt-3">
            <h5 className="mb-2 font-semibold text-[#2f3743]">Extras</h5>
            <ul className="space-y-1">
              {bouquetForm.extras.map((extra) => (
                <li key={extra} className="text-[14px] text-[#586274]">
                  • {getExtraLabel(extra)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="rounded border border-gray-300 p-4">
        <h4 className="mb-3 font-semibold text-[#2f3743]">Price Breakdown</h4>
        <div className="space-y-2 text-[14px]">
          <div className="flex justify-between">
            <span>Base Bouquet:</span>
            <span>${bouquetForm.pricePoint || 0}.00</span>
          </div>
          {containerPrice > 0 && (
            <div className="flex justify-between">
              <span>Container Upgrade:</span>
              <span>+${containerPrice}.00</span>
            </div>
          )}
          {extrasTotal > 0 && (
            <div className="flex justify-between">
              <span>Extras:</span>
              <span>+${extrasTotal}.00</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 font-semibold">
            <div className="flex justify-between text-[16px]">
              <span>Total:</span>
              <span className="text-[#c82a2f]">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Note */}
      <div>
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">
            Add a Personal Note (Optional)
          </span>
          <textarea
            value={noteValue}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Add any special instructions or notes for your bouquet..."
            maxLength={2000}
            rows={4}
            className="rounded border border-gray-300 p-3 text-[14px] font-normal tracking-normal"
          />
          <p className="text-[12px] text-gray-500">{noteValue.length} / 2000 characters</p>
        </label>
      </div>

      {/* Confirmation Message */}
      <div className="rounded bg-green-50 p-4 text-[14px] text-green-800">
        <p>
          <strong>Ready to go!</strong> Your custom{' '}
          {bouquetType === 'sender' ? "bouquet you've created" : 'recipient bouquet'} is ready to be added to your cart.
        </p>
      </div>
    </div>
  )
}

BouquetStepThree.displayName = 'BouquetStepThree'

export default BouquetStepThree
