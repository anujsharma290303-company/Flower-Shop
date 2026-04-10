import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import { authService } from '@/api/auth'

vi.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: 1, name: 'Roses', slug: 'roses' },
      { id: 2, name: 'Birthday', slug: 'birthday' },
    ],
  }),
}))

vi.mock('@/api/auth', () => ({
  authService: {
    isLoggedIn: vi.fn(() => false),
    clearSession: vi.fn(),
  },
}))

describe('Navigation', () => {
  it('shows sign in in mobile menu when logged out', () => {
    vi.mocked(authService.isLoggedIn).mockReturnValue(false)

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    )

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])

    expect(screen.getAllByRole('link', { name: 'Sign In' }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('link', { name: 'My Orders' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'My FlowerMe' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'My Profile' })).not.toBeInTheDocument()
  })

  it('shows profile and order links when logged in', () => {
    vi.mocked(authService.isLoggedIn).mockReturnValue(true)

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    )

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])

    expect(screen.getByRole('link', { name: 'My Orders' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'My FlowerMe' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument()
  })

  it('shows backend-driven category links in shop dropdown', () => {
    vi.mocked(authService.isLoggedIn).mockReturnValue(false)

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
    vi.mocked(authService.isLoggedIn).mockReturnValue(false)

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
