import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../HomePage'

vi.mock('@/api/products', () => ({
  productService: {
    getBestSellers: vi.fn().mockResolvedValue({
      items: [
        {
          id: 1,
          name: 'Precious Heart Bouquet',
          slug: 'precious-heart-bouquet',
          itemCode: 'C15-4790',
          price: '115.00',
          description: null,
          image: ['https://cdn.socialflowers.com/fit-in/400x400/hero-image/sf-hero-transparent.png'],
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
      limit: 12,
      totalPages: 1,
    }),
  },
}))

describe('HomePage contract with socialflowers main page', () => {
  const renderHomePage = async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Wait for async homepage effects (featured products load) to settle.
    await screen.findByRole('heading', { name: 'Our Bestsellers' })
  }

  it('renders the exact hero headline and primary CTA copy', async () => {
    await renderHomePage()

    expect(screen.getByRole('heading', { name: 'Send Flowers Without Knowing Their Address' })).toBeInTheDocument()
    expect(screen.getByText('A connection to remember: Fresh flower delivery using email, mobile or social media.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Shop Now' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Learn More' })).toBeInTheDocument()
  })

  it('renders all homepage anchor sections including FlowerMe Society section', async () => {
    await renderHomePage()

    expect(screen.getByRole('heading', { name: 'How Social Flowers Works' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The Benefits of the Social Flowers Solution' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Send Flowers Easily With Custom Bouquets' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The FlowerMe Society is Here!' })).toBeInTheDocument()
  })

  it('matches benefits column headers from live site copy', async () => {
    await renderHomePage()

    expect(screen.getByRole('heading', { name: 'For Everyone' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'For the Sender' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'For the Recipient' })).toBeInTheDocument()
  })

  it('contains full footer taxonomy links seen on live homepage', async () => {
    await renderHomePage()

    expect(screen.getByRole('link', { name: 'Pay With Crypto' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Anonymous Flower Delivery' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'FlowerMe Society' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Local Florist Delivery' })).toBeInTheDocument()
  })

  it('matches live homepage section order', async () => {
    await renderHomePage()

    const flowerMe = screen.getByRole('heading', { name: 'The FlowerMe Society is Here!' })
    const custom = screen.getByRole('heading', { name: 'Send Flowers Easily With Custom Bouquets' })
    const howItWorks = screen.getByRole('heading', { name: 'How Social Flowers Works' })
    const benefits = screen.getByRole('heading', { name: 'The Benefits of the Social Flowers Solution' })

    const flowerMePos = flowerMe.compareDocumentPosition(custom)
    const customPos = custom.compareDocumentPosition(howItWorks)
    const howPos = howItWorks.compareDocumentPosition(benefits)

    expect(flowerMePos & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(customPos & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(howPos & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('matches live USES labels and excludes non-live newsletter block', async () => {
    await renderHomePage()

    expect(screen.getByRole('link', { name: 'In the Workplace' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'To a Hospital' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'To a Funeral Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'To a Hotel' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'From Overseas' })).toBeInTheDocument()

    expect(screen.queryByRole('heading', { name: 'Stay Updated' })).not.toBeInTheDocument()
  })

  it('does not render extra non-live helper blocks', async () => {
    await renderHomePage()

    expect(screen.queryByText('Trusted by flower enthusiasts worldwide')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Why Social Flowers is Different' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'View All Custom Options' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Learn More Details' })).not.toBeInTheDocument()
  })

  it('contains sign-in navigation link and popular cities footer copy', async () => {
    await renderHomePage()

    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByText(/Popular Cities:/i)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Local Florist Delivery' }).length).toBeGreaterThan(0)
  })
})
