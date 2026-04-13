import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BouquetType = 'sender' | 'recipient'

export interface BouquetFormState {
  type: BouquetType | null
  pricePoint: number | null
  colors: string[]
  flowerTypes: string[]
  containerStyle: string | null
  occasion: string | null
  extras: string[]
  note: string | null
  orderId: number | null
}

export interface CartItem {
  id: string
  type: 'product' | 'bouquet'
  productId?: number
  bouquetData?: BouquetFormState
  quantity: number
  price: number
  name: string
}

interface BouquetStore {
  // Bouquet form state
  bouquetForm: BouquetFormState
  currentStep: number
  
  // Bouquet actions
  setBouquetType: (type: BouquetType) => void
  setBouquetPrice: (price: number) => void
  setBouquetColors: (colors: string[]) => void
  setBouquetFlowerTypes: (flowers: string[]) => void
  setBouquetContainer: (style: string | null) => void
  setBouquetOccasion: (occasion: string | null) => void
  setBouquetExtras: (extras: string[]) => void
  setBouquetNote: (note: string | null) => void
  setBouquetOrderId: (orderId: number | null) => void
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  resetBouquetForm: () => void
  
  // Cart state
  cartItems: CartItem[]
  
  // Cart actions
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateCartItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
}

const initialBouquetForm: BouquetFormState = {
  type: null,
  pricePoint: null,
  colors: [],
  flowerTypes: [],
  containerStyle: null,
  occasion: null,
  extras: [],
  note: null,
  orderId: null,
}

export const useBouquetStore = create<BouquetStore>()(
  persist(
    (set, get) => ({
      bouquetForm: initialBouquetForm,
      currentStep: 0,
      cartItems: [],

      // Bouquet form actions
      setBouquetType: (type) =>
        set((state) => ({
          bouquetForm: { ...state.bouquetForm, type },
        })),

      setBouquetPrice: (price) =>
        set((state) => ({
          bouquetForm: { ...state.bouquetForm, pricePoint: price },
        })),

      setBouquetColors: (colors) =>
        set((state) => ({
          bouquetForm: { ...state.bouquetForm, colors },
        })),

      setBouquetFlowerTypes: (flowers) =>
        set((state) => ({
          bouquetForm: { ...state.bouquetForm, flowerTypes: flowers },
        })),

      setBouquetContainer: (style) =>
        set((state) => ({
          bouquetForm: { ...state.bouquetForm, containerStyle: style },
        })),

      setBouquetOccasion: (occasion) =>
        set((state) => ({
          bouquetForm: { ...state.bouquetForm, occasion },
        })),

      setBouquetExtras: (extras) =>
        set((state) => ({
          bouquetForm: { ...state.bouquetForm, extras },
        })),

      setBouquetNote: (note) =>
        set((state) => ({
          bouquetForm: { ...state.bouquetForm, note },
        })),

      setBouquetOrderId: (orderId) =>
        set((state) => ({
          bouquetForm: { ...state.bouquetForm, orderId },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 2),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      resetBouquetForm: () => {
        set({
          bouquetForm: initialBouquetForm,
          currentStep: 0,
        })
      },

      // Cart actions
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find((ci) => ci.id === item.id)
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((ci) =>
                ci.id === item.id ? { ...ci, quantity: ci.quantity + item.quantity } : ci
              ),
            }
          }
          return { cartItems: [...state.cartItems, item] }
        }),

      removeFromCart: (itemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== itemId),
        })),

      updateCartItemQuantity: (itemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cartItems: state.cartItems.filter((item) => item.id !== itemId) }
          }
          return {
            cartItems: state.cartItems.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          }
        }),

      clearCart: () => set({ cartItems: [] }),

      getCartTotal: () => {
        const items = get().cartItems
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getCartItemCount: () => {
        const items = get().cartItems
        return items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'bouquet-cart-store',
    }
  )
)
