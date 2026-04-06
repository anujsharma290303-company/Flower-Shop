export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  image: string | null
  displayOrder: number
  isActive: boolean
  parentId: number | null
  subcategories?: Category[]
  createdAt: string
  updatedAt: string
}

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
  category?: Category
  isBestSeller: boolean
  inStock: boolean
  subscriptionAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: number
  email: string
  role: 'superadmin' | 'editor'
  isActive: boolean
}

export interface PaginatedProducts {
  totalItems: number
  page: number
  limit: number
  totalPages: number
  count: number
  products: Product[]
}

export interface ApiError {
  message: string
  errors?: { field: string; message: string }[]
}