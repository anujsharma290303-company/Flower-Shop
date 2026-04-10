import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_ENDPOINT_CATALOG, adminService } from '@/api/admin'
import type { Admin, AdminDashboardStats, BlogPost, Category, Order, Product, Review, SiteConfig, User } from '@/types'

type AdminTask =
  | 'products'
  | 'orders'
  | 'categories'
  | 'blogs'
  | 'reviews'
  | 'users'
  | 'site-config'
  | 'delivery'
  | 'notifications'
  | 'payments'
  | 'subscriptions'
  | 'media'
  | 'bouquets'
  | 'credits'
  | 'advanced'

type TaskCard = {
  key: AdminTask
  title: string
  description: string
  tone: string
}

type GenericItem = Record<string, unknown>

type OrderEditorForm = {
  status: string
  paymentStatus: string
  deliveryAddress: string
  deliveryDate: string
  country: string
  currency: string
  deliveryMode: string
  isSubscription: boolean
  subscriptionFrequency: string
  isRecipientChoice: boolean
  creditsUsed: string
}

type CategoryEditorForm = {
  name: string
  description: string
  icon: string
  displayOrder: string
  isActive: boolean
  parentId: string
}

type BlogEditorForm = {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  isPublished: boolean
  publishedAt: string
}

type DeliveryEditorForm = {
  date: string
  reason: string
  isActive: boolean
}

const taskCards: TaskCard[] = [
  {
    key: 'products',
    title: 'Products',
    description: 'Pick a product, change the price or stock, and save it like a normal form.',
    tone: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100',
  },
  {
    key: 'orders',
    title: 'Orders',
    description: 'Open an order, adjust status or payment, and save the update.',
    tone: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  },
  {
    key: 'categories',
    title: 'Categories',
    description: 'Rename categories, change order, or switch them on and off.',
    tone: 'border-sky-400/30 bg-sky-400/10 text-sky-100',
  },
  {
    key: 'blogs',
    title: 'Blogs',
    description: 'Edit blog title, content, author, and publish state.',
    tone: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
  },
  {
    key: 'reviews',
    title: 'Reviews',
    description: 'Approve, reject, or delete customer reviews.',
    tone: 'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-100',
  },
  {
    key: 'users',
    title: 'Users',
    description: 'Check users and toggle active access when needed.',
    tone: 'border-violet-400/30 bg-violet-400/10 text-violet-100',
  },
  {
    key: 'site-config',
    title: 'Site settings',
    description: 'Edit homepage text and contact details from a simple form.',
    tone: 'border-rose-400/30 bg-rose-400/10 text-rose-100',
  },
  {
    key: 'delivery',
    title: 'Delivery dates',
    description: 'Add blackout dates or update existing ones.',
    tone: 'border-orange-400/30 bg-orange-400/10 text-orange-100',
  },
  {
    key: 'notifications',
    title: 'Notifications',
    description: 'View recent system alerts and activity logs.',
    tone: 'border-slate-400/30 bg-slate-400/10 text-slate-100',
  },
  {
    key: 'payments',
    title: 'Payments',
    description: 'Review payment records in a readable list.',
    tone: 'border-teal-400/30 bg-teal-400/10 text-teal-100',
  },
  {
    key: 'subscriptions',
    title: 'Subscriptions',
    description: 'Review recurring delivery subscriptions.',
    tone: 'border-lime-400/30 bg-lime-400/10 text-lime-100',
  },
  {
    key: 'media',
    title: 'Media approvals',
    description: 'Approve uploaded order media in one click.',
    tone: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-100',
  },
  {
    key: 'bouquets',
    title: 'Custom bouquets',
    description: 'Review custom bouquet requests and remove them if needed.',
    tone: 'border-pink-400/30 bg-pink-400/10 text-pink-100',
  },
  {
    key: 'credits',
    title: 'Credits',
    description: 'Inspect credit activity and balances.',
    tone: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  },
  {
    key: 'advanced',
    title: 'Advanced tools',
    description: 'Use the raw endpoint tool only when you need it.',
    tone: 'border-slate-500/30 bg-slate-500/10 text-slate-100',
  },
]

const readOnlyTaskFields: Record<Exclude<AdminTask, 'products' | 'orders' | 'categories' | 'blogs' | 'reviews' | 'users' | 'site-config' | 'delivery' | 'advanced'>, string[]> = {
  notifications: ['id', 'type', 'source', 'subject', 'status', 'createdAt'],
  payments: ['id', 'orderId', 'status', 'amount', 'currency', 'createdAt'],
  subscriptions: ['id', 'userId', 'status', 'frequency', 'createdAt'],
  media: ['id', 'orderId', 'mediaType', 'sharedWith', 'isApproved', 'createdAt'],
  bouquets: ['id', 'type', 'pricePoint', 'orderId', 'createdAt'],
  credits: ['id', 'userId', 'amount', 'reason', 'createdAt'],
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    const message = response?.data?.message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallback
}

const getResponseData = <T,>(response: unknown): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data: T }).data
  }

  return response as T
}

const getCollection = (payload: unknown, keys: string[]) => {
  if (Array.isArray(payload)) {
    return payload as GenericItem[]
  }

  if (payload && typeof payload === 'object') {
    for (const key of keys) {
      const candidate = (payload as Record<string, unknown>)[key]
      if (Array.isArray(candidate)) {
        return candidate as GenericItem[]
      }
    }
  }

  return [] as GenericItem[]
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (Array.isArray(value)) {
    return value.map((entry) => formatValue(entry)).join(', ')
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

const toDateInputValue = (value: unknown) => {
  if (!value) return ''
  return String(value).slice(0, 10)
}

const normalizeBoolean = (value: unknown) => Boolean(value)

const AdminDashboardWorkspace: React.FC = () => {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<AdminTask>('products')
  const [selectedTaskTitle, setSelectedTaskTitle] = useState('Products')
  const [lastRunMessage, setLastRunMessage] = useState('Choose a card to begin.')

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('')
  const [productLoading, setProductLoading] = useState(false)
  const [productSaving, setProductSaving] = useState(false)
  const [productMessage, setProductMessage] = useState<string | null>(null)
  const [productError, setProductError] = useState<string | null>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    itemCode: '',
    price: '',
    description: '',
    size: '',
    categoryId: '',
    isBestSeller: false,
    inStock: false,
    subscriptionAvailable: false,
  })

  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [siteConfigSaving, setSiteConfigSaving] = useState(false)
  const [siteConfigMessage, setSiteConfigMessage] = useState<string | null>(null)
  const [siteConfigError, setSiteConfigError] = useState<string | null>(null)
  const [siteConfigForm, setSiteConfigForm] = useState({
    heroTitle: '',
    heroSubTitle: '',
    heroCTA1: '',
    heroCTA2: '',
    contactEmail: '',
    contactPhone: '',
  })

  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<number | ''>('')
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderSaving, setOrderSaving] = useState(false)
  const [orderMessage, setOrderMessage] = useState<string | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderForm, setOrderForm] = useState<OrderEditorForm>({
    status: 'pending',
    paymentStatus: 'unpaid',
    deliveryAddress: '',
    deliveryDate: '',
    country: 'US',
    currency: 'USD',
    deliveryMode: 'recipient-provides',
    isSubscription: false,
    subscriptionFrequency: '',
    isRecipientChoice: false,
    creditsUsed: '',
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('')
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [categorySaving, setCategorySaving] = useState(false)
  const [categoryMessage, setCategoryMessage] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [categoryForm, setCategoryForm] = useState<CategoryEditorForm>({
    name: '',
    description: '',
    icon: '',
    displayOrder: '0',
    isActive: true,
    parentId: '',
  })

  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [selectedBlogId, setSelectedBlogId] = useState<number | ''>('')
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogSaving, setBlogSaving] = useState(false)
  const [blogMessage, setBlogMessage] = useState<string | null>(null)
  const [blogError, setBlogError] = useState<string | null>(null)
  const [blogForm, setBlogForm] = useState<BlogEditorForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
    isPublished: false,
    publishedAt: '',
  })

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewMessage, setReviewMessage] = useState<string | null>(null)
  const [reviewError, setReviewError] = useState<string | null>(null)

  const [users, setUsers] = useState<User[]>([])
  const [userLoading, setUserLoading] = useState(false)
  const [userMessage, setUserMessage] = useState<string | null>(null)
  const [userError, setUserError] = useState<string | null>(null)

  const [deliveryItems, setDeliveryItems] = useState<GenericItem[]>([])
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | ''>('')
  const [deliveryLoading, setDeliveryLoading] = useState(false)
  const [deliverySaving, setDeliverySaving] = useState(false)
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null)
  const [deliveryError, setDeliveryError] = useState<string | null>(null)
  const [deliveryForm, setDeliveryForm] = useState<DeliveryEditorForm>({
    date: '',
    reason: '',
    isActive: true,
  })

  const [otherItems, setOtherItems] = useState<GenericItem[]>([])
  const [otherLoading, setOtherLoading] = useState(false)
  const [otherMessage, setOtherMessage] = useState<string | null>(null)
  const [otherError, setOtherError] = useState<string | null>(null)

  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(ADMIN_ENDPOINT_CATALOG[0])
  const [requestPath, setRequestPath] = useState('/admin/products')
  const [requestMethod, setRequestMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET')
  const [requestBody, setRequestBody] = useState('{}')
  const [requestQuery, setRequestQuery] = useState('{}')
  const [responseStatus, setResponseStatus] = useState<string | null>(null)
  const [responsePayload, setResponsePayload] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  useEffect(() => {
    const [method, ...pathParts] = selectedEndpoint.split(' ')
    setRequestMethod(method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE')
    setRequestPath(pathParts.join(' '))
  }, [selectedEndpoint])

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        const [currentAdmin, dashboardStats] = await Promise.all([
          adminService.me(),
          adminService.getDashboardStats().catch(() => null),
        ])

        if (!isMounted) return

        setAdmin(currentAdmin)
        setStats(dashboardStats)
      } catch {
        if (!isMounted) return
        adminService.clearSession()
        navigate('/admin/login')
        return
      }

      if (isMounted) {
        void loadProducts(false)
      }

      if (isMounted) {
        setLoading(false)
      }
    }

    void init()

    return () => {
      isMounted = false
    }
  }, [navigate])

  const loadProducts = async (switchToTask = true) => {
    setProductLoading(true)
    setProductError(null)
    setProductMessage(null)
    setSelectedTask('products')
    setSelectedTaskTitle('Products')

    try {
      const nextProducts = await adminService.getProducts()
      setProducts(nextProducts)

      if (nextProducts.length > 0) {
        const first = nextProducts[0]
        setSelectedProductId(first.id)
        setProductForm({
          name: first.name,
          itemCode: first.itemCode,
          price: first.price,
          description: first.description ?? '',
          size: first.size ?? '',
          categoryId: String(first.categoryId),
          isBestSeller: first.isBestSeller,
          inStock: first.inStock,
          subscriptionAvailable: first.subscriptionAvailable,
        })
        setLastRunMessage('Products loaded. Choose one and edit it from the normal form.')
      } else {
        setSelectedProductId('')
        setProductForm({
          name: '',
          itemCode: '',
          price: '',
          description: '',
          size: '',
          categoryId: '',
          isBestSeller: false,
          inStock: false,
          subscriptionAvailable: false,
        })
        setLastRunMessage('No products found.')
      }

      if (switchToTask) {
        setAdvancedOpen(false)
      }
    } catch (error: unknown) {
      setProductError(getErrorMessage(error, 'Unable to load products.'))
    } finally {
      setProductLoading(false)
    }
  }

  const loadSiteConfig = async () => {
    setSiteConfigError(null)
    setSiteConfigMessage(null)
    setSelectedTask('site-config')
    setSelectedTaskTitle('Site settings')

    try {
      const nextConfig = await adminService.getSiteConfig()
      setSiteConfig(nextConfig)
      setSiteConfigForm({
        heroTitle: nextConfig.heroTitle ?? '',
        heroSubTitle: nextConfig.heroSubTitle ?? '',
        heroCTA1: nextConfig.heroCTA1 ?? '',
        heroCTA2: nextConfig.heroCTA2 ?? '',
        contactEmail: nextConfig.contactEmail ?? '',
        contactPhone: nextConfig.contactPhone ?? '',
      })
      setLastRunMessage('Site settings loaded. Edit the homepage text and contact details below.')
    } catch (error: unknown) {
      setSiteConfigError(getErrorMessage(error, 'Unable to load site settings.'))
    }
  }

  const loadOrders = async () => {
    setOrderLoading(true)
    setOrderError(null)
    setOrderMessage(null)
    setSelectedTask('orders')
    setSelectedTaskTitle('Orders')

    try {
      const response = await adminService.request({ method: 'GET', path: '/admin/orders', query: { page: 1, limit: 50 } })
      const payload = getResponseData<unknown>(response)
      const nextOrders = getCollection(payload, ['orders', 'items']) as unknown as Order[]
      setOrders(nextOrders)

      if (nextOrders.length > 0) {
        onSelectOrder(nextOrders[0].id, nextOrders)
      } else {
        setSelectedOrderId('')
        setOrderForm({
          status: 'pending',
          paymentStatus: 'unpaid',
          deliveryAddress: '',
          deliveryDate: '',
          country: 'US',
          currency: 'USD',
          deliveryMode: 'recipient-provides',
          isSubscription: false,
          subscriptionFrequency: '',
          isRecipientChoice: false,
          creditsUsed: '',
        })
      }
      setLastRunMessage('Orders loaded. Pick one and update the status or payment details.')
    } catch (error: unknown) {
      setOrderError(getErrorMessage(error, 'Unable to load orders.'))
    } finally {
      setOrderLoading(false)
    }
  }

  const loadCategories = async () => {
    setCategoryLoading(true)
    setCategoryError(null)
    setCategoryMessage(null)
    setSelectedTask('categories')
    setSelectedTaskTitle('Categories')

    try {
      const response = await adminService.request({ method: 'GET', path: '/admin/categories', query: { isActive: 'all' } })
      const payload = getResponseData<unknown>(response)
      const nextCategories = getCollection(payload, ['categories', 'items']) as unknown as Category[]
      setCategories(nextCategories)

      if (nextCategories.length > 0) {
        onSelectCategory(nextCategories[0].id, nextCategories)
      }
      setLastRunMessage('Categories loaded. Pick one and edit the normal fields.')
    } catch (error: unknown) {
      setCategoryError(getErrorMessage(error, 'Unable to load categories.'))
    } finally {
      setCategoryLoading(false)
    }
  }

  const loadBlogs = async () => {
    setBlogLoading(true)
    setBlogError(null)
    setBlogMessage(null)
    setSelectedTask('blogs')
    setSelectedTaskTitle('Blogs')

    try {
      const response = await adminService.request({ method: 'GET', path: '/admin/blogs', query: { page: 1, limit: 50 } })
      const payload = getResponseData<unknown>(response)
      const nextBlogs = getCollection(payload, ['blogs', 'items']) as unknown as BlogPost[]
      setBlogs(nextBlogs)

      if (nextBlogs.length > 0) {
        onSelectBlog(nextBlogs[0].id, nextBlogs)
      }
      setLastRunMessage('Blogs loaded. Choose a post to edit or publish.')
    } catch (error: unknown) {
      setBlogError(getErrorMessage(error, 'Unable to load blogs.'))
    } finally {
      setBlogLoading(false)
    }
  }

  const loadReviews = async () => {
    setReviewLoading(true)
    setReviewError(null)
    setReviewMessage(null)
    setSelectedTask('reviews')
    setSelectedTaskTitle('Reviews')

    try {
      const response = await adminService.request({ method: 'GET', path: '/admin/reviews' })
      const payload = getResponseData<unknown>(response)
      setReviews(getCollection(payload, ['reviews', 'items']) as unknown as Review[])
      setLastRunMessage('Reviews loaded. Approve or reject them from the list.')
    } catch (error: unknown) {
      setReviewError(getErrorMessage(error, 'Unable to load reviews.'))
    } finally {
      setReviewLoading(false)
    }
  }

  const loadUsers = async () => {
    setUserLoading(true)
    setUserError(null)
    setUserMessage(null)
    setSelectedTask('users')
    setSelectedTaskTitle('Users')

    try {
      const response = await adminService.request({ method: 'GET', path: '/admin/users' })
      const payload = getResponseData<unknown>(response)
      setUsers(getCollection(payload, ['users', 'items']) as unknown as User[])
      setLastRunMessage('Users loaded. Use the toggle button when needed.')
    } catch (error: unknown) {
      setUserError(getErrorMessage(error, 'Unable to load users.'))
    } finally {
      setUserLoading(false)
    }
  }

  const loadDeliveryDates = async () => {
    setDeliveryLoading(true)
    setDeliveryError(null)
    setDeliveryMessage(null)
    setSelectedTask('delivery')
    setSelectedTaskTitle('Delivery dates')

    try {
      const response = await adminService.request({ method: 'GET', path: '/admin/delivery/blackout-dates', query: { page: 1, limit: 50 } })
      const payload = getResponseData<unknown>(response)
      const nextItems = getCollection(payload, ['blackoutDates', 'items'])
      setDeliveryItems(nextItems)

      if (nextItems.length > 0) {
        onSelectDelivery(nextItems[0].id as number, nextItems)
      } else {
        setSelectedDeliveryId('')
        setDeliveryForm({ date: '', reason: '', isActive: true })
      }
      setLastRunMessage('Delivery blackout dates loaded. Add or update one from the form.')
    } catch (error: unknown) {
      setDeliveryError(getErrorMessage(error, 'Unable to load delivery blackout dates.'))
    } finally {
      setDeliveryLoading(false)
    }
  }

  const loadOtherTask = async (task: Exclude<AdminTask, 'products' | 'orders' | 'categories' | 'blogs' | 'reviews' | 'users' | 'site-config' | 'delivery' | 'advanced'>) => {
    setOtherLoading(true)
    setOtherError(null)
    setOtherMessage(null)
    setSelectedTask(task)
    setSelectedTaskTitle(taskCards.find((entry) => entry.key === task)?.title ?? 'Admin data')

    const pathMap: Record<typeof task, { path: string; query?: Record<string, unknown> }> = {
      notifications: { path: '/admin/notifications', query: { limit: 50, offset: 0 } },
      payments: { path: '/admin/payments', query: { page: 1, limit: 50 } },
      subscriptions: { path: '/admin/subscriptions', query: { page: 1, limit: 50 } },
      media: { path: '/admin/media', query: { limit: 50 } },
      bouquets: { path: '/admin/bouquets', query: { page: 1, limit: 50 } },
      credits: { path: '/admin/credits', query: { limit: 50 } },
    }

    try {
      const response = await adminService.request({ method: 'GET', path: pathMap[task].path, query: pathMap[task].query })
      const payload = getResponseData<unknown>(response)
      setOtherItems(getCollection(payload, ['notifications', 'payments', 'subscriptions', 'media', 'bouquets', 'credits', 'items']))
      setLastRunMessage(`${taskCards.find((entry) => entry.key === task)?.title ?? 'Data'} loaded.`)
    } catch (error: unknown) {
      setOtherError(getErrorMessage(error, 'Unable to load data.'))
    } finally {
      setOtherLoading(false)
    }
  }

  const onSelectProduct = (productId: number, source = products) => {
    const product = source.find((entry) => entry.id === productId)
    if (!product) return

    setSelectedTask('products')
    setSelectedTaskTitle('Products')
    setSelectedProductId(product.id)
    setProductForm({
      name: product.name,
      itemCode: product.itemCode,
      price: product.price,
      description: product.description ?? '',
      size: product.size ?? '',
      categoryId: String(product.categoryId),
      isBestSeller: product.isBestSeller,
      inStock: product.inStock,
      subscriptionAvailable: product.subscriptionAvailable,
    })
    setProductMessage(null)
    setProductError(null)
  }

  const onSelectOrder = (orderId: number, source = orders) => {
    const order = source.find((entry) => entry.id === orderId)
    if (!order) return
    const orderData = order as unknown as Record<string, unknown>

    setSelectedTask('orders')
    setSelectedTaskTitle('Orders')
    setSelectedOrderId(order.id)
    setOrderForm({
      status: String(order.status ?? 'pending'),
      paymentStatus: String(orderData.paymentStatus ?? 'unpaid'),
      deliveryAddress: String(orderData.deliveryAddress ?? ''),
      deliveryDate: toDateInputValue(orderData.deliveryDate ?? ''),
      country: String(orderData.country ?? 'US'),
      currency: String(orderData.currency ?? 'USD'),
      deliveryMode: String(orderData.deliveryMode ?? 'recipient-provides'),
      isSubscription: normalizeBoolean(orderData.isSubscription),
      subscriptionFrequency: String(orderData.subscriptionFrequency ?? ''),
      isRecipientChoice: normalizeBoolean(orderData.isRecipientChoice),
      creditsUsed: String(orderData.creditsUsed ?? ''),
    })
    setOrderMessage(null)
    setOrderError(null)
  }

  const onSelectCategory = (categoryId: number, source = categories) => {
    const category = source.find((entry) => entry.id === categoryId)
    if (!category) return

    setSelectedTask('categories')
    setSelectedTaskTitle('Categories')
    setSelectedCategoryId(category.id)
    setCategoryForm({
      name: category.name,
      description: category.description ?? '',
      icon: category.icon ?? '',
      displayOrder: String(category.displayOrder ?? 0),
      isActive: Boolean(category.isActive),
      parentId: category.parentId ? String(category.parentId) : '',
    })
    setCategoryMessage(null)
    setCategoryError(null)
  }

  const onSelectBlog = (blogId: number, source = blogs) => {
    const blog = source.find((entry) => entry.id === blogId)
    if (!blog) return

    setSelectedTask('blogs')
    setSelectedTaskTitle('Blogs')
    setSelectedBlogId(blog.id)
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage ?? '',
      author: blog.author,
      isPublished: Boolean(blog.isPublished),
      publishedAt: toDateInputValue(blog.publishedAt ?? blog.createdAt),
    })
    setBlogMessage(null)
    setBlogError(null)
  }

  const onSelectDelivery = (deliveryId: number, source = deliveryItems) => {
    const delivery = source.find((entry) => Number(entry.id) === deliveryId)
    if (!delivery) return

    setSelectedTask('delivery')
    setSelectedTaskTitle('Delivery dates')
    setSelectedDeliveryId(deliveryId)
    setDeliveryForm({
      date: String(delivery.date ?? ''),
      reason: String(delivery.reason ?? ''),
      isActive: Boolean(delivery.isActive),
    })
    setDeliveryMessage(null)
    setDeliveryError(null)
  }

  const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProductError(null)
    setProductMessage(null)

    if (selectedProductId === '') {
      setProductError('Please choose a product first.')
      return
    }

    const categoryId = Number(productForm.categoryId)
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      setProductError('Category ID must be a positive number.')
      return
    }

    try {
      setProductSaving(true)
      const response = await adminService.updateProduct(Number(selectedProductId), {
        name: productForm.name.trim(),
        itemCode: productForm.itemCode.trim(),
        price: String(productForm.price).trim(),
        description: productForm.description.trim() || null,
        size: productForm.size.trim() || null,
        categoryId,
        isBestSeller: productForm.isBestSeller,
        inStock: productForm.inStock,
        subscriptionAvailable: productForm.subscriptionAvailable,
      })
      const updated = getResponseData<Product>(response)
      setProducts((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      setProductMessage('Product saved successfully.')
      setLastRunMessage(`Saved product: ${updated.name}`)
    } catch (error: unknown) {
      setProductError(getErrorMessage(error, 'Unable to save product.'))
    } finally {
      setProductSaving(false)
    }
  }

  const saveSiteConfig = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSiteConfigError(null)
    setSiteConfigMessage(null)

    try {
      setSiteConfigSaving(true)
      const response = await adminService.updateSiteConfig(siteConfigForm)
      const updated = getResponseData<SiteConfig>(response)
      setSiteConfig(updated)
      setSiteConfigMessage('Site settings saved successfully.')
      setLastRunMessage('Site settings updated.')
    } catch (error: unknown) {
      setSiteConfigError(getErrorMessage(error, 'Unable to save site settings.'))
    } finally {
      setSiteConfigSaving(false)
    }
  }

  const saveOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOrderError(null)
    setOrderMessage(null)

    if (selectedOrderId === '') {
      setOrderError('Please choose an order first.')
      return
    }

    const payload: Record<string, unknown> = {
      status: orderForm.status,
      paymentStatus: orderForm.paymentStatus,
      deliveryMode: orderForm.deliveryMode,
      isSubscription: orderForm.isSubscription,
      isRecipientChoice: orderForm.isRecipientChoice,
    }

    if (orderForm.deliveryAddress.trim()) payload.deliveryAddress = orderForm.deliveryAddress.trim()
    if (orderForm.deliveryDate.trim()) payload.deliveryDate = orderForm.deliveryDate.trim()
    if (orderForm.country.trim()) payload.country = orderForm.country.trim()
    if (orderForm.currency.trim()) payload.currency = orderForm.currency.trim()
    if (orderForm.isSubscription && orderForm.subscriptionFrequency.trim()) payload.subscriptionFrequency = orderForm.subscriptionFrequency.trim()
    if (orderForm.creditsUsed.trim()) payload.creditsUsed = Number(orderForm.creditsUsed)

    try {
      setOrderSaving(true)
      const response = await adminService.request({ method: 'PUT', path: `/admin/orders/${selectedOrderId}`, body: payload })
      const updated = getResponseData<Order>(response)
      setOrders((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      setOrderMessage('Order saved successfully.')
      setLastRunMessage(`Saved order #${updated.id}.`)
    } catch (error: unknown) {
      setOrderError(getErrorMessage(error, 'Unable to save order.'))
    } finally {
      setOrderSaving(false)
    }
  }

  const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCategoryError(null)
    setCategoryMessage(null)

    if (selectedCategoryId === '') {
      setCategoryError('Please choose a category first.')
      return
    }

    const payload: Record<string, unknown> = {
      name: categoryForm.name.trim(),
      description: categoryForm.description.trim() || null,
      icon: categoryForm.icon.trim() || null,
      displayOrder: Number(categoryForm.displayOrder || 0),
      isActive: categoryForm.isActive,
    }

    if (categoryForm.parentId.trim()) {
      payload.parentId = Number(categoryForm.parentId)
    } else {
      payload.parentId = null
    }

    try {
      setCategorySaving(true)
      const response = await adminService.request({ method: 'PUT', path: `/admin/categories/${selectedCategoryId}`, body: payload })
      const updated = getResponseData<Category>(response)
      setCategories((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      setCategoryMessage('Category saved successfully.')
      setLastRunMessage(`Saved category: ${updated.name}`)
    } catch (error: unknown) {
      setCategoryError(getErrorMessage(error, 'Unable to save category.'))
    } finally {
      setCategorySaving(false)
    }
  }

  const saveBlog = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBlogError(null)
    setBlogMessage(null)

    if (selectedBlogId === '') {
      setBlogError('Please choose a blog post first.')
      return
    }

    const payload: Record<string, unknown> = {
      title: blogForm.title.trim(),
      excerpt: blogForm.excerpt.trim(),
      content: blogForm.content.trim(),
      author: blogForm.author.trim(),
      isPublished: blogForm.isPublished,
    }

    if (blogForm.slug.trim()) payload.slug = blogForm.slug.trim()
    if (blogForm.coverImage.trim()) payload.coverImage = blogForm.coverImage.trim()
    if (blogForm.isPublished && blogForm.publishedAt.trim()) payload.publishedAt = blogForm.publishedAt.trim()

    try {
      setBlogSaving(true)
      const response = await adminService.request({ method: 'PUT', path: `/admin/blogs/${selectedBlogId}`, body: payload })
      const updated = getResponseData<BlogPost>(response)
      setBlogs((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      setBlogMessage('Blog saved successfully.')
      setLastRunMessage(`Saved blog: ${updated.title}`)
    } catch (error: unknown) {
      setBlogError(getErrorMessage(error, 'Unable to save blog.'))
    } finally {
      setBlogSaving(false)
    }
  }

  const toggleBlogPublish = async () => {
    if (selectedBlogId === '') return
    setBlogError(null)
    setBlogMessage(null)

    try {
      const response = await adminService.request({ method: 'PATCH', path: `/admin/blogs/${selectedBlogId}/publish` })
      const updated = getResponseData<BlogPost>(response)
      setBlogs((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      setBlogForm((current) => ({ ...current, isPublished: updated.isPublished, publishedAt: toDateInputValue(updated.publishedAt ?? updated.updatedAt) }))
      setBlogMessage(updated.isPublished ? 'Blog published.' : 'Blog unpublished.')
      setLastRunMessage(`Blog ${updated.isPublished ? 'published' : 'unpublished'}.`)
    } catch (error: unknown) {
      setBlogError(getErrorMessage(error, 'Unable to update publish state.'))
    }
  }

  const moderateReview = async (reviewId: number, action: 'approve' | 'reject' | 'delete') => {
    setReviewError(null)
    setReviewMessage(null)

    try {
      const path = action === 'delete' ? `/admin/reviews/${reviewId}` : `/admin/reviews/${reviewId}/${action}`
      const method = action === 'delete' ? 'DELETE' : 'PATCH'
      const response = await adminService.request({ method, path })
      if (action === 'delete') {
        setReviews((current) => current.filter((entry) => entry.id !== reviewId))
      } else {
        const updated = getResponseData<Review>(response)
        setReviews((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      }
      setReviewMessage(`Review ${action}d successfully.`)
      setLastRunMessage(`Review ${action}d.`)
    } catch (error: unknown) {
      setReviewError(getErrorMessage(error, `Unable to ${action} review.`))
    }
  }

  const toggleUserActive = async (userId: number) => {
    setUserError(null)
    setUserMessage(null)

    try {
      const response = await adminService.request({ method: 'PATCH', path: `/admin/users/${userId}/toggle` })
      const updated = getResponseData<User>(response)
      setUsers((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      setUserMessage('User status updated.')
      setLastRunMessage('User access updated.')
    } catch (error: unknown) {
      setUserError(getErrorMessage(error, 'Unable to update user status.'))
    }
  }

  const saveDeliveryDate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDeliveryError(null)
    setDeliveryMessage(null)

    if (!deliveryForm.date.trim()) {
      setDeliveryError('Date is required.')
      return
    }

    const payload = {
      date: deliveryForm.date.trim(),
      reason: deliveryForm.reason.trim() || null,
      isActive: deliveryForm.isActive,
    }

    try {
      setDeliverySaving(true)
      if (selectedDeliveryId === '') {
        const response = await adminService.request({ method: 'POST', path: '/admin/delivery/blackout-dates', body: payload })
        const created = getResponseData<GenericItem>(response)
        setDeliveryItems((current) => [created, ...current])
        setSelectedDeliveryId(Number(created.id))
        setDeliveryMessage('Blackout date created successfully.')
        setLastRunMessage('Delivery blackout date created.')
      } else {
        const response = await adminService.request({ method: 'PATCH', path: `/admin/delivery/blackout-dates/${selectedDeliveryId}`, body: payload })
        const updated = getResponseData<GenericItem>(response)
        setDeliveryItems((current) => current.map((entry) => (Number(entry.id) === selectedDeliveryId ? updated : entry)))
        setDeliveryMessage('Blackout date updated successfully.')
        setLastRunMessage('Delivery blackout date updated.')
      }
    } catch (error: unknown) {
      setDeliveryError(getErrorMessage(error, 'Unable to save blackout date.'))
    } finally {
      setDeliverySaving(false)
    }
  }

  const removeDeliveryDate = async () => {
    if (selectedDeliveryId === '') return
    setDeliveryError(null)
    setDeliveryMessage(null)

    try {
      await adminService.request({ method: 'DELETE', path: `/admin/delivery/blackout-dates/${selectedDeliveryId}` })
      setDeliveryItems((current) => current.filter((entry) => Number(entry.id) !== selectedDeliveryId))
      setSelectedDeliveryId('')
      setDeliveryForm({ date: '', reason: '', isActive: true })
      setDeliveryMessage('Blackout date deleted.')
      setLastRunMessage('Delivery blackout date deleted.')
    } catch (error: unknown) {
      setDeliveryError(getErrorMessage(error, 'Unable to delete blackout date.'))
    }
  }

  const approveMedia = async (itemId: number) => {
    try {
      await adminService.request({ method: 'PATCH', path: `/admin/media/${itemId}/approve` })
      setOtherItems((current) => current.map((entry) => (Number(entry.id) === itemId ? { ...entry, isApproved: true } : entry)))
      setOtherMessage('Media approved.')
      setLastRunMessage('Media item approved.')
    } catch (error: unknown) {
      setOtherError(getErrorMessage(error, 'Unable to approve media.'))
    }
  }

  const deleteBouquet = async (itemId: number) => {
    try {
      await adminService.request({ method: 'DELETE', path: `/admin/bouquets/${itemId}` })
      setOtherItems((current) => current.filter((entry) => Number(entry.id) !== itemId))
      setOtherMessage('Custom bouquet deleted.')
      setLastRunMessage('Custom bouquet deleted.')
    } catch (error: unknown) {
      setOtherError(getErrorMessage(error, 'Unable to delete bouquet.'))
    }
  }

  const sendRequest = async () => {
    setErrorMessage(null)
    setResponseStatus(null)
    setResponsePayload('')

    try {
      const body = requestBody.trim() ? JSON.parse(requestBody) : undefined
      const query = requestQuery.trim() ? JSON.parse(requestQuery) : undefined

      setIsSending(true)
      const response = await adminService.request({ method: requestMethod, path: requestPath, body, query })
      setResponseStatus('Success')
      setResponsePayload(JSON.stringify(response, null, 2))
    } catch (error: unknown) {
      const message = error instanceof SyntaxError ? 'JSON must be valid in the advanced tool.' : getErrorMessage(error, 'Request failed')
      setErrorMessage(message)
    } finally {
      setIsSending(false)
    }
  }

  const signOut = () => {
    adminService.clearSession()
    navigate('/admin/login')
  }

  const renderPanelTitle = (title: string, description: string, action?: React.ReactNode) => (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-[26px] font-semibold">{title}</h2>
        <p className="text-[14px] text-slate-300">{description}</p>
      </div>
      {action}
    </div>
  )

  const renderTaskCard = (card: TaskCard) => (
    <button
      key={card.key}
      type="button"
      onClick={() => {
        setSelectedTask(card.key)
        setSelectedTaskTitle(card.title)
        setAdvancedOpen(card.key === 'advanced')

        if (card.key === 'products') void loadProducts()
        if (card.key === 'site-config') void loadSiteConfig()
        if (card.key === 'orders') void loadOrders()
        if (card.key === 'categories') void loadCategories()
        if (card.key === 'blogs') void loadBlogs()
        if (card.key === 'reviews') void loadReviews()
        if (card.key === 'users') void loadUsers()
        if (card.key === 'delivery') void loadDeliveryDates()
        if (card.key === 'notifications') void loadOtherTask('notifications')
        if (card.key === 'payments') void loadOtherTask('payments')
        if (card.key === 'subscriptions') void loadOtherTask('subscriptions')
        if (card.key === 'media') void loadOtherTask('media')
        if (card.key === 'bouquets') void loadOtherTask('bouquets')
        if (card.key === 'credits') void loadOtherTask('credits')
      }}
      className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-500 ${selectedTask === card.key ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 bg-white'} ${card.tone}`}
    >
      <p className="text-[16px] font-semibold text-slate-900">{card.title}</p>
      <p className="mt-2 text-[13px] leading-6 text-slate-600">{card.description}</p>
    </button>
  )

  const renderProductPanel = () => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      {renderPanelTitle('Product Editor', 'Pick a product, change the details, and click Save.', <button type="button" onClick={() => void loadProducts()} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">{productLoading ? 'Loading...' : 'Load Products'}</button>)}
      {productError ? <p className="mt-4 text-sm text-red-600">{productError}</p> : null}
      {productMessage ? <p className="mt-4 text-sm text-emerald-600">{productMessage}</p> : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label htmlFor="product-select" className="mb-2 block text-sm text-slate-700">Choose a product</label>
          <select id="product-select" value={selectedProductId} onChange={(event) => onSelectProduct(Number(event.target.value))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>

          <div className="mt-4 max-h-96 space-y-2 overflow-auto pr-1">
            {products.map((product) => (
              <button key={product.id} type="button" onClick={() => onSelectProduct(product.id)} className={`block w-full rounded-lg border px-3 py-2 text-left text-sm ${selectedProductId === product.id ? 'border-cyan-500 bg-cyan-50 text-slate-900' : 'border-slate-200 bg-white text-slate-700'}`}>
                <div className="font-semibold">{product.name}</div>
                <div className="text-xs text-slate-500">{product.itemCode} • ${product.price}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={saveProduct} className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="product-name">Product Name</label>
              <input id="product-name" value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="product-itemcode">Item Code</label>
              <input id="product-itemcode" value={productForm.itemCode} onChange={(event) => setProductForm((current) => ({ ...current, itemCode: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="product-price">Price</label>
              <input id="product-price" value={productForm.price} onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="product-category">Category ID</label>
              <input id="product-category" type="number" value={productForm.categoryId} onChange={(event) => setProductForm((current) => ({ ...current, categoryId: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="product-size">Size</label>
              <input id="product-size" value={productForm.size} onChange={(event) => setProductForm((current) => ({ ...current, size: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="product-description">Description</label>
              <textarea id="product-description" rows={4} value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={productForm.inStock} onChange={(event) => setProductForm((current) => ({ ...current, inStock: event.target.checked }))} />
              In Stock
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={productForm.isBestSeller} onChange={(event) => setProductForm((current) => ({ ...current, isBestSeller: event.target.checked }))} />
              Best Seller
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={productForm.subscriptionAvailable} onChange={(event) => setProductForm((current) => ({ ...current, subscriptionAvailable: event.target.checked }))} />
              Subscription Available
            </label>
          </div>

          <button type="submit" disabled={productSaving} className="mt-5 h-11 rounded-md bg-cyan-400 px-5 text-[14px] font-semibold text-slate-900 hover:bg-cyan-300 disabled:bg-slate-500">
            {productSaving ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </div>
    </section>
  )

  const renderSiteConfigPanel = () => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      {renderPanelTitle('Site Settings', 'Edit homepage text and contact details.', <button type="button" onClick={() => void loadSiteConfig()} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">Load Settings</button>)}
      {siteConfigError ? <p className="mt-4 text-sm text-red-600">{siteConfigError}</p> : null}
      {siteConfigMessage ? <p className="mt-4 text-sm text-emerald-600">{siteConfigMessage}</p> : null}

      {siteConfig ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Current values</p>
          <p className="mt-2">Hero title: {siteConfig.heroTitle}</p>
          <p>Hero subtitle: {siteConfig.heroSubTitle}</p>
          <p>Contact email: {siteConfig.contactEmail}</p>
          <p>Contact phone: {siteConfig.contactPhone}</p>
        </div>
      ) : null}

      <form onSubmit={saveSiteConfig} className="mt-5 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-700" htmlFor="hero-title">Hero Title</label>
          <input id="hero-title" value={siteConfigForm.heroTitle} onChange={(event) => setSiteConfigForm((current) => ({ ...current, heroTitle: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-700" htmlFor="hero-subtitle">Hero Subtitle</label>
          <input id="hero-subtitle" value={siteConfigForm.heroSubTitle} onChange={(event) => setSiteConfigForm((current) => ({ ...current, heroSubTitle: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-700" htmlFor="hero-cta1">Button 1</label>
          <input id="hero-cta1" value={siteConfigForm.heroCTA1} onChange={(event) => setSiteConfigForm((current) => ({ ...current, heroCTA1: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-700" htmlFor="hero-cta2">Button 2</label>
          <input id="hero-cta2" value={siteConfigForm.heroCTA2} onChange={(event) => setSiteConfigForm((current) => ({ ...current, heroCTA2: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-700" htmlFor="contact-email">Contact Email</label>
          <input id="contact-email" value={siteConfigForm.contactEmail} onChange={(event) => setSiteConfigForm((current) => ({ ...current, contactEmail: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-700" htmlFor="contact-phone">Contact Phone</label>
          <input id="contact-phone" value={siteConfigForm.contactPhone} onChange={(event) => setSiteConfigForm((current) => ({ ...current, contactPhone: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
        </div>
        <div className="md:col-span-2">
          <button type="submit" disabled={siteConfigSaving} className="h-11 rounded-md bg-cyan-400 px-5 text-[14px] font-semibold text-slate-900 hover:bg-cyan-300 disabled:bg-slate-500">
            {siteConfigSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </section>
  )

  const renderOrderPanel = () => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      {renderPanelTitle('Orders', 'Choose an order and adjust status or payment fields.', <button type="button" onClick={() => void loadOrders()} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">{orderLoading ? 'Loading...' : 'Load Orders'}</button>)}
      {orderError ? <p className="mt-4 text-sm text-red-600">{orderError}</p> : null}
      {orderMessage ? <p className="mt-4 text-sm text-emerald-600">{orderMessage}</p> : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="max-h-130 space-y-2 overflow-auto pr-1">
            {orders.map((order) => (
              (() => {
                const orderData = order as unknown as Record<string, unknown>

                return (
              <button key={order.id} type="button" onClick={() => onSelectOrder(order.id)} className={`block w-full rounded-lg border px-3 py-2 text-left text-sm ${selectedOrderId === order.id ? 'border-cyan-500 bg-cyan-50 text-slate-900' : 'border-slate-200 bg-white text-slate-700'}`}>
                <div className="font-semibold">Order #{order.id}</div>
                <div className="text-xs text-slate-500">{formatValue(orderData.customerName ?? order.recipientName)} • {formatValue(orderData.status)} • {formatValue(orderData.paymentStatus)}</div>
              </button>
                )
              })()
            ))}
          </div>
        </div>

        <form onSubmit={saveOrder} className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="order-status">Status</label>
              <select id="order-status" value={orderForm.status} onChange={(event) => setOrderForm((current) => ({ ...current, status: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">
                {['pending', 'authorized', 'paid', 'awaiting_recipient', 'recipient_accepted', 'processing', 'out_for_delivery', 'delivered', 'cancelled', 'expired'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="order-payment-status">Payment Status</label>
              <select id="order-payment-status" value={orderForm.paymentStatus} onChange={(event) => setOrderForm((current) => ({ ...current, paymentStatus: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">
                {['unpaid', 'authorized', 'paid', 'refunded', 'voided'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="order-delivery-mode">Delivery Mode</label>
              <select id="order-delivery-mode" value={orderForm.deliveryMode} onChange={(event) => setOrderForm((current) => ({ ...current, deliveryMode: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">
                {['recipient-provides', 'sender-provides', 'social-media'].map((mode) => <option key={mode} value={mode}>{mode}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="order-country">Country</label>
              <select id="order-country" value={orderForm.country} onChange={(event) => setOrderForm((current) => ({ ...current, country: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">
                <option value="US">US</option>
                <option value="CA">CA</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="order-currency">Currency</label>
              <select id="order-currency" value={orderForm.currency} onChange={(event) => setOrderForm((current) => ({ ...current, currency: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="order-delivery-date">Delivery Date</label>
              <input id="order-delivery-date" type="date" value={orderForm.deliveryDate} onChange={(event) => setOrderForm((current) => ({ ...current, deliveryDate: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="order-delivery-address">Delivery Address</label>
              <input id="order-delivery-address" value={orderForm.deliveryAddress} onChange={(event) => setOrderForm((current) => ({ ...current, deliveryAddress: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="order-credits">Credits Used</label>
              <input id="order-credits" type="number" value={orderForm.creditsUsed} onChange={(event) => setOrderForm((current) => ({ ...current, creditsUsed: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={orderForm.isSubscription} onChange={(event) => setOrderForm((current) => ({ ...current, isSubscription: event.target.checked }))} /> Subscription</label>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={orderForm.isRecipientChoice} onChange={(event) => setOrderForm((current) => ({ ...current, isRecipientChoice: event.target.checked }))} /> Recipient Choice</label>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="order-subscription-frequency">Subscription Frequency</label>
              <select id="order-subscription-frequency" value={orderForm.subscriptionFrequency} onChange={(event) => setOrderForm((current) => ({ ...current, subscriptionFrequency: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">
                <option value="">None</option>
                <option value="weekly">weekly</option>
                <option value="biweekly">biweekly</option>
                <option value="monthly">monthly</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={orderSaving} className="mt-5 h-11 rounded-md bg-cyan-400 px-5 text-[14px] font-semibold text-slate-900 hover:bg-cyan-300 disabled:bg-slate-500">
            {orderSaving ? 'Saving...' : 'Save Order'}
          </button>
        </form>
      </div>
    </section>
  )

  const renderCategoryPanel = () => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      {renderPanelTitle('Categories', 'Rename categories and change display order from a simple form.', <button type="button" onClick={() => void loadCategories()} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">{categoryLoading ? 'Loading...' : 'Load Categories'}</button>)}
      {categoryError ? <p className="mt-4 text-sm text-red-600">{categoryError}</p> : null}
      {categoryMessage ? <p className="mt-4 text-sm text-emerald-600">{categoryMessage}</p> : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="max-h-130 space-y-2 overflow-auto pr-1">
            {categories.map((category) => (
              <button key={category.id} type="button" onClick={() => onSelectCategory(category.id)} className={`block w-full rounded-lg border px-3 py-2 text-left text-sm ${selectedCategoryId === category.id ? 'border-cyan-500 bg-cyan-50 text-slate-900' : 'border-slate-200 bg-white text-slate-700'}`}>
                <div className="font-semibold">{category.name}</div>
                <div className="text-xs text-slate-500">{category.slug} • order {category.displayOrder}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={saveCategory} className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="category-name">Name</label>
              <input id="category-name" value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="category-icon">Icon</label>
              <input id="category-icon" value={categoryForm.icon} onChange={(event) => setCategoryForm((current) => ({ ...current, icon: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="category-order">Display Order</label>
              <input id="category-order" type="number" value={categoryForm.displayOrder} onChange={(event) => setCategoryForm((current) => ({ ...current, displayOrder: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="category-parent">Parent ID</label>
              <input id="category-parent" type="number" value={categoryForm.parentId} onChange={(event) => setCategoryForm((current) => ({ ...current, parentId: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-700" htmlFor="category-description">Description</label>
              <textarea id="category-description" rows={4} value={categoryForm.description} onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={categoryForm.isActive} onChange={(event) => setCategoryForm((current) => ({ ...current, isActive: event.target.checked }))} />
            Active
          </label>

          <button type="submit" disabled={categorySaving} className="mt-5 h-11 rounded-md bg-cyan-400 px-5 text-[14px] font-semibold text-slate-900 hover:bg-cyan-300 disabled:bg-slate-500">
            {categorySaving ? 'Saving...' : 'Save Category'}
          </button>
        </form>
      </div>
    </section>
  )

  const renderBlogPanel = () => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      {renderPanelTitle('Blogs', 'Write or update blog posts from a plain form.', <button type="button" onClick={() => void loadBlogs()} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">{blogLoading ? 'Loading...' : 'Load Blogs'}</button>)}
      {blogError ? <p className="mt-4 text-sm text-red-600">{blogError}</p> : null}
      {blogMessage ? <p className="mt-4 text-sm text-emerald-600">{blogMessage}</p> : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="max-h-130 space-y-2 overflow-auto pr-1">
            {blogs.map((blog) => (
              <button key={blog.id} type="button" onClick={() => onSelectBlog(blog.id)} className={`block w-full rounded-lg border px-3 py-2 text-left text-sm ${selectedBlogId === blog.id ? 'border-cyan-500 bg-cyan-50 text-slate-900' : 'border-slate-200 bg-white text-slate-700'}`}>
                <div className="font-semibold">{blog.title}</div>
                <div className="text-xs text-slate-500">{blog.isPublished ? 'Published' : 'Draft'} • {blog.slug}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={saveBlog} className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="blog-title">Title</label>
              <input id="blog-title" value={blogForm.title} onChange={(event) => setBlogForm((current) => ({ ...current, title: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="blog-slug">Slug</label>
              <input id="blog-slug" value={blogForm.slug} onChange={(event) => setBlogForm((current) => ({ ...current, slug: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="blog-author">Author</label>
              <input id="blog-author" value={blogForm.author} onChange={(event) => setBlogForm((current) => ({ ...current, author: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="blog-cover">Cover Image</label>
              <input id="blog-cover" value={blogForm.coverImage} onChange={(event) => setBlogForm((current) => ({ ...current, coverImage: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="blog-published-at">Published At</label>
              <input id="blog-published-at" type="date" value={blogForm.publishedAt} onChange={(event) => setBlogForm((current) => ({ ...current, publishedAt: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-700" htmlFor="blog-excerpt">Excerpt</label>
              <textarea id="blog-excerpt" rows={4} value={blogForm.excerpt} onChange={(event) => setBlogForm((current) => ({ ...current, excerpt: event.target.value }))} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-700" htmlFor="blog-content">Content</label>
              <textarea id="blog-content" rows={9} value={blogForm.content} onChange={(event) => setBlogForm((current) => ({ ...current, content: event.target.value }))} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={blogForm.isPublished} onChange={(event) => setBlogForm((current) => ({ ...current, isPublished: event.target.checked }))} />
            Published
          </label>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" disabled={blogSaving} className="h-11 rounded-md bg-slate-900 px-5 text-[14px] font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400">
              {blogSaving ? 'Saving...' : 'Save Blog'}
            </button>
            <button type="button" onClick={() => void toggleBlogPublish()} className="h-11 rounded-md border border-slate-300 bg-white px-5 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">
              Toggle Publish
            </button>
          </div>
        </form>
      </div>
    </section>
  )

  const renderReviewPanel = () => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      {renderPanelTitle('Reviews', 'Moderate customer reviews directly from the list.', <button type="button" onClick={() => void loadReviews()} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">{reviewLoading ? 'Loading...' : 'Load Reviews'}</button>)}
      {reviewError ? <p className="mt-4 text-sm text-red-600">{reviewError}</p> : null}
      {reviewMessage ? <p className="mt-4 text-sm text-emerald-600">{reviewMessage}</p> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review) => (
          (() => {
            const reviewData = review as unknown as Record<string, unknown>

            return (
          <article key={review.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-slate-900">{review.title}</p>
                <p className="mt-1 text-xs text-slate-500">Review #{review.id} • rating {review.rating} • {review.isVerified ? 'verified' : 'unverified'}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs ${reviewData.isApproved ? 'bg-emerald-400/15 text-emerald-200' : 'bg-amber-400/15 text-amber-200'}`}>{reviewData.isApproved ? 'Approved' : 'Pending'}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{review.comment}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void moderateReview(review.id, 'approve')} className="h-9 rounded-md bg-emerald-500 px-3 text-xs font-semibold text-white">Approve</button>
              <button type="button" onClick={() => void moderateReview(review.id, 'reject')} className="h-9 rounded-md bg-amber-400 px-3 text-xs font-semibold text-slate-900">Reject</button>
              <button type="button" onClick={() => void moderateReview(review.id, 'delete')} className="h-9 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 hover:bg-slate-50">Delete</button>
            </div>
          </article>
            )
          })()
        ))}
      </div>
    </section>
  )

  const renderUserPanel = () => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      {renderPanelTitle('Users', 'Toggle customer access without leaving the page.', <button type="button" onClick={() => void loadUsers()} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">{userLoading ? 'Loading...' : 'Load Users'}</button>)}
      {userError ? <p className="mt-4 text-sm text-red-600">{userError}</p> : null}
      {userMessage ? <p className="mt-4 text-sm text-emerald-600">{userMessage}</p> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <article key={user.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[15px] font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
            <p className="mt-1 text-xs text-slate-500">{user.email}</p>
            <p className="mt-2 text-sm text-slate-700">Status: {user.isActive ? 'Active' : 'Inactive'}</p>
            <button type="button" onClick={() => void toggleUserActive(user.id)} className="mt-4 h-9 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 hover:bg-slate-50">Toggle Active</button>
          </article>
        ))}
      </div>
    </section>
  )

  const renderDeliveryPanel = () => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      {renderPanelTitle('Delivery blackout dates', 'Create or update blackout dates in a normal form.', <button type="button" onClick={() => void loadDeliveryDates()} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">{deliveryLoading ? 'Loading...' : 'Load Dates'}</button>)}
      {deliveryError ? <p className="mt-4 text-sm text-red-600">{deliveryError}</p> : null}
      {deliveryMessage ? <p className="mt-4 text-sm text-emerald-600">{deliveryMessage}</p> : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="max-h-130 space-y-2 overflow-auto pr-1">
            {deliveryItems.map((item) => (
              <button key={String(item.id)} type="button" onClick={() => onSelectDelivery(Number(item.id))} className={`block w-full rounded-lg border px-3 py-2 text-left text-sm ${selectedDeliveryId === Number(item.id) ? 'border-cyan-500 bg-cyan-50 text-slate-900' : 'border-slate-200 bg-white text-slate-700'}`}>
                <div className="font-semibold">{formatValue(item.date)}</div>
                <div className="text-xs text-slate-500">{formatValue(item.reason)} • {formatValue(item.isActive)}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={saveDeliveryDate} className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="delivery-date">Date</label>
              <input id="delivery-date" type="date" value={deliveryForm.date} onChange={(event) => setDeliveryForm((current) => ({ ...current, date: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700" htmlFor="delivery-reason">Reason</label>
              <input id="delivery-reason" value={deliveryForm.reason} onChange={(event) => setDeliveryForm((current) => ({ ...current, reason: event.target.value }))} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={deliveryForm.isActive} onChange={(event) => setDeliveryForm((current) => ({ ...current, isActive: event.target.checked }))} />
            Active
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" disabled={deliverySaving} className="h-11 rounded-md bg-cyan-400 px-5 text-[14px] font-semibold text-slate-900 hover:bg-cyan-300 disabled:bg-slate-500">
              {selectedDeliveryId === '' ? (deliverySaving ? 'Creating...' : 'Create Date') : (deliverySaving ? 'Saving...' : 'Save Date')}
            </button>
            <button type="button" onClick={() => void removeDeliveryDate()} className="h-11 rounded-md border border-slate-300 bg-white px-5 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">
              Delete Selected
            </button>
          </div>
        </form>
      </div>
    </section>
  )

  const renderReadOnlyPanel = () => {
    const fields = readOnlyTaskFields[selectedTask as keyof typeof readOnlyTaskFields] ?? ['id', 'createdAt']

    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
        {renderPanelTitle(
          selectedTaskTitle,
          'This section is shown in a simple list so the admin can understand the data without JSON.',
          <button type="button" onClick={() => void loadOtherTask(selectedTask as Exclude<AdminTask, 'products' | 'orders' | 'categories' | 'blogs' | 'reviews' | 'users' | 'site-config' | 'delivery' | 'advanced'>)} className="h-11 rounded-md border border-slate-600 px-4 text-[14px] font-semibold text-white hover:bg-slate-800">{otherLoading ? 'Loading...' : 'Refresh'}</button>,
        )}
        {otherError ? <p className="mt-4 text-sm text-red-300">{otherError}</p> : null}
        {otherMessage ? <p className="mt-4 text-sm text-green-300">{otherMessage}</p> : null}

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {otherItems.map((item) => (
            <article key={String(item.id ?? JSON.stringify(item).slice(0, 16))} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-2 text-sm text-slate-700">
                {fields.map((field) => (
                  <p key={field}><span className="text-slate-500">{field}:</span> {formatValue(item[field])}</p>
                ))}
              </div>
              {selectedTask === 'media' && item.id ? (
                <button type="button" onClick={() => void approveMedia(Number(item.id))} className="mt-4 h-9 rounded-md bg-emerald-500 px-3 text-xs font-semibold text-white">Approve</button>
              ) : null}
              {selectedTask === 'bouquets' && item.id ? (
                <button type="button" onClick={() => void deleteBouquet(Number(item.id))} className="mt-4 h-9 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 hover:bg-slate-50">Delete</button>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    )
  }

  const renderAdvancedPanel = () => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      <details open={advancedOpen} onToggle={(event) => setAdvancedOpen((event.target as HTMLDetailsElement).open)}>
        <summary className="cursor-pointer list-none text-[24px] font-semibold text-slate-900">Advanced request tool</summary>
        <p className="mt-3 text-[14px] leading-6 text-slate-600">Use this only when you need a raw endpoint call.</p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="endpoint-catalog" className="mb-2 block text-sm text-slate-700">Endpoint template</label>
            <select id="endpoint-catalog" value={selectedEndpoint} onChange={(event) => setSelectedEndpoint(event.target.value)} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">
              {ADMIN_ENDPOINT_CATALOG.map((endpoint) => (<option key={endpoint} value={endpoint}>{endpoint}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="request-method" className="mb-2 block text-sm text-slate-700">Method</label>
            <select id="request-method" value={requestMethod} onChange={(event) => setRequestMethod(event.target.value as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => (<option key={method} value={method}>{method}</option>))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="request-path" className="mb-2 block text-sm text-slate-700">Path</label>
            <input id="request-path" value={requestPath} onChange={(event) => setRequestPath(event.target.value)} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900" />
          </div>
          <div>
            <label htmlFor="request-query" className="mb-2 block text-sm text-slate-700">Query JSON</label>
            <textarea id="request-query" rows={5} value={requestQuery} onChange={(event) => setRequestQuery(event.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900" />
          </div>
          <div>
            <label htmlFor="request-body" className="mb-2 block text-sm text-slate-700">Body JSON</label>
            <textarea id="request-body" rows={5} value={requestBody} onChange={(event) => setRequestBody(event.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => void sendRequest()} disabled={isSending} className="h-11 rounded-md bg-slate-900 px-4 text-[14px] font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400">
            {isSending ? 'Sending...' : 'Send Request'}
          </button>
          <button type="button" onClick={() => { setRequestBody('{}'); setRequestQuery('{}'); setResponsePayload(''); setResponseStatus(null); }} className="h-11 rounded-md border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">
            Clear
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.08em] text-slate-600">Response {responseStatus ? `- ${responseStatus}` : ''}</p>
          <pre className="max-h-130 overflow-auto whitespace-pre-wrap font-mono text-xs text-slate-800">{responsePayload || 'No response yet.'}</pre>
        </div>
      </details>
    </section>
  )

  if (loading) {
    return <div className="p-8 text-center text-[18px] text-[#586274]">Loading admin dashboard...</div>
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 text-slate-900 md:px-8 md:py-8" data-testid="admin-dashboard">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">Admin Control Center</p>
              <h1 className="mt-2 text-[34px] font-semibold md:text-[40px]">Welcome, Admin</h1>
              <p className="mt-2 text-[14px] text-slate-600">Signed in as {admin?.email ?? 'loading...'}{admin?.role ? ` (${admin.role})` : ''}</p>
              <p className="mt-2 max-w-3xl text-[15px] leading-7 text-slate-600">
                Use the cards below to open a real form or a real list. Product edits, order updates, category changes, blog editing, and site settings all use normal controls.
              </p>
            </div>

            <button type="button" onClick={signOut} className="h-10 rounded-md border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 hover:bg-slate-50">
              Sign Out
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Users</p><p className="mt-1 text-2xl font-semibold text-slate-900">{stats?.totalUsers ?? '—'}</p></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Active</p><p className="mt-1 text-2xl font-semibold text-slate-900">{stats?.activeUsers ?? '—'}</p></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Orders</p><p className="mt-1 text-2xl font-semibold text-slate-900">{stats?.totalOrders ?? '—'}</p></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Pending</p><p className="mt-1 text-2xl font-semibold text-slate-900">{stats?.pendingOrders ?? '—'}</p></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Revenue</p><p className="mt-1 text-2xl font-semibold text-slate-900">{stats?.totalRevenue ?? '—'}</p></div>
          </div>
        </header>

        {errorMessage ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div> : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <h2 className="text-[24px] font-semibold text-slate-900">How to use this panel</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {['1. Choose a card.', '2. Use the normal form.', '3. Edit the field you need.', '4. Click Save.'].map((step) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[14px] text-slate-700">{step}</div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[24px] font-semibold text-slate-900">Admin Tasks</h2>
              <p className="text-[14px] text-slate-600">The selected task opens a direct form or a readable list. No JSON is needed for the normal path.</p>
            </div>
            <p className="text-[13px] text-slate-500">Selected: {selectedTaskTitle}</p>
          </div>

          <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-[14px] text-cyan-900">
            {lastRunMessage}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {taskCards.map((card) => renderTaskCard(card))}
          </div>
        </section>

        {selectedTask === 'products' ? renderProductPanel() : null}
        {selectedTask === 'site-config' ? renderSiteConfigPanel() : null}
        {selectedTask === 'orders' ? renderOrderPanel() : null}
        {selectedTask === 'categories' ? renderCategoryPanel() : null}
        {selectedTask === 'blogs' ? renderBlogPanel() : null}
        {selectedTask === 'reviews' ? renderReviewPanel() : null}
        {selectedTask === 'users' ? renderUserPanel() : null}
        {selectedTask === 'delivery' ? renderDeliveryPanel() : null}
        {['notifications', 'payments', 'subscriptions', 'media', 'bouquets', 'credits'].includes(selectedTask) ? renderReadOnlyPanel() : null}

        {renderAdvancedPanel()}
      </div>
    </main>
  )
}

AdminDashboardWorkspace.displayName = 'AdminDashboardWorkspace'
export default AdminDashboardWorkspace
