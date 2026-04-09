/**
 * Newsletter Signup Section
 * Email capture for newsletter subscription
 */

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { VALIDATION } from '@/utils/constants'
import toast from 'react-hot-toast'

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate email
    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      // TODO: Call API endpoint to subscribe
      // const response = await newsletterService.subscribe(email)
      
      // Mock success for now
      setTimeout(() => {
        toast.success('Thanks for subscribing!')
        setEmail('')
        setLoading(false)
      }, 500)
    } catch {
      setError('Failed to subscribe. Please try again.')
      setLoading(false)
      toast.error('Failed to subscribe')
    }
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-linear-to-r from-red-50 to-pink-50">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Stay Updated
        </h2>

        <p className="text-lg text-gray-600 mb-8">
          Subscribe to our newsletter for exclusive offers, new flower designs, and flower care tips delivered to your inbox.
        </p>

        {/* Newsletter Form */}
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={setEmail}
              error={error || undefined}
              disabled={loading}
              className="h-12"
            />
          </div>

          <Button
            label="Subscribe"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={loading}
            className="sm:shrink-0 h-12"
          />
        </form>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
          <a href="/privacy" className="text-red-600 hover:underline ml-1">
            Read our privacy policy.
          </a>
        </p>

        {/* Social Proof */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-600 mb-4 font-medium">
            Join 5,000+ subscribers getting special offers weekly
          </p>

          {/* Avatar Group (optional) */}
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold"
              >
                {i + 1}
              </div>
            ))}
            <span className="text-sm text-gray-600 self-center ml-2">+4,995 more</span>
          </div>
        </div>
      </div>
    </section>
  )
}

NewsletterSignup.displayName = 'NewsletterSignup'
export default NewsletterSignup
