import type { Product } from './Product';
import type { PaginatedResponse } from './PaginatedResponse';
import type { ApiResponse } from './ApiResponse';
import type { SiteConfig } from './SiteConfig';

// Only re-export types/interfaces that are in separate files
export { Product } from './Product';
export { PaginatedResponse } from './PaginatedResponse';
export { ApiResponse } from './ApiResponse';
export { SiteConfig } from './SiteConfig';
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


export interface Admin {
  id: number
  email: string
  role: 'superadmin' | 'editor'
  isActive: boolean
}

export interface AdminDashboardStats {
  totalUsers: number
  activeUsers: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number | string
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

export interface CustomerReview {
  id: number
  name: string
  location: string | null
  message: string
  rating: number
  isApproved: boolean
  orderId: number
  createdAt: string
  updatedAt: string
}

export interface FAQItem {
  id: number
  question: string
  answer: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  author: string
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type FlowerMeTier = 'society' | 'socialite' | 'royale'

export interface FlowerMeProfile {
  id: number
  userId: number
  slug: string
  displayName: string
  tagline: string | null
  photoUrl: string | null
  socialLink: string | null
  followersCount: number
  tier: FlowerMeTier
  wishlistNotes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FlowerMePublicProfile {
  slug: string
  displayName: string
  tagline: string | null
  photoUrl: string | null
  socialLink: string | null
  followersCount: number
  tier: FlowerMeTier
  wishlistNotes: string | null
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
  credits?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomerProfile extends User {
  credits: number
}

export interface CustomerOrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  productImage: string | null
  quantity: number
  priceAtPurchase: string
  createdAt: string
  updatedAt: string
}

export interface CustomerOrderStatusLog {
  id: number
  orderId: number
  fromStatus: string | null
  toStatus: string
  source: string
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface CustomerOrder {
  id: number
  userId: number | null
  customerName: string
  customerEmail: string
  customerPhone: string
  recipientName: string
  recipientEmail: string | null
  recipientPhone: string
  deliveryAddress: string
  deliveryDate: string | null
  totalPrice: string
  status: string
  paymentStatus: string
  currency: 'USD' | 'CAD'
  items: CustomerOrderItem[]
  statusLogs?: CustomerOrderStatusLog[]
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


// ============================================
// API RESPONSE TYPES
// ============================================



// Explicit exports for build alias resolution (for Vite/Rollup compatibility)

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