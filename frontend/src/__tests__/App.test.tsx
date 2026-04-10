import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

vi.mock('@/api/products', () => ({
  productService: {
    getAll: vi.fn().mockResolvedValue({
      items: [],
      totalItems: 0,
      page: 1,
      limit: 24,
      totalPages: 1,
    }),
    getByItemCode: vi.fn().mockResolvedValue({
      id: 1,
      name: 'Precious Heart Bouquet',
      slug: 'precious-heart-bouquet',
      itemCode: 'C15-4790',
      price: '115.00',
      description: 'A stunning handcrafted bouquet.',
      image: ['https://cdn.floristone.com/large/C15-4790_d1.jpg'],
      size: '11"w x 15"h',
      categoryId: 1,
      isBestSeller: true,
      inStock: true,
      subscriptionAvailable: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }),
    getBestSellers: vi.fn().mockResolvedValue({
      items: [],
      totalItems: 0,
      page: 1,
      limit: 12,
      totalPages: 1,
    }),
  },
}))

vi.mock('@/api/site-config', () => ({
  siteConfigService: {
    get: vi.fn().mockResolvedValue(null),
  },
}))

vi.mock('@/api/categories', () => ({
  categoryService: {
    getBySlug: vi.fn().mockResolvedValue({
      id: 1,
      name: 'Roses',
      slug: 'roses',
      description: null,
      icon: null,
      image: null,
      displayOrder: 1,
      isActive: true,
      parentId: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }),
    getTopLevel: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('@/api/faqs', () => ({
  faqService: {
    getAll: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('@/api/reviews', () => ({
  reviewService: {
    getAll: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('@/api/auth', () => ({
  authService: {
    isLoggedIn: vi.fn().mockReturnValue(false),
    getMe: vi.fn(),
    updateMe: vi.fn(),
    changePassword: vi.fn(),
    getMyOrders: vi.fn(),
    getMyOrderById: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    saveSession: vi.fn(),
    clearSession: vi.fn(),
  },
}))

vi.mock('@/api/blogs', () => ({
  blogService: {
    getAll: vi.fn().mockResolvedValue([
      {
        id: 1,
        title: 'Flower Care Basics',
        slug: 'flower-care-basics',
        excerpt: 'Tips to keep your flowers fresh longer.',
        content: 'Simple watering and trimming habits help your flowers last.',
        coverImage: null,
        author: 'Social Flowers Team',
        isPublished: true,
        publishedAt: '2026-01-01T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]),
    getBySlug: vi.fn().mockResolvedValue({
      id: 1,
      title: 'Flower Care Basics',
      slug: 'flower-care-basics',
      excerpt: 'Tips to keep your flowers fresh longer.',
      content: 'Simple watering and trimming habits help your flowers last.',
      coverImage: null,
      author: 'Social Flowers Team',
      isPublished: true,
      publishedAt: '2026-01-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }),
  },
}))

vi.mock('@/api/flowerme', () => ({
  flowerMeService: {
    getMine: vi.fn().mockResolvedValue({
      id: 1,
      userId: 1,
      slug: 'rose-queen',
      displayName: 'Rose Queen',
      tagline: 'Petal collector',
      photoUrl: null,
      socialLink: null,
      followersCount: 140,
      tier: 'socialite',
      wishlistNotes: 'Peonies and ranunculus',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }),
    getBySlug: vi.fn().mockResolvedValue({
      slug: 'rose-queen',
      displayName: 'Rose Queen',
      tagline: 'Petal collector',
      photoUrl: null,
      socialLink: null,
      followersCount: 140,
      tier: 'socialite',
      wishlistNotes: 'Peonies and ranunculus',
    }),
    upsertMine: vi.fn(),
  },
}))

vi.mock('@/api/admin', () => ({
  ADMIN_ENDPOINT_CATALOG: ['GET /admin/dashboard/stats'],
  adminService: {
    login: vi.fn(),
    me: vi.fn(),
    getDashboardStats: vi.fn(),
    request: vi.fn(),
    saveSession: vi.fn(),
    clearSession: vi.fn(),
    isLoggedIn: vi.fn().mockReturnValue(false),
  },
}))

describe('App routing', () => {
  it('renders homepage on / route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    await screen.findByRole('heading', { name: 'Our Bestsellers' })
    expect(screen.getByTestId('homepage')).toBeInTheDocument()
  })

  it('renders best sellers page on /best-sellers route', async () => {
    render(
      <MemoryRouter initialEntries={['/best-sellers']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'Our Bestsellers' })
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  it('renders shop page on /shop route', async () => {
    render(
      <MemoryRouter initialEntries={['/shop']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'Shop Flowers' })
  })

  it('renders category shop page on /shop/:slug route', async () => {
    render(
      <MemoryRouter initialEntries={['/shop/roses']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'Roses' })
  })

  it('renders how-it-works page on /how-it-works route', async () => {
    render(
      <MemoryRouter initialEntries={['/how-it-works']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'How Social Flowers Works', level: 1 })
    expect(screen.getByRole('link', { name: 'Start Shopping' })).toBeInTheDocument()
  })

  it('renders about page on /about route', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'About', level: 1 })
    expect(screen.getByRole('heading', { name: 'Decades of Experience' })).toBeInTheDocument()
  })

  it('renders reviews page on /reviews route', async () => {
    render(
      <MemoryRouter initialEntries={['/reviews']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'What People Say - Reviews of Social Flowers' })
    expect(screen.getByText(/earn up to \$50 on a future order\./i)).toBeInTheDocument()
  })

  it('renders faq page on /faq route', async () => {
    render(
      <MemoryRouter initialEntries={['/faq']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'Frequently Asked Questions' })
    expect(screen.getByText('GENERAL')).toBeInTheDocument()
    expect(screen.getByText('SENDER')).toBeInTheDocument()
    expect(screen.getByText('RECIPIENT')).toBeInTheDocument()
  })

  it('renders sign in page on /sign-in route', () => {
    render(
      <MemoryRouter initialEntries={['/sign-in']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('renders create account page on /create-account route', () => {
    render(
      <MemoryRouter initialEntries={['/create-account']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('renders blog page on /blog route', async () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'Blog' })
    expect(screen.getByText('Flower Care Basics')).toBeInTheDocument()
  })

  it('renders blog detail page on /blog/:slug route', async () => {
    render(
      <MemoryRouter initialEntries={['/blog/flower-care-basics']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'Flower Care Basics' })
    expect(screen.getByText('Tips to keep your flowers fresh longer.')).toBeInTheDocument()
  })

  it('renders flowerme public profile on /flowerme/profile/:slug route', async () => {
    render(
      <MemoryRouter initialEntries={['/flowerme/profile/rose-queen']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'Rose Queen' })
    expect(screen.getByText('Petal collector')).toBeInTheDocument()
  })

  it('renders sign in page on /flowerme/profile route when logged out', () => {
    render(
      <MemoryRouter initialEntries={['/flowerme/profile']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('renders my profile page on /my-profile route', () => {
    render(
      <MemoryRouter initialEntries={['/my-profile']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('renders my orders page on /my-orders route', () => {
    render(
      <MemoryRouter initialEntries={['/my-orders']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('renders my order detail page on /my-orders/:id route', () => {
    render(
      <MemoryRouter initialEntries={['/my-orders/1']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('renders product detail page on /item/:itemCode/:slug route', async () => {
    render(
      <MemoryRouter initialEntries={['/item/C15-4790/precious-heart-bouquet']}>
        <App />
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'Precious Heart Bouquet' })
    expect(screen.getByText('$115.00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buy Now' })).toBeInTheDocument()
  })

  it('renders 404 page on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })

  it('renders admin login on /admin/login route', () => {
    render(
      <MemoryRouter initialEntries={['/admin/login']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByTestId('admin-login')).toBeInTheDocument()
  })

  it('renders admin login on /admin/dashboard route when logged out', () => {
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Admin Login' })).toBeInTheDocument()
  })
})