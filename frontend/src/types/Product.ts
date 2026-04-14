export interface Product {
  id: number
  name: string
  slug: string
  itemCode: string
  price: string
  description: string | null
  image: string[]
  size: string | null
  categoryId: number
  category?: import('./Category').Category
  isBestSeller: boolean
  inStock: boolean
  subscriptionAvailable: boolean
  createdAt: string
  updatedAt: string
}
