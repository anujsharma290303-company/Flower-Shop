import React from 'react'
import { useBouquetStore } from '../../store/bouquetStore'

const CONTAINER_STYLES = [
  { id: 'glass-vase', label: 'Glass Vase', price: 0 },
  { id: 'ceramic-vase', label: 'Ceramic Vase', price: 5 },
  { id: 'wooden-box', label: 'Wooden Box', price: 8 },
  { id: 'metal-container', label: 'Metal Container', price: 10 },
  { id: 'wicker-basket', label: 'Wicker Basket', price: 12 },
]

const PRICE_POINTS = [25, 50, 75, 100, 150, 200, 250]

const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Love & Romance',
  'Sympathy',
  'Congratulations',
  'Thank You',
  'Get Well Soon',
  'Just Because',
]

const EXTRAS = [
  { id: 'chocolate', label: 'Chocolate Box', price: 15 },
  { id: 'wine', label: 'Wine Bottle', price: 20 },
  { id: 'teddy-bear', label: 'Teddy Bear', price: 25 },
  { id: 'greeting-card', label: 'Premium Greeting Card', price: 5 },
  { id: 'candle', label: 'Scented Candle', price: 10 },
]

const BouquetStepTwo: React.FC = () => {
  const {
    bouquetForm,
    setBouquetContainer,
    setBouquetPrice,
    setBouquetOccasion,
    setBouquetExtras,
  } = useBouquetStore()

  const toggleExtra = (extraId: string) => {
    const updated = bouquetForm.extras.includes(extraId)
      ? bouquetForm.extras.filter((e) => e !== extraId)
      : [...bouquetForm.extras, extraId]
    setBouquetExtras(updated)
  }

  return (
    <div className="space-y-6">
      {/* Price Point Selection */}
      <div>
        <h3 className="mb-4 text-[16px] font-semibold text-[#2f3743]">Select Your Budget</h3>
        <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
          {PRICE_POINTS.map((price) => (
            <button
              key={price}
              type="button"
              onClick={() => setBouquetPrice(price)}
              className={`rounded border-2 p-3 text-center transition ${
                bouquetForm.pricePoint === price
                  ? 'border-[#c82a2f] bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-[14px] font-semibold text-[#2f3743]">${price}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Container Style Selection */}
      <div>
        <h3 className="mb-4 text-[16px] font-semibold text-[#2f3743]">Choose Your Container</h3>
        <div className="space-y-2">
          {CONTAINER_STYLES.map((container) => (
            <label key={container.id} className="flex cursor-pointer items-center gap-3 rounded border border-gray-200 p-3 transition hover:bg-gray-50">
              <input
                type="radio"
                name="container"
                value={container.id}
                checked={bouquetForm.containerStyle === container.id}
                onChange={() => setBouquetContainer(container.id)}
                className="h-4 w-4"
              />
              <div className="flex-1">
                <div className="font-medium text-[#2f3743]">{container.label}</div>
              </div>
              <div className="text-[14px] font-semibold text-gray-600">
                {container.price > 0 ? `+$${container.price}` : 'Included'}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Occasion Selection */}
      <div>
        <h3 className="mb-4 text-[16px] font-semibold text-[#2f3743]">Occasion (Optional)</h3>
        <select
          value={bouquetForm.occasion || ''}
          onChange={(e) => setBouquetOccasion(e.target.value || null)}
          className="w-full rounded border border-gray-300 p-3 text-[16px]"
        >
          <option value="">Select an occasion...</option>
          {OCCASIONS.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </select>
      </div>

      {/* Extras */}
      <div>
        <h3 className="mb-4 text-[16px] font-semibold text-[#2f3743]">Add Extras</h3>
        <div className="space-y-2">
          {EXTRAS.map((extra) => (
            <label key={extra.id} className="flex cursor-pointer items-center gap-3 rounded border border-gray-200 p-3 transition hover:bg-gray-50">
              <input
                type="checkbox"
                checked={bouquetForm.extras.includes(extra.id)}
                onChange={() => toggleExtra(extra.id)}
                className="h-4 w-4"
              />
              <div className="flex-1">
                <div className="font-medium text-[#2f3743]">{extra.label}</div>
              </div>
              <div className="text-[14px] font-semibold text-gray-600">+${extra.price}</div>
            </label>
          ))}
        </div>
      </div>

      {/* Summary */}
      {bouquetForm.pricePoint && (
        <div className="rounded bg-blue-50 p-4">
          <p className="text-[14px] text-[#2f3743]">
            <strong>Base Price:</strong> ${bouquetForm.pricePoint}
          </p>
          {bouquetForm.containerStyle && (
            <p className="text-[14px] text-[#586274]">
              <strong>Container:</strong>{' '}
              {CONTAINER_STYLES.find((c) => c.id === bouquetForm.containerStyle)?.label}
            </p>
          )}
          {bouquetForm.occasion && (
            <p className="text-[14px] text-[#586274]">
              <strong>Occasion:</strong> {bouquetForm.occasion}
            </p>
          )}
          {bouquetForm.extras.length > 0 && (
            <p className="text-[14px] text-[#586274]">
              <strong>Extras:</strong> {bouquetForm.extras.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

BouquetStepTwo.displayName = 'BouquetStepTwo'

export default BouquetStepTwo

         {/* Occasion dropdown */}
