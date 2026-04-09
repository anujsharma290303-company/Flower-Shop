import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ShopPage from '@/pages/ShopPage'

vi.mock('@/components/layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const getAllMock = vi.fn()
const getBySlugMock = vi.fn()

vi.mock('@/api/products', () => ({
  productService: {
    getAll: (...args: unknown[]) => getAllMock(...args),
  },
}))

vi.mock('@/api/categories', () => ({
  categoryService: {
    getBySlug: (...args: unknown[]) => getBySlugMock(...args),
  },
}))

describe('ShopPage', () => {
  beforeEach(() => {
    getAllMock.mockReset()
    getBySlugMock.mockReset()
  })

  it('loads and renders backend products on /shop', async () => {
    getAllMock.mockResolvedValueOnce({
      items: [
        {
          id: 1,
          name: 'Classic Red Roses',
          slug: 'classic-red-roses',
          itemCode: 'C15-4790',
          price: '49.99',
          description: null,
          image: ['https://cdn.floristone.com/large/C15-4790_d1.jpg'],
          size: null,
          categoryId: 1,
          isBestSeller: true,
          inStock: true,
          subscriptionAvailable: false,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      totalItems: 1,
      page: 1,
      limit: 24,
      totalPages: 1,
    })

    render(
      <MemoryRouter initialEntries={['/shop']}>
        <Routes>
          <Route path="/shop" element={<ShopPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Loading products...')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Shop Flowers' })).toBeInTheDocument()
    expect(screen.getByText('Classic Red Roses')).toBeInTheDocument()
    expect(getAllMock).toHaveBeenCalledWith({ limit: 24 })
  })

  it('loads category products on /shop/:slug from backend category id', async () => {
    getBySlugMock.mockResolvedValueOnce({
      id: 12,
      name: 'Roses',
      slug: 'roses',
    })

    getAllMock.mockResolvedValueOnce({
      items: [],
      totalItems: 0,
      page: 1,
      limit: 24,
      totalPages: 1,
    })

    render(
      <MemoryRouter initialEntries={['/shop/roses']}>
        <Routes>
          <Route path="/shop/:slug" element={<ShopPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Roses' })).toBeInTheDocument()
    expect(getBySlugMock).toHaveBeenCalledWith('roses')
    expect(getAllMock).toHaveBeenCalledWith({ category: '12', limit: 24 })
  })

  it('shows empty state when backend returns no products', async () => {
    getAllMock.mockResolvedValueOnce({
      items: [],
      totalItems: 0,
      page: 1,
      limit: 24,
      totalPages: 1,
    })

    render(
      <MemoryRouter initialEntries={['/shop']}>
        <Routes>
          <Route path="/shop" element={<ShopPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('No products found.')).toBeInTheDocument()
  })
})
