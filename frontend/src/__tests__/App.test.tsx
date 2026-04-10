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
})