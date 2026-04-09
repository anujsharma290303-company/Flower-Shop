import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProductDetailPage from '@/pages/ProductDetailPage'

vi.mock('@/components/layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const getByItemCodeMock = vi.fn()

vi.mock('@/api/products', () => ({
  productService: {
    getByItemCode: (...args: unknown[]) => getByItemCodeMock(...args),
  },
}))

describe('ProductDetailPage', () => {
  beforeEach(() => {
    getByItemCodeMock.mockReset()
  })

  it('loads product details from backend by itemCode', async () => {
    getByItemCodeMock.mockResolvedValueOnce({
      id: 1,
      name: 'Precious Heart Bouquet',
      slug: 'precious-heart-bouquet',
      itemCode: 'C15-4790',
      price: '115.00',
      description: 'Brighten her day and make her feel special.',
      image: ['https://cdn.floristone.com/large/C15-4790_d1.jpg'],
      size: '11"w x 15"h',
      categoryId: 1,
      isBestSeller: true,
      inStock: true,
      subscriptionAvailable: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })

    render(
      <MemoryRouter initialEntries={['/item/C15-4790/precious-heart-bouquet']}>
        <Routes>
          <Route path="/item/:itemCode/:slug" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Precious Heart Bouquet' })).toBeInTheDocument()
    expect(screen.getByText('$115.00')).toBeInTheDocument()
    expect(screen.getByText('Item No.')).toBeInTheDocument()
    expect(getByItemCodeMock).toHaveBeenCalledWith('C15-4790')
  })

  it('switches tabs for billing and delivery content', async () => {
    getByItemCodeMock.mockResolvedValueOnce({
      id: 1,
      name: 'Precious Heart Bouquet',
      slug: 'precious-heart-bouquet',
      itemCode: 'C15-4790',
      price: '115.00',
      description: 'Brighten her day and make her feel special.',
      image: ['https://cdn.floristone.com/large/C15-4790_d1.jpg'],
      size: '11"w x 15"h',
      categoryId: 1,
      isBestSeller: true,
      inStock: true,
      subscriptionAvailable: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })

    render(
      <MemoryRouter initialEntries={['/item/C15-4790/precious-heart-bouquet']}>
        <Routes>
          <Route path="/item/:itemCode/:slug" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: 'Precious Heart Bouquet' })

    fireEvent.click(screen.getByRole('button', { name: 'Billing' }))
    expect(screen.getByText(/hold on your credit card/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Delivery' }))
    expect(screen.getByText(/hand-delivered by a local florist/i)).toBeInTheDocument()
  })

  it('shows fallback error state when backend fails', async () => {
    getByItemCodeMock.mockRejectedValueOnce(new Error('Network error'))

    render(
      <MemoryRouter initialEntries={['/item/C15-4790/precious-heart-bouquet']}>
        <Routes>
          <Route path="/item/:itemCode/:slug" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('We could not load this product.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Best Sellers' })).toBeInTheDocument()
  })
})
