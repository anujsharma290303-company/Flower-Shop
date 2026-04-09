import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'

vi.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: 1, name: 'Roses', slug: 'roses' },
      { id: 2, name: 'Birthday', slug: 'birthday' },
    ],
  }),
}))

describe('Navigation', () => {
  it('shows backend-driven category links in shop dropdown', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    )

    const shopLink = screen.getAllByRole('link', { name: 'Shop' })[0]
    fireEvent.mouseEnter(shopLink.parentElement as HTMLElement)

    expect(screen.getByRole('link', { name: 'Best Sellers' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Roses' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Birthday' })).toBeInTheDocument()
  })

  it('shows backend categories in mobile menu', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    )

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])

    expect(screen.getByRole('link', { name: 'Roses' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Birthday' })).toBeInTheDocument()
  })
})
