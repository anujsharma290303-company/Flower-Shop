import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

vi.mock('@/api/products', () => ({
  productService: {
    getBestSellers: vi.fn().mockResolvedValue({
      items: [],
      totalItems: 0,
      page: 1,
      limit: 12,
      totalPages: 1,
    }),
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