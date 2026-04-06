import { describe, it, expect } from 'vitest'
import { formatPrice } from '../formatPrice.ts'

describe('formatPrice', () => {
  it('formats a number as USD currency', () => {
    expect(formatPrice(49.99)).toBe('$49.99')
  })

  it('formats a string price correctly', () => {
    expect(formatPrice('79.99')).toBe('$79.99')
  })

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('adds two decimal places', () => {
    expect(formatPrice(50)).toBe('$50.00')
  })
})