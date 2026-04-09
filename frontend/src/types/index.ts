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

// ============================================
// CART & ORDER TYPES
// ============================================

export interface CartItem {
  id: string
  product: Product
  quantity: number
  addedAt: string
}

export interface Cart {
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

export interface Order {
  id: number
  orderId: string
  userId: number
  items: OrderItem[]
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  totalPrice: number
  deliveryAddress: string
  deliveryDate: string
  recipientName: string
  recipientEmail: string
  recipientPhone: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: string
  product?: Product
}

// ============================================
// REVIEW & RATING TYPES
// ============================================

export interface Review {
  id: number
  productId: number
  userId: number | null
  rating: number
  title: string
  comment: string
  image?: string[]
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductReview extends Review {
  product?: Product
  ratingCount?: number
  averageRating?: number
}

// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

// ============================================
// SITE CONFIGURATION
// ============================================

export interface SiteConfig {
  id: number
  heroTitle: string
  heroSubTitle: string
  heroCTA1: string
  heroCTA2: string
  heroImage: string | null
  howItWorks: Array<{
    step: number
    title: string
    description: string
  }>
  benefitsData: unknown[]
  contactEmail: string
  contactPhone: string
  socialLinks: Record<string, string>
  createdAt: string
  updatedAt: string
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  totalItems: number
  page: number
  limit: number
  totalPages: number
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps {
  label: string
  onClick?: () => void | Promise<void>
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

export interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  icon?: React.ReactNode
  helper?: string
}

export interface BadgeProps {
  label: string
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onQuickView?: (product: Product) => void
  showRating?: boolean
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}