import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { authService } from '@/api/auth'
import { adminService } from '@/api/admin'
import { VALIDATION } from '@/utils/constants'

type SignInLocationState = {
  notice?: string
  from?: string
}

const SignInPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state || {}) as SignInLocationState

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    const normalizedEmail = email.trim()

    if (!VALIDATION.EMAIL_REGEX.test(normalizedEmail)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    try {
      setIsSubmitting(true)

      // First try customer login for normal storefront users.
      const customerResult = await authService.login({
        email: normalizedEmail,
        password,
      })

      adminService.clearSession()
      authService.saveSession(customerResult.token, customerResult.user)

      if (locationState.from) {
        navigate(locationState.from)
      } else {
        navigate('/my-profile')
      }
      return
    } catch (customerError: unknown) {
      try {
        // Fallback: if same credentials are an admin account, open admin dashboard.
        const adminResult = await adminService.login({
          email: normalizedEmail,
          password,
        })

        authService.clearSession()
        adminService.saveSession(adminResult.token, adminResult.admin)
        navigate('/admin/dashboard')
        return
      } catch (adminError: unknown) {
        const adminMessage =
          typeof adminError === 'object' &&
          adminError !== null &&
          'response' in adminError &&
          typeof (adminError as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
            ? (adminError as { response: { data: { message: string } } }).response.data.message
            : null

        const customerMessage =
          typeof customerError === 'object' &&
          customerError !== null &&
          'response' in customerError &&
          typeof (customerError as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
            ? (customerError as { response: { data: { message: string } } }).response.data.message
            : null

        setErrorMessage(adminMessage || customerMessage || 'Unable to sign in. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-95">
          <h1 className="mb-7 text-center font-serif text-[48px] text-[#262b33]">Sign In</h1>

          {locationState.notice ? (
            <p className="mb-5 rounded border border-[#e9b0b2] bg-[#fff1f1] px-4 py-3 text-[15px] text-[#8c2126]">
              {locationState.notice}
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="signin-email" className="mb-2 block text-[18px] font-medium text-[#2f3743]">
                Email Address <span className="text-[#cc262b]">*</span>
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full border border-[#e1e1e1] bg-white px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="signin-password" className="mb-2 block text-[18px] font-medium text-[#2f3743]">
                Password <span className="text-[#cc262b]">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 flex-1 border border-[#e1e1e1] bg-white px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="h-12 px-3 text-[14px] text-[#4b5563] hover:text-[#c82a2f]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {errorMessage ? <p className="text-[15px] text-[#c82a2f]">{errorMessage}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 h-12 w-full bg-[#cf0000] text-[26px] font-semibold text-white transition-colors hover:bg-[#b70000] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-4 text-center text-[30px] leading-none text-[#c82a2f]">
            <a href="mailto:contact@socialflowers.com" className="hover:underline">
              Forgot password?
            </a>
            <Link to="/create-account" className="block hover:underline">
              Create a account
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

SignInPage.displayName = 'SignInPage'
export default SignInPage
