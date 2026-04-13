import React from 'react'
import { useBouquetStore } from '../../store/bouquetStore'

const FLOWER_TYPES = [
  { id: 'roses', label: 'Roses', emoji: '🌹' },
  { id: 'lilies', label: 'Lilies', emoji: '🌷' },
  { id: 'sunflowers', label: 'Sunflowers', emoji: '🌻' },
  { id: 'tulips', label: 'Tulips', emoji: '🌷' },
  { id: 'carnations', label: 'Carnations', emoji: '🌺' },
  { id: 'hydrangeas', label: 'Hydrangeas', emoji: '💐' },
  { id: 'orchids', label: 'Orchids', emoji: '🌸' },
  { id: 'peonies', label: 'Peonies', emoji: '🌹' },
]

const COLORS = [
  { id: 'red', label: 'Red', hex: '#D63447' },
  { id: 'pink', label: 'Pink', hex: '#E85D75' },
  { id: 'white', label: 'White', hex: '#FFFFFF' },
  { id: 'yellow', label: 'Yellow', hex: '#FFD700' },
  { id: 'orange', label: 'Orange', hex: '#FF8C00' },
  { id: 'purple', label: 'Purple', hex: '#9370DB' },
  { id: 'peach', label: 'Peach', hex: '#FFCB69' },
  { id: 'cream', label: 'Cream', hex: '#FFFDD0' },
]

const BouquetStepOne: React.FC = () => {
  const { bouquetForm, setBouquetFlowerTypes, setBouquetColors } = useBouquetStore()

  const toggleFlower = (flowerId: string) => {
    const updated = bouquetForm.flowerTypes.includes(flowerId)
      ? bouquetForm.flowerTypes.filter((f: string) => f !== flowerId)
      : [...bouquetForm.flowerTypes, flowerId]
    setBouquetFlowerTypes(updated)
  }

  const toggleColor = (colorId: string) => {
    const updated = bouquetForm.colors.includes(colorId)
      ? bouquetForm.colors.filter((c: string) => c !== colorId)
      : [...bouquetForm.colors, colorId]
    setBouquetColors(updated)
  }

  return (
    <div className="space-y-6">
      {/* Flower Selection */}
      <div>
        <h3 className="mb-4 text-[16px] font-semibold text-[#2f3743]">Choose Your Flowers</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {FLOWER_TYPES.map((flower) => (
            <button
              key={flower.id}
              type="button"
              onClick={() => toggleFlower(flower.id)}
              className={`relative rounded border-2 p-3 text-center transition ${
                bouquetForm.flowerTypes.includes(flower.id)
                  ? 'border-[#c82a2f] bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="mb-2 text-[32px]">{flower.emoji}</div>
              <div className="text-[13px] font-medium text-[#2f3743]">{flower.label}</div>
              {bouquetForm.flowerTypes.includes(flower.id) && (
                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#c82a2f] text-white">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="mb-4 text-[16px] font-semibold text-[#2f3743]">Choose Your Colors</h3>
        <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
          {COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => toggleColor(color.id)}
              className={`relative h-20 rounded border-2 transition ${
                bouquetForm.colors.includes(color.id) ? 'border-[#2f3743] shadow-lg' : 'border-gray-200'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.label}
            >
              {bouquetForm.colors.includes(color.id) && (
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2f3743] text-white text-sm font-bold">
                    ✓
                  </div>
                </div>
              )}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 transform text-center">
                <span className="inline-block rounded bg-black bg-opacity-60 px-2 py-1 text-[10px] font-medium text-white">
                  {color.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selection Summary */}
      {(bouquetForm.flowerTypes.length > 0 || bouquetForm.colors.length > 0) && (
        <div className="rounded bg-blue-50 p-4">
          <p className="text-[14px] text-[#2f3743]">
            <strong>Selected:</strong>{' '}
            {bouquetForm.flowerTypes.length > 0 && (
              <span>
                {bouquetForm.flowerTypes.join(', ')}{bouquetForm.colors.length > 0 ? ' in ' : ''}
              </span>
            )}
            {bouquetForm.colors.length > 0 && <span>{bouquetForm.colors.join(', ')}</span>}
          </p>
        </div>
      )}
    </div>
  )
}

BouquetStepOne.displayName = 'BouquetStepOne'

export default BouquetStepOne
