import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { authService } from '@/api/auth'
import { VALIDATION } from '@/utils/constants'

const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setErrorMessage('First name and last name must be at least 2 characters long.')
      return
    }

    if (!VALIDATION.EMAIL_REGEX.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    try {
      setIsSubmitting(true)
      await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      })

      const loginResult = await authService.login({
        email: email.trim(),
        password,
      })
      authService.saveSession(loginResult.token, loginResult.user)
      navigate('/my-profile')
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Unable to create account. Please try again.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-125">
          <h1 className="mb-7 text-center font-serif text-[44px] text-[#262b33]">Create Account</h1>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="register-first-name" className="mb-2 block text-[18px] font-medium text-[#2f3743]">
                  First Name <span className="text-[#cc262b]">*</span>
                </label>
                <input
                  id="register-first-name"
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="h-12 w-full border border-[#e1e1e1] bg-white px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div>
                <label htmlFor="register-last-name" className="mb-2 block text-[18px] font-medium text-[#2f3743]">
                  Last Name <span className="text-[#cc262b]">*</span>
                </label>
                <input
                  id="register-last-name"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="h-12 w-full border border-[#e1e1e1] bg-white px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="mb-2 block text-[18px] font-medium text-[#2f3743]">
                Email Address <span className="text-[#cc262b]">*</span>
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full border border-[#e1e1e1] bg-white px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                autoComplete="email"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="register-password" className="mb-2 block text-[18px] font-medium text-[#2f3743]">
                  Password <span className="text-[#cc262b]">*</span>
                </label>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full border border-[#e1e1e1] bg-white px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="mb-2 block text-[18px] font-medium text-[#2f3743]">
                  Confirm Password <span className="text-[#cc262b]">*</span>
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-12 w-full border border-[#e1e1e1] bg-white px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {errorMessage ? <p className="text-[15px] text-[#c82a2f]">{errorMessage}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 h-12 w-full bg-[#cf0000] text-[24px] font-semibold text-white transition-colors hover:bg-[#b70000] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-[20px] text-[#4b5563]">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-[#c82a2f] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  )
}

CreateAccountPage.displayName = 'CreateAccountPage'
export default CreateAccountPage
